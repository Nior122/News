import { articles, json, formatArticle } from "../_data.js";

export async function onRequestGet({ params }) {
  const { slug } = params;
  const article = articles.find((a) => a.slug === slug);

  if (!article) return json({ error: "Article not found" }, 404);

  article.views += 1;

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
