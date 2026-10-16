/**
 * Keep a server-rendered article visible until its client route has real data.
 * This is a no-op for client-side navigation and for non-article responses.
 */
export function completeArticleSsrHandoff() {
  if (typeof document === "undefined") return;

  const prerender = document.getElementById("seo-prerender");
  if (prerender?.dataset.pending === "true") {
    prerender.remove();
  }
}

/**
 * Drop the homepage's server-rendered listing once React has mounted its own.
 *
 * The shell hides `#seo-prerender[data-ssr="home"]` as soon as JS runs, so the
 * markup is already invisible by the time this runs; removing it keeps only one
 * copy of the homepage in the document.
 */
export function clearSeoPrerender() {
  if (typeof document === "undefined") return;

  document.getElementById("seo-prerender")?.remove();
}
