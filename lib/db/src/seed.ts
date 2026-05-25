import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set.");
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool, { schema });

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

const articles: schema.NewArticle[] = [];

async function seed() {
  const client = await pool.connect();
  try {
    console.log("Seeding authors...");
    for (const author of authors) {
      await client.query(
        `INSERT INTO authors (id, name, avatar_url) VALUES ($1, $2, $3) ON CONFLICT (id) DO NOTHING`,
        [author.id, author.name, author.avatarUrl]
      );
    }
    await client.query(`SELECT setval('authors_id_seq', (SELECT MAX(id) FROM authors))`);

    console.log("Seeding categories...");
    for (const cat of categories) {
      await client.query(
        `INSERT INTO categories (slug, name, color, article_count) VALUES ($1, $2, $3, $4) ON CONFLICT (slug) DO NOTHING`,
        [cat.slug, cat.name, cat.color, cat.articleCount]
      );
    }

    console.log(`Seeding ${articles.length} articles...`);
    for (const article of articles) {
      await client.query(
        `INSERT INTO articles (slug, title, subtitle, excerpt, body, category, author_id, published_at, read_time, image_url, views, featured, editors_pick, tags)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
         ON CONFLICT (slug) DO NOTHING`,
        [
          article.slug, article.title, article.subtitle, article.excerpt,
          article.body, article.category, article.authorId, article.publishedAt,
          article.readTime, article.imageUrl, article.views, article.featured,
          article.editorsPick, article.tags,
        ]
      );
    }

    console.log(`✓ Done: ${authors.length} authors, ${categories.length} categories, ${articles.length} articles.`);
  } finally {
    client.release();
    await pool.end();
  }
}

seed().catch((err) => {
  console.error("Seed failed:", err.message);
  process.exit(1);
});
