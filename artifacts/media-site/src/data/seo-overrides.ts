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
  itemList?: Record<string, unknown>;
}

export const ARTICLE_SEO_OVERRIDES: Record<string, ArticleSeoOverride> = {
  "e-ink-gadgets-comeback-2026": {
    metaTitle: "Best E Ink Tablets in 2026: Are They Worth It?",
    metaDescription:
      "Looking for an e ink tablet? Compare the best options for reading, note-taking and work, with battery life, prices and who should buy one.",
    dateModified: "2026-10-23T00:00:00.000Z",
    updatedLabel: "Last updated: October 2026",
    robots: "index, follow, max-image-preview:large",
    schemaType: "Article",
    heroAlt: "A hand uses a stylus over a tablet screen beside a keyboard and smartphone.",
    heroCaption: "A stylus-equipped tablet can serve as a digital note-taking surface. Photo: Jakub Zerdzicki / Pexels.",
    heroWidth: 1200,
    heroHeight: 630,
    bodyIncludesFaq: true,
    itemList: {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Best E Ink Tablets by Use",
      itemListOrder: "https://schema.org/ItemListUnordered",
      numberOfItems: 5,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Reading books — Kindle Paperwhite (2026)", item: { "@type": "Thing", name: "Kindle Paperwhite (2026)" }, description: "$199.99; waterproof, warm light, up to 12 weeks of battery. Main catch: Amazon ecosystem only; ships Oct. 28." },
        { "@type": "ListItem", position: 2, name: "Handwriting notes — reMarkable Paper Pure", item: { "@type": "Thing", name: "reMarkable Paper Pure" }, description: "$399; widely praised writing feel, up to 3 weeks of battery. Main catch: no front light, no color, paid Connect features." },
        { "@type": "ListItem", position: 3, name: "PDFs and work — Boox Go 10.3 (Gen II) Lumi", item: { "@type": "Thing", name: "Boox Go 10.3 (Gen II) Lumi" }, description: "$449.99; Android 15, Google Play, 300 ppi, front light. Main catch: Android invites distractions; some lag." },
        { "@type": "ListItem", position: 4, name: "Budget — Boox Go 6 (Gen II)", item: { "@type": "Thing", name: "Boox Go 6 (Gen II)" }, description: "$199, pen extra; pocket-size, Android, microSD slot. Main catch: 6-inch screen, old Android 11." },
        { "@type": "ListItem", position: 5, name: "Color — Boox Note Air5 C", item: { "@type": "Thing", name: "Boox Note Air5 C" }, description: "$529.99; 10.3-inch color, Android 15, pen and case included. Main catch: muted color at 150 ppi." },
      ],
    },
  },
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
