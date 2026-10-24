import { db, articlesTable, authorsTable } from "@workspace/db";
import { eq, desc, and, inArray } from "drizzle-orm";
import { getCached, setCached } from "./cache";
import { getArticleSeoOverride } from "./article-seo";

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const SITE_NAME = "Scrolltek";
const SITE_URL = "https://scrolltek.name.ng";
const SITE_DESC =
  "Your go-to source for tech, digital culture, AI tools, phone tips, lifestyle, and the trends shaping how we live online.";

type MetaTags = {
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
  canonical: string;
  ogType?: string;
  ogImage?: string;
  ogImageWidth?: number;
  ogImageHeight?: number;
  articlePublishedTime?: string;
  articleModifiedTime?: string;
  articleAuthor?: string;
  articleSection?: string;
  articleTags?: string[];
  robots?: string;
};

interface RenderResult {
  bodyHtml: string;
  meta: MetaTags;
  jsonLd: string;
  breadcrumbJsonLd?: string;
  itemListJsonLd?: string;
  faqJsonLd?: string;
}

const ARTICLE_SSR_OVERRIDES: Record<string, {
  metaTitle?: string;
  exactTitle?: boolean;
  metaDescription?: string;
  ogTitle?: string;
  ogDescription?: string;
  updatedLabel?: string;
  dateModified?: string;
  robots?: string;
  schemaType?: "Article" | "NewsArticle";
  heroAlt?: string;
  heroCaption?: string;
  heroWidth?: number;
  heroHeight?: number;
  heroLoadingEager?: boolean;
  articleAuthorMeta?: string;
  emitArticleSectionAndTags?: boolean;
  enableSsrToc?: boolean;
  itemList?: Record<string, unknown>;
  graphJsonLd?: Record<string, unknown>;
  faqs?: { question: string; answer: string }[];
}> = {
  "dumb-tech-trend-2026": {
    heroAlt: "Light Phone III minimalist phone showing its black-and-white tool menu",
    heroCaption: "Photo: Light (thelightphone.com)",
    heroWidth: 1200,
    heroHeight: 630,
    heroLoadingEager: true,
  },
  "tesla-self-driving-cars-2026": {
    metaTitle: "What Is a Robotaxi? Where They Run in 2026",
    exactTitle: true,
    metaDescription: "A robotaxi is a driverless ride-hailing car. See how robotaxis work, where Waymo, Tesla and others operate in 2026, and how safe they are today.",
    ogTitle: "What Is a Robotaxi? Where They Run in 2026",
    ogDescription: "A robotaxi is a driverless ride-hailing car. See how robotaxis work, where Waymo, Tesla and others operate in 2026, and how safe they are today.",
    dateModified: "2026-10-24",
    updatedLabel: "Updated October 24, 2026",
    robots: "index, follow, max-image-preview:large",
    heroAlt: "A driverless robotaxi waiting at a city curb",
    heroCaption: "Photo: Dllu / Wikimedia Commons / CC BY 4.0",
    heroWidth: 1200,
    heroHeight: 630,
    heroLoadingEager: true,
  },
  "tiktok-brain-attention-span-2026": {
    metaTitle: "TikTok Brain: What Research Says & How to Fix It",
    exactTitle: true,
    metaDescription: "Is TikTok brain real? See what the research says about short-form video and attention, what it can’t prove, and 6 practical ways to reset your focus.",
    ogTitle: "TikTok Brain: What Research Says & How to Fix It",
    ogDescription: "Is TikTok brain real? See what the research says about short-form video and attention, what it can’t prove, and 6 practical ways to reset your focus.",
    dateModified: "2026-10-24",
    updatedLabel: "Updated October 24, 2026",
    robots: "index, follow, max-image-preview:large",
    heroAlt: "Person scrolling a vertical video feed on a smartphone in low light",
    heroCaption: "AI-generated editorial illustration.",
    heroWidth: 1200,
    heroHeight: 630,
    heroLoadingEager: true,
  },
  "what-is-vibe-coding-2026": {
    metaTitle: "What Is Vibe Coding? A Beginner's Guide (2026)",
    metaDescription:
      "Vibe coding means building software by describing it in plain English. Learn how it works, the best tools, the real risks and how to start.",
    updatedLabel: "Last updated: October 2026",
    dateModified: "2026-10-23T00:00:00.000Z",
    robots: "index, follow, max-image-preview:large",
    schemaType: "Article",
    heroAlt:
      "Illustration of a person describing an app idea to an AI that builds the software on a laptop screen",
    heroCaption:
      "Vibe coding lets you describe software in plain English and have AI build it.",
    heroWidth: 1200,
    heroHeight: 630,
    enableSsrToc: true,
    faqs: [
      {
        question: "Do you need coding experience to vibe code?",
        answer: "No — beginners build working personal tools and prototypes all the time without knowing syntax. Basic familiarity with how web pages, databases and environment variables work becomes helpful as soon as you want to publish an app for other people.",
      },
      {
        question: "Is vibe coding free?",
        answer: "You can start for free on most platforms, including Google AI Studio, GitHub Copilot's free tier, Replit, Bolt and Lovable's daily credit plans. Heavy building or deploying custom domains usually pushes you onto a $10 to $25 monthly plan.",
      },
      {
        question: "What programming languages work best for vibe coding?",
        answer: "JavaScript, TypeScript, HTML/CSS and Python work best because AI models have seen enormous amounts of public training code and mature frameworks in those languages. Most browser app builders default to React, TypeScript and Tailwind CSS automatically.",
      },
      {
        question: "Can you build a real business with vibe coding?",
        answer: "You can validate demand and build an early minimum viable product quickly, and many solo founders do. Before charging customers or storing sensitive data, plan on proper security review, automated tests and clean version control rather than pure prompt-and-pray edits.",
      },
      {
        question: "Is vibe coding safe?",
        answer: "For local scripts, mockups and personal utilities, yes. For public apps handling logins, payments or user data, raw AI-generated code often misses permissions and input validation, so human security checks remain essential.",
      },
      {
        question: "Will vibe coding replace software developers?",
        answer: "It changes what developers spend time on rather than removing the need for engineering judgment. Writing routine boilerplate gets much faster, while architecture, security, debugging complex systems and product decisions matter more.",
      },
    ],
  },
  "best-budget-wireless-earbuds-2026": {
    metaTitle: "Best Budget Wireless Earbuds in 2026 (Top 6)",
    metaDescription:
      "The best budget wireless earbuds in 2026, ranked for sound, battery life, ANC, calls, and fit—with honest pros, cons, and buying tips under $100.",
    updatedLabel: "Last updated: October 2026",
    dateModified: "2026-10-23T00:00:00.000Z",
    robots: "index, follow, max-image-preview:large",
    schemaType: "Article",
    heroAlt: "Pair of wireless earbuds beside their charging case",
    heroCaption:
      "You no longer need to spend $250 to get good wireless earbuds. Photo: Atelier by Vineeth / Unsplash.",
    heroWidth: 1200,
    heroHeight: 630,
    enableSsrToc: true,
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
    faqs: [
      {
        question: "Are budget wireless earbuds under $100 worth buying in 2026?",
        answer: "Yes. Well-reviewed pairs between $50 and $100 now deliver effective commuter ANC, multipoint pairing, solid app EQ, and reliable battery life. Flagship $250+ buds still lead on wind-noise call handling, spatial audio ecosystems, and top-end acoustic refinement, though most everyday listeners no longer need to spend that much.",
      },
      {
        question: "What is the difference between ANC and ENC on budget earbuds?",
        answer: "Active noise cancellation (ANC) reduces outside rumble in your own ears while listening to music or podcasts. Environmental noise cancellation (ENC) uses microphone filtering so the person on the other end of a phone call hears less background clatter—it does not quiet your surroundings.",
      },
      {
        question: "Which budget earbuds work best with iPhone vs. Android?",
        answer: "iPhones use the AAC Bluetooth codec across third-party earbuds, so prioritize comfort, app quality, multipoint stability, and ANC—where Soundcore Liberty 4 NC and CMF Buds 2 Plus perform well. Android phones with LDAC or aptX Lossless support can also take fuller advantage of models like EarFun Air Pro 4+.",
      },
      {
        question: "Should you buy in-ear ANC earbuds or open-ear clip earbuds?",
        answer: "Choose sealed in-ear ANC earbuds for noisy commutes, flights, gyms, and stronger sub-bass. Choose open-ear clips like the CMF Clip Pro when ear-canal comfort and hearing traffic, coworkers, or home activity clearly matter more than blocking noise.",
      },
      {
        question: "Why is real-world earbud battery life shorter than advertised?",
        answer: "Manufacturers usually publish headline figures at roughly 50% volume using standard SBC or AAC audio with active noise cancellation turned off. Enabling ANC, raising volume in loud environments, taking phone calls, or switching on high-bitrate codecs like LDAC draws noticeably more power.",
      },
      {
        question: "Do sub-$40 earbuds have real active noise cancellation?",
        answer: "Reputable entry-level models such as the JLab Go Pods ANC and CMF Buds 2a include genuine hybrid ANC that takes the edge off fan hum and light transit rumble, though deeper low-end isolation still steps up noticeably around the $55 to $100 tier.",
      },
    ],
  },
  "ai-tools-for-students-2026": {
    metaTitle: "Best AI Tools for Students in 2026 (Free & Paid)",
    metaDescription:
      "The best AI tools for students in 2026 for notes, research, writing and revision. See what's free, what's worth paying for and how to use them well.",
    ogTitle: "Best AI Tools for Students in 2026: What to Use and How",
    ogDescription:
      "Compare AI study tools for notes, research, writing and revision. Find free options, compare paid plans and learn responsible study methods.",
    updatedLabel: "Last updated: October 2026",
    dateModified: "2026-10-23T00:00:00Z",
    robots: "index, follow, max-image-preview:large",
    schemaType: "Article",
    heroAlt:
      "Student study desk with a laptop, notes and revision materials representing AI tools for students",
    heroCaption:
      "AI study tools can support research, note-taking and revision while students remain responsible for their learning.",
    heroWidth: 1200,
    heroHeight: 630,
    heroLoadingEager: true,
    articleAuthorMeta: "Anya Patel",
    emitArticleSectionAndTags: true,
    enableSsrToc: true,
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

async function getArticles(limit = 20) {
  const cacheKey = `ssr:articles:${limit}`;
  const cached = getCached<typeof articlesTable.$inferSelect[]>(cacheKey);
  if (cached) return cached;
  const rows = await db
    .select()
    .from(articlesTable)
    .where(eq(articlesTable.published, true))
    .orderBy(desc(articlesTable.publishedAt))
    .limit(limit);
  setCached(cacheKey, rows, 2 * 60 * 1000);
  return rows;
}

async function getAuthors() {
  const cacheKey = "ssr:authors";
  const cached = getCached<typeof authorsTable.$inferSelect[]>(cacheKey);
  if (cached) return cached;
  const rows = await db.select().from(authorsTable);
  setCached(cacheKey, rows, 10 * 60 * 1000);
  return rows;
}

function articleCard(slug: string, title: string, excerpt: string, category: string): string {
  return `<article><a href="/article/${esc(slug)}">${esc(title)}</a><span class="cat">${esc(category)}</span>${excerpt ? `<p>${esc(excerpt)}</p>` : ""}</article>`;
}

async function renderHome(): Promise<RenderResult> {
  const articles = await getArticles(20);
  const cards = articles.map((a) => articleCard(a.slug, a.title, a.excerpt ?? "", a.category)).join("");
  const bodyHtml = `<main id="ssr"><h1>${SITE_NAME} — Tech, Culture, Lifestyle &amp; AI Tools</h1>${cards}</main>`;

  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: `${SITE_URL}/`,
    description: SITE_DESC,
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/search?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  });

  return {
    bodyHtml,
    meta: { title: `${SITE_NAME} — Tech, Culture, Lifestyle & AI Tools`, description: SITE_DESC, canonical: `${SITE_URL}/` },
    jsonLd,
  };
}

