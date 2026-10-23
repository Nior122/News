/**
 * Article-level SEO metadata, structured data helpers, and canonical content
 * overrides shared across Cloudflare Pages middleware, API routes, sitemap
 * generation, and server-side rendering.
 */

export const VIBE_CODING_ARTICLE_BODY = `<p>Vibe coding is a way of building software where you describe what you want in plain language and an AI writes the code for you. Instead of typing every line yourself, you steer the project with prompts, test what comes back, and ask the AI to fix or change things until it works.</p>

<p>The approach went from a single social media post in early 2025 to a mainstream workflow across startups, classrooms and big tech companies. Whether you have never written a line of code or you ship software for a living, it helps to understand what vibe coding actually does well and where it breaks down.</p>

<h2 id="what-is-vibe-coding">What is vibe coding?</h2>

<p>At its simplest, vibe coding flips the usual relationship between a person and a code editor. Traditional programming asks you to translate an idea into exact syntax a computer understands. Vibe coding lets you keep working at the level of the idea while a large language model handles the syntax, file structure and boilerplate.</p>

<p>Computer scientist <a href="https://simonwillison.net/2025/Mar/19/vibe-coding/" target="_blank" rel="noopener noreferrer">Simon Willison draws a useful line</a> here. Using an AI assistant to help write code that you still read, test and understand is just AI-assisted programming. True vibe coding means accepting code you have not fully read and judging it mainly by whether the app behaves the way you wanted.</p>

<p>That distinction matters because the two habits carry very different risks, which we get into below.</p>

<h3 id="where-the-term-came-from">Where the term came from</h3>

<p>Former Tesla AI director and OpenAI co-founder <a href="https://x.com/karpathy/status/1886192184808149383" target="_blank" rel="noopener noreferrer">Andrej Karpathy coined "vibe coding"</a> in a post on X on February 2, 2025. He described building weekend projects by talking to an AI through voice input, barely touching the keyboard, accepting suggested changes without reading diffs, and pasting error messages straight back into the chat when something failed.</p>

<p>The phrase caught on fast because developers recognised the behaviour immediately. Within nine months, <a href="https://kvia.com/news/business-technology/cnn-business-consumer/2025/11/06/vibe-coding-named-collins-dictionarys-word-of-the-year/" target="_blank" rel="noopener noreferrer">Collins Dictionary named "vibe coding" its 2025 Word of the Year</a> after tracking a steep jump in usage across tech media and everyday conversation.</p>

<p>A year later, Karpathy himself suggested the industry was already moving toward a more disciplined version he called <a href="https://thenewstack.io/vibe-coding-is-passe/" target="_blank" rel="noopener noreferrer">agentic engineering</a>, where AI agents still write the code, but humans supervise architecture, testing and quality much more closely.</p>

<h2 id="how-vibe-coding-works-step-by-step">How vibe coding works, step by step</h2>

<p>Most vibe coding sessions follow the same tight loop:</p>

<ol>
  <li><strong>Describe the goal.</strong> You tell the AI what you want to build, who it is for, and how it should look or behave.</li>
  <li><strong>Let the AI generate a first version.</strong> The tool creates files, installs packages, writes frontend and backend code, and starts a preview.</li>
  <li><strong>Run the app and inspect the result.</strong> Rather than reading every file first, you click around, test inputs and see what actually happens.</li>
  <li><strong>Refine in plain English.</strong> You ask for changes one step at a time, or paste error messages back into the chat until the issue disappears.</li>
</ol>

<p>You repeat that loop until the app does what you want. In practice, most of the work is not writing code. It is deciding what to ask next, spotting what broke, and checking whether the app behaves properly on edge cases.</p>

<figure>
  <img src="/images/vibe-coding-workflow-diagram.svg" alt="Four-step vibe coding workflow: describe the app, AI builds it, review the result, refine with feedback" width="1000" height="400" loading="lazy" decoding="async" />
  <figcaption>The basic vibe coding loop.</figcaption>
</figure>

<h3 id="a-five-minute-example">A five-minute example</h3>

<p>Say you want a small page that splits a restaurant bill between friends, including tip and tax. In a browser builder like Lovable, Bolt or Replit, your first prompt might be:</p>

<p><em>"Build a mobile-friendly bill splitter. Let me enter the subtotal, tax percentage, tip percentage, and number of people. Show what each person owes in large clear text, plus a reset button."</em></p>

<p>Within a minute, you have a working screen. Next you notice two problems: someone did not drink alcohol, and the currency defaults to dollars. So your second prompt says:</p>

<p><em>"Add an optional itemized mode where I can assign specific items to specific people, and let me switch currency."</em></p>

<p>Three or four rounds like that usually produce a clean personal tool that would have taken a beginner days to wire up by hand.</p>

<h2 id="vibe-coding-vs-traditional-coding-vs-no-code">Vibe coding vs traditional coding vs no-code</h2>

<p>Vibe coding sits neatly between visual no-code builders and hand-written software, though it gets confused with both.</p>

<table>
  <thead>
    <tr>
      <th>Approach</th>
      <th>How you build</th>
      <th>Flexibility</th>
      <th>Learning curve</th>
      <th>Best suited for</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Traditional coding</td>
      <td>Write source code directly</td>
      <td>Full control over everything</td>
      <td>High: months to years</td>
      <td>Production systems, custom architecture, high security</td>
    </tr>
    <tr>
      <td>No-code tools (Bubble, Webflow, Zapier)</td>
      <td>Drag blocks and configure menus</td>
      <td>Limited to platform features</td>
      <td>Low to medium</td>
      <td>Standard websites, forms, internal workflows</td>
    </tr>
    <tr>
      <td>Vibe coding</td>
      <td>Prompt an AI that generates real code</td>
      <td>High because output is real code</td>
      <td>Low to start, medium to finish well</td>
      <td>Prototypes, personal tools, MVPs, UI experiments</td>
    </tr>
  </tbody>
</table>

<p>The big advantage over older no-code tools is that vibe coding produces actual source code — HTML, TypeScript, Python, SQL — that you can export, host anywhere, or hand to an engineer later. The trade-off is that real code can break in ways a locked-down drag-and-drop builder prevents.</p>

<h2 id="the-best-vibe-coding-tools-in-2026">The best vibe coding tools in 2026</h2>

<p>Vibe coding tools now fall into three practical buckets depending on how comfortable you are with technical setup.</p>

<h3 id="browser-app-builders">Browser app builders</h3>

<p>If you want zero local setup, start here. You open a webpage, type a prompt, and see a live app preview side by side with the chat.</p>

<ul>
  <li><strong>Lovable</strong> focuses on turning plain-English prompts into full-stack web apps with clean interfaces, authentication and database wiring through Supabase.</li>
  <li><strong>Bolt.new</strong> spins up full web projects directly in the browser and is fast for testing UI ideas and throwaway prototypes.</li>
  <li><strong>Replit Agent</strong> combines code generation with built-in hosting, databases and deployment in one workspace, making it one of the easiest ways to publish a working link.</li>
  <li><strong>Vercel v0</strong> shines when your main goal is sharp frontend components, landing pages and React interfaces.</li>
  <li><strong>Google AI Studio and Firebase Studio</strong> give strong free starting points inside Google's ecosystem, especially since the <a href="/article/google-io-2026-ai-announcements">Google I/O 2026 AI announcements</a> expanded agent features across developer tools.</li>
</ul>

<h3 id="ai-code-editors">AI code editors</h3>

<p>Once projects grow past a few screens, dedicated editors give you far better control over files, version history and debugging.</p>

<ul>
  <li><strong>Cursor</strong> looks like Visual Studio Code, which most developers already know, and adds multi-file AI editing, codebase search and background agents.</li>
  <li><strong>Windsurf</strong> offers a similar agent-driven editor experience aimed at keeping large projects coherent across many files.</li>
  <li><strong>GitHub Copilot</strong> plugs straight into VS Code, JetBrains and GitHub repositories, making it an easy default for teams already on GitHub.</li>
</ul>

<h3 id="command-line-agents">Command-line agents</h3>

<p>Power users increasingly run coding agents straight from a terminal rather than a visual builder.</p>

<ul>
  <li><strong>Claude Code</strong> reads an entire local repository, edits multiple files, runs tests in your terminal and commits changes with your approval.</li>
  <li><strong>OpenAI Codex</strong> handles parallel coding tasks, repo questions and pull-request workflows both locally and in the cloud.</li>
</ul>

<p>If you are unsure which model ecosystem suits your day-to-day work outside coding as well, our <a href="/article/chatgpt-claude-gemini-comparison-2026">ChatGPT vs Claude vs Gemini comparison</a> breaks down how the major assistants differ.</p>

<h3 id="vibe-coding-tools-compared">Vibe coding tools compared</h3>

<table>
  <thead>
    <tr>
      <th>Tool</th>
      <th>Best for</th>
      <th>Free tier</th>
      <th>Paid plans start around</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Lovable</td>
      <td>Beginners building full-stack web MVPs</td>
      <td>Yes: limited daily credits</td>
      <td>$25/month</td>
    </tr>
    <tr>
      <td>Bolt.new</td>
      <td>Fast browser prototypes and UI mockups</td>
      <td>Yes: limited token allowance</td>
      <td>$20–$25/month</td>
    </tr>
    <tr>
      <td>Replit</td>
      <td>All-in-one build, database and instant hosting</td>
      <td>Yes: starter tier</td>
      <td>Core $20/month ($18 if billed yearly)</td>
    </tr>
    <tr>
      <td>Cursor</td>
      <td>Working in an AI-first code editor</td>
      <td>Yes: Hobby plan, limited use</td>
      <td>Pro $20/month</td>
    </tr>
    <tr>
      <td>Claude Code</td>
      <td>Multi-file terminal workflows on real repos</td>
      <td>Included with paid Claude tiers</td>
      <td>Claude Pro $20/month ($17 if billed yearly)</td>
    </tr>
    <tr>
      <td>GitHub Copilot</td>
      <td>Autocomplete and agent mode inside existing IDEs</td>
      <td>Yes: 2,000 completions per month</td>
      <td>Pro $10/month</td>
    </tr>
  </tbody>
</table>

<p><em>Pricing changes often across AI products; figures above were checked against vendor pricing pages in October 2026.</em></p>

<h2 id="what-vibe-coding-is-good-for">What vibe coding is good for</h2>

<p>Used on the right problem, vibe coding saves a remarkable amount of time. In the <a href="https://stackoverflow.co/company/press/archive/stack-overflow-2025-developer-survey/" target="_blank" rel="noopener noreferrer">2025 Stack Overflow Developer Survey</a>, 84% of respondents said they were already using or planning to use AI tools in their development workflow, largely for speed on repetitive tasks.</p>

<p>The clearest wins show up in four places:</p>

<ul>
  <li><strong>Throwaway prototypes and demos.</strong> Showing teammates or clients a clickable product in an afternoon beats writing a ten-page spec nobody reads.</li>
  <li><strong>Personal tools and internal utilities.</strong> Calculators, CSV cleaners, habit trackers, simple dashboards and one-off scripts rarely justify hiring a developer, yet AI builds them well. They fit nicely alongside the broader <a href="/article/ai-tools-saving-hours-every-week-2026">AI tools saving hours every week</a> across everyday admin work.</li>
  <li><strong>Learning how software fits together.</strong> Asking an AI to explain the button, route or database query it just created is a gentler entry point than staring at a blank terminal.</li>
  <li><strong>Frontend scaffolding for experienced engineers.</strong> Even senior developers often let AI draft forms, tables, test data and boilerplate so they can spend their energy on core logic.</li>
</ul>

<h2 id="where-vibe-coding-falls-short">Where vibe coding falls short</h2>

<p>The honest catch is that getting to 80% of a working app feels effortless, while the final 20% can get messy fast.</p>

<p>That sentiment shows up clearly in developer data too. In the same Stack Overflow survey, positive favourability toward AI tools dipped from above 70% in earlier years to 60%, and 46% of developers said they actively distrust the accuracy of AI output. Most developers still keep AI away from high-stakes deployment and security decisions.</p>

<h3 id="security-risks-are-real">Security risks are real</h3>

<p>AI models optimise for making your prompt work right now, not necessarily for making it safe on the public internet. In a <a href="https://www.veracode.com/press-release/ai-generated-code-poses-major-security-risks-in-nearly-half-of-all-development-tasks-veracode-research-reveals/" target="_blank" rel="noopener noreferrer">2025 benchmark across more than 100 models</a>, security firm Veracode found that 45% of AI-generated code tasks introduced known security flaws, including weak cross-site scripting and log-injection handling.</p>

<p>Typical beginner mistakes with vibe-coded apps look painfully ordinary:</p>

<ul>
  <li>API keys pasted into frontend code where anyone opening browser dev tools can steal them.</li>
  <li>Database tables left readable or editable by any logged-in user because row-level permissions were skipped.</li>
  <li>Login, billing or file-upload logic that works on the happy path and fails quietly on malicious input.</li>
</ul>

<h3 id="the-debugging-trap">The debugging trap</h3>

<p>The second wall hits once a project reaches a few thousand lines of code you have never read. Asking an AI to fix Bug A often breaks Feature B because neither you nor the model holds a clean mental map of the whole app.</p>

<p>Costs can creep up at the same point. Repeating "still broken, fix it" burns paid credits quickly without moving forward.</p>

<h3 id="vibe-coding-vs-agentic-engineering">Vibe coding vs agentic engineering</h3>

<p>This gap explains why experienced builders treat pure vibe coding as a prototyping mode rather than a whole engineering method. With a prototype, speed matters most. With software other people rely on or pay for, someone still needs to review diffs, write tests, lock down secrets and understand the data model — even while <a href="/article/big-tech-725-billion-ai-spending-layoffs-2026">Big Tech pours hundreds of billions into AI</a> to automate more of the job.</p>

<h2 id="how-to-start-vibe-coding-safely">How to start vibe coding safely</h2>

<p>If you want to build your first project this weekend without painting yourself into a corner, keep the workflow simple:</p>

<ol>
  <li><strong>Pick one tiny problem.</strong> A single-purpose tool — a study flashcard app, workout timer, invoice generator, reading tracker — works far better than "build me a marketplace."</li>
  <li><strong>Write down the rules before prompting.</strong> List the screens, inputs and outputs in five bullet points first. Good structure beats clever wording; the habits behind a solid <a href="/article/ai-prompt-formula-better-answers-2026">AI prompt formula</a> apply directly here.</li>
  <li><strong>Ask for one feature at a time.</strong> Build the core screen first, test it, then add saving data, then polish styling. Huge all-in-one prompts create tangled code.</li>
  <li><strong>Save checkpoints constantly.</strong> Use built-in version history or Git commits after every working step so one bad edit cannot ruin an hour of progress.</li>
  <li><strong>Keep secrets out of prompts and frontend files.</strong> Store API keys in environment variables, and never paste real customer data or private credentials into chat windows unless you know how the tool handles privacy — or run models locally using <a href="/article/amd-on-device-ai-no-internet-2026">on-device AI tools</a> when privacy comes first.</li>
  <li><strong>Do a sanity pass before sharing publicly.</strong> If an app touches logins, payments or personal data, get a developer to review authentication, database permissions and rate limits before real users arrive.</li>
</ol>

<h2 id="frequently-asked-questions">Frequently asked questions</h2>

<h3 id="do-you-need-coding-experience-to-vibe-code">Do you need coding experience to vibe code?</h3>

<p>No — beginners build working personal tools and prototypes all the time without knowing syntax. Basic familiarity with how web pages, databases and environment variables work becomes helpful as soon as you want to publish an app for other people.</p>

<h3 id="is-vibe-coding-free">Is vibe coding free?</h3>

<p>You can start for free on most platforms, including Google AI Studio, GitHub Copilot's free tier, Replit, Bolt and Lovable's daily credit plans. Heavy building or deploying custom domains usually pushes you onto a $10 to $25 monthly plan.</p>

<h3 id="what-programming-languages-work-best-for-vibe-coding">What programming languages work best for vibe coding?</h3>

<p>JavaScript, TypeScript, HTML/CSS and Python work best because AI models have seen enormous amounts of public training code and mature frameworks in those languages. Most browser app builders default to React, TypeScript and Tailwind CSS automatically.</p>

<h3 id="can-you-build-a-real-business-with-vibe-coding">Can you build a real business with vibe coding?</h3>

<p>You can validate demand and build an early minimum viable product quickly, and many solo founders do. Before charging customers or storing sensitive data, plan on proper security review, automated tests and clean version control rather than pure prompt-and-pray edits.</p>

<h3 id="is-vibe-coding-safe">Is vibe coding safe?</h3>

<p>For local scripts, mockups and personal utilities, yes. For public apps handling logins, payments or user data, raw AI-generated code often misses permissions and input validation, so human security checks remain essential.</p>

<h3 id="will-vibe-coding-replace-software-developers">Will vibe coding replace software developers?</h3>

<p>It changes what developers spend time on rather than removing the need for engineering judgment. Writing routine boilerplate gets much faster, while architecture, security, debugging complex systems and product decisions matter more.</p>`;

