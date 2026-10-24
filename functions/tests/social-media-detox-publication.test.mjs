import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { applyArticleContentOverride } from '../lib/article-seo.mjs';
import { renderArticleDocument } from '../lib/seo-html.mjs';
import { buildSitemapXml } from '../sitemap.xml.mjs';

const slug = 'quitting-social-media-digital-detox-2026';
const read = path => readFileSync(new URL('../../'+path, import.meta.url),'utf8');
const draft = JSON.parse(read(`drafts/${slug}.json`));
const markdown = read(`drafts/${slug}.md`);
const source = { id:8, slug, title:'Old title', subtitle:'Old subtitle', excerpt:'Record deactivations', body:'Old claims', category:'Lifestyle', author_id:3, author_name:'Sofia Reyes', published_at:'2026-05-26T15:35:23.696Z', published:true, image_url:'https://images.unsplash.com/photo-1534528741775-53994a69daeb' };
const article = applyArticleContentOverride(source);
const page = renderArticleDocument(read('artifacts/media-site/index.html'),article,{related:[{slug:'existing-related',title:'Existing related story'}]});
const schemas = [...page.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map(m=>JSON.parse(m[1]));

test('social media detox preserves verbatim draft and locked article identity', () => {
  assert.equal(createHash('sha256').update(markdown).digest('hex'),draft.bodySha256);
  assert.equal((markdown.match(/^# /gm)||[]).length,1);
  assert.equal(draft.wordCountExcludingSources,1838);
  for(const key of ['id','slug','category','author_id','author_name','published_at','published']) assert.equal(article[key],source[key]);
  assert.equal(article.title,draft.title);
  assert.equal(article.subtitle,null);
  assert.equal(article.excerpt,draft.metaDescription);
  assert.equal(article.body,read(`drafts/${slug}.body.html`).trimEnd());
  assert.doesNotMatch(article.body,/<h1|unsplash|\brecord\b|Q1 2026|three separate research groups|return on attention anxiety|calmer after a month/i);
  const internal = [...article.body.matchAll(/href="(\/article\/[^"]+)"/g)].map(m=>m[1]);
  assert.deepEqual(internal,draft.internalLinks.map(l=>l.path));
  const external = [...article.body.matchAll(/<a href="https:[^>]+>/g)];
  assert.equal(external.length,6);
  for(const [tag] of external) assert.match(tag,/rel="noopener"/);
  assert.equal((article.body.match(/class="table-scroll-wrap"/g)||[]).length,2);
});

test('social media detox SSR has exact SEO, eager sized hero and three synchronized schemas', () => {
  assert.equal(draft.metaTitle.length,46); assert.equal(draft.metaDescription.length,150);
  assert.ok(page.includes(`<title>${draft.metaTitle}</title>`));
  for(const name of ['og:title','twitter:title']) assert.ok(page.includes(`${name}" content="${draft.metaTitle}"`));
  for(const name of ['description','og:description','twitter:description']) assert.ok(page.includes(`${name}" content="${draft.metaDescription}"`));
  for(const name of ['og:image','twitter:image']) assert.ok(page.includes(`${name}" content="${draft.socialImage.url}"`));
  assert.ok(page.includes(`rel="canonical" href="${draft.canonicalUrl}"`));
  assert.match(page,/name="twitter:site" content="@scrolltek"/);
  assert.match(page,/property="og:type" content="article"/);
  assert.match(page,/content="index, follow, max-image-preview:large"/);
  assert.equal((page.match(/<h1\b/g)||[]).length,1);
  const hero=page.match(/<img[^>]+social-media-detox-7-day-plan-hero.webp[^>]*>/)?.[0];
  assert.ok(hero); assert.match(hero,/width="1600" height="900"/); assert.match(hero,/loading="eager" fetchpriority="high"/);
  assert.ok(hero.includes(`alt="${draft.hero.alt}"`));
  assert.match(page,/By Sofia Reyes/);assert.match(page,/Updated October 24, 2026/);
  const byType=type=>schemas.filter(s=>s['@type']===type);
  for(const type of ['Article','BreadcrumbList','FAQPage']) assert.equal(byType(type).length,1);
  assert.equal(schemas.filter(s=>s["@type"]!=="WebSite").length,3);
  const schema=byType('Article')[0];
  assert.equal(schema.datePublished,source.published_at);assert.equal(schema.dateModified,'2026-10-24');
  assert.equal(schema.author.name,'Sofia Reyes');assert.equal(schema.articleSection,'Lifestyle');
  assert.equal(schema.headline,draft.title);assert.equal(schema.description,draft.metaDescription);
  assert.equal(schema.mainEntityOfPage,draft.canonicalUrl);assert.equal(schema.image,draft.hero.url);
  const faqSection=markdown.split('\n## FAQ\n')[1].split('\n## Conclusion')[0]+'\n\n## END';
  const faqs=[...faqSection.matchAll(/### ([^\n]+)\n\n([\s\S]*?)(?=\n\n### |\n\n## )/g)].map(m=>[m[1],m[2].trim()]);
  assert.equal(faqs.length,7);
  assert.deepEqual(byType('FAQPage')[0].mainEntity.map(q=>[q.name,q.acceptedAnswer.text]),faqs);
  assert.deepEqual(byType('BreadcrumbList')[0].itemListElement.map(x=>x.name),['Home','Lifestyle',article.title]);
  assert.match(page,/<h2>Related reading<\/h2>/);
  assert.ok(buildSitemapXml([source]).includes('<lastmod>2026-10-24</lastmod>'));
  for(const file of ['hero','social']) assert.ok(statSync(new URL(`../../artifacts/media-site/public/images/social-media-detox-7-day-plan-${file}.webp`,import.meta.url)).size<200000);
});

 test('social media detox includes four optimized self-hosted lazy body images', () => {
  const images=[...article.body.matchAll(/<img\b[^>]*>/g)].map(m=>m[0]);
  assert.equal(images.length,4);
  for(const tag of images){
    assert.match(tag,/src="\/images\/social-media-detox-[^" ]+\.webp"/);
    assert.match(tag,/alt="[^"]+"/);
    assert.match(tag,/width="1200" height="675"/);
    assert.match(tag,/loading="lazy" decoding="async"/);
    const path=tag.match(/src="([^" ]+)"/)[1];
    assert.ok(statSync(new URL('../../artifacts/media-site/public'+path,import.meta.url)).size<200000);
  }
  assert.equal((article.body.match(/AI-generated editorial illustration\./g)||[]).length,4);
});