async function renderArticle(slug: string): Promise<RenderResult | null> {
  const cacheKey = `ssr:article:${slug}`;
  const cached = getCached<RenderResult>(cacheKey);
  if (cached) return cached;

  const rows = await db
    .select()
    .from(articlesTable)
    .where(and(eq(articlesTable.slug, slug), eq(articlesTable.published, true)))
    .limit(1);
  if (!rows.length) return null;

  const a = rows[0];
  const authors = await getAuthors();
  const author = authors.find((au) => au.id === a.authorId);
  const articleSeoOverride = getArticleSeoOverride(a.slug);
  const seoOverride = Object.prototype.hasOwnProperty.call(ARTICLE_SSR_OVERRIDES, slug)
    ? ARTICLE_SSR_OVERRIDES[slug]
    : undefined;
  const metaTitleBase = articleSeoOverride?.metaTitle ?? seoOverride?.metaTitle ?? a.title;
  const metaDescription = articleSeoOverride?.metaDescription ?? seoOverride?.metaDescription ?? a.excerpt ?? SITE_DESC;
  const h1 = articleSeoOverride?.h1 ?? a.title;

  const canonicalUrl = `${SITE_URL}/article/${encodeURIComponent(slug)}`;
  const resolvedHeroImage = a.imageUrl ? new URL(a.imageUrl, `${SITE_URL}/`).href : undefined;
  const authorSlug = author ? author.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") : "";
  const authorUrl = authorSlug ? `${SITE_URL}/author/${encodeURIComponent(authorSlug)}` : undefined;
  const categoryName = String(a.category ?? "").trim();
  const categorySlug = categoryName.toLowerCase().replace(/\s+/g, "-");

  const tocMarkup = (() => {
    if (!seoOverride?.enableSsrToc || !a.body) return "";
    const items: string[] = [];
    const headingPattern = /<(h2|h3)\s+id="([a-z0-9][a-z0-9-]{0,120})">([\s\S]*?)<\/\1>/gi;
    let m: RegExpExecArray | null;
    while ((m = headingPattern.exec(a.body)) !== null) {
      const text = m[3].replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
      if (text) items.push(`<li><a href="#${esc(m[2])}">${esc(text)}</a></li>`);
    }
    return items.length >= 3
      ? `<nav aria-label="Table of contents"><h2>In this article</h2><ol>${items.join("")}</ol></nav>`
      : "";
  })();

  const heroFigureMarkup = resolvedHeroImage
    ? seoOverride
      ? `<figure><img src="${esc(resolvedHeroImage)}" alt="${esc(seoOverride.heroAlt ?? a.title)}" width="${seoOverride.heroWidth ?? 1200}" height="${seoOverride.heroHeight ?? 630}"${seoOverride.heroLoadingEager ? ' loading="eager"' : ""} fetchpriority="high" decoding="async" />${seoOverride.heroCaption ? `<figcaption>${esc(seoOverride.heroCaption)}</figcaption>` : ""}</figure>`
      : ""
    : "";

  const bodyHtml = `<main id="ssr">
    <h1>${esc(h1)}</h1>
    ${a.subtitle ? (seoOverride?.updatedLabel ? `<p><em>${esc(a.subtitle)}</em><br />${esc(seoOverride.updatedLabel)}</p>` : `<h2>${esc(a.subtitle)}</h2>`) : ""}
    ${a.excerpt && !seoOverride?.updatedLabel ? `<p class="excerpt">${esc(a.excerpt)}</p>` : ""}
    ${author ? `<address>By <span>${esc(author.name)}</span></address>` : ""}
    ${heroFigureMarkup}
    ${tocMarkup}
    ${a.body ?? ""}
  </main>`;

  const schemaType = seoOverride?.schemaType ?? "NewsArticle";
  const jsonLd = articleSeoOverride?.jsonLd
    ? JSON.stringify(articleSeoOverride.jsonLd)
    : seoOverride?.graphJsonLd
    ? JSON.stringify(seoOverride.graphJsonLd)
    : JSON.stringify({
        "@context": "https://schema.org",
        "@type": schemaType,
        headline: a.title,
        description: metaDescription,
        image: resolvedHeroImage
          ? seoOverride?.heroWidth && seoOverride?.heroHeight
            ? [{ "@type": "ImageObject", url: resolvedHeroImage, width: seoOverride.heroWidth, height: seoOverride.heroHeight }]
            : resolvedHeroImage
          : undefined,
        datePublished: a.publishedAt.toISOString(),
        ...(seoOverride?.dateModified ? { dateModified: seoOverride.dateModified } : {}),
        mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl },
        author: author
          ? { "@type": "Person", name: author.name, ...(seoOverride && authorUrl ? { url: authorUrl } : {}) }
          : undefined,
        publisher: {
          "@type": "Organization",
          name: SITE_NAME,
          url: SITE_URL,
          logo: { "@type": "ImageObject", url: `${SITE_URL}/favicon.svg` },
        },
        url: canonicalUrl,
      });

  const breadcrumbJsonLd = seoOverride && !seoOverride.graphJsonLd && !articleSeoOverride?.jsonLd
    ? JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
          ...(categoryName
            ? [{ "@type": "ListItem", position: 2, name: categoryName, item: `${SITE_URL}/category/${encodeURIComponent(categorySlug)}` }]
            : []),
          { "@type": "ListItem", position: categoryName ? 3 : 2, name: a.title, item: canonicalUrl },
        ],
      })
    : undefined;

  const itemListJsonLd = seoOverride?.itemList && !seoOverride.graphJsonLd
    ? JSON.stringify(seoOverride.itemList)
    : undefined;

  const faqJsonLd = seoOverride?.faqs?.length && !seoOverride.graphJsonLd
    ? JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: seoOverride.faqs.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      })
    : undefined;

  const result: RenderResult = {
    bodyHtml,
    meta: {
      title: seoOverride?.exactTitle ? metaTitleBase : `${metaTitleBase} — ${SITE_NAME}`,
      description: metaDescription,
      ogTitle: seoOverride?.ogTitle,
      ogDescription: seoOverride?.ogDescription,
      canonical: canonicalUrl,
      ogType: "article",
      ogImage: resolvedHeroImage,
      ogImageWidth: seoOverride?.heroWidth,
      ogImageHeight: seoOverride?.heroHeight,
      articlePublishedTime: articleSeoOverride?.publishedTime ?? (seoOverride ? a.publishedAt.toISOString() : undefined),
      articleModifiedTime: articleSeoOverride?.modifiedTime ?? seoOverride?.dateModified,
      articleAuthor: articleSeoOverride?.authorName ?? (seoOverride ? (seoOverride.articleAuthorMeta ?? authorUrl) : undefined),
      articleSection: seoOverride?.emitArticleSectionAndTags && categoryName ? categoryName : undefined,
      articleTags: seoOverride?.emitArticleSectionAndTags && Array.isArray(a.tags) ? a.tags : undefined,
      robots: seoOverride?.robots,
    },
    jsonLd,
    breadcrumbJsonLd,
    itemListJsonLd,
    faqJsonLd,
  };

  setCached(cacheKey, result, 5 * 60 * 1000);
  return result;
}

