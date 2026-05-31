export interface FaqItem {
  question: string;
  answer: string;
}

export const ARTICLE_FAQS: Record<string, FaqItem[]> = {
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
      question: "Do I need to know how to code to vibe code?",
      answer: "No — that's the whole point. Vibe coding tools like Cursor, Replit Agent, and GitHub Copilot Chat let you describe what you want in plain English and get working code back. Basic logical thinking helps, but syntax knowledge is optional.",
    },
    {
      question: "Is vibe coding reliable enough for production apps?",
      answer: "For prototypes, internal tools, and MVPs — absolutely. For large-scale production systems with complex security requirements, AI-generated code still needs careful review by experienced engineers.",
    },
    {
      question: "What's the best vibe coding tool for beginners in 2026?",
      answer: "Replit Agent is consistently recommended for beginners because it handles hosting, databases, and deployment automatically — you don't need to set anything up. Cursor is better for experienced developers who want AI assistance within their own environment.",
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
};

export function getArticleFaqs(slug: string): FaqItem[] {
  return ARTICLE_FAQS[slug] ?? [];
}
