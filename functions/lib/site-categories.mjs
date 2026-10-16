/**
 * Single source of truth for the category pages the SSR layer can render.
 *
 * The sitemap, the homepage and the category routes all consult this module so
 * that a category can never be advertised in one place and 404 in another.
 * Category slugs themselves come from the database; the maps below only supply
 * presentation metadata and tell us which slugs have a real route handler.
 */

export const CATEGORY_NAMES = Object.freeze({
  tech: ["Tech"],
  culture: ["Culture"],
  lifestyle: ["Lifestyle"],
  "ai-tools": ["AI Tools"],
  "phone-tips": ["Phone Tips"],
  productivity: ["Productivity"],
  trending: ["Trending"],
  "ai-productivity": ["AI Tools", "Productivity"],
  "culture-lifestyle": ["Culture", "Lifestyle"],
});

export const CATEGORY_LABELS = Object.freeze({
  tech: "Tech",
  culture: "Culture",
  lifestyle: "Lifestyle",
  "ai-tools": "AI Tools",
  "phone-tips": "Phone Tips",
  productivity: "Productivity",
  trending: "Trending",
  "ai-productivity": "AI & Productivity",
  "culture-lifestyle": "Culture & Lifestyle",
});

export const CATEGORY_DESCRIPTIONS = Object.freeze({
  tech: "The latest news, reviews, and insights about technology.",
  culture: "Internet culture, social trends, and what the world is talking about.",
  lifestyle: "Modern living — wellness, work, and the way we spend our time.",
  "ai-tools": "Practical guides, reviews, and news about AI tools you can use today.",
  "phone-tips": "Get more from your smartphone with tips, tricks, and hidden features.",
  productivity: "Work smarter, not harder — tools, habits, and systems that actually work.",
  trending: "The most-read stories on Scrolltek right now.",
  "ai-productivity": "The best of AI Tools and Productivity — tools, tips, and systems that save you hours.",
  "culture-lifestyle": "Culture and Lifestyle stories — how we live, connect, and unwind.",
});

/** Render order for category sections and navigation. */
export const CATEGORY_ORDER = Object.freeze(Object.keys(CATEGORY_LABELS));

/**
 * Every valid, indexable category page, in render order.
 *
 * The router — not the `categories` table — decides whether a category page
 * exists. `ai-productivity` and `culture-lifestyle` are virtual mixed pages
 * with no row of their own, but both the SSR router and the client's
 * CategoryPage (SLUG_TO_NAME / MIXED_SLUG_MAP) render them with real content
 * and a self-referential canonical, so they are real indexable pages and must
 * be advertised. Conversely a `categories` row with no handler here would 404.
 */
export const RENDERABLE_CATEGORY_SLUGS = Object.freeze(CATEGORY_ORDER.slice());

export function validCategoryPages() {
  return CATEGORY_ORDER.map((slug) => ({ slug, name: CATEGORY_LABELS[slug] }));
}

export function isRenderableCategorySlug(slug) {
  return Object.hasOwn(CATEGORY_NAMES, slug);
}

export function categoryGroupNames(slug) {
  return CATEGORY_NAMES[slug] ?? [];
}

export function categoryDisplayName(slug) {
  return CATEGORY_LABELS[slug] ?? slug;
}

export function categoryDescription(slug) {
  return CATEGORY_DESCRIPTIONS[slug] ?? "";
}

/** Turns a stored category name ("AI Tools") into its route slug ("ai-tools"). */
export function categorySlugFromName(name) {
  return String(name ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");
}

/**
 * Orders category slugs by the canonical render order, keeping unknown slugs
 * (which have no route) at the end so callers can drop or label them.
 */
export function sortCategorySlugs(slugs) {
  const known = new Map(CATEGORY_ORDER.map((slug, index) => [slug, index]));
  return [...slugs].sort((a, b) => {
    const rankA = known.has(a) ? known.get(a) : Number.MAX_SAFE_INTEGER;
    const rankB = known.has(b) ? known.get(b) : Number.MAX_SAFE_INTEGER;
    if (rankA !== rankB) return rankA - rankB;
    return String(a).localeCompare(String(b));
  });
}
