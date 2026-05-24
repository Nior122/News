import { db } from "./index";
import { articlesTable, authorsTable, categoriesTable } from "./schema";
import { sql } from "drizzle-orm";

const authors = [
  { id: 1, name: "Maya Chen", avatarUrl: "https://i.pravatar.cc/150?img=47" },
  { id: 2, name: "James Okafor", avatarUrl: "https://i.pravatar.cc/150?img=68" },
  { id: 3, name: "Sofia Reyes", avatarUrl: "https://i.pravatar.cc/150?img=31" },
  { id: 4, name: "Liam Park", avatarUrl: "https://i.pravatar.cc/150?img=12" },
  { id: 5, name: "Anya Patel", avatarUrl: "https://i.pravatar.cc/150?img=56" },
];

const categories = [
  { slug: "tech", name: "Tech", color: "#3B82F6", articleCount: 0 },
  { slug: "culture", name: "Culture", color: "#8B5CF6", articleCount: 0 },
  { slug: "lifestyle", name: "Lifestyle", color: "#10B981", articleCount: 0 },
  { slug: "ai-tools", name: "AI Tools", color: "#F59E0B", articleCount: 0 },
  { slug: "phone-tips", name: "Phone Tips", color: "#EF4444", articleCount: 0 },
  { slug: "productivity", name: "Productivity", color: "#06B6D4", articleCount: 0 },
  { slug: "trending", name: "Trending", color: "#F97316", articleCount: 0 },
];

