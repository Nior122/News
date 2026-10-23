import { Router } from "express";
import { and, desc, eq, notInArray, sql } from "drizzle-orm";
import { articlesTable, db } from "@workspace/db";

const router = Router();
const SITE_URL = "https://scrolltek.name.ng";

// Canonical, indexable static pages only — mirrors functions/sitemap.xml.mjs,
// which serves the canonical origin. noindex routes must never appear here.
const STATIC_PAGES = [
  { path: "/", priority: "1.0", changefreq: "daily" },
  { path: "/about", priority: "0.5", changefreq: "monthly" },
  { path: "/contact", priority: "0.5", changefreq: "monthly" },
  { path: "/privacy", priority: "0.3", changefreq: "yearly" },
];

// Every valid, indexable category page. Mirrors functions/lib/site-categories.mjs.
// The router decides whether a category page exists, not the categories table:
// ai-productivity and culture-lifestyle are virtual mixed pages with no row of
// their own, but they render real content with a self-referential canonical.
const CATEGORY_SLUGS = [
  "tech",
  "culture",
  "lifestyle",
  "ai-tools",
  "phone-tips",
  "productivity",
  "trending",
  "ai-productivity",
  "culture-lifestyle",
];

// Retired URLs that 301 to a canonical revision. Mirrors
// functions/lib/article-routing.mjs — only the destination is published.
const REDIRECTED_ARTICLE_SLUGS = [
  "why-ai-phones-are-becoming-the-future",
  "ai-smart-glasses-future",
];

const ARTICLE_LASTMOD_OVERRIDES: Record<string, string> = {
  "what-is-vibe-coding-2026": "2026-10-23T00:00:00.000Z",
};

function escapeXml(str: string): string {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** A slug that would produce a broken or unsafe path segment. */
function isSafePathSegment(value: string): boolean {
  if (!value || value === "." || value === "..") return false;
  return !/[\\/?#]|[\u0000-\u001f\u007f]/.test(value);
}

/**
 * Real publication date as a W3C lastmod, or null. Never fall back to "today":
 * a fabricated lastmod is worse for crawl trust than omitting the element.
 */
function lastmodFor(value: Date | string | null | undefined): string | null {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
}

/** Body counts as renderable when it has readable text or at least an image. */
function hasMeaningfulArticleBody(input: string | null | undefined): boolean {
  const stripped = String(input ?? "")
    .replace(/<\s*(script|style)\b[\s\S]*?<\s*\/\s*\1\s*>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;|&#160;|&#xA0;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
  return stripped.length > 0 || /<img\b/i.test(String(input ?? ""));
}

router.get("/sitemap.xml", async (req, res) => {
  try {
    const articleRows = await db
      .select({
        slug: articlesTable.slug,
        title: articlesTable.title,
        body: articlesTable.body,
        imageUrl: articlesTable.imageUrl,
        publishedAt: articlesTable.publishedAt,
      })
      .from(articlesTable)
      .where(
        and(
          eq(articlesTable.published, true),
          notInArray(articlesTable.slug, REDIRECTED_ARTICLE_SLUGS),
          sql`BTRIM(COALESCE(${articlesTable.title}, '')) <> ''`,
          sql`BTRIM(COALESCE(${articlesTable.body}, '')) <> ''`,
        ),
      )
      .orderBy(desc(articlesTable.publishedAt));

    const urlEntries: string[] = [];
    const seen = new Set<string>();

    for (const page of STATIC_PAGES) {
      const loc = SITE_URL + page.path;
      if (seen.has(loc)) continue;
      seen.add(loc);
      urlEntries.push(`  <url>
    <loc>${escapeXml(loc)}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`);
    }

    // Every valid category page. The list comes from the router, not from the
    // categories table, so the virtual mixed pages are included too.
    for (const slug of CATEGORY_SLUGS) {
      const loc = `${SITE_URL}/category/${encodeURIComponent(slug)}`;
      if (seen.has(loc)) continue;
      seen.add(loc);
      urlEntries.push(`  <url>
    <loc>${escapeXml(loc)}</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`);
    }

    for (const article of articleRows) {
      const slug = String(article.slug ?? "").trim();
      if (!isSafePathSegment(slug)) continue;
      if (!hasMeaningfulArticleBody(article.body)) continue;
      const loc = `${SITE_URL}/article/${encodeURIComponent(slug)}`;
      if (seen.has(loc)) continue;
      seen.add(loc);

      const lastmod = lastmodFor(ARTICLE_LASTMOD_OVERRIDES[slug] ?? article.publishedAt);
      const resolvedImageUrl = article.imageUrl
        ? new URL(article.imageUrl, `${SITE_URL}/`).href
        : null;
      const imageBlock = resolvedImageUrl
        ? `
    <image:image>
      <image:loc>${escapeXml(resolvedImageUrl)}</image:loc>
      <image:title>${escapeXml(article.title)}</image:title>
    </image:image>`
        : "";
      urlEntries.push(`  <url>
    <loc>${escapeXml(loc)}</loc>${lastmod ? `\n    <lastmod>${escapeXml(lastmod)}</lastmod>` : ""}
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>${imageBlock}
  </url>`);
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urlEntries.join("\n")}
</urlset>`;

    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.send(xml);
  } catch (err) {
    req.log.error(err);
    res.status(500).send("Failed to generate sitemap");
  }
});

router.get("/robots.txt", (_req, res) => {
  // Exactly the three directives, matching functions/robots.txt.mjs on the
  // canonical origin. Admin URLs stay out of the index via the noindex meta
  // and X-Robots-Tag the SSR layer sets, not via a robots rule.
  const content = `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml`;

  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=86400");
  res.send(content);
});

router.get("/ads.txt", (_req, res) => {
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=86400");
  res.send("google.com, pub-3931662977705623, DIRECT, f08c47fec0942fa0\n");
});

export default router;
