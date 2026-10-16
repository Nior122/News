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

test("homepage server-renders every published article grouped by category plus every category link", async () => {
  const categories = [
    { slug: "tech", name: "Tech" },
    { slug: "ai-tools", name: "AI Tools" },
    { slug: "phone-tips", name: "Phone Tips" },
    { slug: "not-a-route", name: "Gaming" },
  ];
  const articles = [
    { slug: "newest-story", title: "Newest Story", excerpt: "Newest excerpt.", category: "Tech", published_at: "2026-09-20T10:00:00.000Z" },
    { slug: "ai-smart-glasses-2026", title: "AI Smart Glasses 2026", excerpt: "Glasses excerpt.", category: "Tech", published_at: "2026-09-10T10:00:00.000Z" },
    { slug: "tools-story", title: "Tools Story", excerpt: "Tools excerpt.", category: "AI Tools", published_at: "2026-09-05T10:00:00.000Z" },
    { slug: "oddball-story", title: "Oddball Story", excerpt: "No category page.", category: "Gaming", published_at: "2026-09-01T10:00:00.000Z" },
    // Published, but its body sanitizes to nothing, so its page would 503.
    { slug: "unrenderable-story", title: "Unrenderable Story", excerpt: "Must not be linked.", category: "Tech", body: "<script>alert(1)</script>", published_at: "2026-08-30T10:00:00.000Z" },
  ];
  const homeDb = database(({ query }) => {
    assert.doesNotMatch(query, /INSERT|UPDATE|DELETE|CREATE|ALTER|DROP/i);
    if (query.includes("FROM categories")) return categories;
    // The homepage query must select every qualifying published row rather than
    // filtering to a hardcoded slug allowlist.
    assert.match(query, /FROM articles/);
    assert.match(query, /a\.published = true/);
    assert.doesNotMatch(query, /a\.slug\s*(?:=|IN)\s*[^<]/);
    // Rows carry their body so the sitemap's renderability check can be reused.
    assert.match(query, /a\.body/);
    return articles.map((article) => ({ body: "<p>Real body.</p>", ...article }));
  });

  const homeContext = htmlContext("https://scrolltek.name.ng/");
  const home = await render(homeContext, homeDb);
  const homeHtml = await home.text();

  assert.equal(home.status, 200);
  assert.match(homeHtml, /<title>Scrolltek — Tech, Culture, Lifestyle &amp; AI Tools<\/title>/);
  assert.match(homeHtml, /<main id="ssr"><h1>Scrolltek<\/h1>/);
  assert.match(homeHtml, /rel="canonical" href="https:\/\/scrolltek\.name\.ng\/"/);

  // Every published, renderable title and excerpt is in the server-rendered HTML.
  for (const article of articles.filter((item) => item.slug !== "unrenderable-story")) {
    assert.ok(homeHtml.includes(`<a href="/article/${article.slug}">${article.title}</a>`), `renders ${article.slug}`);
    assert.ok(homeHtml.includes(article.excerpt), `renders excerpt for ${article.slug}`);
  }

  // A row whose article page would 503 is not linked from the homepage, matching
  // the sitemap's exclusion — the two listings must not disagree.
  assert.doesNotMatch(homeHtml, /unrenderable-story|alert\(1\)/);

  // Grouped under category headings that link to the category pages.
  assert.match(homeHtml, /<h2><a href="\/category\/tech">Tech<\/a><\/h2>/);
  assert.match(homeHtml, /<h2><a href="\/category\/ai-tools">AI Tools<\/a><\/h2>/);
  // A category without a route handler gets its titles, but no link to a 404.
  assert.match(homeHtml, /<h2>Gaming<\/h2>/);
  assert.doesNotMatch(homeHtml, /href="\/category\/not-a-route"/);

  // Navigation links to every valid category page.
  assert.match(homeHtml, /<nav aria-label="Browse categories">/);
  assert.match(homeHtml, /<a href="\/category\/tech">Tech<\/a>/);
  assert.match(homeHtml, /<a href="\/category\/ai-tools">AI Tools<\/a>/);
  assert.doesNotMatch(homeHtml, /<a href="\/category\/not-a-route">/);
  // A valid category with no published articles is still linked, but gets no
  // empty section.
  assert.match(homeHtml, /<a href="\/category\/phone-tips">Phone Tips<\/a>/);
  assert.doesNotMatch(homeHtml, /<section aria-label="Phone Tips">/);

  // Content is in the response body, so no client JavaScript is required, and
  // the stale hardcoded <noscript> list is gone.
  assert.match(homeHtml, /<div id="root"><main id="ssr">/);
  assert.match(homeHtml, /src="\/assets\/app\.js"/);
  assert.doesNotMatch(homeHtml, /homepage-fallback/);
});

