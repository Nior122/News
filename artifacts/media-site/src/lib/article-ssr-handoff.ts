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
