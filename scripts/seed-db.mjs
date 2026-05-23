import pg from "pg";
import { fileURLToPath } from "url";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const authors = [
  { id: 1, name: "Maya Chen", avatar_url: "https://i.pravatar.cc/150?img=47" },
  { id: 2, name: "James Okafor", avatar_url: "https://i.pravatar.cc/150?img=68" },
  { id: 3, name: "Sofia Reyes", avatar_url: "https://i.pravatar.cc/150?img=31" },
  { id: 4, name: "Liam Park", avatar_url: "https://i.pravatar.cc/150?img=12" },
  { id: 5, name: "Anya Patel", avatar_url: "https://i.pravatar.cc/150?img=56" },
];

const articles = [
  {
    slug: "openai-gpt5-changes-everything",
    title: "GPT-5 Is Here — And It Changes Everything We Know About AI",
    subtitle: "The most powerful language model ever built just landed, and the implications are staggering",
    excerpt: "OpenAI's latest model doesn't just answer questions — it reasons, plans, and executes complex multi-step tasks with near-human precision. We spent two weeks testing it.",
    body: "OpenAI has officially released GPT-5, and after two weeks of hands-on testing, we can confidently say: this is a genuine leap forward. Not an incremental update. A leap.\n\nThe model demonstrates reasoning capabilities that consistently surprised our team. When given a complex legal document to analyze alongside recent case law, it didn't just summarize — it identified contradictions, flagged ambiguities, and suggested specific clauses to renegotiate.\n\nWhat's most striking is the model's ability to acknowledge uncertainty. Unlike previous versions that would confidently hallucinate, GPT-5 frequently pauses to note what it doesn't know.\n\nThe implications for knowledge work are significant. Tasks that took hours now take minutes.",
    category: "AI Tools",
    author_id: 1,
    published_at: "2026-05-22T09:00:00Z",
    read_time: 8,
    image_url: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=1200&q=80",
    views: 48200,
    featured: true,
    editors_pick: true,
    tags: ["AI", "OpenAI", "GPT-5", "Technology"],
  },
  {
    slug: "apple-vision-pro-2-review",
    title: "Apple Vision Pro 2 Review: The Future Finally Fits on Your Face",
    subtitle: "Apple's second-generation spatial computer is lighter, faster, and actually useful",
    excerpt: "After a year of refinements, Apple's Vision Pro sequel addresses almost every complaint about the original. But is it worth the price?",
    body: "The first Vision Pro was a proof of concept. This is the product Apple always meant to ship.\n\nAt 180 grams — nearly 100 grams lighter than its predecessor — Vision Pro 2 no longer feels like wearing a small television strapped to your forehead. The new titanium frame sits comfortably for hours.\n\nThe display has been upgraded to micro-LED panels with 5000 nits peak brightness, making it usable even in direct sunlight. Eye tracking is faster and more accurate.\n\nIs it worth $2,799? For professionals in design, medicine, or engineering — probably yes.",
    category: "Tech",
    author_id: 2,
    published_at: "2026-05-21T11:00:00Z",
    read_time: 10,
    image_url: "https://images.unsplash.com/photo-1697577418961-fc43c2b86f65?w=1200&q=80",
    views: 35100,
    featured: false,
    editors_pick: true,
    tags: ["Apple", "Vision Pro", "AR", "VR", "Review"],
  },
  {
    slug: "tiktok-generation-attention-crisis",
    title: "The Attention Crisis Is Real — And TikTok Isn't the Only Culprit",
    subtitle: "New research reveals how short-form video rewires the adolescent brain",
    excerpt: "A landmark 5-year study tracking 12,000 teenagers finds that heavy short-form video use correlates with measurable changes in sustained attention capacity.",
    body: "The research is in, and the results are sobering.\n\nA five-year longitudinal study found that adolescents who spent more than two hours daily on short-form video platforms showed statistically significant reductions in their ability to sustain attention.\n\nBut here's what the headlines are missing: TikTok is not uniquely responsible. YouTube Shorts, Instagram Reels, and Snapchat Spotlight showed nearly identical effect sizes.\n\n\"We're essentially training young brains to expect constant novelty,\" says Dr. Rachel Kim at Stanford's Center for Cognitive Science.",
    category: "Culture",
    author_id: 3,
    published_at: "2026-05-20T14:30:00Z",
    read_time: 7,
    image_url: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1200&q=80",
    views: 29800,
    featured: false,
    editors_pick: true,
    tags: ["Social Media", "Mental Health", "Research", "TikTok"],
  },
  {
    slug: "samsung-galaxy-s26-ultra-hands-on",
    title: "Samsung Galaxy S26 Ultra: First Look at the Camera That Shoots Like a DSLR",
    subtitle: "200MP sensor, AI-powered processing, and a zoom range that defies physics",
    excerpt: "We got early access to Samsung's flagship for 48 hours. The camera system is unlike anything we've tested before.",
    body: "Samsung's engineers have been working on one problem for three years: how do you put a DSLR-quality camera in a phone without compromising on portability?\n\nThe headline feature is the new 200MP 1-inch sensor. Paired with Samsung's Snapdragon 9 Gen 2 processor, it processes images using a new AI pipeline.\n\nIn bright daylight, the results are genuinely indistinguishable from a mirrorless camera. The 10x optical zoom is the sharpest we've tested in any smartphone.\n\nPrice: Starting at $1,399. Available June 15.",
    category: "Phone Tips",
    author_id: 4,
    published_at: "2026-05-19T10:00:00Z",
    read_time: 6,
    image_url: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=1200&q=80",
    views: 27600,
    featured: false,
    editors_pick: false,
    tags: ["Samsung", "Galaxy", "Smartphone", "Camera", "Review"],
  },
  {
    slug: "deep-work-in-the-ai-age",
    title: "Deep Work Is More Valuable Than Ever — And Harder Than Ever to Achieve",
    subtitle: "How to protect your most productive hours in a world designed to fragment your attention",
    excerpt: "Cal Newport's 2016 concept has never been more relevant. Here's how top performers are structuring their days to stay ahead of AI-assisted mediocrity.",
    body: "In 2016, Cal Newport coined the term 'deep work' to describe cognitively demanding tasks performed in a state of distraction-free concentration.\n\nAs AI tools handle more routine knowledge work, the premium on original, complex thinking has skyrocketed.\n\nThe highest performers we interviewed share three practices: temporal isolation, tool separation, and output measurement.\n\nThe uncomfortable truth: most people are using AI to do shallow work faster, when the real opportunity is to use the time AI saves to go deeper.",
    category: "Productivity",
    author_id: 5,
    published_at: "2026-05-18T08:00:00Z",
    read_time: 9,
    image_url: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=1200&q=80",
    views: 23400,
    featured: false,
    editors_pick: true,
    tags: ["Productivity", "Deep Work", "AI", "Focus"],
  },
  {
    slug: "indie-gaming-renaissance",
    title: "The Indie Gaming Renaissance No One Is Talking About",
    subtitle: "While AAA studios chase sequels, small teams are making the most important games of the decade",
    excerpt: "From Balatro to Hades II, indie studios are consistently out-innovating their billion-dollar counterparts. We look at why — and what's coming next.",
    body: "Something remarkable happened in gaming over the past three years: the most critically acclaimed games have almost all come from teams of fewer than 20 people.\n\nBalatro, made by a solo developer, sold 5 million copies. Hades II is in early access and already generating more revenue than many AAA releases.\n\nMeanwhile, major studios are releasing increasingly expensive, decreasingly interesting sequels.\n\nAI tools are accelerating this further. What used to require a team of 50 can now be done by a team of 5.",
    category: "Culture",
    author_id: 1,
    published_at: "2026-05-17T15:00:00Z",
    read_time: 7,
    image_url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&q=80",
    views: 19200,
    featured: false,
    editors_pick: false,
    tags: ["Gaming", "Indie Games", "Culture", "Technology"],
  },
  {
    slug: "claude-ai-coding-assistant-review",
    title: "I Let Claude Write My Code for 30 Days. Here's What Happened.",
    subtitle: "An honest account of using Anthropic's AI as a full-time coding partner",
    excerpt: "Productivity gains were real, but so were the subtle bugs that passed code review. A developer's unfiltered report from the frontier of AI-assisted engineering.",
    body: "I gave myself one rule: if Claude could write it, I'd let it. For 30 days, that meant virtually every line of code I shipped had AI involvement.\n\nThe productivity numbers are real. I shipped features in days that would have taken weeks.\n\nBut the failure modes are subtle. Claude confidently writes code that works in isolation but fails at system boundaries.\n\nConclusion: Claude is an extraordinary junior developer. Use it for scaffolding and well-defined tasks. But the architectural decisions must remain human.",
    category: "AI Tools",
    author_id: 2,
    published_at: "2026-05-16T10:00:00Z",
    read_time: 11,
    image_url: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=1200&q=80",
    views: 31500,
    featured: false,
    editors_pick: false,
    tags: ["AI", "Claude", "Coding", "Developer Tools"],
  },
  {
    slug: "morning-routine-science-2026",
    title: "Science Finally Explains Why Your Morning Routine Isn't Working",
    subtitle: "New chronobiology research upends decades of advice about peak performance windows",
    excerpt: "The 5 AM club, cold plunges, and fasted workouts may be working against your biology. Researchers reveal why individual chronotype matters more than any routine.",
    body: "The wellness industry has spent a decade convincing you that successful people wake up at 5 AM. New science suggests this advice may be actively harmful for many people.\n\nA landmark study from the Karolinska Institute found that 'night owls' who forced themselves onto an early morning schedule showed elevated cortisol and impaired working memory.\n\nThe practical implication: spend two weeks tracking when you naturally feel sharpest. Then build your most cognitively demanding work around that window.",
    category: "Lifestyle",
    author_id: 3,
    published_at: "2026-05-15T07:00:00Z",
    read_time: 8,
    image_url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
    views: 18700,
    featured: false,
    editors_pick: false,
    tags: ["Health", "Wellness", "Science", "Productivity"],
  },
  {
    slug: "pixel-9-pro-hidden-features",
    title: "15 Pixel 9 Pro Features You're Probably Not Using",
    subtitle: "Google buried some genuinely useful tools deep in the settings",
    excerpt: "From the temperature sensor to Advanced Photo Unblur to the satellite calling feature — we dig into Pixel 9 Pro's overlooked toolkit.",
    body: "Google's Pixel 9 Pro is one of the most feature-rich phones ever made. It's also one of the worst marketed. Most owners are using maybe 40% of what the phone can do.\n\nTop features: Satellite calling, temperature sensor, Advanced Photo Unblur, Audio Magic Eraser on videos, Call Screen for texts, and Pocket mode.\n\nAll of these are buried deep in settings — but all of them are genuinely useful once you find them.",
    category: "Phone Tips",
    author_id: 4,
    published_at: "2026-05-14T12:00:00Z",
    read_time: 6,
    image_url: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=1200&q=80",
    views: 22100,
    featured: false,
    editors_pick: false,
    tags: ["Pixel", "Google", "Android", "Tips", "Smartphone"],
  },
  {
    slug: "remote-work-loneliness-epidemic",
    title: "Remote Work's Hidden Cost: The Loneliness No One Talks About",
    subtitle: "Three years after the great return-to-office debate, the mental health data is finally in",
    excerpt: "A comprehensive study of 50,000 remote workers reveals a loneliness crisis that productivity metrics can't capture — and what companies are getting wrong.",
    body: "The productivity debate about remote work is largely settled: when managed well, remote workers are as productive as in-office counterparts.\n\nBut a new study reveals the cost that never showed up in the spreadsheets: 41% of remote workers report feeling lonely 'often or always.'\n\nThe companies with lowest loneliness scores invested heavily in unstructured time: virtual coffee breaks with no agenda, optional social channels, physical offsites with minimal work content.",
    category: "Culture",
    author_id: 5,
    published_at: "2026-05-13T09:00:00Z",
    read_time: 9,
    image_url: "https://images.unsplash.com/photo-1516387938699-a93567ec168e?w=1200&q=80",
    views: 16900,
    featured: false,
    editors_pick: false,
    tags: ["Remote Work", "Mental Health", "Culture", "Workplace"],
  },
  {
    slug: "second-brain-notion-obsidian",
    title: "Building a Second Brain in 2026: Notion vs Obsidian vs Everything Else",
    subtitle: "After testing every major PKM tool for six months, here's what actually works",
    excerpt: "The personal knowledge management space has exploded. We put every major tool through real-world use to find out which one actually improves thinking.",
    body: "Everyone has a note-taking app. Almost no one has a working knowledge management system.\n\nNotion remains best for teams. Obsidian is the tool that thinks most like a brain — linking notes has repeatedly helped find ideas I'd forgotten I had.\n\nThe winner for most people: a hybrid approach. Obsidian for permanent notes, a fast capture app for immediate thoughts.\n\nThe deeper truth: the tool matters less than the habit of review.",
    category: "Productivity",
    author_id: 1,
    published_at: "2026-05-12T11:00:00Z",
    read_time: 10,
    image_url: "https://images.unsplash.com/photo-1517842645767-c639042777db?w=1200&q=80",
    views: 14300,
    featured: false,
    editors_pick: false,
    tags: ["Productivity", "Notion", "Obsidian", "PKM", "Tools"],
  },
  {
    slug: "urban-farming-tech-revolution",
    title: "The $10 Billion Bet on Growing Food in Cities",
    subtitle: "Vertical farming just had its worst year ever financially. But the technology has never been more promising.",
    excerpt: "After a wave of bankruptcies, vertical farming companies are rebuilding with better economics and a clearer-eyed view of what they can actually achieve.",
    body: "2024 was a disaster for vertical farming. But 2026 might be the year it finally becomes viable.\n\nThe industry made three fundamental mistakes: it tried to compete on commodity crops, underestimated energy costs, and over-promised on AI optimization.\n\nThe survivors have pivoted to high-value crops: pharmaceutical herbs, exotic mushrooms, premium microgreens. The technology itself has improved dramatically — LED efficiency is up 60% since 2020.",
    category: "Tech",
    author_id: 2,
    published_at: "2026-05-11T13:00:00Z",
    read_time: 8,
    image_url: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=1200&q=80",
    views: 11800,
    featured: false,
    editors_pick: false,
    tags: ["Technology", "Food", "Agriculture", "Sustainability"],
  },
  {
    slug: "sleep-optimization-wearables",
    title: "I Tracked My Sleep for a Year. The Results Were Uncomfortable.",
    subtitle: "Eight sleep trackers, one year, and some hard truths about what actually improves sleep",
    excerpt: "Using Oura, Whoop, Apple Watch, and five other devices simultaneously, I discovered that most sleep advice is backwards.",
    body: "After 365 nights of tracking with eight simultaneous devices, the clearest finding is: anxiety about sleep metrics makes sleep worse.\n\nThe most consistent improvement came from two changes: stopping caffeine before noon, and keeping the bedroom below 68°F.\n\nThe wearable data confirmed something sleep researchers have known for years: total sleep time matters less than sleep efficiency — the percentage of time in bed actually spent asleep.",
    category: "Lifestyle",
    author_id: 4,
    published_at: "2026-05-10T08:00:00Z",
    read_time: 9,
    image_url: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=1200&q=80",
    views: 15600,
    featured: false,
    editors_pick: false,
    tags: ["Sleep", "Health", "Wearables", "Wellness"],
  },
  {
    slug: "twitter-x-two-years-later",
    title: "X at Two Years: What Actually Changed (And What Didn't)",
    subtitle: "A data-driven look at how the platform has evolved since the acquisition",
    excerpt: "Two years after Elon Musk's takeover, the numbers tell a complicated story about user behavior, advertiser confidence, and platform health.",
    body: "Two years after the acquisition, X (formerly Twitter) presents a paradox: the platform is simultaneously more chaotic and more useful than it's ever been.\n\nMonthly active users are down 18% from peak Twitter, but engagement per remaining user is up 34%. The users who stayed are using it more intensely.\n\nAdvertiser revenue has recovered to 71% of pre-acquisition levels — lower than before, but higher than the 40% floor it hit in early 2023.\n\nThe platform's identity remains unresolved: is it a town square, a media company, or a payments platform? The answer affects every product decision.",
    category: "Tech",
    author_id: 3,
    published_at: "2026-05-09T10:00:00Z",
    read_time: 7,
    image_url: "https://images.unsplash.com/photo-1611605698335-8b1569810432?w=1200&q=80",
    views: 20300,
    featured: false,
    editors_pick: false,
    tags: ["Twitter", "X", "Social Media", "Tech"],
  },
  {
    slug: "ai-fitness-coach-test",
    title: "I Used AI as My Personal Trainer for 90 Days. Here's the Truth.",
    subtitle: "Testing five AI fitness coaching apps against a human personal trainer",
    excerpt: "AI fitness coaches have gotten remarkably good. But there are still things only a human coach can do — and they matter more than the apps want you to think.",
    body: "I ran a 90-day experiment: for the first 45 days, I worked exclusively with an AI fitness coach. For the last 45, I worked with a human trainer.\n\nThe AI coach excelled at programming. The workouts were well-structured, progressive, and adapted intelligently to my logged performance.\n\nThe human trainer caught something the AI couldn't: a slight hip imbalance that was causing knee stress. Fixing it prevented an injury the AI would never have detected.\n\nConclusion: AI coaching is excellent for people who already understand movement fundamentals. For beginners, the lack of real-time form correction is a meaningful gap.",
    category: "Lifestyle",
    author_id: 5,
    published_at: "2026-05-08T09:00:00Z",
    read_time: 8,
    image_url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&q=80",
    views: 13200,
    featured: false,
    editors_pick: false,
    tags: ["Fitness", "AI", "Health", "Lifestyle"],
  },
];

