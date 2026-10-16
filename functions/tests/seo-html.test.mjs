import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import {
  renderArticleDocument,
  renderAuthorDocument,
  renderCanonicalDocument,
  renderListingDocument,
  renderNotFoundDocument,
  sanitizeArticleHtml,
  hasMeaningfulArticleBody,
  canonicalUrlForPath,
  SITE_ORIGIN,
} from "../lib/seo-html.mjs";

const template = `<!doctype html>
<html lang="en"><head>
<title>Scrolltek</title>
<meta name="description" content="Default description">
<meta name="robots" content="index, follow">
<link rel="canonical" href="https://scrolltek.name.ng/">
<meta property="og:type" content="website">
<meta property="og:title" content="Scrolltek">
<meta property="og:description" content="Default description">
<meta property="og:url" content="https://scrolltek.name.ng/">
<link rel="stylesheet" href="/assets/site.css">
<script type="module" src="/assets/main.js"></script>
<script type="application/ld+json" id="website-jsonld">{"@type":"WebSite"}</script>
<noscript id="font-fallback">Font stylesheet fallback</noscript>
</head><body><div id="root"></div><noscript id="homepage-fallback">Homepage article links</noscript></body></html>`;

test("article HTML has canonical metadata, visible content, and NewsArticle JSON-LD", () => {
  const html = renderArticleDocument(template, {
    slug: "example-article",
    title: "Example Article",
    subtitle: "A useful subtitle",
    excerpt: "A short summary.",
    body: "<p>Useful article body.</p>",
    category: "Tech",
    image_url: "https://images.example.test/article.jpg",
    published_at: "2026-06-01T12:00:00.000Z",
    author_name: "Maya Chen",
  });

  assert.match(html, /<title>Example Article — Scrolltek<\/title>/);
  assert.match(html, /<meta name="description" content="A short summary\." \/>/);
  assert.match(html, /<link rel="canonical" href="https:\/\/scrolltek\.name\.ng\/article\/example-article" \/>/);
  assert.match(html, /property="og:title" content="Example Article — Scrolltek"/);
  assert.match(html, /property="og:description" content="A short summary\."/);
  assert.match(html, /property="og:url" content="https:\/\/scrolltek\.name\.ng\/article\/example-article"/);
  assert.match(html, /name="twitter:title" content="Example Article — Scrolltek"/);
  assert.match(html, /name="twitter:description" content="A short summary\."/);
  assert.match(html, /name="twitter:card" content="summary_large_image"/);
  assert.match(html, /id="seo-prerender" data-pending="true"><main id="ssr"><article>/);
  assert.match(html, /<div id="seo-prerender" data-pending="true">[\s\S]*<\/div>\s*<div id="root"><\/div>/);
  assert.match(html, /Useful article body\./);
  assert.match(html, /"@type":"NewsArticle"/);
  assert.match(html, /"datePublished":"2026-06-01T12:00:00\.000Z"/);
  assert.doesNotMatch(html, /"dateModified"/);
  assert.doesNotMatch(html, /scrolltek\.com/);
  assert.doesNotMatch(html, /homepage-fallback/);
  assert.match(html, /font-fallback/);
  assert.match(html, /href="\/assets\/site\.css"/);
  assert.match(html, /src="\/assets\/main\.js"/);
  assert.equal((html.match(/rel="canonical"/g) ?? []).length, 1);
  assert.equal((html.match(/property="og:url"/g) ?? []).length, 1);
});

