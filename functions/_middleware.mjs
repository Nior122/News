import { editorialRelatedSlugs, orderEditorialRelated } from "./lib/editorial-related.mjs";
import { neon } from "@neondatabase/serverless";
import { getArticleRedirectTarget, REDIRECTED_ARTICLE_SLUGS } from "./lib/article-routing.mjs";
import { applyArticleContentOverride } from "./lib/article-seo.mjs";
import {
  categoryDescription,
  categoryDisplayName,
  categoryGroupNames,
  categorySlugFromName,
  isRenderableCategorySlug,
  validCategoryPages,
} from "./lib/site-categories.mjs";
import {
  renderArticleDocument,
  renderAuthorDocument,
  renderCanonicalDocument,
  renderHomepageDocument,
  renderListingDocument,
  renderNotFoundDocument,
  renderUnavailableDocument,
  hasMeaningfulArticleBody,
  sanitizeArticleHtml,
  MAX_RELATED_LINKS,
  SITE_ORIGIN,
} from "./lib/seo-html.mjs";

const CANONICAL_HOST = new URL(SITE_ORIGIN).hostname;
const AUTHOR_PROFILES = {
  "maya-chen": {
    name: "Maya Chen",
    jobTitle: "Senior Tech & AI Writer",
    description: "Covering the intersection of AI and everyday technology for over 8 years.",
  },
  "james-okafor": {
    name: "James Okafor",
    jobTitle: "Tech & Culture Writer",
    description: "Writing at the crossroads of technology and culture since 2018.",
  },
  "sofia-reyes": {
    name: "Sofia Reyes",
    jobTitle: "Lifestyle & Culture Editor",
    description: "Exploring wellness, digital culture, and how technology shapes the way we live.",
  },
  "liam-park": {
    name: "Liam Park",
    jobTitle: "Mobile & On-Device AI Specialist",
    description: "Former software engineer turned mobile writer — obsessed with squeezing every bit of performance from your devices.",
  },
  "anya-patel": {
    name: "Anya Patel",
    jobTitle: "AI Tools & Productivity Writer",
    description: "Testing AI productivity tools so you don't have to — with thousands of hours logged across ChatGPT, Claude, Gemini, and beyond.",
  },
  "scrolltek-editorial": {
    name: "Scrolltek Editorial",
    jobTitle: "Editorial Team",
    description: "The Scrolltek editorial team covers breaking stories and collaborative features across all categories.",
  },
};
const GENERIC_PAGE_METADATA = {
  "/": {
    title: "Scrolltek — Tech, Culture, Lifestyle & AI Tools",
    heading: "Scrolltek",
    description: "Scrolltek is your go-to source for tech, digital culture, AI tools, phone tips, lifestyle, and the trends shaping how we live online.",
  },
  "/about": {
    title: "About Us — Scrolltek",
    heading: "About Scrolltek",
    description: "Scrolltek covers tech, culture, AI tools, phone tips, lifestyle, and trending topics — fast, useful, and written for real people.",
  },
  "/contact": {
    title: "Contact Us — Scrolltek",
    heading: "Contact Us",
    description: "Get in touch with the Scrolltek team. Send us a tip, feedback, or just say hi.",
  },
  "/privacy": {
    title: "Privacy Policy — Scrolltek",
    heading: "Privacy Policy",
    description: "Scrolltek's privacy policy — how we collect, use, and protect your information when you visit our website.",
  },
  "/search": {
    title: "Search Scrolltek",
    heading: "Search Scrolltek",
    description: "Search Scrolltek for articles on tech, culture, lifestyle, AI tools, phone tips, productivity and trending topics.",
    robots: "noindex, follow",
  },
  "/admin": {
    title: "Scrolltek Admin",
    heading: "Scrolltek Admin",
    description: "Scrolltek administration.",
    robots: "noindex, nofollow",
  },
  "/admin/login": {
    title: "Admin Login — Scrolltek",
    heading: "Admin Login",
    description: "Sign in to manage Scrolltek.",
    robots: "noindex, nofollow",
  },
};
function getDatabase(env) {
  const connectionString = (env.DATABASE_URL ?? "")
    .replace(/[&?]channel_binding=[^&]*/g, "")
    .replace(/\?&/, "?");
  return neon(connectionString);
}

