import { articles, json, formatArticle } from "../_data.js";

export async function onRequestGet() {
  const featured = articles.find((a) => a.featured);
  const article = featured ?? articles.sort((a, b) => b.views - a.views)[0];

  if (!article) return json({ error: "No articles found" }, 404);

  return json(formatArticle(article));
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
