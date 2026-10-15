// Permanently consolidated article URLs. The destination is the fuller 2026
// revision; keep the alias out of public listings and the sitemap.
export const ARTICLE_REDIRECTS = Object.freeze({
  "why-ai-phones-are-becoming-the-future": "why-ai-phones-are-the-future-2026",
});

export const REDIRECTED_ARTICLE_SLUG = Object.keys(ARTICLE_REDIRECTS)[0];

export function getArticleRedirectTarget(slug) {
  return Object.hasOwn(ARTICLE_REDIRECTS, slug) ? ARTICLE_REDIRECTS[slug] : null;
}
