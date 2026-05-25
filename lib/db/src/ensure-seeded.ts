import { db } from "./index";
import { articlesTable, authorsTable, categoriesTable } from "./schema";
import { sql } from "drizzle-orm";

const authors = [
  { id: 1, name: "Maya Chen", avatarUrl: "https://i.pravatar.cc/150?img=47" },
  { id: 2, name: "James Okafor", avatarUrl: "https://i.pravatar.cc/150?img=68" },
  { id: 3, name: "Sofia Reyes", avatarUrl: "https://i.pravatar.cc/150?img=31" },
  { id: 4, name: "Liam Park", avatarUrl: "https://i.pravatar.cc/150?img=12" },
  { id: 5, name: "Anya Patel", avatarUrl: "https://i.pravatar.cc/150?img=56" },
];

const categories = [
  { slug: "tech", name: "Tech", color: "#3B82F6", articleCount: 0 },
  { slug: "culture", name: "Culture", color: "#8B5CF6", articleCount: 0 },
  { slug: "lifestyle", name: "Lifestyle", color: "#10B981", articleCount: 0 },
  { slug: "ai-tools", name: "AI Tools", color: "#F59E0B", articleCount: 0 },
  { slug: "phone-tips", name: "Phone Tips", color: "#EF4444", articleCount: 0 },
  { slug: "productivity", name: "Productivity", color: "#06B6D4", articleCount: 0 },
  { slug: "trending", name: "Trending", color: "#F97316", articleCount: 0 },
];

const articles: (typeof articlesTable.$inferInsert)[] = [];

export async function ensureSeeded(): Promise<void> {
  try {
    const result = await db.select({ count: sql<number>`count(*)` }).from(articlesTable);
    const count = Number(result[0]?.count ?? 0);

    if (count > 0) {
      console.log(`[seed] Database already has ${count} articles — skipping.`);
      return;
    }

    console.log("[seed] Seeding authors and categories...");

    for (const author of authors) {
      await db.insert(authorsTable).values(author).onConflictDoNothing();
    }

    for (const category of categories) {
      await db.insert(categoriesTable).values(category).onConflictDoNothing();
    }

    for (const article of articles) {
      await db.insert(articlesTable).values(article).onConflictDoNothing();
    }

    console.log(`[seed] ✓ Seeded ${authors.length} authors, ${categories.length} categories, ${articles.length} articles.`);
  } catch (err) {
    console.error("[seed] Seed failed (non-fatal):", err);
  }
}
