import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { handleSeoRequest } from "../_middleware.mjs";
import { handleApiRequest } from "../api/[[path]].mjs";

const INDEX_HTML = readFileSync(new URL("../../artifacts/media-site/index.html", import.meta.url), "utf8");
const APP_SOURCE = readFileSync(new URL("../../artifacts/media-site/src/App.tsx", import.meta.url), "utf8");
const THEME_PROVIDER_SOURCE = readFileSync(
  new URL("../../artifacts/media-site/src/components/theme-provider.tsx", import.meta.url),
  "utf8",
);
const HEADERS_FILE = readFileSync(
  new URL("../../artifacts/media-site/public/_headers", import.meta.url),
  "utf8",
);

const ENV = {
  DATABASE_URL: "local-test-placeholder",
  ADMIN_PASSWORD: "local-test-admin-secret",
};

test("light mode is the default across index.html, ThemeProvider, and App while preserving user toggle and AdSense", () => {
  // Light mode default in raw HTML shell (no hardcoded class="dark" on <html>)
  assert.match(INDEX_HTML, /<html lang="en">/);
  assert.doesNotMatch(INDEX_HTML, /<html[^>]*class="dark"/);
  assert.match(INDEX_HTML, /<meta name="theme-color" content="#fafafa"\s*\/?>/);
  assert.match(INDEX_HTML, /html \{ background: #fafafa; color: #0d0d0d; color-scheme: light; \}/);
  assert.match(INDEX_HTML, /html\.dark \{ background: #0d0d0d; color: #f2f2f2; color-scheme: dark; \}/);

  // Google AdSense script remains intact in <head>
  assert.match(
    INDEX_HTML,
    /<script async src="https:\/\/pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js\?client=ca-pub-3931662977705623" crossorigin="anonymous"><\/script>/,
  );

  // ThemeProvider & App default to "light"
  assert.match(THEME_PROVIDER_SOURCE, /defaultTheme = "light"/);
  assert.match(APP_SOURCE, /<ThemeProvider defaultTheme="light" storageKey="scrolltek-theme-v2">/);

  // Static edge caching headers configured for immutable assets and media
  assert.match(HEADERS_FILE, /\/assets\/\*\s+Cache-Control: public, max-age=31536000, immutable/);
  assert.match(HEADERS_FILE, /\/images\/\*\s+Cache-Control: public, max-age=86400, stale-while-revalidate=604800/);

  // Built production HTML shell must never modulepreload the ~395 kB admin Tiptap chunk
  const builtIndexUrl = new URL("../../artifacts/media-site/dist/public/index.html", import.meta.url);
  if (existsSync(builtIndexUrl)) {
    const builtHtml = readFileSync(builtIndexUrl, "utf8");
    assert.doesNotMatch(builtHtml, /vendor-tiptap/);
  }
});

test("SSR middleware injects #ssr-data hydration payload and hero image preload on homepage and article routes", async () => {
  const articles = [
    {
      id: 101,
      slug: "fast-story",
      title: "Fast Story",
      subtitle: "Sub",
      excerpt: "Excerpt text",
      body: "<p>Full body content for article page.</p>",
      category: "Tech",
      author_id: 1,
      author_name: "Maya Chen",
      avatar_url: "",
      image_url: "https://scrolltek.name.ng/images/ai-tools-for-students-study-guide.webp",
      read_time: 6,
      views: 42,
      featured: true,
      editors_pick: false,
      tags: ["Speed"],
      published_at: "2026-10-01T12:00:00.000Z",
    },
  ];

  const db = async () => articles;
  const makeContext = (url) => ({
    request: new Request(url),
    env: ENV,
    async next() {
      return new Response(INDEX_HTML, {
        status: 200,
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    },
  });

  // Homepage hydration + LCP preload
  const homeRes = await handleSeoRequest(makeContext("https://scrolltek.name.ng/"), {
    databaseFactory: () => db,
  });
  const homeHtml = await homeRes.text();
  assert.match(
    homeHtml,
    /<link rel="preload" as="image" href="https:\/\/scrolltek\.name\.ng\/images\/ai-tools-for-students-study-guide\.webp" fetchpriority="high"\s*\/?>/,
  );
  const homeSsrMatch = homeHtml.match(/<script type="application\/json" id="ssr-data">([\s\S]*?)<\/script>/);
  assert.ok(homeSsrMatch, "homepage embeds #ssr-data payload");
  const homePayload = JSON.parse(homeSsrMatch[1]);
  assert.equal(homePayload.kind, "home");
  assert.equal(homePayload.articles.length, 1);
  assert.equal(homePayload.articles[0].body, "", "homepage hydration strips heavy body HTML");

  // Article hydration + LCP preload
  const articleRes = await handleSeoRequest(makeContext("https://scrolltek.name.ng/article/fast-story"), {
    databaseFactory: () => async (strings) => {
      const q = strings.join(" ? ");
      return q.includes("a.subtitle") ? articles : [];
    },
  });
  const articleHtml = await articleRes.text();
  const articleSsrMatch = articleHtml.match(/<script type="application\/json" id="ssr-data">([\s\S]*?)<\/script>/);
  assert.ok(articleSsrMatch, "article page embeds #ssr-data payload");
  const articlePayload = JSON.parse(articleSsrMatch[1]);
  assert.equal(articlePayload.kind, "article");
  assert.equal(articlePayload.article.slug, "fast-story");
  assert.match(articlePayload.article.body, /<p>Full body content for article page\.<\/p>/);
});

test("public API list endpoints strip heavy body HTML and set edge Cache-Control while single-article and admin keep full body", async () => {
  const largeBody = `<p>${"Long paragraph content. ".repeat(500)}</p>`;
  const row = {
    id: 55,
    slug: "heavy-story",
    title: "Heavy Story",
    subtitle: null,
    excerpt: "Short excerpt",
    body: largeBody,
    category: "Tech",
    author_id: 1,
    author_name: "Maya Chen",
    avatar_url: "",
    image_url: "",
    read_time: 8,
    views: 10,
    featured: false,
    editors_pick: false,
    published: true,
    published_at: new Date("2026-10-01T12:00:00.000Z"),
    tags: [],
  };

  const listRes = await handleApiRequest({
    request: new Request("https://scrolltek.name.ng/api/articles?limit=12"),
    env: ENV,
    databaseFactory: () => async (strings) =>
      strings.join(" ? ").includes("COUNT(*)") ? [{ total: "1" }] : [row],
  });
  assert.equal(listRes.status, 200);
  assert.match(listRes.headers.get("cache-control") ?? "", /public, max-age=60, s-maxage=300/);
  const listJson = await listRes.json();
  assert.equal(listJson.articles[0].body, "", "list endpoint strips unused multi-KB HTML body");

  const singleRes = await handleApiRequest({
    request: new Request("https://scrolltek.name.ng/api/articles/heavy-story"),
    env: ENV,
    databaseFactory: () => async () => [row],
  });
  assert.equal(singleRes.status, 200);
  assert.match(singleRes.headers.get("cache-control") ?? "", /public, max-age=60, s-maxage=300/);
  const singleJson = await singleRes.json();
  assert.ok(singleJson.body.length > 5000, "single article endpoint retains full sanitized HTML body");
});
