import { articles, json, formatArticle } from "./_data.js";

export async function onRequestGet({ request }) {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") ?? "1", 10);
  const limit = parseInt(url.searchParams.get("limit") ?? "12", 10);
  const category = url.searchParams.get("category");

  let filtered = articles;
  if (category) {
    filtered = articles.filter(
      (a) => a.category.toLowerCase().replace(/\s+/g, "-") === category.toLowerCase()
    );
  }

  const total = filtered.length;
  const offset = (page - 1) * limit;
  const paged = filtered.slice(offset, offset + limit);

  return json({
    articles: paged.map(formatArticle),
    total,
    page,
    limit,
    hasMore: offset + paged.length < total,
  });
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
