import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const articlesTable = pgTable("articles", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  subtitle: text("subtitle"),
  excerpt: text("excerpt").notNull(),
  body: text("body"),
  category: text("category").notNull(),
  authorId: integer("author_id").notNull(),
  publishedAt: timestamp("published_at", { withTimezone: true }).notNull().defaultNow(),
  readTime: integer("read_time").notNull().default(3),
  imageUrl: text("image_url").notNull(),
  views: integer("views").notNull().default(0),
  featured: boolean("featured").notNull().default(false),
  editorsPick: boolean("editors_pick").notNull().default(false),
  tags: text("tags").array().notNull().default([]),
  published: boolean("published").notNull().default(true),
});

export const insertArticleSchema = createInsertSchema(articlesTable).omit({ id: true });
export type InsertArticle = z.infer<typeof insertArticleSchema>;
export type Article = typeof articlesTable.$inferSelect;
