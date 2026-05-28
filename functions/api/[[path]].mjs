/**
 * Cloudflare Pages Function — handles all /api/* routes.
 * No separate Worker needed — this runs automatically as part of the Pages project.
 *
 * Environment variables required (set in Pages project settings → Variables):
 *   DATABASE_URL   — Neon PostgreSQL connection string
 *   ADMIN_PASSWORD — admin dashboard password
 */

import { neon } from '@neondatabase/serverless';

// ── DB client ─────────────────────────────────────────────────────────────────
function getDb(env) {
  const connStr = (env.DATABASE_URL ?? '').replace(/[&?]channel_binding=[^&]*/g, '').replace(/\?&/, '?');
  return neon(connStr);
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
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
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [header, body, sig] = parts;
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['verify'],
  );
  const sigBytes = Uint8Array.from(
    atob(sig.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0),
  );
  const valid = await crypto.subtle.verify('HMAC', key, sigBytes, enc.encode(`${header}.${body}`));
  if (!valid) return null;
  const payload = JSON.parse(atob(body.replace(/-/g, '+').replace(/_/g, '/')));
  if (payload.exp < Math.floor(Date.now() / 1000)) return null;
  return payload;
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

const CATEGORY_MAP = {
  tech: 'Tech', culture: 'Culture', lifestyle: 'Lifestyle',
  'ai-tools': 'AI Tools', 'phone-tips': 'Phone Tips',
  productivity: 'Productivity', trending: 'Trending',
};
function slugToCategory(slug) {
  if (!slug) return null;
  return CATEGORY_MAP[slug.toLowerCase()] ?? slug;
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

let tablesReady = false;
async function maybeInit(db) {
  if (!tablesReady) {
    await ensureTables(db);
    tablesReady = true;
  }
}

// ── Main handler ──────────────────────────────────────────────────────────────
export async function onRequest({ request, env }) {
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

  if (!env.DATABASE_URL) {
    return json({ error: 'DATABASE_URL not configured. Add it in Pages project → Settings → Variables.' }, 500);
  }

  const db = getDb(env);
  const url = new URL(request.url);
  // Strip /api prefix — Pages Functions receive the full path
  const path = url.pathname.replace(/^\/api/, '') || '/';
  const method = request.method;

  try {
    await maybeInit(db);

    // Health check (/healthz matches OpenAPI spec, /health for legacy)
    if ((path === '/healthz' || path === '/health') && method === 'GET') {
      return json({ status: 'ok' });
    }

    // Categories
    if (path === '/categories' && method === 'GET') {
      const rows = await db`SELECT slug, name, color, article_count FROM categories ORDER BY name`;
      return json(rows.map(r => ({
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

    // Force seed (runs api/setup.mjs logic — articles already in Neon from Vercel)
    if (path === '/admin/force-seed' && method === 'GET') {
      const key = url.searchParams.get('key');
      if (!key || key !== env.ADMIN_PASSWORD) return json({ error: 'Unauthorized' }, 401);
      await ensureTables(db);
      const rows = await db`SELECT COUNT(*) AS c FROM articles`;
      const count = parseInt(rows[0].c, 10);
      return json({ success: true, total: count, message: `Setup complete. ${count} articles now in database.` });
    }

    // Admin login
    if (path === '/admin/login' && method === 'POST') {
      const body = await request.json().catch(() => ({}));
      if (!body.password || body.password !== env.ADMIN_PASSWORD) {
        return json({ error: 'Invalid password' }, 401);
      }
      const token = await makeToken({ admin: true }, env.ADMIN_PASSWORD);
      return json({ token });
    }

    // Admin upload (not supported in edge)
    if (path === '/admin/upload' && method === 'POST') {
      if (!(await requireAdmin(request, env))) return json({ error: 'Unauthorized' }, 401);
      return json({ error: 'File upload not supported in edge mode. Use an image URL instead.' }, 400);
    }

    // Admin list articles
    if (path === '/admin/articles' && method === 'GET') {
      if (!(await requireAdmin(request, env))) return json({ error: 'Unauthorized' }, 401);
      const rows = await db`
        SELECT a.*, au.name AS author_name, au.avatar_url
        FROM articles a JOIN authors au ON a.author_id = au.id
        ORDER BY a.published_at DESC`;
      return json(rows.map(fmt));
    }

    // Admin create article
    if (path === '/admin/articles' && method === 'POST') {
      if (!(await requireAdmin(request, env))) return json({ error: 'Unauthorized' }, 401);
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
      if (!(await requireAdmin(request, env))) return json({ error: 'Unauthorized' }, 401);
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
      if (!(await requireAdmin(request, env))) return json({ error: 'Unauthorized' }, 401);
      const id = parseInt(pubMatch[1], 10);
      const cur = await db`SELECT published FROM articles WHERE id = ${id}`;
      if (!cur.length) return json({ error: 'Not found' }, 404);
      const rows = await db`UPDATE articles SET published = ${!cur[0].published} WHERE id = ${id} RETURNING *`;
      const au = await db`SELECT name, avatar_url FROM authors WHERE id = ${rows[0].author_id}`;
      return json(fmt({ ...rows[0], author_name: au[0]?.name, avatar_url: au[0]?.avatar_url }));
    }

    // Articles: featured
    if (path === '/articles/featured' && method === 'GET') {
      const rows = await db`
        SELECT a.*, au.name AS author_name, au.avatar_url
        FROM articles a JOIN authors au ON a.author_id = au.id
        WHERE a.featured = true AND a.published = true
        ORDER BY a.published_at DESC LIMIT 1`;
      if (!rows.length) return json({ error: 'Not found' }, 404);
      return json(fmt(rows[0]));
    }

    // Articles: trending
    if (path === '/articles/trending' && method === 'GET') {
      const rows = await db`
        SELECT a.*, au.name AS author_name, au.avatar_url
        FROM articles a JOIN authors au ON a.author_id = au.id
        WHERE a.published = true
        ORDER BY a.views DESC, a.published_at DESC LIMIT 5`;
      return json(rows.map(fmt));
    }

    // Articles: editors-picks
    if (path === '/articles/editors-picks' && method === 'GET') {
      const rows = await db`
        SELECT a.*, au.name AS author_name, au.avatar_url
        FROM articles a JOIN authors au ON a.author_id = au.id
        WHERE a.editors_pick = true AND a.published = true
        ORDER BY a.published_at DESC LIMIT 6`;
      return json(rows.map(fmt));
    }

    // Articles: popular
    if (path === '/articles/popular' && method === 'GET') {
      const rows = await db`
        SELECT a.*, au.name AS author_name, au.avatar_url
        FROM articles a JOIN authors au ON a.author_id = au.id
        WHERE a.published = true
        ORDER BY a.views DESC, a.published_at DESC LIMIT 10`;
      return json(rows.map(fmt));
    }

    // Articles: ticker
    if (path === '/articles/ticker' && method === 'GET') {
      const rows = await db`
        SELECT id, slug, title, category FROM articles
        WHERE published = true ORDER BY published_at DESC LIMIT 10`;
      return json(rows);
    }

    // Articles: search
    if (path === '/articles/search' && method === 'GET') {
      const q = url.searchParams.get('q') ?? '';
      const page = parseInt(url.searchParams.get('page') ?? '1', 10);
      const limit = parseInt(url.searchParams.get('limit') ?? '12', 10);
      const offset = (page - 1) * limit;
      if (!q.trim()) return json({ articles: [], total: 0, page, limit, hasMore: false });
      const pattern = `%${q}%`;
      const rows = await db`
        SELECT a.*, au.name AS author_name, au.avatar_url
        FROM articles a JOIN authors au ON a.author_id = au.id
        WHERE a.published = true
          AND (a.title ILIKE ${pattern} OR a.excerpt ILIKE ${pattern} OR a.category ILIKE ${pattern})
        ORDER BY a.published_at DESC LIMIT ${limit} OFFSET ${offset}`;
      const countRows = await db`
        SELECT COUNT(*) AS total FROM articles a
        WHERE a.published = true
          AND (a.title ILIKE ${pattern} OR a.excerpt ILIKE ${pattern} OR a.category ILIKE ${pattern})`;
      const total = parseInt(countRows[0].total, 10);
      return json({ articles: rows.map(fmt), total, page, limit, hasMore: offset + rows.length < total });
    }

    // Articles: list (with optional category filter)
    if (path === '/articles' && method === 'GET') {
      const category = slugToCategory(url.searchParams.get('category'));
      const page = Math.max(1, parseInt(url.searchParams.get('page') ?? '1', 10));
      const limit = Math.min(Math.max(1, parseInt(url.searchParams.get('limit') ?? '12', 10)), 50);
      const offset = (page - 1) * limit;

      let rows, countRows;
      if (category) {
        rows = await db`
          SELECT a.*, au.name AS author_name, au.avatar_url
          FROM articles a JOIN authors au ON a.author_id = au.id
          WHERE a.published = true AND a.category = ${category}
          ORDER BY a.published_at DESC LIMIT ${limit} OFFSET ${offset}`;
        countRows = await db`
          SELECT COUNT(*) AS total FROM articles
          WHERE published = true AND category = ${category}`;
      } else {
        rows = await db`
          SELECT a.*, au.name AS author_name, au.avatar_url
          FROM articles a JOIN authors au ON a.author_id = au.id
          WHERE a.published = true
          ORDER BY a.published_at DESC LIMIT ${limit} OFFSET ${offset}`;
        countRows = await db`SELECT COUNT(*) AS total FROM articles WHERE published = true`;
      }
      const total = parseInt(countRows[0].total, 10);
      return json({ articles: rows.map(fmt), total, page, limit, hasMore: offset + rows.length < total });
    }

    // Articles: related
    const relMatch = path.match(/^\/articles\/([^/]+)\/related$/);
    if (relMatch && method === 'GET') {
      const slug = relMatch[1];
      const base = await db`SELECT category FROM articles WHERE slug = ${slug}`;
      if (!base.length) return json([]);
      const rows = await db`
        SELECT a.*, au.name AS author_name, au.avatar_url
        FROM articles a JOIN authors au ON a.author_id = au.id
        WHERE a.category = ${base[0].category} AND a.slug != ${slug} AND a.published = true
        ORDER BY a.published_at DESC LIMIT 4`;
      return json(rows.map(fmt));
    }

    // Articles: single by slug
    const slugMatch = path.match(/^\/articles\/([^/]+)$/);
    if (slugMatch && method === 'GET') {
      const slug = slugMatch[1];
      const rows = await db`
        SELECT a.*, au.name AS author_name, au.avatar_url
        FROM articles a JOIN authors au ON a.author_id = au.id
        WHERE a.slug = ${slug}`;
      if (!rows.length) return json({ error: 'Not found' }, 404);
      await db`UPDATE articles SET views = views + 1 WHERE slug = ${slug}`;
      return json(fmt(rows[0]));
    }

    return json({ error: 'Not found' }, 404);
  } catch (err) {
    console.error('[pages-fn] error:', err?.message ?? err);
    return json({ error: 'Internal server error', detail: err?.message }, 500);
  }
}