async function renderAuthor(slug: string): Promise<RenderResult | null> {
  const cacheKey = `ssr:author:${slug}`;
  const cached = getCached<RenderResult>(cacheKey);
  if (cached) return cached;

  const AUTHORS: Record<string, { name: string; title: string; bio: string }> = {
    "maya-chen":     { name: "Maya Chen",    title: "Senior Tech & AI Writer",          bio: "Covering the intersection of AI and everyday technology for over 8 years." },
    "james-okafor":  { name: "James Okafor", title: "Tech & Culture Writer",            bio: "Writing at the crossroads of technology and culture since 2018." },
    "sofia-reyes":   { name: "Sofia Reyes",  title: "Lifestyle & Culture Editor",       bio: "Exploring wellness, digital culture, and how technology shapes the way we live." },
    "liam-park":     { name: "Liam Park",    title: "Mobile & On-Device AI Specialist", bio: "Former software engineer turned mobile writer — obsessed with squeezing every bit of performance from your devices." },
    "anya-patel":    { name: "Anya Patel",   title: "AI Tools & Productivity Writer",   bio: "Testing AI productivity tools so you don't have to — with thousands of hours logged across ChatGPT, Claude, Gemini, and beyond." },
    "scrolltek-editorial": { name: "Scrolltek Editorial", title: "Editorial Team", bio: "The Scrolltek editorial team covers breaking stories and collaborative features across all categories." },
  };

  const author = AUTHORS[slug];
  if (!author) return null;

  const authorRows = await db.select().from(authorsTable).where(eq(authorsTable.name, author.name)).limit(1);
  const authorId = authorRows[0]?.id;
  const authorArticles = authorId
    ? await db.select({ slug: articlesTable.slug, title: articlesTable.title, excerpt: articlesTable.excerpt, category: articlesTable.category })
        .from(articlesTable)
        .where(and(eq(articlesTable.published, true), eq(articlesTable.authorId, authorId)))
        .orderBy(desc(articlesTable.publishedAt))
    : [];

  const cards = authorArticles.map(a => articleCard(a.slug, a.title, a.excerpt ?? "", a.category)).join("");
  const bodyHtml = `<main id="ssr">
    <h1>${esc(author.name)} — ${esc(author.title)}</h1>
    <p>${esc(author.bio)}</p>
    ${cards}
  </main>`;

  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Person",
    name: author.name,
    jobTitle: author.title,
    description: author.bio,
    url: `${SITE_URL}/author/${slug}`,
    worksFor: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
  });

  const result: RenderResult = {
    bodyHtml,
    meta: {
      title: `${author.name} — ${SITE_NAME}`,
      description: `${author.bio} Read all articles by ${author.name} on ${SITE_NAME}.`,
      canonical: `${SITE_URL}/author/${slug}`,
    },
    jsonLd,
  };

  setCached(cacheKey, result, 5 * 60 * 1000);
  return result;
}

