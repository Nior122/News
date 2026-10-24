# Social media detox — draft checks

- Status: **DRAFT** (`status: draft`, `published: false` in companion JSON).
- Saved as a repository draft only; no CMS draft write is claimed. No runtime, sitemap, or live article edits. No commit, push, PR, merge, or deployment performed for this task.
- User-supplied Markdown saved verbatim, including the single H1 and Sources; no copy edits or image insertions.
- H1 count: **1**. Future rendering must not add another title H1 above this body.
- Body word count excluding Sources: **1838**; required range 1,700–2,100: **PASS**. Count includes headings/table text, excludes Markdown syntax, link destinations and table separator rows.
- Source article read from public API: ID 8, Sofia Reyes / author ID 3, Lifestyle, exact original timestamp `2026-05-26T15:35:23.696Z` preserved in draft metadata. The existing live record was published; that live status is not changed by this repository draft.
- Draft modified date: **October 24, 2026** (`2026-10-24`).
- Subtitle: **removed** (`null`); prohibited old claims absent from replacement body. The old excerpt is intentionally not copied because it repeats the unsupported record-deactivation claim.
- Inline image count: **0**. Images deferred to Prompt 2; live images have not been changed.
- Six internal targets returned their corresponding article content through the page-fetch tool. Numeric HTTP status codes were not exposed; do not claim HTTP 200 validation.

## Link resolution results

| Anchor | Target | Result |
|---|---|---|
| the iPhone settings worth changing | /article/iphone-settings-change-now-2026 | Resolved to article content |
| hidden Android features | /article/hidden-android-features-2026 | Resolved to article content |
| tiny internet communities | /article/tiny-internet-communities-2026 | Resolved to article content |
| the dumb tech trend | /article/dumb-tech-trend-2026 | Resolved to article content |
| TikTok and attention span | /article/tiktok-brain-attention-span-2026 | Resolved to article content |
| digital detox and JOMO | /article/digital-detox-jomo-2026 | Resolved to article content |

No research claims or source citations were independently fact-checked in this verbatim-copy task.

## Prompt 2 — authorized publication preparation

Prompt 2 supersedes the earlier draft-only instruction and explicitly requests publication. The original Markdown and its SHA-256 are unchanged. Runtime rendering omits its H1 because the article template emits that exact heading once; all remaining wording, anchors and citations are preserved. Plain-text Sources URLs become clickable links with `rel="noopener"` and safe wrapping.

- Exact SEO title: 46 characters; description: 150 characters, synchronized with Open Graph and Twitter.
- Canonical and slug unchanged; no redirect. Original ID 8 / Sofia Reyes / author 3 / Lifestyle / `2026-05-26T15:35:23.696Z` preserved.
- Article, BreadcrumbList and seven exact FAQ question/answer pairs checked in SSR and client output. Existing site-level WebSite schema retained. No FAQ rich-result eligibility promise.
- Original generated hero: 1600×900 WebP, 147,204 bytes. Separate social crop: 1200×630 WebP, 101,074 bytes. Accurate requested alt, eager loading, dimensions, fetchpriority high, and AI-generation disclosure. No hotlinked images occur in the replacement body.
- Six internal links retain the exact requested anchors and destinations. Their article content loaded in Prompt 1's checks. A direct numeric HTTP-status attempt in Prompt 2 failed at TLS (`SSL_ERROR_SYSCALL`), so HTTP 200 is NOT claimed.
- All six exact Sources URLs loaded through page-fetch, including DOI redirects to Sage, Guilford and the NBER PDF. NBER w25514 and APA loaded. Pew redirects to its current 2026 fact sheet, which includes the cited 2025 percentages; supplied citation wording and URL unchanged. No replacement source links added.
- No prohibited old claims or old subtitle in replacement content; old excerpt replaced with the exact new description.
- Full workspace typecheck/production build passed. Repository tests: **71/71 passed**.
- Actual built React page preview with a fixture article API: **390px and 1440px** checked. One H1, correct heading hierarchy, exact title/description, three article-specific schema blocks, visible By Sofia Reyes and update line, loaded eager 1600×900 hero, no old hero, and no page-level overflow. Both tables use their own horizontal-scrolling containers. Long Sources URLs wrap without changing their wording.
- Existing related-reading content and selection logic remain untouched; preview uses a fixture related story, not production data.
- Production deployment/live metadata verification is pending at this point. Search Console indexing/sitemap submission requires authenticated access not available here; do not claim submission.

## Four additional images — user-authorized follow-up

- Added four original AI-generated body illustrations: planning the break, offline activities, phone-free sleep and intentional return.
- Each is self-hosted under `/images`, 1200×675 WebP, under 100 KB, with descriptive alt text, explicit dimensions, lazy loading, asynchronous decoding and an AI-generated caption.
- Existing hero/social image, SEO/schema, original publication timestamp, slug, byline, article wording and links unchanged. Verified removing only the four new figure insertions reproduces the prior HTML exactly. Original Markdown unchanged.
- Full production build/typecheck passed; 72/72 repository tests passed. Publication requested by user; deployment verification pending below.
