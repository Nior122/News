export interface FaqItem {
  question: string;
  answer: string;
}

export const ARTICLE_FAQS: Record<string, FaqItem[]> = {
  "how-to-build-personal-brand-online-2026": [
    {
      question: "What is a personal brand?",
      answer: "A personal brand is the reputation you build for a specific skill, perspective or kind of help. It is what people expect from you and remember about you, shaped by your content, your communication style and the value you consistently deliver.",
    },
    {
      question: "How do I build a personal brand from scratch?",
      answer: "Choose a narrow niche, write a one-sentence brand statement, pick one platform, publish content around three pillars on a steady schedule, and start an email list. The 90-day plan above breaks this into weekly actions.",
    },
    {
      question: "How long does it take to build a personal brand?",
      answer: "It varies widely. You can set up the foundations in a few weeks, but audience growth depends on your niche, consistency and timing. Many creators describe slow early months, so judge early progress by habits and feedback.",
    },
    {
      question: "What is a personal brand statement?",
      answer: "It is one or two sentences saying who you help, what outcome you deliver and how. Template: \"I help [audience] [outcome] by [method], so they can [benefit].\" Keep it under 25 words and use it in your bios.",
    },
    {
      question: "Which platform should I pick?",
      answer: "Pick the one where your audience already looks for help and where you can sustain the format. Professional services often suit LinkedIn or a newsletter, visual niches suit Instagram, and tutorials suit YouTube. Start with one.",
    },
    {
      question: "Can I build a personal brand without showing my face?",
      answer: "Yes. You can use writing, voiceover, screen recordings, carousels, illustrations or a pen name. What matters is a consistent voice and useful content. If constant filming feels draining, our look at camera culture in 2026 offers context.",
    },
    {
      question: "How do I make money from a personal brand?",
      answer: "Most creators earn through services, digital products, affiliate links, sponsorships or memberships, usually after building trust. Income is uneven and not guaranteed, and payout methods vary by country.",
    },
  ],
  "chatgpt-claude-gemini-comparison-2026": [
    {
      question: "Which AI is best for everyday use in 2026?",
      answer: "ChatGPT remains the most versatile for everyday tasks — writing, answering questions, brainstorming, and coding. It has the widest app integrations and the most polished user experience for beginners.",
    },
    {
      question: "Is Claude better than ChatGPT for long documents?",
      answer: "Yes. Claude consistently outperforms ChatGPT on long-context tasks like summarizing full PDFs, reviewing lengthy contracts, or drafting detailed research. Its 200k-token context window is industry-leading.",
    },
    {
      question: "Can I use Gemini for free?",
      answer: "Yes, Google Gemini has a free tier with access to the Gemini 1.5 Flash model. The more powerful Gemini Advanced (1.5 Pro) requires a Google One AI Premium subscription.",
    },
    {
      question: "Do I need to pick just one AI tool?",
      answer: "No — most power users mix and match. A common setup is ChatGPT for daily tasks, Claude for deep writing or research, and Gemini for anything tied to the Google ecosystem (Docs, Gmail, Drive).",
    },
  ],

  "ai-tools-saving-hours-every-week-2026": [
    {
      question: "How much time can AI tools realistically save per week?",
      answer: "Studies and user surveys in 2026 suggest knowledge workers save between 3–10 hours per week when using AI tools consistently. The biggest gains come from email drafting, summarization, and research.",
    },
    {
      question: "Which AI tools are best for saving time at work?",
      answer: "The top time-savers are ChatGPT or Claude for writing and research, Notion AI for notes and docs, Otter.ai for meeting transcription, and tools like Zapier AI for automating repetitive workflows.",
    },
    {
      question: "Are AI productivity tools safe for work data?",
      answer: "It depends on the tool and your settings. Most enterprise plans (ChatGPT Team, Claude for Work) offer data privacy controls that prevent your inputs from being used for training. Always check your company's AI policy first.",
    },
  ],

  "ai-prompt-formula-better-answers-2026": [
    {
      question: "What makes a good AI prompt?",
      answer: "A good prompt has four elements: a clear role (who the AI should act as), a specific task, relevant context or constraints, and the desired output format. The more precise you are, the better the result.",
    },
    {
      question: "Why do I get vague answers from ChatGPT?",
      answer: "Vague prompts produce vague answers. If you ask 'tell me about marketing,' you'll get a generic response. Instead, try: 'Act as a marketing strategist. Write 5 Twitter ad hooks for a $20/month budget app targeting freelancers.'",
    },
    {
      question: "Should I use the same prompt formula for all AI tools?",
      answer: "The core principles apply everywhere, but each model has strengths. Claude responds well to detailed instructions and examples. ChatGPT is great with structured formats. Gemini benefits from explicit step-by-step requests.",
    },
    {
      question: "What is prompt chaining?",
      answer: "Prompt chaining is breaking a complex task into smaller sequential prompts, using the output of one as the input for the next. It's more reliable than asking an AI to do everything in one go.",
    },
  ],

  "todo-list-broken-better-system-2026": [
    {
      question: "Why does my to-do list stop working after a few days?",
      answer: "Most to-do lists fail because they mix projects, tasks, and reminders into one flat list. Without priority, context, or deadlines, the list grows until it becomes overwhelming and gets abandoned.",
    },
    {
      question: "What's a better alternative to a traditional to-do list?",
      answer: "Systems like GTD (Getting Things Done), time-blocking, or the 1-3-5 method work better for most people. The key is separating capture (writing things down) from planning (deciding when and how to do them).",
    },
    {
      question: "Can AI help manage tasks better?",
      answer: "Yes — AI tools like Notion AI, Motion, and Reclaim can automatically prioritize tasks, block time in your calendar, and reschedule when plans change. They're especially useful for people with variable workloads.",
    },
  ],

  "four-day-work-week-results-2026": [
    {
      question: "Does a 4-day work week actually improve productivity?",
      answer: "Yes, according to multiple large-scale trials in 2025–2026. The majority of companies that piloted a 4-day week reported stable or improved productivity, alongside significant reductions in employee burnout and turnover.",
    },
    {
      question: "Which industries have adopted the 4-day work week?",
      answer: "Tech, marketing, finance, and professional services lead adoption. Manufacturing and healthcare have seen more limited trials due to operational constraints, though some shifts have been redesigned to accommodate it.",
    },
    {
      question: "Will my employer switch to a 4-day week?",
      answer: "Adoption is growing but uneven. If you're interested, the strongest case to make is framing it around output and measurable goals rather than hours — most successful implementations shift the focus from time to results.",
    },
  ],

  "iphone-settings-change-now-2026": [
    {
      question: "Will changing these settings void my iPhone warranty?",
      answer: "No. All the settings covered are standard iOS options accessible in the Settings app. None of them involve jailbreaking or modifying system files, so your warranty and AppleCare coverage are unaffected.",
    },
    {
      question: "Will turning off Background App Refresh affect notifications?",
      answer: "It can slightly delay notifications for apps that rely on background data fetching. Push notifications (like iMessages or calendar alerts) are not affected — only apps that pull new data in the background.",
    },
    {
      question: "How much battery life can I realistically save?",
      answer: "Depending on your usage patterns, optimizing battery settings can extend screen-on time by 15–30%. The biggest wins typically come from reducing screen brightness, disabling Always-On Display, and limiting location services.",
    },
  ],

  "android-battery-life-tips-2026": [
    {
      question: "What drains Android battery the fastest?",
      answer: "Screen brightness is the biggest drain, followed by GPS/location services, background app activity, push email syncing, and Bluetooth/Wi-Fi scanning. 5G connectivity also uses significantly more power than 4G LTE.",
    },
    {
      question: "Does dark mode actually save battery on Android?",
      answer: "Yes — but only on OLED/AMOLED screens, which are standard on most mid-to-high-end Android phones. Dark mode can reduce battery draw from the display by up to 40% on those screens.",
    },
    {
      question: "How often should I charge my Android phone?",
      answer: "Lithium batteries last longest when kept between 20–80% charge. Avoiding full 0–100% cycles and overnight charging (unless your phone has smart charging features) helps preserve long-term battery health.",
    },
  ],

  "second-brain-apps-2026": [
    {
      question: "What is a 'second brain' app?",
      answer: "A second brain app is a personal knowledge management system where you capture, organize, and retrieve information — notes, articles, ideas, research — so you can build on it over time rather than losing it.",
    },
    {
      question: "What's the difference between Notion and Obsidian?",
      answer: "Notion is a flexible all-in-one workspace great for teams and structured databases. Obsidian is a local-first, markdown-based tool better for personal knowledge graphs and linking ideas. Your choice depends on whether you value collaboration or deep linking.",
    },
    {
      question: "Do I need AI features in a second brain app?",
      answer: "Not necessarily, but they're becoming genuinely useful. AI features in apps like Notion AI or Mem can surface forgotten notes, auto-tag content, and answer questions based on your own knowledge base — saving significant search time.",
    },
    {
      question: "What's the best way to start building a second brain?",
      answer: "Start simple: pick one app, use one inbox (a single place to dump everything), and spend 10 minutes a week organizing what you captured. Don't build an elaborate system before you have the habit — complexity kills consistency.",
    },
  ],

  "make-money-online-ai-freelancer-2026": [
    {
      question: "Can I make a full-time income freelancing with AI tools?",
      answer: "Yes — many freelancers in 2026 are earning full-time incomes by offering services like AI-assisted copywriting, prompt engineering, content strategy, automation consulting, and AI image generation for clients.",
    },
    {
      question: "Do clients know when AI is used in freelance work?",
      answer: "Disclosure norms vary by field. Many clients don't require disclosure; they care about the result. However, in journalism, academic writing, and certain legal contexts, using AI without disclosure can be a serious issue.",
    },
    {
      question: "What skills do I need to freelance with AI?",
      answer: "Strong prompt engineering, editing and quality control (AI output still needs human refinement), client communication, and expertise in your niche. AI handles speed; your judgment and domain knowledge is what clients are really paying for.",
    },
  ],

  "what-is-vibe-coding-2026": [
    {
      question: "Do you need coding experience to vibe code?",
      answer: "No — beginners build working personal tools and prototypes all the time without knowing syntax. Basic familiarity with how web pages, databases and environment variables work becomes helpful as soon as you want to publish an app for other people.",
    },
    {
      question: "Is vibe coding free?",
      answer: "You can start for free on most platforms, including Google AI Studio, GitHub Copilot's free tier, Replit, Bolt and Lovable's daily credit plans. Heavy building or deploying custom domains usually pushes you onto a $10 to $25 monthly plan.",
    },
    {
      question: "What programming languages work best for vibe coding?",
      answer: "JavaScript, TypeScript, HTML/CSS and Python work best because AI models have seen enormous amounts of public training code and mature frameworks in those languages. Most browser app builders default to React, TypeScript and Tailwind CSS automatically.",
    },
    {
      question: "Can you build a real business with vibe coding?",
      answer: "You can validate demand and build an early minimum viable product quickly, and many solo founders do. Before charging customers or storing sensitive data, plan on proper security review, automated tests and clean version control rather than pure prompt-and-pray edits.",
    },
    {
      question: "Is vibe coding safe?",
      answer: "For local scripts, mockups and personal utilities, yes. For public apps handling logins, payments or user data, raw AI-generated code often misses permissions and input validation, so human security checks remain essential.",
    },
    {
      question: "Will vibe coding replace software developers?",
      answer: "It changes what developers spend time on rather than removing the need for engineering judgment. Writing routine boilerplate gets much faster, while architecture, security, debugging complex systems and product decisions matter more.",
    },
  ],

  "best-budget-wireless-earbuds-2026": [
    {
      question: "Are budget wireless earbuds under $100 worth buying in 2026?",
      answer: "Yes. Well-reviewed pairs between $50 and $100 now deliver effective commuter ANC, multipoint pairing, solid app EQ, and reliable battery life. Flagship $250+ buds still lead on wind-noise call handling, spatial audio ecosystems, and top-end acoustic refinement, though most everyday listeners no longer need to spend that much.",
    },
    {
      question: "What is the difference between ANC and ENC on budget earbuds?",
      answer: "Active noise cancellation (ANC) reduces outside rumble in your own ears while listening to music or podcasts. Environmental noise cancellation (ENC) uses microphone filtering so the person on the other end of a phone call hears less background clatter—it does not quiet your surroundings.",
    },
    {
      question: "Which budget earbuds work best with iPhone vs. Android?",
      answer: "iPhones use the AAC Bluetooth codec across third-party earbuds, so prioritize comfort, app quality, multipoint stability, and ANC—where Soundcore Liberty 4 NC and CMF Buds 2 Plus perform well. Android phones with LDAC or aptX Lossless support can also take fuller advantage of models like EarFun Air Pro 4+.",
    },
    {
      question: "Should you buy in-ear ANC earbuds or open-ear clip earbuds?",
      answer: "Choose sealed in-ear ANC earbuds for noisy commutes, flights, gyms, and stronger sub-bass. Choose open-ear clips like the CMF Clip Pro when ear-canal comfort and hearing traffic, coworkers, or home activity clearly matter more than blocking noise.",
    },
    {
      question: "Why is real-world earbud battery life shorter than advertised?",
      answer: "Manufacturers usually publish headline figures at roughly 50% volume using standard SBC or AAC audio with active noise cancellation turned off. Enabling ANC, raising volume in loud environments, taking phone calls, or switching on high-bitrate codecs like LDAC draws noticeably more power.",
    },
    {
      question: "Do sub-$40 earbuds have real active noise cancellation?",
      answer: "Reputable entry-level models such as the JLab Go Pods ANC and CMF Buds 2a include genuine hybrid ANC that takes the edge off fan hum and light transit rumble, though deeper low-end isolation still steps up noticeably around the $55 to $100 tier.",
    },
  ],

  "ai-tools-for-students-2026": [
    {
      question: "Is using AI to study cheating?",
      answer: "Not automatically. Using AI to clarify a concept, generate practice questions or organise revision may be permitted, but the rules depend on your school, instructor and assignment. Submitting AI-generated work as your own can violate academic integrity requirements. Check your course policy and disclose assistance when required.",
    },
    {
      question: "What is the best free AI tool for students?",
      answer: "There is no single best option for every student. ChatGPT or Claude can help explain concepts, Perplexity can support source discovery, NotebookLM can work with supplied readings and Grammarly can check basic writing. Start with the tool that addresses your main study problem and confirm its current free-plan limits.",
    },
    {
      question: "Which AI tool is best for note-taking?",
      answer: "NotebookLM is useful for asking questions about a collection of supplied readings, while Notion can organise notes alongside tasks and deadlines. Neither replaces checking your original sources. Choose based on whether your priority is understanding documents or managing a long-term study workspace.",
    },
    {
      question: "Can AI make flashcards?",
      answer: "Yes. General-purpose assistants can draft question-and-answer cards from notes, and Quizlet provides dedicated flashcard and learning features. Check every card for accuracy, especially formulas, dates and definitions. Good cards test one clear idea and require you to retrieve the answer rather than simply recognise it.",
    },
    {
      question: "Do I need to pay for AI study tools?",
      answer: "Usually not when you are starting. Free plans can cover basic explanations, research discovery, writing feedback and some revision tasks. Pay only when you repeatedly hit a meaningful limit or need a specific paid feature. Check the current price and cancellation terms before subscribing.",
    },
    {
      question: "Can AI help if English is my second language?",
      answer: "Yes. You can ask an assistant to explain vocabulary, compare sentence structures, practise conversations or give feedback on a paragraph you wrote. Ask it to explain the reason for each correction so you learn the underlying rule. Check that suggested edits preserve your intended meaning and follow your course's AI policy.",
    },
  ],

  "subscription-fatigue-tech-2026": [
    {
      question: "How much does the average person spend on subscriptions?",
      answer: "Research in 2026 puts the average at $300–$400/month across streaming, software, fitness, and news subscriptions — often higher than people estimate, since small charges go unnoticed.",
    },
    {
      question: "What's the easiest way to find and cancel unused subscriptions?",
      answer: "Apps like Rocket Money, Trim, or your bank's subscription tracker can automatically surface recurring charges. Review your credit card statements going back 3 months — most people find at least 2–3 forgotten subscriptions.",
    },
    {
      question: "Is subscription fatigue affecting tech companies?",
      answer: "Yes — churn rates are rising across streaming and software platforms. Companies are responding with bundles, annual discount offers, and pause options to retain customers who are cutting back.",
    },
  ],

  "e-ink-gadgets-comeback-2026": [
    {
      question: "Is an e ink tablet better for your eyes?",
      answer: "It may be easier than an LCD tablet for long reading. A small 2013 study found more visual fatigue on an LCD tablet than on e ink or paper. The American Academy of Ophthalmology says screen eye strain is temporary and linked to blinking less. Take breaks on any screen, and see an eye doctor if symptoms persist.",
    },
    {
      question: "What is the best e ink tablet in 2026?",
      answer: "It depends on the job. For handwriting, reviewers favor the reMarkable Paper Pure ($399). For PDFs and Android apps, the Boox Go 10.3 (Gen II) Lumi ($449.99) is a strong pick. For color, consider the Boox Note Air5 C ($529.99) or reMarkable Paper Pro ($629). For books alone, a Kindle Paperwhite costs less.",
    },
    {
      question: "Are e ink tablets worth it?",
      answer: "They are worth it if you handwrite notes or read long documents most days and value focus and battery life. They are poor value if you expect an iPad replacement, because refresh is slow and many models have no app store. Many readers who only read books are better served by a cheaper Kindle or Kobo.",
    },
    {
      question: "Can you use an e ink tablet for work?",
      answer: "Yes, for reading and marking up documents, handwriting meeting notes and planning. Some models connect to calendars, Google Drive or OneDrive. They are not laptop replacements: refresh is slow, multitasking is limited and typing is awkward. A focused second device alongside a laptop is the realistic setup.",
    },
    {
      question: "Is color e ink good yet?",
      answer: "It is useful, not vivid. Color e ink suits highlights, charts, comics and annotated PDFs, but colors look muted and refresh is slow. Kaleido 3 panels show 4,096 colors at 150 ppi. E Ink announced Kaleido 4 in October 2026, but Amazon and Kobo have not announced devices yet.",
    },
    {
      question: "E ink tablet vs Kindle: which should you buy?",
      answer: "A standard Kindle is for books and costs $149.99 or more. An e ink tablet adds a larger screen and a stylus for handwriting and PDF markup. Amazon's Kindle Scribe sits between them, with an 11-inch display, pen and Kindle store from $429.99. Choose by whether you write as much as you read.",
    },
  ],

  "silent-internet-content-2026": [
    {
      question: "What is silent internet content?",
      answer: "Silent internet content is any digital content that deliberately removes voiceovers, music, text overlays, and fast cuts — leaving only the image or ambient sound. It includes ambient YouTube videos, TikTok silent edits, ASMR-adjacent content, slow vlogs, and long-form newsletters written in unhurried prose without skimmable headers.",
    },
    {
      question: "Where can I find silent internet content?",
      answer: "YouTube is the best starting point — search for 'ambient,' 'no commentary,' 'silent vlog,' 'study with me,' or 'cosy [activity].' On TikTok, search 'silent edit' or 'aesthetic edit.' Substack has a growing library of essay-format newsletters. YouTube playlists around lo-fi and ASMR content also index the genre well.",
    },
    {
      question: "Is ASMR the same as silent internet content?",
      answer: "ASMR was the first mainstream version of the idea, but silent internet content is broader. ASMR focuses specifically on sounds that produce a tingling relaxation response. Silent internet content includes visual-only content, ambient spaces with no intentional ASMR sounds, slow-living vlogs, and text formats — the underlying principle is reduced stimulation, not a specific audio effect.",
    },
    {
      question: "Why does calm content feel better than regular social media?",
      answer: "High-stimulation content engages your brain's threat detection systems repeatedly — which is fatiguing over long sessions. Low-stimulation content activates the default mode network, the brain state associated with mind-wandering and passive processing. Neurologically, it's similar to the rest you get from a long walk or shower. It feels better because it genuinely is rest.",
    },
  ],

  "dumb-tech-trend-2026": [
    {
      question: "What is the best minimal or dumb phone to buy in 2026?",
      answer: "The Light Phone III is the most popular choice — it makes calls, sends texts, and has basic navigation with an e-ink display. No social media, no browser. The Mudita Pure is another option with a focus on sleep-friendly design. The Punkt MP02 offers a minimal phone with end-to-end encrypted calls for privacy-focused users.",
    },
    {
      question: "Do I have to give up my smartphone entirely to try dumb tech?",
      answer: "No — most dumb tech adopters still have smartphones. The idea is selective subtraction: replacing specific behaviours (sleeping next to your phone, reaching for it mindlessly in the morning) with single-purpose objects like alarm clocks or notebooks. You don't need to commit to a second phone to experiment with the principles.",
    },
    {
      question: "Is buying dumb tech expensive?",
      answer: "It depends what you're buying. A physical alarm clock costs $10–$30. A paper notebook costs $5. A basic analogue watch can be had for $30–$80. Film cameras range from $50 (secondhand point-and-shoot) to several hundred for new models. The Light Phone III costs $399. Most dumb tech entry points are inexpensive — the expensive options are dedicated minimal phones.",
    },
    {
      question: "What is the easiest way to use my phone less without buying new gadgets?",
      answer: "The single most effective low-effort change: charge your phone in a different room overnight. It removes the justification for sleeping next to it and changes your morning routine immediately. Beyond that, both Android's Digital Wellbeing and iPhone's Screen Time have built-in app timers, focus modes, and notification controls that most users have never turned on.",
    },
  ],
};

export function getArticleFaqs(slug: string): FaqItem[] {
  return ARTICLE_FAQS[slug] ?? [];
}
