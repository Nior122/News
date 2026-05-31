import { Router } from "express";
import { db, articlesTable, authorsTable } from "@workspace/db";
import { eq, desc, and, sql } from "drizzle-orm";
import { getCached, setCached } from "../lib/cache";

const router = Router();

function nameToSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

router.get("/authors", async (req, res) => {
  try {
    const cacheKey = "authors:list";
    const cached = getCached<object[]>(cacheKey);
    if (cached) { res.json(cached); return; }

    const authors = await db.select().from(authorsTable);
    const result = authors.map((a) => ({ ...a, slug: nameToSlug(a.name) }));

    setCached(cacheKey, result, 10 * 60 * 1000);
    res.json(result);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/authors/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const cacheKey = `authors:slug:${slug}`;
    const cached = getCached<object>(cacheKey);
    if (cached) { res.json(cached); return; }

    const authors = await db.select().from(authorsTable);
    const author = authors.find((a) => nameToSlug(a.name) === slug);

    if (!author) {
      res.status(404).json({ error: "Author not found" });
      return;
    }

    const articles = await db
      .select()
      .from(articlesTable)
      .where(and(eq(articlesTable.authorId, author.id), eq(articlesTable.published, true)))
      .orderBy(desc(articlesTable.publishedAt));

    const [countResult] = await db
      .select({ totalViews: sql<number>`sum(${articlesTable.views})` })
      .from(articlesTable)
      .where(and(eq(articlesTable.authorId, author.id), eq(articlesTable.published, true)));

    const result = {
      ...author,
      slug,
      articleCount: articles.length,
      totalViews: Number(countResult?.totalViews ?? 0),
      articles: articles.map((a) => ({
        ...a,
        author: { id: author.id, name: author.name, avatarUrl: author.avatarUrl },
        publishedAt: a.publishedAt.toISOString(),
      })),
    };

    setCached(cacheKey, result, 5 * 60 * 1000);
    res.json(result);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
