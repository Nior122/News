/**
 * Vercel Serverless Function — handles all /api/* routes.
 * Uses static article data so no database is required on Vercel.
 * All routes mirror the Express server used on Replit.
 *
 * Admin routes write directly to api/_data.js via the GitHub API,
 * which triggers a Vercel auto-deploy on every save.
 *
 * Auth uses HMAC-SHA256 JWTs via the built-in Web Crypto API (zero deps).
 *
 * Routing: vercel.json rewrites /api/:path* → /api/index
 */

import { articles as _rawArticles, formatArticle } from './_data.js';

// Mutable copy so view counts can increment within a single invocation
const articles = _rawArticles.map(a => ({ ...a }));

const REPO = 'Nior122/News';
const DATA_PATH = 'api/_data.js';
const GITHUB_API = 'https://api.github.com';

// ── helpers ───────────────────────────────────────────────────────────────────

function send(res, data, status = 200) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.end(JSON.stringify(data));
}

function getCategories() {
  const seen = new Map();
  for (const a of articles) {
    const slug = a.category.toLowerCase().replace(/\s+/g, '-');
    if (!seen.has(slug)) seen.set(slug, { name: a.category, slug, color: '#3b82f6' });
  }
  return Array.from(seen.values());
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => { try { resolve(JSON.parse(body || '{}')); } catch { reject(new Error('Invalid JSON')); } });
    req.on('error', reject);
  });
}

// ── Lightweight JWT using Web Crypto (no npm deps) ────────────────────────────

function b64url(buf) {
  return Buffer.from(buf).toString('base64url');
}

function parseB64url(str) {
  return Buffer.from(str, 'base64url');
}

async function getCryptoKey(secret) {
  const enc = new TextEncoder();
  return crypto.subtle.importKey(
    'raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']
  );
}

async function signJwt(payload, secret) {
  const header = b64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = b64url(JSON.stringify(payload));
  const key = await getCryptoKey(secret);
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(`${header}.${body}`));
  return `${header}.${body}.${b64url(sig)}`;
}

async function verifyJwt(token, secret) {
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [header, body, sig] = parts;
  const key = await getCryptoKey(secret);
  const valid = await crypto.subtle.verify(
    'HMAC', key,
    parseB64url(sig),
    new TextEncoder().encode(`${header}.${body}`)
  );
  if (!valid) return null;
  const payload = JSON.parse(parseB64url(body).toString('utf8'));
  if (payload.exp && Date.now() / 1000 > payload.exp) return null;
  return payload;
}

function getSecret() {
  const s = process.env.ADMIN_PASSWORD;
  if (!s) throw new Error('ADMIN_PASSWORD not set');
  return s;
}

async function verifyAdmin(req) {
  const auth = req.headers['authorization'] ?? '';
  if (!auth.startsWith('Bearer ')) return false;
  try {
    const payload = await verifyJwt(auth.slice(7), getSecret());
    return payload?.admin === true;
  } catch {
    return false;
  }
}

// ── GitHub CMS helpers ────────────────────────────────────────────────────────

async function ghGet(path) {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error('GITHUB_TOKEN not set');
  const res = await fetch(`${GITHUB_API}/repos/${REPO}/contents/${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });
  if (!res.ok) throw new Error(`GitHub GET ${path} → ${res.status}`);
  return res.json();
}

async function ghPut(path, content, message, sha) {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error('GITHUB_TOKEN not set');
  const bodyObj = { message, content: Buffer.from(content, 'utf8').toString('base64') };
  if (sha) bodyObj.sha = sha;
  const res = await fetch(`${GITHUB_API}/repos/${REPO}/contents/${path}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(bodyObj),
  });
  if (!res.ok) { const err = await res.text(); throw new Error(`GitHub PUT → ${res.status}: ${err}`); }
  return res.json();
}

/**
 * Fetch _data.js from GitHub, parse the articles array, apply transform, write back.
 */
