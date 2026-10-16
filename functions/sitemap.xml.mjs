/**
 * Cloudflare Pages Function — serves /sitemap.xml
 * Dynamically generates the sitemap from the Neon database.
 */

import { neon } from '@neondatabase/serverless';
import { isRedirectedArticleSlug } from './lib/article-routing.mjs';
import { isRenderableCategorySlug, sortCategorySlugs } from './lib/site-categories.mjs';
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

/**
 * Builds the sitemap body.
 *
 * @param {Array} articles rows from the published-articles query
 * @param {Array} categories rows from the categories query
 */
export function buildSitemapXml(articles, categories = []) {
  // Map keeps insertion order and collapses duplicate locations, while letting a
  // later row contribute a lastmod if the first one for that URL lacked a date.
  const entries = new Map();
  const add = (location, lastmod = null) => {
    if (!entries.has(location) || (!entries.get(location) && lastmod)) entries.set(location, lastmod);
  };

  for (const path of STATIC_PAGES) add(`${SITE_ORIGIN}${path}`);

  // Only advertise category pages that actually have a route handler. A slug in
  // the categories table without a renderable page would be a 404 in the sitemap.
  const categorySlugs = (Array.isArray(categories) ? categories : [])
    .map((category) => String(category?.slug ?? '').trim())
    .filter((slug) => isSafePathSegment(slug) && isRenderableCategorySlug(slug));
  for (const slug of sortCategorySlugs(new Set(categorySlugs))) {
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
      add(`${SITE_ORIGIN}/article/${encodeURIComponent(slug)}`, lastmodFor(article.published_at));
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
      const [categories, articles] = await Promise.all([
        db`SELECT slug FROM categories ORDER BY slug`,
        db`
          SELECT slug, published, body, published_at
          FROM articles
          WHERE published = true
            AND BTRIM(COALESCE(title, '')) <> ''
            AND BTRIM(COALESCE(body, '')) <> ''
          ORDER BY published_at DESC
        `,
      ]);
      const xml = buildSitemapXml(articles, categories);

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
