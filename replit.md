# Scrolltek

A media/news website covering Tech, Culture, Lifestyle, AI Tools, Phone Tips, Productivity, and Trending topics. Features a full-stack React + Express + PostgreSQL stack with article browsing, search, categories, admin dashboard, and newsletter signup.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/media-site run dev` — run the frontend (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/db run seed` — seed the database with articles
- Required env: `DATABASE_URL` — Postgres connection string (already provisioned)
- Required env: `ADMIN_PASSWORD` — password for the admin dashboard

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + Tailwind CSS v4 + shadcn/ui + wouter routing
- API: Express 5 + pino logging
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/media-site/` — React + Vite frontend (Scrolltek)
- `artifacts/api-server/` — Express API server
- `lib/db/` — Drizzle ORM schema + seed data (articles, authors, categories, newsletter)
- `lib/api-spec/openapi.yaml` — OpenAPI spec (source of truth)
- `lib/api-client-react/` — generated React Query hooks
- `lib/api-zod/` — generated Zod schemas
- `artifacts/media-site/src/pages/` — page components (Home, ArticlePage, CategoryPage, SearchPage, AboutPage, ContactPage, PrivacyPage, admin/*)
- `artifacts/media-site/src/components/` — shared UI components

## Architecture decisions

- Vercel Serverless → Express: The original Vercel `api/index.mjs` was replaced with a full Express server using Drizzle ORM + PostgreSQL instead of static in-memory data.
- Frontend uses wouter (not react-router) for routing, with `import.meta.env.BASE_URL` as the router base.
- Admin auth uses JWT via `jsonwebtoken` — requires `ADMIN_PASSWORD` env var.
- Article seeding via `ensureSeeded()` — runs on every API server startup, inserts missing articles.
- Image uploads stored in `artifacts/uploads/` directory, served at `/uploads/*`.

## Product

- Homepage with hero article, trending ticker, category navigation, editors' picks
- Article pages with related articles, author info, and view tracking
- Category browsing with paginated article lists
- Full-text search across titles, excerpts, and categories
- Admin dashboard for creating/editing/publishing articles (requires ADMIN_PASSWORD)
- Newsletter signup
- Dark/light theme toggle

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- `ADMIN_PASSWORD` env var must be set to use the admin dashboard (`/admin`)
- `ensureSeeded()` uses `onConflictDoNothing` for authors/categories and checks slugs for articles — safe to run repeatedly
- The Vite dev server proxies `/api` → `http://localhost:8080` in development
- Run `pnpm --filter @workspace/db run push` after any schema changes before starting the API server

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
