/**
 * Vercel Serverless Function — handles all /api/* routes.
 * Uses PostgreSQL via the `pg` package (installed at workspace root).
 * JWT auth uses Node.js built-in crypto (no jsonwebtoken dep needed).
 * Routing: vercel.json rewrites /api/:path* → /api/index
 */

import pg from 'pg';
import crypto from 'crypto';
import { ensureReady } from './setup.mjs';

const { Pool } = pg;

// ── DB pool (reused across warm invocations) ─────────────────────────────────
let pool;
function getPool() {
  if (!pool) {
    const connStr = process.env.DATABASE_URL ?? '';
    // Strip channel_binding param — not supported by all pg versions
    const sanitized = connStr.replace(/[&?]channel_binding=[^&]*/g, '').replace(/\?&/, '?');
    pool = new Pool({ connectionString: sanitized });
  }
  return pool;
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function send(res, data, status = 200) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data));
}

function getSecret() {
  const s = process.env.ADMIN_PASSWORD;
  if (!s) throw new Error('ADMIN_PASSWORD not set');
  return s;
}

// ── JWT using Node built-in crypto (no jsonwebtoken needed) ──────────────────
function b64url(buf) {
  return Buffer.from(buf).toString('base64url');
}

function makeToken(payload) {
  const header = b64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = b64url(JSON.stringify({ ...payload, iat: Math.floor(Date.now() / 1000), exp: Math.floor(Date.now() / 1000) + 7 * 86400 }));
  const sig = b64url(crypto.createHmac('sha256', getSecret()).update(`${header}.${body}`).digest());
  return `${header}.${body}.${sig}`;
}

function verifyToken(token) {
  const [header, body, sig] = token.split('.');
  if (!header || !body || !sig) return null;
  const expected = b64url(crypto.createHmac('sha256', getSecret()).update(`${header}.${body}`).digest());
  if (sig !== expected) return null;
  const payload = JSON.parse(Buffer.from(body, 'base64url').toString());
  if (payload.exp < Math.floor(Date.now() / 1000)) return null;
  return payload;
}

function requireAdmin(req, res) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) { send(res, { error: 'Unauthorized' }, 401); return false; }
  const payload = verifyToken(auth.slice(7));
  if (!payload) { send(res, { error: 'Invalid or expired token' }, 401); return false; }
  return true;
}

async function readBody(req) {
  return new Promise((resolve) => {
    let data = '';
    req.on('data', (chunk) => (data += chunk));
    req.on('end', () => { try { resolve(JSON.parse(data)); } catch { resolve({}); } });
  });
}

function authorFrom(row) {
  if (!row.author_name) return { name: 'Staff Writer', avatarUrl: '' };
  return { name: row.author_name, avatarUrl: row.avatar_url ?? '' };
}

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
    publishedAt: row.published_at instanceof Date ? row.published_at.toISOString() : String(row.published_at),
    tags: row.tags ?? [],
    author: authorFrom(row),
  };
}

const JOIN = 'SELECT a.*, au.name AS author_name, au.avatar_url FROM articles a JOIN authors au ON a.author_id = au.id';

