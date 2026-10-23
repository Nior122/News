export interface ArticleSeoOverride {
  metaTitle?: string;
  metaDescription?: string;
  dateModified?: string;
  updatedLabel?: string;
  robots?: string;
  schemaType?: "Article" | "NewsArticle";
  heroAlt?: string;
  heroCaption?: string;
  heroWidth?: number;
  heroHeight?: number;
  bodyIncludesFaq?: boolean;
}

export const ARTICLE_SEO_OVERRIDES: Record<string, ArticleSeoOverride> = {
  "what-is-vibe-coding-2026": {
    metaTitle: "What Is Vibe Coding? A Beginner's Guide (2026)",
    metaDescription:
      "Vibe coding means building software by describing it in plain English. Learn how it works, the best tools, the real risks and how to start.",
    dateModified: "2026-10-23T00:00:00.000Z",
    updatedLabel: "Last updated: October 2026",
    robots: "index, follow, max-image-preview:large",
    schemaType: "Article",
    heroAlt:
      "Illustration of a person describing an app idea to an AI that builds the software on a laptop screen",
    heroCaption:
      "Vibe coding lets you describe software in plain English and have AI build it.",
    heroWidth: 1200,
    heroHeight: 630,
    bodyIncludesFaq: true,
  },
};

export function getArticleSeoOverride(slug?: string | null): ArticleSeoOverride | null {
  if (!slug) return null;
  return Object.prototype.hasOwnProperty.call(ARTICLE_SEO_OVERRIDES, slug)
    ? ARTICLE_SEO_OVERRIDES[slug]
    : null;
}
