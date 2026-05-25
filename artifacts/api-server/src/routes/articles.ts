import { Router } from "express";
import { db, articlesTable, authorsTable } from "@workspace/db";
import { eq, desc, ilike, or, sql } from "drizzle-orm";

const router = Router();

router.get("/articles", async (req, res) => {
  try {
    const page = parseInt(String(req.query.page ?? "1"), 10);
    const limit = parseInt(String(req.query.limit ?? "12"), 10);
    const category = req.query.category as string | undefined;
    const offset = (page - 1) * limit;

    const whereClause = category ? eq(articlesTable.category, category) : undefined;

    const [articles, authors, countResult] = await Promise.all([
      db
        .select()
        .from(articlesTable)
        .where(whereClause)
        .orderBy(desc(articlesTable.publishedAt))
        .limit(limit)
        .offset(offset),
      db.select().from(authorsTable),
      db
        .select({ count: sql<number>`count(*)` })
        .from(articlesTable)
        .where(whereClause),
    ]);

    const authorMap = new Map(authors.map((a) => [a.id, a]));
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

router.get("/articles/featured", async (req, res) => {
  try {
    const articles = await db
      .select()
      .from(articlesTable)
      .where(eq(articlesTable.featured, true))
      .orderBy(desc(articlesTable.publishedAt))
      .limit(1);

    if (!articles.length) {
      const fallback = await db
        .select()
        .from(articlesTable)
        .orderBy(desc(articlesTable.views))
        .limit(1);
      if (!fallback.length) {
        res.status(404).json({ error: "No articles found" });
        return;
      }
      const author = await db
        .select()
        .from(authorsTable)
        .where(eq(authorsTable.id, fallback[0].authorId))
        .limit(1);
      res.json({
        ...fallback[0],
        author: author[0] ?? { name: "Staff Writer", avatarUrl: "" },
        publishedAt: fallback[0].publishedAt.toISOString(),
      });
      return;
    }

    const author = await db
      .select()
      .from(authorsTable)
      .where(eq(authorsTable.id, articles[0].authorId))
      .limit(1);

    res.json({
      ...articles[0],
      author: author[0] ?? { name: "Staff Writer", avatarUrl: "" },
      publishedAt: articles[0].publishedAt.toISOString(),
    });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/articles/trending", async (req, res) => {
  try {
    const limit = parseInt(String(req.query.limit ?? "5"), 10);

    const articles = await db
      .select()
      .from(articlesTable)
      .orderBy(desc(articlesTable.views))
      .limit(limit);

    const authors = await db.select().from(authorsTable);
    const authorMap = new Map(authors.map((a) => [a.id, a]));

    res.json(
      articles.map((a) => ({
        ...a,
        author: authorMap.get(a.authorId) ?? { name: "Staff Writer", avatarUrl: "" },
        publishedAt: a.publishedAt.toISOString(),
      }))
    );
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/articles/popular", async (req, res) => {
  try {
    const limit = parseInt(String(req.query.limit ?? "6"), 10);

    const articles = await db
      .select()
      .from(articlesTable)
      .orderBy(desc(articlesTable.views))
      .limit(limit);

    const authors = await db.select().from(authorsTable);
    const authorMap = new Map(authors.map((a) => [a.id, a]));

    res.json(
      articles.map((a) => ({
        ...a,
        author: authorMap.get(a.authorId) ?? { name: "Staff Writer", avatarUrl: "" },
        publishedAt: a.publishedAt.toISOString(),
      }))
    );
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/articles/editors-picks", async (req, res) => {
  try {
    const limit = parseInt(String(req.query.limit ?? "4"), 10);

    const articles = await db
      .select()
      .from(articlesTable)
      .where(eq(articlesTable.editorsPick, true))
      .orderBy(desc(articlesTable.publishedAt))
      .limit(limit);

    const authors = await db.select().from(authorsTable);
    const authorMap = new Map(authors.map((a) => [a.id, a]));

    res.json(
      articles.map((a) => ({
        ...a,
        author: authorMap.get(a.authorId) ?? { name: "Staff Writer", avatarUrl: "" },
        publishedAt: a.publishedAt.toISOString(),
      }))
    );
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/articles/ticker", async (req, res) => {
  try {
    const articles = await db
      .select({ id: articlesTable.id, title: articlesTable.title, slug: articlesTable.slug })
      .from(articlesTable)
      .orderBy(desc(articlesTable.publishedAt))
      .limit(10);

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
    const whereClause = or(
      ilike(articlesTable.title, searchPattern),
      ilike(articlesTable.excerpt, searchPattern),
      ilike(articlesTable.category, searchPattern)
    );

    const [articles, authors, countResult] = await Promise.all([
      db
        .select()
        .from(articlesTable)
        .where(whereClause)
        .orderBy(desc(articlesTable.publishedAt))
        .limit(limit)
        .offset(offset),
      db.select().from(authorsTable),
      db.select({ count: sql<number>`count(*)` }).from(articlesTable).where(whereClause),
    ]);

    const authorMap = new Map(authors.map((a) => [a.id, a]));
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

    const articles = await db
      .select()
      .from(articlesTable)
      .where(eq(articlesTable.slug, slug))
      .limit(1);

    if (!articles.length) {
      res.status(404).json({ error: "Article not found" });
      return;
    }

    const article = articles[0];
    const author = await db
      .select()
      .from(authorsTable)
      .where(eq(authorsTable.id, article.authorId))
      .limit(1);

    // Increment views
    await db
      .update(articlesTable)
      .set({ views: article.views + 1 })
      .where(eq(articlesTable.id, article.id));

    res.json({
      ...article,
      author: author[0] ?? { name: "Staff Writer", avatarUrl: "" },
      publishedAt: article.publishedAt.toISOString(),
    });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/articles/:slug/related", async (req, res) => {
  try {
    const { slug } = req.params;

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
      .orderBy(desc(articlesTable.publishedAt));

    const scored = candidates
      .filter((a) => a.slug !== slug)
      .map((a) => {
        const sharedTags = (a.tags ?? []).filter((t) => currentTags.has(t.toLowerCase())).length;
        const sameCategory = a.category === currentArticle.category ? 1 : 0;
        return { article: a, score: sharedTags * 3 + sameCategory };
      })
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score || b.article.publishedAt.getTime() - a.article.publishedAt.getTime())
      .slice(0, 3)
      .map((s) => s.article);

    const authors = await db.select().from(authorsTable);
    const authorMap = new Map(authors.map((a) => [a.id, a]));

    res.json(
      scored.map((a) => ({
        ...a,
        author: authorMap.get(a.authorId) ?? { name: "Staff Writer", avatarUrl: "" },
        publishedAt: a.publishedAt.toISOString(),
      }))
    );
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
