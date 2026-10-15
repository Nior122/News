import assert from "node:assert/strict";
import test from "node:test";
import { handleSeoRequest } from "../_middleware.mjs";

const SHELL = `<!doctype html><html><head>
<title>Scrolltek</title>
<meta name="description" content="Default description">
<meta name="robots" content="index, follow">
<link rel="canonical" href="https://scrolltek.name.ng/">
<meta property="og:title" content="Scrolltek">
<meta property="og:description" content="Default description">
<meta property="og:url" content="https://scrolltek.name.ng/">
</head><body><noscript id="homepage-fallback">Home-only links</noscript><div id="root"></div><script type="module" src="/assets/app.js"></script></body></html>`;
const ENV = { DATABASE_URL: "local-test-placeholder" };

function htmlContext(url, { env = ENV, method = "GET", body = SHELL, status = 200 } = {}) {
  let nextCalls = 0;
  const context = {
    request: new Request(url, { method }),
    env,
    async next() {
      nextCalls += 1;
      return new Response(body, {
        status,
        headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "public, max-age=60" },
      });
    },
    get nextCalls() {
      return nextCalls;
    },
  };
  return context;
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

function render(context, db = database(() => [])) {
  return handleSeoRequest(context, { databaseFactory: () => db.sql });
}

test("www and non-canonical apex requests permanently redirect without losing path or query", async () => {
  const cases = [
    ["https://www.scrolltek.name.ng/article/story?ref=www", "https://scrolltek.name.ng/article/story?ref=www"],
    ["http://scrolltek.name.ng/about?from=http", "https://scrolltek.name.ng/about?from=http"],
    ["https://scrolltek.name.ng:8443/about?from=port", "https://scrolltek.name.ng/about?from=port"],
  ];

  for (const [source, destination] of cases) {
    const context = htmlContext(source);
    const response = await render(context);
    assert.equal(response.status, 308);
    assert.equal(response.headers.get("location"), destination);
    assert.equal(context.nextCalls, 0);
  }
});

test("Pages host redirects only on the explicitly configured production branch", async () => {
  const productionContext = htmlContext("https://project-id.pages.dev/search?q=ai", {
    env: { ...ENV, CF_PAGES_BRANCH: "main", PAGES_PRODUCTION_BRANCH: "main" },
  });
  const productionResponse = await render(productionContext);
  assert.equal(productionResponse.status, 308);
  assert.equal(productionResponse.headers.get("location"), "https://scrolltek.name.ng/search?q=ai");
  assert.equal(productionContext.nextCalls, 0);

  for (const env of [
    { ...ENV, CF_PAGES_BRANCH: "feature/seo", PAGES_PRODUCTION_BRANCH: "main" },
    ENV,
  ]) {
    const previewContext = htmlContext("https://preview.project.pages.dev/search?q=ai", { env });
    const previewResponse = await render(previewContext);
    assert.equal(previewResponse.status, 200);
    assert.equal(previewContext.nextCalls, 1);
    assert.match(await previewResponse.text(), /rel="canonical" href="https:\/\/scrolltek\.name\.ng\/search"/);
  }
});

