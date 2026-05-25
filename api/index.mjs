/**
 * Vercel Serverless Function — handles all /api/* routes.
 * Uses static article data so no database is required on Vercel.
 * All routes mirror the Express server used on Replit.
 *
 * Routing: vercel.json rewrites /api/:path* → /api/index
 */

import { articles as _rawArticles, formatArticle } from './_data.js';

// Mutable copy so view counts can increment within a single invocation
const articles = _rawArticles.map(a => ({ ...a }));

function send(res, data, status = 200) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.end(JSON.stringify(data));
}

function getCategories() {
  const seen = new Map();
  for (const a of articles) {
    const slug = a.category.toLowerCase().replace(/\s+/g, '-');
    if (!seen.has(slug)) {
      seen.set(slug, { name: a.category, slug, color: '#3b82f6' });
    }
  }
  return Array.from(seen.values());
}

export default function handler(req, res) {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.end();
  }

  const url = new URL(req.url ?? '/', `https://${req.headers.host ?? 'localhost'}`);
  // Strip /api/ prefix and split into parts
  const parts = url.pathname.replace(/^\/api\/?/, '').split('/').filter(Boolean);
  const q = url.searchParams;

  // ── GET /api/healthz ─────────────────────────────────────────────────────
  if (parts[0] === 'healthz') {
    return send(res, { status: 'ok' });
  }

  // ── ARTICLES ──────────────────────────────────────────────────────────────
  if (parts[0] === 'articles') {

    // GET /api/articles/featured
    if (parts[1] === 'featured') {
      const a = articles.find(a => a.featured)
        ?? [...articles].sort((a, b) => b.views - a.views)[0];
      return a
        ? send(res, formatArticle(a))
        : send(res, { error: 'No articles found' }, 404);
    }

    // GET /api/articles/trending
    if (parts[1] === 'trending') {
      const limit = Math.min(parseInt(q.get('limit') ?? '5', 10), 20);
      return send(res,
        [...articles].sort((a, b) => b.views - a.views).slice(0, limit).map(formatArticle)
      );
    }

    // GET /api/articles/popular
    if (parts[1] === 'popular') {
      const limit = Math.min(parseInt(q.get('limit') ?? '6', 10), 20);
      return send(res,
        [...articles].sort((a, b) => b.views - a.views).slice(0, limit).map(formatArticle)
      );
    }

    // GET /api/articles/editors-picks
    if (parts[1] === 'editors-picks') {
      const limit = Math.min(parseInt(q.get('limit') ?? '4', 10), 20);
      return send(res,
        articles.filter(a => a.editorsPick).slice(0, limit).map(formatArticle)
      );
    }

    // GET /api/articles/ticker
    if (parts[1] === 'ticker') {
      const ticker = [...articles]
        .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
        .slice(0, 10)
        .map(({ id, title, slug }) => ({ id, title, slug }));
      return send(res, ticker);
    }

    // GET /api/articles/search?q=...
    if (parts[1] === 'search') {
      const term = (q.get('q') ?? '').trim().toLowerCase();
      const page = Math.max(1, parseInt(q.get('page') ?? '1', 10));
      const limit = Math.min(parseInt(q.get('limit') ?? '12', 10), 50);
      if (!term) {
        return send(res, { articles: [], total: 0, page, limit, hasMore: false });
      }
      const filtered = articles.filter(a =>
        a.title.toLowerCase().includes(term) ||
        a.excerpt.toLowerCase().includes(term) ||
        a.category.toLowerCase().includes(term) ||
        a.tags.some(t => t.toLowerCase().includes(term))
      );
      const total = filtered.length;
      const offset = (page - 1) * limit;
      const paged = filtered.slice(offset, offset + limit);
      return send(res, {
        articles: paged.map(formatArticle),
        total, page, limit,
        hasMore: offset + paged.length < total,
      });
    }

    // GET /api/articles/:slug/related
    if (parts[1] && parts[2] === 'related') {
      const current = articles.find(a => a.slug === parts[1]);
      if (!current) return send(res, []);
      const related = articles
        .filter(a => a.slug !== parts[1] && a.category === current.category)
        .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
        .slice(0, 3);
      return send(res, related.map(formatArticle));
    }

    // GET /api/articles/:slug
    if (parts[1] && !parts[2]) {
      const article = articles.find(a => a.slug === parts[1]);
      if (!article) return send(res, { error: 'Article not found' }, 404);
      article.views += 1;
      return send(res, formatArticle(article));
    }

    // GET /api/articles  (paginated list)
    if (!parts[1]) {
      const page = Math.max(1, parseInt(q.get('page') ?? '1', 10));
      const limit = Math.min(parseInt(q.get('limit') ?? '12', 10), 50);
      const category = q.get('category');
      const filtered = category
        ? articles.filter(a =>
            a.category.toLowerCase().replace(/\s+/g, '-') === category.toLowerCase()
          )
        : articles;
      const total = filtered.length;
      const offset = (page - 1) * limit;
      const paged = filtered.slice(offset, offset + limit);
      return send(res, {
        articles: paged.map(formatArticle),
        total, page, limit,
        hasMore: offset + paged.length < total,
      });
    }
  }

  // ── CATEGORIES ────────────────────────────────────────────────────────────
  if (parts[0] === 'categories') {

    // GET /api/categories/:slug/articles  (category spotlight — 4 articles)
    if (parts[1] && parts[2] === 'articles') {
      const catArticles = articles
        .filter(a => a.category.toLowerCase().replace(/\s+/g, '-') === parts[1])
        .slice(0, 4);
      return send(res, catArticles.map(formatArticle));
    }

    // GET /api/categories
    if (!parts[1]) {
      return send(res, getCategories());
    }
  }

  // ── NEWSLETTER ────────────────────────────────────────────────────────────
  if (parts[0] === 'newsletter' && parts[1] === 'subscribe' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        const parsed = JSON.parse(body || '{}');
        const email = typeof parsed?.email === 'string' ? parsed.email.trim() : '';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          return send(res, { error: 'Invalid email address' }, 400);
        }
        return send(res, { message: "You're subscribed! Welcome to the PulseWire community." });
      } catch {
        return send(res, { error: 'Invalid request body' }, 400);
      }
    });
    return;
  }

  send(res, { error: 'Not found' }, 404);
}
