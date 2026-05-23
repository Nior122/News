import { articles, json, formatArticle } from "../_data.js";

export async function onRequestGet({ request }) {
  const url = new URL(request.url);
  const limit = parseInt(url.searchParams.get("limit") ?? "4", 10);

  const picks = articles.filter((a) => a.editorsPick).slice(0, limit);

  return json(picks.map(formatArticle));
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
