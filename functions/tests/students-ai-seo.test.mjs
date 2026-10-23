import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, statSync } from "node:fs";
import { applyArticleContentOverride, getArticleSeoOverride } from "../lib/article-seo.mjs";
import { renderArticleDocument } from "../lib/seo-html.mjs";
import { buildSitemapXml } from "../sitemap.xml.mjs";

const TEMPLATE = readFileSync(new URL("../../artifacts/media-site/index.html", import.meta.url), "utf8");
const SETUP_SOURCE = readFileSync(new URL("../../api/setup.mjs", import.meta.url), "utf8");
const ENSURE_SEEDED_SOURCE = readFileSync(new URL("../../lib/db/src/ensure-seeded.ts", import.meta.url), "utf8");
const SVG_SOURCE = readFileSync(
  new URL("../../artifacts/media-site/public/images/ai-study-active-recall-workflow.svg", import.meta.url),
  "utf8",
);

const SLUG = "ai-tools-for-students-2026";
const SITE_URL = "https://scrolltek.name.ng";
const LIVE_PUBLISHED_AT = "2026-05-27T17:15:38.636Z";

test("ai-tools-for-students-2026 passes all Section 1–6 SEO, image, schema, link, and sitemap gates", () => {
  const row = applyArticleContentOverride({
    id: 125,
    slug: SLUG,
    title: "Old Title",
    subtitle: "Old Subtitle",
    excerpt: "Old Excerpt",
    body: "<p>Old Body</p>",
    category: "AI Tools",
    author_id: 5,
    author_name: "Anya Patel",
    image_url: "https://images.pexels.com/old.jpg",
    published_at: LIVE_PUBLISHED_AT,
    read_time: 7,
    tags: ["Old"],
    published: true,
  });

  // Preserved metadata + updated fields
  assert.equal(row.slug, SLUG);
  assert.equal(row.category, "AI Tools");
  assert.equal(row.author_name, "Anya Patel");
  assert.equal(row.published_at, LIVE_PUBLISHED_AT);
  assert.equal(row.read_time, 10);
  assert.equal(row.title, "Best AI Tools for Students in 2026: What to Use and How");
  assert.equal(row.image_url, "/images/ai-tools-for-students-study-guide.webp");
  assert.deepEqual(row.tags, [
    "ai tools for students",
    "AI study tools",
    "student productivity",
    "AI note taking",
    "study apps",
    "ChatGPT for students",
    "academic integrity",
  ]);

  const html = renderArticleDocument(TEMPLATE, row);

  // Zero unresolved placeholders or wrong domains
  assert.doesNotMatch(html, /\[IMG-HERO\]|\[IMG-2\]|REPLACE WITH/i);
  assert.doesNotMatch(html, /www\.scrolltek\.name\.ng|scrolltek\.com/i);

  // Exact single H1 & exact head tags
  const h1Matches = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)];
  assert.equal(h1Matches.length, 1, "exactly one H1");
  assert.equal(h1Matches[0][1], "Best AI Tools for Students in 2026: What to Use and How");

  assert.match(html, /<title>Best AI Tools for Students in 2026 \(Free &amp; Paid\) — Scrolltek<\/title>/);
  assert.match(
    html,
    /<meta name="description" content="The best AI tools for students in 2026 for notes, research, writing and revision\. See what&#39;s free, what&#39;s worth paying for and how to use them well\."\s*\/?>/,
  );
  assert.match(html, /<link rel="canonical" href="https:\/\/scrolltek\.name\.ng\/article\/ai-tools-for-students-2026"\s*\/?>/);
  assert.match(html, /<meta name="robots" content="index, follow, max-image-preview:large"\s*\/?>/);
  assert.match(html, /property="og:title" content="Best AI Tools for Students in 2026: What to Use and How"/);
  assert.match(
    html,
    /property="og:description" content="Compare AI study tools for notes, research, writing and revision\. Find free options, compare paid plans and learn responsible study methods\."/,
  );
  assert.match(html, /property="og:url" content="https:\/\/scrolltek\.name\.ng\/article\/ai-tools-for-students-2026"/);
  assert.match(html, /property="og:type" content="article"/);
  assert.match(html, /property="og:image" content="https:\/\/scrolltek\.name\.ng\/images\/ai-tools-for-students-study-guide\.webp"/);
  assert.match(html, /name="twitter:card" content="summary_large_image"/);
  assert.match(html, /name="twitter:title" content="Best AI Tools for Students in 2026: What to Use and How"/);
  assert.match(
    html,
    /name="twitter:description" content="Compare AI study tools for notes, research, writing and revision\. Find free options, compare paid plans and learn responsible study methods\."/,
  );
  assert.match(html, /name="twitter:image" content="https:\/\/scrolltek\.name\.ng\/images\/ai-tools-for-students-study-guide\.webp"/);
  assert.match(html, /property="article:published_time" content="2026-05-27T17:15:38\.636Z"/);
  assert.match(html, /property="article:modified_time" content="2026-10-23T00:00:00Z"/);
  assert.match(html, /property="article:author" content="Anya Patel"/);
  assert.match(html, /property="article:section" content="AI Tools"/);
  for (const tag of row.tags) {
    assert.ok(html.includes(`<meta property="article:tag" content="${tag}" />`), `article:tag present for ${tag}`);
  }

  // Hero WebP & Active Recall SVG attributes, captions, and file sizes
  assert.match(
    html,
    /<img src="https:\/\/scrolltek\.name\.ng\/images\/ai-tools-for-students-study-guide\.webp" alt="Student study desk with a laptop, notes and revision materials representing AI tools for students" width="1200" height="630" loading="eager" fetchpriority="high" decoding="async"\s*\/?><figcaption>AI study tools can support research, note-taking and revision while students remain responsible for their learning\.<\/figcaption>/,
  );
  assert.match(
    html,
    /<img src="https:\/\/scrolltek\.name\.ng\/images\/ai-study-active-recall-workflow\.svg" alt="Five-step AI study workflow showing learning, recall, feedback, review and independent practice" width="1200" height="675" loading="lazy" decoding="async"\s*\/?>\s*<figcaption>Use AI to create practice opportunities, then retrieve the answer and verify it independently\.<\/figcaption>/,
  );

  const heroStat = statSync(
    new URL("../../artifacts/media-site/public/images/ai-tools-for-students-study-guide.webp", import.meta.url),
  );
  const svgStat = statSync(
    new URL("../../artifacts/media-site/public/images/ai-study-active-recall-workflow.svg", import.meta.url),
  );
  assert.ok(heroStat.size > 1000 && heroStat.size <= 200 * 1024, "hero WebP <= 200 KB");
  assert.ok(svgStat.size > 500 && svgStat.size <= 150 * 1024, "workflow SVG <= 150 KB");
  assert.match(SVG_SOURCE, /<title[^>]*>A Better Study Loop: Active Recall With AI<\/title>/);
  assert.match(SVG_SOURCE, /<desc[^>]*>[\s\S]{20,}<\/desc>/);
  for (const stage of ["1. LEARN", "2. RECALL", "3. TEST", "4. VERIFY", "5. REPEAT", "AI supports the process. You do the learning."]) {
    assert.ok(SVG_SOURCE.includes(stage), `SVG includes "${stage}"`);
  }

  // Structured data: @graph with Article, BreadcrumbList, FAQPage, ItemList and NO Product/Review/Rating
  const rawLdStrings = [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map(
    ([, json]) => json,
  );
  for (const raw of rawLdStrings) {
    assert.doesNotMatch(raw, /"@type"\s*:\s*"(?:Product|Review|AggregateRating|Rating)"/i);
  }
  const graphDoc = rawLdStrings.map((r) => JSON.parse(r)).find((doc) => Array.isArray(doc["@graph"]));
  assert.ok(graphDoc, "@graph JSON-LD block rendered");
  const articleSchema = graphDoc["@graph"].find((n) => n["@type"] === "Article");
  const breadcrumbSchema = graphDoc["@graph"].find((n) => n["@type"] === "BreadcrumbList");
  const faqSchema = graphDoc["@graph"].find((n) => n["@type"] === "FAQPage");
  const itemListSchema = graphDoc["@graph"].find((n) => n["@type"] === "ItemList");

  assert.equal(articleSchema.author.name, "Anya Patel");
  assert.equal(articleSchema.author.url, "https://scrolltek.name.ng/author/anya-patel");
  assert.equal(articleSchema.datePublished, LIVE_PUBLISHED_AT);
  assert.equal(articleSchema.dateModified, "2026-10-23T00:00:00Z");
  assert.equal(articleSchema.articleSection, "AI Tools");
  assert.equal(breadcrumbSchema.itemListElement[1].name, "AI Tools");
  assert.equal(breadcrumbSchema.itemListElement[1].item, "https://scrolltek.name.ng/category/ai-tools");
  assert.equal(faqSchema.mainEntity.length, 6);
  for (const entity of faqSchema.mainEntity) {
    assert.ok(html.includes(entity.name), `FAQ question visible: ${entity.name}`);
    assert.ok(
      html.includes(entity.acceptedAnswer.text.replace(/'/g, "&#39;")) || html.includes(entity.acceptedAnswer.text),
      `FAQ answer visible verbatim for: ${entity.name}`,
    );
  }
  assert.equal(itemListSchema.numberOfItems, 8);

  // Outbound & inbound internal links verified
  const internalSlugs = [...row.body.matchAll(/href="\/article\/([a-z0-9-]+)"/g)].map(([, slug]) => slug);
  assert.deepEqual(internalSlugs, [
    "chatgpt-claude-gemini-comparison-2026",
    "second-brain-apps-2026",
    "ai-prompt-formula-better-answers-2026",
    "ai-tools-saving-hours-every-week-2026",
  ]);
  for (const slug of internalSlugs) {
    assert.ok(SETUP_SOURCE.includes(`slug: '${slug}'`), `${slug} seeded in api/setup.mjs`);
    assert.ok(ENSURE_SEEDED_SOURCE.includes(`slug: "${slug}"`), `${slug} seeded in ensure-seeded.ts`);
  }

  for (const inboundSlug of [
    "chatgpt-claude-gemini-comparison-2026",
    "ai-prompt-formula-better-answers-2026",
    "ai-tools-saving-hours-every-week-2026",
  ]) {
    assert.ok(
      SETUP_SOURCE.split(`'${inboundSlug}': \``)[1].split("`,\n")[0].includes(`/article/${SLUG}`),
      `inbound link to /article/${SLUG} present in ${inboundSlug} (api/setup.mjs)`,
    );
  }

  // Sitemap lastmod
  assert.ok(getArticleSeoOverride(SLUG));
  const sitemap = buildSitemapXml([
    { slug: SLUG, published: true, body: row.body, published_at: LIVE_PUBLISHED_AT },
  ]);
  assert.match(
    sitemap,
    /<loc>https:\/\/scrolltek\.name\.ng\/article\/ai-tools-for-students-2026<\/loc>\s*<lastmod>2026-10-23T00:00:00\.000Z<\/lastmod>/,
  );
});
