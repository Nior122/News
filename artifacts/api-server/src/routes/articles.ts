import { Router } from "express";
import { db, articlesTable, authorsTable } from "@workspace/db";
import { eq, desc, ilike, or, sql, and } from "drizzle-orm";
import { getCached, setCached, invalidatePrefix } from "../lib/cache";

const router = Router();

const SLUG_TO_CATEGORY: Record<string, string> = {
  tech: "Tech",
  culture: "Culture",
  lifestyle: "Lifestyle",
  "ai-tools": "AI Tools",
  "phone-tips": "Phone Tips",
  productivity: "Productivity",
  trending: "Trending",
};

function slugToCategory(slug: string): string {
  return SLUG_TO_CATEGORY[slug.toLowerCase()] ?? slug;
}

export function invalidateArticlesCache() {
  invalidatePrefix("articles:");
}

async function getAuthors() {
  const CACHE_KEY = "authors:all";
  const cached = getCached<typeof authorsTable.$inferSelect[]>(CACHE_KEY);
  if (cached) return cached;
  const authors = await db.select().from(authorsTable);
  setCached(CACHE_KEY, authors, 10 * 60 * 1000);
  return authors;
}

router.get("/articles", async (req, res) => {
  try {
    const page = parseInt(String(req.query.page ?? "1"), 10);
    const limit = Math.min(parseInt(String(req.query.limit ?? "12"), 10), 100);
    const categorySlug = req.query.category as string | undefined;
    const category = categorySlug ? slugToCategory(categorySlug) : undefined;
    const offset = (page - 1) * limit;

    const cacheKey = `articles:list:${category ?? "all"}:${page}:${limit}`;
    const cached = getCached<object>(cacheKey);
    if (cached) {
      res.json(cached);
      return;
    }

    const publishedFilter = eq(articlesTable.published, true);
    const whereClause = category
      ? and(publishedFilter, eq(articlesTable.category, category))
      : publishedFilter;

    const [articles, authors, countResult] = await Promise.all([
      db
        .select()
        .from(articlesTable)
        .where(whereClause)
        .orderBy(desc(articlesTable.publishedAt))
        .limit(limit)
        .offset(offset),
      getAuthors(),
      db
        .select({ count: sql<number>`count(*)` })
        .from(articlesTable)
        .where(whereClause),
    ]);

    const authorMap = new Map(authors.map((a) => [a.id, a]));
    const total = Number(countResult[0]?.count ?? 0);

    const result = {
      articles: articles.map((a) => ({
        ...a,
        author: authorMap.get(a.authorId) ?? { name: "Staff Writer", avatarUrl: "" },
        publishedAt: a.publishedAt.toISOString(),
      })),
      total,
      page,
      limit,
      hasMore: offset + articles.length < total,
    };

    setCached(cacheKey, result);
    res.json(result);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/articles/featured", async (req, res) => {
  try {
    const cacheKey = "articles:featured";
    const cached = getCached<object>(cacheKey);
    if (cached) {
      res.json(cached);
      return;
    }

    const articles = await db
      .select()
      .from(articlesTable)
      .where(and(eq(articlesTable.published, true), eq(articlesTable.featured, true)))
      .orderBy(desc(articlesTable.publishedAt))
      .limit(1);

    const authors = await getAuthors();
    const authorMap = new Map(authors.map((a) => [a.id, a]));

    if (!articles.length) {
      const fallback = await db
        .select()
        .from(articlesTable)
        .where(eq(articlesTable.published, true))
        .orderBy(desc(articlesTable.views))
        .limit(1);
      if (!fallback.length) {
        res.status(404).json({ error: "No articles found" });
        return;
      }
      const result = {
        ...fallback[0],
        author: authorMap.get(fallback[0].authorId) ?? { name: "Staff Writer", avatarUrl: "" },
        publishedAt: fallback[0].publishedAt.toISOString(),
      };
      setCached(cacheKey, result);
      res.json(result);
      return;
    }

    const result = {
      ...articles[0],
      author: authorMap.get(articles[0].authorId) ?? { name: "Staff Writer", avatarUrl: "" },
      publishedAt: articles[0].publishedAt.toISOString(),
    };
    setCached(cacheKey, result);
    res.json(result);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/articles/trending", async (req, res) => {
  try {
    const limit = parseInt(String(req.query.limit ?? "10"), 10);
    const cacheKey = `articles:trending:${limit}`;
    const cached = getCached<object[]>(cacheKey);
    if (cached) {
      res.json(cached);
      return;
    }

    const pool = await db
      .select()
      .from(articlesTable)
      .where(eq(articlesTable.published, true))
      .orderBy(desc(articlesTable.publishedAt))
      .limit(27);

    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }

    const articles = pool.slice(0, limit);
    const authors = await getAuthors();
    const authorMap = new Map(authors.map((a) => [a.id, a]));

    const result = articles.map((a) => ({
      ...a,
      author: authorMap.get(a.authorId) ?? { name: "Staff Writer", avatarUrl: "" },
      publishedAt: a.publishedAt.toISOString(),
    }));

    setCached(cacheKey, result, 60 * 1000);
    res.json(result);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/articles/popular", async (req, res) => {
  try {
    const limit = parseInt(String(req.query.limit ?? "6"), 10);
    const cacheKey = `articles:popular:${limit}`;
    const cached = getCached<object[]>(cacheKey);
    if (cached) {
      res.json(cached);
      return;
    }

    const articles = await db
      .select()
      .from(articlesTable)
      .where(eq(articlesTable.published, true))
      .orderBy(desc(articlesTable.views))
      .limit(limit);

    const authors = await getAuthors();
    const authorMap = new Map(authors.map((a) => [a.id, a]));

    const result = articles.map((a) => ({
      ...a,
      author: authorMap.get(a.authorId) ?? { name: "Staff Writer", avatarUrl: "" },
      publishedAt: a.publishedAt.toISOString(),
    }));

    setCached(cacheKey, result);
    res.json(result);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/articles/editors-picks", async (req, res) => {
  try {
    const limit = parseInt(String(req.query.limit ?? "4"), 10);
    const cacheKey = `articles:editors-picks:${limit}`;
    const cached = getCached<object[]>(cacheKey);
    if (cached) {
      res.json(cached);
      return;
    }

    const articles = await db
      .select()
      .from(articlesTable)
      .where(and(eq(articlesTable.published, true), eq(articlesTable.editorsPick, true)))
      .orderBy(desc(articlesTable.publishedAt))
      .limit(limit);

    const authors = await getAuthors();
    const authorMap = new Map(authors.map((a) => [a.id, a]));

    const result = articles.map((a) => ({
      ...a,
      author: authorMap.get(a.authorId) ?? { name: "Staff Writer", avatarUrl: "" },
      publishedAt: a.publishedAt.toISOString(),
    }));

    setCached(cacheKey, result);
    res.json(result);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/articles/ticker", async (req, res) => {
  try {
    const cacheKey = "articles:ticker";
    const cached = getCached<object[]>(cacheKey);
    if (cached) {
      res.json(cached);
      return;
    }

    const articles = await db
      .select({ id: articlesTable.id, title: articlesTable.title, slug: articlesTable.slug })
      .from(articlesTable)
      .orderBy(desc(articlesTable.publishedAt))
      .limit(10);

    setCached(cacheKey, articles, 5 * 60 * 1000);
    res.json(articles);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/articles/search", async (req, res) => {
  try {
    const q = String(req.query.q ?? "");
    const page = parseInt(String(req.query.page ?? "1"), 10);
    const limit = parseInt(String(req.query.limit ?? "12"), 10);
    const offset = (page - 1) * limit;

    if (!q.trim()) {
      res.json({ articles: [], total: 0, page, limit, hasMore: false });
      return;
    }

    const searchPattern = `%${q}%`;

    const allAuthors = await getAuthors();
    const matchingAuthorIds = allAuthors
      .filter((a) => a.name.toLowerCase().includes(q.toLowerCase()))
      .map((a) => a.id);

    const searchConditions = [
      ilike(articlesTable.title, searchPattern),
      ilike(articlesTable.excerpt, searchPattern),
      ilike(articlesTable.category, searchPattern),
      sql<boolean>`array_to_string(${articlesTable.tags}, ' ') ILIKE ${searchPattern}`,
      ...(matchingAuthorIds.length > 0
        ? [sql<boolean>`${articlesTable.authorId} = ANY(ARRAY[${sql.join(matchingAuthorIds.map((id) => sql`${id}`), sql`, `)}]::int[])`]
        : []),
    ];

    const whereClause = and(
      eq(articlesTable.published, true),
      or(...searchConditions)
    );

    const [articles, countResult] = await Promise.all([
      db
        .select()
        .from(articlesTable)
        .where(whereClause)
        .orderBy(desc(articlesTable.publishedAt))
        .limit(limit)
        .offset(offset),
      db.select({ count: sql<number>`count(*)` }).from(articlesTable).where(whereClause),
    ]);

    const authorMap = new Map(allAuthors.map((a) => [a.id, a]));
    const total = Number(countResult[0]?.count ?? 0);

    res.json({
      articles: articles.map((a) => ({
        ...a,
        author: authorMap.get(a.authorId) ?? { name: "Staff Writer", avatarUrl: "" },
        publishedAt: a.publishedAt.toISOString(),
      })),
      total,
      page,
      limit,
      hasMore: offset + articles.length < total,
    });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/articles/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const cacheKey = `articles:slug:${slug}`;
    const cached = getCached<object>(cacheKey);

    if (cached) {
      res.json(cached);
      db.update(articlesTable)
        .set({ views: sql`${articlesTable.views} + 1` })
        .where(eq(articlesTable.slug, slug))
        .catch(() => {});
      return;
    }

    const articles = await db
      .select()
      .from(articlesTable)
      .where(and(eq(articlesTable.slug, slug), eq(articlesTable.published, true)))
      .limit(1);

    if (!articles.length) {
      res.status(404).json({ error: "Article not found" });
      return;
    }

    const article = articles[0];
    const authors = await getAuthors();
    const authorMap = new Map(authors.map((a) => [a.id, a]));

    await db
      .update(articlesTable)
      .set({ views: sql`${articlesTable.views} + 1` })
      .where(eq(articlesTable.id, article.id));

    const result = {
      ...article,
      author: authorMap.get(article.authorId) ?? { name: "Staff Writer", avatarUrl: "" },
      publishedAt: article.publishedAt.toISOString(),
    };

    setCached(cacheKey, result, 5 * 60 * 1000);
    res.json(result);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/articles/:slug/related", async (req, res) => {
  try {
    const { slug } = req.params;
    const cacheKey = `articles:related:${slug}`;
    const cached = getCached<object[]>(cacheKey);
    if (cached) {
      res.json(cached);
      return;
    }

    const current = await db
      .select()
      .from(articlesTable)
      .where(eq(articlesTable.slug, slug))
      .limit(1);

    if (!current.length) {
      res.json([]);
      return;
    }

    const currentArticle = current[0];
    const currentTags = new Set((currentArticle.tags ?? []).map((t) => t.toLowerCase()));

    const candidates = await db
      .select()
      .from(articlesTable)
      .where(and(eq(articlesTable.published, true), eq(articlesTable.category, currentArticle.category)))
      .orderBy(desc(articlesTable.publishedAt))
      .limit(20);

    const scored = candidates
      .filter((a) => a.slug !== slug)
      .map((a) => {
        const sharedTags = (a.tags ?? []).filter((t) => currentTags.has(t.toLowerCase())).length;
        return { article: a, score: sharedTags * 3 + 1 };
      })
      .sort((a, b) => b.score - a.score || b.article.publishedAt.getTime() - a.article.publishedAt.getTime())
      .slice(0, 3)
      .map((s) => s.article);

    const authors = await getAuthors();
    const authorMap = new Map(authors.map((a) => [a.id, a]));

    const result = scored.map((a) => ({
      ...a,
      author: authorMap.get(a.authorId) ?? { name: "Staff Writer", avatarUrl: "" },
      publishedAt: a.publishedAt.toISOString(),
    }));

    setCached(cacheKey, result, 5 * 60 * 1000);
    res.json(result);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
