import { Router } from "express";
import { db, articlesTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";

const router = Router();
const SITE_URL = "https://scrolltek.name.ng";

// Only emit lastmod where a meaningful last-edit date is known. Dynamic pages
// and pages without tracked update dates omit the field rather than using today.
const STATIC_PAGES = [
  { path: "/", priority: "1.0", changefreq: "daily", lastmod: null },
  { path: "/about", priority: "0.5", changefreq: "monthly", lastmod: "2026-05-25" },
  { path: "/contact", priority: "0.5", changefreq: "monthly", lastmod: "2026-05-25" },
  { path: "/privacy", priority: "0.3", changefreq: "yearly", lastmod: "2026-05-25" },
  { path: "/category/tech", priority: "0.8", changefreq: "daily", lastmod: null },
  { path: "/category/culture", priority: "0.8", changefreq: "daily", lastmod: null },
  { path: "/category/lifestyle", priority: "0.8", changefreq: "daily", lastmod: null },
  { path: "/category/ai-tools", priority: "0.8", changefreq: "daily", lastmod: null },
  { path: "/category/phone-tips", priority: "0.8", changefreq: "daily", lastmod: null },
  { path: "/category/productivity", priority: "0.8", changefreq: "daily", lastmod: null },
  { path: "/category/trending", priority: "0.8", changefreq: "daily", lastmod: null },
  { path: "/author/maya-chen", priority: "0.6", changefreq: "weekly", lastmod: null },
  { path: "/author/james-okafor", priority: "0.6", changefreq: "weekly", lastmod: null },
  { path: "/author/sofia-reyes", priority: "0.6", changefreq: "weekly", lastmod: null },
  { path: "/author/liam-park", priority: "0.6", changefreq: "weekly", lastmod: null },
  { path: "/author/anya-patel", priority: "0.6", changefreq: "weekly", lastmod: null },
];

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

router.get("/sitemap.xml", async (req, res) => {
  try {
    const articles = await db
      .select({
        slug: articlesTable.slug,
        title: articlesTable.title,
        imageUrl: articlesTable.imageUrl,
      })
      .from(articlesTable)
      .where(eq(articlesTable.published, true))
      .orderBy(desc(articlesTable.publishedAt));

    const urlEntries: string[] = [];

    for (const page of STATIC_PAGES) {
      const lastmod = page.lastmod ? `\n    <lastmod>${page.lastmod}</lastmod>` : "";
      urlEntries.push(`  <url>
    <loc>${escapeXml(SITE_URL + page.path)}</loc>${lastmod}
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`);
    }

    for (const article of articles) {
      const loc = escapeXml(SITE_URL + "/article/" + encodeURIComponent(article.slug));
      const imageBlock = article.imageUrl
        ? `
    <image:image>
      <image:loc>${escapeXml(article.imageUrl)}</image:loc>
      <image:title>${escapeXml(article.title)}</image:title>
    </image:image>`
        : "";
      urlEntries.push(`  <url>
    <loc>${loc}</loc>
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
  const content = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /admin/

User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Claude-Web
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Googlebot
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
