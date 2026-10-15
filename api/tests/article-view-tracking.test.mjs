import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const routePath = new URL('../../artifacts/api-server/src/routes/articles.ts', import.meta.url);

test('Express single-article GET remains read-only and does not increment view counts', async () => {
  const source = await readFile(routePath, 'utf8');
  const start = source.indexOf('router.get("/articles/:slug"');
  const end = source.indexOf('router.get("/articles/:slug/related"', start);
  assert.notEqual(start, -1, 'single-article route should exist');
  assert.notEqual(end, -1, 'related-article route should follow the single-article route');

  const articleRoute = source.slice(start, end);
  assert.doesNotMatch(articleRoute, /\.update\s*\(/);
  assert.doesNotMatch(articleRoute, /views\s*=|views\s*\+\s*1/i);
});
