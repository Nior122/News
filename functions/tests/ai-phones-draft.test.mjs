import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { applyArticleContentOverride } from '../lib/article-seo.mjs';

const base = new URL('../../drafts/why-ai-phones-are-the-future-2026', import.meta.url);
const draft = JSON.parse(readFileSync(`${base.pathname}.json`, 'utf8'));
const markdown = readFileSync(`${base.pathname}.md`, 'utf8');
const preview = readFileSync(`${base.pathname}.html`, 'utf8');

test('AI phones prepared publication preserves locked metadata', () => {
  assert.equal(draft.status, 'Published');
  assert.equal(draft.published, true);
  assert.equal(draft.slug, 'why-ai-phones-are-the-future-2026');
  assert.equal(draft.byline, 'Maya Chen');
  assert.equal(draft.authorId, 1);
  assert.equal(draft.category, 'Tech');
  assert.equal(draft.categorySlug, 'tech');
  assert.equal(draft.publishedAt, '2026-05-28T09:00:00.000Z');
  assert.equal(draft.dateModified, '2026-10-24');
  assert.equal(draft.metaTitle, 'AI Phones in 2026: What They Are & Best Picks');
  assert.equal(draft.h1, 'AI Phones in 2026: What They Are, Which Features Matter and the Best Picks');
  assert.equal(draft.metaDescription, 'What makes a phone an AI phone? See which on-device AI features matter, which are marketing, and the best AI phones by price in 2026, flagship to budget.');
  const liveRow = { slug: draft.slug, title: 'Original live title', body: '<p>Original live body</p>', published: true };
  const updated = applyArticleContentOverride(liveRow);
  assert.equal(updated.title, draft.h1);
  assert.equal(updated.body, draft.body);
  assert.equal(updated.published, true);
  assert.equal(updated.slug, draft.slug);
});

test('AI phones draft preserves headings, table, lists, links, and has no images or schema', () => {
  assert.equal((preview.match(/<h1>/g) || []).length, 1);
  assert.equal((draft.body.match(/<h2>/g) || []).length, (markdown.match(/^## /gm) || []).length);
  assert.equal((draft.body.match(/<h3>/g) || []).length, 10);
  assert.equal((draft.body.match(/<table>/g) || []).length, 1);
  assert.equal((draft.body.match(/<tr>/g) || []).length, 10);
  assert.match(draft.body, /<ol>[\s\S]*<\/ol>/);
  assert.match(draft.body, /<ul>[\s\S]*<\/ul>/);
  assert.doesNotMatch(draft.body, /<h1|<img|pexels|<script|application\/ld\+json/i);
  assert.deepEqual([...draft.body.matchAll(/href="([^"]+)"/g)].map(m => m[1]), [...markdown.matchAll(/\]\((https?:\/\/[^)]+)\)/g)].map(m => m[1]));
  assert.equal((draft.body.match(/href=/g) || []).length, 10);
  assert.equal((draft.body.match(/href="https:\/\/scrolltek.name.ng\/article\//g) || []).length, 6);
  assert.doesNotMatch(draft.body, /Pixel 9 Pro|Galaxy S23|Tecno Phantom V|Infinix Zero Ultra|by 2028/);
  assert.match(draft.body, /class="article-table-wrap"/);
  assert.ok(draft.body.startsWith('<p>By Maya Chen | Published May 28, 2026 | Updated October 24, 2026</p>'));
  assert.ok(preview.includes(draft.body));
});
