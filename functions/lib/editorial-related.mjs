/** Targeted editorial selection. Rows are fetched from the live store, not copied. */
export function editorialRelatedSlugs(slug) {
  return slug === 'amd-on-device-ai-no-internet-2026'
    ? ['privacy-first-gadgets-2026','why-ai-phones-are-the-future-2026','how-to-protect-digital-privacy-2026']
    : null;
}
export function orderEditorialRelated(slug, rows) {
  const wanted=editorialRelatedSlugs(slug);
  return wanted ? wanted.map(s=>rows.find(r=>r.slug===s)).filter(Boolean) : rows;
}