function normalizePath(pathname) {
  const path = pathname.replace(/\/{2,}/g, "/");
  return path.length > 1 ? path.replace(/\/+$/, "") : path;
}

function decodePathSegment(segment) {
  try {
    const decoded = decodeURIComponent(segment);
    return decoded.includes("/") ? null : decoded;
  } catch {
    return null;
  }
}

function classifyPage(pathname) {
  const path = normalizePath(pathname);
  const genericMetadata = Object.hasOwn(GENERIC_PAGE_METADATA, path)
    ? GENERIC_PAGE_METADATA[path]
    : null;
  if (genericMetadata) {
    return { type: "generic", path, ...genericMetadata };
  }

  const articleMatch = path.match(/^\/article\/([^/]+)$/);
  if (articleMatch) {
    const slug = decodePathSegment(articleMatch[1]);
    return slug ? { type: "article", path, slug } : { type: "not-found", path };
  }

  const categoryMatch = path.match(/^\/category\/([^/]+)$/);
  if (categoryMatch) {
    const slug = decodePathSegment(categoryMatch[1]);
    return slug && isRenderableCategorySlug(slug)
      ? { type: "category", path, slug }
      : { type: "not-found", path };
  }

  const authorMatch = path.match(/^\/author\/([^/]+)$/);
  if (authorMatch) {
    const slug = decodePathSegment(authorMatch[1]);
    const profile = slug && Object.hasOwn(AUTHOR_PROFILES, slug)
      ? AUTHOR_PROFILES[slug]
      : null;
    return profile
      ? { type: "author", path, slug, ...profile }
      : { type: "not-found", path };
  }

  return { type: "not-found", path };
}

function toClientArticle(row, { includeBody = false, fallbackId = 1, fallbackAuthor = null } = {}) {
  const id = Number(row.id) || fallbackId;
  const authorId = Number(row.author_id ?? fallbackAuthor?.id) || 0;
  const authorName = String(row.author_name || fallbackAuthor?.name || "Staff Writer");
  const avatarUrl = String(row.avatar_url ?? fallbackAuthor?.avatar_url ?? "");
  const rawDate = row.published_at ? new Date(row.published_at) : null;
  const publishedAt = rawDate && !Number.isNaN(rawDate.getTime())
    ? rawDate.toISOString()
    : String(row.published_at ?? "");

  return {
    id,
    slug: String(row.slug ?? ""),
    title: String(row.title ?? ""),
    subtitle: row.subtitle ?? null,
    excerpt: String(row.excerpt ?? ""),
    body: includeBody ? sanitizeArticleHtml(row.body ?? "") : "",
    category: String(row.category ?? ""),
    authorId,
    imageUrl: String(row.image_url ?? ""),
    readTime: Number(row.read_time) || 5,
    views: Number(row.views) || 0,
    featured: Boolean(row.featured),
    editorsPick: Boolean(row.editors_pick),
    published: true,
    publishedAt,
    tags: Array.isArray(row.tags) ? row.tags : [],
    author: {
      id: authorId,
      name: authorName,
      avatarUrl,
    },
  };
}

function injectHydrationPayload(html, payload, heroImageUrl = "") {
  let out = html;
  const cleanHero = String(heroImageUrl ?? "").trim();
  if (cleanHero && /^(https?:\/\/|\/images\/|\/assets\/)/i.test(cleanHero)) {
    const escapedHero = cleanHero
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    const preloadTag = `<link rel="preload" as="image" href="${escapedHero}" fetchpriority="high" />`;
    out = out.replace(/<\/head>/i, `${preloadTag}</head>`);
  }
  if (payload && /<\/body>/i.test(out)) {
    const safeJson = JSON.stringify(payload)
      .replace(/</g, "\\u003c")
      .replace(/>/g, "\\u003e")
      .replace(/&/g, "\\u0026")
      .replace(/\u2028/g, "\\u2028")
      .replace(/\u2029/g, "\\u2029");
    out = out.replace(/<\/body>/i, `<script type="application/json" id="ssr-data">${safeJson}</script></body>`);
  }
  return out;
}

