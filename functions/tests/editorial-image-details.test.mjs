import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {ARTICLE_SEO_OVERRIDES,applyArticleContentOverride} from '../lib/article-seo.mjs';
import {renderArticleDocument} from '../lib/seo-html.mjs';

const slugs=['quitting-social-media-digital-detox-2026','why-ai-phones-are-the-future-2026','dumb-tech-trend-2026','digital-detox-jomo-2026','e-ink-gadgets-comeback-2026','what-is-vibe-coding-2026','best-budget-wireless-earbuds-2026','ai-tools-for-students-2026'];
const template=readFileSync(new URL('../../artifacts/media-site/index.html',import.meta.url),'utf8');
for(const slug of slugs)test(`${slug}: descriptive hero and body image metadata survives SSR`,()=>{
 const seo=ARTICLE_SEO_OVERRIDES[slug];
 assert.ok(seo.heroTitle?.length>10);
 assert.ok(seo.heroAlt?.length>15);
 assert.doesNotMatch(seo.heroAlt,/AI.generated/i);
 const article=applyArticleContentOverride({slug,title:'Article title',body:'<p>Article body</p>',category:'Lifestyle',image_url:'/images/example.webp',published_at:'2026-05-26T15:35:23.696Z'});
 const html=renderArticleDocument(template,article);
 const tags=[...html.matchAll(/<img\b[^>]*>/g)].map(m=>m[0]);
 assert.ok(tags.length);
 for(const tag of tags){
  assert.match(tag,/title="[^"]+"/);
  assert.match(tag,/alt="[^"]+"/);
  assert.match(tag,/width="\d+" height="\d+"/);
 }
 assert.ok(html.includes(`property="og:image:alt" content="${seo.heroAlt}"`));
 assert.ok(html.includes(`name="twitter:image:alt" content="${seo.heroAlt}"`));
 if(slug==='quitting-social-media-digital-detox-2026'){
  assert.equal(tags.length,5);
  assert.doesNotMatch(html,/AI-generated editorial illustration\./);
 }
});
