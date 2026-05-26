# Scrolltek

A modern digital media brand built for Google Discover growth and Google Search ranking. Covers Tech, Culture, Lifestyle, AI Tools, Phone Tips, Productivity, and Trending topics.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/media-site run dev` — run the frontend (port 5000)
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
- `lib/db/src/ensure-seeded.ts` — seed articles (auto-inserts missing slugs on API start)
- `artifacts/api-server/src/routes/` — Express route handlers
- `artifacts/media-site/src/pages/` — All frontend pages
- `artifacts/media-site/src/components/` — Shared UI components

## Pages

- `/` — Homepage with all sections
- `/article/:slug` — Full article page
- `/category/:slug` — Category filtered feed (see category slugs below)
- `/search` — Search results
- `/about` — About the brand
- `/contact` — Contact form
- `/privacy` — Privacy policy

## API Endpoints

- `GET /api/articles` — paginated articles (with ?category=<slug>, ?page, ?limit)
- `GET /api/articles/featured` — hero article
- `GET /api/articles/trending` — top articles by views
- `GET /api/articles/popular` — popular this week
- `GET /api/articles/editors-picks` — editor-curated articles
- `GET /api/articles/ticker` — headline ticker items
- `GET /api/articles/search?q=` — full-text search
- `GET /api/articles/:slug` — single article (increments views)
- `GET /api/articles/:slug/related` — related articles (same category)
- `GET /api/categories` — all categories
- `POST /api/newsletter/subscribe` — email subscribe

## ⚠️ Category system — read this before writing any article

Every article must have a `category` field set to **exactly one** of the strings below.
These are the only valid values. Any other string will cause the article to not appear
in any category tab.

| URL slug | DB value (use this exact string) | Nav label |
|---|---|---|
| `/category/tech` | `"Tech"` | Tech |
| `/category/culture` | `"Culture"` | Culture |
| `/category/lifestyle` | `"Lifestyle"` | Lifestyle |
| `/category/ai-tools` | `"AI Tools"` | AI Tools |
| `/category/phone-tips` | `"Phone Tips"` | Phone Tips |
| `/category/productivity` | `"Productivity"` | Productivity |
| `/category/trending` | *(Trending tab shows top articles by views — no articles use this category string)* | Trending |

**The Trending tab** at `/category/trending` is special: it shows all articles sorted by
view count (most-read first), regardless of their category. Do not assign `category: "Trending"`
to articles — use one of the six real categories above instead.

### Authors

| ID | Name |
|---|---|
| 1 | Maya Chen |
| 2 | James Okafor |
| 3 | Sofia Reyes |
| 4 | Liam Park |
| 5 | Anya Patel |

## ⚠️ Two article stores — BOTH must be updated

| Environment | Article source | How to update |
|---|---|---|
| **Vercel (live site)** | `api/_data.js` | Add article object here → commit → push to GitHub → Vercel auto-deploys |
| **Replit dev** | PostgreSQL DB, seeded from `lib/db/src/ensure-seeded.ts` | Add article here → restart API server workflow |

**New articles must be added to BOTH files** or they will only appear in one environment.

- `api/_data.js` needs: `id` (next integer), `published: true`, `publishedAt: new Date("...").toISOString()`
- `lib/db/src/ensure-seeded.ts` needs: no `id`, `published` field, `publishedAt: new Date("...")`  (Date object, not string)

## How to add a new article

### Option A: Admin Dashboard (recommended)
Visit `/admin/login` and sign in with the `ADMIN_PASSWORD` env var.
The admin dashboard has a category dropdown pre-populated with all valid categories.
⚠️ Admin dashboard writes to `api/_data.js` via GitHub API (Vercel only). You still need to manually add the article to `lib/db/src/ensure-seeded.ts` for Replit dev.

### Option B: Manual — add to both files
Add to `lib/db/src/ensure-seeded.ts` (Replit dev) and `api/_data.js` (Vercel).

```ts
{
  slug: "my-article-slug",           // URL-safe, lowercase, hyphens
  title: "...",
  subtitle: "...",
  excerpt: "...",                    // 1-2 sentence summary
  body: `<p>HTML content...</p>`,
  category: "Tech",                  // MUST be one of the 6 valid strings above
  authorId: 1,                       // 1–5
  publishedAt: new Date("2026-05-25T10:00:00Z"),
  readTime: 7,                       // minutes
  imageUrl: "https://images.unsplash.com/photo-...?w=1200&q=80",
  views: 0,
  featured: false,                   // true = hero article (only one at a time)
  editorsPick: false,
  tags: ["Tag1", "Tag2"],
}
```

**After editing ensure-seeded.ts:** just restart the "artifacts/api-server: API Server"
workflow — it will auto-insert any new slugs.

## Architecture decisions

- Dark mode as default with ThemeProvider and localStorage persistence
- All article views are incremented on read for real view count tracking
- Category slug → DB name mapping lives in `artifacts/api-server/src/routes/articles.ts` (`SLUG_TO_CATEGORY`)
- The Trending category page uses the `/api/articles/trending` endpoint (by views), not a category filter
- Article cards use the "stretched link" pattern — invisible `<a>` covers the card, CategoryBadge sits above it as its own link
- Newsletter uses a unique constraint to silently handle duplicate subscriptions

## User preferences

- Site name is **Scrolltek**
- Mobile hamburger menu uses conditional rendering (no CSS transforms) for iOS/Android reliability

## Gotchas

- Google Fonts `@import url(...)` MUST be the first line in index.css — before any other CSS
- Always run codegen after changing the OpenAPI spec
- `zod` must be in api-server's `dependencies` (not devDependencies) for esbuild to bundle it
- Category slugs use hyphens (`ai-tools`, `phone-tips`) — but DB stores the full name (`AI Tools`, `Phone Tips`)
- The API's `SLUG_TO_CATEGORY` map in `articles.ts` handles the conversion — keep it in sync if categories change
- ArticleCard exports only React components — keep utility functions unexported to avoid Vite HMR issues