async function fetchArticle(sql, slug) {
  const rows = await sql`
    SELECT a.id, a.slug, a.title, a.subtitle, a.excerpt, a.body, a.category,
           a.author_id, a.image_url, a.read_time, a.views, a.featured,
           a.editors_pick, a.tags, a.published_at,
           au.name AS author_name, au.avatar_url
    FROM articles a
    LEFT JOIN authors au ON au.id = a.author_id
    WHERE a.slug = ${slug} AND a.published = true
    LIMIT 1
  `;
  return rows[0] ? applyArticleContentOverride(rows[0]) : null;
}

async function fetchAuthor(sql, slug) {
  const profile = AUTHOR_PROFILES[slug];
  const authors = await sql`
    SELECT id, name, avatar_url
    FROM authors
    WHERE name = ${profile.name}
    LIMIT 1
  `;
  const author = authors[0];
  if (!author) {
    return slug === "scrolltek-editorial"
      ? { author: { id: null, name: profile.name, avatar_url: "" }, articles: [] }
      : null;
  }

  const articles = await sql`
    SELECT slug, title, excerpt, id, subtitle, category, image_url,
           read_time, views, featured, editors_pick, tags, published_at
    FROM articles
    WHERE author_id = ${author.id} AND published = true
      AND slug <> ALL(${REDIRECTED_ARTICLE_SLUGS}::text[])
    ORDER BY published_at DESC
    LIMIT 100
  `;
  return { author, articles: articles.map(applyArticleContentOverride) };
}

async function fetchCategoryArticles(sql, slug) {
  if (slug === "trending") {
    const trendingRows = await sql`
      SELECT a.id, a.slug, a.title, a.subtitle, a.excerpt, a.category,
             a.author_id, a.image_url, a.read_time, a.views, a.featured,
             a.editors_pick, a.tags, a.published_at,
             au.name AS author_name, au.avatar_url
      FROM articles a
      LEFT JOIN authors au ON au.id = a.author_id
      WHERE a.published = true AND a.slug <> ALL(${REDIRECTED_ARTICLE_SLUGS}::text[])
      ORDER BY a.views DESC, a.published_at DESC
      LIMIT 100
    `;
    return trendingRows.map(applyArticleContentOverride);
  }

  const names = categoryGroupNames(slug);
  const groups = await Promise.all(names.map((category) => sql`
    SELECT a.id, a.slug, a.title, a.subtitle, a.excerpt, a.category,
           a.author_id, a.image_url, a.read_time, a.views, a.featured,
           a.editors_pick, a.tags, a.published_at,
           au.name AS author_name, au.avatar_url
    FROM articles a
    LEFT JOIN authors au ON au.id = a.author_id
    WHERE a.published = true AND a.category = ${category}
      AND a.slug <> ALL(${REDIRECTED_ARTICLE_SLUGS}::text[])
    ORDER BY a.published_at DESC
    LIMIT 100
  `));
  const articles = groups.flat().map(applyArticleContentOverride);
  const seen = new Set();
  return articles
    .filter((article) => {
      if (seen.has(article.slug)) return false;
      seen.add(article.slug);
      return true;
    })
    .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
}

/**
 * Related reading for an article: same-category stories first, then the newest
 * of the rest, so the block still fills when a category is thin.
 *
 * Candidates carry their body so non-renderable rows can be dropped here — an
 * article whose page would 503 must not be linked from a page that returns 200.
 */
const RELATED_CANDIDATE_LIMIT = 12;

async function fetchRelatedArticles(sql, article) {
  const curated = editorialRelatedSlugs(article.slug);
  if (curated) {
    const rows = await sql`
      SELECT a.id, a.slug, a.title, a.excerpt, a.body, a.category,
             a.author_id, a.image_url, a.read_time, a.views, a.featured,
             a.editors_pick, a.tags, a.published_at,
             au.name AS author_name, au.avatar_url
      FROM articles a LEFT JOIN authors au ON au.id = a.author_id
      WHERE a.published = true AND a.slug = ANY(${curated}::text[])
    `;
    return orderEditorialRelated(article.slug, rows.map(applyArticleContentOverride))
      .filter(row => hasMeaningfulArticleBody(row.body));
  }

  const candidates = await sql`
    SELECT a.id, a.slug, a.title, a.excerpt, a.body, a.category,
           a.author_id, a.image_url, a.read_time, a.views, a.featured,
           a.editors_pick, a.tags, a.published_at,
           au.name AS author_name, au.avatar_url
    FROM articles a
    LEFT JOIN authors au ON au.id = a.author_id
    WHERE a.published = true
      AND a.slug <> ${article.slug}
      AND a.slug <> ALL(${REDIRECTED_ARTICLE_SLUGS}::text[])
      AND BTRIM(COALESCE(a.title, '')) <> ''
      AND BTRIM(COALESCE(a.body, '')) <> ''
    ORDER BY (a.category = ${article.category}) DESC, a.published_at DESC
    LIMIT ${RELATED_CANDIDATE_LIMIT}
  `;
  return candidates
    .map(applyArticleContentOverride)
    .filter((candidate) => hasMeaningfulArticleBody(candidate.body))
    .slice(0, MAX_RELATED_LINKS);
}