async function mutateDataFile(transform, commitMessage) {
  const file = await ghGet(DATA_PATH);
  const raw = Buffer.from(file.content, 'base64').toString('utf8');

  const startMarker = 'export const articles = [';
  const startIdx = raw.indexOf(startMarker);
  if (startIdx === -1) throw new Error('Could not find articles array in _data.js');

  let depth = 0, endIdx = startIdx + startMarker.length - 1;
  for (let i = endIdx; i < raw.length; i++) {
    if (raw[i] === '[') depth++;
    else if (raw[i] === ']') { depth--; if (depth === 0) { endIdx = i; break; } }
  }

  const arrayLiteral = raw.slice(startIdx + startMarker.length - 1, endIdx + 1);
  // eslint-disable-next-line no-new-func
  const existing = new Function(`return ${arrayLiteral}`)();
  const updated = transform(existing);

  const serialised = updated.map(a => {
    const date = typeof a.publishedAt === 'string' ? a.publishedAt : new Date(a.publishedAt).toISOString();
    return `  {
    id: ${a.id},
    slug: ${JSON.stringify(a.slug)},
    title: ${JSON.stringify(a.title)},
    subtitle: ${JSON.stringify(a.subtitle ?? '')},
    excerpt: ${JSON.stringify(a.excerpt)},
    body: \`${(a.body ?? '').replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${')}\`,
    category: ${JSON.stringify(a.category)},
    authorId: ${a.authorId},
    publishedAt: new Date(${JSON.stringify(date)}).toISOString(),
    readTime: ${a.readTime ?? 3},
    imageUrl: ${JSON.stringify(a.imageUrl)},
    views: ${a.views ?? 0},
    featured: ${!!a.featured},
    editorsPick: ${!!a.editorsPick},
    published: ${a.published !== false},
    tags: ${JSON.stringify(a.tags ?? [])},
  }`;
  }).join(',\n');

  const newSection = `export const articles = [\n${serialised},\n];`;
  // Replace from startIdx to endIdx+1 (the ']'), then keep the rest (';' onwards)
  const newRaw = raw.slice(0, startIdx) + newSection + raw.slice(endIdx + 1);
  await ghPut(DATA_PATH, newRaw, commitMessage, file.sha);
  return updated;
}

function normaliseArticle(a) {
  return { ...a, publishedAt: typeof a.publishedAt === 'string' ? a.publishedAt : new Date(a.publishedAt).toISOString() };
}

