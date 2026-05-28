# Cloudflare Deployment Guide — Scrolltek

This folder contains everything needed to deploy Scrolltek to Cloudflare.
Vercel continues to work unchanged — both deployments share the same Neon database.

---

## Architecture

```
GitHub repo
├── api/              → Vercel Serverless Function (unchanged)
├── vercel.json       → Vercel config (unchanged)
└── cloudflare/
    ├── worker.mjs    → Cloudflare Worker (API)
    ├── setup.mjs     → DB seed for Worker runtime
    ├── wrangler.toml → Worker config
    └── _redirects    → Cloudflare Pages SPA routing + API proxy
```

**Both Vercel and Cloudflare point to the same Neon PostgreSQL database.**

---

## Step 1 — Push to GitHub

Make sure your code is pushed to a GitHub repository.
Cloudflare will connect to it for automatic deployments.

---

## Step 2 — Deploy the Worker (API)

The Worker handles all `/api/*` routes.

### Install Wrangler CLI (once)
```bash
npm install -g wrangler
wrangler login
```

### Deploy the Worker
```bash
cd cloudflare
npm install
wrangler deploy worker.mjs --name scrolltek-api
```

### Set secrets (DATABASE_URL and ADMIN_PASSWORD)
```bash
wrangler secret put DATABASE_URL
# Paste your Neon connection string when prompted

wrangler secret put ADMIN_PASSWORD
# Paste your admin password when prompted
```

Your Worker will be live at:
`https://scrolltek-api.YOUR_ACCOUNT.workers.dev`

---

## Step 3 — Deploy the Frontend (Cloudflare Pages)

1. Go to **dash.cloudflare.com → Workers & Pages → Create → Pages**
2. Connect your GitHub repository
3. Set build settings:
   - **Framework preset**: None
   - **Build command**: `pnpm --filter @workspace/media-site run build`
   - **Build output directory**: `artifacts/media-site/dist/public`
   - **Root directory**: `/` (repo root)
4. Add environment variables:
   - `NODE_VERSION` = `20`
5. Click **Save and Deploy**

---

## Step 4 — Connect Worker to Pages (API proxy)

Edit `cloudflare/_redirects` and replace `YOUR_SUBDOMAIN` with your actual
Worker subdomain (visible in the Worker dashboard):

```
/api/* https://scrolltek-api.YOUR_SUBDOMAIN.workers.dev/api/:splat 200
/* /index.html 200
```

Commit and push — Cloudflare Pages redeploys automatically.

### Alternative: use Pages Functions instead of a Worker
If you prefer, you can deploy the Worker as a Cloudflare Pages Function instead.
Create `functions/api/[[path]].mjs` that imports and re-exports from `worker.mjs`.
This keeps everything in one Pages project with no separate Worker needed.

---

## Step 5 — Seed the database

After deploying, call force-seed on **either** Vercel or Cloudflare to ensure
all articles are in the Neon database:

```
GET https://your-vercel-app.vercel.app/api/admin/force-seed?key=YOUR_ADMIN_PASSWORD
```

or via the Cloudflare Worker:
```
GET https://scrolltek-api.YOUR_ACCOUNT.workers.dev/api/admin/force-seed?key=YOUR_ADMIN_PASSWORD
```

Expected response: `{"success":true,"total":19,"message":"Setup complete. 19 articles now in database."}`

---

## Adding New Articles

Same process as before — update both:
1. `api/setup.mjs` — for Vercel
2. `lib/db/src/ensure-seeded.ts` — for Replit dev
3. `cloudflare/setup.mjs` — BODIES and articles array — for Cloudflare

Then call force-seed on both deployments after pushing.

---

## Custom Domain

In Cloudflare Pages dashboard → Custom domains → add your domain.
Cloudflare handles TLS automatically.

For the Worker (API), go to the Worker dashboard → Triggers → Custom domains.

---

## Environment Variables Summary

| Variable        | Vercel | Cloudflare Worker | Required |
|-----------------|--------|-------------------|----------|
| DATABASE_URL    | ✅     | ✅ (wrangler secret) | Yes   |
| ADMIN_PASSWORD  | ✅     | ✅ (wrangler secret) | Yes   |
