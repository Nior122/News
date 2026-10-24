import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { JOMO_ARTICLE_BODY, JOMO_ARTICLE_TITLE } from '../lib/jomo-article-content.mjs';
import { applyArticleContentOverride } from '../lib/article-seo.mjs';
import { renderArticleDocument } from '../lib/seo-html.mjs';

const original = {
  id: 100, slug: 'digital-detox-jomo-2026', title: 'Old title',
  body: '<p>Old content</p><img src="/old-inline.jpg">',
  category: 'Lifestyle', author_id: 3, author_name: 'Sofia Reyes',
  published_at: '2026-05-27T12:00:00Z', published: true,
  image_url: '/images/existing-hero.webp', excerpt: 'Existing excerpt',
};

test('JOMO replaces only title and body, preserving original publication metadata', () => {
  const updated = applyArticleContentOverride(original);
  assert.deepEqual(updated, { ...original, title: JOMO_ARTICLE_TITLE, body: JOMO_ARTICLE_BODY, subtitle: null, excerpt: 'JOMO means the joy of missing out. Learn where the term came from, how it differs from FOMO and digital detox, and 7 simple ways to practice it.', image_url: '/images/jomo-joy-of-missing-out-hero.webp' });
  assert.doesNotMatch(updated.body, /Old content|old-inline|<img|<h1/);
  const source = readFileSync(new URL('../../drafts/digital-detox-jomo-2026.html', import.meta.url), 'utf8');
  assert.equal(JOMO_ARTICLE_BODY, source.replace(/^<h1>.*?<\/h1>\n?/, ''));
  assert.equal((updated.body.match(/<h3>/g) || []).length, 7);
  assert.match(updated.body, /<table>[\s\S]*<thead>[\s\S]*<tbody>/);
  const markdown = readFileSync(new URL('../../drafts/digital-detox-jomo-2026.md', import.meta.url), 'utf8');
  assert.deepEqual([...updated.body.matchAll(/href="([^"]+)"/g)].map(m => m[1]), [...markdown.matchAll(/\]\((https?:\/\/[^)]+)\)/g)].map(m => m[1]));
});

test('JOMO renderer keeps one H1, original byline/date and unchanged Related reading', () => {
  const template = readFileSync(new URL('../../artifacts/media-site/index.html', import.meta.url), 'utf8');
  const related = [{ slug: 'existing-related-story', title: 'Existing related story', excerpt: 'Existing summary' }];
  const before = renderArticleDocument(template, original, { related });
  const after = renderArticleDocument(template, applyArticleContentOverride(original), { related });
  const relatedBlock = html => html.match(/<aside aria-label="Related articles">[\s\S]*?<\/aside>/)?.[0];
  assert.ok(relatedBlock(before));
  assert.equal(relatedBlock(after), relatedBlock(before));
  assert.equal((after.match(/<h1\b/g) || []).length, 1);
  assert.ok(after.includes(JOMO_ARTICLE_TITLE));
  assert.match(after, /Sofia Reyes/);
  assert.match(after, /May 27, 2026/);
  assert.match(after, /https:\/\/scrolltek.name.ng\/article\/digital-detox-jomo-2026/);
});

test('JOMO SEO and schema validation: exact metadata and seven verbatim FAQs in one graph', () => {
  const template = readFileSync(new URL('../../artifacts/media-site/index.html', import.meta.url), 'utf8');
  const page = renderArticleDocument(template, applyArticleContentOverride(original));
  assert.match(page, /<title>What Is JOMO\? The Joy of Missing Out Explained<\/title>/);
  for (const attr of ['og:title', 'twitter:title']) {
    assert.match(page, new RegExp(`${attr}" content="What Is JOMO\\? The Joy of Missing Out Explained"`));
  }
  assert.match(page, /name="robots" content="index, follow, max-image-preview:large"/);
  assert.match(page, /property="article:modified_time" content="2026-10-24"/);
  assert.match(page, /Updated: October 24, 2026/);
  const scripts = [...page.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map(m => JSON.parse(m[1]));
  const graphs = scripts.filter(s => s['@graph']?.some(n => n['@type'] === 'Article'));
  assert.equal(graphs.length, 1);
  const graph = graphs[0];
  assert.equal(graph['@context'], 'https://schema.org');
  assert.deepEqual(graph['@graph'].map(n => n['@type']).sort(), ['Article', 'BreadcrumbList', 'FAQPage']);
  const article = graph['@graph'].find(n => n['@type'] === 'Article');
  assert.equal(article.headline, JOMO_ARTICLE_TITLE);
  assert.equal(article.datePublished, '2026-05-27');
  assert.equal(article.dateModified, '2026-10-24');
  assert.equal(article.author.name, 'Sofia Reyes');
  assert.equal(article.author['@type'], 'Person');
  assert.equal(article.publisher.name, 'Scrolltek');
  assert.equal(article.publisher['@type'], 'Organization');
  assert.equal(article.articleSection, 'Lifestyle');
  assert.equal(article.mainEntityOfPage['@id'], 'https://scrolltek.name.ng/article/digital-detox-jomo-2026');
  assert.deepEqual(article.image, ['https://scrolltek.name.ng/images/jomo-joy-of-missing-out-hero.webp']);
  const faq = graph['@graph'].find(n => n['@type'] === 'FAQPage');
  assert.equal(faq.mainEntity.length, 7);
  const visible = [...JOMO_ARTICLE_BODY.matchAll(/<h3>(.*?)<\/h3>\s*<p>(.*?)<\/p>/g)];
  assert.deepEqual(faq.mainEntity.map(q => [q.name, q.acceptedAnswer.text]), visible.map(m => [m[1], m[2]]));
  const breadcrumbs = graph['@graph'].find(n => n['@type'] === 'BreadcrumbList');
  assert.deepEqual(breadcrumbs.itemListElement.map(i => i.name), ['Home', 'Lifestyle', JOMO_ARTICLE_TITLE]);
  for (const q of faq.mainEntity) {
    assert.equal(q['@type'], 'Question');
    assert.equal(q.acceptedAnswer['@type'], 'Answer');
    assert.doesNotMatch(q.acceptedAnswer.text, /<[^>]+>/);
  }
  assert.equal((JOMO_ARTICLE_BODY.match(/<h2>/g) || []).length, 10);
  assert.doesNotMatch(JOMO_ARTICLE_BODY, /six hours|hundred times|100\+|cortisol|melatonin|blue light|massive rise|pexels/i);
  assert.match(JOMO_ARTICLE_BODY, /If anxiety or low mood is persistent, or you are pulling away from people and cannot seem to stop, consider talking with a doctor, therapist, or other qualified professional\. JOMO is not a substitute for care\./);
  const hero = page.match(/<img[^>]+jomo-joy-of-missing-out-hero\.webp[^>]*>/)?.[0];
  assert.ok(hero);
  assert.match(hero, /width="1200" height="630"/);
  assert.doesNotMatch(hero, /loading="lazy"/);
  assert.match(hero, /loading="eager"/);
});