async function seed() {
  const client = await pool.connect();
  try {
    // Check if already seeded
    const existing = await client.query("SELECT COUNT(*) FROM articles");
    if (parseInt(existing.rows[0].count) > 0) {
      console.log(`Database already has ${existing.rows[0].count} articles — skipping seed.`);
      return;
    }

    // Seed authors
    console.log("Seeding authors...");
    for (const author of authors) {
      await client.query(
        `INSERT INTO authors (id, name, avatar_url) VALUES ($1, $2, $3) ON CONFLICT (id) DO NOTHING`,
        [author.id, author.name, author.avatar_url]
      );
    }

    // Reset author ID sequence
    await client.query(`SELECT setval('authors_id_seq', (SELECT MAX(id) FROM authors))`);

    // Seed articles
    console.log("Seeding articles...");
    for (const article of articles) {
      await client.query(
        `INSERT INTO articles (slug, title, subtitle, excerpt, body, category, author_id, published_at, read_time, image_url, views, featured, editors_pick, tags)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
         ON CONFLICT (slug) DO NOTHING`,
        [
          article.slug,
          article.title,
          article.subtitle,
          article.excerpt,
          article.body,
          article.category,
          article.author_id,
          article.published_at,
          article.read_time,
          article.image_url,
          article.views,
          article.featured,
          article.editors_pick,
          article.tags,
        ]
      );
    }

    console.log(`✓ Seeded ${authors.length} authors and ${articles.length} articles.`);
  } finally {
    client.release();
    await pool.end();
  }
}

seed().catch((err) => {
  console.error("Seed failed:", err.message);
  process.exit(1);
});
