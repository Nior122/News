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

const articles: (typeof articlesTable.$inferInsert)[] = [
  {
    slug: "google-io-2026-ai-announcements",
    title: "Google Just Changed Everything at I/O 2026 — Here Is What It Means For You",
    subtitle: "From an AI that shops for you to a search engine that actually talks back — Google's biggest week of the year just rewired your digital life",
    excerpt: "Every year, Google throws a party for developers. But this year felt different. Here's what happened at I/O 2026 and why it changes everything you do online.",
    body: `Every year, Google throws a party for developers. But this year felt different. Way different.

Google I/O 2026 wasn't just a conference. It was a declaration. A signal that everything you thought you knew about searching the internet, shopping online, and using your phone is about to change — fast.

Here's what happened, what it means, and what you should actually care about.

## What Is Google I/O and Why Should You Care?

Google I/O is Google's annual developer conference — but don't let the word "developer" fool you. This event shapes the products billions of people use every single day.

This year, thousands of developers, engineers, and journalists packed into the Shoreline Amphitheater in Mountain View, California. Millions more tuned in live from over 100 countries. The energy was different from past years. It felt less like a tech conference and more like a turning point.

If you use Google Search, Gmail, YouTube, or an Android phone, what was announced at I/O 2026 affects you directly. No coding knowledge required.

## The Biggest Announcements — Explained Simply

### Gemini 3.5 Flash — Faster and Smarter Than Ever

Google's new AI model, Gemini 3.5 Flash, is built for speed without sacrificing intelligence. It handles complex, real-world tasks — writing code, planning a trip, assisting developers building apps. For regular users, it's the engine powering faster, smarter responses everywhere Google's AI shows up. You'll feel the difference before you even notice it.

### Gemini Omni — Type Anything, Get Anything

Here's the thing — Gemini Omni is genuinely hard to explain because it's unlike anything before it. It can take any type of input — a photo, a voice note, a video clip, or plain text — and produce any type of output. Type a description and get a video back. Speak a prompt and get an image. It blurs the line between creation and instruction in a way that feels almost magical.

### Google Antigravity — AI That Actually Does Things

Google officially declared we're in the "Agentic Gemini Era." Antigravity 2.0 is their AI agent platform — and this is where things get genuinely exciting. Traditional AI answers your questions. Antigravity acts on them. It can complete complex tasks automatically — booking a restaurant, researching a topic, building a simple app — without you doing the steps yourself.

### Gemini Spark — Your AI That Never Sleeps

Gemini Spark is a persistent AI agent running 24/7 inside the Gemini app. Think of it less like a chatbot and more like a background assistant. It proactively surfaces information, reminds you of things, and takes actions on your behalf — even when you're not actively using the app. It doesn't wait for you to ask.

### The New Google Search — It Answers, Not Just Links

Sundar Pichai called AI Mode in Search "the biggest Search upgrade ever." He wasn't being subtle. Instead of a list of blue links, Search is becoming a full conversation. You ask, it answers. You follow up, it remembers. It pulls from across the web so you don't have to. The era of clicking through ten tabs to find one answer is ending.

## What Does This Actually Mean For You?

Honestly, the changes are closer than you think. If you use Google Search on your phone, you're probably already seeing AI Overviews — those AI-generated summaries at the top of results. That's just the beginning.

Your Android phone is about to get a lot more capable. Gemini is becoming less of an app and more of a layer built into how your phone works — answering questions, handling tasks, and learning your preferences over time.

Jobs will be affected. Let's be real about that. Tasks that used to require a specialist — image editing, basic coding, content research — are being automated. But new tools also create new opportunities. The question is whether you're using them or sitting them out.

And yes, Google is learning more about you than ever. The more AI personalizes your experience, the more data it needs. Convenience and privacy are in constant tension here — and that tension isn't going away.

## The Numbers That Show How Big This Really Is

Think about this: 2.5 billion people are already using Google's AI-powered search features every single month. That's roughly one in every three people on the planet.

The Gemini app hit 900 million monthly active users — up from 400 million just a year ago. That kind of growth doesn't happen by accident. It happens when a product genuinely becomes useful. And 50 billion images have now been generated using Google's AI tools. That number is almost impossible to picture.

Over 8.5 million developers are actively building with Gemini right now. To fund all of this, Google plans to spend $180–190 billion on AI in 2026 alone. For context, that's more than the GDP of many countries. The commitment is not casual.

## Should You Be Excited or Worried?

Both, honestly. And that's okay.

The excitement is real. Students are using Gemini to prep for exams. Musicians and artists are using it in their creative work. Small business owners are automating tasks they couldn't afford to outsource before. These tools are genuinely democratizing things that used to cost money or require expertise.

The concern is also real. Privacy questions don't have easy answers. The more Google knows about your habits, preferences, and behavior, the more powerful — and potentially invasive — it becomes. Job displacement in certain industries isn't a hypothetical. It's already happening.

The best thing you can do is stay informed. Know what these tools are, how they work, and what trade-offs come with them. Knowledge is power — especially now.

## Final Thoughts — The AI Era Is Already Here

Three things to take away from Google I/O 2026. First, AI Mode is changing Search in ways that affect every person who uses the internet. Second, Gemini Omni and Antigravity represent a new category of AI — one that creates and acts, not just responds. Third, the scale of this is enormous. We're not in the early days of AI anymore.

Watch for Gemini Spark rolling out to more users in the coming months. Keep an eye on how AI Mode changes your daily Search results. And pay attention to Universal Cart — AI-powered shopping that thinks for you is coming whether you're ready or not.

Which of these Google updates are you most excited about? Share this article with a friend who needs to catch up.`,
    category: "Tech",
    authorId: 1,
    publishedAt: new Date("2026-05-25T09:00:00Z"),
    readTime: 7,
    imageUrl: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=1200&q=80",
    views: 0,
    featured: true,
    editorsPick: true,
    tags: ["Google", "Google I/O 2026", "Gemini AI", "Gemini 3.5", "Google Antigravity", "AI Search", "Agentic AI"],
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

    console.log("[seed] Seeding authors and categories...");

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
