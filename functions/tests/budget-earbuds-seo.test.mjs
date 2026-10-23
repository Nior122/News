import assert from "node:assert/strict";
import { readFileSync, statSync } from "node:fs";
import test from "node:test";
import { renderArticleDocument } from "../lib/seo-html.mjs";
import {
  applyArticleContentOverride,
  getArticleSeoOverride,
} from "../lib/article-seo.mjs";
import { buildSitemapXml } from "../sitemap.xml.mjs";

const TEMPLATE = readFileSync(
  new URL("../../artifacts/media-site/index.html", import.meta.url),
  "utf8",
);

const SETUP_SOURCE = readFileSync(
  new URL("../../api/setup.mjs", import.meta.url),
  "utf8",
);

const ENSURE_SEEDED_SOURCE = readFileSync(
  new URL("../../lib/db/src/ensure-seeded.ts", import.meta.url),
  "utf8",
);

test("best-budget-wireless-earbuds-2026 renders verified SEO metadata, TOC, ItemList/FAQ JSON-LD, links, and real WebP images", () => {
  const row = applyArticleContentOverride({
    slug: "best-budget-wireless-earbuds-2026",
    title: "Old Title",
    subtitle: "Old Subtitle",
    excerpt: "Old Excerpt",
    body: "<p>Old body</p>",
    category: "Phone Tips",
    image_url: "https://images.pexels.com/old.jpg",
    published_at: "2026-06-02T09:00:00.000Z",
    author_name: "James Okafor",
    author_slug: "james-okafor",
    read_time: 9,
    tags: [],
  });

  const seo = getArticleSeoOverride("best-budget-wireless-earbuds-2026");
  assert.ok(seo, "SEO override exists");
  assert.ok(seo.metaTitle.length <= 60, `metaTitle length ${seo.metaTitle.length} <= 60`);
  assert.ok(
    seo.metaDescription.length >= 140 && seo.metaDescription.length <= 160,
    `metaDescription length ${seo.metaDescription.length} within 140-160`,
  );

  // Zero leftover editorial notes, UTM query strings, www/scrolltek.com links, or broken 404 URLs
  assert.doesNotMatch(
    row.body,
    /\[UNVERIFIED|\[PROVISIONAL|\[INTERNAL LINK|\[IMG-|utm_source=|www\.scrolltek|scrolltek\.com|liberty-4-nc-a3947011/i,
  );

  const html = renderArticleDocument(TEMPLATE, row);

  // Exact single H1 + exact title tag + robots + non-www canonical + social head tags
  assert.equal((html.match(/<h1\b/gi) ?? []).length, 1, "exactly one H1");
  const fullTitle = html.match(/<title>([^<]+)<\/title>/)?.[1] ?? "";
  assert.equal(fullTitle, "Best Budget Wireless Earbuds in 2026 (Top 6) — Scrolltek");
  assert.match(html, /<h1>Best Budget Wireless Earbuds in 2026: Our Top 6 Picks<\/h1>/);
  assert.match(html, /<link rel="canonical" href="https:\/\/scrolltek\.name\.ng\/article\/best-budget-wireless-earbuds-2026" \/>/);
  assert.match(html, /name="robots" content="index, follow, max-image-preview:large"/);
  assert.match(html, /property="og:type" content="article"/);
  assert.match(html, /property="og:image" content="https:\/\/scrolltek\.name\.ng\/images\/best-budget-wireless-earbuds-2026-hero\.webp"/);
  assert.match(html, /property="article:published_time" content="2026-06-02T09:00:00\.000Z"/);
  assert.match(html, /property="article:modified_time" content="2026-10-23T00:00:00\.000Z"/);
  assert.match(html, /name="twitter:card" content="summary_large_image"/);
  assert.match(html, /Last updated: October 2026/);
  assert.match(html, /<nav aria-label="Table of contents">/);

  // Exact hero & commute image attributes, alts, and visible captions
  assert.match(
    html,
    /<img src="https:\/\/scrolltek\.name\.ng\/images\/best-budget-wireless-earbuds-2026-hero\.webp" alt="Pair of wireless earbuds beside their charging case" width="1200" height="630" fetchpriority="high" decoding="async"><figcaption>You no longer need to spend \$250 to get good wireless earbuds\. Photo: Atelier by Vineeth \/ Unsplash\.<\/figcaption>/,
  );
  assert.match(
    html,
    /<img src="https:\/\/scrolltek\.name\.ng\/images\/budget-earbuds-commute-use\.webp" alt="Commuter wearing wireless earbuds on a train" width="1200" height="800" loading="lazy" decoding="async">\s*<figcaption>Noise cancelling is the feature commuters notice most\. Photo: Burst \/ Pexels\.<\/figcaption>/,
  );

  // JSON-LD schemas: Article + BreadcrumbList + ItemList + FAQPage (NO Product, Review, or AggregateRating)
  const rawLdStrings = [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map(
    ([, json]) => json,
  );
  for (const raw of rawLdStrings) {
    assert.doesNotMatch(raw, /"@type"\s*:\s*"(?:Product|Review|AggregateRating)"/i);
  }
  const ldBlocks = rawLdStrings.map((raw) => JSON.parse(raw));
  const articleSchema = ldBlocks.find((item) => item["@type"] === "Article");
  const breadcrumbSchema = ldBlocks.find((item) => item["@type"] === "BreadcrumbList");
  const itemListSchema = ldBlocks.find((item) => item["@type"] === "ItemList");
  const faqSchema = ldBlocks.find((item) => item["@type"] === "FAQPage");

  assert.ok(articleSchema, "Article JSON-LD present");
  assert.equal(articleSchema.datePublished, "2026-06-02T09:00:00.000Z");
  assert.equal(articleSchema.dateModified, "2026-10-23T00:00:00.000Z");
  assert.equal(articleSchema.author.name, "James Okafor");
  assert.ok(breadcrumbSchema, "BreadcrumbList JSON-LD present");
  assert.equal(breadcrumbSchema.itemListElement.length, 3, "Home > Category > Article breadcrumb");
  assert.ok(itemListSchema, "ItemList JSON-LD present");
  assert.equal(itemListSchema.numberOfItems, 6, "all 6 picks in ItemList schema");
  assert.ok(faqSchema, "FAQPage JSON-LD present");
  assert.equal(faqSchema.mainEntity.length, 6, "all 6 FAQs in FAQPage schema");
  for (const entity of faqSchema.mainEntity) {
    assert.ok(html.includes(entity.name), `visible FAQ includes question: ${entity.name}`);
    assert.ok(html.includes(entity.acceptedAnswer.text), `visible FAQ includes exact answer for: ${entity.name}`);
  }

  // All internal /article/... links resolve to real seeded articles in both seed files
  const internalSlugs = [...row.body.matchAll(/href="\/article\/([a-z0-9-]+)"/g)].map(([, slug]) => slug);
  assert.ok(internalSlugs.length >= 4, "at least 4 internal article links");
  for (const slug of internalSlugs) {
    assert.ok(SETUP_SOURCE.includes(`slug: '${slug}'`), `internal link /article/${slug} exists in api/setup.mjs`);
    assert.ok(ENSURE_SEEDED_SOURCE.includes(`slug: "${slug}"`), `internal link /article/${slug} exists in ensure-seeded.ts`);
  }

  // Self-hosted WebP images exist and obey size budgets (<200 KB hero, <150 KB commute image)
  const heroStat = statSync(
    new URL("../../artifacts/media-site/public/images/best-budget-wireless-earbuds-2026-hero.webp", import.meta.url),
  );
  const commuteStat = statSync(
    new URL("../../artifacts/media-site/public/images/budget-earbuds-commute-use.webp", import.meta.url),
  );
  assert.ok(heroStat.size > 1000 && heroStat.size < 200 * 1024, "hero WebP under 200 KB");
  assert.ok(commuteStat.size > 1000 && commuteStat.size < 150 * 1024, "commute WebP under 150 KB");

  // Sitemap uses updated dateModified (2026-10-23T00:00:00.000Z)
  const sitemap = buildSitemapXml([
    {
      slug: "best-budget-wireless-earbuds-2026",
      published: true,
      body: row.body,
      published_at: "2026-06-02T09:00:00.000Z",
    },
  ]);
  assert.match(
    sitemap,
    /<loc>https:\/\/scrolltek\.name\.ng\/article\/best-budget-wireless-earbuds-2026<\/loc>\s*<lastmod>2026-10-23T00:00:00\.000Z<\/lastmod>/,
  );
});
