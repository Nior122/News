import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const redirectsPath = new URL("../../artifacts/media-site/public/_redirects", import.meta.url);

test("Pages redirects do not contain a catch-all rewrite that Wrangler rejects as an infinite loop", async () => {
  const redirects = await readFile(redirectsPath, "utf8");
  assert.match(redirects, /^\/sitemap\.xml\s+\/sitemap\.xml\s+200\s*$/m);
  assert.match(redirects, /^\/robots\.txt\s+\/robots\.txt\s+200\s*$/m);
  assert.doesNotMatch(redirects, /^\/\*\s+\/index\.html\s+200\s*$/m);
});