test("homepage and static/search routes return route-aware HTML while preserving hydration assets", async () => {
  const homeContext = htmlContext("https://scrolltek.name.ng/");
  const home = await render(homeContext);
  const homeHtml = await home.text();
  assert.equal(home.status, 200);
  assert.match(homeHtml, /Scrolltek — Tech, Culture, Lifestyle &amp; AI Tools/);
  assert.match(homeHtml, /<main id="ssr"><h1>Scrolltek<\/h1>/);
  assert.match(homeHtml, /homepage-fallback/);

  for (const [path, title, heading] of [
    ["/about", "About Us — Scrolltek", "About Scrolltek"],
    ["/contact", "Contact Us — Scrolltek", "Contact Us"],
    ["/privacy", "Privacy Policy — Scrolltek", "Privacy Policy"],
  ]) {
    const staticContext = htmlContext(`https://scrolltek.name.ng${path}`);
    const staticResponse = await render(staticContext);
    const staticHtml = await staticResponse.text();
    assert.equal(staticResponse.status, 200);
    assert.ok(staticHtml.includes(`<title>${title}</title>`));
    assert.ok(staticHtml.includes(`<h1>${heading}</h1>`));
    assert.doesNotMatch(staticHtml, /homepage-fallback/);
  }

  const context = htmlContext("https://scrolltek.name.ng/search?q=ai");
  const response = await render(context);
  const html = await response.text();

  assert.equal(response.status, 200);
  assert.match(html, /<title>Search Scrolltek<\/title>/);
  assert.match(html, /<main id="ssr"><h1>Search Scrolltek<\/h1>/);
  assert.match(html, /name="robots" content="noindex, follow"/);
  assert.equal(response.headers.get("X-Robots-Tag"), "noindex, follow");
  assert.match(html, /rel="canonical" href="https:\/\/scrolltek\.name\.ng\/search"/);
  assert.doesNotMatch(html, /\/search\?q=ai|homepage-fallback/);
  assert.match(html, /src="\/assets\/app\.js"/);
});

test("retired AI-phone article URL permanently redirects to the canonical revision without redirecting it again", async () => {
  const alias = "why-ai-phones-are-becoming-the-future";
  const canonical = "why-ai-phones-are-the-future-2026";
  const context = htmlContext(`https://scrolltek.name.ng/article/${alias}?utm_source=old-link`);
  const redirect = await render(context);

  assert.equal(redirect.status, 301);
  assert.equal(redirect.headers.get("location"), `https://scrolltek.name.ng/article/${canonical}?utm_source=old-link`);
  assert.equal(context.nextCalls, 0);

  const canonicalDb = database(({ query }) => {
    assert.match(query, /a\.slug =/);
    return [{
      slug: canonical,
      title: "Canonical AI Phone Guide",
      subtitle: "A fuller 2026 guide",
      excerpt: "The expanded guide to AI phones.",
      body: "<p>Canonical article content.</p>",
      category: "Tech",
      image_url: "",
      published_at: "2026-05-28T09:00:00.000Z",
      author_name: "Maya Chen",
    }];
  });
  const canonicalContext = htmlContext(`https://scrolltek.name.ng/article/${canonical}`);
  const canonicalResponse = await render(canonicalContext, canonicalDb);
  assert.equal(canonicalResponse.status, 200);
  assert.equal(canonicalResponse.headers.get("location"), null);
  assert.equal(canonicalContext.nextCalls, 1);
  assert.equal(canonicalDb.calls.length, 1);
});