// ── main handler ──────────────────────────────────────────────────────────────

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.end();
  }

  const url = new URL(req.url ?? '/', `https://${req.headers.host ?? 'localhost'}`);
  const parts = url.pathname.replace(/^\/api\/?/, '').split('/').filter(Boolean);
  const q = url.searchParams;

  // ── GET /api/healthz ───────────────────────────────────────────────────────
  if (parts[0] === 'healthz') return send(res, { status: 'ok' });

  // ── ADMIN ──────────────────────────────────────────────────────────────────
  if (parts[0] === 'admin') {

    // POST /api/admin/login
    if (parts[1] === 'login' && req.method === 'POST') {
      try {
        const body = await readBody(req);
        const secret = getSecret();
        if (!body.password || body.password !== secret) return send(res, { error: 'Invalid password' }, 401);
        const token = await signJwt({ admin: true, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7 }, secret);
        return send(res, { token });
      } catch (e) { return send(res, { error: e.message }, 400); }
    }

    if (!await verifyAdmin(req)) return send(res, { error: 'Unauthorized' }, 401);

    // GET /api/admin/articles
    if (parts[1] === 'articles' && !parts[2] && req.method === 'GET') {
      try {
        const file = await ghGet(DATA_PATH);
        const raw = Buffer.from(file.content, 'base64').toString('utf8');
        const startMarker = 'export const articles = [';
        const startIdx = raw.indexOf(startMarker);
        let depth = 0, endIdx = startIdx + startMarker.length - 1;
        for (let i = endIdx; i < raw.length; i++) {
          if (raw[i] === '[') depth++;
          else if (raw[i] === ']') { depth--; if (depth === 0) { endIdx = i; break; } }
        }
        // eslint-disable-next-line no-new-func
        const list = new Function(`return ${raw.slice(startIdx + startMarker.length - 1, endIdx + 1)}`)();
        return send(res, list.map(normaliseArticle));
      } catch (e) { return send(res, { error: e.message }, 500); }
    }

    // POST /api/admin/articles
    if (parts[1] === 'articles' && !parts[2] && req.method === 'POST') {
      try {
        const body = await readBody(req);
        let created;
        const updated = await mutateDataFile(existing => {
          const maxId = existing.reduce((m, a) => Math.max(m, a.id ?? 0), 0);
          created = {
            id: maxId + 1,
            slug: body.slug,
            title: body.title,
            subtitle: body.subtitle ?? '',
            excerpt: body.excerpt,
            body: body.body ?? '',
            category: body.category,
            authorId: Number(body.authorId) || 1,
            publishedAt: new Date().toISOString(),
            readTime: Number(body.readTime) || 3,
            imageUrl: body.imageUrl ?? '',
            views: 0,
            featured: !!body.featured,
            editorsPick: !!body.editorsPick,
            published: body.published !== false,
            tags: body.tags ?? [],
          };
          return [...existing, created];
        }, `admin: create article "${body.slug}"`);
        return send(res, normaliseArticle(updated[updated.length - 1]), 201);
      } catch (e) { return send(res, { error: e.message }, 500); }
    }

    // PUT /api/admin/articles/:id
    if (parts[1] === 'articles' && parts[2] && !parts[3] && req.method === 'PUT') {
      try {
        const id = parseInt(parts[2], 10);
        const body = await readBody(req);
        let saved;
        await mutateDataFile(existing => existing.map(a => {
          if (a.id !== id) return a;
          saved = {
            ...a,
            title: body.title ?? a.title,
            subtitle: body.subtitle ?? a.subtitle,
            excerpt: body.excerpt ?? a.excerpt,
            body: body.body ?? a.body,
            category: body.category ?? a.category,
            authorId: Number(body.authorId) || a.authorId,
            imageUrl: body.imageUrl ?? a.imageUrl,
            readTime: Number(body.readTime) || a.readTime,
            featured: body.featured !== undefined ? !!body.featured : a.featured,
            editorsPick: body.editorsPick !== undefined ? !!body.editorsPick : a.editorsPick,
            published: body.published !== undefined ? !!body.published : a.published,
            tags: body.tags ?? a.tags,
          };
          return saved;
        }), `admin: update article "${body.slug ?? id}"`);
        if (!saved) return send(res, { error: 'Not found' }, 404);
        return send(res, normaliseArticle(saved));
      } catch (e) { return send(res, { error: e.message }, 500); }
    }

    // PATCH /api/admin/articles/:id/publish
    if (parts[1] === 'articles' && parts[2] && parts[3] === 'publish' && req.method === 'PATCH') {
      try {
        const id = parseInt(parts[2], 10);
        let saved;
        await mutateDataFile(existing => existing.map(a => {
          if (a.id !== id) return a;
          saved = { ...a, published: !a.published };
          return saved;
        }), `admin: toggle publish article ${id}`);
        if (!saved) return send(res, { error: 'Not found' }, 404);
        return send(res, normaliseArticle(saved));
      } catch (e) { return send(res, { error: e.message }, 500); }
    }

    // DELETE /api/admin/articles/:id
    if (parts[1] === 'articles' && parts[2] && !parts[3] && req.method === 'DELETE') {
      try {
        const id = parseInt(parts[2], 10);
        await mutateDataFile(
          existing => existing.filter(a => a.id !== id),
          `admin: delete article ${id}`
        );
        return send(res, { success: true });
      } catch (e) { return send(res, { error: e.message }, 500); }
    }

    return send(res, { error: 'Not found' }, 404);
  }

  // ── PUBLIC ARTICLES ────────────────────────────────────────────────────────
  if (parts[0] === 'articles') {
    const pub = articles.filter(a => a.published !== false);

    if (parts[1] === 'featured') {
      const a = pub.find(a => a.featured) ?? [...pub].sort((a, b) => b.views - a.views)[0];
      return a ? send(res, formatArticle(a)) : send(res, { error: 'No articles found' }, 404);
    }

    if (parts[1] === 'trending') {
      const limit = Math.min(parseInt(q.get('limit') ?? '5', 10), 20);
      return send(res, [...pub].sort((a, b) => b.views - a.views).slice(0, limit).map(formatArticle));
    }

    if (parts[1] === 'popular') {
      const limit = Math.min(parseInt(q.get('limit') ?? '6', 10), 20);
      return send(res, [...pub].sort((a, b) => b.views - a.views).slice(0, limit).map(formatArticle));
    }

    if (parts[1] === 'editors-picks') {
      const limit = Math.min(parseInt(q.get('limit') ?? '4', 10), 20);
      return send(res, pub.filter(a => a.editorsPick).slice(0, limit).map(formatArticle));
    }

    if (parts[1] === 'ticker') {
      const ticker = [...pub]
        .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
        .slice(0, 10)
        .map(({ id, title, slug }) => ({ id, title, slug }));
      return send(res, ticker);
    }

    if (parts[1] === 'search') {
      const term = (q.get('q') ?? '').trim().toLowerCase();
      const page = Math.max(1, parseInt(q.get('page') ?? '1', 10));
      const limit = Math.min(parseInt(q.get('limit') ?? '12', 10), 50);
      if (!term) return send(res, { articles: [], total: 0, page, limit, hasMore: false });
      const filtered = pub.filter(a =>
        a.title.toLowerCase().includes(term) ||
        a.excerpt.toLowerCase().includes(term) ||
        a.category.toLowerCase().includes(term) ||
        (a.tags ?? []).some(t => t.toLowerCase().includes(term))
      );
      const total = filtered.length;
      const offset = (page - 1) * limit;
      const paged = filtered.slice(offset, offset + limit);
      return send(res, { articles: paged.map(formatArticle), total, page, limit, hasMore: offset + paged.length < total });
    }

    if (parts[1] && parts[2] === 'related') {
      const current = pub.find(a => a.slug === parts[1]);
      if (!current) return send(res, []);
      const currentTags = new Set((current.tags ?? []).map(t => t.toLowerCase()));
      const related = pub
        .filter(a => a.slug !== parts[1])
        .map(a => {
          const sharedTags = (a.tags ?? []).filter(t => currentTags.has(t.toLowerCase())).length;
          return { a, score: sharedTags * 3 + (a.category === current.category ? 1 : 0) };
        })
        .filter(s => s.score > 0)
        .sort((x, y) => y.score - x.score || new Date(y.a.publishedAt) - new Date(x.a.publishedAt))
        .slice(0, 3).map(s => s.a);
      return send(res, related.map(formatArticle));
    }

    if (parts[1] && !parts[2]) {
      const article = pub.find(a => a.slug === parts[1]);
      if (!article) return send(res, { error: 'Article not found' }, 404);
      article.views += 1;
      return send(res, formatArticle(article));
    }

    if (!parts[1]) {
      const page = Math.max(1, parseInt(q.get('page') ?? '1', 10));
      const limit = Math.min(parseInt(q.get('limit') ?? '12', 10), 50);
      const category = q.get('category');
      const filtered = category
        ? pub.filter(a => a.category.toLowerCase().replace(/\s+/g, '-') === category.toLowerCase())
        : pub;
      const total = filtered.length;
      const offset = (page - 1) * limit;
      const paged = filtered.slice(offset, offset + limit);
      return send(res, { articles: paged.map(formatArticle), total, page, limit, hasMore: offset + paged.length < total });
    }
  }

  // ── CATEGORIES ─────────────────────────────────────────────────────────────
  if (parts[0] === 'categories') {
    const pub = articles.filter(a => a.published !== false);
    if (parts[1] && parts[2] === 'articles') {
      return send(res, pub.filter(a => a.category.toLowerCase().replace(/\s+/g, '-') === parts[1]).slice(0, 4).map(formatArticle));
    }
    if (!parts[1]) return send(res, getCategories());
  }

  // ── NEWSLETTER ─────────────────────────────────────────────────────────────
  if (parts[0] === 'newsletter' && parts[1] === 'subscribe' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        const parsed = JSON.parse(body || '{}');
        const email = typeof parsed?.email === 'string' ? parsed.email.trim() : '';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return send(res, { error: 'Invalid email address' }, 400);
        return send(res, { message: "You're subscribed! Welcome to the Scrolltek community." });
      } catch { return send(res, { error: 'Invalid request body' }, 400); }
    });
    return;
  }

  send(res, { error: 'Not found' }, 404);
}