test("homepage still serves the static shell when the database is unavailable", async () => {
  const noEnvHome = await render(htmlContext("https://scrolltek.name.ng/", { env: {} }));
  assert.equal(noEnvHome.status, 200);
  assert.match(await noEnvHome.text(), /<main id="ssr"><h1>Scrolltek<\/h1>/);

  const oldConsoleError = console.error;
  console.error = () => {};
  let brokenHome;
  try {
    brokenHome = await render(
      htmlContext("https://scrolltek.name.ng/"),
      database(() => {
        throw new Error("private connection string");
      }),
    );
  } finally {
    console.error = oldConsoleError;
  }
  const brokenHomeHtml = await brokenHome.text();
  assert.equal(brokenHome.status, 200, "homepage degrades instead of failing");
  assert.match(brokenHomeHtml, /<main id="ssr"><h1>Scrolltek<\/h1>/);
  assert.doesNotMatch(brokenHomeHtml, /private connection string/);
});

test("static and search routes return route-aware HTML while preserving hydration assets", async () => {
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

test("both retired article aliases permanently redirect to their canonical revision without redirecting it again", async () => {
  const aliases = [
    ["why-ai-phones-are-becoming-the-future", "why-ai-phones-are-the-future-2026"],
    ["ai-smart-glasses-future", "ai-smart-glasses-2026"],
  ];

  for (const [alias, canonical] of aliases) {
    const context = htmlContext(`https://scrolltek.name.ng/article/${alias}?utm_source=old-link`);
    const redirect = await render(context);

    assert.equal(redirect.status, 301, `${alias} is a permanent redirect`);
    assert.equal(redirect.headers.get("location"), `https://scrolltek.name.ng/article/${canonical}?utm_source=old-link`);
    assert.equal(context.nextCalls, 0, `${alias} never reaches the origin`);

    const canonicalDb = database(({ query }) => {
      // Call 1 loads the article, call 2 loads related reading.
      assert.ok(/a\.slug =|FROM articles/.test(query), `unexpected query: ${query}`);
      return [{
        slug: canonical,
        title: `Canonical Guide ${canonical}`,
        subtitle: "A fuller 2026 guide",
        excerpt: "The expanded guide.",
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
    assert.equal(canonicalResponse.headers.get("location"), null, `${canonical} is not redirected again`);
    assert.equal(canonicalContext.nextCalls, 1);
    assert.equal(canonicalDb.calls.length, 2);
  }
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
  assert.match(articleHtml, /property="og:url" content="https:\/\/scrolltek\.name\.ng\/article\/published-story"/);
  assert.match(articleHtml, /name="twitter:url" content="https:\/\/scrolltek\.name\.ng\/article\/published-story"/);
  assert.match(articleHtml, /"@type":"NewsArticle"/);
  assert.doesNotMatch(articleHtml, /homepage-fallback/);
  // The fixture only offers the article itself as related, which must not self-link.
  assert.doesNotMatch(articleHtml, /Related reading/);

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

test("article pages server-render three or four related-article links without self-links", async () => {
  const article = {
    slug: "current-story",
    title: "Current Story",
    subtitle: null,
    excerpt: "The current story.",
    body: "<p>Current article body.</p>",
    category: "Tech",
    image_url: "",
    published_at: "2026-09-15T10:00:00.000Z",
    author_name: "Maya Chen",
  };
  const relatedPool = [
    { slug: "same-cat-1", title: "Same Category One", excerpt: "First related.", body: "<p>Body one.</p>" },
    { slug: "same-cat-2", title: "Same Category Two", excerpt: "Second related.", body: "<p>Body two.</p>" },
    { slug: "why-ai-phones-are-the-future-2026", title: "AI Phones 2026", excerpt: "Third related.", body: "<p>Body three.</p>" },
    { slug: "ai-smart-glasses-2026", title: "AI Smart Glasses 2026", excerpt: "Fourth related.", body: "<p>Body four.</p>" },
    { slug: "fifth-story", title: "Fifth Story", excerpt: "Should be trimmed.", body: "<p>Body five.</p>" },
  ];

  function articleDbWith(related) {
    return database(({ query, values }) => {
      if (query.includes("a.subtitle")) {
        assert.equal(values[0], "current-story");
        return [article];
      }
      assert.match(query, /a\.slug <>\s+\?/, "related query excludes the current article");
      assert.match(query, /BTRIM\(COALESCE\(a\.body, ''\)\) <> ''/, "related query guards against non-renderable rows");
      assert.ok(
        values.some((value) => Array.isArray(value)
          && value.includes("why-ai-phones-are-becoming-the-future")
          && value.includes("ai-smart-glasses-future")),
        "related query excludes both retired aliases",
      );
      return related;
    });
  }

  const response = await render(
    htmlContext("https://scrolltek.name.ng/article/current-story"),
    articleDbWith(relatedPool),
  );
  const html = await response.text();
  assert.equal(response.status, 200);
  assert.match(html, /<aside aria-label="Related articles"><h2>Related reading<\/h2>/);

  const aside = /<aside aria-label="Related articles">[\s\S]*?<\/aside>/.exec(html)?.[0] ?? "";
  const linkCount = (aside.match(/<li>/g) ?? []).length;
  assert.ok(linkCount >= 3 && linkCount <= 4, `renders three or four related links, got ${linkCount}`);
  assert.ok(!aside.includes("/article/current-story"), "never links back to itself");
  assert.ok(!aside.includes("fifth-story"), "caps the block at four links");

  // A thin pool still renders, as long as there is something to link.
  const thinHtml = await (await render(
    htmlContext("https://scrolltek.name.ng/article/current-story"),
    articleDbWith(relatedPool.slice(0, 3)),
  )).text();
  const thinAside = /<aside aria-label="Related articles">[\s\S]*?<\/aside>/.exec(thinHtml)?.[0] ?? "";
  assert.equal((thinAside.match(/<li>/g) ?? []).length, 3);

  // No related rows: omit the block rather than render an empty heading.
  const emptyHtml = await (await render(
    htmlContext("https://scrolltek.name.ng/article/current-story"),
    articleDbWith([]),
  )).text();
  assert.doesNotMatch(emptyHtml, /Related reading/);
  assert.match(emptyHtml, /<h1>Current Story<\/h1>/);

  // A row whose body is not renderable would 503 as an article page, so it must
  // not be offered as a related link.
  const brokenHtml = await (await render(
    htmlContext("https://scrolltek.name.ng/article/current-story"),
    articleDbWith([
      { slug: "renderable-one", title: "Renderable One", excerpt: "Fine.", body: "<p>Real body.</p>" },
      { slug: "script-only", title: "Script Only", excerpt: "Not renderable.", body: "<script>alert(1)</script>" },
      { slug: "blank-body", title: "Blank Body", excerpt: "Not renderable.", body: "   " },
    ]),
  )).text();
  const brokenAside = /<aside aria-label="Related articles">[\s\S]*?<\/aside>/.exec(brokenHtml)?.[0] ?? "";
  assert.equal((brokenAside.match(/<li>/g) ?? []).length, 1);
  assert.match(brokenAside, /renderable-one/);
  assert.doesNotMatch(brokenAside, /script-only|blank-body|alert\(1\)/);
});

test("a related-article query failure never takes the article page down", async () => {
  const article = {
    slug: "resilient-story",
    title: "Resilient Story",
    subtitle: null,
    excerpt: "Still renders.",
    body: "<p>Resilient body.</p>",
    category: "Tech",
    image_url: "",
    published_at: "2026-09-15T10:00:00.000Z",
    author_name: "Maya Chen",
  };
  const flakyDb = database(({ query }) => {
    if (query.includes("a.subtitle")) return [article];
    throw new Error("private related-query failure");
  });
  const oldConsoleError = console.error;
  console.error = () => {};
  let response;
  try {
    response = await render(htmlContext("https://scrolltek.name.ng/article/resilient-story"), flakyDb);
  } finally {
    console.error = oldConsoleError;
  }
  const html = await response.text();

  assert.equal(response.status, 200);
  assert.match(html, /<h1>Resilient Story<\/h1>/);
  assert.match(html, /<h1>Resilient Story<\/h1>[\s\S]*Resilient body\./);
  assert.doesNotMatch(html, /Related reading|private related-query failure/);
});

test("internal links to retired aliases are rewritten to canonical URLs at render time", async () => {
  const body = [
    '<p>Relative <a href="/article/why-ai-phones-are-becoming-the-future">old AI phones</a>.</p>',
    '<p>Absolute <a href="https://scrolltek.name.ng/article/ai-smart-glasses-future?ref=body">old glasses</a>.</p>',
    '<p>WWW <a href="https://www.scrolltek.name.ng/article/why-ai-phones-are-becoming-the-future#deep">www alias</a>.</p>',
    '<p>Canonical <a href="/article/google-io-2026-ai-announcements">stays put</a>.</p>',
    '<p>Third party <a href="https://example.com/article/ai-smart-glasses-future">untouched</a>.</p>',
  ].join("");

  const article = {
    slug: "linking-story",
    title: "Linking Story",
    subtitle: null,
    excerpt: "Links to retired aliases.",
    body,
    category: "Tech",
    image_url: "",
    published_at: "2026-09-15T10:00:00.000Z",
    author_name: "Maya Chen",
  };
  const db = database(({ query }) => (query.includes("a.subtitle") ? [article] : []));
  const response = await render(htmlContext("https://scrolltek.name.ng/article/linking-story"), db);
  const html = await response.text();
  assert.equal(response.status, 200);

  const renderedBody = /<div class="ssr-article-body">([\s\S]*?)<\/div>/.exec(html)?.[1] ?? "";
  const hrefs = [...renderedBody.matchAll(/href="([^"]+)"/g)].map(([, href]) => href);

  assert.deepEqual(hrefs, [
    "https://scrolltek.name.ng/article/why-ai-phones-are-the-future-2026",
    "https://scrolltek.name.ng/article/ai-smart-glasses-2026?ref=body",
    "https://scrolltek.name.ng/article/why-ai-phones-are-the-future-2026#deep",
    "https://scrolltek.name.ng/article/google-io-2026-ai-announcements",
    "https://example.com/article/ai-smart-glasses-future",
  ]);

  // No internal link still points at a slug that only 301s.
  assert.ok(!hrefs.some((href) => new URL(href).hostname === "scrolltek.name.ng"
    && /\/article\/(why-ai-phones-are-becoming-the-future|ai-smart-glasses-future)$/.test(new URL(href).pathname)));
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
  // Both retired aliases are excluded from listings via a single array parameter.
  assert.ok(listingDb.calls.every(({ values }) => values.some(
    (value) => Array.isArray(value)
      && value.includes("why-ai-phones-are-becoming-the-future")
      && value.includes("ai-smart-glasses-future"),
  )));
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
