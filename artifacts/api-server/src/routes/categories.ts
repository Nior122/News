import { Router } from "express";
import { db, categoriesTable, articlesTable, authorsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";

const router = Router();

router.get("/categories", async (req, res) => {
  try {
    const categories = await db.select().from(categoriesTable).orderBy(categoriesTable.name);
    res.json(categories);
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
