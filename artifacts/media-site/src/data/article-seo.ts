/**
 * Per-article SEO overrides.
 *
 * The article template derives the <title> tag, the Open Graph title and the
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
    publishedTime: "2026-05-31",
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
        "https://scrolltek.name.ng/images/light-phone-iii-review-hero.webp"
      ],
      "datePublished": "2026-05-31",
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
  "how-to-build-personal-brand-online-2026": {
    metaTitle: "How to Build a Personal Brand (Step-by-Step)",
    h1: "How to Build a Personal Brand Online: A Step-by-Step Guide for 2026",
    metaDescription: "Learn how to build a personal brand step by step: find your niche, write a brand statement, pick a platform, create content and follow a 90-day plan.",
    publishedTime: "2026-05-28T11:00:00Z",
    modifiedTime: "2026-10-24",
    authorName: "Anya Patel",
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Article",
          headline: "How to Build a Personal Brand Online: A Step-by-Step Guide for 2026",
          description: "Learn how to build a personal brand step by step: find your niche, write a brand statement, pick a platform, create content and follow a 90-day plan.",
          image: "https://scrolltek.name.ng/images/personal-brand-hero.webp",
          author: { "@type": "Person", name: "Anya Patel" },
          publisher: {
            "@type": "Organization",
            name: "Scrolltek",
            logo: { "@type": "ImageObject", url: "https://scrolltek.name.ng/favicon.svg" },
          },
          datePublished: "2026-05-28T11:00:00Z",
          dateModified: "2026-10-24",
          mainEntityOfPage: "https://scrolltek.name.ng/article/how-to-build-personal-brand-online-2026",
          articleSection: "Lifestyle",
        },
        {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://scrolltek.name.ng/" },
            { "@type": "ListItem", position: 2, name: "Lifestyle", item: "https://scrolltek.name.ng/category/lifestyle" },
            { "@type": "ListItem", position: 3, name: "How to Build a Personal Brand Online.", item: "https://scrolltek.name.ng/article/how-to-build-personal-brand-online-2026" },
          ],
        },
        {
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "What is a personal brand?",
              acceptedAnswer: { "@type": "Answer", text: "A personal brand is the reputation you build for a specific skill, perspective or kind of help. It is what people expect from you and remember about you, shaped by your content, your communication style and the value you consistently deliver." },
            },
            {
              "@type": "Question",
              name: "How do I build a personal brand from scratch?",
              acceptedAnswer: { "@type": "Answer", text: "Choose a narrow niche, write a one-sentence brand statement, pick one platform, publish content around three pillars on a steady schedule, and start an email list. The 90-day plan above breaks this into weekly actions." },
            },
            {
              "@type": "Question",
              name: "How long does it take to build a personal brand?",
              acceptedAnswer: { "@type": "Answer", text: "It varies widely. You can set up the foundations in a few weeks, but audience growth depends on your niche, consistency and timing. Many creators describe slow early months, so judge early progress by habits and feedback." },
            },
            {
              "@type": "Question",
              name: "What is a personal brand statement?",
              acceptedAnswer: { "@type": "Answer", text: "It is one or two sentences saying who you help, what outcome you deliver and how. Template: \"I help [audience] [outcome] by [method], so they can [benefit].\" Keep it under 25 words and use it in your bios." },
            },
            {
              "@type": "Question",
              name: "Which platform should I pick?",
              acceptedAnswer: { "@type": "Answer", text: "Pick the one where your audience already looks for help and where you can sustain the format. Professional services often suit LinkedIn or a newsletter, visual niches suit Instagram, and tutorials suit YouTube. Start with one." },
            },
            {
              "@type": "Question",
              name: "Can I build a personal brand without showing my face?",
              acceptedAnswer: { "@type": "Answer", text: "Yes. You can use writing, voiceover, screen recordings, carousels, illustrations or a pen name. What matters is a consistent voice and useful content. If constant filming feels draining, our look at camera culture in 2026 offers context." },
            },
            {
              "@type": "Question",
              name: "How do I make money from a personal brand?",
              acceptedAnswer: { "@type": "Answer", text: "Most creators earn through services, digital products, affiliate links, sponsorships or memberships, usually after building trust. Income is uneven and not guaranteed, and payout methods vary by country." },
            },
          ],
        },
      ],
    },
  },
  "tesla-self-driving-cars-2026": {
    metaTitle: "What Is a Robotaxi? Where They Run in 2026",
    h1: "What Is a Robotaxi? How They Work and Where You Can Ride One",
    metaDescription: "A robotaxi is a driverless ride-hailing car. See how robotaxis work, where Waymo, Tesla and others operate in 2026, and how safe they are today.",
    publishedTime: "2026-05-26",
    modifiedTime: "2026-10-24",
    authorName: "James Okafor",
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Article",
          "headline": "What Is a Robotaxi? How They Work and Where You Can Ride One",
          "description": "A robotaxi is a driverless ride-hailing car. See how robotaxis work, where Waymo, Tesla and others operate in 2026, and how safe they are today.",
          "image": ["https://scrolltek.name.ng/images/robotaxi-what-is-a-robotaxi-2026.webp"],
          "author": { "@type": "Person", "name": "James Okafor", "url": "https://scrolltek.name.ng/author/james-Okafor" },
          "publisher": { "@type": "Organization", "name": "Scrolltek", "logo": { "@type": "ImageObject", "url": "https://scrolltek.name.ng/favicon.svg" } },
          "datePublished": "2026-05-26",
          "dateModified": "2026-10-24",
          "mainEntityOfPage": { "@type": "WebPage", "@id": "https://scrolltek.name.ng/article/tesla-self-driving-cars-2026" }
        },
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://scrolltek.name.ng/" },
            { "@type": "ListItem", "position": 2, "name": "Tech", "item": "https://scrolltek.name.ng/category/tech" },
            { "@type": "ListItem", "position": 3, "name": "What Is a Robotaxi?", "item": "https://scrolltek.name.ng/article/tesla-self-driving-cars-2026" }
          ]
        },
        {
          "@type": "FAQPage",
          "mainEntity": [
            { "@type": "Question", "name": "What is a robotaxi?", "acceptedAnswer": { "@type": "Answer", "text": "A robotaxi is a driverless ride-hailing car you book in an app. It typically runs at SAE Level 4, driving itself inside a mapped area with no human driver. Some services still carry a supervisor and are best seen as pilots." } },
            { "@type": "Question", "name": "How do robotaxis work?", "acceptedAnswer": { "@type": "Answer", "text": "Cameras, radar and usually lidar feed an AI driving system. Remote staff can offer guidance in tricky situations, and fleets run only inside areas the operator has mapped and approved." } },
            { "@type": "Question", "name": "Is a Tesla with FSD a robotaxi?", "acceptedAnswer": { "@type": "Answer", "text": "No. FSD (Supervised) is Level 2 driver assistance, and you must watch the road. Tesla's separate Robotaxi service uses company-run cars. Tesla said on October 21, 2026 that unsupervised FSD could reach customer cars around Q2 2027." } },
            { "@type": "Question", "name": "Where can I ride one?", "acceptedAnswer": { "@type": "Answer", "text": "As of October 2026: Waymo in 15 US metros, Tesla in six cities without an in-car supervisor, Zoox in Las Vegas (paid) and San Francisco (free), plus Baidu, WeRide and Pony.ai in China and the Gulf. Availability changes quickly, so check each app." } },
            { "@type": "Question", "name": "Are robotaxis safe?", "acceptedAnswer": { "@type": "Answer", "text": "Waymo's data through June 2026 shows far fewer injury crashes than human benchmarks, but recalls show gaps in rare situations. Tesla's safety figures are self-reported and cover far fewer miles. See the safety section above." } },
            { "@type": "Question", "name": "How much do they cost?", "acceptedAnswer": { "@type": "Answer", "text": "In San Francisco, Obi found Waymo averaged $19.69, Uber $17.47 and Tesla $8.17 (with a safety driver) in late 2025. Waymo prices rose 18% by spring 2026." } },
            { "@type": "Question", "name": "Are there robotaxis outside the US?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. China has the most, with Baidu, Pony.ai and WeRide. Abu Dhabi and Dubai run fully driverless services, and Pony.ai serves riders in Qatar, Singapore and South Korea. London and Zagreb have supervised services. We found no confirmed public robotaxi service in Nigeria or elsewhere in Africa as of October 2026." } }
          ]
        }
      ]
    }
  },
  "tiktok-brain-attention-span-2026": {
    metaTitle: "TikTok Brain: What Research Says & How to Fix It",
    h1: "TikTok Brain: What the Research Actually Says and How to Reset Your Focus",
    metaDescription: "Is TikTok brain real? See what the research says about short-form video and attention, what it can’t prove, and 6 practical ways to reset your focus.",
    publishedTime: "2026-05-26",
    modifiedTime: "2026-10-24",
    authorName: "Sofia Reyes",
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Article",
          "@id": "https://scrolltek.name.ng/article/tiktok-brain-attention-span-2026#article",
          "headline": "TikTok Brain: What the Research Actually Says and How to Reset Your Focus",
          "description": "Is TikTok brain real? See what the research says about short-form video and attention, what it can’t prove, and 6 practical ways to reset your focus.",
          "image": "https://scrolltek.name.ng/images/tiktok-brain-attention-span-2026-hero.webp",
          "author": { "@type": "Person", "name": "Sofia Reyes" },
          "publisher": { "@type": "Organization", "name": "Scrolltek", "url": "https://scrolltek.name.ng" },
          "datePublished": "2026-05-26",
          "dateModified": "2026-10-24",
          "articleSection": "Culture",
          "inLanguage": "en",
          "mainEntityOfPage": "https://scrolltek.name.ng/article/tiktok-brain-attention-span-2026"
        },
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://scrolltek.name.ng" },
            { "@type": "ListItem", "position": 2, "name": "Culture", "item": "https://scrolltek.name.ng/category/culture" },
            { "@type": "ListItem", "position": 3, "name": "TikTok Brain: What the Research Actually Says and How to Reset Your Focus", "item": "https://scrolltek.name.ng/article/tiktok-brain-attention-span-2026" }
          ]
        },
        {
          "@type": "FAQPage",
          "mainEntity": [
            { "@type": "Question", "name": "What is TikTok brain?", "acceptedAnswer": { "@type": "Answer", "text": "TikTok brain is an informal term for reduced focus and a pull to keep scrolling after heavy short-form video use. It is not a medical diagnosis. Researchers study related traits such as attention, impulse control and compulsive use." } },
            { "@type": "Question", "name": "Is TikTok brain real?", "acceptedAnswer": { "@type": "Answer", "text": "The pattern is real in the data: heavier short-form video use is associated with poorer attention and inhibitory control. Whether the videos cause it is unproven, and “TikTok brain” is a popular label, not a clinical one." } },
            { "@type": "Question", "name": "Does TikTok shorten your attention span?", "acceptedAnswer": { "@type": "Answer", "text": "That is not proven. Heavy users tend to score lower on attention measures, but most studies are snapshots, so people who already struggle to focus may simply watch more short videos. Long-term studies are still needed." } },
            { "@type": "Question", "name": "What does the research say?", "acceptedAnswer": { "@type": "Answer", "text": "A 2025 meta-analysis of 98,299 participants across 71 studies found short-form video use was most strongly associated with poorer attention (r = −.38) and inhibitory control (r = −.41). Stress and anxiety also showed links, though mental health overall was a weaker association." } },
            { "@type": "Question", "name": "Is “brain rot” a medical term?", "acceptedAnswer": { "@type": "Answer", "text": "No. It is slang that Oxford University Press named its 2024 Word of the Year. It describes a supposed mental decline from low-quality online content, not a clinical diagnosis." } },
            { "@type": "Question", "name": "How do I reduce TikTok brain?", "acceptedAnswer": { "@type": "Answer", "text": "Add friction to the app, turn off notifications, decide on a stopping point before you open it, protect your sleep and practice single-task time. If problems persist, talk to a doctor or mental health professional." } },
            { "@type": "Question", "name": "Is TikTok brain worse for teens?", "acceptedAnswer": { "@type": "Answer", "text": "That is unsettled. The meta-analysis included both youths and adults, and the American Psychological Association says effects vary by young person and context. Teen use is heavy, so sleep, school and friendships are sensible things to watch." } }
          ]
        }
      ]
    }
  },
};

export function getArticleSeoOverride(slug: string): ArticleSeoOverride | undefined {
  return ARTICLE_SEO_OVERRIDES[slug];
}