test("client shell keeps article prerender outside the React root until handoff", () => {
  const indexHtml = readFileSync(new URL("../../artifacts/media-site/index.html", import.meta.url), "utf8");
  assert.match(indexHtml, /<div id="seo-prerender"><\/div>\s*<div id="root"><\/div>/);
  assert.match(indexHtml, /#seo-prerender\[data-pending="true"\] ~ #root\s*\{\s*display:\s*none/);
  // The homepage listing in that slot is hidden from the first paint whenever
  // JS runs, so visitors never see it as a flash of raw markup.
  assert.match(indexHtml, /<meta charset="UTF-8" \/>\s*<script>document\.documentElement\.className \+= " js";<\/script>/);
  assert.match(indexHtml, /html\.js #seo-prerender\[data-ssr="home"\]\s*\{\s*display:\s*none/);
  assert.doesNotMatch(indexHtml, /MutationObserver/);
});

test("article body sanitizer retains safe markup and removes executable markup", () => {
  const html = sanitizeArticleHtml(
    '<h2 onclick="run()">Overview</h2><p>Safe <strong>text</strong> <a href="https://example.test/story" target="_blank" onclick="run()">link</a></p><script>alert(1)</script><img src="javascript:alert(1)" onerror="run()"><a href="javascript:alert(1)">bad link</a><a href="javascript&colon;alert(2)">entity bad link</a><a href="java&#x73;cript:alert(3)">numeric entity bad link</a><a href="https://user:password@example.test/private">credential URL</a>',
  );

  assert.match(html, /<h2>Overview<\/h2>/);
  assert.match(html, /<strong>text<\/strong>/);
  assert.match(html, /href="https:\/\/example\.test\/story"/);
  assert.match(html, /rel="noopener noreferrer"/);
  assert.doesNotMatch(html, /onclick|onerror|<script|alert\(1\)|javascript:|user:password/i);
  assert.doesNotMatch(html, /<img/);
});

test("article descriptions fall back to the actual body rather than generic site copy", () => {
  const html = renderArticleDocument(template, {
    slug: "body-summary-story",
    title: "Body Summary Story",
    excerpt: "   ",
    body: "<p>Specific article lead from the saved body.</p><script>ignore this</script>",
  });
  const schemaScript = html.match(/<script type="application\/ld\+json" id="article-jsonld">([^<]+)<\/script>/);

  assert.match(html, /<meta name="description" content="Specific article lead from the saved body\." \/>/);
  assert.match(html, /property="og:description" content="Specific article lead from the saved body\."/);
  assert.match(html, /name="twitter:description" content="Specific article lead from the saved body\."/);
  assert.ok(schemaScript);
  assert.equal(JSON.parse(schemaScript[1]).description, "Specific article lead from the saved body.");
  assert.doesNotMatch(html, /Your go-to source for tech/);
});

test("article body eligibility ignores blank or executable-only HTML", () => {
  assert.equal(hasMeaningfulArticleBody(""), false);
  assert.equal(hasMeaningfulArticleBody("<p> &nbsp; </p><script>alert(1)</script>"), false);
  assert.equal(hasMeaningfulArticleBody("<p>Actual article content.</p>"), true);
  assert.equal(hasMeaningfulArticleBody('<figure><img src="https://images.example.test/story.jpg" alt="Story"></figure>'), true);
});

test("category listing links to article URLs using the canonical host", () => {
  const html = renderListingDocument(template, {
    pathname: "/category/tech",
    title: "Tech",
    description: "Technology news.",
    articles: [{ slug: "gpu-news", title: "GPU News", excerpt: "A GPU update." }],
  });

  assert.match(html, /<link rel="canonical" href="https:\/\/scrolltek\.name\.ng\/category\/tech" \/>/);
  assert.match(html, /<a href="\/article\/gpu-news">GPU News<\/a>/);
  assert.equal(SITE_ORIGIN, "https://scrolltek.name.ng");
});

test("author pages render profile data and article links with Person structured data", () => {
  const html = renderAuthorDocument(template, {
    pathname: "/author/maya-chen",
    name: "Maya Chen",
    jobTitle: "Senior Tech & AI Writer",
    description: "Writing about technology.",
    avatarUrl: "https://images.example.test/maya.jpg",
    articles: [{ slug: "ai-phones", title: "AI Phones", excerpt: "An overview." }],
  });

  assert.match(html, /<h1>Maya Chen<\/h1>/);
  assert.match(html, /<a href="\/article\/ai-phones">AI Phones<\/a>/);
  assert.match(html, /id="author-jsonld"/);
  assert.match(html, /"@type":"Person"/);
  assert.match(html, /rel="canonical" href="https:\/\/scrolltek\.name\.ng\/author\/maya-chen"/);
});

test("generic routes receive path-specific canonical, metadata, and robots directives", () => {
  const html = renderCanonicalDocument(template, "/search?q=ai", {
    title: "Search Scrolltek",
    heading: "Search Scrolltek",
    description: "Search articles.",
    robots: "noindex, follow",
  });

  assert.match(html, /<title>Search Scrolltek<\/title>/);
  assert.match(html, /<main id="ssr"><h1>Search Scrolltek<\/h1><p>Search articles\.<\/p><\/main>/);
  assert.doesNotMatch(html, /homepage-fallback/);
  assert.match(html, /rel="canonical" href="https:\/\/scrolltek\.name\.ng\/search"/);
  assert.match(html, /name="robots" content="noindex, follow"/);
  assert.match(html, /property="og:url" content="https:\/\/scrolltek\.name\.ng\/search"/);
  assert.doesNotMatch(html, /\/search\?q=ai/);
});

test("not-found documents are noindex and do not advertise a canonical URL", () => {
  const html = renderNotFoundDocument(template, "/article/missing-slug");

  assert.match(html, /name="robots" content="noindex, follow"/);
  assert.match(html, /Page not found/);
  assert.doesNotMatch(html, /rel="canonical"/);
  assert.doesNotMatch(html, /property="og:url"/);
  assert.doesNotMatch(html, /homepage-fallback/);
});

test("canonical URLs always use the apex host and normalize path/query noise", () => {
  assert.equal(
    canonicalUrlForPath("/category//tech/?q=ai#top"),
    "https://scrolltek.name.ng/category/tech",
  );
  assert.equal(canonicalUrlForPath("article/example"), "https://scrolltek.name.ng/article/example");
  assert.equal(canonicalUrlForPath("/"), SITE_ORIGIN + "/");
});

test("article metadata and JSON-LD escape untrusted text and do not invent an author", () => {
  const html = renderArticleDocument(template, {
    slug: "safe-slug",
    title: '<img src=x onerror="alert(1)"> & "quoted"',
    excerpt: "<script>alert(1)</script>",
    body: "<p onclick=\"run()\">Visible body</p><script>alert(2)</script>",
    category: "Tech",
    published_at: "not-a-date",
  });

  assert.match(html, /&lt;img src=x onerror=&quot;alert\(1\)&quot;&gt;/);
  assert.doesNotMatch(html, /<img[^>]*onerror=|onclick="run\(\)"|<script>alert|datePublished|dateModified/);
  assert.match(html, /Visible body/);
  assert.doesNotMatch(html, /By Scrolltek Staff|"author"/);
  assert.ok(html.includes("\\u003cscript\\u003ealert(1)\\u003c/script\\u003e"));
});

test("route metadata replaces duplicate title, canonical, and social tags", () => {
  const duplicateTemplate = template.replace(
    "</head>",
    '<title>Duplicate</title><meta name="description" content="Duplicate"><link rel="canonical" href="https://www.scrolltek.name.ng/"><meta property="og:url" content="https://www.scrolltek.name.ng/"></head>',
  );
  const html = renderCanonicalDocument(duplicateTemplate, "/about", {
    title: "About Scrolltek",
    heading: "About Scrolltek",
    description: "About the publication.",
  });

  assert.equal((html.match(/<title>/g) ?? []).length, 1);
  assert.equal((html.match(/name="description"/g) ?? []).length, 1);
  assert.equal((html.match(/rel="canonical"/g) ?? []).length, 1);
  assert.equal((html.match(/property="og:url"/g) ?? []).length, 1);
  assert.doesNotMatch(html, /www\\.scrolltek\\.name\\.ng/);
});

test("head metadata and JSON-LD updates ignore tag-shaped script, style, comment, and body text", () => {
  const scriptDecoy = '<script>const sample = \'<title>Embedded title</title><meta name="description" content="script description"><link rel="canonical" href="https://example.test/script">\'; const root = \'<div id="root"></div><noscript id="homepage-fallback">script fallback</noscript>\';</script>';
  const styleDecoy = '<style>.fake::after { content: \'<meta property="og:url" content="https://example.test/style">\'; }</style>';
  const commentDecoy = '<!-- <meta name="description" content="comment description"> -->';
  const bodyDecoy = '<script>const sample = \'<meta name="description" content="body description"><div id="root"></div><noscript id="homepage-fallback">body fallback</noscript>\';</script>';
  const bodySchema = '<script type="application/ld+json" id="author-jsonld">{"@type":"BodySchema"}</script>';
  const templateWithDecoys = `<!doctype html><html><head>${scriptDecoy}${styleDecoy}${commentDecoy}
<title>Original title</title>
<meta name="description" content="Original description">
<link rel="canonical" href="https://scrolltek.name.ng/">
<script type="application/ld+json" id="article-jsonld">{"@type":"OldSchema"}</script>
</head><body>${bodyDecoy}<noscript id="homepage-fallback">Real homepage fallback</noscript><div id="root"></div>${bodySchema}</body></html>`;

  const articleHtml = renderArticleDocument(templateWithDecoys, {
    slug: "safe-story",
    title: "Safe Story",
    excerpt: "A safe summary.",
    body: "<p>Safe body.</p>",
    published_at: "2026-10-01T12:00:00.000Z",
  });
  const headEnd = articleHtml.indexOf("</head>");
  const head = articleHtml.slice(0, headEnd);
  const articleSchema = head.match(/<script type="application\/ld\+json" id="article-jsonld">([^<]+)<\/script>/);

  assert.ok(articleSchema);
  assert.equal(JSON.parse(articleSchema[1]).headline, "Safe Story");
  assert.match(head, /<title>Safe Story — Scrolltek<\/title>/);
  assert.match(head, /<meta name="description" content="A safe summary\." \/>/);
  assert.match(head, /<link rel="canonical" href="https:\/\/scrolltek\.name\.ng\/article\/safe-story" \/>/);
  assert.ok(articleHtml.includes(scriptDecoy));
  assert.ok(articleHtml.includes(styleDecoy));
  assert.ok(articleHtml.includes(commentDecoy));
  assert.ok(articleHtml.includes(bodyDecoy));
  assert.ok(articleHtml.includes(bodySchema));
  assert.match(articleHtml, /<div id="seo-prerender" data-pending="true"><main id="ssr"><article>/);
  assert.match(articleHtml, /<\/div><div id="root"><\/div>/);
  assert.doesNotMatch(articleHtml, /Real homepage fallback/);
  assert.doesNotMatch(head, /OldSchema/);

  const notFoundHtml = renderNotFoundDocument(templateWithDecoys, "/missing");
  const notFoundHead = notFoundHtml.slice(0, notFoundHtml.indexOf("</head>"));
  assert.doesNotMatch(notFoundHead, /id="article-jsonld"/);
  assert.ok(notFoundHtml.includes(bodySchema));
  assert.match(notFoundHtml, /<div id="root"><main id="ssr"><h1>Page not found<\/h1>/);
  assert.doesNotMatch(notFoundHtml, /Real homepage fallback/);
  assert.ok(notFoundHtml.includes(scriptDecoy));
  assert.ok(notFoundHtml.includes(styleDecoy));
});

test("editorial-team schema is an Organization rather than a fabricated Person", () => {
  const html = renderAuthorDocument(template, {
    pathname: "/author/scrolltek-editorial",
    name: "Scrolltek Editorial",
    jobTitle: "Editorial Team",
    description: "The Scrolltek editorial team covers published stories.",
    articles: [],
  });
  const script = html.match(/<script type="application\/ld\+json" id="author-jsonld">([^<]+)<\/script>/);
  assert.ok(script);
  const data = JSON.parse(script[1]);
  assert.equal(data["@type"], "Organization");
  assert.equal(data.url, "https://scrolltek.name.ng/author/scrolltek-editorial");
  assert.ok(!Object.hasOwn(data, "jobTitle"));
  assert.ok(!Object.hasOwn(data, "worksFor"));

  const articleHtml = renderArticleDocument(template, {
    slug: "editorial-story",
    title: "Editorial Story",
    body: "<p>Accurate content.</p>",
    author_name: "Scrolltek Editorial",
  });
  const articleScript = articleHtml.match(/<script type="application\/ld\+json" id="article-jsonld">([^<]+)<\/script>/);
  assert.ok(articleScript);
  assert.equal(JSON.parse(articleScript[1]).author["@type"], "Organization");
});

test("homepage fallback remains on the homepage but is removed from route documents", () => {
  const homepage = renderCanonicalDocument(template, "/", { title: "Scrolltek" });
  const about = renderCanonicalDocument(template, "/about", {
    title: "About Us — Scrolltek",
    heading: "About Scrolltek",
    description: "About description.",
  });

  assert.match(homepage, /homepage-fallback/);
  assert.doesNotMatch(about, /homepage-fallback/);
  assert.match(about, /<h1>About Scrolltek<\/h1>/);
});
