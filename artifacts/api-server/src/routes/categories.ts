import { Router } from "express";
import { db, articlesTable, authorsTable } from "@workspace/db";
import { eq, desc, sql } from "drizzle-orm";

const router = Router();

router.get("/categories", async (req, res) => {
  try {
    const result = await db.execute<{
      slug: string;
      name: string;
      color: string;
      article_count: number | null;
    }>(sql`SELECT slug, name, color, article_count FROM categories ORDER BY name`);
    res.json(
      result.rows.map((r, index) => ({
        id: index + 1,
        slug: r.slug,
        name: r.name,
        color: r.color,
        articleCount: r.article_count ?? 0,
      })),
    );
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/categories/:slug/articles", async (req, res) => {
  try {
    const { slug } = req.params;

    const articles = await db
      .select()
      .from(articlesTable)
      .where(eq(articlesTable.category, slug))
      .orderBy(desc(articlesTable.publishedAt))
      .limit(4);

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

export default router;
