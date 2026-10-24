import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, statSync } from 'node:fs';
import { applyArticleContentOverride } from '../lib/article-seo.mjs';
import { renderArticleDocument } from '../lib/seo-html.mjs';
import { buildSitemapXml } from '../sitemap.xml.mjs';

const slug = 'why-ai-phones-are-the-future-2026';
const draft = JSON.parse(readFileSync(new URL(`../../drafts/${slug}.json`, import.meta.url)));
const source = {id:476,slug,title:'Old title',subtitle:'From cameras that think to assistants that never forget...',excerpt:'Old excerpt',body:'<p>Old text</p><img src="https://images.pexels.com/photos/20870805/old.jpeg">',category:'Tech',author_id:1,author_name:'Maya Chen',published_at:'2026-05-28T09:00:00.000Z',published:true,image_url:'https://images.pexels.com/old.jpeg'};

test('AI phones publication preserves locked fields and replaces only approved content', () => {
  const article = applyArticleContentOverride(source);
  for (const key of ['id','slug','category','author_id','author_name','published_at','published']) assert.equal(article[key],source[key]);
  assert.equal(article.title,draft.h1);
  assert.equal(article.body,draft.body);
  assert.equal(article.subtitle,null);
  assert.doesNotMatch(article.body,/pexels|Pixel 9 Pro|Galaxy S23|Tecno Phantom V|Infinix Zero Ultra|by 2028|<img/i);
  for (const file of ['ai-phones-2026-editorial-hero.webp','ai-phones-2026-editorial-social.webp']) assert.ok(statSync(new URL('../../artifacts/media-site/public/images/'+file, import.meta.url)).size < 200000);
});

test('AI phones SSR validates exact SEO, three schema blocks, seven visible FAQs, images and sitemap', () => {
  const article=applyArticleContentOverride(source);
  const template=readFileSync(new URL('../../artifacts/media-site/index.html',import.meta.url),'utf8');
  const related=[{slug:'existing-story',title:'Existing related story'}];
  const page=renderArticleDocument(template,article,{related});
  assert.equal((page.match(/<h1\b/g)||[]).length,1);
  assert.match(page,/<title>AI Phones in 2026: What They Are &amp; Best Picks<\/title>/);
  assert.equal(draft.metaTitle.length,45);assert.equal(draft.metaDescription.length,153);
  for (const name of ['og:title','twitter:title']) assert.ok(page.includes(`${name}" content="AI Phones in 2026: What They Are &amp; Best Picks"`));
  for (const name of ['description','og:description','twitter:description']) assert.ok(page.includes(`${name}" content="${draft.metaDescription}"`));
  assert.ok(page.includes('content="index, follow, max-image-preview:large"'));
  assert.match(page,/property="article:modified_time" content="2026-10-24"/);
  for (const name of ['og:image','twitter:image']) assert.ok(page.includes(`${name}" content="${draft.socialImage.url}"`));
  const hero=page.match(/<img[^>]+ai-phones-2026-editorial-hero\.webp[^>]*>/)?.[0];assert.ok(hero);
  assert.match(hero,/width="1600" height="900"/);assert.match(hero,/loading="eager"/);assert.doesNotMatch(hero,/loading="lazy"/);
  assert.match(page,/Generic smartphones illustrate on-device AI features/);
  const schemas=[...page.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map(m=>JSON.parse(m[1]));
  const byType=type=>schemas.filter(s=>s['@type']===type);
  for(const type of ['Article','BreadcrumbList','FAQPage'])assert.equal(byType(type).length,1,type+' emitted exactly once');
  assert.equal(byType('NewsArticle').length,0);
  const schema=byType('Article')[0];
  for(const key of ['headline','description','author','publisher','datePublished','dateModified','mainEntityOfPage','image'])assert.ok(schema[key],key+' required');
  assert.equal(schema.headline,article.title);assert.equal(schema.description,draft.metaDescription);
  assert.equal(schema.author.name,'Maya Chen');assert.equal(schema.author['@type'],'Person');assert.equal(schema.publisher.name,'Scrolltek');
  assert.equal(schema.datePublished,source.published_at);assert.equal(schema.dateModified,'2026-10-24');
  assert.equal(schema.mainEntityOfPage,'https://scrolltek.name.ng/article/'+slug);assert.equal(schema.image,draft.hero.url);
  const faqs=[...article.body.matchAll(/<h3>(.*?)<\/h3>\s*<p>(.*?)<\/p>/g)].slice(3);
  assert.equal(faqs.length,7);
  assert.deepEqual(byType('FAQPage')[0].mainEntity.map(q=>[q.name,q.acceptedAnswer.text]),faqs.map(m=>[m[1],m[2]]));
  assert.deepEqual(byType('BreadcrumbList')[0].itemListElement.map(x=>x.name),['Home','Tech',article.title]);
  assert.match(page,/<aside aria-label="Related articles"><h2>Related reading<\/h2>/);
  assert.ok(buildSitemapXml([source]).includes('<lastmod>2026-10-24</lastmod>'));
});
