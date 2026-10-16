import { getArticleRedirectTarget } from "./article-routing.mjs";

export const SITE_ORIGIN = "https://scrolltek.name.ng";
const SITE_NAME = "Scrolltek";
const SITE_LOGO = `${SITE_ORIGIN}/favicon.svg`;
const CANONICAL_HOSTNAME = new URL(SITE_ORIGIN).hostname;

const ALLOWED_TAGS = new Set([
  "a", "b", "blockquote", "br", "code", "del", "div", "em", "figcaption",
  "figure", "h2", "h3", "h4", "hr", "i", "img", "li", "mark", "ol", "p",
  "pre", "s", "span", "strong", "sub", "sup", "table", "tbody", "td", "th",
  "thead", "tr", "u", "ul",
]);
const VOID_TAGS = new Set(["br", "hr", "img"]);
const BLOCKED_TAGS = "script|style|iframe|object|embed|svg|math|template|noscript";

export function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeTextPreservingEntities(value) {
  return String(value ?? "")
    .replace(/&(?!(?:#(?:x[\da-f]+|\d+)|[a-z][\da-z]+);)/gi, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function readAttribute(attributes, name) {
  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = String(attributes).match(
    new RegExp(`(?:^|\\s)${escapedName}\\s*=\\s*(?:\"([^\"]*)\"|'([^']*)'|([^\\s\"'=<>\x60]+))`, "i"),
  );
  return match ? (match[1] ?? match[2] ?? match[3] ?? "") : null;
}

function decodeAttributeEntities(value) {
  return String(value).replace(/&(#x[\da-f]+|#\d+|amp|lt|gt|quot|apos|colon|nbsp);/gi, (entity, code) => {
    if (code[0] === "#") {
      const numeric = code[1].toLowerCase() === "x"
        ? Number.parseInt(code.slice(2), 16)
        : Number.parseInt(code.slice(1), 10);
      if (!Number.isFinite(numeric) || numeric <= 0 || numeric > 0x10ffff || (numeric >= 0xd800 && numeric <= 0xdfff)) {
        return "�";
      }
      return String.fromCodePoint(numeric);
    }
    const named = {
      amp: "&", lt: "<", gt: ">", quot: "\"", apos: "'", colon: ":", nbsp: " ",
    };
    return named[code.toLowerCase()] ?? entity;
  });
}

function safeUrl(value, { allowMailto = false } = {}) {
  if (!value) return null;
  const decoded = decodeAttributeEntities(value).trim();
  if (!decoded || /[\u0000-\u001f\u007f]/.test(decoded)) return null;

  try {
    const parsed = new URL(decoded, `${SITE_ORIGIN}/`);
    if (parsed.username || parsed.password) return null;
    const allowed = allowMailto
      ? new Set(["http:", "https:", "mailto:"])
      : new Set(["http:", "https:"]);
    if (!allowed.has(parsed.protocol)) return null;
    return parsed.href;
  } catch {
    return null;
  }
}

/**
 * Points internal links at retired article aliases to their canonical revision.
 *
 * Stored bodies are left untouched; only the rendered copy is rewritten, so a
 * stored row that still links to an old slug does not publish an internal link
 * that bounces through a 301. Non-internal and third-party URLs are untouched.
 */
function canonicalizeArticleHref(absoluteHref) {
  let parsed;
  try {
    parsed = new URL(absoluteHref);
  } catch {
    return absoluteHref;
  }

  const host = parsed.hostname.toLowerCase();
  if (host !== CANONICAL_HOSTNAME && host !== `www.${CANONICAL_HOSTNAME}`) return absoluteHref;

  const match = parsed.pathname.match(/^\/article\/([^/]+)$/);
  if (!match) return absoluteHref;

  let slug;
  try {
    slug = decodeURIComponent(match[1]);
  } catch {
    return absoluteHref;
  }

  const target = getArticleRedirectTarget(slug);
  if (!target) return absoluteHref;
  // Query and fragment survive so deep links into the canonical revision work.
  return `${SITE_ORIGIN}/article/${encodeURIComponent(target)}${parsed.search}${parsed.hash}`;
}

function safeAttributes(tagName, attributes) {
  if (tagName === "a") {
    const safeHref = safeUrl(readAttribute(attributes, "href"), { allowMailto: true });
    const href = safeHref ? canonicalizeArticleHref(safeHref) : null;
    const title = readAttribute(attributes, "title");
    const target = readAttribute(attributes, "target");
    const output = [];
    if (href) output.push(`href="${escapeHtml(href)}"`);
    if (title) output.push(`title="${escapeHtml(decodeAttributeEntities(title))}"`);
    if (target === "_blank") {
      output.push('target="_blank"', 'rel="noopener noreferrer"');
    }
    return output.length ? ` ${output.join(" ")}` : "";
  }

  if (tagName === "img") {
    const src = safeUrl(readAttribute(attributes, "src"));
    if (!src) return null;
    const output = [`src="${escapeHtml(src)}"`];
    const alt = readAttribute(attributes, "alt");
    const title = readAttribute(attributes, "title");
    const width = readAttribute(attributes, "width");
    const height = readAttribute(attributes, "height");
    if (alt !== null) output.push(`alt="${escapeHtml(decodeAttributeEntities(alt))}"`);
    if (title) output.push(`title="${escapeHtml(decodeAttributeEntities(title))}"`);
    if (width && /^\d{1,4}$/.test(width)) output.push(`width="${width}"`);
    if (height && /^\d{1,4}$/.test(height)) output.push(`height="${height}"`);
    output.push('loading="lazy"', 'decoding="async"');
    return ` ${output.join(" ")}`;
  }

  if (tagName === "td" || tagName === "th") {
    const output = [];
    for (const name of ["colspan", "rowspan"]) {
      const value = readAttribute(attributes, name);
      if (value && /^\d{1,2}$/.test(value) && Number(value) > 0) {
        output.push(`${name}="${value}"`);
      }
    }
    return output.length ? ` ${output.join(" ")}` : "";
  }

  return "";
}

/**
 * Conservative allow-list sanitizer for article HTML emitted in public
 * responses. Both server-rendered markup and hydrated clients insert the body
 * into the DOM, so stored HTML must be reduced to safe tags and attributes.
 */
export function sanitizeArticleHtml(input) {
  let source = String(input ?? "");
  const blockedContent = new RegExp(`<\\s*(${BLOCKED_TAGS})\\b[^>]*>[\\s\\S]*?(?:<\\s*\\/\\s*\\1\\s*>|$)`, "gi");
  source = source.replace(blockedContent, "");

  const tokenPattern = /<!--[\s\S]*?-->|<![^>]*>|<[^>]*>/g;
  let cursor = 0;
  let output = "";
  let token;

  while ((token = tokenPattern.exec(source)) !== null) {
    output += escapeTextPreservingEntities(source.slice(cursor, token.index));
    cursor = tokenPattern.lastIndex;

    const rawTag = token[0];
    if (rawTag.startsWith("<!--") || /^<!/i.test(rawTag)) continue;

    const parsed = rawTag.match(/^<\s*(\/?)\s*([a-z][a-z\d:-]*)\b([\s\S]*?)>$/i);
    if (!parsed) {
      output += escapeHtml(rawTag);
      continue;
    }

    const isClosing = Boolean(parsed[1]);
    const tagName = parsed[2].toLowerCase();
    if (!ALLOWED_TAGS.has(tagName)) continue;

    if (isClosing) {
      if (!VOID_TAGS.has(tagName)) output += `</${tagName}>`;
      continue;
    }

    const attributes = parsed[3].replace(/\/\s*$/, "");
    const safe = safeAttributes(tagName, attributes);
    if (safe === null) continue;
    output += `<${tagName}${safe}>`;
  }

  output += escapeTextPreservingEntities(source.slice(cursor));
  return output;
}

export function hasMeaningfulArticleBody(input) {
  const safeBody = sanitizeArticleHtml(input);
  const text = safeBody
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;|&#160;|&#xA0;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > 0 || /<img\b/i.test(safeBody);
}

export function canonicalUrlForPath(pathname) {
  let path = String(pathname || "/").split(/[?#]/, 1)[0];
  if (!path.startsWith("/")) path = `/${path}`;
  path = path.replace(/\/{2,}/g, "/");
  if (path.length > 1) path = path.replace(/\/+$/, "");
  return `${SITE_ORIGIN}${path}`;
}

function findElementBounds(html, elementName) {
  const opening = new RegExp(`<${elementName}\\b[^>]*>`, "i").exec(html);
  if (!opening) return null;

  const contentStart = opening.index + opening[0].length;
  const tokenMatcher = /<!--|<\/?([a-z][a-z\d:-]*)\b[^>]*>/ig;
  tokenMatcher.lastIndex = contentStart;

  let token;
  while ((token = tokenMatcher.exec(html)) !== null) {
    if (token[0] === "<!--") {
      const commentEnd = html.indexOf("-->", tokenMatcher.lastIndex);
      if (commentEnd < 0) return null;
      tokenMatcher.lastIndex = commentEnd + 3;
      continue;
    }

    const tagName = token[1].toLowerCase();
    const isClosingTag = /^<\s*\//.test(token[0]);
    if (isClosingTag && tagName === elementName) {
      return { contentStart, contentEnd: token.index };
    }

    if (!isClosingTag && ["script", "style", "noscript", "template"].includes(tagName)) {
      const closingTag = new RegExp(`<\\/\\s*${tagName}\\s*>`, "ig");
      closingTag.lastIndex = tokenMatcher.lastIndex;
      const closingMatch = closingTag.exec(html);
      if (!closingMatch) return null;
      tokenMatcher.lastIndex = closingTag.lastIndex;
    }
  }

  return null;
}

function transformElementContent(html, elementName, transformText, transformRaw = (block) => block) {
  const bounds = findElementBounds(html, elementName);
  if (!bounds) return html;

  const content = html.slice(bounds.contentStart, bounds.contentEnd);
  const rawBlockMatcher = /<!--[\s\S]*?-->|<(script|style|noscript|template)\b[^>]*>[\s\S]*?<\/\1\s*>/gi;
  let cursor = 0;
  let output = "";

  for (const match of content.matchAll(rawBlockMatcher)) {
    const start = match.index ?? 0;
    output += transformText(content.slice(cursor, start));
    output += match[1]
      ? transformRaw(match[0], match[1].toLowerCase())
      : match[0];
    cursor = start + match[0].length;
  }
  output += transformText(content.slice(cursor));

  return html.slice(0, bounds.contentStart) + output + html.slice(bounds.contentEnd);
}

function transformHeadContent(html, transformText, transformRaw) {
  return transformElementContent(html, "head", transformText, transformRaw);
}

function appendElementContent(html, elementName, content) {
  const bounds = findElementBounds(html, elementName);
  if (!bounds) return html;
  return html.slice(0, bounds.contentEnd) + `${content}\n` + html.slice(bounds.contentEnd);
}

function appendHeadContent(html, content) {
  return appendElementContent(html, "head", content);
}

function setHeadTag(html, matcher, replacement) {
  const flags = `${matcher.flags.replace(/g/g, "")}g`;
  const globalMatcher = new RegExp(matcher.source, flags);
  let found = false;
  const updated = transformHeadContent(html, (content) => content.replace(globalMatcher, () => {
    if (found) return "";
    found = true;
    return replacement;
  }));
  return found ? updated : appendHeadContent(updated, replacement);
}

function removeHeadTag(html, matcher) {
  return transformHeadContent(html, (content) => content.replace(matcher, ""));
}

function setMeta(html, attribute, key, content) {
  const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const matcher = new RegExp(`<meta\\s+${attribute}=[\"']${escapedKey}[\"'][^>]*>`, "i");
  const tag = `<meta ${attribute}="${escapeHtml(key)}" content="${escapeHtml(content)}" />`;
  return setHeadTag(html, matcher, tag);
}

function removeMeta(html, attribute, key) {
  const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const matcher = new RegExp(`<meta\\s+${attribute}=[\"']${escapedKey}[\"'][^>]*>`, "gi");
  return removeHeadTag(html, matcher);
}

function setCanonical(html, canonical) {
  const matcher = /<link\s+rel=["']canonical["'][^>]*>/i;
  if (!canonical) return removeHeadTag(html, /<link\s+rel=["']canonical["'][^>]*>/gi);
  const tag = `<link rel="canonical" href="${escapeHtml(canonical)}" />`;
  return setHeadTag(html, matcher, tag);
}

function scriptIdFromBlock(block) {
  const openingTag = block.slice(0, block.indexOf(">") + 1);
  return readAttribute(openingTag, "id");
}

function setJsonLd(html, data) {
  if (!data) {
    return transformHeadContent(html, (content) => content, (block, tagName) => {
      const id = tagName === "script" ? scriptIdFromBlock(block) : null;
      return id && /^(?:article|author|page)-jsonld$/.test(id) ? "" : block;
    });
  }

  const schemaType = data["@type"];
  const authorUrl = typeof data.url === "string" && data.url.startsWith(`${SITE_ORIGIN}/author/`);
  const scriptId = schemaType === "NewsArticle"
    ? "article-jsonld"
    : schemaType === "Person" || (schemaType === "Organization" && authorUrl)
      ? "author-jsonld"
      : schemaType === "WebSite"
        ? "website-jsonld"
        : "page-jsonld";
  const serialized = JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
  const tag = `<script type="application/ld+json" id="${scriptId}">${serialized}</script>`;
  let found = false;
  const updated = transformHeadContent(html, (content) => content, (block, tagName) => {
    if (tagName !== "script" || scriptIdFromBlock(block) !== scriptId) return block;
    if (found) return "";
    found = true;
    return tag;
  });
  return found ? updated : appendHeadContent(updated, tag);
}

function insertBody(html, bodyHtml) {
  let rootFound = false;
  const updated = transformElementContent(html, "body", (content) => {
    if (rootFound) return content;
    return content.replace(/<div\s+id=["']root["']\s*>\s*<\/div>/i, () => {
      rootFound = true;
      return `<div id="root">${bodyHtml}</div>`;
    });
  });
  if (rootFound) return updated;

  const appended = appendElementContent(updated, "body", bodyHtml);
  return appended === updated ? `${updated}${bodyHtml}` : appended;
}

function insertArticlePrerender(html, bodyHtml) {
  const prerender = `<div id="seo-prerender" data-pending="true">${bodyHtml}</div>`;
  let inserted = false;
  const updated = transformElementContent(html, "body", (content) => {
    if (inserted) return content;

    const prerenderMarker = /<div\s+id=["']seo-prerender["']\s*>\s*<\/div>/i;
    if (prerenderMarker.test(content)) {
      inserted = true;
      return content.replace(prerenderMarker, prerender);
    }

    return content.replace(/<div\s+id=["']root["']\s*>\s*<\/div>/i, (root) => {
      inserted = true;
      return `${prerender}${root}`;
    });
  });
  if (inserted) return updated;

  const appended = appendElementContent(updated, "body", prerender);
  return appended === updated ? `${updated}${prerender}` : appended;
}

function removeHomepageFallback(html) {
  return transformElementContent(html, "body", (content) => content, (block, tagName) => {
    if (tagName !== "noscript") return block;
    const openingTag = block.slice(0, block.indexOf(">") + 1);
    return readAttribute(openingTag, "id") === "homepage-fallback" ? "" : block;
  });
}

/** Injects route-specific metadata and optional pre-rendered content. */
export function renderPageDocument(template, page) {
  let html = String(template ?? "");
  if (page.removeHomepageFallback || (page.bodyHtml !== undefined && page.canonical !== `${SITE_ORIGIN}/`)) {
    html = removeHomepageFallback(html);
  }

  if (page.title !== undefined) {
    const title = `<title>${escapeHtml(page.title)}</title>`;
    html = setHeadTag(html, /<title\b[^>]*>[\s\S]*?<\/title>/i, title);
  }
  if (page.description !== undefined) {
    html = setMeta(html, "name", "description", page.description);
    html = setMeta(html, "property", "og:description", page.description);
    html = setMeta(html, "name", "twitter:description", page.description);
  }
  if (page.ogTitle !== undefined || page.title !== undefined) {
    const value = page.ogTitle ?? page.title;
    html = setMeta(html, "property", "og:title", value);
    html = setMeta(html, "name", "twitter:title", value);
  }
  if (page.ogType !== undefined) html = setMeta(html, "property", "og:type", page.ogType);
  if (page.canonical !== undefined) {
    html = setCanonical(html, page.canonical);
    // canonical, og:url and twitter:url must agree or social crawlers and
    // search engines attribute the page to different URLs.
    if (page.canonical) {
      html = setMeta(html, "property", "og:url", page.canonical);
      html = setMeta(html, "name", "twitter:url", page.canonical);
    } else {
      html = removeMeta(html, "property", "og:url");
      html = removeMeta(html, "name", "twitter:url");
    }
  }
  if (page.robots !== undefined) html = setMeta(html, "name", "robots", page.robots);
  if (Object.hasOwn(page, "ogImage")) {
    if (page.ogImage) {
      html = setMeta(html, "property", "og:image", page.ogImage);
      html = setMeta(html, "name", "twitter:image", page.ogImage);
      html = setMeta(html, "name", "twitter:card", "summary_large_image");
    } else {
      html = removeMeta(html, "property", "og:image");
      html = removeMeta(html, "name", "twitter:image");
      html = setMeta(html, "name", "twitter:card", "summary");
    }
  }
  if (Object.hasOwn(page, "jsonLd")) html = setJsonLd(html, page.jsonLd);
  if (page.bodyHtml !== undefined) {
    html = page.retainPrerenderUntilClientReady
      ? insertArticlePrerender(html, page.bodyHtml)
      : insertBody(html, page.bodyHtml);
  }

  return html;
}

export function renderCanonicalDocument(template, pathname, { robots, title, description, heading, bodyHtml } = {}) {
  const canonical = canonicalUrlForPath(pathname);
  const routeBody = bodyHtml !== undefined
    ? bodyHtml
    : heading
      ? `<main id="ssr"><h1>${escapeHtml(heading)}</h1>${description ? `<p>${escapeHtml(description)}</p>` : ""}</main>`
      : undefined;
  return renderPageDocument(template, {
    canonical,
    ...(robots ? { robots } : {}),
    ...(title ? { title } : {}),
    ...(description ? { description } : {}),
    ...(routeBody !== undefined ? { bodyHtml: routeBody } : {}),
    removeHomepageFallback: canonical !== `${SITE_ORIGIN}/`,
  });
}

/** Upper bound for server-rendered related-article links. */
export const MAX_RELATED_LINKS = 4;

function articleLinkMarkup(article, { heading = "h3" } = {}) {
  const slug = encodeURIComponent(article.slug);
  const excerpt = String(article.excerpt ?? "").trim();
  return `<li><article><${heading}><a href="/article/${escapeHtml(slug)}">${escapeHtml(article.title)}</a></${heading}>${excerpt ? `<p>${escapeHtml(excerpt)}</p>` : ""}</article></li>`;
}

function usableArticle(article) {
  return Boolean(article) && String(article.slug ?? "").trim() !== "" && String(article.title ?? "").trim() !== "";
}

/** Related-reading block: three or four crawlable links, or nothing at all. */
function relatedArticleMarkup(related, excludeSlug) {
  const links = (Array.isArray(related) ? related : [])
    .filter(usableArticle)
    .filter((article) => String(article.slug).trim() !== String(excludeSlug ?? "").trim())
    .slice(0, MAX_RELATED_LINKS)
    .map((article) => articleLinkMarkup(article))
    .join("");
  if (!links) return "";
  return `<aside aria-label="Related articles"><h2>Related reading</h2><ul>${links}</ul></aside>`;
}

/**
 * Server-renders the homepage: a link to every category page plus every
 * published article title grouped under its category with an excerpt. The
 * markup is written into the shell's body rather than the article prerender
 * slot, because only the article route clears that slot — a pending prerender
 * on "/" would hide #root for JavaScript visitors permanently.
 */
export function renderHomepageDocument(template, {
  pathname = "/",
  title,
  heading,
  description,
  categories = [],
  sections = [],
}) {
  const categoryLinks = (Array.isArray(categories) ? categories : [])
    .filter((category) => usableArticle({ slug: category?.slug, title: category?.name }))
    .map((category) => `<li><a href="/category/${escapeHtml(encodeURIComponent(String(category.slug).trim()))}">${escapeHtml(category.name)}</a></li>`)
    .join("");

  const sectionMarkup = (Array.isArray(sections) ? sections : [])
    .map((section) => {
      const articles = (section.articles ?? []).filter(usableArticle);
      if (articles.length === 0) return "";
      const name = String(section.name ?? section.slug ?? "").trim();
      const slug = String(section.slug ?? "").trim();
      // A category with no route handler still gets its titles listed, just
      // without a link that would 404.
      const title = slug
        ? `<h2><a href="/category/${escapeHtml(encodeURIComponent(slug))}">${escapeHtml(name)}</a></h2>`
        : `<h2>${escapeHtml(name)}</h2>`;
      return `<section aria-label="${escapeHtml(name)}">${title}<ul>${articles.map((article) => articleLinkMarkup(article)).join("")}</ul></section>`;
    })
    .join("");

  const bodyHtml = `<main id="ssr"><h1>${escapeHtml(heading)}</h1>${description ? `<p>${escapeHtml(description)}</p>` : ""}${categoryLinks ? `<nav aria-label="Browse categories"><ul>${categoryLinks}</ul></nav>` : ""}${sectionMarkup}</main>`;

  return renderPageDocument(template, {
    // The document title and the on-page <h1> are different strings: the title
    // carries the keyword-rich variant, the heading is the short brand name.
    title: title ?? heading,
    ...(description ? { description } : {}),
    canonical: canonicalUrlForPath(pathname),
    bodyHtml,
    // The shell's hardcoded <noscript> homepage list is stale by definition;
    // drop it so no-JS visitors get the freshly rendered listing instead.
    removeHomepageFallback: true,
  });
}

export function renderArticleDocument(template, article, { related = [] } = {}) {
  const articlePath = `/article/${encodeURIComponent(article.slug)}`;
  const canonical = canonicalUrlForPath(articlePath);
  const title = `${article.title} — ${SITE_NAME}`;
  const body = sanitizeArticleHtml(article.body || "");
  const bodyText = body.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  const description = String(article.excerpt || "").trim() || bodyText.slice(0, 180) || article.title;
  const image = article.image_url ? safeUrl(article.image_url) : null;
  const articleDate = article.published_at ? new Date(article.published_at) : null;
  const datePublished = articleDate && !Number.isNaN(articleDate.getTime())
    ? articleDate.toISOString()
    : undefined;
  const authorName = String(article.author_name || "").trim();
  const categoryName = String(article.category || "").trim();
  const categorySlug = categoryName.toLowerCase().replace(/\s+/g, "-");
  const categoryMarkup = categoryName
    ? `<a href="/category/${escapeHtml(encodeURIComponent(categorySlug))}">${escapeHtml(categoryName)}</a>`
    : "";
  const authorMarkup = authorName ? `<p>By ${escapeHtml(authorName)}</p>` : "";
  const imageMarkup = image
    ? `<figure><img src="${escapeHtml(image)}" alt="${escapeHtml(article.title)}" loading="lazy" decoding="async"></figure>`
    : "";
  const bodyMarkup = body ? `<div class="ssr-article-body">${body}</div>` : "";
  const relatedMarkup = relatedArticleMarkup(related, article.slug);
  const bodyHtml = `<main id="ssr"><article><header>${categoryMarkup ? `<p>${categoryMarkup}</p>` : ""}<h1>${escapeHtml(article.title)}</h1>${article.subtitle ? `<h2>${escapeHtml(article.subtitle)}</h2>` : ""}${article.excerpt ? `<p>${escapeHtml(article.excerpt)}</p>` : ""}${authorMarkup}${datePublished ? `<time datetime="${escapeHtml(datePublished)}">${escapeHtml(new Date(datePublished).toLocaleDateString("en", { dateStyle: "long", timeZone: "UTC" }))}</time>` : ""}</header>${imageMarkup}${bodyMarkup}</article>${relatedMarkup}</main>`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description,
    ...(image ? { image: [{ "@type": "ImageObject", url: image }] } : {}),
    ...(datePublished ? { datePublished } : {}),
    mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
    url: canonical,
    ...(authorName
      ? { author: { "@type": authorName === "Scrolltek Editorial" ? "Organization" : "Person", name: authorName } }
      : {}),
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_ORIGIN,
      logo: { "@type": "ImageObject", url: SITE_LOGO },
    },
    articleSection: article.category || undefined,
  };

  return renderPageDocument(template, {
    title,
    description,
    canonical,
    ogTitle: title,
    ogType: "article",
    ogImage: image,
    jsonLd,
    bodyHtml,
    retainPrerenderUntilClientReady: true,
  });
}

export function renderListingDocument(template, { pathname, title, description, articles }) {
  const links = articles.map((article) => {
    const slug = encodeURIComponent(article.slug);
    return `<li><article><h2><a href="/article/${escapeHtml(slug)}">${escapeHtml(article.title)}</a></h2>${article.excerpt ? `<p>${escapeHtml(article.excerpt)}</p>` : ""}</article></li>`;
  }).join("");
  const bodyHtml = `<main id="ssr"><h1>${escapeHtml(title)}</h1><p>${escapeHtml(description)}</p><ul>${links}</ul></main>`;
  return renderPageDocument(template, {
    title: `${title} — ${SITE_NAME}`,
    description,
    canonical: canonicalUrlForPath(pathname),
    bodyHtml,
  });
}

export function renderAuthorDocument(template, { pathname, name, jobTitle, description, avatarUrl, articles }) {
  const canonical = canonicalUrlForPath(pathname);
  const image = avatarUrl ? safeUrl(avatarUrl) : null;
  const articleLinks = articles.map((article) => {
    const slug = encodeURIComponent(article.slug);
    return `<li><article><h2><a href="/article/${escapeHtml(slug)}">${escapeHtml(article.title)}</a></h2>${article.excerpt ? `<p>${escapeHtml(article.excerpt)}</p>` : ""}</article></li>`;
  }).join("");
  const imageMarkup = image
    ? `<img src="${escapeHtml(image)}" alt="${escapeHtml(name)}" loading="lazy" decoding="async">`
    : "";
  const bodyHtml = `<main id="ssr"><header>${imageMarkup}<h1>${escapeHtml(name)}</h1><p>${escapeHtml(jobTitle)}</p><p>${escapeHtml(description)}</p></header><h2>Articles by ${escapeHtml(name)}</h2><ul>${articleLinks}</ul></main>`;
  const isEditorialTeam = name === "Scrolltek Editorial";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": isEditorialTeam ? "Organization" : "Person",
    name,
    ...(!isEditorialTeam ? { jobTitle } : {}),
    description,
    url: canonical,
    ...(image ? { image } : {}),
    ...(!isEditorialTeam ? { worksFor: { "@type": "Organization", name: SITE_NAME, url: SITE_ORIGIN } } : {}),
  };

  return renderPageDocument(template, {
    title: `${name} — ${SITE_NAME}`,
    description: `${description} Read all articles by ${name} on ${SITE_NAME}.`,
    canonical,
    ...(image ? { ogImage: image } : {}),
    jsonLd,
    bodyHtml,
  });
}

export function renderNotFoundDocument(template, pathname) {
  const visiblePath = escapeHtml(pathname || "/");
  const bodyHtml = `<main id="ssr"><h1>Page not found</h1><p>We couldn't find a page at ${visiblePath}.</p><p><a href="/">Return to Scrolltek</a></p></main>`;
  return renderPageDocument(template, {
    title: `Page Not Found — ${SITE_NAME}`,
    description: "The requested Scrolltek page could not be found.",
    canonical: null,
    robots: "noindex, follow",
    ogTitle: `Page Not Found — ${SITE_NAME}`,
    ogType: "website",
    ogImage: null,
    jsonLd: null,
    bodyHtml,
  });
}

export function renderUnavailableDocument(template, pathname) {
  const title = `Temporarily Unavailable — ${SITE_NAME}`;
  const description = "This Scrolltek page is temporarily unavailable. Please try again shortly.";
  const bodyHtml = `<main id="ssr"><h1>Page temporarily unavailable</h1><p>Please try again shortly.</p><p><a href="${escapeHtml(canonicalUrlForPath(pathname))}">Retry</a></p></main>`;
  return renderPageDocument(template, {
    title,
    description,
    canonical: null,
    robots: "noindex, follow",
    ogTitle: title,
    ogType: "website",
    ogImage: null,
    bodyHtml,
  });
}
