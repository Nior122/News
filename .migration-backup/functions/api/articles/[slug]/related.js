import { articles, json, formatArticle } from "../../_data.js";

export async function onRequestGet({ params }) {
  const { slug } = params;
  const current = articles.find((a) => a.slug === slug);

  if (!current) return json([]);

  const related = articles
    .filter((a) => a.slug !== slug && a.category === current.category)
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
    .slice(0, 3);

  return json(related.map(formatArticle));
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