// ── Main handler ─────────────────────────────────────────────────────────────
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') { res.statusCode = 204; res.end(); return; }

  const db = getPool();
  await ensureReady(db);

  const rawUrl = req.url ?? '/';
  const url = new URL(rawUrl, `http://${req.headers.host ?? 'localhost'}`);
  const path = url.pathname.replace(/^\/api/, '') || '/';
  const method = req.method ?? 'GET';

  try {
    // Health
    if (path === '/health' && method === 'GET') { send(res, { ok: true }); return; }

    // Categories
    if (path === '/categories' && method === 'GET') {
      const { rows } = await db.query('SELECT * FROM categories ORDER BY name');
      send(res, rows); return;
    }

    // Newsletter
    if (path === '/newsletter/subscribe' && method === 'POST') {
      const body = await readBody(req);
      const email = (body.email ?? '').trim();
      if (!email) { send(res, { error: 'Email required' }, 400); return; }
      await db.query(`INSERT INTO newsletter_subscribers (email, subscribed_at) VALUES ($1, NOW()) ON CONFLICT (email) DO NOTHING`, [email]);
      send(res, { success: true }); return;
    }

    // Admin login
    if (path === '/admin/login' && method === 'POST') {
      const body = await readBody(req);
      if (!body.password || body.password !== process.env.ADMIN_PASSWORD) { send(res, { error: 'Invalid password' }, 401); return; }
      send(res, { token: makeToken({ admin: true }) }); return;
    }

    // Admin upload (not supported in serverless)
    if (path === '/admin/upload' && method === 'POST') {
      if (!requireAdmin(req, res)) return;
      send(res, { error: 'File upload not supported in serverless mode. Use an image URL instead.' }, 400); return;
    }

    // Admin list articles
    if (path === '/admin/articles' && method === 'GET') {
      if (!requireAdmin(req, res)) return;
      const { rows } = await db.query(`${JOIN} ORDER BY a.published_at DESC`);
      send(res, rows.map(fmt)); return;
    }

    // Admin create article
    if (path === '/admin/articles' && method === 'POST') {
      if (!requireAdmin(req, res)) return;
      const b = await readBody(req);
      const tags = Array.isArray(b.tags) ? b.tags : String(b.tags ?? '').split(',').map(t => t.trim()).filter(Boolean);
      const { rows } = await db.query(
        `INSERT INTO articles (slug,title,subtitle,excerpt,body,category,image_url,read_time,author_id,featured,editors_pick,published,tags,published_at,views)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,NOW(),0) RETURNING *`,
        [b.slug, b.title, b.subtitle||null, b.excerpt, b.body||null, b.category, b.imageUrl||'', Number(b.readTime)||3, Number(b.authorId)||1, !!b.featured, !!b.editorsPick, b.published!==false, tags],
      );
      const au = await db.query('SELECT name, avatar_url FROM authors WHERE id=$1', [rows[0].author_id]);
      const row = { ...rows[0], author_name: au.rows[0]?.name, avatar_url: au.rows[0]?.avatar_url };
      send(res, fmt(row), 201); return;
    }

    // Admin article by ID (PUT / DELETE)
    const idMatch = path.match(/^\/admin\/articles\/(\d+)$/);
    if (idMatch) {
      if (!requireAdmin(req, res)) return;
      const id = parseInt(idMatch[1], 10);
      if (method === 'PUT') {
        const b = await readBody(req);
        const tags = Array.isArray(b.tags) ? b.tags : String(b.tags ?? '').split(',').map(t => t.trim()).filter(Boolean);
        const { rows } = await db.query(
          `UPDATE articles SET title=$1,subtitle=$2,excerpt=$3,body=$4,category=$5,image_url=$6,read_time=$7,author_id=$8,featured=$9,editors_pick=$10,published=$11,tags=$12 WHERE id=$13 RETURNING *`,
          [b.title, b.subtitle||null, b.excerpt, b.body||null, b.category, b.imageUrl||'', Number(b.readTime), Number(b.authorId), !!b.featured, !!b.editorsPick, !!b.published, tags, id],
        );
        if (!rows.length) { send(res, { error: 'Not found' }, 404); return; }
        const au = await db.query('SELECT name, avatar_url FROM authors WHERE id=$1', [rows[0].author_id]);
        send(res, fmt({ ...rows[0], author_name: au.rows[0]?.name, avatar_url: au.rows[0]?.avatar_url })); return;
      }
      if (method === 'DELETE') {
        await db.query('DELETE FROM articles WHERE id=$1', [id]);
        send(res, { success: true }); return;
      }
    }

    // Admin publish toggle
    const pubMatch = path.match(/^\/admin\/articles\/(\d+)\/publish$/);
    if (pubMatch && method === 'PATCH') {
      if (!requireAdmin(req, res)) return;
      const id = parseInt(pubMatch[1], 10);
      const cur = await db.query('SELECT published FROM articles WHERE id=$1', [id]);
      if (!cur.rows.length) { send(res, { error: 'Not found' }, 404); return; }
      const { rows } = await db.query('UPDATE articles SET published=$1 WHERE id=$2 RETURNING *', [!cur.rows[0].published, id]);
      const au = await db.query('SELECT name, avatar_url FROM authors WHERE id=$1', [rows[0].author_id]);
      send(res, fmt({ ...rows[0], author_name: au.rows[0]?.name, avatar_url: au.rows[0]?.avatar_url })); return;
    }

    // Articles: featured
    if (path === '/articles/featured' && method === 'GET') {
      const { rows } = await db.query(`${JOIN} WHERE a.featured=true AND a.published=true ORDER BY a.published_at DESC LIMIT 1`);
      if (!rows.length) { send(res, { error: 'Not found' }, 404); return; }
      send(res, fmt(rows[0])); return;
    }

    // Articles: trending
    if (path === '/articles/trending' && method === 'GET') {
      const { rows } = await db.query(`${JOIN} WHERE a.published=true ORDER BY a.views DESC, a.published_at DESC LIMIT 5`);
      send(res, rows.map(fmt)); return;
    }

    // Articles: editors-picks
    if (path === '/articles/editors-picks' && method === 'GET') {
      const { rows } = await db.query(`${JOIN} WHERE a.editors_pick=true AND a.published=true ORDER BY a.published_at DESC LIMIT 6`);
      send(res, rows.map(fmt)); return;
    }

    // Articles: popular
    if (path === '/articles/popular' && method === 'GET') {
      const { rows } = await db.query(`${JOIN} WHERE a.published=true ORDER BY a.views DESC, a.published_at DESC LIMIT 10`);
      send(res, rows.map(fmt)); return;
    }

    // Articles: ticker
    if (path === '/articles/ticker' && method === 'GET') {
      const { rows } = await db.query('SELECT id,slug,title,category FROM articles WHERE published=true ORDER BY published_at DESC LIMIT 10');
      send(res, rows); return;
    }

    // Articles: search
    if (path === '/articles/search' && method === 'GET') {
      const q = url.searchParams.get('q') ?? '';
      const page = parseInt(url.searchParams.get('page') ?? '1', 10);
      const limit = parseInt(url.searchParams.get('limit') ?? '12', 10);
      const offset = (page - 1) * limit;
      if (!q.trim()) { send(res, { articles: [], total: 0, page, limit, hasMore: false }); return; }
      const pattern = `%${q}%`;
      const { rows } = await db.query(
        `${JOIN} WHERE a.published=true AND (a.title ILIKE $1 OR a.excerpt ILIKE $1 OR a.category ILIKE $1) ORDER BY a.published_at DESC LIMIT $2 OFFSET $3`,
        [pattern, limit, offset],
      );
      const { rows: countRows } = await db.query(
        `SELECT COUNT(*) as total FROM articles a WHERE a.published=true AND (a.title ILIKE $1 OR a.excerpt ILIKE $1 OR a.category ILIKE $1)`,
        [pattern],
      );
      const total = parseInt(countRows[0].total, 10);
      send(res, { articles: rows.map(fmt), total, page, limit, hasMore: offset + rows.length < total }); return;
    }

    // Articles: list
    if (path === '/articles' && method === 'GET') {
      const category = url.searchParams.get('category');
      const limit = Math.min(parseInt(url.searchParams.get('limit') ?? '12', 10), 50);
      const offset = parseInt(url.searchParams.get('offset') ?? '0', 10);
      const params = [];
      let where = 'WHERE a.published=true';
      if (category) { params.push(category); where += ` AND a.category=$${params.length}`; }
      // Count total for pagination
      const countParams = category ? [category] : [];
      const { rows: countRows } = await db.query(
        `SELECT COUNT(*) as total FROM articles a ${where}`,
        countParams,
      );
      const total = parseInt(countRows[0].total, 10);
      params.push(limit, offset);
      const { rows } = await db.query(
        `${JOIN} ${where} ORDER BY a.published_at DESC LIMIT $${params.length-1} OFFSET $${params.length}`,
        params,
      );
      send(res, { articles: rows.map(fmt), total, hasMore: offset + rows.length < total }); return;
    }

    // Articles: related
    const relMatch = path.match(/^\/articles\/([^/]+)\/related$/);
    if (relMatch && method === 'GET') {
      const slug = relMatch[1];
      const base = await db.query('SELECT category FROM articles WHERE slug=$1', [slug]);
      if (!base.rows.length) { send(res, []); return; }
      const { rows } = await db.query(
        `${JOIN} WHERE a.category=$1 AND a.slug!=$2 AND a.published=true ORDER BY a.published_at DESC LIMIT 4`,
        [base.rows[0].category, slug],
      );
      send(res, rows.map(fmt)); return;
    }

    // Articles: single by slug
    const slugMatch = path.match(/^\/articles\/([^/]+)$/);
    if (slugMatch && method === 'GET') {
      const slug = slugMatch[1];
      const { rows } = await db.query(`${JOIN} WHERE a.slug=$1`, [slug]);
      if (!rows.length) { send(res, { error: 'Not found' }, 404); return; }
      await db.query('UPDATE articles SET views=views+1 WHERE slug=$1', [slug]);
      send(res, fmt(rows[0])); return;
    }

    send(res, { error: 'Not found' }, 404);
  } catch (err) {
    console.error('[api] error:', err?.message ?? err);
    send(res, { error: 'Internal server error' }, 500);
  }
}
