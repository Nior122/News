import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,statSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {applyArticleContentOverride} from '../lib/article-seo.mjs';
import {renderArticleDocument} from '../lib/seo-html.mjs';
import {buildSitemapXml} from '../sitemap.xml.mjs';
import {editorialRelatedSlugs,orderEditorialRelated} from '../lib/editorial-related.mjs';
const slug='amd-on-device-ai-no-internet-2026';
const read=p=>readFileSync(new URL('../../'+p,import.meta.url),'utf8');
const draft=JSON.parse(read(`drafts/${slug}.json`));
const source={id:4,slug,title:'Old AMD title',subtitle:'Old subtitle',excerpt:'Old excerpt',body:'Old claims',category:'Tech',author_id:4,author_name:'Liam Park',published_at:'2026-05-26T15:35:23.685Z',published:true,image_url:'https://images.unsplash.com/old-image'};
const article=applyArticleContentOverride(source);
const related=draft.relatedReading.map(r=>({...r,excerpt:r.description,body:'<p>Existing article body</p>'}));
const page=renderArticleDocument(read('artifacts/media-site/index.html'),article,{related});
const schemas=[...page.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map(m=>JSON.parse(m[1]));
test('on-device AI preserves identity, original draft and full timestamp',()=>{
 for(const key of ['id','slug','category','author_id','author_name','published_at','published'])assert.equal(article[key],source[key]);
 assert.equal(createHash('sha256').update(read(`drafts/${slug}.md`)).digest('hex'),draft.bodySha256);
 assert.equal(article.body,draft.body);assert.equal(article.title,draft.h1);assert.equal(article.subtitle,null);
 assert.doesNotMatch(article.body,/unsplash|10 seconds to just 1 second|personal health coach|finance manager|daily news brief|unlimited, unrestricted|late 2026 and into 2027/i);
 assert.match(article.body,/2025 research/);assert.match(article.body,/does not state its parameter count/);
 assert.match(article.body,/7,299.99/);assert.match(article.body,/4-bit quantization/);
});
test('on-device AI exact SEO and separate schemas match visible article',()=>{
 assert.equal(draft.metaTitle.length,45);assert.equal(draft.metaDescription.length,145);
 assert.match(page,/<title>What Is On-Device AI\? Pros, Limits &amp; Examples<\/title>/);
 for(const field of ['description','og:description','twitter:description'])assert.ok(page.includes(`${field}" content="${draft.metaDescription}"`));
 assert.ok(page.includes(`rel="canonical" href="${draft.canonicalUrl}"`));
 assert.equal((page.match(/<h1\b/g)||[]).length,1);
 assert.equal((article.body.match(/<h2>/g)||[]).length,10);
 assert.equal((article.body.match(/<table>/g)||[]).length,1);
 for(const type of ['Article','FAQPage','BreadcrumbList'])assert.equal(schemas.filter(s=>s['@type']===type).length,1);
 const schema=schemas.find(s=>s['@type']==='Article');
 assert.equal(schema.author.name,'Liam Park');assert.equal(schema.publisher.logo.url,'https://scrolltek.name.ng/favicon.svg');
 assert.equal(schema.datePublished,source.published_at);assert.equal(schema.dateModified,'2026-10-24');
 assert.deepEqual(schema.image,[draft.hero.url]);assert.equal(schema.mainEntityOfPage,draft.canonicalUrl);
 assert.deepEqual(schemas.find(s=>s['@type']==='BreadcrumbList').itemListElement.map(i=>i.name),['Home','Tech','What Is On-Device AI?']);
 const faqs=[...article.body.matchAll(/<h3>(.*?)<\/h3>\s*<p>(.*?)<\/p>/g)].slice(-7).map(m=>[m[1],m[2]]);
 assert.deepEqual(schemas.find(s=>s['@type']==='FAQPage').mainEntity.map(q=>[q.name,q.acceptedAnswer.text]),faqs);
 assert.ok(buildSitemapXml([source]).includes('<lastmod>2026-10-24</lastmod>'));
});
test('on-device AI images are self-hosted, meaningful and correctly prioritized',()=>{
 const hero=page.match(/<img[^>]+on-device-ai-explained-hero\.webp[^>]*>/)?.[0];assert.ok(hero);
 assert.match(hero,/width="1600" height="900" loading="eager" fetchpriority="high"/);
 assert.ok(page.indexOf('By Liam Park')<page.indexOf(hero));
 assert.ok(page.indexOf(hero)<page.indexOf('Your Wi-Fi drops'));
 const diagram=article.body.match(/<img[^>]+on-device-vs-cloud-ai-diagram\.webp[^>]*>/)?.[0];assert.ok(diagram);
 assert.match(diagram,/title="On-device AI vs cloud AI: request paths"/);assert.match(diagram,/width="1440" height="900" loading="lazy"/);
 assert.ok(article.body.indexOf('</table>')<article.body.indexOf(diagram));
 assert.ok(article.body.indexOf(diagram)<article.body.indexOf('<h2>Benefits:'));
 assert.ok(statSync(new URL('../../artifacts/media-site/public/images/on-device-ai-explained-hero.webp',import.meta.url)).size<150000);
 assert.doesNotMatch(article.body,/windows-task-manager-npu/);
});
test('on-device AI has six preserved relative internal links and verified primary citations',()=>{
 const internal=[...article.body.matchAll(/href="(\/article\/[^"]+)"/g)].map(m=>m[1]);
 assert.deepEqual(internal,[...read(`drafts/${slug}.md`).matchAll(/\]\((\/article\/[^)]+)\)/g)].map(m=>m[1]));assert.equal(internal.length,6);
 const external=[...article.body.matchAll(/<a href="(https:[^"]+)"[^>]*>/g)];assert.equal(external.length,10);
 for(const [tag] of external){assert.match(tag,/target="_blank"/);assert.match(tag,/rel="noopener"/);}
 assert.doesNotMatch(article.body,/support.microsoft.com\/help\/5039678/);
});
test('curated related stories retain live titles/descriptions and requested order',()=>{
 const slugs=editorialRelatedSlugs(slug);assert.deepEqual(slugs,draft.relatedReading.map(r=>r.slug));
 assert.deepEqual(orderEditorialRelated(slug,[...related].reverse()).map(r=>r.slug),slugs);
 for(const r of related){assert.ok(page.includes(r.slug));assert.ok(page.includes(r.description));}
 assert.equal(editorialRelatedSlugs('other-article'),null);
});
test('both inbound stories use exactly the requested on-device AI anchor',()=>{
 for(const s of ['privacy-first-gadgets-2026','why-ai-phones-are-the-future-2026']){
  const row=applyArticleContentOverride({slug:s,title:'Existing title',body:'<p>See <a href="https://scrolltek.name.ng/article/amd-on-device-ai-no-internet-2026">old anchor</a>.</p>'});
  assert.match(row.body,/href="(?:https:\/\/scrolltek\.name\.ng)?\/article\/amd-on-device-ai-no-internet-2026"[^>]*>on-device AI<\/a>/);
  assert.equal(applyArticleContentOverride(row).body,row.body);
 }
});
