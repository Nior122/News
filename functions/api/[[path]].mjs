/**
 * Cloudflare Pages Function — handles all /api/* routes.
 * No separate Worker needed — this runs automatically as part of the Pages project.
 *
 * Environment variables required (set in Pages project settings → Variables):
 *   DATABASE_URL   — Neon PostgreSQL connection string
 *   ADMIN_PASSWORD — admin dashboard password
 */

import { neon } from '@neondatabase/serverless';
import { getArticleRedirectTarget, REDIRECTED_ARTICLE_SLUGS } from '../lib/article-routing.mjs';
import { applyArticleContentOverride } from '../lib/article-seo.mjs';
import { hasMeaningfulArticleBody, sanitizeArticleHtml } from '../lib/seo-html.mjs';

// ── DB client ─────────────────────────────────────────────────────────────────
function getDb(env) {
  const connStr = (env.DATABASE_URL ?? '').replace(/[&?]channel_binding=[^&]*/g, '').replace(/\?&/, '?');
  return neon(connStr);
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function json(data, status = 200, cacheControl = 'no-store') {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': cacheControl,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

function publicJson(data, status = 200) {
  return json(
    data,
    status,
    status === 200
      ? 'public, max-age=60, s-maxage=300, stale-while-revalidate=600'
      : 'no-store',
  );
}

function permanentRedirect(location) {
  return new Response(null, {
    status: 301,
    headers: {
      Location: location,
      'Cache-Control': 'public, max-age=86400',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

function redirectArticleApiUrl(url, targetSlug, suffix = '') {
  const target = new URL(`/api/articles/${encodeURIComponent(targetSlug)}${suffix}`, url.origin);
  target.search = url.search;
  return permanentRedirect(target.toString());
}

// ── JWT (Web Crypto — built into Pages Functions) ─────────────────────────────
function b64url(buf) {
  return btoa(String.fromCharCode(...new Uint8Array(buf)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function makeToken(payload, secret) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'],
  );
  const header = b64url(enc.encode(JSON.stringify({ alg: 'HS256', typ: 'JWT' })));
  const body = b64url(enc.encode(JSON.stringify({
    ...payload,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 7 * 86400,
  })));
  const sig = b64url(await crypto.subtle.sign('HMAC', key, enc.encode(`${header}.${body}`)));
  return `${header}.${body}.${sig}`;
}

async function verifyToken(token, secret) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [header, body, sig] = parts;
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['verify'],
    );
    const sigBytes = Uint8Array.from(
      atob(sig.replace(/-/g, '+').replace(/_/g, '/')),
      c => c.charCodeAt(0),
    );
    const valid = await crypto.subtle.verify('HMAC', key, sigBytes, enc.encode(`${header}.${body}`));
    if (!valid) return null;
    const payload = JSON.parse(atob(body.replace(/-/g, '+').replace(/_/g, '/')));
    if (payload.admin !== true || payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

async function requireAdmin(request, env) {
  const auth = request.headers.get('Authorization') ?? '';
  if (!auth.startsWith('Bearer ')) return null;
  return verifyToken(auth.slice(7), env.ADMIN_PASSWORD ?? '');
}

// ── Row formatter ─────────────────────────────────────────────────────────────
function fmt(row) {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    subtitle: row.subtitle ?? null,
    excerpt: row.excerpt,
    body: row.body ?? null,
    category: row.category,
    authorId: row.author_id,
    imageUrl: row.image_url,
    readTime: row.read_time,
    views: row.views,
    featured: row.featured,
    editorsPick: row.editors_pick,
    published: row.published,
    publishedAt: row.published_at instanceof Date
      ? row.published_at.toISOString()
      : String(row.published_at ?? ''),
    tags: row.tags ?? [],
    author: row.author_name
      ? { name: row.author_name, avatarUrl: row.avatar_url ?? '' }
      : { name: 'Staff Writer', avatarUrl: '' },
  };
}

function publicFmt(row) {
  const effectiveRow = applyArticleContentOverride(row);
  const article = fmt(effectiveRow);
  return {
    ...article,
    body: effectiveRow.body == null ? null : sanitizeArticleHtml(effectiveRow.body),
  };
}

function publicSummaryFmt(row) {
  const effectiveRow = applyArticleContentOverride(row);
  const article = fmt(effectiveRow);
  return {
    ...article,
    body: '',
  };
}

const CATEGORY_MAP = {
  tech: 'Tech', culture: 'Culture', lifestyle: 'Lifestyle',
  'ai-tools': 'AI Tools', 'phone-tips': 'Phone Tips',
  productivity: 'Productivity', trending: 'Trending',
};
const AUTHOR_NAMES_BY_SLUG = {
  'maya-chen': 'Maya Chen',
  'james-okafor': 'James Okafor',
  'sofia-reyes': 'Sofia Reyes',
  'liam-park': 'Liam Park',
  'anya-patel': 'Anya Patel',
  'scrolltek-editorial': 'Scrolltek Editorial',
};
function slugToCategory(slug) {
  if (!slug) return null;
  return CATEGORY_MAP[slug.toLowerCase()] ?? slug;
}

const DEFAULT_PAGE_SIZE = 12;
const MAX_PAGE_SIZE = 50;
const MAX_PAGE_NUMBER = 10_000;
const MAX_SEARCH_LENGTH = 100;

function parsePositiveIntegerParam(searchParams, name, fallback, maximum) {
  const raw = searchParams.get(name);
  if (raw === null) return fallback;
  if (!/^\d+$/.test(raw)) return null;

  const value = Number(raw);
  return Number.isSafeInteger(value) && value > 0 && value <= maximum ? value : null;
}

function getPagination(searchParams) {
  const page = parsePositiveIntegerParam(searchParams, 'page', 1, MAX_PAGE_NUMBER);
  const limit = parsePositiveIntegerParam(searchParams, 'limit', DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE);
  if (page === null || limit === null) return null;

  const offset = (page - 1) * limit;
  if (!Number.isSafeInteger(offset)) return null;
  return { page, limit, offset };
}

function escapeLikePattern(value) {
  return value.replace(/[\\%_]/g, '\\$&');
}

// Recognize the route and its allowed method before creating a database client.
// Admin metadata lets the handler authenticate before any database access.
const API_ROUTES = new Map([
  ['/healthz', { methods: ['GET'], kind: 'health' }],
  ['/health', { methods: ['GET'], kind: 'health' }],
  ['/categories', { methods: ['GET'], kind: 'public' }],
  ['/newsletter/subscribe', { methods: ['POST'], kind: 'public' }],
  ['/admin/force-seed', { methods: ['POST'], kind: 'force-seed' }],
  ['/admin/login', { methods: ['POST'], kind: 'admin-login' }],
  ['/admin/upload', { methods: ['POST'], kind: 'admin', admin: true }],
  ['/admin/articles', { methods: ['GET', 'POST'], kind: 'admin', admin: true }],
  ['/articles/featured', { methods: ['GET'], kind: 'public' }],
  ['/articles/trending', { methods: ['GET'], kind: 'public' }],
  ['/articles/editors-picks', { methods: ['GET'], kind: 'public' }],
  ['/articles/popular', { methods: ['GET'], kind: 'public' }],
  ['/articles/ticker', { methods: ['GET'], kind: 'public' }],
  ['/articles/search', { methods: ['GET'], kind: 'public' }],
  ['/articles', { methods: ['GET'], kind: 'public' }],
]);

function classifyRoute(path, method) {
  const route = API_ROUTES.get(path);
  if (route?.methods.includes(method)) return route;

  if (/^\/admin\/articles\/\d+\/publish$/.test(path) && method === 'PATCH') {
    return { kind: 'admin', admin: true };
  }
  if (/^\/admin\/articles\/\d+$/.test(path) && ['PUT', 'DELETE'].includes(method)) {
    return { kind: 'admin', admin: true };
  }
  if (/^\/authors\/[^/]+$/.test(path) && method === 'GET') return { kind: 'public' };
  if (/^\/articles\/[^/]+\/related$/.test(path) && method === 'GET') return { kind: 'public' };
  if (/^\/articles\/[^/]+$/.test(path) && method === 'GET') return { kind: 'public' };
  return null;
}

// ── Ensure tables exist ───────────────────────────────────────────────────────
async function ensureTables(db) {
  await db`CREATE TABLE IF NOT EXISTS authors (
    id SERIAL PRIMARY KEY, name TEXT NOT NULL, avatar_url TEXT NOT NULL DEFAULT ''
  )`;
  await db`CREATE TABLE IF NOT EXISTS categories (
    slug TEXT PRIMARY KEY, name TEXT NOT NULL, color TEXT NOT NULL DEFAULT '#3B82F6', article_count INTEGER NOT NULL DEFAULT 0
  )`;
  await db`CREATE TABLE IF NOT EXISTS articles (
    id SERIAL PRIMARY KEY, slug TEXT NOT NULL UNIQUE, title TEXT NOT NULL,
    subtitle TEXT, excerpt TEXT NOT NULL DEFAULT '', body TEXT, category TEXT NOT NULL,
    author_id INTEGER NOT NULL DEFAULT 1, published_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    read_time INTEGER NOT NULL DEFAULT 3, image_url TEXT NOT NULL DEFAULT '',
    views INTEGER NOT NULL DEFAULT 0, featured BOOLEAN NOT NULL DEFAULT FALSE,
    editors_pick BOOLEAN NOT NULL DEFAULT FALSE, tags TEXT[] NOT NULL DEFAULT '{}',
    published BOOLEAN NOT NULL DEFAULT TRUE
  )`;
  await db`CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id SERIAL PRIMARY KEY, email TEXT NOT NULL UNIQUE, subscribed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`;

  // Seed authors and categories if missing
  await db`INSERT INTO authors (id, name, avatar_url) VALUES
    (1,'Maya Chen','https://i.pravatar.cc/150?img=47'),
    (2,'James Okafor','https://i.pravatar.cc/150?img=68'),
    (3,'Sofia Reyes','https://i.pravatar.cc/150?img=31'),
    (4,'Liam Park','https://i.pravatar.cc/150?img=12'),
    (5,'Anya Patel','https://i.pravatar.cc/150?img=56')
    ON CONFLICT (id) DO NOTHING`;
  await db`INSERT INTO categories (slug, name, color) VALUES
    ('tech','Tech','#3B82F6'),('culture','Culture','#8B5CF6'),
    ('lifestyle','Lifestyle','#10B981'),('ai-tools','AI Tools','#F59E0B'),
    ('phone-tips','Phone Tips','#EF4444'),('productivity','Productivity','#06B6D4'),
    ('trending','Trending','#F97316')
    ON CONFLICT (slug) DO NOTHING`;
}

// ── Main handler ──────────────────────────────────────────────────────────────
export async function handleApiRequest({ request, env, databaseFactory = getDb }) {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  const url = new URL(request.url);
  // Strip /api prefix — Pages Functions receive the full path
  const path = url.pathname.replace(/^\/api/, '') || '/';
  const method = request.method;

  // Reject unknown paths and unsupported methods before creating a database client.
  const route = classifyRoute(path, method);
  if (!route) return json({ error: 'Not found' }, 404);

  // Health and login are intentionally independent of database availability.
  if (route.kind === 'health') return json({ status: 'ok' });
  if (route.kind === 'admin-login') {
    const body = await request.json().catch(() => ({}));
    if (!body.password || body.password !== env?.ADMIN_PASSWORD) {
      return json({ error: 'Invalid password' }, 401);
    }
    const token = await makeToken({ admin: true }, env.ADMIN_PASSWORD);
    return json({ token });
  }

  // Setup uses the existing shared admin password, checked before DB creation.
  if (route.kind === 'force-seed') {
    const body = await request.json().catch(() => ({}));
    const key = typeof body.key === 'string' ? body.key : '';
    if (!key || key !== env?.ADMIN_PASSWORD) return json({ error: 'Unauthorized' }, 401);
  } else if (route.admin && !(await requireAdmin(request, env ?? {}))) {
    return json({ error: 'Unauthorized' }, 401);
  }

  // Upload is intentionally unsupported in this runtime and needs no DB.
  if (path === '/admin/upload') {
    return json({ error: 'File upload not supported in edge mode. Use an image URL instead.' }, 400);
  }

  if (!env?.DATABASE_URL) {
    return json({ error: 'Service unavailable' }, 503);
  }

  try {
    const db = databaseFactory(env);

    // Explicit, authenticated setup; never run as part of ordinary request startup.
    if (route.kind === 'force-seed') {
      await ensureTables(db);
      const rows = await db`SELECT COUNT(*) AS c FROM articles`;
      const count = parseInt(rows[0].c, 10);
      return json({
        success: true,
        total: count,
        message: `Setup complete. ${count} article${count === 1 ? '' : 's'} currently in the database; no article records were seeded or restored.`,
      });
    }

    // Categories
    if (path === '/categories' && method === 'GET') {
      const rows = await db`SELECT slug, name, color, article_count FROM categories ORDER BY name`;
      return publicJson(rows.map(r => ({
        id: 0,
        slug: r.slug,
        name: r.name,
        color: r.color,
        articleCount: r.article_count ?? 0,
      })));
    }

    // Newsletter
    if (path === '/newsletter/subscribe' && method === 'POST') {
      const body = await request.json().catch(() => ({}));
      const email = (body.email ?? '').trim();
      if (!email) return json({ error: 'Email required' }, 400);
      await db`INSERT INTO newsletter_subscribers (email, subscribed_at) VALUES (${email}, NOW()) ON CONFLICT (email) DO NOTHING`;
      return json({ success: true });
    }

    // Admin list articles
    if (path === '/admin/articles' && method === 'GET') {
      const rows = await db`
        SELECT a.*, au.name AS author_name, au.avatar_url
        FROM articles a JOIN authors au ON a.author_id = au.id
        ORDER BY a.published_at DESC`;
      return json(rows.map(fmt));
    }

    // Admin create article
    if (path === '/admin/articles' && method === 'POST') {
      const b = await request.json().catch(() => ({}));
      const tags = Array.isArray(b.tags) ? b.tags : String(b.tags ?? '').split(',').map(t => t.trim()).filter(Boolean);
      const rows = await db`
        INSERT INTO articles (slug,title,subtitle,excerpt,body,category,image_url,read_time,author_id,featured,editors_pick,published,tags,published_at,views)
        VALUES (${b.slug},${b.title},${b.subtitle||null},${b.excerpt},${b.body||null},${b.category},${b.imageUrl||''},${Number(b.readTime)||3},${Number(b.authorId)||1},${!!b.featured},${!!b.editorsPick},${b.published!==false},${tags},NOW(),0)
        RETURNING *`;
      const au = await db`SELECT name, avatar_url FROM authors WHERE id = ${rows[0].author_id}`;
      return json(fmt({ ...rows[0], author_name: au[0]?.name, avatar_url: au[0]?.avatar_url }), 201);
    }

    // Admin article by ID (PUT / DELETE)
    const idMatch = path.match(/^\/admin\/articles\/(\d+)$/);
    if (idMatch) {
      const id = parseInt(idMatch[1], 10);
      if (method === 'PUT') {
        const b = await request.json().catch(() => ({}));
        const tags = Array.isArray(b.tags) ? b.tags : String(b.tags ?? '').split(',').map(t => t.trim()).filter(Boolean);
        const rows = await db`
          UPDATE articles
          SET title=${b.title}, subtitle=${b.subtitle||null}, excerpt=${b.excerpt}, body=${b.body||null},
              category=${b.category}, image_url=${b.imageUrl||''}, read_time=${Number(b.readTime)},
              author_id=${Number(b.authorId)}, featured=${!!b.featured}, editors_pick=${!!b.editorsPick},
              published=${!!b.published}, tags=${tags}
          WHERE id=${id} RETURNING *`;
        if (!rows.length) return json({ error: 'Not found' }, 404);
        const au = await db`SELECT name, avatar_url FROM authors WHERE id = ${rows[0].author_id}`;
        return json(fmt({ ...rows[0], author_name: au[0]?.name, avatar_url: au[0]?.avatar_url }));
      }
      if (method === 'DELETE') {
        await db`DELETE FROM articles WHERE id = ${id}`;
        return json({ success: true });
      }
    }

    // Admin publish toggle
    const pubMatch = path.match(/^\/admin\/articles\/(\d+)\/publish$/);
    if (pubMatch && method === 'PATCH') {
      const id = parseInt(pubMatch[1], 10);
      const cur = await db`SELECT published FROM articles WHERE id = ${id}`;
      if (!cur.length) return json({ error: 'Not found' }, 404);
      const rows = await db`UPDATE articles SET published = ${!cur[0].published} WHERE id = ${id} RETURNING *`;
      const au = await db`SELECT name, avatar_url FROM authors WHERE id = ${rows[0].author_id}`;
      return json(fmt({ ...rows[0], author_name: au[0]?.name, avatar_url: au[0]?.avatar_url }));
    }

    // Public author profile and published article list.
    const authorMatch = path.match(/^\/authors\/([^/]+)$/);
    if (authorMatch && method === 'GET') {
      let slug;
      try {
        slug = decodeURIComponent(authorMatch[1]);
      } catch {
        return json({ error: 'Not found' }, 404);
      }
      if (slug.includes('/')) return json({ error: 'Not found' }, 404);
      const name = AUTHOR_NAMES_BY_SLUG[slug];
      if (!name) return json({ error: 'Not found' }, 404);

      const authorRows = await db`
        SELECT id, name, avatar_url
        FROM authors
        WHERE name = ${name}
        LIMIT 1`;
      if (!authorRows.length) {
        if (slug !== 'scrolltek-editorial') return json({ error: 'Not found' }, 404);
        return json({
          id: null,
          name,
          avatarUrl: '',
          slug,
          articleCount: 0,
          totalViews: 0,
          articles: [],
        });
      }
      const author = authorRows[0];
      const statsRows = await db`
        SELECT COUNT(*) AS article_count, COALESCE(SUM(views), 0) AS total_views
        FROM articles
        WHERE author_id = ${author.id} AND published = true
          AND slug <> ALL(${REDIRECTED_ARTICLE_SLUGS}::text[])`;
      const articleRows = await db`
        SELECT a.*, au.name AS author_name, au.avatar_url
        FROM articles a JOIN authors au ON a.author_id = au.id
        WHERE a.author_id = ${author.id} AND a.published = true
          AND a.slug <> ALL(${REDIRECTED_ARTICLE_SLUGS}::text[])
        ORDER BY a.published_at DESC
        LIMIT 100`;
      const stats = statsRows[0] ?? {};

      return publicJson({
        id: author.id,
        name: author.name,
        avatarUrl: author.avatar_url ?? '',
        slug,
        articleCount: Number(stats.article_count ?? 0),
        totalViews: Number(stats.total_views ?? 0),
        articles: articleRows.map(publicSummaryFmt),
      });
    }

    // Articles: featured
    if (path === '/articles/featured' && method === 'GET') {
      const rows = await db`
        SELECT a.*, au.name AS author_name, au.avatar_url
        FROM articles a JOIN authors au ON a.author_id = au.id
        WHERE a.featured = true AND a.published = true
          AND a.slug <> ALL(${REDIRECTED_ARTICLE_SLUGS}::text[])
        ORDER BY a.published_at DESC LIMIT 1`;
      if (!rows.length) return json({ error: 'Not found' }, 404);
      return publicJson(publicFmt(rows[0]));
    }

    // Articles: trending
    if (path === '/articles/trending' && method === 'GET') {
      const rows = await db`
        SELECT a.*, au.name AS author_name, au.avatar_url
        FROM articles a JOIN authors au ON a.author_id = au.id
        WHERE a.published = true AND a.slug <> ALL(${REDIRECTED_ARTICLE_SLUGS}::text[])
        ORDER BY a.views DESC, a.published_at DESC LIMIT 5`;
      return publicJson(rows.map(publicSummaryFmt));
    }

    // Articles: editors-picks
    if (path === '/articles/editors-picks' && method === 'GET') {
      const rows = await db`
        SELECT a.*, au.name AS author_name, au.avatar_url
        FROM articles a JOIN authors au ON a.author_id = au.id
        WHERE a.editors_pick = true AND a.published = true
          AND a.slug <> ALL(${REDIRECTED_ARTICLE_SLUGS}::text[])
        ORDER BY a.published_at DESC LIMIT 6`;
      return publicJson(rows.map(publicSummaryFmt));
    }

    // Articles: popular
    if (path === '/articles/popular' && method === 'GET') {
      const rows = await db`
        SELECT a.*, au.name AS author_name, au.avatar_url
        FROM articles a JOIN authors au ON a.author_id = au.id
        WHERE a.published = true AND a.slug <> ALL(${REDIRECTED_ARTICLE_SLUGS}::text[])
        ORDER BY a.views DESC, a.published_at DESC LIMIT 10`;
      return publicJson(rows.map(publicSummaryFmt));
    }

    // Articles: ticker
    if (path === '/articles/ticker' && method === 'GET') {
      const rows = await db`
        SELECT id, slug, title, category FROM articles
        WHERE published = true AND slug <> ALL(${REDIRECTED_ARTICLE_SLUGS}::text[])
        ORDER BY published_at DESC LIMIT 10`;
      return publicJson(rows);
    }

    // Articles: search
    if (path === '/articles/search' && method === 'GET') {
      const pagination = getPagination(url.searchParams);
      if (!pagination) return json({ error: 'Invalid pagination parameters' }, 400);
      const { page, limit, offset } = pagination;
      const q = (url.searchParams.get('q') ?? '').trim();
      if (q.length > MAX_SEARCH_LENGTH) {
        return json({ error: `Search query must be ${MAX_SEARCH_LENGTH} characters or fewer` }, 400);
      }
      if (!q) return publicJson({ articles: [], total: 0, page, limit, hasMore: false });

      const pattern = `%${escapeLikePattern(q)}%`;
      const rows = await db`
        SELECT a.*, au.name AS author_name, au.avatar_url
        FROM articles a JOIN authors au ON a.author_id = au.id
        WHERE a.published = true AND a.slug <> ALL(${REDIRECTED_ARTICLE_SLUGS}::text[])
          AND (
            a.title ILIKE ${pattern}
            OR a.excerpt ILIKE ${pattern}
            OR a.category ILIKE ${pattern}
            OR array_to_string(a.tags, ' ') ILIKE ${pattern}
            OR au.name ILIKE ${pattern}
          )
        ORDER BY a.published_at DESC LIMIT ${limit} OFFSET ${offset}`;
      const countRows = await db`
        SELECT COUNT(*) AS total
        FROM articles a JOIN authors au ON a.author_id = au.id
        WHERE a.published = true AND a.slug <> ALL(${REDIRECTED_ARTICLE_SLUGS}::text[])
          AND (
            a.title ILIKE ${pattern}
            OR a.excerpt ILIKE ${pattern}
            OR a.category ILIKE ${pattern}
            OR array_to_string(a.tags, ' ') ILIKE ${pattern}
            OR au.name ILIKE ${pattern}
          )`;
      const total = parseInt(countRows[0].total, 10);
      return publicJson({ articles: rows.map(publicSummaryFmt), total, page, limit, hasMore: offset + rows.length < total });
    }

    // Articles: list (with optional category filter)
    if (path === '/articles' && method === 'GET') {
      const category = slugToCategory(url.searchParams.get('category'));
      const pagination = getPagination(url.searchParams);
      if (!pagination) return json({ error: 'Invalid pagination parameters' }, 400);
      const { page, limit, offset } = pagination;

      let rows, countRows;
      if (category) {
        rows = await db`
          SELECT a.*, au.name AS author_name, au.avatar_url
          FROM articles a JOIN authors au ON a.author_id = au.id
          WHERE a.published = true AND a.category = ${category}
            AND a.slug <> ALL(${REDIRECTED_ARTICLE_SLUGS}::text[])
          ORDER BY a.published_at DESC LIMIT ${limit} OFFSET ${offset}`;
        countRows = await db`
          SELECT COUNT(*) AS total FROM articles
          WHERE published = true AND category = ${category}
            AND slug <> ALL(${REDIRECTED_ARTICLE_SLUGS}::text[])`;
      } else {
        rows = await db`
          SELECT a.*, au.name AS author_name, au.avatar_url
          FROM articles a JOIN authors au ON a.author_id = au.id
          WHERE a.published = true AND a.slug <> ALL(${REDIRECTED_ARTICLE_SLUGS}::text[])
          ORDER BY a.published_at DESC LIMIT ${limit} OFFSET ${offset}`;
        countRows = await db`
          SELECT COUNT(*) AS total FROM articles
          WHERE published = true AND slug <> ALL(${REDIRECTED_ARTICLE_SLUGS}::text[])`;
      }
      const total = parseInt(countRows[0].total, 10);
      return publicJson({ articles: rows.map(publicSummaryFmt), total, page, limit, hasMore: offset + rows.length < total });
    }

    // Articles: related
    const relMatch = path.match(/^\/articles\/([^/]+)\/related$/);
    if (relMatch && method === 'GET') {
      let slug;
      try {
        slug = decodeURIComponent(relMatch[1]);
      } catch {
        return json({ error: 'Not found' }, 404);
      }
      if (slug.includes('/')) return json({ error: 'Not found' }, 404);
      const redirectTarget = getArticleRedirectTarget(slug);
      if (redirectTarget) return redirectArticleApiUrl(url, redirectTarget, '/related');
      const base = await db`SELECT category FROM articles WHERE slug = ${slug} AND published = true`;
      if (!base.length) return json({ error: 'Not found' }, 404);
      const rows = await db`
        SELECT a.*, au.name AS author_name, au.avatar_url
        FROM articles a JOIN authors au ON a.author_id = au.id
        WHERE a.category = ${base[0].category} AND a.slug != ${slug} AND a.published = true
          AND a.slug <> ALL(${REDIRECTED_ARTICLE_SLUGS}::text[])
        ORDER BY a.published_at DESC LIMIT 4`;
      return publicJson(rows.map(publicSummaryFmt));
    }

    // Articles: single by slug
    const slugMatch = path.match(/^\/articles\/([^/]+)$/);
    if (slugMatch && method === 'GET') {
      let slug;
      try {
        slug = decodeURIComponent(slugMatch[1]);
      } catch {
        return json({ error: 'Not found' }, 404);
      }
      if (slug.includes('/')) return json({ error: 'Not found' }, 404);
      const redirectTarget = getArticleRedirectTarget(slug);
      if (redirectTarget) return redirectArticleApiUrl(url, redirectTarget);
      const rows = await db`
        SELECT a.*, au.name AS author_name, au.avatar_url
        FROM articles a JOIN authors au ON a.author_id = au.id
        WHERE a.slug = ${slug} AND a.published = true
          AND a.slug <> ALL(${REDIRECTED_ARTICLE_SLUGS}::text[])`;
      if (!rows.length) return json({ error: 'Not found' }, 404);
      if (!String(rows[0].title ?? '').trim() || !hasMeaningfulArticleBody(rows[0].body)) {
        return json({ error: 'Article temporarily unavailable' }, 503);
      }
      return publicJson(publicFmt(rows[0]));
    }

    return json({ error: 'Not found' }, 404);
  } catch {
    console.error('[pages-fn] request failed');
    return json({ error: 'Internal server error' }, 500);
  }
}

export async function onRequest(context) {
  return handleApiRequest(context);
}
