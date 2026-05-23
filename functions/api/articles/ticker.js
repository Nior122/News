import { articles, json } from "../_data.js";

export async function onRequestGet() {
  const ticker = articles
    .slice()
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
    .slice(0, 10)
    .map(({ id, title, slug }) => ({ id, title, slug }));

  return json(ticker);
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
