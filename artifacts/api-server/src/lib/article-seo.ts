/**
 * Per-article SEO overrides.
 *
 * The SSR article renderer derives the <title> tag, the Open Graph title and the
 * on-page H1 from the same `title` field. These overrides let a single article
 * ship a search title that differs from its on-page H1, pin the exact meta
 * description, and replace the auto-generated JSON-LD with a hand-built
 * @graph (Article + BreadcrumbList + FAQPage).
 */
export interface ArticleSeoOverride {
  /** Text for the <title> tag and og:title (the site appends " — Scrolltek"). */
  metaTitle: string;
  /** On-page H1 text. */
  h1: string;
  /** Meta description (also used for og:description and twitter:description). */
  metaDescription: string;
  /** Publication date (YYYY-MM-DD) for article:published_time. */
  publishedTime: string;
  /** Last-modified date (YYYY-MM-DD) for article:modified_time. */
  modifiedTime: string;
  /** Author name for article:author. */
  authorName: string;
  /** Full replacement JSON-LD for the page. */
  jsonLd: Record<string, unknown>;
}

export const ARTICLE_SEO_OVERRIDES: Record<string, ArticleSeoOverride> = {
  "handheld-gaming-gadgets-2026": {
    metaTitle: "Best Handheld Gaming PCs in 2026: Buyer's Guide",
    h1: "Best Handheld Gaming PCs in 2026: Which One Should You Buy?",
    metaDescription: "Compare the best handheld gaming PCs in 2026 by price, performance and battery life, plus who should buy one and who should skip.",
    publishedTime: "2026-05-29",
    modifiedTime: "2026-10-23",
    authorName: "James Okafor",
    jsonLd: {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "@id": "https://scrolltek.name.ng/article/handheld-gaming-gadgets-2026#article",
      "headline": "Best Handheld Gaming PCs in 2026: Which One Should You Buy?",
      "description": "Compare the best handheld gaming PCs in 2026 by price, performance and battery life, plus who should buy one and who should skip.",
      "image": [
        "https://scrolltek.name.ng/images/handheld-gaming-pc-hero.webp"
      ],
      "datePublished": "2026-05-29",
      "dateModified": "2026-10-23",
      "author": {
        "@type": "Person",
        "name": "James Okafor",
        "url": "https://scrolltek.name.ng/author/james-okafor"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Scrolltek",
        "url": "https://scrolltek.name.ng"
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "https://scrolltek.name.ng/article/handheld-gaming-gadgets-2026"
      },
      "articleSection": "Tech",
      "inLanguage": "en"
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://scrolltek.name.ng/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Tech",
          "item": "https://scrolltek.name.ng/category/tech"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Best Handheld Gaming PCs in 2026: Which One Should You Buy?",
          "item": "https://scrolltek.name.ng/article/handheld-gaming-gadgets-2026"
        }
      ]
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Are handheld gaming PCs worth it?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Only if you will use one often. At $599.99 to $1,799.99, a handheld gaming PC costs as much as a console or a laptop. It pays off for frequent travelers and people without a gaming desk. If you mostly play at home, a console or an existing PC is better value right now."
          }
        },
        {
          "@type": "Question",
          "name": "How do handheld gaming PCs run games?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "They run PC games like a laptop does, using an integrated chip instead of a separate graphics card. Most modern titles play at 1080p on medium settings, often with upscaling. PC Gamer measured Cyberpunk 2077 averaging 41 fps at 1080p medium on the ROG Xbox Ally X."
          }
        },
        {
          "@type": "Question",
          "name": "What is the best handheld gaming PC in 2026?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "For most buyers, the ROG Xbox Ally X at $999.99 is the best all-round pick, based on published reviews. Choose the X20 at $1,299.99 for its OLED screen, or the MSI Claw 8 EX AI+ at $1,799.99 for top speed. SteamOS fans should look at the Steam Deck OLED."
          }
        },
        {
          "@type": "Question",
          "name": "What is the best budget handheld gaming PC?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The ROG Xbox Ally at $599.99 is the best budget pick in 2026, according to PC Gamer. It has a Ryzen Z2 A chip, 16GB of memory, 512GB of storage and a 60Wh battery. It suits indie and older games best, and demanding titles need lower settings."
          }
        },
        {
          "@type": "Question",
          "name": "Can a handheld gaming PC replace a gaming laptop?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "For most people, no. A handheld has a smaller screen, a lower-power chip and fewer ports, so it cannot match a gaming laptop in heavy games or for work. It can work as your only machine if you mostly play lighter games and connect it to a monitor over USB-C."
          }
        },
        {
          "@type": "Question",
          "name": "Do handheld gaming PCs run Windows games?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Windows models such as the ROG Xbox Ally range and MSI Claw run Windows games directly, including Xbox Game Pass and other launchers. SteamOS devices like the Steam Deck run most Windows games through Valve's Proton layer, but some anti-cheat games fail, so check each title first."
          }
        }
      ]
    }
  ]
},
  },
  "chatgpt-claude-gemini-comparison-2026": {
    metaTitle: "ChatGPT vs Claude vs Gemini (2026 Comparison)",
    h1: "ChatGPT vs Claude vs Gemini: Which AI Assistant Is Best in 2026?",
    metaDescription: "ChatGPT, Claude or Gemini? Compare features, pricing, free plans and best use cases to pick the right AI assistant in 2026.",
    publishedTime: "2026-05-25",
    modifiedTime: "2026-10-23",
    authorName: "Anya Patel",
    jsonLd: {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "@id": "https://scrolltek.name.ng/article/chatgpt-claude-gemini-comparison-2026#article",
      "headline": "ChatGPT vs Claude vs Gemini: Which AI Assistant Is Best in 2026?",
      "description": "ChatGPT, Claude or Gemini? Compare features, pricing, free plans and best use cases to pick the right AI assistant in 2026.",
      "image": [
        "https://scrolltek.name.ng/images/chatgpt-vs-claude-vs-gemini-hero.webp"
      ],
      "datePublished": "2026-05-25",
      "dateModified": "2026-10-23",
      "author": {
        "@type": "Person",
        "name": "Anya Patel",
        "url": "https://scrolltek.name.ng/author/anya-patel"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Scrolltek",
        "url": "https://scrolltek.name.ng"
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "https://scrolltek.name.ng/article/chatgpt-claude-gemini-comparison-2026"
      },
      "articleSection": "AI Tools",
      "inLanguage": "en"
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://scrolltek.name.ng/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "AI Tools",
          "item": "https://scrolltek.name.ng/category/ai-tools"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "ChatGPT vs Claude vs Gemini: Which AI Assistant Is Best in 2026?",
          "item": "https://scrolltek.name.ng/article/chatgpt-claude-gemini-comparison-2026"
        }
      ]
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Which AI is best for everyday use?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "ChatGPT is a sensible starting point if you want a broad mix of conversation, research, file analysis, image generation and voice. Gemini may be more convenient if you work mainly in Google applications, while Claude is worth trying if writing and code dominate your day. Test the free versions before deciding."
          }
        },
        {
          "@type": "Question",
          "name": "Is Claude better than ChatGPT for long documents?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Not automatically. Claude offers a documented 200K-token context window on paid plans, while Gemini publishes larger plan-dependent context limits. ChatGPT's applicable limits depend on the model and product. The amount of text accepted is only one factor; accuracy, retrieval of relevant details and the quality of the final analysis matter too."
          }
        },
        {
          "@type": "Question",
          "name": "Can I use Gemini for free?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. Gemini offers access without a paid Google AI plan, although usage limits apply and can change. Paid Google AI plans increase access to selected models and features. Check Google's official feature-availability page for the current limits in your region before relying on a particular capability."
          }
        },
        {
          "@type": "Question",
          "name": "Which AI assistant is best for coding?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Claude and ChatGPT are both strong starting choices for coding assistance, and Gemini is another option. The right choice depends on your programming language, repository size, development tools and task. Give each assistant the same problem, then run the proposed code and evaluate tests, edge cases, maintainability and security."
          }
        },
        {
          "@type": "Question",
          "name": "Do I need more than one AI assistant?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No. One assistant is usually enough for everyday work. Consider a second when it offers a concrete advantage, such as a different writing style, better integration with your tools or access to a feature your main assistant lacks. Compare the extra cost with the time saved rather than maintaining several subscriptions by default."
          }
        },
        {
          "@type": "Question",
          "name": "Which AI assistant is the most private?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "There is no universal answer without specifying the account type, data and privacy requirements. Consumer subscriptions and business plans may have different controls, retention terms and data-use policies. Review each provider's current privacy documentation and settings, and use an appropriately managed service for confidential information."
          }
        }
      ]
    }
  ]
},
  },
  "dumb-tech-trend-2026": {
    metaTitle: "Light Phone Review & Best Alternatives (2026)",
    h1: "Light Phone Review: Is It Worth It? Plus the Best Alternatives in 2026",
    metaDescription: "Is the Light Phone worth it? See what it does, what it costs, who it suits and the best minimalist phone alternatives from Mudita, Punkt and more.",
    publishedTime: "2026-06-07",
    modifiedTime: "2026-10-24",
    authorName: "James Okafor",
    jsonLd: {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "@id": "https://scrolltek.name.ng/article/dumb-tech-trend-2026#article",
      "headline": "Light Phone Review: Is It Worth It? Plus the Best Alternatives in 2026",
      "description": "Is the Light Phone worth it? See what it does, what it costs, who it suits and the best minimalist phone alternatives from Mudita, Punkt and more.",
      "image": [
        "https://images.pexels.com/photos/325153/pexels-photo-325153.jpeg?auto=compress&cs=tinysrgb&w=1200"
      ],
      "datePublished": "2026-06-07",
      "dateModified": "2026-10-24",
      "author": {
        "@type": "Person",
        "name": "James Okafor",
        "url": "https://scrolltek.name.ng/author/james-okafor"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Scrolltek",
        "url": "https://scrolltek.name.ng"
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "https://scrolltek.name.ng/article/dumb-tech-trend-2026"
      },
      "articleSection": "Lifestyle",
      "inLanguage": "en"
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://scrolltek.name.ng/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Lifestyle",
          "item": "https://scrolltek.name.ng/category/lifestyle"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Light Phone Review: Is It Worth It? Plus the Best Alternatives in 2026",
          "item": "https://scrolltek.name.ng/article/dumb-tech-trend-2026"
        }
      ]
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is a Light Phone?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "A Light Phone is a minimalist phone from Light, built to be used as little as possible. It handles calls, texts and a short list of tools such as an alarm, directions and a hotspot, with no social media, browser or email. The current model is the Light Phone III."
          }
        },
        {
          "@type": "Question",
          "name": "How much is the Light Phone III?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "At last check, Light listed the Light Phone III at $899 unlocked, or from $59 a month on a two-year bundle with Light Service. The price has changed several times since launch, so confirm the live price and delivery date before ordering."
          }
        },
        {
          "@type": "Question",
          "name": "What can the Light Phone III do and not do?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "It makes calls, sends texts and photos, takes 50 MP photos, and offers directions, a hotspot, weather, music, podcasts, an authenticator and rideshare. It does not offer social media, a browser, email, WhatsApp, streaming or banking apps. The interface is English only."
          }
        },
        {
          "@type": "Question",
          "name": "Light Phone vs a basic feature phone?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Basic feature phones such as the Nokia 110 4G cost roughly $70 to $100 and offer T9 calling and texting with long standby, but little or no navigation and only basic cameras. A Light Phone costs several times more for a touchscreen keyboard, 5G, a camera, directions and a hotspot."
          }
        },
        {
          "@type": "Question",
          "name": "Does the Light Phone work outside the US, and with which carriers?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "It is sold unlocked as one global hardware model, and Light ships internationally with duties and taxes extra. In the US it works with AT&T, T-Mobile, Mint, US Mobile, Noble Mobile and Light's own service. Verizon works only with an existing active SIM. Google Fi, Cricket, Metro, Consumer Cellular, Straight Talk and Tracfone are unsupported, and Light's own service covers only the US and Canada. Light has said it does not work well on Telstra in Australia. Use Light's compatibility checker first, because returns on an unsupported carrier are reportedly refused."
          }
        },
        {
          "@type": "Question",
          "name": "What are the best Light Phone alternatives?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The Mudita Kompakt suits anyone who wants an E Ink screen and offline maps. The Wisephone II suits people who need WhatsApp and maps. The Punkt MP02 is the stricter keypad choice, the Light Flip is cheaper but not shipping until April 2027, and Nokia flips are the lowest-cost trial."
          }
        },
        {
          "@type": "Question",
          "name": "Is the Light Phone worth it?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Only for a narrow group: people who already want to carry less, can do banking and email elsewhere, and accept a premium price. Everyone else should try software limits, a basic phone or a Mudita Kompakt first."
          }
        }
      ]
    }
  ]
},
  },
};

export function getArticleSeoOverride(slug: string): ArticleSeoOverride | undefined {
  return ARTICLE_SEO_OVERRIDES[slug];
}
