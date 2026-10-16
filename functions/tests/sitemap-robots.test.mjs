import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  buildSitemapXml,
  createSitemapHandler,
} from "../sitemap.xml.mjs";
import { onRequest as robotsRequest } from "../robots.txt.mjs";

const ORIGIN = "https://scrolltek.name.ng";

function sitemapLocations(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
}

function sitemapEntries(xml) {
  return [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(([, block]) => ({
    loc: /<loc>([^<]+)<\/loc>/.exec(block)?.[1] ?? "",
    lastmod: /<lastmod>([^<]+)<\/lastmod>/.exec(block)?.[1] ?? null,
  }));
}

function publishedArticle(slug, { published = true, body = "<p>Published body</p>", published_at = null } = {}) {
  return { slug, published, body, published_at };
}

test("sitemap is canonical, duplicate-free, published-only, and covers static pages plus valid categories", () => {
  const categories = [
    { slug: "tech" },
    { slug: "culture" },
    { slug: "tech" },
    { slug: "phone-tips" },
    { slug: "not-a-route" },
    { slug: "bad/slug" },
    { slug: "" },
    { slug: null },
  ];
  const xml = buildSitemapXml(
    [
      publishedArticle("visible-story"),
      publishedArticle("visible-story"),
      publishedArticle("why-ai-phones-are-becoming-the-future"),
      publishedArticle("why-ai-phones-are-the-future-2026"),
      publishedArticle("ai-smart-glasses-future"),
      publishedArticle("ai-smart-glasses-2026"),
      publishedArticle("draft-story", { published: false }),
      publishedArticle("unsafe/story"),
      publishedArticle("."),
      publishedArticle(".."),
      publishedArticle("query?param"),
      publishedArticle("story & tips"),
      publishedArticle("quote's story"),
      publishedArticle("empty-body", { body: "  " }),
      publishedArticle("executable-only", { body: "<script>alert(1)</script>" }),
    ],
    categories,
  );
  const locations = sitemapLocations(xml);

  assert.equal(locations.length, new Set(locations).size, "no duplicate URLs");
  assert.equal(locations.filter((location) => location.startsWith(`${ORIGIN}/`)).length, locations.length);

  // Canonical indexable static pages only.
  for (const path of ["/", "/about", "/contact", "/privacy"]) {
    assert.ok(locations.includes(`${ORIGIN}${path}`), `includes ${path}`);
  }
  assert.ok(!locations.some((location) => /\/search|\/admin/.test(location)));

  // Categories come from the categories table, limited to slugs that render.
  assert.ok(locations.includes(`${ORIGIN}/category/tech`));
  assert.ok(locations.includes(`${ORIGIN}/category/culture`));
  // A valid category with no published articles is still a real page.
  assert.ok(locations.includes(`${ORIGIN}/category/phone-tips`));
  assert.ok(!locations.includes(`${ORIGIN}/category/not-a-route`));
  assert.ok(!locations.some((location) => location.includes("bad/slug")));

  // Both retired aliases stay out; their canonical revisions stay in.
  assert.ok(locations.includes(`${ORIGIN}/article/why-ai-phones-are-the-future-2026`));
  assert.ok(locations.includes(`${ORIGIN}/article/ai-smart-glasses-2026`));
  assert.ok(!locations.includes(`${ORIGIN}/article/why-ai-phones-are-becoming-the-future`));
  assert.ok(!locations.includes(`${ORIGIN}/article/ai-smart-glasses-future`));

  assert.ok(locations.includes(`${ORIGIN}/article/visible-story`));
  assert.ok(locations.includes(`${ORIGIN}/article/story%20%26%20tips`));
  assert.ok(locations.includes(`${ORIGIN}/article/quote&apos;s%20story`));
  assert.ok(!xml.includes("draft-story"));
  assert.ok(!xml.includes("unsafe/story"));
  assert.ok(!xml.includes("/article/."));
  assert.ok(!xml.includes("/article/.."));
  assert.ok(!xml.includes("query?param"));
  assert.ok(!locations.includes(`${ORIGIN}/article/empty-body`));
  assert.ok(!locations.includes(`${ORIGIN}/article/executable-only`));
  assert.doesNotMatch(xml, /www\.scrolltek|pages\.dev|scrolltek\.com/i);

  // 4 static + 3 categories (tech, culture, phone-tips) + 5 published articles.
  assert.equal(locations.length, 12);
});

test("sitemap lastmod uses real publication dates and is omitted rather than fabricated", () => {
  const xml = buildSitemapXml(
    [
      publishedArticle("dated-story", { published_at: "2026-05-28T09:00:00.000Z" }),
      publishedArticle("dateless-story"),
      publishedArticle("broken-date-story", { published_at: "not-a-date" }),
      publishedArticle("date-object-story", { published_at: new Date("2026-01-02T03:04:05.000Z") }),
    ],
    [{ slug: "tech" }],
  );
  const entries = Object.fromEntries(sitemapEntries(xml).map((entry) => [entry.loc, entry.lastmod]));

  assert.equal(entries[`${ORIGIN}/article/dated-story`], "2026-05-28T09:00:00.000Z");
  assert.equal(entries[`${ORIGIN}/article/date-object-story`], "2026-01-02T03:04:05.000Z");
  assert.equal(entries[`${ORIGIN}/article/dateless-story`], null);
  assert.equal(entries[`${ORIGIN}/article/broken-date-story`], null);
  assert.equal(entries[`${ORIGIN}/`], null);
  assert.equal(entries[`${ORIGIN}/category/tech`], null);
  assert.doesNotMatch(xml, /<lastmod>\s*<\/lastmod>/);
});

test("sitemap handler is read-only and emits only URLs returned by the published query", async () => {
  const queries = [];
  const fixtureSql = async (strings) => {
    const query = strings.join(" ");
    queries.push(query);
    if (query.includes("FROM categories")) {
      return [{ slug: "tech" }, { slug: "phone-tips" }];
    }
    return [
      { slug: "public-story", published: true, title: "Public Story", body: "<p>Published body</p>", published_at: "2026-03-04T05:06:07.000Z" },
      { slug: "private-draft", published: false, title: "Private Draft", body: "<p>Draft body</p>", published_at: null },
      { slug: "executable-story", published: true, title: "Incomplete Story", body: "<script>alert(1)</script>", published_at: null },
      { slug: "ai-smart-glasses-future", published: true, title: "Retired Alias", body: "<p>Old revision</p>", published_at: null },
    ];
  };
  const handler = createSitemapHandler({ databaseFactory: () => fixtureSql });
  const response = await handler({ env: { DATABASE_URL: "local-test-placeholder" } });
  const body = await response.text();

  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type"), /application\/xml/i);
  assert.match(body, /https:\/\/scrolltek\.name\.ng\/article\/public-story/);
  assert.match(body, /<lastmod>2026-03-04T05:06:07\.000Z<\/lastmod>/);
  assert.match(body, /https:\/\/scrolltek\.name\.ng\/category\/tech/);
  assert.match(body, /https:\/\/scrolltek\.name\.ng\/category\/phone-tips/);
  assert.doesNotMatch(body, /private-draft|executable-story|ai-smart-glasses-future/);

  assert.equal(queries.length, 2);
  assert.ok(queries.some((query) => /SELECT slug FROM categories/.test(query)));
  const articleQuery = queries.find((query) => /FROM articles/.test(query));
  assert.match(articleQuery, /SELECT slug, published, body, published_at/);
  assert.match(articleQuery, /WHERE published = true/);
  assert.match(articleQuery, /BTRIM\(COALESCE\(title, ''\)\) <> ''/);
  assert.match(articleQuery, /BTRIM\(COALESCE\(body, ''\)\) <> ''/);
  assert.doesNotMatch(queries.join(" "), /INSERT|UPDATE|DELETE|CREATE|ALTER|DROP/i);
});

test("sitemap errors stay generic and robots.txt advertises the canonical sitemap", async () => {
  const handler = createSitemapHandler({
    databaseFactory: () => async () => {
      throw new Error("private database detail");
    },
  });
  const oldConsoleError = console.error;
  console.error = () => {};
  let errorResponse;
  try {
    errorResponse = await handler({ env: { DATABASE_URL: "local-test-placeholder" } });
  } finally {
    console.error = oldConsoleError;
  }
  const errorBody = await errorResponse.text();
  const robotsResponse = await robotsRequest();
  const robotsBody = await robotsResponse.text();

  assert.equal(errorResponse.status, 503);
  assert.doesNotMatch(errorBody, /private database detail|DATABASE_URL|password/i);
  assert.equal(robotsResponse.status, 200);
  assert.equal(
    robotsBody,
    "User-agent: *\nAllow: /\n\nSitemap: https://scrolltek.name.ng/sitemap.xml",
  );
  assert.doesNotMatch(robotsBody, /www\.scrolltek|pages\.dev|scrolltek\.com|Disallow:\s*\/admin/i);

  const staticRobots = await readFile(new URL("../../artifacts/media-site/public/robots.txt", import.meta.url), "utf8");
  assert.match(staticRobots, /Sitemap: https:\/\/scrolltek\.name\.ng\/sitemap\.xml/);
  assert.doesNotMatch(staticRobots, /www\.scrolltek|pages\.dev|scrolltek\.com/i);
});
