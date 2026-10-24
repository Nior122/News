export interface ArticleSeoOverride {
  metaTitle?: string;
  exactTitle?: boolean;
  metaDescription?: string;
  ogTitle?: string;
  ogDescription?: string;
  dateModified?: string;
  updatedLabel?: string;
  robots?: string;
  schemaType?: "Article" | "NewsArticle";
  heroAlt?: string;
  heroCaption?: string;
  heroWidth?: number;
  heroHeight?: number;
  heroLoadingEager?: boolean;
  bodyIncludesFaq?: boolean;
  itemList?: Record<string, unknown>;
  graphJsonLd?: Record<string, unknown>;
}

export const ARTICLE_SEO_OVERRIDES: Record<string, ArticleSeoOverride> = {
  "dumb-tech-trend-2026": {
    heroAlt: "Light Phone III minimalist phone showing its black-and-white tool menu",
    heroCaption: "Photo: Light (thelightphone.com)",
    heroWidth: 1200,
    heroHeight: 630,
    heroLoadingEager: true,
  },
  "digital-detox-jomo-2026": {
  "metaTitle": "What Is JOMO? The Joy of Missing Out Explained",
  "metaDescription": "JOMO means the joy of missing out. Learn where the term came from, how it differs from FOMO and digital detox, and 7 simple ways to practice it.",
  "ogTitle": "What Is JOMO? The Joy of Missing Out Explained",
  "ogDescription": "JOMO means the joy of missing out. Learn where the term came from, how it differs from FOMO and digital detox, and 7 simple ways to practice it.",
  "dateModified": "2026-10-24",
  "updatedLabel": "Updated: October 24, 2026",
  "robots": "index, follow, max-image-preview:large",
  "schemaType": "Article",
  "heroAlt": "Person reading a book by a window with a phone face down on the table, an everyday example of JOMO, the joy of missing out",
  "heroWidth": 1200,
  "heroHeight": 630,
  "heroLoadingEager": true,
  "bodyIncludesFaq": true,
  "exactTitle": true
},
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
  "best-budget-wireless-earbuds-2026": {
    metaTitle: "Best Budget Wireless Earbuds in 2026 (Top 6)",
    metaDescription:
      "The best budget wireless earbuds in 2026, ranked for sound, battery life, ANC, calls, and fit—with honest pros, cons, and buying tips under $100.",
    dateModified: "2026-10-23T00:00:00.000Z",
    updatedLabel: "Last updated: October 2026",
    robots: "index, follow, max-image-preview:large",
    schemaType: "Article",
    heroAlt: "Pair of wireless earbuds beside their charging case",
    heroCaption:
      "You no longer need to spend $250 to get good wireless earbuds. Photo: Atelier by Vineeth / Unsplash.",
    heroWidth: 1200,
    heroHeight: 630,
    bodyIncludesFaq: true,
    itemList: {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Best Budget Wireless Earbuds in 2026",
      itemListOrder: "https://schema.org/ItemListOrderAscending",
      numberOfItems: 6,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Soundcore Liberty 4 NC — Best Overall Budget Wireless Earbuds",
          url: "https://scrolltek.name.ng/article/best-budget-wireless-earbuds-2026#1-soundcore-liberty-4-nc-best-overall-budget-wireless-earbuds",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "EarFun Air Pro 4+ — Best Feature-Packed Pick Under $100",
          url: "https://scrolltek.name.ng/article/best-budget-wireless-earbuds-2026#2-earfun-air-pro-4-plus-best-feature-packed-pick-under-100",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "CMF Buds 2 Plus — Best Value Around $50 to $60",
          url: "https://scrolltek.name.ng/article/best-budget-wireless-earbuds-2026#3-cmf-buds-2-plus-best-value-around-50-to-60",
        },
        {
          "@type": "ListItem",
          position: 4,
          name: "JLab Go Pods ANC — Best for Tight Budgets Under $40",
          url: "https://scrolltek.name.ng/article/best-budget-wireless-earbuds-2026#4-jlab-go-pods-anc-best-for-tight-budgets-under-40",
        },
        {
          "@type": "ListItem",
          position: 5,
          name: "CMF Buds 2a — Best Entry-Level CMF Pick Under $40",
          url: "https://scrolltek.name.ng/article/best-budget-wireless-earbuds-2026#5-cmf-buds-2a-best-entry-level-cmf-pick-under-40",
        },
        {
          "@type": "ListItem",
          position: 6,
          name: "CMF Clip Pro — Best Open-Ear Budget Earbuds",
          url: "https://scrolltek.name.ng/article/best-budget-wireless-earbuds-2026#6-cmf-clip-pro-best-open-ear-budget-earbuds",
        },
      ],
    },
  },
  "ai-tools-for-students-2026": {
    metaTitle: "Best AI Tools for Students in 2026 (Free & Paid)",
    metaDescription:
      "The best AI tools for students in 2026 for notes, research, writing and revision. See what's free, what's worth paying for and how to use them well.",
    ogTitle: "Best AI Tools for Students in 2026: What to Use and How",
    ogDescription:
      "Compare AI study tools for notes, research, writing and revision. Find free options, compare paid plans and learn responsible study methods.",
    dateModified: "2026-10-23T00:00:00Z",
    updatedLabel: "Last updated: October 2026",
    robots: "index, follow, max-image-preview:large",
    schemaType: "Article",
    heroAlt:
      "Student study desk with a laptop, notes and revision materials representing AI tools for students",
    heroCaption:
      "AI study tools can support research, note-taking and revision while students remain responsible for their learning.",
    heroWidth: 1200,
    heroHeight: 630,
    heroLoadingEager: true,
    bodyIncludesFaq: true,
    graphJsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Article",
          headline: "Best AI Tools for Students in 2026: What to Use and How",
          description:
            "The best AI tools for students in 2026 for notes, research, writing and revision. See what's free, what's worth paying for and how to use them well.",
          image: [
            "https://scrolltek.name.ng/images/ai-tools-for-students-study-guide.webp",
            "https://scrolltek.name.ng/images/ai-study-active-recall-workflow.svg",
          ],
          author: {
            "@type": "Person",
            name: "Anya Patel",
            url: "https://scrolltek.name.ng/author/anya-patel",
          },
          publisher: {
            "@type": "Organization",
            name: "Scrolltek",
            url: "https://scrolltek.name.ng/",
          },
          datePublished: "2026-05-27T17:15:38.636Z",
          dateModified: "2026-10-23T00:00:00Z",
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": "https://scrolltek.name.ng/article/ai-tools-for-students-2026",
          },
          articleSection: "AI Tools",
          keywords: [
            "ai tools for students",
            "best ai study tools",
            "ai tools for studying",
            "free ai tools for students",
            "ai note taking for students",
            "ai study apps",
            "how to use chatgpt to study",
          ],
        },
        {
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: "https://scrolltek.name.ng/",
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "AI Tools",
              item: "https://scrolltek.name.ng/category/ai-tools",
            },
            {
              "@type": "ListItem",
              position: 3,
              name: "Best AI Tools for Students in 2026: What to Use and How",
              item: "https://scrolltek.name.ng/article/ai-tools-for-students-2026",
            },
          ],
        },
        {
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "Is using AI to study cheating?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Not automatically. Using AI to clarify a concept, generate practice questions or organise revision may be permitted, but the rules depend on your school, instructor and assignment. Submitting AI-generated work as your own can violate academic integrity requirements. Check your course policy and disclose assistance when required.",
              },
            },
            {
              "@type": "Question",
              name: "What is the best free AI tool for students?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "There is no single best option for every student. ChatGPT or Claude can help explain concepts, Perplexity can support source discovery, NotebookLM can work with supplied readings and Grammarly can check basic writing. Start with the tool that addresses your main study problem and confirm its current free-plan limits.",
              },
            },
            {
              "@type": "Question",
              name: "Which AI tool is best for note-taking?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "NotebookLM is useful for asking questions about a collection of supplied readings, while Notion can organise notes alongside tasks and deadlines. Neither replaces checking your original sources. Choose based on whether your priority is understanding documents or managing a long-term study workspace.",
              },
            },
            {
              "@type": "Question",
              name: "Can AI make flashcards?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Yes. General-purpose assistants can draft question-and-answer cards from notes, and Quizlet provides dedicated flashcard and learning features. Check every card for accuracy, especially formulas, dates and definitions. Good cards test one clear idea and require you to retrieve the answer rather than simply recognise it.",
              },
            },
            {
              "@type": "Question",
              name: "Do I need to pay for AI study tools?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Usually not when you are starting. Free plans can cover basic explanations, research discovery, writing feedback and some revision tasks. Pay only when you repeatedly hit a meaningful limit or need a specific paid feature. Check the current price and cancellation terms before subscribing.",
              },
            },
            {
              "@type": "Question",
              name: "Can AI help if English is my second language?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Yes. You can ask an assistant to explain vocabulary, compare sentence structures, practise conversations or give feedback on a paragraph you wrote. Ask it to explain the reason for each correction so you learn the underlying rule. Check that suggested edits preserve your intended meaning and follow your course's AI policy.",
              },
            },
          ],
        },
        {
          "@type": "ItemList",
          name: "Quick List: Best AI Tools for Students",
          itemListOrder: "https://schema.org/ItemListUnordered",
          numberOfItems: 8,
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "ChatGPT — Explanations, practice questions and study planning", item: { "@type": "Thing", name: "ChatGPT" } },
            { "@type": "ListItem", position: 2, name: "Notion — Organised notes, tasks and study dashboards", item: { "@type": "Thing", name: "Notion" } },
            { "@type": "ListItem", position: 3, name: "Perplexity — Research and finding cited web sources", item: { "@type": "Thing", name: "Perplexity" } },
            { "@type": "ListItem", position: 4, name: "Quizlet — Flashcards and structured revision", item: { "@type": "Thing", name: "Quizlet" } },
            { "@type": "ListItem", position: 5, name: "Grammarly — Grammar, clarity and writing feedback", item: { "@type": "Thing", name: "Grammarly" } },
            { "@type": "ListItem", position: 6, name: "Claude — Detailed explanations and working with long documents", item: { "@type": "Thing", name: "Claude" } },
            { "@type": "ListItem", position: 7, name: "Gemini — Explanations and work across Google's tools", item: { "@type": "Thing", name: "Gemini" } },
            { "@type": "ListItem", position: 8, name: "NotebookLM — Questions and study guides grounded in your sources", item: { "@type": "Thing", name: "NotebookLM" } },
          ],
        },
      ],
    },
  },
};

export function getArticleSeoOverride(slug?: string | null): ArticleSeoOverride | null {
  if (!slug) return null;
  return Object.prototype.hasOwnProperty.call(ARTICLE_SEO_OVERRIDES, slug)
    ? ARTICLE_SEO_OVERRIDES[slug]
    : null;
}
