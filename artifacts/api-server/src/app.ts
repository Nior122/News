import express, { type Express, type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import compression from "compression";
import { pinoHttp } from "pino-http";
import type { IncomingMessage, ServerResponse } from "http";
import path from "path";
import { fileURLToPath } from "url";
import router from "./routes";
import sitemapRouter from "./routes/sitemap";
import { logger } from "./lib/logger";

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

if (process.env.NODE_ENV === "production") {
  const frontendDist = path.resolve(__dirname, "../../media-site/dist/public");
  app.use(express.static(frontendDist));
  app.use((_req, res) => {
    res.sendFile(path.join(frontendDist, "index.html"));
  });
}

export default app;
