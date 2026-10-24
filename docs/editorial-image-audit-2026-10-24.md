# Editorial image-details cleanup

## Scope
Eight previously revised article templates: social media detox, AI phones, JOMO, Light Phone/dumb tech, e ink tablets, vibe coding, budget earbuds, AI tools for students. This is an image-metadata/rendering cleanup, not a new factual review or rewrite of article prose.

## Changes
- Descriptive image titles added to all eight hero overrides and the eight inline images in these article bodies. Server and client hero rendering support the title consistently.
- Descriptive alt text retained where already appropriate; the AI phones alt is now a direct description without provenance boilerplate or unverified brand/model names.
- Generic AI-generation captions replaced with context-specific captions on the social media detox and AI phones pages. Origin/type/rights retained in media provenance notes. Real photo credits retained.
- Social sharing images receive `og:image:alt` and `twitter:image:alt`, with cleanup on client navigation so stale alt text does not leak between pages.
- Width/height attributes retained, body images remain lazy-loaded, hero LCP images explicitly eager with high fetch priority. Table layout, links, headings and article wording unchanged.
- Original Prompt 1 Markdown remains unchanged. Rendered HTML/media records reflect the later authorized image edits.

## Example
Planning image title: **Plan your seven-day social media break**.
Alt: **A blank paper planner, pencil, clock and face-down phone on a desk for planning a social media break.**
Caption: **Set a start date, an end date and a replacement for scrolling.**

## Verification
80/80 repository tests passed, including per-article regression checks for image titles, alt text, dimensions and social-image descriptions. Full workspace typecheck/production build passed. No new external image-rights verification, browser screenshot review or Search Console request performed in this cleanup. Image titles are supplementary labels, not a promised ranking boost; alt text and relevant visible context remain the accessibility/SEO priority.
