import { Router, type Request, type Response, type NextFunction } from "express";
import { db, articlesTable, authorsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { invalidatePrefix } from "../lib/cache";

function bustCache() {
  invalidatePrefix("articles:");
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.resolve(__dirname, "../../../uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || ".jpg";
    cb(null, `img-${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
  },
});
const upload = multer({ storage, limits: { fileSize: 20 * 1024 * 1024 } });

const router = Router();

function getSecret(): string {
  const s = process.env.ADMIN_PASSWORD;
  if (!s) throw new Error("ADMIN_PASSWORD env var not set");
  return s;
}

function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  try {
    jwt.verify(auth.slice(7), getSecret());
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}

router.post(
  "/admin/upload",
  requireAdmin,
  upload.single("image"),
  (req: Request, res: Response): void => {
    if (!req.file) {
      res.status(400).json({ error: "No file uploaded" });
      return;
    }
    const url = `/uploads/${req.file.filename}`;
    res.json({ url });
  }
);

router.post("/admin/login", (req: Request, res: Response): void => {
  const { password } = req.body as { password?: string };
  if (!password || password !== process.env.ADMIN_PASSWORD) {
    res.status(401).json({ error: "Invalid password" });
    return;
  }
  const token = jwt.sign({ admin: true }, getSecret(), { expiresIn: "7d" });
  res.json({ token });
});

router.get("/admin/articles", requireAdmin, async (req: Request, res: Response): Promise<void> => {
  try {
    const articles = await db
      .select()
      .from(articlesTable)
      .orderBy(desc(articlesTable.publishedAt));
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

router.put("/admin/articles/:id", requireAdmin, async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    const {
      title, subtitle, excerpt, body, category, imageUrl,
      readTime, authorId, featured, editorsPick, published, tags,
    } = req.body as Record<string, unknown>;

    const updated = await db
      .update(articlesTable)
      .set({
        title: title as string,
        subtitle: subtitle as string | null,
        excerpt: excerpt as string,
        body: body as string | null,
        category: category as string,
        imageUrl: imageUrl as string,
        readTime: Number(readTime),
        authorId: Number(authorId),
        featured: Boolean(featured),
        editorsPick: Boolean(editorsPick),
        published: Boolean(published),
        tags: (tags as string[]) ?? [],
      })
      .where(eq(articlesTable.id, id))
      .returning();

    if (!updated.length) {
      res.status(404).json({ error: "Article not found" });
      return;
    }
    bustCache();
    res.json({ ...updated[0], publishedAt: updated[0].publishedAt.toISOString() });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/admin/articles", requireAdmin, async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      slug, title, subtitle, excerpt, body, category, imageUrl,
      readTime, authorId, featured, editorsPick, published, tags,
    } = req.body as Record<string, unknown>;

    const inserted = await db
      .insert(articlesTable)
      .values({
        slug: slug as string,
        title: title as string,
        subtitle: subtitle as string | null,
        excerpt: excerpt as string,
        body: body as string | null,
        category: category as string,
        imageUrl: imageUrl as string,
        readTime: Number(readTime) || 3,
        authorId: Number(authorId) || 1,
        featured: Boolean(featured),
        editorsPick: Boolean(editorsPick),
        published: published !== false,
        tags: (tags as string[]) ?? [],
        publishedAt: new Date(),
        views: 0,
      })
      .returning();

    bustCache();
    res.status(201).json({ ...inserted[0], publishedAt: inserted[0].publishedAt.toISOString() });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/admin/articles/:id/publish", requireAdmin, async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    const current = await db
      .select()
      .from(articlesTable)
      .where(eq(articlesTable.id, id))
      .limit(1);

    if (!current.length) {
      res.status(404).json({ error: "Article not found" });
      return;
    }
    const updated = await db
      .update(articlesTable)
      .set({ published: !current[0].published })
      .where(eq(articlesTable.id, id))
      .returning();

    bustCache();
    res.json({ ...updated[0], publishedAt: updated[0].publishedAt.toISOString() });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/admin/articles/:id", requireAdmin, async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    await db.delete(articlesTable).where(eq(articlesTable.id, id));
    bustCache();
    res.json({ success: true });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
