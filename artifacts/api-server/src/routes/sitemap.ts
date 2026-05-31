import { Router } from "express";
import { db, articlesTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";

const router = Router();

const STATIC_PAGES = [
  { path: "/", priority: "1.0", changefreq: "daily" },
  { path: "/about", priority: "0.5", changefreq: "monthly" },
  { path: "/contact", priority: "0.5", changefreq: "monthly" },
  { path: "/privacy", priority: "0.3", changefreq: "yearly" },
  { path: "/category/tech", priority: "0.8", changefreq: "daily" },
  { path: "/category/culture", priority: "0.8", changefreq: "daily" },
  { path: "/category/lifestyle", priority: "0.8", changefreq: "daily" },
  { path: "/category/ai-tools", priority: "0.8", changefreq: "daily" },
  { path: "/category/phone-tips", priority: "0.8", changefreq: "daily" },
  { path: "/category/productivity", priority: "0.8", changefreq: "daily" },
  { path: "/category/trending", priority: "0.8", changefreq: "daily" },
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
    const siteUrl =
      process.env.SITE_URL ??
      `https://${req.headers.host}`;

    const articles = await db
      .select({
        slug: articlesTable.slug,
        title: articlesTable.title,
        imageUrl: articlesTable.imageUrl,
        publishedAt: articlesTable.publishedAt,
      })
      .from(articlesTable)
      .where(eq(articlesTable.published, true))
      .orderBy(desc(articlesTable.publishedAt));

    const today = new Date().toISOString().split("T")[0];

    const urlEntries: string[] = [];

    for (const page of STATIC_PAGES) {
      urlEntries.push(`  <url>
    <loc>${escapeXml(siteUrl + page.path)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`);
    }

    for (const article of articles) {
      const lastmod = article.publishedAt.toISOString().split("T")[0];
      const loc = escapeXml(siteUrl + "/article/" + article.slug);
      const imageBlock = article.imageUrl
        ? `
    <image:image>
      <image:loc>${escapeXml(article.imageUrl)}</image:loc>
      <image:title>${escapeXml(article.title)}</image:title>
    </image:image>`
        : "";
      urlEntries.push(`  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
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

router.get("/robots.txt", (req, res) => {
  const siteUrl =
    process.env.SITE_URL ??
    `https://${req.headers.host}`;

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

Sitemap: ${siteUrl}/sitemap.xml`;

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
