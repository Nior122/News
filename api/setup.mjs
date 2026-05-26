/**
 * Auto-setup for Vercel serverless deployments.
 * Creates tables and seeds initial articles if the database is empty.
 * Runs once per cold start, cached as a promise to avoid duplicate calls.
 */

let setupPromise = null;

export function ensureReady(pool) {
  if (!setupPromise) {
    setupPromise = runSetup(pool).catch((err) => {
      // Reset so the next request retries
      setupPromise = null;
      console.error('[setup] failed:', err);
    });
  }
  return setupPromise;
}

async function runSetup(pool) {
  // ── 1. Create tables ──────────────────────────────────────────────────────
  await pool.query(`
    CREATE TABLE IF NOT EXISTS authors (
      id         SERIAL PRIMARY KEY,
      name       TEXT NOT NULL,
      avatar_url TEXT NOT NULL DEFAULT ''
    );

    CREATE TABLE IF NOT EXISTS categories (
      slug         TEXT PRIMARY KEY,
      name         TEXT NOT NULL,
      color        TEXT NOT NULL DEFAULT '#3B82F6',
      article_count INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS articles (
      id           SERIAL PRIMARY KEY,
      slug         TEXT NOT NULL UNIQUE,
      title        TEXT NOT NULL,
      subtitle     TEXT,
      excerpt      TEXT NOT NULL DEFAULT '',
      body         TEXT,
      category     TEXT NOT NULL,
      author_id    INTEGER NOT NULL DEFAULT 1,
      published_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      read_time    INTEGER NOT NULL DEFAULT 3,
      image_url    TEXT NOT NULL DEFAULT '',
      views        INTEGER NOT NULL DEFAULT 0,
      featured     BOOLEAN NOT NULL DEFAULT FALSE,
      editors_pick BOOLEAN NOT NULL DEFAULT FALSE,
      tags         TEXT[] NOT NULL DEFAULT '{}',
      published    BOOLEAN NOT NULL DEFAULT TRUE
    );

    CREATE TABLE IF NOT EXISTS newsletter_subscribers (
      id            SERIAL PRIMARY KEY,
      email         TEXT NOT NULL UNIQUE,
      subscribed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  // ── 2. Seed authors ───────────────────────────────────────────────────────
  await pool.query(`
    INSERT INTO authors (id, name, avatar_url) VALUES
      (1, 'Maya Chen',    'https://i.pravatar.cc/150?img=47'),
      (2, 'James Okafor', 'https://i.pravatar.cc/150?img=68'),
      (3, 'Sofia Reyes',  'https://i.pravatar.cc/150?img=31'),
      (4, 'Liam Park',    'https://i.pravatar.cc/150?img=12'),
      (5, 'Anya Patel',   'https://i.pravatar.cc/150?img=56')
    ON CONFLICT (id) DO NOTHING;
  `);

  // Fix sequence if needed
  await pool.query(`SELECT setval('authors_id_seq', (SELECT MAX(id) FROM authors));`);

  // ── 3. Seed categories ────────────────────────────────────────────────────
  await pool.query(`
    INSERT INTO categories (slug, name, color, article_count) VALUES
      ('tech',         'Tech',         '#3B82F6', 0),
      ('culture',      'Culture',      '#8B5CF6', 0),
      ('lifestyle',    'Lifestyle',    '#10B981', 0),
      ('ai-tools',     'AI Tools',     '#F59E0B', 0),
      ('phone-tips',   'Phone Tips',   '#EF4444', 0),
      ('productivity', 'Productivity', '#06B6D4', 0),
      ('trending',     'Trending',     '#F97316', 0)
    ON CONFLICT (slug) DO NOTHING;
  `);

  // ── 4. Seed articles (skip if any already exist) ──────────────────────────
  const { rows: existing } = await pool.query('SELECT COUNT(*) as c FROM articles');
  if (parseInt(existing[0].c, 10) > 0) return;

  const articles = [
    {
      slug: 'google-io-2026-ai-announcements',
      title: 'Google Just Changed Everything at I/O 2026 — Here Is What It Means For You',
      subtitle: 'From an AI that shops for you to a search engine that actually talks back — Google\'s biggest week of the year just rewired your digital life',
      excerpt: 'Every year, Google throws a party for developers. But this year felt different. Here\'s what happened at I/O 2026 and why it changes everything you do online.',
      category: 'Tech', authorId: 1,
      imageUrl: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=1200&q=80',
      readTime: 7, featured: true, editorsPick: true,
      tags: ['Google', 'Google I/O 2026', 'Gemini AI', 'AI Search', 'Agentic AI'],
    },
    {
      slug: 'tesla-self-driving-cars-2026',
      title: 'Tesla\'s Self-Driving Cars Are Hitting US Streets in 2026 — Here Is What That Actually Means',
      subtitle: 'Driverless Teslas are already operating in Texas with no human inside — here\'s what\'s real, what\'s hype, and what it means for the rest of us',
      excerpt: 'You order a ride. The car pulls up. Nobody\'s driving. That\'s not a movie scene anymore — it\'s happening right now on real streets in the US.',
      category: 'Tech', authorId: 2,
      imageUrl: 'https://images.unsplash.com/photo-1617886322168-72b886573c35?w=1200&q=80',
      readTime: 7, featured: false, editorsPick: false,
      tags: ['Tesla', 'Self-Driving Cars', 'Tesla FSD', 'Autonomous Vehicles', 'Robotaxi'],
    },
    {
      slug: 'big-tech-725-billion-ai-spending-layoffs-2026',
      title: 'Big Tech Is Spending $725 Billion on AI — And Firing Thousands of Workers to Pay For It',
      subtitle: 'Google, Meta, Amazon, and Microsoft are making the biggest financial bet in corporate history — and the workers paying the price are watching it happen in real time',
      excerpt: 'In the same weeks that the biggest tech companies reported record profits, they also handed thousands of employees their walking papers.',
      category: 'Tech', authorId: 2,
      imageUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1200&q=80',
      readTime: 8, featured: false, editorsPick: true,
      tags: ['AI', 'Tech Layoffs', 'Big Tech', 'Amazon', 'Microsoft', 'Google', 'Meta'],
    },
    {
      slug: 'amd-on-device-ai-no-internet-2026',
      title: 'AMD Just Made Powerful AI Work Directly On Your Device — No Internet Needed',
      subtitle: 'AMD\'s Ryzen AI Max chip runs massive AI models entirely offline — your data stays private, your AI works anywhere, and you never pay a usage fee again',
      excerpt: 'You\'re in the middle of something important and your Wi-Fi cuts out. Everything stops. AMD just changed that — and the implications are bigger than most people realize.',
      category: 'Tech', authorId: 4,
      imageUrl: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=1200&q=80',
      readTime: 7, featured: false, editorsPick: false,
      tags: ['AMD', 'On-Device AI', 'AMD Ryzen AI', 'Offline AI', 'AI Privacy'],
    },
    {
      slug: 'tiktok-brain-attention-span-2026',
      title: 'The TikTok Brain Is Real — Here\'s What Constant Scrolling Is Doing to Your Mind',
      subtitle: 'Neuroscientists now have the data — and the results are harder to dismiss than you\'d like',
      excerpt: 'You open the app for two minutes and look up to find an hour has vanished. That\'s not a coincidence. Here\'s the science behind what short-form video is doing to your attention span.',
      category: 'Culture', authorId: 3,
      imageUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1200&q=80',
      readTime: 6, featured: false, editorsPick: true,
      tags: ['TikTok', 'Social Media', 'Attention Span', 'Mental Health', 'Digital Wellness'],
    },
    {
      slug: 'memes-internet-news-culture-2026',
      title: 'How Memes Became the Fastest News Network on Earth',
      subtitle: 'Before journalists finish typing, memes have already told the story — and shaped how millions of people feel about it',
      excerpt: 'A meme about a major event travels faster than any breaking news alert. Here\'s how internet culture became the world\'s most influential media format.',
      category: 'Culture', authorId: 2,
      imageUrl: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=1200&q=80',
      readTime: 5, featured: false, editorsPick: false,
      tags: ['Memes', 'Internet Culture', 'Social Media', 'Media', 'News'],
    },
    {
      slug: 'four-day-work-week-results-2026',
      title: 'The 4-Day Work Week Is Here — And the Results Are Harder to Argue With',
      subtitle: 'Over 200 companies trialled dropping Friday from the working week. Here\'s what actually happened to productivity, revenue, and staff wellbeing',
      excerpt: 'The world\'s largest 4-day work week trial just published its final results. Productivity went up. Revenue went up. Employee burnout went down.',
      category: 'Lifestyle', authorId: 5,
      imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&q=80',
      readTime: 6, featured: false, editorsPick: true,
      tags: ['4-Day Work Week', 'Work Life Balance', 'Future of Work', 'Productivity'],
    },
    {
      slug: 'quitting-social-media-digital-detox-2026',
      title: 'Why Millions Are Quietly Quitting Social Media in 2026',
      subtitle: 'It\'s not about willpower or wellness trends — something bigger is shifting in how people relate to their phones',
      excerpt: 'The number of people deactivating major social media accounts hit a record high in early 2026. Here\'s what they\'re doing instead — and what they\'re not missing.',
      category: 'Lifestyle', authorId: 3,
      imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1200&q=80',
      readTime: 5, featured: false, editorsPick: false,
      tags: ['Social Media', 'Digital Detox', 'Mental Health', 'Lifestyle', 'Wellbeing'],
    },
    {
      slug: 'iphone-settings-change-now-2026',
      title: '12 iPhone Settings You Should Change the Moment You Read This',
      subtitle: 'Most people never touch these — but they make a meaningful difference to your battery life, privacy, and how fast your phone actually feels',
      excerpt: 'Your iPhone ships with settings optimised for Apple\'s priorities, not yours. Here are the 12 tweaks that make an immediate difference.',
      category: 'Phone Tips', authorId: 1,
      imageUrl: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=1200&q=80',
      readTime: 7, featured: false, editorsPick: false,
      tags: ['iPhone', 'iOS', 'Phone Tips', 'Battery Life', 'Privacy', 'Apple'],
    },
    {
      slug: 'android-battery-life-tips-2026',
      title: 'How to Make Your Android Battery Last All Day — Every Day',
      subtitle: 'No, you don\'t need a new phone. You need to change seven settings',
      excerpt: 'Most Android battery drain comes from a handful of apps and settings doing things you never asked them to do. Here\'s how to find and fix them in under ten minutes.',
      category: 'Phone Tips', authorId: 4,
      imageUrl: 'https://images.unsplash.com/photo-1595941069915-4ebc5197c14a?w=1200&q=80',
      readTime: 6, featured: false, editorsPick: false,
      tags: ['Android', 'Battery Life', 'Phone Tips', 'Samsung', 'Google Pixel'],
    },
    {
      slug: 'ai-tools-saving-hours-every-week-2026',
      title: 'The AI Tools That Are Actually Saving People Hours Every Week',
      subtitle: 'Not the hyped ones — the ones that real people are quietly using to reclaim their time',
      excerpt: 'There\'s a lot of noise about AI tools. Here are the ones that are genuinely delivering on their promises for everyday work tasks in 2026.',
      category: 'Productivity', authorId: 5,
      imageUrl: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&q=80',
      readTime: 7, featured: false, editorsPick: true,
      tags: ['AI Tools', 'Productivity', 'ChatGPT', 'Claude', 'Work Smarter'],
    },
    {
      slug: 'todo-list-broken-better-system-2026',
      title: 'Your To-Do List Is Broken. Here\'s the System That Actually Works.',
      subtitle: 'The problem isn\'t your willpower or discipline — it\'s the way most to-do lists are fundamentally designed to fail',
      excerpt: 'A to-do list that never gets finished isn\'t a motivation problem. It\'s a system problem. Here\'s what the research says about task management that actually works.',
      category: 'Productivity', authorId: 1,
      imageUrl: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=1200&q=80',
      readTime: 6, featured: false, editorsPick: false,
      tags: ['Productivity', 'To-Do Lists', 'Time Management', 'GTD', 'Focus'],
    },
    {
      slug: 'chatgpt-claude-gemini-comparison-2026',
      title: 'ChatGPT vs Claude vs Gemini — Which AI Is Actually Best for You in 2026?',
      subtitle: 'Three leading AI assistants, all free to try, all doing the same job differently. Here\'s the honest breakdown of which one wins for what',
      excerpt: 'Everyone\'s using AI assistants now — but most people are using the wrong one for their needs. Here\'s how ChatGPT, Claude, and Gemini actually compare in 2026.',
      category: 'AI Tools', authorId: 5,
      imageUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&q=80',
      readTime: 7, featured: false, editorsPick: true,
      tags: ['ChatGPT', 'Claude', 'Gemini', 'AI Tools', 'AI Assistants', 'OpenAI'],
    },
    {
      slug: 'ai-prompt-formula-better-answers-2026',
      title: 'The AI Prompt Formula That Makes Every Tool Give You Better Answers',
      subtitle: 'Most people type questions into AI like they\'re Googling. Here\'s why that\'s leaving most of the value on the table — and the simple formula that changes everything',
      excerpt: 'The difference between a mediocre AI response and a genuinely useful one usually comes down to how you asked the question. Here\'s the formula that works every time.',
      category: 'AI Tools', authorId: 1,
      imageUrl: 'https://images.unsplash.com/photo-1655720033654-a4239dd42d10?w=1200&q=80',
      readTime: 6, featured: false, editorsPick: false,
      tags: ['AI Tools', 'Prompt Engineering', 'ChatGPT', 'Claude', 'Gemini', 'AI Tips'],
    },
    {
      slug: 'hidden-android-features-2026',
      title: '7 Hidden Android Phone Features Most People Still Do Not Know About in 2026',
      subtitle: 'Most users only tap into 20% of what their Android phone can do',
      excerpt: 'These hidden Android phone features can improve battery life, privacy, multitasking, and daily productivity. Most users still have no idea they exist.',
      category: 'Phone Tips', authorId: 2,
      imageUrl: 'https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg',
      readTime: 7, featured: false, editorsPick: false,
      tags: ['Android', 'Samsung', 'Xiaomi', 'Google Pixel', 'Phone Tips', 'Productivity'],
    },
  ];

  for (const a of articles) {
    await pool.query(
      `INSERT INTO articles
         (slug, title, subtitle, excerpt, body, category, author_id, image_url,
          read_time, featured, editors_pick, published, tags, published_at, views)
       VALUES ($1,$2,$3,$4,NULL,$5,$6,$7,$8,$9,$10,true,$11,NOW(),0)
       ON CONFLICT (slug) DO NOTHING`,
      [
        a.slug, a.title, a.subtitle ?? null, a.excerpt,
        a.category, a.authorId, a.imageUrl, a.readTime,
        a.featured, a.editorsPick, a.tags,
      ],
    );
  }

  console.log('[setup] Schema and seed complete.');
}