const articles = [
  {
    slug: "openai-gpt5-changes-everything",
    title: "GPT-5 Is Here — And It Changes Everything We Know About AI",
    subtitle: "The most powerful language model ever built just landed, and the implications are staggering",
    excerpt: "OpenAI's latest model doesn't just answer questions — it reasons, plans, and executes complex multi-step tasks with near-human precision. We spent two weeks testing it.",
    body: "OpenAI has officially released GPT-5, and after two weeks of hands-on testing, we can confidently say: this is a genuine leap forward. Not an incremental update. A leap.\n\nThe model demonstrates reasoning capabilities that consistently surprised our team. When given a complex legal document to analyze alongside recent case law, it didn't just summarize — it identified contradictions, flagged ambiguities, and suggested specific clauses to renegotiate.\n\nWhat's most striking is the model's ability to acknowledge uncertainty. Unlike previous versions that would confidently hallucinate, GPT-5 frequently pauses to note what it doesn't know.\n\nThe implications for knowledge work are significant. Tasks that took hours now take minutes.",
    category: "AI Tools",
    authorId: 1,
    publishedAt: new Date("2026-05-22T09:00:00Z"),
    readTime: 8,
    imageUrl: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=1200&q=80",
    views: 48200, featured: true, editorsPick: true,
    tags: ["AI", "OpenAI", "GPT-5", "Technology"],
  },
  {
    slug: "apple-vision-pro-2-review",
    title: "Apple Vision Pro 2 Review: The Future Finally Fits on Your Face",
    subtitle: "Apple's second-generation spatial computer is lighter, faster, and actually useful",
    excerpt: "After a year of refinements, Apple's Vision Pro sequel addresses almost every complaint about the original. But is it worth the price?",
    body: "The first Vision Pro was a proof of concept. This is the product Apple always meant to ship.\n\nAt 180 grams — nearly 100 grams lighter than its predecessor — Vision Pro 2 no longer feels like wearing a small television strapped to your forehead.\n\nThe display has been upgraded to micro-LED panels with 5000 nits peak brightness, making it usable even in direct sunlight.\n\nIs it worth $2,799? For professionals in design, medicine, or engineering — probably yes.",
    category: "Tech",
    authorId: 2,
    publishedAt: new Date("2026-05-21T11:00:00Z"),
    readTime: 10,
    imageUrl: "https://images.unsplash.com/photo-1697577418961-fc43c2b86f65?w=1200&q=80",
    views: 35100, featured: false, editorsPick: true,
    tags: ["Apple", "Vision Pro", "AR", "VR", "Review"],
  },
  {
    slug: "tiktok-generation-attention-crisis",
    title: "The Attention Crisis Is Real — And TikTok Isn't the Only Culprit",
    subtitle: "New research reveals how short-form video rewires the adolescent brain",
    excerpt: "A landmark 5-year study tracking 12,000 teenagers finds that heavy short-form video use correlates with measurable changes in sustained attention capacity.",
    body: "The research is in, and the results are sobering.\n\nA five-year longitudinal study found that adolescents who spent more than two hours daily on short-form video platforms showed statistically significant reductions in their ability to sustain attention.\n\nBut here's what the headlines are missing: TikTok is not uniquely responsible. YouTube Shorts, Instagram Reels, and Snapchat Spotlight showed nearly identical effect sizes.",
    category: "Culture",
    authorId: 3,
    publishedAt: new Date("2026-05-20T14:30:00Z"),
    readTime: 7,
    imageUrl: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1200&q=80",
    views: 29800, featured: false, editorsPick: true,
    tags: ["Social Media", "Mental Health", "Research", "TikTok"],
  },
  {
    slug: "samsung-galaxy-s26-ultra-hands-on",
    title: "Samsung Galaxy S26 Ultra: First Look at the Camera That Shoots Like a DSLR",
    subtitle: "200MP sensor, AI-powered processing, and a zoom range that defies physics",
    excerpt: "We got early access to Samsung's flagship for 48 hours. The camera system is unlike anything we've tested before.",
    body: "Samsung's engineers have been working on one problem for three years: how do you put a DSLR-quality camera in a phone without compromising on portability?\n\nThe headline feature is the new 200MP 1-inch sensor. In bright daylight, the results are genuinely indistinguishable from a mirrorless camera.\n\nPrice: Starting at $1,399. Available June 15.",
    category: "Phone Tips",
    authorId: 4,
    publishedAt: new Date("2026-05-19T10:00:00Z"),
    readTime: 6,
    imageUrl: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=1200&q=80",
    views: 27600, featured: false, editorsPick: false,
    tags: ["Samsung", "Galaxy", "Smartphone", "Camera", "Review"],
  },
  {
    slug: "deep-work-in-the-ai-age",
    title: "Deep Work Is More Valuable Than Ever — And Harder Than Ever to Achieve",
    subtitle: "How to protect your most productive hours in a world designed to fragment your attention",
    excerpt: "Cal Newport's 2016 concept has never been more relevant. Here's how top performers are structuring their days to stay ahead of AI-assisted mediocrity.",
    body: "In 2016, Cal Newport coined the term 'deep work' to describe cognitively demanding tasks performed in a state of distraction-free concentration.\n\nAs AI tools handle more routine knowledge work, the premium on original, complex thinking has skyrocketed.\n\nThe uncomfortable truth: most people are using AI to do shallow work faster, when the real opportunity is to use the time AI saves to go deeper.",
    category: "Productivity",
    authorId: 5,
    publishedAt: new Date("2026-05-18T08:00:00Z"),
    readTime: 9,
    imageUrl: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=1200&q=80",
    views: 23400, featured: false, editorsPick: true,
    tags: ["Productivity", "Deep Work", "AI", "Focus"],
  },
  {
    slug: "indie-gaming-renaissance",
    title: "The Indie Gaming Renaissance No One Is Talking About",
    subtitle: "While AAA studios chase sequels, small teams are making the most important games of the decade",
    excerpt: "From Balatro to Hades II, indie studios are consistently out-innovating their billion-dollar counterparts. We look at why — and what's coming next.",
    body: "Something remarkable happened in gaming over the past three years: the most critically acclaimed games have almost all come from teams of fewer than 20 people.\n\nBalatro, made by a solo developer, sold 5 million copies. Hades II is in early access and already generating more revenue than many AAA releases.",
    category: "Culture",
    authorId: 1,
    publishedAt: new Date("2026-05-17T15:00:00Z"),
    readTime: 7,
    imageUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&q=80",
    views: 19200, featured: false, editorsPick: false,
    tags: ["Gaming", "Indie Games", "Culture", "Technology"],
  },
  {
    slug: "claude-ai-coding-assistant-review",
    title: "I Let Claude Write My Code for 30 Days. Here's What Happened.",
    subtitle: "An honest account of using Anthropic's AI as a full-time coding partner",
    excerpt: "Productivity gains were real, but so were the subtle bugs that passed code review. A developer's unfiltered report from the frontier of AI-assisted engineering.",
    body: "I gave myself one rule: if Claude could write it, I'd let it. For 30 days, that meant virtually every line of code I shipped had AI involvement.\n\nConclusion: Claude is an extraordinary junior developer. Use it for scaffolding and well-defined tasks. But the architectural decisions must remain human.",
    category: "AI Tools",
    authorId: 2,
    publishedAt: new Date("2026-05-16T10:00:00Z"),
    readTime: 11,
    imageUrl: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=1200&q=80",
    views: 31500, featured: false, editorsPick: false,
    tags: ["AI", "Claude", "Coding", "Developer Tools"],
  },
  {
    slug: "morning-routine-science-2026",
    title: "Science Finally Explains Why Your Morning Routine Isn't Working",
    subtitle: "New chronobiology research upends decades of advice about peak performance windows",
    excerpt: "The 5 AM club, cold plunges, and fasted workouts may be working against your biology.",
    body: "The wellness industry has spent a decade convincing you that successful people wake up at 5 AM. New science suggests this advice may be actively harmful for many people.\n\nThe practical implication: spend two weeks tracking when you naturally feel sharpest. Then build your most cognitively demanding work around that window.",
    category: "Lifestyle",
    authorId: 3,
    publishedAt: new Date("2026-05-15T07:00:00Z"),
    readTime: 8,
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
    views: 18700, featured: false, editorsPick: false,
    tags: ["Health", "Wellness", "Science", "Productivity"],
  },
  {
    slug: "pixel-9-pro-hidden-features",
    title: "15 Pixel 9 Pro Features You're Probably Not Using",
    subtitle: "Google buried some genuinely useful tools deep in the settings",
    excerpt: "From the temperature sensor to Advanced Photo Unblur to the satellite calling feature — we dig into Pixel 9 Pro's overlooked toolkit.",
    body: "Google's Pixel 9 Pro is one of the most feature-rich phones ever made. It's also one of the worst marketed. Most owners are using maybe 40% of what the phone can do.\n\nTop features: Satellite calling, temperature sensor, Advanced Photo Unblur, Audio Magic Eraser on videos, Call Screen for texts, and Pocket mode.",
    category: "Phone Tips",
    authorId: 4,
    publishedAt: new Date("2026-05-14T12:00:00Z"),
    readTime: 6,
    imageUrl: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=1200&q=80",
    views: 22100, featured: false, editorsPick: false,
    tags: ["Pixel", "Google", "Android", "Tips", "Smartphone"],
  },
  {
    slug: "remote-work-loneliness-epidemic",
    title: "Remote Work's Hidden Cost: The Loneliness No One Talks About",
    subtitle: "Three years after the great return-to-office debate, the mental health data is finally in",
    excerpt: "A comprehensive study of 50,000 remote workers reveals a loneliness crisis that productivity metrics can't capture.",
    body: "The productivity debate about remote work is largely settled: when managed well, remote workers are as productive as in-office counterparts.\n\nBut a new study reveals the cost that never showed up in the spreadsheets: 41% of remote workers report feeling lonely 'often or always.'\n\nThe companies with lowest loneliness scores invested heavily in unstructured time.",
    category: "Culture",
    authorId: 5,
    publishedAt: new Date("2026-05-13T09:00:00Z"),
    readTime: 9,
    imageUrl: "https://images.unsplash.com/photo-1516387938699-a93567ec168e?w=1200&q=80",
    views: 16900, featured: false, editorsPick: false,
    tags: ["Remote Work", "Mental Health", "Culture", "Workplace"],
  },
  {
    slug: "second-brain-notion-obsidian",
    title: "Building a Second Brain in 2026: Notion vs Obsidian vs Everything Else",
    subtitle: "After testing every major PKM tool for six months, here's what actually works",
    excerpt: "The personal knowledge management space has exploded. We put every major tool through real-world use to find out which one actually improves thinking.",
    body: "Everyone has a note-taking app. Almost no one has a working knowledge management system.\n\nNotion remains best for teams. Obsidian is the tool that thinks most like a brain.\n\nThe deeper truth: the tool matters less than the habit of review.",
    category: "Productivity",
    authorId: 1,
    publishedAt: new Date("2026-05-12T11:00:00Z"),
    readTime: 10,
    imageUrl: "https://images.unsplash.com/photo-1517842645767-c639042777db?w=1200&q=80",
    views: 14300, featured: false, editorsPick: false,
    tags: ["Productivity", "Notion", "Obsidian", "PKM", "Tools"],
  },
  {
    slug: "urban-farming-tech-revolution",
    title: "The $10 Billion Bet on Growing Food in Cities",
    subtitle: "Vertical farming just had its worst year ever financially. But the technology has never been more promising.",
    excerpt: "After a wave of bankruptcies, vertical farming companies are rebuilding with better economics.",
    body: "2024 was a disaster for vertical farming. But 2026 might be the year it finally becomes viable.\n\nThe survivors have pivoted to high-value crops: pharmaceutical herbs, exotic mushrooms, premium microgreens. LED efficiency is up 60% since 2020.",
    category: "Tech",
    authorId: 2,
    publishedAt: new Date("2026-05-11T13:00:00Z"),
    readTime: 8,
    imageUrl: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=1200&q=80",
    views: 11800, featured: false, editorsPick: false,
    tags: ["Technology", "Food", "Agriculture", "Sustainability"],
  },
  {
    slug: "sleep-optimization-wearables",
    title: "I Tracked My Sleep for a Year. The Results Were Uncomfortable.",
    subtitle: "Eight sleep trackers, one year, and some hard truths about what actually improves sleep",
    excerpt: "Using Oura, Whoop, Apple Watch, and five other devices simultaneously, I discovered that most sleep advice is backwards.",
    body: "After 365 nights of tracking with eight simultaneous devices, the clearest finding is: anxiety about sleep metrics makes sleep worse.\n\nThe most consistent improvement came from two changes: stopping caffeine before noon, and keeping the bedroom below 68°F.",
    category: "Lifestyle",
    authorId: 4,
    publishedAt: new Date("2026-05-10T08:00:00Z"),
    readTime: 9,
    imageUrl: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=1200&q=80",
    views: 15600, featured: false, editorsPick: false,
    tags: ["Sleep", "Health", "Wearables", "Wellness"],
  },
  {
    slug: "twitter-x-two-years-later",
    title: "X at Two Years: What Actually Changed (And What Didn't)",
    subtitle: "A data-driven look at how the platform has evolved since the acquisition",
    excerpt: "Two years after Elon Musk's takeover, the numbers tell a complicated story about user behavior, advertiser confidence, and platform health.",
    body: "Two years after the acquisition, X (formerly Twitter) presents a paradox: the platform is simultaneously more chaotic and more useful than it's ever been.\n\nMonthly active users are down 18% from peak Twitter, but engagement per remaining user is up 34%.",
    category: "Tech",
    authorId: 3,
    publishedAt: new Date("2026-05-09T10:00:00Z"),
    readTime: 7,
    imageUrl: "https://images.unsplash.com/photo-1611605698335-8b1569810432?w=1200&q=80",
    views: 20300, featured: false, editorsPick: false,
    tags: ["Twitter", "X", "Social Media", "Tech"],
  },
  {
    slug: "ai-fitness-coach-test",
    title: "I Used AI as My Personal Trainer for 90 Days. Here's the Truth.",
    subtitle: "Testing five AI fitness coaching apps against a human personal trainer",
    excerpt: "AI fitness coaches have gotten remarkably good. But there are still things only a human coach can do.",
    body: "I ran a 90-day experiment: for the first 45 days, I worked exclusively with an AI fitness coach. For the last 45, I worked with a human trainer.\n\nConclusion: AI coaching is excellent for people who already understand movement fundamentals. For beginners, the lack of real-time form correction is a meaningful gap.",
    category: "Lifestyle",
    authorId: 5,
    publishedAt: new Date("2026-05-08T09:00:00Z"),
    readTime: 8,
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&q=80",
    views: 13200, featured: false, editorsPick: false,
    tags: ["Fitness", "AI", "Health", "Lifestyle"],
  },
  {
    slug: "google-io-2026-biggest-announcements-gemini-ai",
    title: "Google Just Changed How You Search the Internet Forever — Here's What Happened at I/O 2026",
    subtitle: "From a 24/7 AI agent to a shopping cart that works across every store, Google's biggest week of the year just rewired your daily life",
    excerpt: "If you use Google — and let's be honest, you do — something major just changed. Here's everything that happened at I/O 2026, explained for actual humans.",
    body: `If you blinked last week, you might have missed the biggest upgrade to Google in years. Actually, Google CEO Sundar Pichai called it "the biggest upgrade to Search ever." That's a bold claim from a company that has been running the internet's front door for over two decades.

Last week, Google held its annual developer conference — Google I/O 2026 — at the Shoreline Amphitheater in Mountain View, California. Two days. Hundreds of announcements. And a very clear message: the Google you've been using is being replaced by something much, much smarter.

## What Is Google I/O and Why Should You Care?

Google I/O is basically Google's version of a product launch event. Every time Google Search got better, every time Google Maps learned a new trick — that probably started at an I/O conference.

This year's show felt different. Pichai put it plainly: "We're firmly in our agentic Gemini era." It means Google's AI no longer just answers your questions. It does things for you.

## Google's New AI Models — Gemini 3.5 and Gemini Omni

Gemini 3.5 Flash is built for speed and real-world usefulness — writing emails, summarizing documents, coding assistance.

Gemini Omni is the bigger deal. Think of old AI as a calculator. Gemini Omni is more like having a personal assistant who can read your emails, watch a video you send them, listen to a voice note, and then actually do something about it.

## Google Search Just Got Its Biggest Upgrade Ever

AI Overviews now reaches 2.5 billion people every single month. AI Mode turns Search into a full conversation — you ask follow-up questions, it remembers context, it digs through sources so you don't have to.

## The Features That Will Change Your Daily Life

Gemini Spark is a persistent AI agent that runs 24/7. Universal Cart is an AI shopping cart that works across multiple stores. Ask YouTube answers questions from video content. Smart glasses arrive this fall from Gentle Monster, Warby Parker, and Samsung.

## What About Privacy? The AI Watermark Question

SynthID is Google's watermarking technology that marks AI-generated content so it can be detected. It's been applied over 50 million times and is now expanding into Search and Chrome.

## What This All Means for You

Six months from now, your experience of Google is going to feel meaningfully different. Search will feel like a conversation. Shopping across multiple sites will be one seamless experience.

Share this with someone who still thinks Google is just a search box.`,
    category: "Tech",
    authorId: 1,
    publishedAt: new Date("2026-05-24T10:00:00Z"),
    readTime: 9,
    imageUrl: "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=1200&q=80",
    views: 0, featured: false, editorsPick: true,
    tags: ["Google", "Google I/O", "Gemini AI", "AI Search", "Tech News"],
  },
  {
    slug: "ai-data-center-cloud-expansion-2026",
    title: "The World Is Running Out of Space for AI — So Tech Giants Are Building Cities of Servers",
    subtitle: "Why Google, Microsoft, and Blackstone are spending hundreds of billions to build the backbone of our AI future — and what it means for you",
    excerpt: "Every time you ask an AI a question, a room full of supercomputers the size of a football field springs to life. Here's why those rooms are being built at a pace the world has never seen before.",
    body: `Every time you ask ChatGPT a question, search Google with AI, or watch a video recommended by an algorithm, something happens behind the scenes that most people never think about.

Somewhere on earth — probably in a building the size of several football fields — a massive cluster of computers lights up, processes your request in milliseconds, and sends back an answer. That building is a data center. And right now, the world is racing to build more of them than ever before.

## What Exactly Is a Data Center?

Think of a data center as the brain behind every digital service you use. A single modern data center can hold hundreds of thousands of servers. But AI is extremely demanding — asking an AI to write an essay requires thousands of times more computing power than a basic web search.

## The Trillion-Dollar Building Boom

In May 2026, Google and Blackstone announced plans to create an entirely new AI cloud company. Microsoft has committed over $80 billion toward AI infrastructure in 2026. The total global investment in AI data centers is expected to surpass $1 trillion by the end of the decade.

## The AI Boom: Why Everything Accelerated So Fast

Two years ago, most people had never heard of ChatGPT. Today it has over 180 million users. Google's AI Overviews reaches 2.5 billion people every month. AI went from a research curiosity to a product billions of people use daily in roughly 18 months.

## The Energy Problem

AI data centers consume enormous amounts of electricity. A single large data center can use as much power as 50,000 homes. Google's own environmental reports have shown its emissions rising. The industry is investing in nuclear power, solar farms, and battery storage to keep up.

## How This Actually Affects Your Life

Your apps get smarter. Prices could shift as infrastructure costs rise. Jobs are being created and disrupted simultaneously. Data center construction and operation creates skilled jobs, but AI is also automating tasks in finance, writing, and customer service.

## What Comes Next

Nuclear power is making a comeback — Microsoft has signed deals to restart nuclear plants. Google and Amazon are investing in small modular reactors. The AI boom may be one of the biggest drivers of nuclear energy's revival.

Share this with someone who thinks AI just lives in the cloud — because now you know exactly what that cloud is made of.`,
    category: "Tech",
    authorId: 2,
    publishedAt: new Date("2026-05-24T11:30:00Z"),
    readTime: 10,
    imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&q=80",
    views: 0, featured: false, editorsPick: true,
    tags: ["AI Infrastructure", "Data Centers", "Cloud Computing", "Tech Industry", "Google", "Energy", "Future of Tech"],
  },
];

export async function ensureSeeded(): Promise<void> {
  try {
    const result = await db.select({ count: sql<number>`count(*)` }).from(articlesTable);
    const count = Number(result[0]?.count ?? 0);

    if (count > 0) {
      console.log(`[seed] Database already has ${count} articles — skipping.`);
      return;
    }

    console.log("[seed] Empty database detected — seeding...");

    for (const author of authors) {
      await db
        .insert(authorsTable)
        .values(author)
        .onConflictDoNothing();
    }

    for (const category of categories) {
      await db
        .insert(categoriesTable)
        .values(category)
        .onConflictDoNothing();
    }

    for (const article of articles) {
      await db
        .insert(articlesTable)
        .values(article)
        .onConflictDoNothing();
    }

    console.log(`[seed] ✓ Seeded ${authors.length} authors, ${categories.length} categories, ${articles.length} articles.`);
  } catch (err) {
    console.error("[seed] Seed failed (non-fatal):", err);
  }
}
