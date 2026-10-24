# On-device AI — draft checks

- **DRAFT ONLY**: companion metadata has `status: draft`, `published: false`. This records a repository draft, not a persisted CMS update.
- Existing article verified from live public API: ID **4**, Liam Park / author **4**, category **Tech**; exact original publication timestamp **2026-05-26T15:35:23.685Z** retained. Live record was published; that live status has not been altered.
- Slug unchanged: `amd-on-device-ai-no-internet-2026`. No new post created.
- Draft modified date: **October 24, 2026**.
- H1: **What Is On-Device AI? How It Works, Why It Matters and Where It Falls Short**. Exactly one H1 in the standalone preview; body begins with the supplied byline, as requested.
- Article body saved verbatim as Markdown; rendered HTML only converts Markdown syntax to semantic elements. No factual or stylistic copy edits performed.
- Word count: **1822** (required 1,700–2,100): **PASS**. Includes supplied byline, headings and table contents; excludes H1, separate related reading, Markdown markers, link destinations and table separator row.
- Real HTML table: **1**, with header and seven comparison rows; own horizontal-scrolling container.
- All **6** internal body links remain relative and retain supplied anchor text. No external links introduced. Link HTTP statuses were not part of this draft task and have not been independently verified.
- No images, captions or old subtitle copied into the replacement draft. Existing live images are unchanged because publication is prohibited.
- Related reading replacement prepared separately, in requested order: privacy-first gadgets; AI phones; protecting digital privacy. Existing exact titles and excerpt descriptions copied from each live API response. Old e-ink/repairable/handheld cards excluded from this draft preview.
- Preview marked `noindex, nofollow`; no live routes, content overrides, sitemap, SEO schemas or media files changed.
- No commit, push, PR, merge, deployment or indexing requested/performed for this draft.
- Research/model/price claims are the supplied copy and were not independently fact-checked in this verbatim-save step.

## Prompt 2 — prepared publication, not deployed

Original Prompt 1 Markdown remains unchanged and SHA-256 regression checked. Prepared Markdown and runtime HTML include the authorized citations, factual corrections and images. The shared template owns the H1/byline/dates and puts the hero below the byline, before the intro; the supplied body byline is not duplicated below the hero.

### SEO, schema and media
- Exact title 45 characters and description 145 characters, synced across social tags. Canonical and slug unchanged; no redirect.
- Original full timestamp `2026-05-26T15:35:23.685Z` preserved, modified `2026-10-24`, sitemap override prepared.
- Three independent head scripts: Article, BreadcrumbList (Home > Tech > What Is On-Device AI?), seven FAQ pairs matching visible copy word for word. Publisher logo uses the existing `https://scrolltek.name.ng/favicon.svg` site constant.
- Hero: original generated conceptual illustration, 1600×900 WebP, 43,970 bytes, descriptive title and exact requested alt, eager/high-priority. Provenance saved in media notes, not used as an alt/caption substitute.
- Diagram: original in-house Pillow drawing, 1440×900 WebP, exact requested alt, descriptive title/caption, lazy and sized. Placed after the comparison table's following paragraph.
- Optional Windows screenshot omitted: no original team capture on an NPU-equipped machine available. No fake screenshot substituted.
- Body, hero and related-card image elements are local/self-hosted; target author uses local initials rather than hotlinked avatar. Related-card titles/descriptions fetched from existing live rows, in requested three-story order. Remote related images get existing local decorative placeholder, not relabeled stock imagery.
- Inbound links from privacy-first gadgets and AI phones reuse their existing link with exact anchor `on-device AI`, rather than adding duplicates.

### Claim/source checks
- Apple 2025 paper loaded and confirms approximately 3B. Current Apple developer docs/June 2026 updates describe a changed model without a parameter count. Both prose references now explicitly date 3B to 2025 and say the 2026 count is unstated, rather than presenting it as today's confirmed number.
- Google Store Pixel 11 page chunk 1 confirms $899 list price, distinct from conditional $439 trade-in offer.
- Newer Halo is now independently confirmed on AMD's October 12 launch and Micro Center's product page: Max+ PRO 495, 192GB, Linux, $7,299.99, in-store only; store availability varies. Added this update with primary citations. AMD attributes 300B+ capacity to 4-bit quantization and 160GB graphics allocation; do not equate capacity with throughput.
- AMD May 20 article confirms original Halo Max+ 395/up-to-128GB/200B claims and next-generation 192GB plan. Liquid/AMD Jan 5 article confirms specialized 2.6B demo and CPU/GPU/NPU support. The original draft's July/$3,999 historical sentence remains explicitly historical, not a current cheapest-configuration claim; original retailer-date check not independently repeated.
- Removed unlinked independent-GPU bandwidth comparison; replaced with a qualified memory-bandwidth/model/quantization constraint, not an unsupported comparative benchmark.
- Supplied Microsoft help/5039678 shows "page not found". Replaced with the loaded official Windows 11 specifications page, which explicitly lists Copilot+ 40+ TOPS, 16GB and 256GB requirements.
- Qualcomm official release located and loaded: https://www.qualcomm.com/news/releases/2025/09/new-snapdragon-x2-elite-extreme-and-snapdragon-x2-elite-are-the- (Sep 24, 2025; 80 TOPS).
- Added official inline AMD, Apple, Google, Microsoft and Qualcomm citations with `_blank` and `rel="noopener"`, plus the verified current retailer listing and Apple developer update.
- Old startup-time, unlimited/free-use, health-coach/finance/news-brief and speculative availability claims absent.
- Search volume 590/mo and KD 11 remain unverified brief metrics; not included as factual claims in article.

### Local verification and remaining gates
- 86/86 tests pass, full workspace typecheck/build passes, diff whitespace checks clean.
- Built React fixture preview at 390px and 1440px passes: single H1, ten ordered H2s, correct H3 hierarchy, table scroll contained, no page overflow, loaded eager hero below byline/above intro, diagram present, no remote images, three matching schemas, all three related stories in requested order. Mobile screenshot visually inspected.
- All six required internal URLs fetched actual corresponding article content. No missing target found, no link removed. The fetch tool does not expose numeric status codes; direct HEAD request failed TLS with SSL_ERROR_SYSCALL. Exact HTTP 200 results NOT claimed.
- Rich Results Test landing page loaded, but a test submission was not possible through available tools; interactive form/reCAPTCHA. No external validation pass claimed. Local schema tests do not substitute for a Google pass without editor approval.
- Indexing/sitemap submission not requested: publication has not occurred and authenticated Search Console access is unavailable.
- **Publication held** pending editor approval of the noted limitations or completion of external validation/status/keyword checks. No PR, merge, deployment or CMS write performed.
- A pre-existing Light Phone image-title regression surfaced in the inherited image audit; added missing descriptive title attributes to those inline images only. No copy, URLs, credits or imagery changed there.

## Editor decision — October 24, 2026

Editor selected **Approve exceptions and publish** in the conversation. This explicitly waives the pre-publication Google Rich Results test, numeric status-code confirmation, and keyword-metric confirmation. Apple wording stays qualified. Earlier hold statements describe the pre-approval state and are superseded by this decision. Publication is through the existing article's repository content override and versioned self-hosted public media, not a claimed CMS record/media-library write. Original ID, author, category, slug and publication timestamp are retained. Deployment/live checks to follow.

No separate image-rules document was found in the repository or a targeted connected Drive filename search. Applied the explicit image specifications and existing editorial image audit conventions.
Prepared Markdown count: **1,908 words**, within 1,700–2,100.
