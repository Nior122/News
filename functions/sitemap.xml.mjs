/**
 * Cloudflare Pages Function — serves /sitemap.xml
 * Dynamically generates the sitemap from the Neon database.
 */

import { neon } from '@neondatabase/serverless';
import { getArticleRedirectTarget } from './lib/article-routing.mjs';
import { hasMeaningfulArticleBody } from './lib/seo-html.mjs';

const SITE_ORIGIN = 'https://scrolltek.name.ng';

function getDb(env) {
  const connStr = (env.DATABASE_URL ?? '').replace(/[&?]channel_binding=[^&]*/g, '').replace(/\?&/, '?');
  return neon(connStr);
}

function escapeXml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

const STATIC_PAGES = [
  '/',
  '/about',
  '/contact',
  '/privacy',
  '/category/tech',
  '/category/culture',
  '/category/lifestyle',
  '/category/ai-tools',
  '/category/phone-tips',
  '/category/productivity',
  '/category/trending',
];

export function buildSitemapXml(articles) {
  const locations = new Set(STATIC_PAGES.map((path) => `${SITE_ORIGIN}${path}`));

  for (const article of Array.isArray(articles) ? articles : []) {
    if (article?.published !== true || !hasMeaningfulArticleBody(article.body)) continue;
    const slug = String(article.slug ?? '').trim();
    const hasUnsafePathCharacter = [...slug].some((character) => {
      const codePoint = character.codePointAt(0);
      return character === '/' || character === "\\" || character === '?' || character === '#'
        || codePoint < 0x20 || codePoint === 0x7f;
    });
    if (!slug || slug === "." || slug === ".." || hasUnsafePathCharacter) continue;
    if (getArticleRedirectTarget(slug)) continue;

    try {
      locations.add(`${SITE_ORIGIN}/article/${encodeURIComponent(slug)}`);
    } catch {
      // Skip malformed database values rather than publishing broken URLs.
    }
  }

  const urlEntries = [...locations].map((location) => `  <url>
    <loc>${escapeXml(location)}</loc>
  </url>`);
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries.join(String.fromCharCode(10))}
</urlset>`;
}

export function createSitemapHandler({ databaseFactory = getDb } = {}) {
  return async function onRequest({ env }) {
    if (!env?.DATABASE_URL) {
      return new Response('Sitemap temporarily unavailable', { status: 503 });
    }

    try {
      const db = databaseFactory(env);
      const articles = await db`
        SELECT slug, published, body
        FROM articles
        WHERE published = true
          AND BTRIM(COALESCE(title, '')) <> ''
          AND BTRIM(COALESCE(body, '')) <> ''
        ORDER BY published_at DESC
      `;
      const xml = buildSitemapXml(articles);

      return new Response(xml, {
        status: 200,
        headers: {
          'Content-Type': 'application/xml; charset=utf-8',
          'Cache-Control': 'public, max-age=3600',
        },
      });
    } catch {
      console.error('[sitemap] generation failed');
      return new Response('Sitemap temporarily unavailable', { status: 503 });
    }
  };
}

export const onRequest = createSitemapHandler();
