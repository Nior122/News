export const authors = [
  { id: 1, name: "Maya Chen", avatarUrl: "https://i.pravatar.cc/150?img=47" },
  { id: 2, name: "James Okafor", avatarUrl: "https://i.pravatar.cc/150?img=68" },
  { id: 3, name: "Sofia Reyes", avatarUrl: "https://i.pravatar.cc/150?img=31" },
  { id: 4, name: "Liam Park", avatarUrl: "https://i.pravatar.cc/150?img=12" },
  { id: 5, name: "Anya Patel", avatarUrl: "https://i.pravatar.cc/150?img=56" },
];

export const articles = [
  {
    id: 1,
    slug: "openai-gpt5-changes-everything",
    title: "GPT-5 Is Here — And It Changes Everything We Know About AI",
    subtitle: "The most powerful language model ever built just landed, and the implications are staggering",
    excerpt: "OpenAI's latest model doesn't just answer questions — it reasons, plans, and executes complex multi-step tasks with near-human precision. We spent two weeks testing it.",
    body: `OpenAI has officially released GPT-5, and after two weeks of hands-on testing, we can confidently say: this is a genuine leap forward. Not an incremental update. A leap.\n\nThe model demonstrates reasoning capabilities that consistently surprised our team. When given a complex legal document to analyze alongside recent case law, it didn't just summarize — it identified contradictions, flagged ambiguities, and suggested specific clauses to renegotiate. When asked to debug a 2,000-line codebase, it found the error on the first try and explained why three other parts of the code might fail as a consequence.\n\nWhat's most striking is the model's ability to acknowledge uncertainty. Unlike previous versions that would confidently hallucinate, GPT-5 frequently pauses to note what it doesn't know — a crucial safety feature for real-world deployment.\n\nThe implications for knowledge work are significant. Tasks that took hours now take minutes. Research that required specialists can now be bootstrapped by generalists. Whether this accelerates human potential or displaces workers remains the defining question of our era.`,
    category: "AI Tools",
    authorId: 1,
    publishedAt: new Date("2026-05-22T09:00:00Z").toISOString(),
    readTime: 8,
    imageUrl: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=1200&q=80",
    views: 48200,
    featured: true,
    editorsPick: true,
    tags: ["AI", "OpenAI", "GPT-5", "Technology"],
  },
  {
    id: 2,
    slug: "apple-vision-pro-2-review",
    title: "Apple Vision Pro 2 Review: The Future Finally Fits on Your Face",
    subtitle: "Apple's second-generation spatial computer is lighter, faster, and actually useful",
    excerpt: "After a year of refinements, Apple's Vision Pro sequel addresses almost every complaint about the original. But is it worth the price?",
    body: `The first Vision Pro was a proof of concept. This is the product Apple always meant to ship.\n\nAt 180 grams — nearly 100 grams lighter than its predecessor — Vision Pro 2 no longer feels like wearing a small television strapped to your forehead. The new titanium frame sits comfortably for hours. The battery, now integrated into the headband, lasts 4.5 hours in mixed reality mode.\n\nBut the real story is the software. visionOS 3 has matured into a genuinely useful operating system. The new Spatial Canvas app alone is worth the price of admission for architects and designers — manipulating 3D models by hand, at full scale, in your physical space, is an experience that screenshots simply cannot convey.\n\nThe display has been upgraded to micro-LED panels with 5000 nits peak brightness, making it usable even in direct sunlight. Eye tracking is faster and more accurate, eliminating the slight delay that made the original feel laggy.\n\nIs it worth $2,799? For professionals in design, medicine, or engineering — probably yes. For consumers, it's still a luxury. But for the first time, I can imagine recommending this to a non-technical friend.`,
    category: "Tech",
    authorId: 2,
    publishedAt: new Date("2026-05-21T11:00:00Z").toISOString(),
    readTime: 10,
    imageUrl: "https://images.unsplash.com/photo-1697577418961-fc43c2b86f65?w=1200&q=80",
    views: 35100,
    featured: false,
    editorsPick: true,
    tags: ["Apple", "Vision Pro", "AR", "VR", "Review"],
  },
  {
    id: 3,
    slug: "tiktok-generation-attention-crisis",
    title: "The Attention Crisis Is Real — And TikTok Isn't the Only Culprit",
    subtitle: "New research reveals how short-form video rewires the adolescent brain",
    excerpt: "A landmark 5-year study tracking 12,000 teenagers finds that heavy short-form video use correlates with measurable changes in sustained attention capacity.",
    body: `The research is in, and the results are sobering.\n\nA five-year longitudinal study tracking 12,000 teenagers from ages 13 to 18 found that adolescents who spent more than two hours daily on short-form video platforms showed statistically significant reductions in their ability to sustain attention on single tasks for longer than 90 seconds.\n\nBut here's what the headlines are missing: TikTok is not uniquely responsible. YouTube Shorts, Instagram Reels, and Snapchat Spotlight showed nearly identical effect sizes. The mechanism isn't the platform — it's the format: content optimized to maximize swipes per minute.\n\n"We're essentially training young brains to expect constant novelty," says Dr. Rachel Kim, the study's lead researcher at Stanford's Center for Cognitive Science. "The problem isn't screen time broadly — it's the specific reward structure of infinite scroll."\n\nThe study also found protective factors: teenagers who played strategic video games, read for pleasure, or engaged in musical instruments showed significantly smaller attention impacts, even with high total screen time.\n\nFor parents, the implication isn't to ban devices. It's to ensure children have regular, extended periods of cognitively demanding engagement without interruption.`,
    category: "Culture",
    authorId: 3,
    publishedAt: new Date("2026-05-20T14:30:00Z").toISOString(),
    readTime: 7,
    imageUrl: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1200&q=80",
    views: 29800,
    featured: false,
    editorsPick: true,
    tags: ["Social Media", "Mental Health", "Research", "TikTok"],
  },
  {
    id: 4,
    slug: "samsung-galaxy-s26-ultra-hands-on",
    title: "Samsung Galaxy S26 Ultra: First Look at the Camera That Shoots Like a DSLR",
    subtitle: "200MP sensor, AI-powered processing, and a zoom range that defies physics",
    excerpt: "We got early access to Samsung's flagship for 48 hours. The camera system is unlike anything we've tested before.",
    body: `Samsung's engineers have been working on one problem for three years: how do you put a DSLR-quality camera in a phone without compromising on portability? The Galaxy S26 Ultra is their answer.\n\nThe headline feature is the new 200MP 1-inch sensor — the largest ever fitted in a smartphone. Paired with Samsung's latest Snapdragon 9 Gen 2 processor, it processes images using a new AI pipeline that takes 12 frames simultaneously and composites them in under a second.\n\nIn bright daylight, the results are genuinely indistinguishable from a mirrorless camera at equivalent settings. In low light, the 4-second long exposure mode captures detail that would require a tripod and a dedicated camera from any competitor.\n\nThe 10x optical zoom (now with a periscope lens redesigned to reduce aberration) is the sharpest we've tested in any smartphone. We photographed text on a building from 400 meters and could read every word.\n\nThe S Pen remains, refined with a new pressure-sensitive nib that finally feels like a real pen. Battery life is exceptional: 6,000mAh with 65W wired and 25W wireless charging.\n\nPrice: Starting at $1,399. Available June 15.`,
    category: "Phone Tips",
    authorId: 4,
    publishedAt: new Date("2026-05-19T10:00:00Z").toISOString(),
    readTime: 6,
    imageUrl: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=1200&q=80",
    views: 27600,
    featured: false,
    editorsPick: false,
    tags: ["Samsung", "Galaxy", "Smartphone", "Camera", "Review"],
  },
  {
    id: 5,
    slug: "deep-work-in-the-ai-age",
    title: "Deep Work Is More Valuable Than Ever — And Harder Than Ever to Achieve",
    subtitle: "How to protect your most productive hours in a world designed to fragment your attention",
    excerpt: "Cal Newport's 2016 concept has never been more relevant. Here's how top performers are structuring their days to stay ahead of AI-assisted mediocrity.",
    body: `In 2016, Cal Newport coined the term "deep work" to describe cognitively demanding tasks performed in a state of distraction-free concentration. A decade later, his insight looks prophetic.\n\nAs AI tools handle more routine knowledge work, the premium on original, complex thinking has skyrocketed. The people thriving professionally aren't those who can do tasks fastest — it's those who can think deepest.\n\nBut here's the irony: the same AI tools driving demand for deep work are also making it harder to achieve. Slack integrations, AI assistants that ping you with suggestions, and the dopamine loop of watching AI generate output — all erode the focused states where genuine insight happens.\n\nThe highest performers we interviewed share three practices:\n\n**Temporal isolation.** They block 3-4 hours before any meetings or email. This isn't morning routine — it's a protected cognitive workspace.\n\n**Tool separation.** AI assistants are used in specific, bounded sessions. Not left open as ambient background noise.\n\n**Output measurement.** They track what they actually produce, not hours worked. This ruthlessly reveals how fragmented most "work" days really are.\n\nThe uncomfortable truth: most people are using AI to do shallow work faster, when the real opportunity is to use the time AI saves to go deeper.`,
    category: "Productivity",
    authorId: 5,
    publishedAt: new Date("2026-05-18T08:00:00Z").toISOString(),
    readTime: 9,
    imageUrl: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=1200&q=80",
    views: 23400,
    featured: false,
    editorsPick: true,
    tags: ["Productivity", "Deep Work", "AI", "Focus"],
  },
  {
    id: 6,
    slug: "indie-gaming-renaissance",
    title: "The Indie Gaming Renaissance No One Is Talking About",
    subtitle: "While AAA studios chase sequels, small teams are making the most important games of the decade",
    excerpt: "From Balatro to Hades II, indie studios are consistently out-innovating their billion-dollar counterparts. We look at why — and what's coming next.",
    body: `Something remarkable happened in gaming over the past three years: the most critically acclaimed, most culturally resonant games have almost all come from teams of fewer than 20 people.\n\nBalatro, a poker-themed roguelike made by a solo developer, sold 5 million copies. Hades II is in early access and already generating more revenue than many AAA releases. Animal Well — made by one person over six years — is still being dissected by players who've completed it dozens of times.\n\nMeanwhile, major studios are releasing increasingly expensive, decreasingly interesting sequels to franchises from the 2000s.\n\nThe reason isn't mystery. Indie developers make games they want to play, for audiences who share their taste, without committees demanding the game appeal to the broadest possible demographic. The result is games with genuine creative vision.\n\nAI tools are accelerating this further. Indie developers can now generate assets, write dialogue, and create sound effects at fractions of previous costs. What used to require a team of 50 can be done by a team of 5.\n\nThe next wave of groundbreaking games will almost certainly come from small, passionate teams. The question is whether the industry will adapt its business models to support them — or whether the App Store and Steam will continue taking 30% while creators struggle.`,
    category: "Culture",
    authorId: 1,
    publishedAt: new Date("2026-05-17T15:00:00Z").toISOString(),
    readTime: 7,
    imageUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&q=80",
    views: 19200,
    featured: false,
    editorsPick: false,
    tags: ["Gaming", "Indie Games", "Culture", "Technology"],
  },
  {
    id: 7,
    slug: "claude-ai-coding-assistant-review",
    title: "I Let Claude Write My Code for 30 Days. Here's What Happened.",
    subtitle: "An honest account of using Anthropic's AI as a full-time coding partner",
    excerpt: "Productivity gains were real, but so were the subtle bugs that passed code review. A developer's unfiltered report from the frontier of AI-assisted engineering.",
    body: `I gave myself one rule: if Claude could write it, I'd let it. For 30 days, that meant virtually every line of code I shipped had AI involvement.\n\nThe productivity numbers are real. I shipped features in days that would have taken weeks. I explored three different architectural approaches before committing, something I'd never have time for otherwise. Documentation that I'd always deprioritized got written automatically.\n\nBut the failure modes are subtle and important.\n\nClaude confidently writes code that works in isolation but fails at system boundaries. It doesn't know that our legacy auth service expects headers in a specific undocumented format. It doesn't know that our database has a particular quirk with timezone handling on this specific version of Postgres. It generates code that passes every test I ask it to write — because it's not asking the right tests.\n\nThe deeper problem: I found myself understanding the code less. I could explain what it did, but not why specific architectural choices were made, because I hadn't made them.\n\nAfter 30 days, my conclusion: Claude is an extraordinary junior developer. Use it to accelerate scaffolding, documentation, and well-defined tasks. But the architectural decisions, the system design, the "why" — that has to remain human. The moment you outsource that, you've lost something you can't easily get back.`,
    category: "AI Tools",
    authorId: 2,
    publishedAt: new Date("2026-05-16T10:00:00Z").toISOString(),
    readTime: 11,
    imageUrl: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=1200&q=80",
    views: 31500,
    featured: false,
    editorsPick: false,
    tags: ["AI", "Claude", "Coding", "Developer Tools"],
  },
  {
    id: 8,
    slug: "morning-routine-science-2026",
    title: "Science Finally Explains Why Your Morning Routine Isn't Working",
    subtitle: "New chronobiology research upends decades of advice about peak performance windows",
    excerpt: "The 5 AM club, cold plunges, and fasted workouts may be working against your biology. Researchers reveal why individual chronotype matters more than any routine.",
    body: `The wellness industry has spent a decade convincing you that successful people wake up at 5 AM. New science suggests this advice may be actively harmful for a significant portion of the population.\n\nA landmark study from the Karolinska Institute tracked the productivity, health markers, and cognitive performance of 4,200 professionals over two years, correlating everything with their individual chronotypes — their genetically influenced preference for morning or evening activity.\n\nThe finding: "night owls" who forced themselves onto an early morning schedule showed elevated cortisol, impaired working memory, and 23% lower scores on creative problem-solving tasks compared to those who worked within their natural rhythm.\n\n"We've been telling people to fight their biology and calling it discipline," says lead researcher Dr. Erik Lindstrom. "For true morning types, 5 AM is excellent. For evening chronotypes — roughly 25% of the population — it's chronically stressful."\n\nThe research also debunks cold plunge timing advice. Cold water immersion raises alertness and cortisol — beneficial before an evening chronotype's natural peak hours, but potentially disruptive for morning types who need cortisol curves to drop toward midday.\n\nThe practical implication: before adopting any morning routine, spend two weeks tracking when you naturally feel sharpest. Then build your most cognitively demanding work around that window — regardless of what time it is.`,
    category: "Lifestyle",
    authorId: 3,
    publishedAt: new Date("2026-05-15T07:00:00Z").toISOString(),
    readTime: 8,
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
    views: 18700,
    featured: false,
    editorsPick: false,
    tags: ["Health", "Wellness", "Science", "Productivity"],
  },
  {
    id: 9,
    slug: "pixel-9-pro-hidden-features",
    title: "15 Pixel 9 Pro Features You're Probably Not Using",
    subtitle: "Google buried some genuinely useful tools deep in the settings",
    excerpt: "From the temperature sensor to Advanced Photo Unblur to the satellite calling feature — we dig into Pixel 9 Pro's overlooked toolkit.",
    body: `Google's Pixel 9 Pro is one of the most feature-rich phones ever made. It's also one of the worst marketed. Most owners are using maybe 40% of what the phone can do.\n\nHere are the features worth knowing:\n\n**1. Satellite calling.** Available in areas without cellular coverage, the Pixel 9 Pro can initiate voice calls over satellite. Enable it in Settings → Emergency → Satellite Calling.\n\n**2. Temperature sensor.** The infrared temperature sensor can measure skin temperature (useful for fever detection), food temperature, and ambient room temperature. Open the Thermometer app — which most people have never opened.\n\n**3. Advanced Photo Unblur.** Not just for your photos — you can import any blurry image from anywhere and run Unblur on it. Works surprisingly well on old scanned photos.\n\n**4. Audio Magic Eraser on videos.** Most people know about this for removing background noise from recordings. Fewer know you can selectively target specific sounds — like removing wind noise while preserving ambient crowd sounds.\n\n**5. Call Screen for texts.** The AI can screen spam texts and flag suspicious messages with the same approach as Call Screen for phone calls.\n\n**6. Pocket mode.** Prevents accidental touches when the phone is in your pocket. Buried under Settings → System → Gestures → Pocket Mode.\n\nThe remaining 9 features are equally practical — and equally buried.`,
    category: "Phone Tips",
    authorId: 4,
    publishedAt: new Date("2026-05-14T12:00:00Z").toISOString(),
    readTime: 6,
    imageUrl: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=1200&q=80",
    views: 22100,
    featured: false,
    editorsPick: false,
    tags: ["Pixel", "Google", "Android", "Tips", "Smartphone"],
  },
  {
    id: 10,
    slug: "remote-work-loneliness-epidemic",
    title: "Remote Work's Hidden Cost: The Loneliness No One Talks About",
    subtitle: "Three years after the great return-to-office debate, the mental health data is finally in",
    excerpt: "A comprehensive study of 50,000 remote workers reveals a loneliness crisis that productivity metrics can't capture — and what companies are getting wrong.",
    body: `The productivity debate about remote work is largely settled: when managed well, remote workers are as productive as in-office counterparts, sometimes more so. But a new study reveals the cost that never showed up in the spreadsheets.\n\nA three-year study tracking 50,000 remote workers across 23 countries found that 41% report feeling lonely "often or always" — up from 26% before the pandemic. More troubling: the loneliness isn't correlating with social anxiety or introversion. It's hitting extroverts and natural connectors hardest.\n\n"The office wasn't just a place to work," says organizational psychologist Dr. Aisha Kamara. "It was ambient social infrastructure. You didn't have to schedule connection — it happened by accident."\n\nThe study identified three failure modes companies repeat:\n\n**Confusing communication with connection.** More Slack messages and Zoom calls do not reduce loneliness. They often increase it — the feeling of constant contact with none of the texture of real presence.\n\n**Treating co-location as the solution.** Forced return-to-office mandates show no reduction in reported loneliness in the study data. People who feel lonely in the office feel lonely at home.\n\n**Missing the informal.** The companies with lowest loneliness scores invested heavily in unstructured time: virtual coffee breaks with no agenda, optional social channels, physical offsites with minimal work content.\n\nThe data suggests we need to design remote work for human flourishing, not just productivity. They're not the same thing.`,
    category: "Culture",
    authorId: 5,
    publishedAt: new Date("2026-05-13T09:00:00Z").toISOString(),
    readTime: 9,
    imageUrl: "https://images.unsplash.com/photo-1516387938699-a93567ec168e?w=1200&q=80",
    views: 16900,
    featured: false,
    editorsPick: false,
    tags: ["Remote Work", "Mental Health", "Culture", "Workplace"],
  },
  {
    id: 11,
    slug: "second-brain-notion-obsidian",
    title: "Building a Second Brain in 2026: Notion vs Obsidian vs Everything Else",
    subtitle: "After testing every major PKM tool for six months, here's what actually works",
    excerpt: "The personal knowledge management space has exploded. We put every major tool through real-world use to find out which one actually improves thinking.",
    body: `Everyone has a note-taking app. Almost no one has a working knowledge management system.\n\nThe difference is significant. A note-taking app is where ideas go to die. A knowledge management system is where ideas connect, evolve, and surface at the right moment.\n\nAfter six months of rigorous testing — using each tool as my primary system for a full month — here's what I found:\n\n**Notion** remains the best option for teams and for people who like visual organization. Its database features are unmatched, and the new AI features genuinely help surface relevant content. Weakness: it's optimized for structure, not for thinking. When you need to capture a half-formed idea quickly, Notion's overhead gets in the way.\n\n**Obsidian** is the tool that thinks the most like a brain. The graph view isn't just visual novelty — linking notes and following connections has repeatedly helped me find ideas I'd forgotten I had. Weakness: high setup cost and it rewards obsessive customization in ways that can become procrastination.\n\n**The winner for most people**: a hybrid approach. Obsidian for permanent notes and thinking. A fast capture app (Drafts or Bear) for immediate notes. Calendar for time-sensitive reference. The mistake is expecting one app to do everything.\n\nThe deeper truth: the tool matters less than the habit of review. Notes that are never re-read are just expensive diary entries.`,
    category: "Productivity",
    authorId: 1,
    publishedAt: new Date("2026-05-12T11:00:00Z").toISOString(),
    readTime: 10,
    imageUrl: "https://images.unsplash.com/photo-1517842645767-c639042777db?w=1200&q=80",
    views: 14300,
    featured: false,
    editorsPick: false,
    tags: ["Productivity", "Notion", "Obsidian", "PKM", "Tools"],
  },
  {
    id: 12,
    slug: "urban-farming-tech-revolution",
    title: "The $10 Billion Bet on Growing Food in Cities",
    subtitle: "Vertical farming just had its worst year ever financially. But the technology has never been more promising.",
    excerpt: "After a wave of bankruptcies, vertical farming companies are rebuilding with better economics and a clearer-eyed view of what they can actually achieve.",
    body: `2024 was a disaster for vertical farming. AeroFarms filed for bankruptcy — again. AppHarvest shut down. Bowery Farming closed its doors. Investors wrote off billions.\n\nAnd yet, 2026 might be the year vertical farming finally becomes viable.\n\nThe industry made three fundamental mistakes in its first decade: it tried to compete on commodity crops (lettuce and herbs are low-margin even in soil), it underestimated energy costs, and it over-promised on AI optimization that wasn't ready.\n\nThe survivors — and there are survivors — have pivoted to high-value crops: pharmaceutical herbs, exotic mushrooms, premium microgreens, and specialty produce that commands 10x commodity prices. They've also embraced co-location with data centers, using waste heat that would otherwise be vented to atmosphere.\n\nThe technology itself has improved dramatically. LED efficiency has increased 60% since 2020. Robotic systems can now handle transplanting and harvesting with 99.2% accuracy. And new sensor arrays monitor plant stress at the cellular level, catching disease days before it becomes visible.\n\nThe revised pitch isn't "vertical farming will replace traditional agriculture." It's "vertical farming will supply premium, local produce to cities while reducing food miles by 95%." A more modest claim — and a much more achievable one.`,
    category: "Tech",
    authorId: 2,
    publishedAt: new Date("2026-05-11T13:00:00Z").toISOString(),
    readTime: 8,
    imageUrl: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=1200&q=80",
    views: 11800,
    featured: false,
    editorsPick: false,
    tags: ["Technology", "Food", "Agriculture", "Sustainability"],
  },
  {
    id: 13,
    slug: "sleep-optimization-wearables",
    title: "I Tracked My Sleep for a Year. The Results Were Uncomfortable.",
    subtitle: "Eight sleep trackers, one year, and some hard truths about what actually improves sleep",
    excerpt: "Using Oura, Whoop, Apple Watch, and five other devices simultaneously, I discovered that most sleep advice is backwards — and that the tracking itself might be making things worse.",
    body: `I am the kind of person who will wear eight sleep trackers simultaneously to figure out which one is most accurate. This is not something I'm proud of.\n\nFor twelve months, I tracked every metric available: sleep stages, HRV, respiratory rate, blood oxygen, skin temperature, and dozens of derived scores. I correlated everything with subjective feel, cognitive performance tests, and physical performance.\n\nThe findings that surprised me most:\n\n**Consistency matters more than duration.** Going to bed at the same time every night — even if that time is late — improved my cognitive performance scores more than adding an hour of sleep at irregular times.\n\n**HRV is the most useful metric, but only in trends.** A single night's HRV reading means almost nothing. A three-week downward trend is a reliable early warning of overtraining, illness, or excessive stress.\n\n**Alcohol's impact is catastrophically underestimated.** Two drinks reduced my deep sleep by 40-60% consistently. The effect lasted until the second subsequent night of abstinence.\n\n**The tracking itself caused anxiety that hurt sleep.** I coined a term for this: orthosomnia — anxiety about sleep data causing poor sleep. Checking scores every morning became a source of stress. I had to institute a rule: only look at trends, never individual nights.\n\nThe best sleep intervention I found: lowering room temperature to 65°F (18°C) and using blackout curtains. Old advice. Still the best advice.`,
    category: "Lifestyle",
    authorId: 3,
    publishedAt: new Date("2026-05-10T06:00:00Z").toISOString(),
    readTime: 12,
    imageUrl: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=1200&q=80",
    views: 20400,
    featured: false,
    editorsPick: false,
    tags: ["Sleep", "Health", "Wearables", "Wellness"],
  },
  {
    id: 14,
    slug: "electric-vehicles-charging-anxiety",
    title: "EV Range Anxiety Is Dead. Charging Anxiety Is Very Much Alive.",
    subtitle: "With 400+ mile ranges now common, the problem isn't how far EVs go — it's what happens when you need to stop",
    excerpt: "We drove the five best-selling electric vehicles on the same 800-mile road trip. The differences in charging experience were shocking.",
    body: `The EV industry spent a decade solving the wrong problem.\n\nRange anxiety — the fear of running out of charge — is largely conquered. The average American drives 37 miles per day. Every mainstream EV on sale today can handle that on a single charge with range to spare. Even long highway trips are theoretically manageable.\n\nBut charging anxiety — the fear of finding a broken, slow, or incompatible charger when you need one — is very real, very frustrating, and very under-discussed.\n\nWe drove five vehicles across an 800-mile route: Tesla Model 3, Rivian R2, BMW iX, Hyundai Ioniq 9, and the new Volkswagen ID.7. Same route, same conditions, one driver each.\n\nTesla's Supercharger network remains in a different class. Every charger worked. Speeds were as advertised. In-car navigation seamlessly integrated charging stops.\n\nThe others ranged from acceptable to genuinely stressful. The Ioniq 9 encountered two non-functional chargers. The BMW's navigation routed us to a charger that had been removed three months earlier. The Rivian's charging software crashed mid-session.\n\nThe hardware has outpaced the infrastructure. Until charging is as reliable as gas stations — and that likely requires either Tesla opening its network fully or massive government investment — range anxiety's replacement is doing real damage to EV adoption.`,
    category: "Tech",
    authorId: 4,
    publishedAt: new Date("2026-05-09T10:00:00Z").toISOString(),
    readTime: 9,
    imageUrl: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=1200&q=80",
    views: 17600,
    featured: false,
    editorsPick: false,
    tags: ["Electric Vehicles", "Tesla", "Technology", "Transportation"],
  },
  {
    id: 15,
    slug: "ai-music-generation-artists",
    title: "AI Music Is Getting Good. Musicians Are Getting Complicated About It.",
    subtitle: "From Suno to Udio to custom models, AI-generated music is reaching professional quality. The industry's response is fractured.",
    excerpt: "We spoke with 40 musicians across genres — from bedroom producers to Grammy winners — about how AI music tools are changing their work and their identity.",
    body: `There's a Spotify playlist with 2 million followers. Every track on it sounds like a polished indie pop release — complete hooks, layered production, emotional vocal performances. Every track was generated by AI. The playlist's creator has never played an instrument.\n\nThis is the future that's arrived, and the music industry doesn't know what to do with it.\n\nThe musicians we spoke to fell into three clear camps:\n\n**The embracers** (roughly 30%) are using AI as a tool like any other. Bedroom producers describe it as "finally having a full band." Film composers use it to generate thematic variations they then arrange. Singer-songwriters use it to demo arrangements before investing studio time.\n\n**The resisters** (about 45%) see AI music as categorically different from other tools. "A photograph didn't replace painting because photographs can't feel anything," said one Grammy-winning songwriter. "AI music can't feel anything either, but unlike photography, it's imitating a medium of human emotion."\n\n**The ambivalent majority** (25%) are the most interesting. They use the tools privately, feel complicated about it, and haven't worked out their position. Several asked not to be named.\n\nThe economic reality is stark: a professional-quality jingle that cost $5,000 to produce in 2022 can be generated in 2026 for $40. The musicians who produced those jingles are already finding other work.\n\nThe deeper question — whether AI-generated music can be meaningful, not just technically proficient — remains genuinely open.`,
    category: "Culture",
    authorId: 5,
    publishedAt: new Date("2026-05-08T14:00:00Z").toISOString(),
    readTime: 11,
    imageUrl: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=1200&q=80",
    views: 13200,
    featured: false,
    editorsPick: false,
    tags: ["AI", "Music", "Culture", "Technology"],
  },
  {
    id: 16,
    slug: "keyboard-shortcuts-productivity-guide",
    title: "The 50 Keyboard Shortcuts That Will Save You 2 Hours Every Week",
    subtitle: "Tested across Mac, Windows, and every major browser — these are the ones that actually stick",
    excerpt: "Most keyboard shortcut guides list 200 shortcuts you'll forget by Tuesday. This one focuses on the 50 with the highest return on learning investment.",
    body: `I timed myself for a week, tracking every instance of reaching for the mouse when a keyboard shortcut existed. The number was embarrassing: 340 unnecessary mouse movements per day. At an average of 3 seconds each, that's 17 minutes daily — nearly 2 hours per week.\n\nHere are the shortcuts with the highest payoff:\n\n**Universal (works everywhere)**\n- Cmd/Ctrl + Shift + Z: Redo (most people only know undo)\n- Cmd/Ctrl + Shift + T: Reopen closed tab\n- Cmd/Ctrl + L: Jump to address bar\n- F2: Rename selected file\n\n**Browser**\n- Cmd/Ctrl + 1-9: Jump to tab by position\n- Spacebar / Shift + Spacebar: Page down / page up\n- Cmd/Ctrl + Shift + J: Downloads\n- / : Search on most websites\n\n**Mac specific**\n- Cmd + Space: Spotlight (if you're not using this for everything, start now)\n- Cmd + Tab, then Q while holding Cmd: Switch apps and quit one you don't need\n- Cmd + Shift + 4, then Space: Screenshot a specific window\n\n**Windows specific**\n- Win + V: Clipboard history (paste anything from the last 24 hours)\n- Win + .: Emoji picker\n- Alt + Tab: Switch apps; Alt + Tab + Shift: Switch backwards\n\nThe learning strategy that works: pick three shortcuts per week. Use them exclusively for that week, even if it's slower. By week two, they're automatic.`,
    category: "Productivity",
    authorId: 1,
    publishedAt: new Date("2026-05-07T09:00:00Z").toISOString(),
    readTime: 7,
    imageUrl: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=1200&q=80",
    views: 25800,
    featured: false,
    editorsPick: false,
    tags: ["Productivity", "Tips", "Keyboard", "Efficiency"],
  },
  {
    id: 17,
    slug: "microplastics-everywhere-what-now",
    title: "Microplastics Are Everywhere. Here's What the Science Actually Says.",
    subtitle: "They're in our blood, brains, and lungs. But the health implications are still being established.",
    excerpt: "New research confirms microplastic contamination is universal. The harder question — how much does it matter — remains scientifically contested.",
    body: `The science is unambiguous: microplastics are everywhere. They've been found in human blood, lung tissue, brain tissue, placentas, and breast milk. They rain down from the sky in remote mountain regions. They're in the deepest ocean trenches and the highest peaks.\n\nThe question the research hasn't answered yet: what does this mean for human health?\n\nA new meta-analysis of 47 studies finds mixed evidence. Some studies link microplastic exposure to inflammation markers. Others find associations with endocrine disruption. A few suggest potential links to cardiovascular disease.\n\nBut the honest scientific assessment is: we don't yet have the longitudinal data to establish clear causation. Humans have been accumulating microplastics for roughly 70 years. The health effects, if significant, may take generations to fully manifest.\n\nWhat can you practically do with this information?\n\nDon't microwave food in plastic containers — heat accelerates leaching. Filter your tap water — a basic carbon filter removes most microplastics. Avoid bottled water, which contains significantly more microplastics than filtered tap water. Vacuum frequently — indoor air carries significant microplastic load from synthetic fabrics and furnishings.\n\nThe researchers we spoke to were unified on one point: even before the health evidence is fully established, dramatically reducing plastic production is warranted. The precautionary principle exists for situations exactly like this.`,
    category: "Lifestyle",
    authorId: 2,
    publishedAt: new Date("2026-05-06T11:00:00Z").toISOString(),
    readTime: 8,
    imageUrl: "https://images.unsplash.com/photo-1604187351574-c75ca79f5807?w=1200&q=80",
    views: 21300,
    featured: false,
    editorsPick: false,
    tags: ["Health", "Environment", "Science", "Lifestyle"],
  },
  {
    id: 18,
    slug: "iphone-17-pro-max-everything-we-know",
    title: "iPhone 17 Pro Max: Everything We Know (And Some Things We've Confirmed)",
    subtitle: "Supply chain sources, leaked schematics, and one confirmed Apple briefing reveal what's coming in September",
    excerpt: "The most significant iPhone redesign in five years is coming. Here's the full picture from our sources and the public record.",
    body: `Apple's September event is still three months away, but the picture of iPhone 17 Pro Max is already coming into focus — through supply chain leaks, manufacturing partner disclosures, and one off-the-record Apple briefing that we can now partially report.\n\n**What's confirmed:**\nThe ProMotion display is expanding to all iPhone 17 models, not just Pro. This is a significant democratization of the technology.\n\n**What's credibly reported:**\nThe camera module redesign is real and dramatic. A rectangular aluminum module running nearly the full width of the phone houses a new periscope telephoto lens system that Apple is calling "Deep Zoom" internally. The arrangement allows for a longer periscope path, enabling true 10x optical zoom — matching Samsung's offering for the first time.\n\nThe A19 Pro chip will be the first Apple silicon manufactured on TSMC's 2nm process. Early performance estimates suggest 30-40% gains in the neural engine, directly benefiting the on-device AI features Apple will announce alongside the hardware.\n\n**The satellite story:**\nApple is significantly expanding satellite features. Beyond emergency SOS, iPhone 17 Pro Max is expected to support full satellite data connectivity — not just messages — allowing basic internet access in areas with no cellular coverage.\n\n**What we don't know yet:**\nPricing remains genuinely unclear. The camera module upgrade and satellite expansion suggest significant cost pressures. A starting price above $1,299 is increasingly plausible.`,
    category: "Phone Tips",
    authorId: 3,
    publishedAt: new Date("2026-05-05T08:00:00Z").toISOString(),
    readTime: 9,
    imageUrl: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=1200&q=80",
    views: 33700,
    featured: false,
    editorsPick: false,
    tags: ["Apple", "iPhone", "Rumors", "Smartphone"],
  },
  {
    id: 19,
    slug: "blockchain-actually-useful-now",
    title: "Blockchain Is Finally Doing Something Actually Useful",
    subtitle: "Forget the speculation — these are the real applications that are working right now",
    excerpt: "After years of hype and disappointment, blockchain technology has quietly found genuine niches. They're just not the ones anyone predicted.",
    body: `The crypto winter killed the hype. What survived is genuinely interesting.\n\nStripped of speculative fever, blockchain technology has settled into a handful of real applications — none of which were the primary pitch during the 2021 boom.\n\n**Supply chain verification.** Walmart, Maersk, and De Beers are using blockchain to create immutable records of product provenance. A diamond's journey from mine to ring can now be verified on-chain, making conflict diamond fraud significantly harder. Walmart's food safety blockchain can trace contaminated produce to its source in 2.2 seconds — a process that previously took 7 days.\n\n**Cross-border payments.** Traditional wire transfers take 3-5 business days and cost 6-8% in fees. Blockchain-based settlement networks have reduced this to minutes at fractions of a percent for corridors between specific countries. Remittances to the Philippines and Mexico have seen the most dramatic improvement.\n\n**Digital credentials.** MIT, Stanford, and a growing list of universities now issue cryptographically signed diplomas that can be verified instantly without contacting the institution. The European Union's digital identity initiative uses the same technology.\n\n**What didn't work:** NFTs as collectibles, DeFi as a banking replacement, and DAOs as governance mechanisms have all failed to demonstrate lasting value. The applications that work are narrow, institutional, and decidedly unsexy — which is, historically, how important technology transitions tend to go.`,
    category: "Tech",
    authorId: 4,
    publishedAt: new Date("2026-05-04T13:00:00Z").toISOString(),
    readTime: 8,
    imageUrl: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1200&q=80",
    views: 15400,
    featured: false,
    editorsPick: false,
    tags: ["Blockchain", "Technology", "Crypto", "Innovation"],
  },
  {
    id: 20,
    slug: "ai-therapy-mental-health-crisis",
    title: "AI Therapy Is Treating Millions. Experts Are Divided.",
    subtitle: "With therapist shortages reaching crisis levels, AI mental health tools are filling the gap. But at what cost?",
    excerpt: "Apps like Woebot and new entrants powered by GPT-5 are seeing explosive adoption. The clinical research is more nuanced than the marketing.",
    body: `There are approximately 30 therapists for every 100,000 people in the United States. In rural areas, that ratio falls to 10. Waiting lists at community mental health centers average 4-6 months. The gap between people who need mental health support and those who can access it is enormous and growing.\n\nInto that gap, AI has moved quickly.\n\nWoebot, Wysa, and a newer generation of GPT-5-powered apps collectively serve tens of millions of users. Some platforms report user engagement metrics that would make a social media company envious: average session length over 20 minutes, 60% weekly retention.\n\nThe clinical evidence is genuinely mixed. A 2025 meta-analysis found that AI-assisted CBT apps reduced mild-to-moderate depression scores by amounts comparable to self-guided workbooks. A separate study found significant benefits for anxiety management among college students — a demographic with particularly poor access to traditional care.\n\nBut the failure modes are serious. AI therapy apps consistently underperform on suicide risk detection. They sometimes reinforce rumination rather than breaking it. And the better they get at simulating empathy, the more users may mistake the simulation for the real thing.\n\n"The risk isn't that AI therapy is useless," says Dr. James Watkins, a clinical psychologist at Columbia. "The risk is that it's useful enough to reduce demand for the systemic changes that would actually fix the access problem. We medicate the symptom instead of treating the disease."`,
    category: "AI Tools",
    authorId: 5,
    publishedAt: new Date("2026-05-03T10:00:00Z").toISOString(),
    readTime: 10,
    imageUrl: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=1200&q=80",
    views: 19800,
    featured: false,
    editorsPick: false,
    tags: ["AI", "Mental Health", "Technology", "Healthcare"],
  },
  {
    id: 21,
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
    publishedAt: new Date("2026-05-24T10:00:00Z").toISOString(),
    readTime: 9,
    imageUrl: "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=1200&q=80",
    views: 0,
    featured: false,
    editorsPick: true,
    tags: ["Google", "Google I/O", "Gemini AI", "AI Search", "Tech News"],
  },
  {
    id: 22,
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
    publishedAt: new Date("2026-05-24T11:30:00Z").toISOString(),
    readTime: 10,
    imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&q=80",
    views: 0,
    featured: false,
    editorsPick: true,
    tags: ["AI Infrastructure", "Data Centers", "Cloud Computing", "Tech Industry", "Google", "Energy", "Future of Tech"],
  },
];

export function withCors(response) {
  const headers = new Headers(response.headers);
  headers.set("Access-Control-Allow-Origin", "*");
  headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type");
  headers.set("Content-Type", "application/json");
  return new Response(response.body, { status: response.status, headers });
}

export function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

export function getAuthor(authorId) {
  return authors.find((a) => a.id === authorId) ?? { name: "Staff Writer", avatarUrl: "" };
}

export function formatArticle(article) {
  return {
    ...article,
    author: getAuthor(article.authorId),
  };
}
