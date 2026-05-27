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

## DUAL DATABASE — CRITICAL FOR AI AGENTS

This project has TWO separate databases and TWO seed files. They must both be updated when adding or changing articles.

### Development (Replit)
- **Database**: Replit's built-in PostgreSQL (`heliumdb`) — available via `DATABASE_URL`
- **Seed file**: `lib/db/src/ensure-seeded.ts`
- **How it works**: `ensureSeeded()` runs on every API server start. It inserts missing articles and updates article bodies. Changes appear immediately on next server restart.
- **To apply changes**: Restart the `artifacts/api-server: API Server` workflow (or `API Server`).

### Production (Vercel + Neon)
- **Database**: Neon PostgreSQL — separate from Replit, configured in Vercel env vars
- **Seed file**: `api/setup.mjs`
- **How it works**: `runSetup()` runs on each cold start. It inserts missing articles and syncs all content fields (title, subtitle, excerpt, imageUrl, readTime, body) from code to database.
- **To apply changes after deploy**: Call `GET /api/admin/force-seed?key=ADMIN_PASSWORD` — this immediately inserts missing articles and syncs all content without waiting for a cold start. It is fully idempotent and safe to call any time.

## How to Add a New Article

Every new article needs entries in BOTH files. Miss one and the article won't appear in that environment.

### Step 1 — `api/setup.mjs` (Vercel/Neon)
Add TWO entries inside `runSetup()`:
1. **`BODIES` object** (around line 140): add `'your-slug': \`...full HTML...\``
2. **`articles` array** (near the end of `runSetup`): add the metadata object with slug, title, subtitle, excerpt, category, authorId, imageUrl, readTime, featured, editorsPick, tags
3. **`PUBLISHED_AT` object** (near the top of the file, module level): add `'your-slug': '2026-MM-DDTHH:MM:SSZ'`

### Step 2 — `lib/db/src/ensure-seeded.ts` (Replit/dev)
Add TWO entries inside `ensureSeeded()`:
1. **`ARTICLE_BODY_*` constant** (or inline template literal): the full HTML body
2. **`articles` array** near the end: the metadata object with the same fields

### Step 3 — Deploy and sync
- Redeploy to Vercel (push a git commit or click Redeploy in Vercel dashboard)
- Then call: `https://your-vercel-url.vercel.app/api/admin/force-seed?key=ADMIN_PASSWORD`
- Expected response: `{"success":true,"total":N,"message":"Setup complete. N articles now in database."}`

## Authors

| ID | Name         | Best for                        |
|----|--------------|---------------------------------|
| 1  | Maya Chen    | Tech, AI phones, AI features    |
| 2  | James Okafor | Tech, Culture, Android          |
| 3  | Sofia Reyes  | Lifestyle, Culture, Wellness    |
| 4  | Liam Park    | Phone Tips, On-device AI        |
| 5  | Anya Patel   | AI Tools, Productivity          |

## Categories

`Tech`, `Culture`, `Lifestyle`, `AI Tools`, `Phone Tips`, `Productivity`, `Trending`

## Current Articles (17 total)

| Slug | Category | Author |
|------|----------|--------|
| google-io-2026-ai-announcements | Tech | Maya Chen |
| tesla-self-driving-cars-2026 | Tech | James Okafor |
| big-tech-725-billion-ai-spending-layoffs-2026 | Tech | James Okafor |
| amd-on-device-ai-no-internet-2026 | Tech | Liam Park |
| tiktok-brain-attention-span-2026 | Culture | Sofia Reyes |
| memes-internet-news-culture-2026 | Culture | James Okafor |
| four-day-work-week-results-2026 | Lifestyle | Anya Patel |
| quitting-social-media-digital-detox-2026 | Lifestyle | Sofia Reyes |
| iphone-settings-change-now-2026 | Phone Tips | Maya Chen |
| android-battery-life-tips-2026 | Phone Tips | Liam Park |
| ai-tools-saving-hours-every-week-2026 | Productivity | Anya Patel |
| todo-list-broken-better-system-2026 | Productivity | Maya Chen |
| chatgpt-claude-gemini-comparison-2026 | AI Tools | Anya Patel |
| ai-prompt-formula-better-answers-2026 | AI Tools | Maya Chen |
| hidden-android-features-2026 | Phone Tips | James Okafor |
| ai-tools-for-students-2026 | AI Tools | Anya Patel |
| why-ai-phones-are-becoming-the-future | Tech | Maya Chen |

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- `ADMIN_PASSWORD` env var must be set to use the admin dashboard (`/admin`)
- `ensureSeeded()` uses `onConflictDoNothing` for authors/categories and checks slugs for articles — safe to run repeatedly
- The Vite dev server proxies `/api` → `http://localhost:8080` in development
- Run `pnpm --filter @workspace/db run push` after any schema changes before starting the API server
- **NEVER** add articles only to one seed file — both `api/setup.mjs` (Vercel) and `lib/db/src/ensure-seeded.ts` (Replit) must be updated together
- `api/setup.mjs` has a `PUBLISHED_AT` module-level object — add an entry for every new article slug so dates are correct on fresh DB installs
- `api/setup.mjs` `runSetup()` is idempotent — it always inserts missing articles and always syncs content fields (title, subtitle, excerpt, imageUrl, readTime, body) to the DB

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
