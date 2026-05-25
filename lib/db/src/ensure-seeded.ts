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
    slug: "google-io-2026-biggest-announcements-gemini-ai",
    title: "Google Just Changed How You Search the Internet Forever — Here's What Happened at I/O 2026",
    subtitle: "From a 24/7 AI agent to a shopping cart that works across every store, Google's biggest week of the year just rewired your daily life",
    excerpt: "If you use Google — and let's be honest, you do — something major just changed. Here's everything that happened at I/O 2026, explained for actual humans.",
    body: `If you blinked last week, you might have missed the biggest upgrade to Google in years. Actually, Google CEO Sundar Pichai called it "the biggest upgrade to Search ever." That's a bold claim from a company that has been running the internet's front door for over two decades.

Last week, Google held its annual developer conference — Google I/O 2026 — at the Shoreline Amphitheater in Mountain View, California. Two days. Hundreds of announcements. And a very clear message: the Google you've been using is being replaced by something much, much smarter.

Here's everything that happened, broken down for real people.

## What Is Google I/O and Why Should You Care?

Google I/O is basically Google's version of a product launch event — except instead of showing off one phone, they reveal everything they've been building all year. Developers, journalists, and tech enthusiasts fly in from around the world to watch. But honestly? The stuff they announce affects you even if you've never heard of it before.

Think of it like this: every time Google Search got better, every time Google Maps learned a new trick, every time your Android phone started doing something useful you didn't ask for — that probably started at an I/O conference.

This year's show felt different. The word "AI" wasn't just sprinkled throughout the presentations. It was the whole presentation. Pichai put it plainly: "We're firmly in our agentic Gemini era." What does that mean? It means Google's AI no longer just answers your questions. It does things for you.

## Google's New AI Models — Gemini 3.5 and Gemini Omni

Google unveiled two major new AI models at I/O 2026, and understanding what they do is actually pretty simple once you ditch the tech jargon.

Gemini 3.5 Flash is built for speed and real-world usefulness. It's the model that powers your everyday tasks — writing a quick email, summarizing a document, helping you code something. Fast, sharp, and reliable.

Gemini Omni is the bigger deal. Think of old AI as a calculator: you type something in, you get an answer back. Gemini Omni is more like having a personal assistant who can read your emails, watch a video you send them, listen to a voice note, and then actually do something about it. It processes any type of input — text, images, audio, video — and produces any type of output. Google called it "a leap forward in world understanding."

## Google Search Just Got Its Biggest Upgrade Ever

AI Overviews now reaches 2.5 billion people every single month. That number is staggering. It means the majority of people on earth who use the internet have already been using AI-powered search results without even thinking about it.

But what Google announced at I/O 2026 goes further. They're calling it AI Mode — and Pichai described it as the biggest Search upgrade in the company's history. Instead of typing a question and clicking a blue link, you'll have a full AI-powered conversation with Google. You can ask follow-up questions. It remembers context. It digs through sources so you don't have to.

The era of "search, scroll, click, scan, back, scroll again" is ending.

## The Features That Will Change Your Daily Life

Gemini Spark is a persistent AI agent that runs 24/7 in the background. It doesn't wait for you to open an app. It proactively surfaces things you might need before you even think to ask.

Universal Cart is an AI-powered shopping cart that works across multiple stores at once. No more seventeen browser tabs.

Ask YouTube lets you ask questions and get answers pulled directly from YouTube video content.

Google Pics is a new AI-powered design tool competing directly with Canva.

And then there are the smart glasses — audio wearables built with Gentle Monster, Warby Parker, and Samsung, arriving this fall. Compatible with both Android and iOS.

## What About Privacy? The AI Watermark Question

Google has an answer called SynthID. It's a watermarking technology that embeds an invisible mark into AI-generated content so it can be identified as machine-made. SynthID has already been applied over 50 million times globally, and Google announced it's now expanding into Search and Chrome.

## What This All Means for You

Six months from now, your experience of Google is going to feel meaningfully different. Search will feel like a conversation. Your phone will have a background assistant quietly managing things before you ask. Shopping across multiple sites will be one seamless experience.

Share this with someone who still thinks Google is just a search box.`,
    category: "Tech",
    authorId: 1,
    publishedAt: new Date("2026-05-24T10:00:00Z"),
    readTime: 9,
    imageUrl: "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=1200&q=80",
    views: 0,
    featured: true,
    editorsPick: true,
    tags: ["Google", "Google I/O", "Gemini AI", "AI Search", "Tech News"],
  },
  {
    slug: "ai-data-center-cloud-expansion-2026",
    title: "The World Is Running Out of Space for AI — So Tech Giants Are Building Cities of Servers",
    subtitle: "Why Google, Microsoft, and Blackstone are spending hundreds of billions to build the backbone of our AI future — and what it means for you",
    excerpt: "Every time you ask an AI a question, a room full of supercomputers the size of a football field springs to life. Here's why those rooms are being built at a pace the world has never seen before.",
    body: `Every time you ask ChatGPT a question, search Google with AI, or watch a video that was recommended by an algorithm, something happens behind the scenes that most people never think about.

Somewhere on earth — probably in a building the size of several football fields — a massive cluster of computers lights up, processes your request in milliseconds, and sends back an answer. That building is a data center. And right now, the world is racing to build more of them than ever before.

We're talking trillions of dollars. Thousands of acres. Enough energy to power entire cities. And it's all happening because AI has an enormous appetite — and it's only getting hungrier.

## What Exactly Is a Data Center — And Why Does AI Need So Many of Them?

Think of a data center as the brain behind every digital service you use. Every Google search. Every Netflix recommendation. Every Instagram filter. Every AI chatbot. None of it runs on your phone or laptop. It all runs on computers inside these giant buildings.

A single modern data center can hold hundreds of thousands of servers — powerful computers stacked in rows, humming away around the clock. They store data, process requests, and make the internet work.

But here's the issue: AI is extremely demanding. A regular Google search takes a tiny amount of computing power. Asking an AI to write you an essay, analyze a photo, or summarize a document? That can require thousands of times more computing muscle. And when hundreds of millions of people are doing it simultaneously, the math gets staggering very quickly.

## The Trillion-Dollar Building Boom No One Is Talking About

In May 2026, Google and Blackstone — one of the world's largest investment firms — announced plans to join forces to create an entirely new AI cloud company. The goal is to build and operate next-generation data center infrastructure at a scale that hasn't existed before.

Google isn't alone. Microsoft has committed over $80 billion toward AI infrastructure in 2026. Amazon, Meta, and Oracle are each spending tens of billions more. The total global investment in AI data centers is expected to surpass $1 trillion by the end of the decade.

To put that in perspective: the entire Apollo moon program, adjusted for today's money, cost around $280 billion. These companies are spending more than three times that — not to go to the moon, but to build the computing backbone for AI.

## The AI Boom: Why Everything Accelerated So Fast

Two years ago, most people had never heard of ChatGPT. Today, it has over 180 million users. Google's AI Overviews reaches 2.5 billion people every month. The Gemini app has nearly 900 million monthly users.

This wasn't a gradual climb. It was a vertical spike. AI went from a research curiosity to a product billions of people use daily, in roughly 18 months. And the infrastructure supporting it simply wasn't built for this kind of demand.

Think of it like a city that suddenly got a million new residents overnight. The roads, the water supply, the electrical grid — none of it was designed for that load. That's exactly the situation the tech industry is in right now.

## The Energy Problem Nobody Wants to Talk About

Here's where things get complicated. AI data centers consume enormous amounts of electricity. A single large data center can use as much power as 50,000 homes. And the world is now building hundreds of them.

This creates a serious tension. On one hand, tech companies have made big climate pledges. On the other, the demand for AI computing is growing so fast that it's outpacing the available clean energy supply.

Google's own environmental reports have shown its emissions rising, partly due to data center energy consumption. The industry is investing heavily in nuclear power, solar farms, and battery storage — but it's a genuine race against time.

## How This Actually Affects Your Life Right Now

Your apps get smarter. Every AI feature added to Google Maps, Spotify, your camera app, or your bank's fraud detection system runs on this infrastructure. More capacity means more features.

Prices could shift. Right now, many AI services are free or subsidized. As infrastructure costs rise, that calculus may change. Jobs are being created and disrupted simultaneously — building data centers requires engineers and electricians, but the AI inside them is also automating tasks in finance, writing, and customer service.

## What Comes Next

The chip war intensifies. Data centers need AI chips — primarily from Nvidia, but also from AMD, Intel, and custom chips from Google, Amazon, and Microsoft.

Nuclear power is making a comeback. Microsoft has already signed deals to restart a nuclear power plant. Google and Amazon are investing in small modular reactors. The AI boom may be one of the biggest drivers of nuclear energy's revival.

Smaller, smarter models will start running on your device. As cloud infrastructure expands, researchers are also working on making AI small enough to run on phones and laptops — freeing up cloud capacity for the heavy lifting.

## The Bottom Line

We are in the middle of the greatest buildout of computing infrastructure in human history. The data centers going up today are the factories of the AI economy. Like the steel mills of the industrial revolution, they're unglamorous and largely invisible — but they're the reason everything else works.

Share this with someone who thinks AI just lives in the cloud — because now you know exactly what that cloud is made of.`,
    category: "Tech",
    authorId: 2,
    publishedAt: new Date("2026-05-24T11:30:00Z"),
    readTime: 10,
    imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&q=80",
    views: 0,
    featured: false,
    editorsPick: true,
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
      await db.insert(authorsTable).values(author).onConflictDoNothing();
    }

    for (const category of categories) {
      await db.insert(categoriesTable).values(category).onConflictDoNothing();
    }

    for (const article of articles) {
      await db.insert(articlesTable).values(article).onConflictDoNothing();
    }

    console.log(`[seed] ✓ Seeded ${authors.length} authors, ${categories.length} categories, ${articles.length} articles.`);
  } catch (err) {
    console.error("[seed] Seed failed (non-fatal):", err);
  }
}