export const ARTICLE_CONTENT_OVERRIDES = {
  "what-is-vibe-coding-2026": {
    title: "What Is Vibe Coding? A Beginner's Guide for 2026",
    subtitle: "Vibe coding lets you build apps by describing them in plain English. Here is how it works, which tools to try, and what can go wrong.",
    excerpt: "Vibe coding means building software by describing it in plain English and letting AI write the code. See how it works, which tools to try and where it can go wrong.",
    body: VIBE_CODING_ARTICLE_BODY,
    category: "Trending",
    image_url: "/images/vibe-coding-beginners-guide-hero.webp",
    read_time: 9,
    tags: [
      "vibe coding",
      "vibe coding tools",
      "AI coding",
      "Andrej Karpathy",
      "AI app builders",
      "no-code",
      "beginner guide",
    ],
  },
};

export const ARTICLE_SEO_OVERRIDES = {
  "what-is-vibe-coding-2026": {
    metaTitle: "What Is Vibe Coding? A Beginner's Guide (2026)",
    metaDescription:
      "Vibe coding means building software by describing it in plain English. Learn how it works, the best tools, the real risks and how to start.",
    dateModified: "2026-10-23T00:00:00.000Z",
    updatedLabel: "Last updated: October 2026",
    robots: "index, follow, max-image-preview:large",
    schemaType: "Article",
    heroAlt:
      "Illustration of a person describing an app idea to an AI that builds the software on a laptop screen",
    heroCaption:
      "Vibe coding lets you describe software in plain English and have AI build it.",
    heroWidth: 1200,
    heroHeight: 630,
    enableSsrToc: true,
    faqs: [
      {
        q: "Do you need coding experience to vibe code?",
        a: "No — beginners build working personal tools and prototypes all the time without knowing syntax. Basic familiarity with how web pages, databases and environment variables work becomes helpful as soon as you want to publish an app for other people.",
      },
      {
        q: "Is vibe coding free?",
        a: "You can start for free on most platforms, including Google AI Studio, GitHub Copilot's free tier, Replit, Bolt and Lovable's daily credit plans. Heavy building or deploying custom domains usually pushes you onto a $10 to $25 monthly plan.",
      },
      {
        q: "What programming languages work best for vibe coding?",
        a: "JavaScript, TypeScript, HTML/CSS and Python work best because AI models have seen enormous amounts of public training code and mature frameworks in those languages. Most browser app builders default to React, TypeScript and Tailwind CSS automatically.",
      },
      {
        q: "Can you build a real business with vibe coding?",
        a: "You can validate demand and build an early minimum viable product quickly, and many solo founders do. Before charging customers or storing sensitive data, plan on proper security review, automated tests and clean version control rather than pure prompt-and-pray edits.",
      },
      {
        q: "Is vibe coding safe?",
        a: "For local scripts, mockups and personal utilities, yes. For public apps handling logins, payments or user data, raw AI-generated code often misses permissions and input validation, so human security checks remain essential.",
      },
      {
        q: "Will vibe coding replace software developers?",
        a: "It changes what developers spend time on rather than removing the need for engineering judgment. Writing routine boilerplate gets much faster, while architecture, security, debugging complex systems and product decisions matter more.",
      },
    ],
  },
};

export function getArticleSeoOverride(slug) {
  if (!slug || typeof slug !== "string") return null;
  return Object.hasOwn(ARTICLE_SEO_OVERRIDES, slug) ? ARTICLE_SEO_OVERRIDES[slug] : null;
}

export function applyArticleContentOverride(row) {
  if (!row || typeof row !== "object") return row;
  const slug = String(row.slug ?? "").trim();
  if (!slug || !Object.hasOwn(ARTICLE_CONTENT_OVERRIDES, slug)) return row;
  const override = ARTICLE_CONTENT_OVERRIDES[slug];
  const merged = { ...row };
  for (const [key, value] of Object.entries(override)) {
    if (key in row || key === "subtitle" || key === "read_time" || key === "tags" || key === "image_url") {
      merged[key] = value;
    }
  }
  return merged;
}

export function buildFaqJsonLd(faqs) {
  if (!Array.isArray(faqs) || faqs.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };
}
