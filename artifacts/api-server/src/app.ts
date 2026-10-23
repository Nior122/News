import express, { type Express, type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import compression from "compression";
import { pinoHttp } from "pino-http";
import type { IncomingMessage, ServerResponse } from "http";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";
import router from "./routes";
import sitemapRouter from "./routes/sitemap";
import { logger } from "./lib/logger";
import {
  renderForPath,
  injectIntoHtml,
  injectCanonicalIntoHtml,
  injectNotFoundIntoHtml,
  injectUnavailableIntoHtml,
  removeHomepageFallback,
} from "./lib/ssr";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req: IncomingMessage) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res: ServerResponse) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(compression());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Keep the known www alias on the same host used by canonicals and the sitemap.
app.use((req: Request, res: Response, next: NextFunction) => {
  const host = String(req.headers.host ?? "").split(":")[0].toLowerCase();
  if ((req.method === "GET" || req.method === "HEAD") && host === "www.scrolltek.name.ng") {
    res.redirect(308, `https://scrolltek.name.ng${req.originalUrl}`);
    return;
  }
  next();
});

// Cache public GET responses — articles/categories rarely change
app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.method === "GET" && req.path.startsWith("/api/articles")) {
    res.setHeader("Cache-Control", "public, max-age=300, stale-while-revalidate=60");
  } else if (req.method === "GET" && req.path.startsWith("/api/categories")) {
    res.setHeader("Cache-Control", "public, max-age=600, stale-while-revalidate=120");
  }
  next();
});

const uploadsDir = path.resolve(__dirname, "../../uploads");
app.use("/uploads", express.static(uploadsDir));

app.use(sitemapRouter);
app.use("/api", router);

if (process.env.NODE_ENV === "production") {
  const frontendDist = path.resolve(__dirname, "../../media-site/dist/public");
  const templatePath = path.join(frontendDist, "index.html");

  let templateCache: string | null = null;
  async function getTemplate(): Promise<string> {
    if (!templateCache) templateCache = await fs.readFile(templatePath, "utf-8");
    return templateCache;
  }

  const genericClientPaths = new Set([
    "/", "/about", "/contact", "/privacy", "/search", "/admin", "/admin/login",
  ]);
  const genericClientMeta: Record<string, { title: string; description: string }> = {
    "/about": {
      title: "About Us — Scrolltek",
      description: "Scrolltek covers tech, culture, AI tools, phone tips, lifestyle, and trending topics — fast, useful, and written for real people.",
    },
    "/contact": {
      title: "Contact Us — Scrolltek",
      description: "Get in touch with the Scrolltek team. Send us a tip, feedback, or just say hi.",
    },
    "/privacy": {
      title: "Privacy Policy — Scrolltek",
      description: "Scrolltek's privacy policy — how we collect, use, and protect your information when you visit our website.",
    },
    "/search": {
      title: "Search Scrolltek",
      description: "Search Scrolltek for articles on tech, culture, lifestyle, AI tools, phone tips, productivity and trending topics.",
    },
    "/admin": {
      title: "Scrolltek Admin",
      description: "Scrolltek administration.",
    },
    "/admin/login": {
      title: "Admin Login — Scrolltek",
      description: "Sign in to manage Scrolltek.",
    },
  };
  const clientCategorySlugs = new Set([
    "tech", "culture", "lifestyle", "ai-tools", "phone-tips", "productivity",
    "trending", "ai-productivity", "culture-lifestyle",
  ]);
  const clientAuthorSlugs = new Set([
    "maya-chen", "james-okafor", "sofia-reyes", "liam-park", "anya-patel", "scrolltek-editorial",
  ]);
  const isKnownClientPath = (pathname: string) => {
    const normalized = pathname.replace(/\/+$/, "") || "/";
    if (genericClientPaths.has(normalized)) return true;
    const category = normalized.match(/^\/category\/([^/]+)$/);
    if (category) return clientCategorySlugs.has(category[1]);
    const author = normalized.match(/^\/author\/([^/]+)$/);
    return Boolean(author && clientAuthorSlugs.has(author[1]));
  };

  app.use(express.static(frontendDist));
  app.use(async (req: Request, res: Response) => {
    try {
      const baseTemplate = await getTemplate();
      const normalizedRequestPath = req.path.replace(/\/+$/, "") || "/";
      // The homepage keeps its no-JS fallback listing; every other route drops
      // it so the server-rendered HTML carries exactly one H1.
      const template = normalizedRequestPath === "/"
        ? baseTemplate
        : removeHomepageFallback(baseTemplate);
      const result = await renderForPath(req.path);
      res.setHeader("Content-Type", "text/html; charset=utf-8");

      if (result) {
        res.setHeader("Cache-Control", "public, max-age=300, stale-while-revalidate=60");
        res.send(injectIntoHtml(template, result));
        return;
      }

      const normalizedPath = req.path.replace(/\/+$/, "") || "/";
      if (isKnownClientPath(normalizedPath)) {
        res.setHeader("Cache-Control", "public, max-age=300, stale-while-revalidate=60");
        const robots = normalizedPath === "/search"
          ? "noindex, follow"
          : normalizedPath.startsWith("/admin")
            ? "noindex, nofollow"
            : undefined;
        res.send(injectCanonicalIntoHtml(template, normalizedPath, robots, genericClientMeta[normalizedPath]));
        return;
      }

      res.status(404);
      res.setHeader("Cache-Control", "no-store");
      res.setHeader("X-Robots-Tag", "noindex, follow");
      res.send(injectNotFoundIntoHtml(template, normalizedPath));
    } catch (error) {
      logger.error({ err: error }, "SSR request failed");
      res.status(503);
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.setHeader("Cache-Control", "no-store");
      res.setHeader("X-Robots-Tag", "noindex, follow");
      res.setHeader("Retry-After", "60");
      try {
        res.send(injectUnavailableIntoHtml(await getTemplate()));
      } catch {
        res.type("text/plain").send("Page temporarily unavailable. Please try again shortly.");
      }
    }
  });
}

export default app;
