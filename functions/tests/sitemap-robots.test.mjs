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

test("sitemap is canonical, duplicate-free, published-only, and has no fabricated lastmod", () => {
  const publishedArticle = (slug, published = true, body = "<p>Published body</p>") => ({ slug, published, body });
  const xml = buildSitemapXml([
    publishedArticle("visible-story"),
    publishedArticle("visible-story"),
    publishedArticle("why-ai-phones-are-becoming-the-future"),
    publishedArticle("why-ai-phones-are-the-future-2026"),
    publishedArticle("draft-story", false),
    publishedArticle("unsafe/story"),
    publishedArticle("."),
    publishedArticle(".."),
    publishedArticle("query?param"),
    publishedArticle("story & tips"),
    publishedArticle("quote's story"),
    publishedArticle("empty-body", true, "  "),
    publishedArticle("executable-only", true, "<script>alert(1)</script>"),
  ]);
  const locations = sitemapLocations(xml);

  assert.equal(locations.length, new Set(locations).size);
  assert.equal(locations.filter((location) => location.startsWith(`${ORIGIN}/`)).length, locations.length);
  assert.ok(locations.includes(`${ORIGIN}/article/visible-story`));
  assert.ok(locations.includes(`${ORIGIN}/article/why-ai-phones-are-the-future-2026`));
  assert.ok(!locations.includes(`${ORIGIN}/article/why-ai-phones-are-becoming-the-future`));
  assert.ok(locations.includes(`${ORIGIN}/article/story%20%26%20tips`));
  assert.ok(locations.includes(`${ORIGIN}/article/quote&apos;s%20story`));
  assert.ok(!xml.includes("draft-story"));
  assert.ok(!xml.includes("unsafe/story"));
  assert.ok(!xml.includes("/article/."));
  assert.ok(!xml.includes("/article/.."));
  assert.ok(!xml.includes("query?param"));
  assert.ok(!locations.includes(`${ORIGIN}/article/empty-body`));
  assert.ok(!locations.includes(`${ORIGIN}/article/executable-only`));
  assert.doesNotMatch(xml, /<lastmod>/i);
  assert.doesNotMatch(xml, /www\.scrolltek|pages\.dev|scrolltek\.com/i);
  assert.equal(locations.length, 15);
});

test("sitemap handler is read-only and emits only URLs returned by the published query", async () => {
  const queries = [];
  const fixtureSql = async (strings) => {
    const query = strings.join(" ");
    queries.push(query);
    return [
      { slug: "public-story", published: true, title: "Public Story", body: "<p>Published body</p>" },
      { slug: "private-draft", published: false, title: "Private Draft", body: "<p>Draft body</p>" },
      { slug: "executable-story", published: true, title: "Incomplete Story", body: "<script>alert(1)</script>" },
    ];
  };
  const handler = createSitemapHandler({ databaseFactory: () => fixtureSql });
  const response = await handler({ env: { DATABASE_URL: "local-test-placeholder" } });
  const body = await response.text();

  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type"), /application\/xml/i);
  assert.match(body, /https:\/\/scrolltek\.name\.ng\/article\/public-story/);
  assert.doesNotMatch(body, /private-draft|executable-story/);
  assert.equal(queries.length, 1);
  assert.match(queries[0], /SELECT slug, published, body/);
  assert.match(queries[0], /WHERE published = true/);
  assert.match(queries[0], /BTRIM\(COALESCE\(title, ''\)\) <> ''/);
  assert.match(queries[0], /BTRIM\(COALESCE\(body, ''\)\) <> ''/);
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
  assert.match(robotsBody, /Sitemap: https:\/\/scrolltek\.name\.ng\/sitemap\.xml/);
  assert.doesNotMatch(robotsBody, /www\.scrolltek|pages\.dev|scrolltek\.com|Disallow:\s*\/admin/i);

  const staticRobots = await readFile(new URL("../../artifacts/media-site/public/robots.txt", import.meta.url), "utf8");
  assert.match(staticRobots, /Sitemap: https:\/\/scrolltek\.name\.ng\/sitemap\.xml/);
  assert.doesNotMatch(staticRobots, /www\.scrolltek|pages\.dev|scrolltek\.com/i);
});
