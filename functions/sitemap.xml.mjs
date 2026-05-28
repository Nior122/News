/**
 * Cloudflare Pages Function — serves /sitemap.xml
 * Dynamically generates the sitemap from the Neon database.
 */

import { neon } from '@neondatabase/serverless';

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
  { path: '/',                    priority: '1.0', changefreq: 'daily'   },
  { path: '/about',               priority: '0.5', changefreq: 'monthly' },
  { path: '/contact',             priority: '0.5', changefreq: 'monthly' },
  { path: '/privacy',             priority: '0.3', changefreq: 'yearly'  },
  { path: '/category/tech',       priority: '0.8', changefreq: 'daily'   },
  { path: '/category/culture',    priority: '0.8', changefreq: 'daily'   },
  { path: '/category/lifestyle',  priority: '0.8', changefreq: 'daily'   },
  { path: '/category/ai-tools',   priority: '0.8', changefreq: 'daily'   },
  { path: '/category/phone-tips', priority: '0.8', changefreq: 'daily'   },
  { path: '/category/productivity', priority: '0.8', changefreq: 'daily' },
  { path: '/category/trending',   priority: '0.8', changefreq: 'daily'   },
];

export async function onRequest({ request, env }) {
  if (!env.DATABASE_URL) {
    return new Response('DATABASE_URL not configured', { status: 500 });
  }

  try {
    const db = getDb(env);
    const origin = new URL(request.url).origin;
    const today = new Date().toISOString().split('T')[0];

    const articles = await db`
      SELECT slug, published_at
      FROM articles
      WHERE published = true
      ORDER BY published_at DESC
    `;

    const urlEntries = [];

    for (const page of STATIC_PAGES) {
      urlEntries.push(`  <url>
    <loc>${escapeXml(origin + page.path)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`);
    }

    for (const article of articles) {
      const lastmod = new Date(article.published_at).toISOString().split('T')[0];
      urlEntries.push(`  <url>
    <loc>${escapeXml(origin + '/article/' + article.slug)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`);
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries.join('\n')}
</urlset>`;

    return new Response(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (err) {
    console.error('[sitemap] error:', err?.message ?? err);
    return new Response('Failed to generate sitemap', { status: 500 });
  }
}
