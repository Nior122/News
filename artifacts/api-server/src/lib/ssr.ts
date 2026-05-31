import { db, articlesTable, authorsTable } from "@workspace/db";
import { eq, desc, and } from "drizzle-orm";
import { getCached, setCached } from "./cache";

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const SITE_NAME = "Scrolltek";
const SITE_URL = process.env.SITE_URL ?? "https://scrolltek.com";
const SITE_DESC =
  "Your go-to source for tech, digital culture, AI tools, phone tips, lifestyle, and the trends shaping how we live online.";

type MetaTags = { title: string; description: string; canonical: string; ogImage?: string };

interface RenderResult {
  bodyHtml: string;
  meta: MetaTags;
  jsonLd: string;
}

async function getArticles(limit = 20) {
  const cacheKey = `ssr:articles:${limit}`;
  const cached = getCached<typeof articlesTable.$inferSelect[]>(cacheKey);
  if (cached) return cached;
  const rows = await db
    .select()
    .from(articlesTable)
    .where(eq(articlesTable.published, true))
    .orderBy(desc(articlesTable.publishedAt))
    .limit(limit);
  setCached(cacheKey, rows, 2 * 60 * 1000);
  return rows;
}

async function getAuthors() {
  const cacheKey = "ssr:authors";
  const cached = getCached<typeof authorsTable.$inferSelect[]>(cacheKey);
  if (cached) return cached;
  const rows = await db.select().from(authorsTable);
  setCached(cacheKey, rows, 10 * 60 * 1000);
  return rows;
}

function articleCard(slug: string, title: string, excerpt: string, category: string): string {
  return `<article><a href="/article/${esc(slug)}">${esc(title)}</a><span class="cat">${esc(category)}</span>${excerpt ? `<p>${esc(excerpt)}</p>` : ""}</article>`;
}

async function renderHome(): Promise<RenderResult> {
  const articles = await getArticles(20);
  const cards = articles.map((a) => articleCard(a.slug, a.title, a.excerpt ?? "", a.category)).join("");
  const bodyHtml = `<main id="ssr"><h1>${SITE_NAME} — Tech, Culture, Lifestyle &amp; AI Tools</h1>${cards}</main>`;

  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESC,
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/search?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  });

  return {
    bodyHtml,
    meta: { title: `${SITE_NAME} — Tech, Culture, Lifestyle & AI Tools`, description: SITE_DESC, canonical: SITE_URL },
    jsonLd,
  };
}

async function renderArticle(slug: string): Promise<RenderResult | null> {
  const cacheKey = `ssr:article:${slug}`;
  const cached = getCached<RenderResult>(cacheKey);
  if (cached) return cached;

  const rows = await db
    .select()
    .from(articlesTable)
    .where(and(eq(articlesTable.slug, slug), eq(articlesTable.published, true)))
    .limit(1);
  if (!rows.length) return null;

  const a = rows[0];
  const authors = await getAuthors();
  const author = authors.find((au) => au.id === a.authorId);

  const bodyHtml = `<main id="ssr">
    <h1>${esc(a.title)}</h1>
    ${a.subtitle ? `<h2>${esc(a.subtitle)}</h2>` : ""}
    ${a.excerpt ? `<p class="excerpt">${esc(a.excerpt)}</p>` : ""}
    ${author ? `<address>By <span>${esc(author.name)}</span></address>` : ""}
    ${a.body ?? ""}
  </main>`;

  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: a.title,
    description: a.excerpt ?? "",
    image: a.imageUrl ?? undefined,
    datePublished: a.publishedAt.toISOString(),
    author: author ? { "@type": "Person", name: author.name } : undefined,
    publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    url: `${SITE_URL}/article/${slug}`,
  });

  const result: RenderResult = {
    bodyHtml,
    meta: {
      title: `${esc(a.title)} — ${SITE_NAME}`,
      description: a.excerpt ?? SITE_DESC,
      canonical: `${SITE_URL}/article/${slug}`,
      ogImage: a.imageUrl ?? undefined,
    },
    jsonLd,
  };

  setCached(cacheKey, result, 5 * 60 * 1000);
  return result;
}

async function renderCategory(slug: string): Promise<RenderResult> {
  const SLUG_TO_LABEL: Record<string, string> = {
    tech: "Tech", culture: "Culture", lifestyle: "Lifestyle",
    "ai-tools": "AI Tools", "phone-tips": "Phone Tips",
    productivity: "Productivity", trending: "Trending",
  };
  const label = SLUG_TO_LABEL[slug] ?? slug;

  const rows = await db
    .select()
    .from(articlesTable)
    .where(and(eq(articlesTable.published, true), eq(articlesTable.category, label)))
    .orderBy(desc(articlesTable.publishedAt))
    .limit(20);

  const cards = rows.map((a) => articleCard(a.slug, a.title, a.excerpt ?? "", a.category)).join("");
  const bodyHtml = `<main id="ssr"><h1>${esc(label)} — ${SITE_NAME}</h1>${cards}</main>`;

  return {
    bodyHtml,
    meta: {
      title: `${label} Articles — ${SITE_NAME}`,
      description: `Browse the latest ${label} articles on ${SITE_NAME}.`,
      canonical: `${SITE_URL}/category/${slug}`,
    },
    jsonLd: "",
  };
}

export async function renderForPath(urlPath: string): Promise<RenderResult | null> {
  try {
    const clean = urlPath.split("?")[0];

    if (clean === "/" || clean === "") return renderHome();

    const articleMatch = clean.match(/^\/article\/([^/]+)$/);
    if (articleMatch) return renderArticle(articleMatch[1]);

    const categoryMatch = clean.match(/^\/category\/([^/]+)$/);
    if (categoryMatch) return renderCategory(categoryMatch[1]);

    return null;
  } catch {
    return null;
  }
}

export function injectIntoHtml(
  template: string,
  result: RenderResult
): string {
  let html = template;

  html = html.replace(
    /<title>[^<]*<\/title>/,
    `<title>${result.meta.title}</title>`
  );

  html = html.replace(
    /<meta name="description"[^>]*>/,
    `<meta name="description" content="${esc(result.meta.description)}" />`
  );

  html = html.replace(
    /<link rel="canonical"[^>]*>/,
    `<link rel="canonical" href="${esc(result.meta.canonical)}" />`
  );

  if (result.meta.ogImage) {
    html = html.replace(
      /(<meta property="og:description"[^>]*>)/,
      `$1\n    <meta property="og:image" content="${esc(result.meta.ogImage)}" />`
    );
  }

  if (result.jsonLd) {
    html = html.replace(
      /<script type="application\/ld\+json">[\s\S]*?<\/script>/,
      `<script type="application/ld+json">\n    ${result.jsonLd}\n    </script>`
    );
  }

  html = html.replace(
    '<div id="root"></div>',
    `<div id="root">${result.bodyHtml}</div>`
  );

  return html;
}