const CATEGORY_LABELS: Record<string, string> = {
  tech: "Tech",
  culture: "Culture",
  lifestyle: "Lifestyle",
  "ai-tools": "AI Tools",
  "phone-tips": "Phone Tips",
  productivity: "Productivity",
  trending: "Trending",
  "ai-productivity": "AI & Productivity",
  "culture-lifestyle": "Culture & Lifestyle",
};
const MIXED_CATEGORY_SLUGS: Record<string, string[]> = {
  "ai-productivity": ["ai-tools", "productivity"],
  "culture-lifestyle": ["culture", "lifestyle"],
};

async function renderCategory(slug: string): Promise<RenderResult | null> {
  const label = CATEGORY_LABELS[slug];
  if (!label) return null;

  const query = db.select().from(articlesTable);
  let rows: (typeof articlesTable.$inferSelect)[];
  if (slug === "trending") {
    rows = await query
      .where(eq(articlesTable.published, true))
      .orderBy(desc(articlesTable.views), desc(articlesTable.publishedAt))
      .limit(100);
  } else {
    const categoryNames: string[] = (MIXED_CATEGORY_SLUGS[slug] ?? [slug]).map((categorySlug) => {
      return CATEGORY_LABELS[categorySlug];
    });
    const categoryFilter = categoryNames.length > 1
      ? inArray(articlesTable.category, categoryNames)
      : eq(articlesTable.category, categoryNames[0]);
    rows = await query
      .where(and(eq(articlesTable.published, true), categoryFilter))
      .orderBy(desc(articlesTable.publishedAt))
      .limit(100);
  }

  const cards = rows.map((a) => articleCard(a.slug, a.title, a.excerpt ?? "", a.category)).join("");
  const bodyHtml = `<main id="ssr"><h1>${esc(label)} — ${SITE_NAME}</h1>${cards}</main>`;

  return {
    bodyHtml,
    meta: {
      title: `${label} Articles — ${SITE_NAME}`,
      description: `Browse the latest ${label} articles on ${SITE_NAME}.`,
      canonical: `${SITE_URL}/category/${slug}`,
    },
    jsonLd: "",
  };
}

