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
import { renderForPath, injectIntoHtml } from "./lib/ssr";

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

// 301 redirect duplicate article slugs to canonical versions
const ARTICLE_REDIRECTS: Record<string, string> = {
  "why-ai-phones-are-becoming-the-future": "why-ai-phones-are-the-future-2026",
};
app.get("/article/:slug", (req: Request, res: Response, next: NextFunction) => {
  const target = ARTICLE_REDIRECTS[req.params.slug];
  if (target) {
    res.redirect(301, `/article/${target}`);
    return;
  }
  next();
});

if (process.env.NODE_ENV === "production") {
  const frontendDist = path.resolve(__dirname, "../../media-site/dist/public");
  const templatePath = path.join(frontendDist, "index.html");

  let templateCache: string | null = null;
  async function getTemplate(): Promise<string> {
    if (!templateCache) templateCache = await fs.readFile(templatePath, "utf-8");
    return templateCache;
  }

  app.use(express.static(frontendDist));
  app.use(async (req: Request, res: Response) => {
    try {
      const template = await getTemplate();
      const result = await renderForPath(req.path);
      const html = result ? injectIntoHtml(template, result) : template;
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.send(html);
    } catch {
      res.sendFile(templatePath);
    }
  });
}

export default app;
