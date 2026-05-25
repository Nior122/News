# PulseWire

A modern digital media brand built for Google Discover growth and Google Search ranking. Covers Tech, Culture, Lifestyle, AI Tools, Phone Tips, Productivity, and Trending topics.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/media-site run dev` — run the frontend (port 23701)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, Tailwind CSS, Framer Motion, Wouter routing, Embla Carousel
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Fonts: Syne (headlines) + Inter (body) via Google Fonts
- Validation: Zod, `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/api-spec/openapi.yaml` — API contract (source of truth)
- `lib/db/src/schema/` — DB tables: articles, authors, categories, newsletter
- `artifacts/api-server/src/routes/` — Express route handlers
- `artifacts/media-site/src/pages/` — All frontend pages
- `artifacts/media-site/src/components/` — Shared UI components

## Pages

- `/` — Homepage with all sections
- `/article/:slug` — Full article page
- `/category/:slug` — Category filtered feed
- `/search` — Search results
- `/about` — About the brand
- `/contact` — Contact form
- `/privacy` — Privacy policy

## API Endpoints

- `GET /api/articles` — paginated articles (with ?category, ?page, ?limit)
- `GET /api/articles/featured` — hero article
- `GET /api/articles/trending` — top by views
- `GET /api/articles/popular` — popular this week
- `GET /api/articles/editors-picks` — editor-curated articles
- `GET /api/articles/ticker` — headline ticker items
- `GET /api/articles/search?q=` — full-text search
- `GET /api/articles/:slug` — single article (increments views)
- `GET /api/articles/:slug/related` — related articles (same category)
- `GET /api/categories` — all categories
- `GET /api/categories/:slug/articles` — category spotlight (4 articles)
- `POST /api/newsletter/subscribe` — email subscribe

## Content workflow — how to publish new articles

### Option A: Admin Dashboard (recommended for live site)
Visit `/admin/login` on your live Vercel site and sign in with `ADMIN_PASSWORD`.
Every create/edit/delete/publish action commits directly to `api/_data.js` on GitHub → Vercel auto-deploys in ~60 seconds.

**Required Vercel environment variables (set once in Vercel dashboard):**
- `ADMIN_PASSWORD` — your admin login password
- `GITHUB_TOKEN` — Personal Access Token with `repo` scope (so the admin can commit to GitHub)

### Option B: Manual file edit
| Environment | Article source | Updated by |
|---|---|---|
| **Vercel (live site)** | `api/_data.js` | commit + push to GitHub |
| **Replit dev** | PostgreSQL DB, seeded from `lib/db/src/ensure-seeded.ts` | edit file, then reseed DB |

**To publish a new article manually:**
1. Add the article object to `api/_data.js`
2. Commit and push to GitHub → Vercel auto-deploys within ~60 seconds

**To also see it in local dev (Replit):**
1. Add the same article to `lib/db/src/ensure-seeded.ts` (use `new Date("...")` for `publishedAt`, no `id` field)
2. Reseed the dev DB: in the Shell tab run `psql $DATABASE_URL -c "DELETE FROM articles"` then restart the API server (ensureSeeded runs at startup)

**Article format in `api/_data.js`:**
```js
{
  id: <next number>,
  slug: "my-article-slug",
  title: "...", subtitle: "...", excerpt: "...", body: `...`,
  category: "Tech",  // Tech | Culture | Lifestyle | AI Tools | Phone Tips | Productivity
  authorId: 1,       // 1=Maya Chen  2=James Okafor  3=Sofia Reyes  4=Liam Park  5=Anya Patel
  publishedAt: new Date("2026-05-25T10:00:00Z").toISOString(),
  readTime: 8,
  imageUrl: "https://images.unsplash.com/photo-...?w=1200&q=80",
  views: 0,
  featured: false,   // set true to make this the hero article
  editorsPick: false,
  tags: ["Tag1", "Tag2"],
}
```

## Architecture decisions

- Dark mode as default with ThemeProvider and localStorage persistence
- All article views are incremented on read for real view count tracking
- Category colors are stored in DB so they can be changed without redeploying
- Ticker and trending data come from the same articles table, sorted by views
- Newsletter uses a unique constraint to silently handle duplicate subscriptions
- **Vercel has no database** — it uses `api/_data.js` as a static article store; the Express server + PostgreSQL is Replit-only

## Product

PulseWire is a media brand covering tech news, internet culture, AI tools, phone tips, productivity, and trending digital topics. The site is optimized for Google Discover (large thumbnails, bold titles) and mobile-first reading.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Google Fonts `@import url(...)` MUST be the first line in index.css — before any other CSS
- Always run codegen after changing the OpenAPI spec
- `zod` must be in api-server's `dependencies` (not devDependencies) for esbuild to bundle it
- Article category slugs use hyphens (e.g. `ai-tools`) — ensure frontend slug generation matches
