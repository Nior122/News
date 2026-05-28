# Cloudflare Deployment Guide — Scrolltek

This guide uses **Cloudflare Pages Functions** — no separate Worker needed.
The API runs automatically as part of your Pages project.
Vercel continues to work unchanged — both share the same Neon database.

---

## Architecture

```
GitHub repo
├── functions/
│   └── api/
│       └── [[path]].mjs   → Cloudflare Pages Function (handles all /api/* routes)
├── artifacts/media-site/  → React frontend (built and deployed to Pages)
├── api/                   → Vercel Serverless Function (unchanged)
└── vercel.json            → Vercel config (unchanged)
```

**Both Vercel and Cloudflare point to the same Neon PostgreSQL database.**

---

## Step 1 — Push to GitHub

Make sure your latest code (including the `functions/` folder) is pushed to GitHub.

---

## Step 2 — Create a Cloudflare Pages project

1. Go to **dash.cloudflare.com → Workers & Pages → Create → Pages**
2. Click **Connect to Git** and select your GitHub repository
3. Set build settings:
   - **Framework preset**: None
   - **Build command**: `pnpm --filter @workspace/media-site run build`
   - **Build output directory**: `artifacts/media-site/dist/public`
   - **Root directory**: `/` (repo root, leave as default)
4. Click **Save and Deploy**

---

## Step 3 — Add environment variables

After the project is created, go to:
**Pages project → Settings → Environment variables → Production**

Add these two variables:

| Variable        | Value                          |
|-----------------|--------------------------------|
| `DATABASE_URL`  | Your Neon connection string    |
| `ADMIN_PASSWORD`| Your admin password            |

Click **Save**, then go to **Deployments → Redeploy** to apply them.

---

## Step 4 — Verify it works

Open your Pages URL (e.g. `https://news-6u3.pages.dev/api/health`)
You should see: `{"ok":true}`

If articles load on the homepage, everything is working.

---

## Step 5 — Seed the database (only if articles are missing)

Since your Neon database already has articles from Vercel, you may not need this.
But if articles are missing, call:

```
GET https://news-6u3.pages.dev/api/admin/force-seed?key=YOUR_ADMIN_PASSWORD
```

Expected: `{"success":true,"total":19,"message":"Setup complete. 19 articles now in database."}`

---

## How it works

Cloudflare automatically detects the `functions/` folder at the repo root and
deploys `functions/api/[[path]].mjs` as a serverless function that handles every
`/api/*` request. No Worker deployment, no `_redirects` proxy, no separate URL.

---

## Custom Domain

Pages dashboard → Custom domains → add your domain.
Cloudflare handles TLS automatically.

---

## Environment Variables Summary

| Variable        | Vercel | Cloudflare Pages | Required |
|-----------------|--------|-----------------|----------|
| DATABASE_URL    | ✅     | ✅ (Pages vars) | Yes      |
| ADMIN_PASSWORD  | ✅     | ✅ (Pages vars) | Yes      |
