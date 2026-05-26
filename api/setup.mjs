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

  // ── 4. Article body content ───────────────────────────────────────────────
  const BODIES = {
    'google-io-2026-ai-announcements': `<p>Every year, Google throws a party for developers. But this year felt different. Way different.</p><p>Google I/O 2026 wasn't just a conference. It was a declaration — a signal that everything you thought you knew about searching the internet, shopping online, and using your phone is about to change. Fast.</p><h2>What Is Google I/O and Why Should You Care?</h2><p>Google I/O is Google's annual developer conference — but don't let the word "developer" fool you. This event shapes the products billions of people use every single day. If you use Google Search, Gmail, YouTube, or an Android phone — what was announced at I/O 2026 affects you directly.</p><h2>The Biggest Announcements</h2><h3>Gemini 3.5 Flash — Faster and Smarter Than Ever</h3><p>Google's new AI model is built for speed without sacrificing intelligence. Gemini 3.5 Flash handles complex, real-world tasks — writing code, planning a trip, assisting developers building apps.</p><h3>Gemini Omni — Type Anything, Get Anything</h3><p>Gemini Omni can take any type of input — a photo, a voice note, a video clip, or plain text — and produce any type of output. Type a description and get a video back.</p><h3>Google Antigravity — AI That Actually Does Things</h3><p>Google officially declared we're in the <strong>"Agentic Gemini Era."</strong> Antigravity 2.0 is their AI agent platform. It can complete complex tasks automatically — booking a restaurant, researching a topic, building a simple app — without you doing the steps yourself.</p><h3>The New Google Search — It Answers, Not Just Links</h3><p>Sundar Pichai called AI Mode in Search <strong>"the biggest Search upgrade ever."</strong> Instead of a list of blue links, Search is becoming a full conversation. You ask, it answers. You follow up, it remembers.</p><h2>What Does This Mean For You?</h2><p>Your Android phone is about to get a lot more capable. Gemini is becoming less of an app and more of a layer built into how your phone works — answering questions, handling tasks, and learning your preferences over time.</p><p>Think about this: <strong>2.5 billion people</strong> are already using Google's AI-powered search features every single month. The Gemini app hit <strong>900 million monthly active users</strong> — up from 400 million just a year ago.</p><h2>Final Thoughts</h2><p>AI Mode is changing Search in ways that affect every person who uses the internet. Gemini Omni and Antigravity represent a new category of AI — one that creates and acts, not just responds. <strong>Which of these Google updates are you most excited about?</strong></p>`,
    'tesla-self-driving-cars-2026': `<p>Picture this: you open an app, request a ride, and a car arrives at your door. No driver greets you. The steering wheel turns on its own, and you're moving through traffic guided entirely by software. That's not science fiction anymore.</p><p>Tesla's driverless cars are now operating on public roads in the United States — no human inside. It's a genuine milestone. But like most things in tech, the full story is more complicated than the headlines suggest.</p><h2>What Is Tesla's Self-Driving Technology?</h2><p>FSD — Full Self-Driving — is a software package Tesla sells for its vehicles. It comes in two forms. <strong>Supervised FSD</strong> requires a human behind the wheel at all times. <strong>Unsupervised FSD</strong> means the car drives itself with no human required at all. That second version is now running in Texas.</p><p>Then there's the <strong>Cybercab</strong> — a two-seat vehicle with no steering wheel and no pedals, built from the ground up to drive itself. It has roughly a 200-mile range and is being manufactured at Gigafactory Texas.</p><h2>Where Are Tesla Driverless Cars Operating Right Now?</h2><p>Tesla's unsupervised FSD service is currently live in <strong>Austin, Dallas, and Houston</strong>, Texas. Only around <strong>38 robotaxis</strong> are deployed across those three cities right now. Arizona has recently approved Tesla to begin testing, and expansion to Las Vegas, Phoenix, and Miami is planned.</p><h2>A Decade of Promises — The Honest Timeline</h2><p>Tesla's history with self-driving promises is complicated. Musk promised full autonomy in 2018. It did not happen. He promised one million robotaxis by 2020. That did not happen either. But in May 2026, driverless cars are genuinely operating on public US roads without a human inside. That's real progress.</p><h2>What Does This Mean For Regular People?</h2><p>The average American spends over 300 hours a year driving. If a significant portion of that becomes hands-free — that's hundreds of hours returned to your life every year.</p><p>For people who can't drive — whether due to age, disability, or medical conditions — fully autonomous vehicles could be genuinely life-changing.</p><h2>Final Thoughts</h2><p>Driverless Teslas are real, operating today, in three US cities. The scale is tiny — fewer than 40 vehicles — but the principle is proven. <strong>Would you get in a car with no driver?</strong></p>`,
    'big-tech-725-billion-ai-spending-layoffs-2026': `<p>In the same weeks that Amazon, Google, Meta, and Microsoft reported some of the strongest earnings in their histories, each of those companies also quietly handed out thousands of pink slips. Record profits. Record layoffs. At exactly the same time.</p><p>The reason: <strong>$725 billion</strong>. That is the combined amount those four companies have committed to spending on artificial intelligence infrastructure in 2026 alone — up 77% from the year before.</p><h2>The $725 Billion Number</h2><ul><li><strong>Amazon:</strong> approximately $200 billion</li><li><strong>Microsoft:</strong> approximately $190 billion</li><li><strong>Google/Alphabet:</strong> $175–185 billion</li><li><strong>Meta:</strong> $115–135 billion</li></ul><p>To put it in context: it is more than the GDP of Switzerland. And it is being spent in twelve months.</p><h2>The Layoffs — 113,000 Jobs and Counting</h2><p>By May 2026, more than <strong>113,000 tech workers</strong> had already lost their jobs. That averages out to <strong>825 people every single day</strong> since January 1st. April 2026 was the worst single month on record: <strong>83,387 tech job cuts</strong>, up 38% from March.</p><p>Mark Zuckerberg sent a staff memo explicitly linking the job cuts to the cost of AI infrastructure: <em>"We need to focus our investments on AI."</em> An unusually direct admission that human payroll and AI capex are competing line items.</p><h2>The Skills Divide</h2><p>Right now, there are <strong>275,000 AI-related jobs sitting unfilled</strong> across the tech industry. The people being laid off largely do not have the skills to fill them. Senior Bay Area engineers are now waiting an average of <strong>67 days to find new employment</strong>, nearly double the 38-day average from 2025.</p><h2>What Does This Mean For You?</h2><p>The single most important thing you can do right now is get genuinely comfortable with AI tools — not as an observer, but as someone who uses them to do their job better every day. The workers who are thriving in 2026 are the ones who made themselves harder to replace by becoming the people who know how to direct and build on top of AI systems.</p><p><strong>Share this with someone who works in tech and needs to see this.</strong></p>`,
    'amd-on-device-ai-no-internet-2026': `<p>You're in the middle of something important — summarizing a meeting, planning your budget, asking an AI to help you write a message — and your Wi-Fi cuts out. Everything stops. AMD just changed that.</p><h2>What Is On-Device AI?</h2><p>Most AI you use today — ChatGPT, Gemini, Siri — works by sending your words to a powerful computer in a data center far away. On-device AI flips that entirely. The thinking happens on your own chip, on your own device, in real time — with no internet connection needed.</p><h2>What AMD Just Did</h2><p>AMD's new Ryzen AI Max platform can run AI models with up to 200 billion parameters entirely on a consumer-grade laptop or desktop PC. No data center required. No internet connection. The chip uses 128GB of unified memory — meaning your processor, graphics card, and AI engine all share one fast, coordinated pool of memory.</p><p>AMD demonstrated this live, running full AI meeting summaries entirely on-device, zero cloud involved. And the startup time? Down from 10 seconds to just 1 second. AMD is calling these new machines "Agent Computers."</p><h2>Three Reasons This Changes Everything</h2><h3>1. Your Privacy Is Finally Protected</h3><p>With on-device AI, your medical information, your financial details, your personal conversations — none of it ever leaves your device. Not a single character.</p><h3>2. It Works Without Internet — Always</h3><p>On a plane, in a remote cabin, during a network outage — your AI keeps working. It's also faster. Without the round trip to a server and back, responses are near-instant.</p><h3>3. No Usage Limits and No Extra Costs</h3><p>Cloud AI charges per use. On-device AI changes the math completely. You pay for the chip once. After that, there are no API fees, no monthly subscription limits.</p><h2>Final Thoughts</h2><p>On-device AI shifts power back to you. Privacy, speed, and independence — three things the internet has always struggled to deliver at the same time. <strong>Share this with someone who cares about their privacy online.</strong></p>`,
    'tiktok-brain-attention-span-2026': `<p>Here's a question worth sitting with: when was the last time you read something — an article, a book chapter, even a long email — without reaching for your phone? If you're struggling to remember, you're not alone, and it may not be entirely your fault.</p><h2>What Researchers Actually Found</h2><p>A 2026 study from University College London tracked 3,000 adults across 18 months of heavy short-form video consumption. Average sustained attention dropped by 22% over the study period. The ability to hold focus on a single task for more than 90 seconds declined in participants who watched more than two hours of short-form video daily.</p><p>The culprit isn't laziness. It's dopamine. Every swipe delivers a micro-hit of novelty. Your brain, optimised over millions of years to pay attention to new things, gets hijacked by an endless stream of them.</p><h2>The Real-World Effects</h2><p>Students report finding lectures physically painful to sit through. Workers describe struggling to finish reports they could have written easily three years ago. Readers abandon books after a few pages. The brain is plastic: it rewires itself based on what you repeatedly do. Feed it constant novelty, and it gets worse at tolerating the absence of novelty.</p><h2>What You Can Actually Do</h2><p>The research also shows the brain can recover. The key is deliberate practice in sustained attention — reading physical books, taking walks without a phone, having conversations without checking notifications. Even 20 minutes a day of focused, single-task activity shows measurable improvements in attention within six weeks.</p><p>The algorithm is optimised for your eyeballs, not your wellbeing. <strong>Share this with someone who keeps saying they "used to read a lot."</strong></p>`,
    'memes-internet-news-culture-2026': `<p>When something significant happens in the world, here is what the timeline now looks like. The event occurs. Within minutes, someone makes a meme. Within an hour, that meme has reached more people than any newspaper article published about it. By the time a formal news piece is written, edited, and published, the meme has already shaped how the world feels about what happened.</p><h2>The Speed That Changes Everything</h2><p>Speed is the point. Traditional journalism takes time — reporting, verification, editing, legal review. A meme takes thirty seconds. In a world where the first framing of a story is often the one that sticks, memes consistently win the race. They don't just report what happened. They tell you how to feel about it, what narrative to attach to it, and which side you're supposed to be on.</p><p>Framing shapes perception in ways that are deeply difficult to undo. Once a meme has established a story — a politician as bumbling, a company as villainous, a moment as absurd — counter-narratives struggle to gain traction no matter how accurate they are.</p><h2>Why Memes Work on Your Brain</h2><p>The combination of image and text activates more of the brain simultaneously than either format alone. Humour bypasses the critical thinking that you'd apply to a serious editorial. And the shareability is built in — forwarding a meme takes one tap and feels like participation rather than consumption.</p><p>Political campaigns, corporations, and advocacy groups have all figured this out. The most sophisticated influence operations in 2026 don't run TV ads. They seed memes. <strong>Which format do you trust more — a breaking news alert or what you see in your feed?</strong></p>`,
    'four-day-work-week-results-2026': `<p>The premise sounds too good to be true: work one fewer day per week, keep the same pay, and somehow get more done. And yet, that is exactly what the data from the world's largest ever 4-day work week trial shows.</p><h2>What the Trial Found</h2><p>The 2025-2026 global trial, which ran across 233 companies and more than 14,000 employees in 17 countries, published its final results in early 2026. Revenue increased by an average of <strong>8%</strong> during the trial period. Staff turnover dropped by <strong>57%</strong>. Sick days fell by <strong>65%</strong>. And 92% of companies said they intended to continue the 4-day week permanently.</p><p>Output — measured in tasks completed, projects shipped, and customer satisfaction scores — either held steady or improved at 94% of participating companies.</p><h2>Why It Works</h2><p>Most knowledge workers are genuinely productive for around 3-5 hours per day. The rest of the time is filled with unnecessary meetings, email theatre, and the slow drift that happens when your brain knows it has all day. Compress the week and you compress the waste. Focus sharpens. Decisions get made faster.</p><h2>The Obstacles That Remain</h2><p>Not every industry can adopt the model easily. Healthcare, retail, manufacturing, and logistics all run on coverage models that make a simple schedule reduction complicated. And managers raised in the culture of presence — where being seen at your desk signals commitment — struggle to let go of visibility as a proxy for performance.</p><p>But for knowledge work? The evidence is now difficult to dismiss. <strong>Would you take a pay-neutral 4-day week if your employer offered it?</strong></p>`,
    'quitting-social-media-digital-detox-2026': `<p>Something is shifting. Not loudly, not in a way that generates many headlines, but measurably. In the first quarter of 2026, deactivation rates for major social media platforms hit their highest levels since these networks launched. The people leaving aren't posting about quitting. They're just… gone.</p><h2>What's Driving the Exit</h2><p>Exit surveys from three separate research groups point to similar reasons. Exhaustion is the most common — not the dramatic kind, but a low-grade tiredness from the constant performance of curating a life for an audience. The second is what researchers are calling "return on attention anxiety" — the growing feeling that time spent scrolling yields nothing of genuine value.</p><p>The third reason: people are increasingly aware that the feed is not neutral. Every post shown to you was chosen to provoke a reaction — ideally outrage, because outrage is the most engagement-generating emotion. Once you see the mechanism, it's hard to unsee it.</p><h2>What People Are Doing Instead</h2><p>The leavers aren't becoming hermits. They're reading more — physical books, long-form articles. They're using messaging apps for direct communication with actual friends. Many are returning to newsletters, podcasts, and hobby forums where the content is created by people who care about the subject rather than an algorithm that rewards volume.</p><p>Some describe the first two weeks without social media as uncomfortable — a phantom-limb sensation. After a month, most describe feeling calmer, more present, and better rested. <strong>If you deleted your most-used social app tomorrow, what would you actually miss?</strong></p>`,
    'iphone-settings-change-now-2026': `<p>Your iPhone was configured by engineers in Cupertino to work for Apple's ecosystem. Some of those defaults are sensible. Others quietly drain your battery, share more data than you'd choose, and slow down your experience. Here are 12 things worth changing today.</p><h2>Battery &amp; Performance</h2><p><strong>1. Turn off Background App Refresh</strong> for apps that don't need it. Go to Settings → General → Background App Refresh. Most apps don't need to update in the background.</p><p><strong>2. Enable Optimised Battery Charging.</strong> Settings → Battery → Battery Health &amp; Charging. This slows charging above 80% to reduce battery wear.</p><p><strong>3. Reduce motion.</strong> Settings → Accessibility → Motion → Reduce Motion. The parallax and animation effects consume more processing power.</p><h2>Privacy</h2><p><strong>4. Audit your location permissions.</strong> Settings → Privacy &amp; Security → Location Services. Any app with "Always" access is tracking your movement continuously. Most should be "While Using" or "Never."</p><p><strong>5. Turn off personalised ads.</strong> Settings → Privacy &amp; Security → Apple Advertising → turn off Personalised Ads.</p><p><strong>6. Disable Significant Locations.</strong> Settings → Privacy &amp; Security → Location Services → System Services → Significant Locations. Your phone is logging everywhere you go.</p><h2>Usability</h2><p><strong>7. Set your default browser and email app.</strong> Settings → Apps → find your preferred browser or email client.</p><p><strong>8. Turn on Back Tap.</strong> Settings → Accessibility → Touch → Back Tap. Double or triple tapping the back of your phone can trigger actions.</p><p><strong>9. Schedule a Focus mode for work hours.</strong> Settings → Focus. This silences notifications from apps outside your approved list.</p><p><strong>10. Turn off raise to wake if you use Face ID.</strong> Settings → Display &amp; Brightness → Raise to Wake.</p><p><strong>11. Enable haptic keyboard feedback.</strong> Settings → Sound &amp; Haptics → Keyboard Feedback → Haptic.</p><p><strong>12. Check which apps can see your clipboard.</strong> Any time an app accesses your clipboard, iOS shows a notification. Pay attention. <strong>Forward this to someone who just got a new iPhone.</strong></p>`,
    'android-battery-life-tips-2026': `<p>If your Android phone's battery doesn't make it through the day, the most likely culprit isn't a worn-out battery — it's apps running in the background doing things you never asked them to do. Here's how to identify the drain and shut it down.</p><h2>Find Out What's Actually Draining Your Battery</h2><p>Go to <strong>Settings → Battery → Battery Usage</strong>. Sort by consumption over the last 24 hours. You're looking for apps in the top five that you don't remember actively using. Social media apps are chronic offenders — they run in the background refreshing feeds, loading ads, and tracking your location even when you haven't opened them.</p><h2>The Seven Changes That Make the Biggest Difference</h2><p><strong>1. Restrict background activity per app.</strong> Long press any app → App Info → Battery → Restricted. This stops apps from waking up when you're not using them.</p><p><strong>2. Turn off Always-On Display if you have one.</strong> Keeping the screen partially lit all day costs more than most people realise.</p><p><strong>3. Set screen timeout to 30 seconds.</strong> Settings → Display → Screen Timeout. The display is your single biggest battery consumer.</p><p><strong>4. Use Adaptive Battery.</strong> Settings → Battery → Adaptive Battery. This uses on-device AI to learn which apps you actually use and restricts battery access for everything else.</p><p><strong>5. Turn off Wi-Fi scanning and Bluetooth scanning.</strong> Settings → Location → Wi-Fi and Bluetooth Scanning. These scan for networks even when you're not using either.</p><p><strong>6. Enable Dark Mode system-wide.</strong> On OLED screens, dark pixels are literally turned off. Dark Mode can extend battery life by 15-20%.</p><p><strong>7. Charge to 85%, not 100%.</strong> Many Android phones now let you cap charging — Settings → Battery → Charging Limit. <strong>Share this with someone complaining their phone dies before lunch.</strong></p>`,
    'ai-tools-saving-hours-every-week-2026': `<p>There is a gap between AI tools that get written about and AI tools that actually get used. The former are often impressive in demos and frustrating in practice. The latter are often less flashy but consistently useful. Here's a practical breakdown of what's actually saving people time in 2026.</p><h2>Writing and Editing</h2><p><strong>Claude (Anthropic)</strong> and <strong>ChatGPT (OpenAI)</strong> are both genuinely excellent for first drafts. The workflow that works: don't ask AI to write something from scratch — give it your rough bullet points and ask it to turn them into a coherent first draft. Then edit. People using this workflow report saving 2-3 hours per week on written communication alone.</p><p><strong>Grammarly and Hemingway Editor</strong> remain reliable for editing — quietly effective at catching the errors and convoluted sentences that slip through on a tired afternoon.</p><h2>Research and Summarisation</h2><p><strong>Perplexity AI</strong> has become the go-to for research among professionals who need cited, sourced answers rather than a confident AI hallucination. It shows you where its information came from, which matters when you're using it for work that other people will rely on.</p><p><strong>NotebookLM</strong> (Google) lets you upload documents — PDFs, articles, reports — and then ask questions about them. It can collapse a 90-minute read into a focused 15-minute session.</p><h2>Task Management and Focus</h2><p><strong>Reclaim.ai</strong> integrates with your calendar and automatically schedules focus time, habits, and buffer time around meetings. People who've used it consistently for a month report getting back an average of 6 hours of focused work time per week.</p><p>The common thread: these tools work best as assistants, not replacements. <strong>Which of these are you already using?</strong></p>`,
    'todo-list-broken-better-system-2026': `<p>If you've ever ended the day with more items on your to-do list than you started with — despite working hard all day — you've experienced what productivity researchers call the "Sisyphus effect." The list grows faster than you can clear it. And eventually, you stop trusting the list at all.</p><h2>Why Most To-Do Lists Fail</h2><p>The standard to-do list has three structural problems. First, it treats all tasks as equal — a two-minute email reply sits next to a three-week project deliverable. Second, it has no relationship with time — you can add unlimited items with no awareness of how many hours you actually have. Third, it captures tasks but not outcomes.</p><h2>The System That Works Better</h2><p><strong>Time-blocking instead of listing.</strong> Instead of a list of tasks, schedule them as specific blocks in your calendar. If a task isn't worth giving time to, it shouldn't be on the list.</p><p><strong>The MIT method: three Most Important Tasks.</strong> Each morning, identify the three things that — if you completed only those — would make the day a genuine success. Everything else is a bonus. This forces genuine prioritisation.</p><p><strong>Weekly review.</strong> Once a week, look at everything outstanding and make an active decision about each item: do it, schedule it, delegate it, or delete it. Items that sit untouched for three weeks are items you've already decided not to do.</p><p><strong>Capture and process separately.</strong> Write everything down immediately (capture), but only process — decide what to do with it — at a scheduled time, not continuously.</p><p>The goal isn't an empty list. It's a trustworthy system. <strong>Share this with someone who's been talking about getting organised since January.</strong></p>`,
    'chatgpt-claude-gemini-comparison-2026': `<p>By 2026, there are three AI assistants that dominate the conversation: ChatGPT from OpenAI, Claude from Anthropic, and Gemini from Google. All three are free to start. All three can write, reason, research, and code. So which one should you actually use?</p><h2>ChatGPT — The Most Versatile All-Rounder</h2><p><strong>Best for:</strong> Brainstorming, creative writing, coding help, building custom workflows.</p><p>ChatGPT (GPT-4o) is the most widely used AI assistant in the world for a reason — it handles an enormous range of tasks competently. It's the best for creative work: story writing, marketing copy, generating ideas, and iterating quickly on drafts. It's also the most "conversational" of the three.</p><p><strong>Watch out for:</strong> Occasional confident hallucinations, and a tendency to be sycophantic — telling you what you want to hear rather than what's true.</p><h2>Claude — The Best for Long, Serious Work</h2><p><strong>Best for:</strong> Long documents, nuanced analysis, careful reasoning, writing that needs to sound like a human.</p><p>Claude (Sonnet 3.7) from Anthropic is widely considered the best AI for serious written work. If you need to process a long PDF or write something that sounds genuinely thoughtful, Claude consistently outperforms the others. It's also the most honest of the three — it will push back on incorrect assumptions.</p><p><strong>Watch out for:</strong> It can be more cautious than necessary. The free tier is more limited than ChatGPT's.</p><h2>Gemini — The Best Connected to Google's World</h2><p><strong>Best for:</strong> Research with web access, working with Google Workspace, multimodal tasks.</p><p>Gemini 2.0 Flash's core advantage is integration. If you live in Google Docs, Gmail, and Drive, Gemini integrates directly into those tools. For research tasks where you need current information, Gemini with web access is consistently strong.</p><h2>The Bottom Line</h2><ul><li><strong>For writing, creativity, and coding:</strong> ChatGPT</li><li><strong>For serious analysis, long documents, and honest answers:</strong> Claude</li><li><strong>For research, current events, and Google integration:</strong> Gemini</li></ul><p>The best move? Use all three. They're all free to start. <strong>Share this with someone still just using whichever AI they heard of first.</strong></p>`,
    'ai-prompt-formula-better-answers-2026': `<p>Most people use AI assistants like a slightly smarter search engine. They type a question, get an answer, and move on. And most of the time, the answer is... fine. Usable. Forgettable.</p><p>The people getting dramatically better results from the same tools aren't using different AI — they're asking differently. Here's the framework that makes the biggest difference.</p><h2>The RCTF Formula</h2><p>Every high-quality AI prompt has four components:</p><ul><li><strong>R — Role:</strong> Tell the AI who to be</li><li><strong>C — Context:</strong> Give it the background it needs</li><li><strong>T — Task:</strong> State exactly what you want</li><li><strong>F — Format:</strong> Specify how you want the output</li></ul><h2>What This Looks Like in Practice</h2><p><strong>Before (vague):</strong> "Write me an email to my boss about taking a day off."</p><p><strong>After (RCTF):</strong> "You are a professional business writer. I work in a mid-sized marketing agency and I have a good relationship with my manager. Write me a brief, professional email requesting one day off next Friday to attend a family event. Keep it to 3 sentences, casual but professional in tone."</p><p>The second version produces something you can send directly. The first produces a generic template you have to rewrite anyway.</p><h2>Three More Techniques That Work</h2><p><strong>1. "Give me your honest assessment."</strong> AI models are trained to be agreeable. Explicitly asking for an honest, critical take consistently unlocks more useful analysis.</p><p><strong>2. Ask for options, not one answer.</strong> "Give me three different approaches to this, with the tradeoffs of each" consistently outperforms "tell me the best way."</p><p><strong>3. Iterate, don't start over.</strong> Your first prompt is a starting point. Follow up: "Make it shorter." "Make the tone more confident." "Add a specific example."</p><p>The tools are powerful. How you talk to them determines how much of that power you actually get. <strong>Try the RCTF formula on your next prompt and see the difference for yourself.</strong></p>`,
    'hidden-android-features-2026': `<p>Most Android users tap into about 20% of what their phone can actually do. The other 80% sits quietly in settings menus and hidden features that never get mentioned in the box or the setup guide. Here are seven of the best.</p><h2>1. One-Handed Mode</h2><p>Go to <strong>Settings → Advanced Features → One-Handed Mode</strong>. Swipe down on the bottom edge of the screen to shrink the entire display to one corner. Essential if you have a large phone and small hands — or if you're frequently using your phone while holding something else.</p><h2>2. Secure Folder</h2><p>Samsung devices have a <strong>Secure Folder</strong> (Settings → Biometrics and Security → Secure Folder) — a fully encrypted, password-protected space on your phone where you can store apps, photos, and files. Even if someone picks up your phone, they cannot access what's inside without your separate Secure Folder PIN.</p><h2>3. Split Screen and Pop-Up View</h2><p>Long press the Recent Apps button and select "Split Screen." You can run two apps simultaneously — a browser alongside your notes app, YouTube alongside a messaging app. Pop-Up View takes this further, letting you float a small app window over another app like a picture-in-picture.</p><h2>4. Developer Options — USB Debugging and Animation Speed</h2><p>Go to <strong>Settings → About Phone</strong> and tap "Build Number" seven times quickly. This unlocks Developer Options. Inside, you can reduce animation scales from 1x to 0.5x — making your entire phone feel noticeably faster. You can also enable USB debugging for advanced file management.</p><h2>5. Screen Recorder with Audio</h2><p>Pull down the notification shade and look for Screen Recorder in your quick settings tiles. Unlike third-party apps, the built-in version captures your screen with internal audio, mic audio, or both — with no watermark and no quality limit.</p><h2>6. Live Transcribe</h2><p>Android's built-in <strong>Live Transcribe</strong> (search for it in Settings or the Play Store if not pre-installed) transcribes spoken audio to text in real time with impressive accuracy. Useful in meetings, lectures, or any situation where you need a written record of what was said.</p><h2>7. Clipboard History</h2><p>On Samsung and many other Android devices, the keyboard has a built-in clipboard manager. Tap the clipboard icon in your keyboard toolbar to see everything you've recently copied — not just the last item. You can pin frequently used text snippets so they never expire.</p><p><strong>Share this with an Android user who thinks they already know everything their phone can do.</strong></p>`,
  };

  // ── 5. Seed articles (skip if any already exist) ──────────────────────────
  const { rows: existing } = await pool.query('SELECT COUNT(*) as c FROM articles');
  if (parseInt(existing[0].c, 10) === 0) {

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
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,true,$12,NOW(),0)
       ON CONFLICT (slug) DO NOTHING`,
      [
        a.slug, a.title, a.subtitle ?? null, a.excerpt,
        BODIES[a.slug] ?? null,
        a.category, a.authorId, a.imageUrl, a.readTime,
        a.featured, a.editorsPick, a.tags,
      ],
    );
  }

  } // end if count === 0

  // ── 6. Update body for any articles that have null body ───────────────────
  for (const [slug, body] of Object.entries(BODIES)) {
    await pool.query(
      `UPDATE articles SET body = $1 WHERE slug = $2 AND body IS NULL`,
      [body, slug],
    );
  }

  console.log('[setup] Schema and seed complete.');
}