test("published articles and authors render from mocked records; invalid paths are real noindex 404s", async () => {
  const article = {
    slug: "published-story",
    title: "Published Story",
    subtitle: "A subtitle",
    excerpt: "A summary",
    body: "<p>Published article body.</p>",
    category: "Tech",
    image_url: "https://images.example.test/story.jpg",
    published_at: "2026-09-15T10:00:00.000Z",
    author_name: "Maya Chen",
  };
  const articleDb = database(({ query }) => {
    assert.match(query, /a\.published = true/);
    assert.doesNotMatch(query, /UPDATE|INSERT|DELETE|CREATE|ALTER|DROP/i);
    return [article];
  });
  const articleResponse = await render(htmlContext("https://scrolltek.name.ng/article/published-story"), articleDb);
  const articleHtml = await articleResponse.text();
  assert.equal(articleResponse.status, 200);
  assert.match(articleHtml, /<h1>Published Story<\/h1>/);
  assert.match(articleHtml, /Published article body\./);
  assert.match(articleHtml, /id="seo-prerender" data-pending="true"/);
  assert.match(articleHtml, /<div id="root"><\/div>/);
  assert.match(articleHtml, /rel="canonical" href="https:\/\/scrolltek\.name\.ng\/article\/published-story"/);
  assert.match(articleHtml, /"@type":"NewsArticle"/);
  assert.doesNotMatch(articleHtml, /homepage-fallback/);

  const authorDb = database(({ query }) => {
    if (query.includes("SELECT id, name, avatar_url")) return [{ id: 1, name: "Maya Chen", avatar_url: "" }];
    if (query.includes("SELECT slug, title, excerpt")) return [{ slug: "published-story", title: "Published Story", excerpt: "A summary" }];
    return [];
  });
  const authorResponse = await render(htmlContext("https://scrolltek.name.ng/author/maya-chen"), authorDb);
  const authorHtml = await authorResponse.text();
  assert.equal(authorResponse.status, 200);
  assert.match(authorHtml, /<h1>Maya Chen<\/h1>/);
  assert.match(authorHtml, /<a href="\/article\/published-story">Published Story<\/a>/);
  assert.match(authorHtml, /"@type":"Person"/);

  const missingAuthor = await render(
    htmlContext("https://scrolltek.name.ng/author/maya-chen"),
    database(() => []),
  );
  const missingAuthorHtml = await missingAuthor.text();
  assert.equal(missingAuthor.status, 404);
  assert.doesNotMatch(missingAuthorHtml, /"@type":"Person"|rel="canonical"/);

  const editorialDb = database(() => []);
  const editorialProfile = await render(
    htmlContext("https://scrolltek.name.ng/author/scrolltek-editorial"),
    editorialDb,
  );
  const editorialHtml = await editorialProfile.text();
  assert.equal(editorialProfile.status, 200);
  assert.match(editorialHtml, /<h1>Scrolltek Editorial<\/h1>/);
  assert.match(editorialHtml, /"@type":"Organization"/);
  assert.match(editorialHtml, /rel="canonical" href="https:\/\/scrolltek\.name\.ng\/author\/scrolltek-editorial"/);
  assert.equal(editorialDb.calls.length, 1);

  const encodedSlash = await render(htmlContext("https://scrolltek.name.ng/article/bad%2Fslug"));
  assert.equal(encodedSlash.status, 404);

  const missingArticleDb = database(() => []);
  const missingArticle = await render(htmlContext("https://scrolltek.name.ng/article/no-such-story"), missingArticleDb);
  const missingArticleHtml = await missingArticle.text();
  assert.equal(missingArticle.status, 404);
  assert.equal(missingArticle.headers.get("X-Robots-Tag"), "noindex, follow");
  assert.match(missingArticleHtml, /name="robots" content="noindex, follow"/);
  assert.doesNotMatch(missingArticleHtml, /rel="canonical"|property="og:url"|homepage-fallback/);

  const invalidAuthorContext = htmlContext("https://scrolltek.name.ng/author/not-a-real-author");
  const invalidAuthor = await render(invalidAuthorContext);
  assert.equal(invalidAuthor.status, 404);
  assert.equal(invalidAuthorContext.nextCalls, 1);
});

test("published rows without meaningful body content are temporary 503s, not indexed placeholders", async () => {
  const incompleteDb = database(() => [{
    slug: "incomplete-story",
    title: "Incomplete Story",
    excerpt: "A real but insufficient excerpt.",
    body: "<script>alert(1)</script>",
    category: "Tech",
    published_at: "2026-09-15T10:00:00.000Z",
  }]);
  const response = await render(htmlContext("https://scrolltek.name.ng/article/incomplete-story"), incompleteDb);
  const html = await response.text();

  assert.equal(response.status, 503);
  assert.equal(response.headers.get("Retry-After"), "60");
  assert.equal(response.headers.get("X-Robots-Tag"), "noindex, follow");
  assert.doesNotMatch(html, /rel="canonical"|property="og:url"|"@type":"NewsArticle"|alert\(1\)/);
  assert.match(html, /Page temporarily unavailable/);
});

