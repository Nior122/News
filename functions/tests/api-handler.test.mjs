import assert from "node:assert/strict";
import test from "node:test";
import { handleApiRequest } from "../api/[[path]].mjs";

const ENV = { DATABASE_URL: "local-test-placeholder", ADMIN_PASSWORD: "local-test-admin-secret" };

function request(path, { method = "GET", body, headers } = {}) {
  return new Request(`https://scrolltek.name.ng/api${path}`, {
    method,
    headers: {
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...headers,
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });
}

function database(handler) {
  const calls = [];
  const sql = async (strings, ...values) => {
    const query = strings.join(" ? ");
    calls.push({ query, values });
    return handler({ query, values, calls });
  };
  return { sql, calls };
}

function invokeWithFactory(path, databaseFactory, options = {}, env = ENV) {
  return handleApiRequest({
    request: request(path, options),
    env,
    databaseFactory,
  });
}

function invoke(path, sql, options = {}, env = ENV) {
  return invokeWithFactory(path, () => sql, options, env);
}

test("health checks work without a database and public GET routes do not initialize tables", async () => {
  let factoryCalls = 0;
  const response = await handleApiRequest({
    request: request("/healthz"),
    env: {},
    databaseFactory: () => {
      factoryCalls += 1;
      throw new Error("must not be called");
    },
  });
  const payload = await response.json();

  assert.equal(response.status, 200);
  assert.deepEqual(payload, { status: "ok" });
  assert.equal(factoryCalls, 0);

  const fixture = database(() => []);
  const categories = await invoke("/categories", fixture.sql);
  assert.equal(categories.status, 200);
  assert.equal(fixture.calls.length, 1);
  assert.match(fixture.calls[0].query, /SELECT slug, name, color, article_count/);
  assert.doesNotMatch(fixture.calls.map(({ query }) => query).join(" "), /CREATE|INSERT|UPDATE|DELETE|ALTER|DROP/i);
});

test("Pages validates routes and authenticates admin requests before creating a database client", async () => {
  let factoryCalls = 0;
  const forbiddenFactory = () => {
    factoryCalls += 1;
    throw new Error("database factory must not run for these requests");
  };

  for (const [path, options, expectedStatus] of [
    ["/health", {}, 200],
    ["/healthz", {}, 200],
    ["/not-a-route", {}, 404],
    ["/healthz", { method: "POST" }, 404],
    ["/articles", { method: "POST" }, 404],
    ["/admin/articles", { method: "DELETE" }, 404],
    ["/admin/force-seed?key=local-test-admin-secret", {}, 404],
    ["/admin/articles", { method: "GET" }, 401],
    ["/admin/articles", { method: "GET", headers: { Authorization: "Bearer malformed" } }, 401],
    ["/admin/articles", { method: "POST", body: { title: "unauthorized" } }, 401],
    ["/admin/articles/7", { method: "PUT", body: { title: "unauthorized" } }, 401],
    ["/admin/articles/7", { method: "DELETE" }, 401],
    ["/admin/articles/7/publish", { method: "PATCH" }, 401],
    ["/admin/upload", { method: "POST" }, 401],
  ]) {
    const response = await invokeWithFactory(path, forbiddenFactory, options);
    assert.equal(response.status, expectedStatus, `${options.method ?? "GET"} ${path}`);
  }

  const loginResponse = await invokeWithFactory("/admin/login", forbiddenFactory, {
    method: "POST",
    body: { password: ENV.ADMIN_PASSWORD },
  });
  assert.equal(loginResponse.status, 200);
  const token = (await loginResponse.json()).token;
  assert.equal(factoryCalls, 0, "health, invalid, unauthorized, and login requests must not create a database client");

  const readOnlyDb = database(() => []);
  const adminList = await invokeWithFactory("/admin/articles", () => {
    factoryCalls += 1;
    return readOnlyDb.sql;
  }, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  assert.equal(adminList.status, 200);
  assert.equal(factoryCalls, 1);
  assert.equal(readOnlyDb.calls.length, 1);
  assert.match(readOnlyDb.calls[0].query, /SELECT/);
  assert.doesNotMatch(readOnlyDb.calls[0].query, /CREATE|INSERT|UPDATE|DELETE|ALTER|DROP/i);
});

test("single-article API exposes published rows only and never increments views", async () => {
  const article = {
    id: 7,
    slug: "public-story",
    title: "Public story",
    excerpt: "A public summary",
    body: '<p onclick="run()">Body</p><script>alert(1)</script><img src="javascript:alert(2)" onerror="run()">',
    category: "Tech",
    author_id: 1,
    author_name: "Maya Chen",
    image_url: "",
    read_time: 4,
    views: 13,
    featured: false,
    editors_pick: false,
    published: true,
    published_at: new Date("2026-10-01T12:00:00.000Z"),
    tags: [],
  };
  const publishedDb = database(({ query }) => query.includes("WHERE a.slug =") ? [article] : []);
  const publishedResponse = await invoke("/articles/public-story", publishedDb.sql);
  const publishedPayload = await publishedResponse.json();

  assert.equal(publishedResponse.status, 200);
  assert.equal(publishedPayload.slug, "public-story");
  assert.match(publishedPayload.body, /<p>Body<\/p>/);
  assert.doesNotMatch(publishedPayload.body, /onclick|<script|onerror|javascript:/i);
  assert.deepEqual(publishedPayload.author, { name: "Maya Chen", avatarUrl: "" });
  for (const field of [
    "id", "slug", "title", "subtitle", "excerpt", "body", "category", "authorId",
    "imageUrl", "readTime", "views", "featured", "editorsPick", "published",
    "publishedAt", "tags", "author",
  ]) {
    assert.ok(Object.hasOwn(publishedPayload, field), `article response should retain ${field}`);
  }
  assert.match(publishedDb.calls[0].query, /a\.published = true/);
  assert.doesNotMatch(publishedDb.calls.map(({ query }) => query).join(" "), /UPDATE|INSERT|DELETE|CREATE|ALTER|DROP/i);

  const unpublishedDb = database(({ query }) => query.includes("WHERE a.slug =") ? [] : []);
  const unpublishedResponse = await invoke("/articles/unpublished-story", unpublishedDb.sql);
  assert.equal(unpublishedResponse.status, 404);
  assert.deepEqual(await unpublishedResponse.json(), { error: "Not found" });
  assert.match(unpublishedDb.calls[0].query, /a\.published = true/);

  const malformedDb = database(() => {
    throw new Error("Malformed route must be rejected before SQL");
  });
  const malformedResponse = await invoke("/articles/bad%2Fslug", malformedDb.sql);
  assert.equal(malformedResponse.status, 404);
  assert.equal(malformedDb.calls.length, 0);
});

test("published article API rows without renderable body content return 503, not a successful placeholder", async () => {
  const incompleteArticle = {
    id: 18,
    slug: "incomplete-story",
    title: "Incomplete story",
    excerpt: "A summary alone is not a complete article body.",
    body: "<script>alert(1)</script>",
    category: "Tech",
    author_id: 1,
    author_name: "Maya Chen",
    image_url: "",
    read_time: 3,
    views: 0,
    featured: false,
    editors_pick: false,
    published: true,
    published_at: new Date("2026-10-01T12:00:00.000Z"),
    tags: [],
  };
  const fixture = database(({ query }) => query.includes("WHERE a.slug =") ? [incompleteArticle] : []);
  const response = await invoke("/articles/incomplete-story", fixture.sql);

  assert.equal(response.status, 503);
  assert.deepEqual(await response.json(), { error: "Article temporarily unavailable" });
  assert.equal(fixture.calls.length, 1);
  assert.match(fixture.calls[0].query, /a\.published = true/);
  assert.doesNotMatch(fixture.calls.map(({ query }) => query).join(" "), /UPDATE|INSERT|DELETE/i);
});

test("AI-phone alias redirects permanently and is omitted from public article listings", async () => {
  const alias = "why-ai-phones-are-becoming-the-future";
  const canonical = "why-ai-phones-are-the-future-2026";
  const redirectDb = database(() => {
    throw new Error("Alias redirects must not query the database");
  });

  const articleRedirect = await invoke(`/articles/${alias}?source=old-link`, redirectDb.sql);
  assert.equal(articleRedirect.status, 301);
  assert.equal(articleRedirect.headers.get("location"), `https://scrolltek.name.ng/api/articles/${canonical}?source=old-link`);
  assert.equal(redirectDb.calls.length, 0);

  const relatedRedirect = await invoke(`/articles/${alias}/related?source=old-link`, redirectDb.sql);
  assert.equal(relatedRedirect.status, 301);
  assert.equal(relatedRedirect.headers.get("location"), `https://scrolltek.name.ng/api/articles/${canonical}/related?source=old-link`);
  assert.equal(redirectDb.calls.length, 0);

  const articleRow = (slug, id) => ({
    id,
    slug,
    title: slug === canonical ? "Canonical AI Phone Guide" : "Another Published Story",
    subtitle: null,
    excerpt: "Published summary",
    body: "<p>Published body</p>",
    category: "Tech",
    author_id: 1,
    author_name: "Maya Chen",
    avatar_url: "",
    image_url: "",
    read_time: 4,
    views: 0,
    featured: false,
    editors_pick: false,
    published: true,
    published_at: new Date("2026-10-01T12:00:00.000Z"),
    tags: [],
  });
  const listingDb = database(({ query }) => (
    query.includes("COUNT(*)")
      ? [{ total: "2" }]
      : [articleRow(canonical, 10), articleRow("another-story", 11)]
  ));
  const listingResponse = await invoke("/articles?limit=50", listingDb.sql);
  const listingPayload = await listingResponse.json();
  assert.equal(listingResponse.status, 200);
  assert.deepEqual(listingPayload.articles.map((item) => item.slug), [canonical, "another-story"]);
  assert.ok(listingDb.calls.every(({ values }) => values.includes(alias)));
  assert.ok(listingDb.calls.every(({ query }) => /^\s*SELECT\b/i.test(query.trim())));
  assert.doesNotMatch(listingDb.calls.map(({ query }) => query).join(" "), /CREATE|INSERT|UPDATE|DELETE|ALTER|DROP/i);
});

test("author API returns only published stories; unknown author slugs are JSON 404s", async () => {
  const author = { id: 1, name: "Maya Chen", avatar_url: "https://images.example.test/maya.jpg" };
  const article = {
    id: 9,
    slug: "published-by-maya",
    title: "Published by Maya",
    subtitle: null,
    excerpt: "A summary",
    body: null,
    category: "Tech",
    author_id: 1,
    author_name: "Maya Chen",
    avatar_url: author.avatar_url,
    image_url: "",
    read_time: 3,
    views: 2,
    featured: false,
    editors_pick: false,
    published: true,
    published_at: new Date("2026-09-20T12:00:00.000Z"),
    tags: [],
  };
  const authorDb = database(({ query }) => {
    if (query.includes("SELECT id, name, avatar_url")) return [author];
    if (query.includes("COUNT(*) AS article_count")) return [{ article_count: "1", total_views: "2" }];
    if (query.includes("SELECT a.*, au.name AS author_name")) return [article];
    return [];
  });
  const response = await invoke("/authors/maya-chen", authorDb.sql);
  const payload = await response.json();

  assert.equal(response.status, 200);
  assert.equal(payload.slug, "maya-chen");
  assert.equal(payload.articleCount, 1);
  assert.equal(payload.articles[0].slug, "published-by-maya");
  assert.ok(authorDb.calls.every(({ query }) => !/CREATE|INSERT|UPDATE|DELETE|ALTER|DROP/i.test(query)));
  assert.match(authorDb.calls[1].query, /published = true/);
  assert.match(authorDb.calls[2].query, /a\.published = true/);

  const unknownDb = database(() => {
    throw new Error("No lookup should be necessary for unknown profile slugs");
  });
  const unknownResponse = await invoke("/authors/not-a-real-author", unknownDb.sql);
  assert.equal(unknownResponse.status, 404);
  assert.match(unknownResponse.headers.get("content-type"), /application\/json/i);
  assert.deepEqual(await unknownResponse.json(), { error: "Not found" });
  assert.equal(unknownDb.calls.length, 0);

  const missingAuthorDb = database(() => []);
  const missingAuthorResponse = await invoke("/authors/maya-chen", missingAuthorDb.sql);
  assert.equal(missingAuthorResponse.status, 404);
  assert.deepEqual(await missingAuthorResponse.json(), { error: "Not found" });
  assert.equal(missingAuthorDb.calls.length, 1);
  assert.match(missingAuthorDb.calls[0].query, /FROM authors/);

  const editorialDb = database(() => []);
  const editorialResponse = await invoke("/authors/scrolltek-editorial", editorialDb.sql);
  const editorialPayload = await editorialResponse.json();
  assert.equal(editorialResponse.status, 200);
  assert.equal(editorialPayload.id, null);
  assert.equal(editorialPayload.name, "Scrolltek Editorial");
  assert.equal(editorialPayload.articleCount, 0);
  assert.equal(editorialPayload.totalViews, 0);
  assert.deepEqual(editorialPayload.articles, []);
  assert.equal(editorialDb.calls.length, 1);
});

test("GET force-seed no longer mutates; explicit POST authenticates before database creation", async () => {
  const fixture = database(() => []);
  let factoryCalls = 0;
  const databaseFactory = () => {
    factoryCalls += 1;
    return fixture.sql;
  };

  const getResponse = await invokeWithFactory("/admin/force-seed?key=local-test-admin-secret", databaseFactory);
  assert.equal(getResponse.status, 404);
  assert.deepEqual(await getResponse.json(), { error: "Not found" });
  assert.equal(factoryCalls, 0);

  for (const body of [{}, { key: "incorrect" }]) {
    const unauthorized = await invokeWithFactory("/admin/force-seed", databaseFactory, {
      method: "POST",
      body,
    });
    assert.equal(unauthorized.status, 401);
    assert.deepEqual(await unauthorized.json(), { error: "Unauthorized" });
    assert.equal(factoryCalls, 0);
    assert.equal(fixture.calls.length, 0);
  }

  const authorizedDb = database(({ query }) => (
    query.includes("SELECT COUNT(*)") ? [{ c: "42" }] : []
  ));
  const authorized = await invokeWithFactory("/admin/force-seed", () => {
    factoryCalls += 1;
    return authorizedDb.sql;
  }, {
    method: "POST",
    body: { key: ENV.ADMIN_PASSWORD },
  });
  const authorizedPayload = await authorized.json();
  assert.equal(authorized.status, 200);
  assert.equal(authorizedPayload.total, 42);
  assert.match(authorizedPayload.message, /no article records were seeded or restored/i);
  assert.equal(factoryCalls, 1);
  assert.equal(authorizedDb.calls.length, 7);
  assert.match(authorizedDb.calls[0].query, /CREATE TABLE IF NOT EXISTS authors/);
});

test("search, category pagination, and related article responses remain published-only", async () => {
  const article = {
    id: 11,
    slug: "public-tech-story",
    title: "Public tech story",
    subtitle: null,
    excerpt: "A published summary",
    body: "<p>Published body</p>",
    category: "Tech",
    author_id: 1,
    author_name: "Maya Chen",
    avatar_url: "https://images.example.test/maya.jpg",
    image_url: "https://images.example.test/story.jpg",
    read_time: 5,
    views: 17,
    featured: false,
    editors_pick: false,
    published: true,
    published_at: new Date("2026-10-01T12:00:00.000Z"),
    tags: ["AI"],
  };

  const categoryDb = database(({ query }) => (
    query.includes("COUNT(*)") ? [{ total: "8" }] : [article, { ...article, id: 12, slug: "another-story" }]
  ));
  const categoryResponse = await invoke("/articles?category=tech&page=2&limit=5", categoryDb.sql);
  const categoryPayload = await categoryResponse.json();
  assert.equal(categoryResponse.status, 200);
  assert.equal(categoryPayload.page, 2);
  assert.equal(categoryPayload.limit, 5);
  assert.equal(categoryPayload.total, 8);
  assert.equal(categoryPayload.hasMore, true);
  assert.equal(categoryPayload.articles.length, 2);
  assert.match(categoryDb.calls[0].query, /a\.published = true AND a\.category =/);
  assert.deepEqual(categoryDb.calls[0].values, ["Tech", "why-ai-phones-are-becoming-the-future", 5, 5]);
  assert.match(categoryDb.calls[1].query, /published = true AND category =/);
  assert.deepEqual(categoryDb.calls[1].values, ["Tech", "why-ai-phones-are-becoming-the-future"]);

  const searchDb = database(({ query }) => (
    query.includes("COUNT(*)") ? [{ total: "9" }] : [article]
  ));
  const searchResponse = await invoke("/articles/search?q=ai&page=2&limit=4", searchDb.sql);
  const searchPayload = await searchResponse.json();
  assert.equal(searchResponse.status, 200);
  assert.equal(searchPayload.page, 2);
  assert.equal(searchPayload.limit, 4);
  assert.equal(searchPayload.total, 9);
  assert.equal(searchPayload.hasMore, true);
  assert.equal(searchPayload.articles[0].slug, "public-tech-story");
  assert.ok(searchDb.calls.every(({ query }) => /a\.published = true/.test(query)));
  assert.match(searchDb.calls[0].query, /array_to_string\(a\.tags, ' '\) ILIKE/);
  assert.match(searchDb.calls[0].query, /au\.name ILIKE/);
  assert.ok(searchDb.calls[1].query.includes("array_to_string(a.tags, ' ') ILIKE"));
  assert.equal(searchDb.calls[0].values[0], "why-ai-phones-are-becoming-the-future");
  assert.deepEqual(searchDb.calls[0].values.slice(1, 6), ["%ai%", "%ai%", "%ai%", "%ai%", "%ai%"]);
  assert.deepEqual(searchDb.calls[0].values.slice(-2), [4, 4]);

  const specialSearchDb = database(({ query }) => (
    query.includes("COUNT(*)") ? [{ total: "0" }] : []
  ));
  const specialSearchResponse = await invoke("/articles/search?q=ai%25_", specialSearchDb.sql);
  assert.equal(specialSearchResponse.status, 200);
  assert.equal(specialSearchDb.calls[0].values[0], "why-ai-phones-are-becoming-the-future");
  assert.equal(specialSearchDb.calls[0].values[1], "%ai\\%\\_%");

  const relatedDb = database(({ query }) => (
    query.includes("SELECT category FROM articles") ? [{ category: "Tech" }] : [article]
  ));
  const relatedResponse = await invoke("/articles/public-tech-story/related", relatedDb.sql);
  const relatedPayload = await relatedResponse.json();
  assert.equal(relatedResponse.status, 200);
  assert.equal(relatedPayload.length, 1);
  assert.match(relatedDb.calls[0].query, /WHERE slug = .* AND published = true/);
  assert.match(relatedDb.calls[1].query, /a\.published = true/);
  assert.equal(relatedDb.calls[1].values[0], "Tech");

  const unpublishedBaseDb = database(() => []);
  const unpublishedBaseResponse = await invoke("/articles/draft-story/related", unpublishedBaseDb.sql);
  assert.equal(unpublishedBaseResponse.status, 404);
  assert.deepEqual(await unpublishedBaseResponse.json(), { error: "Not found" });
  assert.equal(unpublishedBaseDb.calls.length, 1);
  assert.match(unpublishedBaseDb.calls[0].query, /published = true/);
});

test("search and category pagination reject invalid, excessive, and oversized inputs before SQL", async () => {
  const invalidPaths = [
    "/articles/search?q=story&page=0",
    "/articles/search?q=story&page=-1",
    "/articles/search?q=story&page=not-a-number",
    "/articles/search?q=story&page=Infinity",
    "/articles/search?q=story&page=10001",
    "/articles/search?q=story&limit=0",
    "/articles/search?q=story&limit=-5",
    "/articles/search?q=story&limit=51",
    "/articles?category=tech&page=NaN",
    "/articles?category=tech&page=10001",
    "/articles?category=tech&limit=1.5",
    "/articles?category=tech&limit=999999999",
  ];

  for (const path of invalidPaths) {
    const fixture = database(() => []);
    const response = await invoke(path, fixture.sql);
    assert.equal(response.status, 400, path);
    assert.deepEqual(await response.json(), { error: "Invalid pagination parameters" }, path);
    assert.equal(fixture.calls.length, 0, `${path} must not reach SQL`);
  }

  const longQueryDb = database(() => []);
  const longQuery = await invoke(`/articles/search?q=${"x".repeat(101)}`, longQueryDb.sql);
  assert.equal(longQuery.status, 400);
  assert.deepEqual(await longQuery.json(), { error: "Search query must be 100 characters or fewer" });
  assert.equal(longQueryDb.calls.length, 0);
});

test("database configuration and internal failures return generic JSON without secrets", async () => {
  const unavailable = await handleApiRequest({
    request: request("/articles/example"),
    env: {},
    databaseFactory: () => {
      throw new Error("must not be called");
    },
  });
  assert.equal(unavailable.status, 503);
  assert.match(unavailable.headers.get("content-type"), /application\/json/i);
  assert.deepEqual(await unavailable.json(), { error: "Service unavailable" });

  const brokenDb = database(() => {
    throw new Error("postgres://private-user:private-password@db.example.test/secret");
  });
  const oldConsoleError = console.error;
  console.error = () => {};
  let failed;
  try {
    failed = await invoke("/categories", brokenDb.sql);
  } finally {
    console.error = oldConsoleError;
  }
  const failedBody = await failed.text();
  assert.equal(failed.status, 500);
  assert.match(failed.headers.get("content-type"), /application\/json/i);
  assert.doesNotMatch(failedBody, /private-user|private-password|db\.example\.test|DATABASE_URL/i);
  assert.deepEqual(JSON.parse(failedBody), { error: "Internal server error" });
});