/**
 * Everything the homepage needs to be crawlable without JavaScript: the valid
 * category pages plus every qualifying published row grouped by category.
 *
 * The article query is deliberately unfiltered by slug — a hardcoded allowlist
 * would silently drop new stories from the server-rendered homepage.
 */
async function fetchHomepageData(sql) {
  const rawArticles = await sql`
    SELECT a.id, a.slug, a.title, a.subtitle, a.excerpt, a.category, a.body,
           a.author_id, a.image_url, a.read_time, a.views, a.featured,
           a.editors_pick, a.tags, a.published_at,
           au.name AS author_name, au.avatar_url
    FROM articles a
    LEFT JOIN authors au ON au.id = a.author_id
    WHERE a.published = true
      AND BTRIM(COALESCE(a.title, '')) <> ''
      AND BTRIM(COALESCE(a.body, '')) <> ''
      AND a.slug <> ALL(${REDIRECTED_ARTICLE_SLUGS}::text[])
    ORDER BY a.published_at DESC
    LIMIT 500
  `;
  const articles = rawArticles.map(applyArticleContentOverride);

  // Every valid category page the router can render, including the virtual
  // mixed pages (ai-productivity, culture-lifestyle) that have no row in the
  // categories table. Those pages are indexable and self-canonical, so the
  // homepage must link them like any other category.
  const categories = validCategoryPages();

  const groups = new Map();
  const clientArticles = [];
  for (let i = 0; i < articles.length; i += 1) {
    const article = articles[i];
    const slug = String(article?.slug ?? "").trim();
    const title = String(article?.title ?? "").trim();
    if (!slug || !title) continue;
    // Same renderability predicate the sitemap uses. A row whose body sanitizes
    // to nothing renders as a 503 article page, so the homepage must not link
    // to it — the two listings have to agree on what "published" means.
    if (!hasMeaningfulArticleBody(article.body)) continue;
    clientArticles.push(toClientArticle(article, { includeBody: false, fallbackId: i + 1 }));
    const categoryName = String(article.category ?? "").trim();
    const categorySlug = categorySlugFromName(categoryName);
    const key = categorySlug || "uncategorized";
    if (!groups.has(key)) {
      groups.set(key, {
        slug: isRenderableCategorySlug(categorySlug) ? categorySlug : "",
        name: categoryName || "More stories",
        articles: [],
      });
    }
    groups.get(key).articles.push(article);
  }

  const order = new Map(categories.map((category, index) => [category.slug, index]));
  const sections = [...groups.values()].sort((a, b) => {
    const rankA = order.has(a.slug) ? order.get(a.slug) : Number.MAX_SAFE_INTEGER;
    const rankB = order.has(b.slug) ? order.get(b.slug) : Number.MAX_SAFE_INTEGER;
    if (rankA !== rankB) return rankA - rankB;
    return a.name.localeCompare(b.name);
  });

  return { categories, sections, clientArticles };
}

function isHtmlResponse(response) {
  return (response.headers.get("content-type") ?? "").toLowerCase().includes("text/html");
}

function isStaticAssetPath(pathname) {
  return pathname === "/assets"
    || pathname.startsWith("/assets/")
    || /\.(?:7z|avif|bmp|css|csv|eot|gif|gz|heic|heif|ico|jpe?g|js|json|map|mp3|mp4|otf|pdf|png|svg|tif|tiff|ttf|txt|wasm|webm|webmanifest|webp|woff2?|xml|zip)$/i.test(pathname);
}