test("category listings are crawlable and deduplicate mixed-category results", async () => {
  const sameStory = {
    slug: "shared-story",
    title: "Shared Story",
    excerpt: "One story in two categories.",
    category: "AI Tools",
    published_at: "2026-08-01T12:00:00.000Z",
  };
  const listingDb = database(() => [sameStory]);
  const response = await render(htmlContext("https://scrolltek.name.ng/category/ai-productivity"), listingDb);
  const html = await response.text();

  assert.equal(response.status, 200);
  assert.match(html, /<h1>AI &amp; Productivity<\/h1>/);
  assert.match(html, /href="\/article\/shared-story"/);
  assert.equal((html.match(/href="\/article\/shared-story"/g) ?? []).length, 1);
  assert.equal(listingDb.calls.length, 2);
  assert.ok(listingDb.calls.every(({ query }) => /published = true/.test(query)));
  assert.ok(listingDb.calls.every(({ values }) => values.includes("why-ai-phones-are-becoming-the-future")));
});

test("unknown routes return 404 HTML, API JSON errors stay JSON, and missing assets are not rewritten", async () => {
  const unknown = await render(htmlContext("https://scrolltek.name.ng/unknown-route"));
  const unknownHtml = await unknown.text();
  assert.equal(unknown.status, 404);
  assert.equal(unknown.headers.get("X-Robots-Tag"), "noindex, follow");
  assert.match(unknownHtml, /Page not found/);
  assert.doesNotMatch(unknownHtml, /rel="canonical"/);

  const apiError = new Response(JSON.stringify({ error: "Not found" }), {
    status: 404,
    headers: { "Content-Type": "application/json" },
  });
  const apiContext = {
    request: new Request("https://scrolltek.name.ng/api/articles/private-story"),
    env: ENV,
    async next() { return apiError; },
  };
  assert.equal(await handleSeoRequest(apiContext), apiError);
  assert.deepEqual(await apiError.json(), { error: "Not found" });

  const missingAsset = await render(htmlContext("https://scrolltek.name.ng/assets/missing.js"));
  assert.equal(missingAsset.status, 404);
  assert.match(missingAsset.headers.get("content-type"), /text\/plain/i);
  assert.equal(await missingAsset.text(), "Not found");

  const missingAssetHead = await render(htmlContext("https://scrolltek.name.ng/assets/missing.js", { method: "HEAD" }));
  assert.equal(missingAssetHead.status, 404);
  assert.equal(await missingAssetHead.text(), "");

  const missingImage = await render(htmlContext("https://scrolltek.name.ng/images/missing.webp"));
  assert.equal(missingImage.status, 404);
  assert.match(missingImage.headers.get("content-type"), /text\/plain/i);

  const assetBody = "export const ok = true;";
  const assetResponse = new Response(assetBody, {
    status: 200,
    headers: { "Content-Type": "application/javascript" },
  });
  const existingAssetContext = {
    request: new Request("https://scrolltek.name.ng/assets/app.js"),
    env: ENV,
    async next() { return assetResponse; },
  };
  assert.equal(await handleSeoRequest(existingAssetContext), assetResponse);
});

test("database outages return generic 503 HTML without leaking internal details", async () => {
  const unavailable = await render(htmlContext("https://scrolltek.name.ng/article/story", { env: {} }));
  assert.equal(unavailable.status, 503);
  assert.equal(unavailable.headers.get("X-Robots-Tag"), "noindex, follow");
  assert.equal(unavailable.headers.get("Retry-After"), "60");
  assert.doesNotMatch(await unavailable.text(), /DATABASE_URL|password|postgres/i);

  const brokenDb = database(() => {
    throw new Error("private connection string");
  });
  const oldConsoleError = console.error;
  console.error = () => {};
  let failed;
  try {
    failed = await render(htmlContext("https://scrolltek.name.ng/article/story"), brokenDb);
  } finally {
    console.error = oldConsoleError;
  }
  assert.equal(failed.status, 503);
  assert.doesNotMatch(await failed.text(), /private connection string/);
});
