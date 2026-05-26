import { articles, json, formatArticle } from "../_data.js";

export async function onRequestGet({ request }) {
  const url = new URL(request.url);
  const limit = parseInt(url.searchParams.get("limit") ?? "6", 10);

  const sorted = [...articles].sort((a, b) => b.views - a.views).slice(0, limit);

  return json(sorted.map(formatArticle));
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
