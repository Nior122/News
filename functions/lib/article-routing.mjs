// Permanently consolidated article URLs. The destination is the fuller 2026
// revision; keep every alias out of public listings and the sitemap.
export const ARTICLE_REDIRECTS = Object.freeze({
  "why-ai-phones-are-becoming-the-future": "why-ai-phones-are-the-future-2026",
  "ai-smart-glasses-future": "ai-smart-glasses-2026",
});

/** Every alias slug, for excluding retired URLs from queries and the sitemap. */
export const REDIRECTED_ARTICLE_SLUGS = Object.freeze(Object.keys(ARTICLE_REDIRECTS));

export function getArticleRedirectTarget(slug) {
  return Object.hasOwn(ARTICLE_REDIRECTS, slug) ? ARTICLE_REDIRECTS[slug] : null;
}

export function isRedirectedArticleSlug(slug) {
  return Object.hasOwn(ARTICLE_REDIRECTS, slug);
}
