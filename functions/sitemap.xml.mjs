/**
 * Cloudflare Pages Function — serves /sitemap.xml
 * Dynamically generates the sitemap from the Neon database.
 */

import { neon } from '@neondatabase/serverless';
import { isRedirectedArticleSlug } from './lib/article-routing.mjs';
import { getArticleSeoOverride } from './lib/article-seo.mjs';
import { RENDERABLE_CATEGORY_SLUGS } from './lib/site-categories.mjs';
import { hasMeaningfulArticleBody } from './lib/seo-html.mjs';

const SITE_ORIGIN = 'https://scrolltek.name.ng';

// Canonical, indexable static pages only. Routes that carry noindex
// (/search, /admin, /admin/login) must never be advertised here.
const STATIC_PAGES = ['/', '/about', '/contact', '/privacy'];

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

/** Rejects values that would produce a broken or unsafe path segment. */
function isSafePathSegment(value) {
  if (!value || value === '.' || value === '..') return false;
  return ![...value].some((character) => {
    const codePoint = character.codePointAt(0);
    return character === '/' || character === '\\' || character === '?' || character === '#'
      || codePoint < 0x20 || codePoint === 0x7f;
  });
}

/**
 * Real publication timestamp as a W3C lastmod value, or null when the row has
 * no usable date. Never fabricate a date from "now" — a wrong lastmod is worse
 * than no lastmod, so unknown dates simply omit the element.
 */
function lastmodFor(value) {
  if (value === null || value === undefined || value === '') return null;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
}

// Editorial lastmod overrides for articles that were updated without changing
// their original publication date. Mirrors artifacts/api-server sitemap route.
const ARTICLE_LASTMOD_OVERRIDES = {
  'handheld-gaming-gadgets-2026': '2026-10-23',
  'chatgpt-claude-gemini-comparison-2026': '2026-10-23',
};

/**
 * Builds the sitemap body.
 *
 * @param {Array} articles rows from the published-articles query
 */
export function buildSitemapXml(articles) {
  // Map keeps insertion order and collapses duplicate locations, while letting a
  // later row contribute a lastmod if the first one for that URL lacked a date.
  const entries = new Map();
  const add = (location, lastmod = null) => {
    if (!entries.has(location) || (!entries.get(location) && lastmod)) entries.set(location, lastmod);
  };

  for (const path of STATIC_PAGES) add(`${SITE_ORIGIN}${path}`);

  // Every category page the router can render, including the virtual mixed
  // pages that have no row in the categories table. All are indexable and
  // carry a self-referential canonical, so none may be left out.
  for (const slug of RENDERABLE_CATEGORY_SLUGS) {
    add(`${SITE_ORIGIN}/category/${encodeURIComponent(slug)}`);
  }

  for (const article of Array.isArray(articles) ? articles : []) {
    if (article?.published !== true || !hasMeaningfulArticleBody(article.body)) continue;
    const slug = String(article.slug ?? '').trim();
    if (!isSafePathSegment(slug)) continue;
    // Retired aliases 301 to their canonical revision, so only the destination
    // belongs in the sitemap.
    if (isRedirectedArticleSlug(slug)) continue;

    try {
      const seoOverride = getArticleSeoOverride(slug);
      add(
        `${SITE_ORIGIN}/article/${encodeURIComponent(slug)}`,
        ARTICLE_LASTMOD_OVERRIDES[slug] ?? lastmodFor(seoOverride?.dateModified ?? article.published_at),
      );
    } catch {
      // Skip malformed database values rather than publishing broken URLs.
    }
  }

  const urlEntries = [...entries].map(([location, lastmod]) => `  <url>
    <loc>${escapeXml(location)}</loc>${lastmod ? `\n    <lastmod>${escapeXml(lastmod)}</lastmod>` : ''}
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
        SELECT slug, published, body, published_at
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