function htmlResponse(baseResponse, html, request, status, { cacheControl, retryAfter, robots } = {}) {
  const headers = new Headers(baseResponse.headers);
  for (const header of ["content-length", "content-encoding", "etag", "content-md5", "last-modified"]) {
    headers.delete(header);
  }
  headers.set("Content-Type", "text/html; charset=utf-8");
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("Cache-Control", cacheControl ?? (status === 200 ? "public, max-age=300, stale-while-revalidate=60" : "no-store"));
  if (status === 404 || status >= 500) headers.set("X-Robots-Tag", "noindex, follow");
  else if (robots) headers.set("X-Robots-Tag", robots);
  if (retryAfter) headers.set("Retry-After", String(retryAfter));

  return new Response(request.method === "HEAD" ? null : html, {
    status,
    statusText: status === baseResponse.status ? baseResponse.statusText : undefined,
    headers,
  });
}

function canonicalHostRedirect(request, env) {
  if (request.method !== "GET" && request.method !== "HEAD") return null;
  const url = new URL(request.url);
  const hostname = url.hostname.toLowerCase();
  const alternateHosts = new Set([`www.${CANONICAL_HOST}`]);
  const productionBranch = String(env?.PAGES_PRODUCTION_BRANCH ?? "").trim();
  const deployedBranch = String(env?.CF_PAGES_BRANCH ?? "").trim();
  const isProductionPagesHost = hostname.endsWith(".pages.dev")
    && productionBranch !== ""
    && deployedBranch === productionBranch;
  const isNonCanonicalApex = hostname === CANONICAL_HOST
    && (url.protocol !== "https:" || url.port !== "");

  // Avoid embedding an unverified Pages project name in source. Only redirect
  // the Pages hostname when the deployed branch matches an explicitly configured
  // production branch; branch-preview hosts remain usable and canonical-tagged.
  if (!alternateHosts.has(hostname) && !isProductionPagesHost && !isNonCanonicalApex) {
    return null;
  }

  url.protocol = "https:";
  url.hostname = CANONICAL_HOST;
  url.port = "";
  return Response.redirect(url.toString(), 308);
}

function articleSlugRedirect(request) {
  if (request.method !== "GET" && request.method !== "HEAD") return null;
  const url = new URL(request.url);
  const match = normalizePath(url.pathname).match(/^\/article\/([^/]+)$/);
  if (!match) return null;

  const slug = decodePathSegment(match[1]);
  const targetSlug = slug ? getArticleRedirectTarget(slug) : null;
  if (!targetSlug) return null;

  url.pathname = `/article/${encodeURIComponent(targetSlug)}`;
  return Response.redirect(url.toString(), 301);
}

