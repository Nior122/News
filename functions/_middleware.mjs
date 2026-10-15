import { neon } from "@neondatabase/serverless";
import { getArticleRedirectTarget, REDIRECTED_ARTICLE_SLUG } from "./lib/article-routing.mjs";
import {
  renderArticleDocument,
  renderAuthorDocument,
  renderCanonicalDocument,
  renderListingDocument,
  renderNotFoundDocument,
  renderUnavailableDocument,
  hasMeaningfulArticleBody,
  SITE_ORIGIN,
} from "./lib/seo-html.mjs";

const CANONICAL_HOST = new URL(SITE_ORIGIN).hostname;
const CATEGORY_NAMES = {
  tech: ["Tech"],
  culture: ["Culture"],
  lifestyle: ["Lifestyle"],
  "ai-tools": ["AI Tools"],
  "phone-tips": ["Phone Tips"],
  productivity: ["Productivity"],
  trending: ["Trending"],
  "ai-productivity": ["AI Tools", "Productivity"],
  "culture-lifestyle": ["Culture", "Lifestyle"],
};
const CATEGORY_LABELS = {
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
const CATEGORY_DESCRIPTIONS = {
  tech: "The latest news, reviews, and insights about technology.",
  culture: "Internet culture, social trends, and what the world is talking about.",
  lifestyle: "Modern living — wellness, work, and the way we spend our time.",
  "ai-tools": "Practical guides, reviews, and news about AI tools you can use today.",
  "phone-tips": "Get more from your smartphone with tips, tricks, and hidden features.",
  productivity: "Work smarter, not harder — tools, habits, and systems that actually work.",
  trending: "The most-read stories on Scrolltek right now.",
  "ai-productivity": "The best of AI Tools and Productivity — tools, tips, and systems that save you hours.",
  "culture-lifestyle": "Culture and Lifestyle stories — how we live, connect, and unwind.",
};
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
    return slug && Object.hasOwn(CATEGORY_NAMES, slug)
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

async function fetchArticle(sql, slug) {
  const rows = await sql`
    SELECT a.slug, a.title, a.subtitle, a.excerpt, a.body, a.category,
           a.image_url, a.published_at, au.name AS author_name
    FROM articles a
    LEFT JOIN authors au ON au.id = a.author_id
    WHERE a.slug = ${slug} AND a.published = true
    LIMIT 1
  `;
  return rows[0] ?? null;
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
      ? { author: { name: profile.name, avatar_url: "" }, articles: [] }
      : null;
  }

  const articles = await sql`
    SELECT slug, title, excerpt
    FROM articles
    WHERE author_id = ${author.id} AND published = true
      AND slug != ${REDIRECTED_ARTICLE_SLUG}
    ORDER BY published_at DESC
    LIMIT 100
  `;
  return { author, articles };
}

async function fetchCategoryArticles(sql, slug) {
  if (slug === "trending") {
    return sql`
      SELECT a.slug, a.title, a.excerpt, a.category, a.published_at
      FROM articles a
      WHERE a.published = true AND a.slug != ${REDIRECTED_ARTICLE_SLUG}
      ORDER BY a.views DESC, a.published_at DESC
      LIMIT 100
    `;
  }

  const names = CATEGORY_NAMES[slug];
  const groups = await Promise.all(names.map((category) => sql`
    SELECT a.slug, a.title, a.excerpt, a.category, a.published_at
    FROM articles a
    WHERE a.published = true AND a.category = ${category}
      AND a.slug != ${REDIRECTED_ARTICLE_SLUG}
    ORDER BY a.published_at DESC
    LIMIT 100
  `));
  const articles = groups.flat();
  const seen = new Set();
  return articles
    .filter((article) => {
      if (seen.has(article.slug)) return false;
      seen.add(article.slug);
      return true;
    })
    .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
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
      return htmlResponse(baseResponse, renderArticleDocument(template, article), request, 200);
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
      return htmlResponse(baseResponse, html, request, 200);
    }

    const displayName = CATEGORY_LABELS[route.slug];
    const articles = await fetchCategoryArticles(sql, route.slug);
    const html = renderListingDocument(template, {
      pathname: route.path,
      title: displayName,
      description: CATEGORY_DESCRIPTIONS[route.slug],
      articles,
    });
    return htmlResponse(baseResponse, html, request, 200);
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
