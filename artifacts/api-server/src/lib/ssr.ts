import { db, articlesTable, authorsTable } from "@workspace/db";
import { eq, desc, and, inArray } from "drizzle-orm";
import { getCached, setCached } from "./cache";

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const SITE_NAME = "Scrolltek";
const SITE_URL = "https://scrolltek.name.ng";
const SITE_DESC =
  "Your go-to source for tech, digital culture, AI tools, phone tips, lifestyle, and the trends shaping how we live online.";

type MetaTags = {
  title: string;
  description: string;
  canonical: string;
  ogType?: string;
  ogImage?: string;
  ogImageWidth?: number;
  ogImageHeight?: number;
  articlePublishedTime?: string;
  articleModifiedTime?: string;
  articleAuthor?: string;
  robots?: string;
};

interface RenderResult {
  bodyHtml: string;
  meta: MetaTags;
  jsonLd: string;
  breadcrumbJsonLd?: string;
  faqJsonLd?: string;
}

const ARTICLE_SSR_OVERRIDES: Record<string, {
  metaTitle?: string;
  metaDescription?: string;
  updatedLabel?: string;
  dateModified?: string;
  robots?: string;
  schemaType?: "Article" | "NewsArticle";
  heroAlt?: string;
  heroCaption?: string;
  heroWidth?: number;
  heroHeight?: number;
  enableSsrToc?: boolean;
  faqs?: { question: string; answer: string }[];
}> = {
  "what-is-vibe-coding-2026": {
    metaTitle: "What Is Vibe Coding? A Beginner's Guide (2026)",
    metaDescription:
      "Vibe coding means building software by describing it in plain English. Learn how it works, the best tools, the real risks and how to start.",
    updatedLabel: "Last updated: October 2026",
    dateModified: "2026-10-23T00:00:00.000Z",
    robots: "index, follow, max-image-preview:large",
    schemaType: "Article",
    heroAlt:
      "Illustration of a person describing an app idea to an AI that builds the software on a laptop screen",
    heroCaption:
      "Vibe coding lets you describe software in plain English and have AI build it.",
    heroWidth: 1200,
    heroHeight: 630,
    enableSsrToc: true,
    faqs: [
      {
        question: "Do you need coding experience to vibe code?",
        answer: "No — beginners build working personal tools and prototypes all the time without knowing syntax. Basic familiarity with how web pages, databases and environment variables work becomes helpful as soon as you want to publish an app for other people.",
      },
      {
        question: "Is vibe coding free?",
        answer: "You can start for free on most platforms, including Google AI Studio, GitHub Copilot's free tier, Replit, Bolt and Lovable's daily credit plans. Heavy building or deploying custom domains usually pushes you onto a $10 to $25 monthly plan.",
      },
      {
        question: "What programming languages work best for vibe coding?",
        answer: "JavaScript, TypeScript, HTML/CSS and Python work best because AI models have seen enormous amounts of public training code and mature frameworks in those languages. Most browser app builders default to React, TypeScript and Tailwind CSS automatically.",
      },
      {
        question: "Can you build a real business with vibe coding?",
        answer: "You can validate demand and build an early minimum viable product quickly, and many solo founders do. Before charging customers or storing sensitive data, plan on proper security review, automated tests and clean version control rather than pure prompt-and-pray edits.",
      },
      {
        question: "Is vibe coding safe?",
        answer: "For local scripts, mockups and personal utilities, yes. For public apps handling logins, payments or user data, raw AI-generated code often misses permissions and input validation, so human security checks remain essential.",
      },
      {
        question: "Will vibe coding replace software developers?",
        answer: "It changes what developers spend time on rather than removing the need for engineering judgment. Writing routine boilerplate gets much faster, while architecture, security, debugging complex systems and product decisions matter more.",
      },
    ],
  },
};

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
    url: `${SITE_URL}/`,
    description: SITE_DESC,
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/search?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  });

  return {
    bodyHtml,
    meta: { title: `${SITE_NAME} — Tech, Culture, Lifestyle & AI Tools`, description: SITE_DESC, canonical: `${SITE_URL}/` },
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
  const seoOverride = Object.prototype.hasOwnProperty.call(ARTICLE_SSR_OVERRIDES, slug)
    ? ARTICLE_SSR_OVERRIDES[slug]
    : undefined;
  const metaTitleBase = seoOverride?.metaTitle ?? a.title;
  const metaDescription = seoOverride?.metaDescription ?? a.excerpt ?? SITE_DESC;

  const canonicalUrl = `${SITE_URL}/article/${encodeURIComponent(slug)}`;
  const resolvedHeroImage = a.imageUrl ? new URL(a.imageUrl, `${SITE_URL}/`).href : undefined;
  const authorSlug = author ? author.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") : "";
  const authorUrl = authorSlug ? `${SITE_URL}/author/${encodeURIComponent(authorSlug)}` : undefined;
  const categoryName = String(a.category ?? "").trim();
  const categorySlug = categoryName.toLowerCase().replace(/\s+/g, "-");

  const tocMarkup = (() => {
    if (!seoOverride?.enableSsrToc || !a.body) return "";
    const items: string[] = [];
    const headingPattern = /<(h2|h3)\s+id="([a-z0-9][a-z0-9-]{0,120})">([\s\S]*?)<\/\1>/gi;
    let m: RegExpExecArray | null;
    while ((m = headingPattern.exec(a.body)) !== null) {
      const text = m[3].replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
      if (text) items.push(`<li><a href="#${esc(m[2])}">${esc(text)}</a></li>`);
    }
    return items.length >= 3
      ? `<nav aria-label="Table of contents"><h2>In this article</h2><ol>${items.join("")}</ol></nav>`
      : "";
  })();

  const heroFigureMarkup = resolvedHeroImage
    ? seoOverride
      ? `<figure><img src="${esc(resolvedHeroImage)}" alt="${esc(seoOverride.heroAlt ?? a.title)}" width="${seoOverride.heroWidth ?? 1200}" height="${seoOverride.heroHeight ?? 630}" fetchpriority="high" decoding="async" />${seoOverride.heroCaption ? `<figcaption>${esc(seoOverride.heroCaption)}</figcaption>` : ""}</figure>`
      : ""
    : "";

  const bodyHtml = `<main id="ssr">
    <h1>${esc(a.title)}</h1>
    ${a.subtitle ? (seoOverride?.updatedLabel ? `<p><em>${esc(a.subtitle)}</em><br />${esc(seoOverride.updatedLabel)}</p>` : `<h2>${esc(a.subtitle)}</h2>`) : ""}
    ${a.excerpt && !seoOverride?.updatedLabel ? `<p class="excerpt">${esc(a.excerpt)}</p>` : ""}
    ${author ? `<address>By <span>${esc(author.name)}</span></address>` : ""}
    ${heroFigureMarkup}
    ${tocMarkup}
    ${a.body ?? ""}
  </main>`;

  const schemaType = seoOverride?.schemaType ?? "NewsArticle";
  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": schemaType,
    headline: a.title,
    description: metaDescription,
    image: resolvedHeroImage
      ? seoOverride?.heroWidth && seoOverride?.heroHeight
        ? [{ "@type": "ImageObject", url: resolvedHeroImage, width: seoOverride.heroWidth, height: seoOverride.heroHeight }]
        : resolvedHeroImage
      : undefined,
    datePublished: a.publishedAt.toISOString(),
    ...(seoOverride?.dateModified ? { dateModified: seoOverride.dateModified } : {}),
    mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl },
    author: author
      ? { "@type": "Person", name: author.name, ...(seoOverride && authorUrl ? { url: authorUrl } : {}) }
      : undefined,
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/favicon.svg` },
    },
    url: canonicalUrl,
  });

  const breadcrumbJsonLd = seoOverride
    ? JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
          ...(categoryName
            ? [{ "@type": "ListItem", position: 2, name: categoryName, item: `${SITE_URL}/category/${encodeURIComponent(categorySlug)}` }]
            : []),
          { "@type": "ListItem", position: categoryName ? 3 : 2, name: a.title, item: canonicalUrl },
        ],
      })
    : undefined;

  const faqJsonLd = seoOverride?.faqs?.length
    ? JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: seoOverride.faqs.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      })
    : undefined;

  const result: RenderResult = {
    bodyHtml,
    meta: {
      title: `${metaTitleBase} — ${SITE_NAME}`,
      description: metaDescription,
      canonical: canonicalUrl,
      ogType: "article",
      ogImage: resolvedHeroImage,
      ogImageWidth: seoOverride?.heroWidth,
      ogImageHeight: seoOverride?.heroHeight,
      articlePublishedTime: seoOverride ? a.publishedAt.toISOString() : undefined,
      articleModifiedTime: seoOverride?.dateModified,
      articleAuthor: seoOverride ? authorUrl : undefined,
      robots: seoOverride?.robots,
    },
    jsonLd,
    breadcrumbJsonLd,
    faqJsonLd,
  };

  setCached(cacheKey, result, 5 * 60 * 1000);
  return result;
}

async function renderAuthor(slug: string): Promise<RenderResult | null> {
  const cacheKey = `ssr:author:${slug}`;
  const cached = getCached<RenderResult>(cacheKey);
  if (cached) return cached;

  const AUTHORS: Record<string, { name: string; title: string; bio: string }> = {
    "maya-chen":     { name: "Maya Chen",    title: "Senior Tech & AI Writer",          bio: "Covering the intersection of AI and everyday technology for over 8 years." },
    "james-okafor":  { name: "James Okafor", title: "Tech & Culture Writer",            bio: "Writing at the crossroads of technology and culture since 2018." },
    "sofia-reyes":   { name: "Sofia Reyes",  title: "Lifestyle & Culture Editor",       bio: "Exploring wellness, digital culture, and how technology shapes the way we live." },
    "liam-park":     { name: "Liam Park",    title: "Mobile & On-Device AI Specialist", bio: "Former software engineer turned mobile writer — obsessed with squeezing every bit of performance from your devices." },
    "anya-patel":    { name: "Anya Patel",   title: "AI Tools & Productivity Writer",   bio: "Testing AI productivity tools so you don't have to — with thousands of hours logged across ChatGPT, Claude, Gemini, and beyond." },
    "scrolltek-editorial": { name: "Scrolltek Editorial", title: "Editorial Team", bio: "The Scrolltek editorial team covers breaking stories and collaborative features across all categories." },
  };

  const author = AUTHORS[slug];
  if (!author) return null;

  const authorRows = await db.select().from(authorsTable).where(eq(authorsTable.name, author.name)).limit(1);
  const authorId = authorRows[0]?.id;
  const authorArticles = authorId
    ? await db.select({ slug: articlesTable.slug, title: articlesTable.title, excerpt: articlesTable.excerpt, category: articlesTable.category })
        .from(articlesTable)
        .where(and(eq(articlesTable.published, true), eq(articlesTable.authorId, authorId)))
        .orderBy(desc(articlesTable.publishedAt))
    : [];

  const cards = authorArticles.map(a => articleCard(a.slug, a.title, a.excerpt ?? "", a.category)).join("");
  const bodyHtml = `<main id="ssr">
    <h1>${esc(author.name)} — ${esc(author.title)}</h1>
    <p>${esc(author.bio)}</p>
    ${cards}
  </main>`;

  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Person",
    name: author.name,
    jobTitle: author.title,
    description: author.bio,
    url: `${SITE_URL}/author/${slug}`,
    worksFor: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
  });

  const result: RenderResult = {
    bodyHtml,
    meta: {
      title: `${author.name} — ${SITE_NAME}`,
      description: `${author.bio} Read all articles by ${author.name} on ${SITE_NAME}.`,
      canonical: `${SITE_URL}/author/${slug}`,
    },
    jsonLd,
  };

  setCached(cacheKey, result, 5 * 60 * 1000);
  return result;
}

const CATEGORY_LABELS: Record<string, string> = {
  tech: "Tech",
  culture: "Culture",
  lifestyle: "Lifestyle",
  "ai-tools": "AI Tools",
  "phone-tips": "Phone Tips",
  productivity: "Productivity",
  trending: "Trending",
  "ai-productivity": "AI & Productivity",
  "culture-lifestyle": "Culture & Lifestyle",
};
const MIXED_CATEGORY_SLUGS: Record<string, string[]> = {
  "ai-productivity": ["ai-tools", "productivity"],
  "culture-lifestyle": ["culture", "lifestyle"],
};

async function renderCategory(slug: string): Promise<RenderResult | null> {
  const label = CATEGORY_LABELS[slug];
  if (!label) return null;

  const query = db.select().from(articlesTable);
  let rows: (typeof articlesTable.$inferSelect)[];
  if (slug === "trending") {
    rows = await query
      .where(eq(articlesTable.published, true))
      .orderBy(desc(articlesTable.views), desc(articlesTable.publishedAt))
      .limit(100);
  } else {
    const categoryNames: string[] = (MIXED_CATEGORY_SLUGS[slug] ?? [slug]).map((categorySlug) => {
      return CATEGORY_LABELS[categorySlug];
    });
    const categoryFilter = categoryNames.length > 1
      ? inArray(articlesTable.category, categoryNames)
      : eq(articlesTable.category, categoryNames[0]);
    rows = await query
      .where(and(eq(articlesTable.published, true), categoryFilter))
      .orderBy(desc(articlesTable.publishedAt))
      .limit(100);
  }

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
  const clean = urlPath.split("?")[0].replace(/\/+$/, "") || "/";

  if (clean === "/") return renderHome();

  const articleMatch = clean.match(/^\/article\/([^/]+)$/);
  if (articleMatch) return renderArticle(articleMatch[1]);

  const categoryMatch = clean.match(/^\/category\/([^/]+)$/);
  if (categoryMatch) return renderCategory(categoryMatch[1]);

  const authorMatch = clean.match(/^\/author\/([^/]+)$/);
  if (authorMatch) return renderAuthor(authorMatch[1]);

  return null;
}

function replaceOrInsertHeadTag(html: string, matcher: RegExp, tag: string): string {
  if (matcher.test(html)) return html.replace(matcher, tag);
  return html.replace(/<\/head\s*>/i, `${tag}\n</head>`);
}

export function injectIntoHtml(
  template: string,
  result: RenderResult
): string {
  let html = template;
  html = replaceOrInsertHeadTag(
    html,
    /<title\b[^>]*>[\s\S]*?<\/title>/i,
    `<title>${esc(result.meta.title)}</title>`,
  );
  html = replaceOrInsertHeadTag(
    html,
    /<meta\s+name=["']description["'][^>]*>/i,
    `<meta name="description" content="${esc(result.meta.description)}" />`,
  );
  html = replaceOrInsertHeadTag(
    html,
    /<meta\s+property=["']og:title["'][^>]*>/i,
    `<meta property="og:title" content="${esc(result.meta.title)}" />`,
  );
  html = replaceOrInsertHeadTag(
    html,
    /<meta\s+property=["']og:description["'][^>]*>/i,
    `<meta property="og:description" content="${esc(result.meta.description)}" />`,
  );
  html = replaceOrInsertHeadTag(
    html,
    /<meta\s+name=["']twitter:title["'][^>]*>/i,
    `<meta name="twitter:title" content="${esc(result.meta.title)}" />`,
  );
  html = replaceOrInsertHeadTag(
    html,
    /<meta\s+name=["']twitter:description["'][^>]*>/i,
    `<meta name="twitter:description" content="${esc(result.meta.description)}" />`,
  );

  if (result.meta.canonical) {
    html = replaceOrInsertHeadTag(
      html,
      /<link\s+rel=["']canonical["'][^>]*>/i,
      `<link rel="canonical" href="${esc(result.meta.canonical)}" />`,
    );
    html = replaceOrInsertHeadTag(
      html,
      /<meta\s+property=["']og:url["'][^>]*>/i,
      `<meta property="og:url" content="${esc(result.meta.canonical)}" />`,
    );
    html = replaceOrInsertHeadTag(
      html,
      /<meta\s+name=["']twitter:url["'][^>]*>/i,
      `<meta name="twitter:url" content="${esc(result.meta.canonical)}" />`,
    );
  } else {
    html = html.replace(/<link\s+rel=["']canonical["'][^>]*>/gi, "");
    html = html.replace(/<meta\s+property=["']og:url["'][^>]*>/gi, "");
  }

  if (result.meta.ogType) {
    html = replaceOrInsertHeadTag(
      html,
      /<meta\s+property=["']og:type["'][^>]*>/i,
      `<meta property="og:type" content="${esc(result.meta.ogType)}" />`,
    );
  }

  if (result.meta.ogImage) {
    html = replaceOrInsertHeadTag(
      html,
      /<meta\s+property=["']og:image["'][^>]*>/i,
      `<meta property="og:image" content="${esc(result.meta.ogImage)}" />`,
    );
    html = replaceOrInsertHeadTag(
      html,
      /<meta\s+name=["']twitter:image["'][^>]*>/i,
      `<meta name="twitter:image" content="${esc(result.meta.ogImage)}" />`,
    );
    html = replaceOrInsertHeadTag(
      html,
      /<meta\s+name=["']twitter:card["'][^>]*>/i,
      '<meta name="twitter:card" content="summary_large_image" />',
    );
    if (result.meta.ogImageWidth) {
      html = replaceOrInsertHeadTag(
        html,
        /<meta\s+property=["']og:image:width["'][^>]*>/i,
        `<meta property="og:image:width" content="${result.meta.ogImageWidth}" />`,
      );
    }
    if (result.meta.ogImageHeight) {
      html = replaceOrInsertHeadTag(
        html,
        /<meta\s+property=["']og:image:height["'][^>]*>/i,
        `<meta property="og:image:height" content="${result.meta.ogImageHeight}" />`,
      );
    }
  } else {
    html = html.replace(/<meta\s+property=["']og:image["'][^>]*>/gi, "");
    html = html.replace(/<meta\s+name=["']twitter:image["'][^>]*>/gi, "");
  }

  if (result.meta.articlePublishedTime) {
    html = replaceOrInsertHeadTag(
      html,
      /<meta\s+property=["']article:published_time["'][^>]*>/i,
      `<meta property="article:published_time" content="${esc(result.meta.articlePublishedTime)}" />`,
    );
  }
  if (result.meta.articleModifiedTime) {
    html = replaceOrInsertHeadTag(
      html,
      /<meta\s+property=["']article:modified_time["'][^>]*>/i,
      `<meta property="article:modified_time" content="${esc(result.meta.articleModifiedTime)}" />`,
    );
  }
  if (result.meta.articleAuthor) {
    html = replaceOrInsertHeadTag(
      html,
      /<meta\s+property=["']article:author["'][^>]*>/i,
      `<meta property="article:author" content="${esc(result.meta.articleAuthor)}" />`,
    );
  }

  if (result.meta.robots) {
    html = replaceOrInsertHeadTag(
      html,
      /<meta\s+name=["']robots["'][^>]*>/i,
      `<meta name="robots" content="${esc(result.meta.robots)}" />`,
    );
  }

  if (result.jsonLd) {
    const safeJsonLd = result.jsonLd
      .replace(/</g, "\\u003c")
      .replace(/>/g, "\\u003e")
      .replace(/&/g, "\\u0026")
      .replace(/\u2028/g, "\\u2028")
      .replace(/\u2029/g, "\\u2029");
    let schemaType = "";
    try {
      schemaType = JSON.parse(result.jsonLd)["@type"] ?? "";
    } catch {
      // Keep malformed structured data out of the response.
      schemaType = "";
    }
    const scriptId = schemaType === "NewsArticle" || schemaType === "Article"
      ? "article-jsonld"
      : schemaType === "Person"
        ? "author-jsonld"
        : schemaType === "WebSite"
          ? "website-jsonld"
          : "page-jsonld";
    if (schemaType) {
      const script = `<script type="application/ld+json" id="${scriptId}">${safeJsonLd}</script>`;
      const matcher = new RegExp(`<script\\b(?=[^>]*\\bid=["']${scriptId}["'])[^>]*>[\\s\\S]*?<\\/script>`, "i");
      html = replaceOrInsertHeadTag(html, matcher, script);
    }
  }

  if (result.breadcrumbJsonLd) {
    const safeBreadcrumbJsonLd = result.breadcrumbJsonLd
      .replace(/</g, "\\u003c")
      .replace(/>/g, "\\u003e")
      .replace(/&/g, "\\u0026")
      .replace(/\u2028/g, "\\u2028")
      .replace(/\u2029/g, "\\u2029");
    const breadcrumbScript = `<script type="application/ld+json" id="breadcrumb-jsonld">${safeBreadcrumbJsonLd}</script>`;
    const breadcrumbMatcher = /<script\b(?=[^>]*\bid=["']breadcrumb-jsonld["'])[^>]*>[\s\S]*?<\/script>/i;
    html = replaceOrInsertHeadTag(html, breadcrumbMatcher, breadcrumbScript);
  }

  if (result.faqJsonLd) {
    const safeFaqJsonLd = result.faqJsonLd
      .replace(/</g, "\\u003c")
      .replace(/>/g, "\\u003e")
      .replace(/&/g, "\\u0026")
      .replace(/\u2028/g, "\\u2028")
      .replace(/\u2029/g, "\\u2029");
    const faqScript = `<script type="application/ld+json" id="faq-jsonld">${safeFaqJsonLd}</script>`;
    const faqMatcher = /<script\b(?=[^>]*\bid=["']faq-jsonld["'])[^>]*>[\s\S]*?<\/script>/i;
    html = replaceOrInsertHeadTag(html, faqMatcher, faqScript);
  }

  html = html.replace(
    /<div\s+id=["']root["']\s*>\s*<\/div>/i,
    `<div id="root">${result.bodyHtml}</div>`,
  );
  if (result.meta.canonical !== `${SITE_URL}/`) {
    html = html.replace(/<noscript\s+id=["']homepage-fallback["'][^>]*>[\s\S]*?<\/noscript>/gi, "");
  }
  return html;
}

export function injectCanonicalIntoHtml(
  template: string,
  pathname: string,
  robots?: string,
  pageMeta: { title?: string; description?: string } = {},
): string {
  const path = pathname.split(/[?#]/, 1)[0].replace(/\/{2,}/g, "/");
  const canonicalPath = path.length > 1 ? path.replace(/\/+$/, "") : "/";
  const canonical = `${SITE_URL}${canonicalPath}`;
  let html = template;

  if (pageMeta.title) {
    html = replaceOrInsertHeadTag(
      html,
      /<title\b[^>]*>[\s\S]*?<\/title>/i,
      `<title>${esc(pageMeta.title)}</title>`,
    );
    html = replaceOrInsertHeadTag(
      html,
      /<meta\s+property=["']og:title["'][^>]*>/i,
      `<meta property="og:title" content="${esc(pageMeta.title)}" />`,
    );
    html = replaceOrInsertHeadTag(
      html,
      /<meta\s+name=["']twitter:title["'][^>]*>/i,
      `<meta name="twitter:title" content="${esc(pageMeta.title)}" />`,
    );
  }

  if (pageMeta.description) {
    html = replaceOrInsertHeadTag(
      html,
      /<meta\s+name=["']description["'][^>]*>/i,
      `<meta name="description" content="${esc(pageMeta.description)}" />`,
    );
    html = replaceOrInsertHeadTag(
      html,
      /<meta\s+property=["']og:description["'][^>]*>/i,
      `<meta property="og:description" content="${esc(pageMeta.description)}" />`,
    );
    html = replaceOrInsertHeadTag(
      html,
      /<meta\s+name=["']twitter:description["'][^>]*>/i,
      `<meta name="twitter:description" content="${esc(pageMeta.description)}" />`,
    );
  }

  html = replaceOrInsertHeadTag(
    html,
    /<link\s+rel=["']canonical["'][^>]*>/i,
    `<link rel="canonical" href="${esc(canonical)}" />`,
  );
  html = replaceOrInsertHeadTag(
    html,
    /<meta\s+property=["']og:url["'][^>]*>/i,
    `<meta property="og:url" content="${esc(canonical)}" />`,
  );

  if (robots) {
    html = replaceOrInsertHeadTag(
      html,
      /<meta\s+name=["']robots["'][^>]*>/i,
      `<meta name="robots" content="${esc(robots)}" />`,
    );
  }
  return html;
}

export function injectNotFoundIntoHtml(template: string, pathname: string): string {
  const path = esc(pathname || "/");
  return injectIntoHtml(template, {
    bodyHtml: `<main id="ssr"><h1>Page not found</h1><p>We couldn't find a page at ${path}.</p><p><a href="/">Return to Scrolltek</a></p></main>`,
    meta: {
      title: `Page Not Found — ${SITE_NAME}`,
      description: "The requested Scrolltek page could not be found.",
      canonical: "",
      robots: "noindex, follow",
    },
    jsonLd: "",
  });
}

export function injectUnavailableIntoHtml(template: string): string {
  return injectIntoHtml(template, {
    bodyHtml: "<main id=\"ssr\"><h1>Page temporarily unavailable</h1><p>Please try again shortly.</p></main>",
    meta: {
      title: `Temporarily Unavailable — ${SITE_NAME}`,
      description: "This Scrolltek page is temporarily unavailable. Please try again shortly.",
      canonical: "",
      robots: "noindex, follow",
    },
    jsonLd: "",
  });
}