export async function handleSeoRequest(context, { databaseFactory = getDatabase } = {}) {
  const { request, env } = context;
  const redirect = canonicalHostRedirect(request, env);
  if (redirect) return redirect;
  const articleRedirect = articleSlugRedirect(request);
  if (articleRedirect) return articleRedirect;

  const route = classifyPage(new URL(request.url).pathname);
  if (!route || (request.method !== "GET" && request.method !== "HEAD")) {
    return context.next();
  }

  const baseResponse = await context.next();
  if (!isHtmlResponse(baseResponse)) return baseResponse;

  if (route.type === "not-found" && isStaticAssetPath(route.path)) {
    return new Response(request.method === "HEAD" ? null : "Not found", {
      status: 404,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
        "X-Robots-Tag": "noindex, follow",
      },
    });
  }

  const template = await baseResponse.text();
  if (route.type === "not-found") {
    return htmlResponse(
      baseResponse,
      renderNotFoundDocument(template, route.path),
      request,
      404,
      { cacheControl: "no-store" },
    );
  }

  // Homepage: server-render the full listing so crawlers and visitors without
  // JavaScript see every published story. A database failure degrades to the
  // static shell below rather than taking the homepage down with it.
  if (route.type === "generic" && route.path === "/" && env?.DATABASE_URL) {
    try {
      const { categories, sections, clientArticles } = await fetchHomepageData(databaseFactory(env));
      const renderedHome = renderHomepageDocument(template, {
        pathname: route.path,
        title: route.title,
        heading: route.heading,
        description: route.description,
        categories,
        sections,
      });
      return htmlResponse(
        baseResponse,
        injectHydrationPayload(
          renderedHome,
          { kind: "home", articles: clientArticles },
          clientArticles[0]?.imageUrl,
        ),
        request,
        baseResponse.status,
      );
    } catch {
      console.error("[seo-render] homepage listing failed; serving static shell");
    }
  }

  if (route.type === "generic") {
    const html = renderCanonicalDocument(template, route.path, {
      robots: route.robots,
      title: route.title,
      description: route.description,
      heading: route.heading,
    });
    return htmlResponse(baseResponse, html, request, baseResponse.status, { robots: route.robots });
  }

  if (!env?.DATABASE_URL) {
    return htmlResponse(
      baseResponse,
      renderUnavailableDocument(template, route.path),
      request,
      503,
      { cacheControl: "no-store", retryAfter: 60 },
    );
  }

  try {
    const sql = databaseFactory(env);
    if (route.type === "article") {
      const article = await fetchArticle(sql, route.slug);
      if (!article) {
        return htmlResponse(
          baseResponse,
          renderNotFoundDocument(template, route.path),
          request,
          404,
          { cacheControl: "no-store" },
        );
      }
      if (!String(article.title || "").trim() || !hasMeaningfulArticleBody(article.body)) {
        return htmlResponse(
          baseResponse,
          renderUnavailableDocument(template, route.path),
          request,
          503,
          { cacheControl: "no-store", retryAfter: 60 },
        );
      }
      // Related links are an enhancement: never fail the article over them.
      let related = [];
      try {
        related = await fetchRelatedArticles(sql, article);
      } catch {
        console.error("[seo-render] related articles failed");
      }
      const renderedArticle = renderArticleDocument(template, article, { related });
      const clientArticle = toClientArticle(article, { includeBody: true, fallbackId: 1 });
      const clientRelated = related.map((item, idx) => toClientArticle(item, { includeBody: false, fallbackId: idx + 1 }));
      return htmlResponse(
        baseResponse,
        injectHydrationPayload(
          renderedArticle,
          { kind: "article", article: clientArticle, related: clientRelated },
          clientArticle.imageUrl,
        ),
        request,
        200,
      );
    }

    if (route.type === "author") {
      const result = await fetchAuthor(sql, route.slug);
      if (!result) {
        return htmlResponse(
          baseResponse,
          renderNotFoundDocument(template, route.path),
          request,
          404,
          { cacheControl: "no-store" },
        );
      }
      const html = renderAuthorDocument(template, {
        pathname: route.path,
        name: route.name,
        jobTitle: route.jobTitle,
        description: route.description,
        avatarUrl: result.author.avatar_url,
        articles: result.articles,
      });
      const clientAuthorArticles = result.articles.map((item, idx) =>
        toClientArticle(item, { includeBody: false, fallbackId: idx + 1, fallbackAuthor: result.author }),
      );
      const totalViews = clientAuthorArticles.reduce((acc, item) => acc + (item.views || 0), 0);
      return htmlResponse(
        baseResponse,
        injectHydrationPayload(html, {
          kind: "author",
          slug: route.slug,
          authorData: {
            id: result.author.id ?? null,
            name: route.name,
            avatarUrl: result.author.avatar_url ?? "",
            slug: route.slug,
            articleCount: clientAuthorArticles.length,
            totalViews,
            articles: clientAuthorArticles,
          },
        }),
        request,
        200,
      );
    }

    const displayName = categoryDisplayName(route.slug);
    const articles = await fetchCategoryArticles(sql, route.slug);
    const html = renderListingDocument(template, {
      pathname: route.path,
      title: displayName,
      description: categoryDescription(route.slug),
      articles,
    });
    const clientCategoryArticles = articles.map((item, idx) =>
      toClientArticle(item, { includeBody: false, fallbackId: idx + 1 }),
    );
    return htmlResponse(
      baseResponse,
      injectHydrationPayload(
        html,
        { kind: "category", slug: route.slug, articles: clientCategoryArticles },
        clientCategoryArticles[0]?.imageUrl,
      ),
      request,
      200,
    );
  } catch {
    console.error("[seo-render] page rendering failed");
    return htmlResponse(
      baseResponse,
      renderUnavailableDocument(template, route.path),
      request,
      503,
      { cacheControl: "no-store", retryAfter: 60 },
    );
  }
}

export async function onRequest(context) {
  return handleSeoRequest(context);
}