export async function renderForPath(urlPath: string): Promise<RenderResult | null> {
  const clean = urlPath.split("?")[0].replace(/\/+$/, "") || "/";

  if (clean === "/") return renderHome();

  const articleMatch = clean.match(/^\/article\/([^/]+)$/);
  if (articleMatch) return renderArticle(articleMatch[1]);

  const categoryMatch = clean.match(/^\/category\/([^/]+)$/);
  if (categoryMatch) return renderCategory(categoryMatch[1]);

  const authorMatch = clean.match(/^\/author\/([^/]+)$/);
  if (authorMatch) return renderAuthor(authorMatch[1]);

  return null;
}

function replaceOrInsertHeadTag(html: string, matcher: RegExp, tag: string): string {
  if (matcher.test(html)) return html.replace(matcher, tag);
  return html.replace(/<\/head\s*>/i, `${tag}\n</head>`);
}

// The shell's <noscript id="homepage-fallback"> block is homepage-only
// content (it even carries its own h1). Serving it on every route would put a
// second, wrong H1 into the server-rendered HTML of non-home pages, so the
// production SSR drops it everywhere except the homepage — mirroring
// removeHomepageFallback in functions/lib/seo-html.mjs.
const HOMEPAGE_FALLBACK_PATTERN = /<noscript\s+id=["']homepage-fallback["'][^>]*>[\s\S]*?<\/noscript>/i;

export function removeHomepageFallback(template: string): string {
  return template.replace(HOMEPAGE_FALLBACK_PATTERN, "");
}

export function injectIntoHtml(
  template: string,
  result: RenderResult
): string {
  let html = template;
  html = replaceOrInsertHeadTag(
    html,
    /<title\b[^>]*>[\s\S]*?<\/title>/i,
    `<title>${esc(result.meta.title)}</title>`,
  );
  html = replaceOrInsertHeadTag(
    html,
    /<meta\s+name=["']description["'][^>]*>/i,
    `<meta name="description" content="${esc(result.meta.description)}" />`,
  );
  const socialTitle = result.meta.ogTitle ?? result.meta.title;
  const socialDesc = result.meta.ogDescription ?? result.meta.description;
  html = replaceOrInsertHeadTag(
    html,
    /<meta\s+property=["']og:title["'][^>]*>/i,
    `<meta property="og:title" content="${esc(socialTitle)}" />`,
  );
  html = replaceOrInsertHeadTag(
    html,
    /<meta\s+property=["']og:description["'][^>]*>/i,
    `<meta property="og:description" content="${esc(socialDesc)}" />`,
  );
  html = replaceOrInsertHeadTag(
    html,
    /<meta\s+name=["']twitter:title["'][^>]*>/i,
    `<meta name="twitter:title" content="${esc(socialTitle)}" />`,
  );
  html = replaceOrInsertHeadTag(
    html,
    /<meta\s+name=["']twitter:description["'][^>]*>/i,
    `<meta name="twitter:description" content="${esc(socialDesc)}" />`,
  );

  if (result.meta.canonical) {
    html = replaceOrInsertHeadTag(
      html,
      /<link\s+rel=["']canonical["'][^>]*>/i,
      `<link rel="canonical" href="${esc(result.meta.canonical)}" />`,
    );
    html = replaceOrInsertHeadTag(
      html,
      /<meta\s+property=["']og:url["'][^>]*>/i,
      `<meta property="og:url" content="${esc(result.meta.canonical)}" />`,
    );
    html = replaceOrInsertHeadTag(
      html,
      /<meta\s+name=["']twitter:url["'][^>]*>/i,
      `<meta name="twitter:url" content="${esc(result.meta.canonical)}" />`,
    );
  } else {
    html = html.replace(/<link\s+rel=["']canonical["'][^>]*>/gi, "");
    html = html.replace(/<meta\s+property=["']og:url["'][^>]*>/gi, "");
  }

  if (result.meta.ogType) {
    html = replaceOrInsertHeadTag(
      html,
      /<meta\s+property=["']og:type["'][^>]*>/i,
      `<meta property="og:type" content="${esc(result.meta.ogType)}" />`,
    );
  }

  if (result.meta.ogImage) {
    html = replaceOrInsertHeadTag(
      html,
      /<meta\s+property=["']og:image["'][^>]*>/i,
      `<meta property="og:image" content="${esc(result.meta.ogImage)}" />`,
    );
    html = replaceOrInsertHeadTag(
      html,
      /<meta\s+name=["']twitter:image["'][^>]*>/i,
      `<meta name="twitter:image" content="${esc(result.meta.ogImage)}" />`,
    );
    html = replaceOrInsertHeadTag(
      html,
      /<meta\s+name=["']twitter:card["'][^>]*>/i,
      '<meta name="twitter:card" content="summary_large_image" />',
    );
    if (result.meta.ogImageWidth) {
      html = replaceOrInsertHeadTag(
        html,
        /<meta\s+property=["']og:image:width["'][^>]*>/i,
        `<meta property="og:image:width" content="${result.meta.ogImageWidth}" />`,
      );
    }
    if (result.meta.ogImageHeight) {
      html = replaceOrInsertHeadTag(
        html,
        /<meta\s+property=["']og:image:height["'][^>]*>/i,
        `<meta property="og:image:height" content="${result.meta.ogImageHeight}" />`,
      );
    }
  } else {
    html = html.replace(/<meta\s+property=["']og:image["'][^>]*>/gi, "");
    html = html.replace(/<meta\s+name=["']twitter:image["'][^>]*>/gi, "");
  }

  if (result.meta.articlePublishedTime) {
    html = replaceOrInsertHeadTag(
      html,
      /<meta\s+property=["']article:published_time["'][^>]*>/i,
      `<meta property="article:published_time" content="${esc(result.meta.articlePublishedTime)}" />`,
    );
  }
  if (result.meta.articleModifiedTime) {
    html = replaceOrInsertHeadTag(
      html,
      /<meta\s+property=["']article:modified_time["'][^>]*>/i,
      `<meta property="article:modified_time" content="${esc(result.meta.articleModifiedTime)}" />`,
    );
  }
  if (result.meta.articleAuthor) {
    html = replaceOrInsertHeadTag(
      html,
      /<meta\s+property=["']article:author["'][^>]*>/i,
      `<meta property="article:author" content="${esc(result.meta.articleAuthor)}" />`,
    );
  }
  if (result.meta.articleSection) {
    html = replaceOrInsertHeadTag(
      html,
      /<meta\s+property=["']article:section["'][^>]*>/i,
      `<meta property="article:section" content="${esc(result.meta.articleSection)}" />`,
    );
  }
  if (Array.isArray(result.meta.articleTags) && result.meta.articleTags.length > 0) {
    const tagsMarkup = result.meta.articleTags
      .map((tag) => `<meta property="article:tag" content="${esc(tag)}" />`)
      .join("\n");
    html = html.replace(/<\/head\s*>/i, `${tagsMarkup}\n</head>`);
  }

  if (result.meta.robots) {
    html = replaceOrInsertHeadTag(
      html,
      /<meta\s+name=["']robots["'][^>]*>/i,
      `<meta name="robots" content="${esc(result.meta.robots)}" />`,
    );
  }

  if (result.jsonLd) {
    const safeJsonLd = result.jsonLd
      .replace(/</g, "\\u003c")
      .replace(/>/g, "\\u003e")
      .replace(/&/g, "\\u0026")
      .replace(/\u2028/g, "\\u2028")
      .replace(/\u2029/g, "\\u2029");
    let schemaType = "";
    let hasGraph = false;
    try {
      const parsed = JSON.parse(result.jsonLd);
      schemaType = parsed["@type"] ?? "";
      hasGraph = Array.isArray(parsed["@graph"]);
    } catch {
      // Keep malformed structured data out of the response.
      schemaType = "";
    }
    const scriptId = hasGraph || schemaType === "NewsArticle" || schemaType === "Article"
      ? "article-jsonld"
      : schemaType === "Person"
        ? "author-jsonld"
        : schemaType === "WebSite"
          ? "website-jsonld"
          : "page-jsonld";
    if (schemaType || hasGraph) {
      const script = `<script type="application/ld+json" id="${scriptId}">${safeJsonLd}</script>`;
      const matcher = new RegExp(`<script\\b(?=[^>]*\\bid=["']${scriptId}["'])[^>]*>[\\s\\S]*?<\\/script>`, "i");
      html = replaceOrInsertHeadTag(html, matcher, script);
    }
  }

  if (result.breadcrumbJsonLd) {
    const safeBreadcrumbJsonLd = result.breadcrumbJsonLd
      .replace(/</g, "\\u003c")
      .replace(/>/g, "\\u003e")
      .replace(/&/g, "\\u0026")
      .replace(/\u2028/g, "\\u2028")
      .replace(/\u2029/g, "\\u2029");
    const breadcrumbScript = `<script type="application/ld+json" id="breadcrumb-jsonld">${safeBreadcrumbJsonLd}</script>`;
    const breadcrumbMatcher = /<script\b(?=[^>]*\bid=["']breadcrumb-jsonld["'])[^>]*>[\s\S]*?<\/script>/i;
    html = replaceOrInsertHeadTag(html, breadcrumbMatcher, breadcrumbScript);
  }

  if (result.itemListJsonLd) {
    const safeItemListJsonLd = result.itemListJsonLd
      .replace(/</g, "\\u003c")
      .replace(/>/g, "\\u003e")
      .replace(/&/g, "\\u0026")
      .replace(/\u2028/g, "\\u2028")
      .replace(/\u2029/g, "\\u2029");
    const itemListScript = `<script type="application/ld+json" id="itemlist-jsonld">${safeItemListJsonLd}</script>`;
    const itemListMatcher = /<script\b(?=[^>]*\bid=["']itemlist-jsonld["'])[^>]*>[\s\S]*?<\/script>/i;
    html = replaceOrInsertHeadTag(html, itemListMatcher, itemListScript);
  }

  if (result.faqJsonLd) {
    const safeFaqJsonLd = result.faqJsonLd
      .replace(/</g, "\\u003c")
      .replace(/>/g, "\\u003e")
      .replace(/&/g, "\\u0026")
      .replace(/\u2028/g, "\\u2028")
      .replace(/\u2029/g, "\\u2029");
    const faqScript = `<script type="application/ld+json" id="faq-jsonld">${safeFaqJsonLd}</script>`;
    const faqMatcher = /<script\b(?=[^>]*\bid=["']faq-jsonld["'])[^>]*>[\s\S]*?<\/script>/i;
    html = replaceOrInsertHeadTag(html, faqMatcher, faqScript);
  }

  html = html.replace(
    /<div\s+id=["']root["']\s*>\s*<\/div>/i,
    `<div id="root">${result.bodyHtml}</div>`,
  );
  if (result.meta.canonical !== `${SITE_URL}/`) {
    html = html.replace(/<noscript\s+id=["']homepage-fallback["'][^>]*>[\s\S]*?<\/noscript>/gi, "");
  }
  return html;
}

export function injectCanonicalIntoHtml(
  template: string,
  pathname: string,
  robots?: string,
  pageMeta: { title?: string; description?: string } = {},
): string {
  const path = pathname.split(/[?#]/, 1)[0].replace(/\/{2,}/g, "/");
  const canonicalPath = path.length > 1 ? path.replace(/\/+$/, "") : "/";
  const canonical = `${SITE_URL}${canonicalPath}`;
  let html = template;

  if (pageMeta.title) {
    html = replaceOrInsertHeadTag(
      html,
      /<title\b[^>]*>[\s\S]*?<\/title>/i,
      `<title>${esc(pageMeta.title)}</title>`,
    );
    html = replaceOrInsertHeadTag(
      html,
      /<meta\s+property=["']og:title["'][^>]*>/i,
      `<meta property="og:title" content="${esc(pageMeta.title)}" />`,
    );
    html = replaceOrInsertHeadTag(
      html,
      /<meta\s+name=["']twitter:title["'][^>]*>/i,
      `<meta name="twitter:title" content="${esc(pageMeta.title)}" />`,
    );
  }

  if (pageMeta.description) {
    html = replaceOrInsertHeadTag(
      html,
      /<meta\s+name=["']description["'][^>]*>/i,
      `<meta name="description" content="${esc(pageMeta.description)}" />`,
    );
    html = replaceOrInsertHeadTag(
      html,
      /<meta\s+property=["']og:description["'][^>]*>/i,
      `<meta property="og:description" content="${esc(pageMeta.description)}" />`,
    );
    html = replaceOrInsertHeadTag(
      html,
      /<meta\s+name=["']twitter:description["'][^>]*>/i,
      `<meta name="twitter:description" content="${esc(pageMeta.description)}" />`,
    );
  }

  html = replaceOrInsertHeadTag(
    html,
    /<link\s+rel=["']canonical["'][^>]*>/i,
    `<link rel="canonical" href="${esc(canonical)}" />`,
  );
  html = replaceOrInsertHeadTag(
    html,
    /<meta\s+property=["']og:url["'][^>]*>/i,
    `<meta property="og:url" content="${esc(canonical)}" />`,
  );

  if (robots) {
    html = replaceOrInsertHeadTag(
      html,
      /<meta\s+name=["']robots["'][^>]*>/i,
      `<meta name="robots" content="${esc(robots)}" />`,
    );
  }
  return html;
}

export function injectNotFoundIntoHtml(template: string, pathname: string): string {
  const path = esc(pathname || "/");
  return injectIntoHtml(template, {
    bodyHtml: `<main id="ssr"><h1>Page not found</h1><p>We couldn't find a page at ${path}.</p><p><a href="/">Return to Scrolltek</a></p></main>`,
    meta: {
      title: `Page Not Found — ${SITE_NAME}`,
      description: "The requested Scrolltek page could not be found.",
      canonical: "",
      robots: "noindex, follow",
    },
    jsonLd: "",
  });
}

export function injectUnavailableIntoHtml(template: string): string {
  return injectIntoHtml(template, {
    bodyHtml: "<main id=\"ssr\"><h1>Page temporarily unavailable</h1><p>Please try again shortly.</p></main>",
    meta: {
      title: `Temporarily Unavailable — ${SITE_NAME}`,
      description: "This Scrolltek page is temporarily unavailable. Please try again shortly.",
      canonical: "",
      robots: "noindex, follow",
    },
    jsonLd: "",
  });
}
