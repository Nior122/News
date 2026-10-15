# Scrolltek Cloudflare Pages deployment notes

This document describes the Pages implementation in this repository. It does **not** identify or prove which Cloudflare Pages project is currently serving production.

## Project identity: unverified

- The earlier claim that the production project is `news-6u3` is not supported by independent evidence and must not be treated as confirmed.
- The GitHub deployment records inspected for this repository are Vercel-created deployments; no Cloudflare Pages project or production branch is established by those records. This does not prove that a Pages project does not exist.
- No Cloudflare account or production settings were accessed in this work. Do not deploy, create a replacement project, or change production settings until the existing project and branch have been confirmed in the Cloudflare dashboard.

## Repository layout and expected Pages build settings

| Setting | Value or verification status |
|---|---|
| Repository | `Nior122/News` |
| Pages project name | **Unverified; confirm in Cloudflare before configuring Wrangler or deploying** |
| Project root | `.` (the Pages Functions directory is at repository root) |
| Framework preset | `None` / custom build (recommended; dashboard not verified) |
| Install command | `pnpm install --frozen-lockfile` |
| Build command | `pnpm --filter @workspace/media-site run build` |
| Build output directory | `artifacts/media-site/dist/public` |
| Node.js build version | `22` (root `.nvmrc`; package requires Node `>=22.12.0`) |
| pnpm version | `10.26.1` (root `packageManager`) |
| Canonical origin | `https://scrolltek.name.ng` |

The Pages application consists of `functions/` (Pages Functions and middleware) and the Vite frontend in `artifacts/media-site/`. The output directory is confirmed by `artifacts/media-site/vite.config.ts`. Cloudflare Pages' SPA fallback is used instead of a catch-all `_redirects` rewrite; Wrangler rejects `/* /index.html 200` as an infinite loop. The static redirect file only preserves the sitemap and robots paths.

Do not use `vercel.json` as Pages configuration; it configures Vercel. `cloudflare/wrangler.toml` and `cloudflare/_redirects` belong to a separate legacy Worker (the latter contains a placeholder API host), not this Pages application. There is intentionally no root Pages Wrangler file yet: Wrangler requires a Pages project `name`, and that name has not been verified. Once the existing project is confirmed, any root Pages config must use that exact name, a reviewed Workers compatibility date, and `pages_build_output_dir = "./artifacts/media-site/dist/public"`—not the legacy Worker config.

The root build setting above builds the frontend only. Cloudflare Pages discovers `functions/` from the configured repository root; it does not require a separate Worker deployment. Build and test commands do not run schema setup or seed article content.

## Runtime and build environment variables

Set or verify these names privately in the **confirmed Pages project's Production environment**. Never put values in this repository, logs, or chat.

| Variable | Required? | Purpose |
|---|---|---|
| `DATABASE_URL` | Yes for article/category/author rendering, API data, and the dynamic sitemap | Neon PostgreSQL connection string used at request time |
| `ADMIN_PASSWORD` | Yes for admin login and authenticated admin operations | Admin authentication secret; never expose its value |
| `VITE_API_URL` | Optional build-time setting | Overrides the frontend's same-origin API base. Leave unset unless a reviewed deployment requires a specific same-site API base. |
| `PAGES_PRODUCTION_BRANCH` | Optional, non-secret | Enables a redirect from a `*.pages.dev` hostname only when it matches Cloudflare's runtime `CF_PAGES_BRANCH`. Set it only to the production branch verified in the dashboard; branch-preview hosts otherwise remain usable. |

The canonical origin is fixed in application code; `SITE_URL` is not needed to choose the canonical host. The Pages Functions use standard Web APIs and `@neondatabase/serverless`; the legacy Worker compatibility settings do not configure Pages.

## Routing, SEO, and data-safety behavior

- `functions/_middleware.mjs` handles canonical-host normalization, route-aware HTML metadata, article/author/category rendering, and real noindex 404/503 responses. The known article alias `why-ai-phones-are-becoming-the-future` redirects to `why-ai-phones-are-the-future-2026` and is omitted from the sitemap.
- `functions/sitemap.xml.mjs` is a read-only query for published articles with non-empty titles and renderable body content. It emits canonical `https://scrolltek.name.ng` URLs, deduplicates locations, excludes the redirected alias, and does not fabricate `lastmod` dates. `functions/robots.txt.mjs` advertises that canonical sitemap; the static fallback `artifacts/media-site/public/robots.txt` now does too.
- `/api/health` does not open a database connection. Public reads and builds do not run database setup or seeding. `/api/admin/force-seed` is a separately authenticated, state-changing maintenance operation; it is not a health check and is not part of this build or validation. Do not call it as part of deployment verification.
- API pagination and public read behavior remain unchanged; public article reads do not increment view counts.

## Read-only verification after the correct project is identified

Before any future release, confirm the connected GitHub repository, project root, production branch, build command/output, Pages Functions inclusion, environment-variable **names**, custom domains, and TLS in the existing project. Do not create a duplicate project or modify settings as part of this repository change.

After a separately approved deployment, check the apex/`www` redirects, a known published article, the retired article alias, `/robots.txt`, and `/sitemap.xml`. A 200 response or sitemap submission is not proof of Google indexing; use Search Console URL Inspection to check rendered content and Google-selected canonicals. No production requests, database queries, setup, seeding, or deployment were performed for this work.
