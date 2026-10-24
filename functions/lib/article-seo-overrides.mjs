/**
 * Per-article SEO overrides for the server-rendered article HTML.
 *
 * Mirrors artifacts/media-site/src/data/article-seo.ts and
 * artifacts/api-server/src/lib/article-seo.ts — the article template derives
 * the <title> tag, the Open Graph title and the on-page H1 from the same
 * `title` field, so these overrides let a single article ship a search title
 * that differs from its on-page H1, pin the exact meta description, and
 * replace the auto-generated JSON-LD with a hand-built @graph.
 */
export const ARTICLE_SEO_OVERRIDES = {
  "digital-detox-jomo-2026": {
  "metaTitle": "What Is JOMO? The Joy of Missing Out Explained",
  "h1": "What Is JOMO? The Joy of Missing Out, Explained (and How to Practice It)",
  "metaDescription": "JOMO means the joy of missing out. Learn where the term came from, how it differs from FOMO and digital detox, and 7 simple ways to practice it.",
  "publishedTime": "2026-05-27",
  "modifiedTime": "2026-10-24",
  "authorName": "Sofia Reyes",
  "jsonLd": {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "headline": "What Is JOMO? The Joy of Missing Out, Explained (and How to Practice It)",
        "description": "JOMO means the joy of missing out. Learn where the term came from, how it differs from FOMO and digital detox, and 7 simple ways to practice it.",
        "image": [
          "https://scrolltek.name.ng/images/jomo-joy-of-missing-out-hero.webp"
        ],
        "author": {
          "@type": "Person",
          "name": "Sofia Reyes",
          "url": "https://scrolltek.name.ng/author/sofia-reyes"
        },
        "publisher": {
          "@type": "Organization",
          "name": "Scrolltek",
          "url": "https://scrolltek.name.ng/"
        },
        "datePublished": "2026-05-27",
        "dateModified": "2026-10-24",
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": "https://scrolltek.name.ng/article/digital-detox-jomo-2026"
        },
        "articleSection": "Lifestyle"
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What does JOMO mean?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "JOMO means “joy of missing out”: the contentment of skipping something on purpose and being glad you did. Merriam-Webster classes it as informal and dates its first known use to 2012."
            }
          },
          {
            "@type": "Question",
            "name": "Who coined JOMO?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Anil Dash is most often credited, thanks to his July 19, 2012 blog post “JOMO!” Merriam-Webster names no originator and Word Spy lists an earlier February 2012 tweet, so “popularized by Dash” is the safest wording."
            }
          },
          {
            "@type": "Question",
            "name": "JOMO vs FOMO: what is the difference?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "FOMO is anxiety that others are having rewarding experiences without you. JOMO is contentment with what you chose to skip. FOMO pushes toward constant connection; JOMO asks what you actually want to spend time on."
            }
          },
          {
            "@type": "Question",
            "name": "Is JOMO just being antisocial?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "No, not when it is working. JOMO means choosing which plans deserve your time, often so you can show up better for the ones that matter. It becomes a problem when it turns into avoidance or isolation."
            }
          },
          {
            "@type": "Question",
            "name": "How do I practice JOMO?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Decide your priorities first, learn one short and kind way to decline, silence nonessential notifications, set a boundary around feeds, and protect one unplanned evening a week. The seven ways above give the full plan."
            }
          },
          {
            "@type": "Question",
            "name": "JOMO vs digital detox vs minimalism: which is which?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "JOMO is a mindset about enjoying what you leave out. A digital detox is a time-limited break from devices or platforms. Minimalism is a broader approach to owning and doing less. They work well together, but none requires the others."
            }
          },
          {
            "@type": "Question",
            "name": "Can JOMO apply at work?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes: use response windows instead of instant replies, skip optional meetings that do not need you, and mute low-value channels. Check expectations with your manager, especially in roles that need availability."
            }
          }
        ]
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
            "name": "What Is JOMO? The Joy of Missing Out, Explained (and How to Practice It)",
            "item": "https://scrolltek.name.ng/article/digital-detox-jomo-2026"
          }
        ]
      }
    ]
  }
},
  'handheld-gaming-gadgets-2026': {
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
  'chatgpt-claude-gemini-comparison-2026': {
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
};

export function getArticleSeoOverride(slug) {
  return ARTICLE_SEO_OVERRIDES[slug];
}
