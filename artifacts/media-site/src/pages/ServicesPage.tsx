import React, { useEffect } from "react";
import {
  ArrowRight, Bot, Workflow, Globe, Smartphone, Plug, Palette,
  MessageCircle, BookOpen, Sparkles, CheckCircle2, Mail, WandSparkles,
  Headphones, BrainCircuit, PanelsTopLeft,
} from "lucide-react";
import { usePageMeta } from "@/hooks/usePageMeta";

const WHATSAPP = "https://wa.me/2347046118938";
const EMAIL = "mailto:chinecheremjoseph39@gmail.com";

const services = [
  {
    id: "ai-automation",
    number: "01",
    title: "AI Automation",
    tagline: "Stop spending your day on the same small tasks.",
    intro: "Do you copy customer details from WhatsApp into a notebook? Send the same reminder every morning? Check orders one by one? We can build a system that handles suitable repeated jobs for you. You stay in charge, but the computer does more of the routine work.",
    who: "Shop owners, schools, salons, online sellers, offices, service providers and growing businesses that are tired of doing the same work again and again.",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=82",
    alt: "Person working on a laptop in a modern workspace",
    icon: BrainCircuit,
    examples: [
      "When a customer fills your website form, save their name and phone number and alert you immediately.",
      "Collect new orders from an online form and put them neatly in one order list.",
      "Send customers a message when their booking or order has been received.",
      "Remind customers about appointments, classes, deliveries or payment dates.",
      "Send a follow-up to people who asked for your price but have not replied yet.",
      "Sort incoming messages into groups such as new order, complaint, booking and general question.",
      "Prepare a daily sales or order summary so you can see what came in without counting everything by hand.",
      "Take details from a filled form and prepare an invoice, receipt or customer record for you to check.",
      "Send new staff or team members a welcome message and their first instructions.",
      "Collect customer feedback after a job, delivery, class or appointment.",
      "Turn long customer messages or documents into short notes that are easier to read.",
      "Help a content creator organise content ideas, draft captions and prepare a posting plan.",
      "Notify you when a new lead, order or support request needs your attention.",
      "Move information between your forms, spreadsheets, email, calendar and other supported apps."
    ],
    outcome: "Spend less time chasing details and repeating small jobs. Get more time to attend to customers and grow your business.",
    keywords: ["Task automation", "AI-assisted processes", "Business productivity"]
  },
  {
    id: "ai-chatbots",
    number: "02",
    title: "AI Chatbot Development",
    tagline: "Let customers ask questions and get help, even when you are busy.",
    intro: "Imagine a customer visiting your website at night and asking, “How much is it?”, “Where are you located?” or “How do I order?” A chatbot can answer using the information you give it. It can guide the customer, collect details and call you in when a real person is needed.",
    who: "Business owners, online vendors, schools, salons, hotels, restaurants, property agents, creators and service providers who receive many of the same questions.",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=82",
    alt: "Team discussing customer communication around a laptop",
    icon: Headphones,
    examples: [
      "A WhatsApp-style website assistant that tells visitors what you sell and how to contact you.",
      "A fashion store bot that explains available sizes, colours, prices and how to place an order using your product list.",
      "A restaurant bot that shares the menu, opening hours, location and booking steps.",
      "A salon or barbing shop bot that explains services, prices, working hours and how to request an appointment.",
      "A school bot that answers questions about admission, classes, term dates and documents needed.",
      "A real estate enquiry bot that asks a buyer about their preferred area, property type and budget, then passes the details to an agent.",
      "A hotel or short-stay bot that answers questions about room types, check-in times and booking steps.",
      "A church or event bot that shares programme times, venue details, registration information and event updates.",
      "A creator's bot that explains available courses, ebooks, services or membership options.",
      "A delivery business bot that explains delivery areas, charges and how customers can ask about an order.",
      "A customer support bot that answers common questions about returns, repairs, delivery or using a product.",
      "A lead collection bot that asks a visitor for their name, contact and what help they need.",
      "A website assistant that helps people find the right service instead of searching through many pages.",
      "A staff help bot that answers team questions from your approved guides, rules and documents."
    ],
    outcome: "Customers can get basic answers quickly, and you receive clearer enquiries instead of typing the same replies all day.",
    keywords: ["Website chatbot", "Customer support", "Enquiry assistant"]
  },
  {
    id: "ai-agents",
    number: "03",
    title: "AI Agent Development",
    tagline: "Give a digital assistant a job to work through for you.",
    intro: "A chatbot mainly talks with people. An AI agent can also work through a set of steps using the tools you approve. For example, it could check new enquiries, look up information, prepare a report or organise a task. You decide what it is allowed to do, and important actions can still wait for your approval.",
    who: "Business owners, teams, creators and organisations with tasks that involve several steps or lots of information.",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=82",
    alt: "Abstract artificial intelligence technology visual",
    icon: Bot,
    examples: [
      "A sales helper that checks new enquiries, sorts them by what the person needs and prepares a follow-up message.",
      "A research helper that looks up information from approved websites and prepares a simple report with sources.",
      "A customer service helper that checks your FAQ or product guide and drafts an answer for your team to approve.",
      "A document helper that reads your uploaded files and finds details such as names, dates or key points.",
      "A social media helper that turns your notes into post ideas, captions and a weekly content plan.",
      "A meeting helper that turns notes or a transcript into decisions, action points and tasks.",
      "An office helper that checks a list of pending jobs and prepares a daily update.",
      "A property enquiry helper that sorts enquiries by location, property type and budget before an agent responds.",
      "A school office helper that finds information in approved school documents and drafts replies to common questions.",
      "An online shop helper that checks product information and helps staff prepare answers to customer questions.",
      "A recruitment helper that sorts applications using criteria you set and prepares a shortlist for a human to review.",
      "A creator assistant that helps organise video ideas, research topics and prepare scripts.",
      "A report helper that reviews supplied sales or service records and points out useful patterns.",
      "A task assistant that follows an approved checklist and asks you before sending messages, changing records or taking important actions."
    ],
    outcome: "Let an assistant handle the checking, sorting and preparation, while you keep control of decisions and important actions.",
    keywords: ["AI assistants", "Task execution", "Human approval"]
  },
  {
    id: "website-development",
    number: "04",
    title: "Website Development",
    tagline: "Help people find you, trust you and contact you online.",
    intro: "When someone hears about your business, they may search for you before calling or visiting. A clear website shows what you do, what you sell, where you are and how people can reach you. We build websites that work on phones as well as computers.",
    who: "Local business owners, shops, professionals, schools, churches, restaurants, hotels, property agents, organisations and content creators.",
    image: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&w=1200&q=82",
    alt: "Website layout displayed on a desktop computer",
    icon: Globe,
    examples: [
      "A website for a supermarket, boutique or phone shop showing products, opening hours, location and contact details.",
      "A website for a salon, spa or barbing shop showing services, price guide, photos and booking details.",
      "A restaurant or food business website with menu, food photos, location, opening times and order enquiries.",
      "A website for a fashion designer or tailor showing designs, past work, size information and how to place an order.",
      "A website for a school or training centre with courses, admission details, school news and enquiry forms.",
      "A website for a church, ministry or community group with service times, events, announcements and contact details.",
      "A property website where agents can display houses, land, office spaces and enquiry details.",
      "A website for a mechanic, electrician, plumber, cleaner or other local service provider to show services and service areas.",
      "A professional portfolio for a photographer, makeup artist, designer, developer, writer or consultant.",
      "A personal brand website for a coach, speaker, musician, author or content creator.",
      "A landing page that explains one product, event, course or service and guides visitors to enquire or register.",
      "A blog where you can publish helpful articles, news, guides and updates.",
      "An online catalogue where customers can browse products before contacting you to order.",
      "A simple booking or appointment website where visitors can request an available time.",
      "A website refresh that makes an old, confusing or phone-unfriendly website easier to use."
    ],
    outcome: "Give people one clear place to learn about your business, see what you offer and reach you whenever they are ready.",
    keywords: ["Business websites", "Landing pages", "Portfolio websites"]
  },
  {
    id: "ai-app-development",
    number: "05",
    title: "AI App Development",
    tagline: "Have an app idea? Let's turn it into something people can use.",
    intro: "Maybe you have an idea that could help traders, students, workers, parents, creators or your own customers. We can help plan and build a web or mobile-friendly app with useful AI features. You do not need to know how apps are made; start by telling us what you want the app to help people do.",
    who: "Entrepreneurs, small businesses, educators, creators and organisations with an idea for a useful app or online tool.",
    image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=1200&q=82",
    alt: "Mobile application screens displayed on a smartphone",
    icon: Smartphone,
    examples: [
      "A study app that explains difficult topics in simple words and creates practice questions.",
      "An app that lets users upload a document and ask questions about what is inside it.",
      "A writing app that helps users turn rough notes into letters, proposals, captions or reports.",
      "A small business app for recording customers, sales, expenses and daily activities.",
      "A stock and product app that helps a shop owner keep track of items coming in and going out.",
      "A food or recipe app that suggests meal ideas based on ingredients a user has entered.",
      "A learning app for a training centre with lessons, quizzes and student progress.",
      "A customer app where people can check services, send requests and receive updates.",
      "A property search app that helps users browse available properties and send enquiries.",
      "A booking app for salons, tutors, repairers or other appointment-based businesses.",
      "A content helper app that helps creators plan posts, write captions and organise ideas.",
      "A CV and job application helper that helps users prepare and improve their documents.",
      "A simple question-and-answer app for a school, organisation or business using its own approved information.",
      "An internal staff app for submitting requests, checking instructions and tracking assigned tasks.",
      "A custom AI tool that handles one clear problem your customers or team face every day."
    ],
    outcome: "Build around a real need, with only the features that make the app useful. We agree on what is possible before work begins.",
    keywords: ["Custom AI apps", "AI-powered tools", "Application development"]
  },
  {
    id: "workflow-automation",
    number: "06",
    title: "Workflow Automation",
    tagline: "Make the apps you use pass work to one another.",
    intro: "Do you receive an order in one place, write it in a notebook, copy it into a spreadsheet and then message someone else? That is a workflow. We can connect supported apps using tools like n8n and Make.com so information moves through those steps with less manual work.",
    who: "Businesses and creators using WhatsApp, email, Google Sheets, forms, calendars, online stores, payment tools or other apps as part of their daily work.",
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1200&q=82",
    alt: "Team collaborating on a digital workflow",
    icon: Workflow,
    examples: [
      "When a customer fills a Google Form, add the details to Google Sheets and send you a notification.",
      "When someone books an appointment, add it to a calendar and prepare a confirmation message.",
      "When a new order arrives, record it, alert the person handling delivery and update the order list.",
      "When a customer pays through a supported provider, receive the payment notice and update the matching order record.",
      "When a new website enquiry arrives, save it and remind you to follow up.",
      "When a new email arrives with an attachment, save the file in the right folder and notify your team.",
      "When a customer completes a form, create a task for the staff member who should handle it.",
      "When a new product is added to a catalogue, send the details to the other connected tools that need it.",
      "When a creator approves a post, prepare it for the selected social channels or send it into the agreed publishing process.",
      "Every morning, prepare a list of new orders, bookings or enquiries received the previous day.",
      "When a customer asks for help, create a support record and send it to the right person.",
      "Connect a website, spreadsheet, email and database so customer details do not need to be typed repeatedly.",
      "Send reminders when a task is still waiting for attention after an agreed time.",
      "Create a simple approval flow where a manager checks a message or document before it is sent."
    ],
    outcome: "Reduce the back-and-forth between apps, cut down repeated typing and help your team follow the same steps every time.",
    keywords: ["n8n automation", "Make.com integrations", "Connected workflows"]
  },
  {
    id: "api-integration",
    number: "07",
    title: "API Integration",
    tagline: "Connect the tools your business already depends on.",
    intro: "Sometimes the apps you use do not share information automatically. An API is simply a way for one app to send information to another. We can build that connection when the platforms allow it, so you do not have to keep copying the same details from place to place.",
    who: "Online sellers, service businesses, schools, platforms, creators and organisations using different software for customers, orders, bookings or records.",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=82",
    alt: "Server and network equipment representing connected software systems",
    icon: Plug,
    examples: [
      "Connect your website contact form to your customer list so every enquiry is saved.",
      "Connect a supported payment service to your order system so payment updates can be matched to orders.",
      "Connect a booking system to Google Calendar or another supported calendar.",
      "Connect your online shop to a stock list so product quantities can be kept in sync where supported.",
      "Connect a website to an email service so visitors receive a welcome or confirmation email.",
      "Connect a customer database to a messaging service to send approved updates or reminders.",
      "Connect a delivery or tracking service to a website so customers can view available tracking information.",
      "Connect a school website form to an admissions record system.",
      "Connect a property listing website to a database where agents manage available properties.",
      "Connect an AI service to your website so visitors can use a specific AI feature.",
      "Connect a spreadsheet to another business tool so selected information is shared automatically.",
      "Bring information from several approved services into one dashboard.",
      "Connect a membership or course platform to a system that manages access, where the provider supports it.",
      "Connect your internal app to an outside service to check or send information securely."
    ],
    outcome: "Help separate apps share the information they need, instead of making you enter the same details again and again.",
    keywords: ["Software connections", "API development", "Data exchange"]
  },
  {
    id: "ui-ux-design",
    number: "08",
    title: "UI/UX Design",
    tagline: "Make your website or app look clear and feel easy to use.",
    intro: "Have you ever opened a website and struggled to find the price, contact button or sign-up page? Your customers can feel the same way. We plan and design screens so people can quickly understand what to do, whether they are using a phone, tablet or computer.",
    who: "Business owners, app founders, schools, online stores, organisations and creators who want a neat, clear and easy-to-use digital product.",
    image: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?auto=format&fit=crop&w=1200&q=82",
    alt: "Digital interface and user experience design displayed on a screen",
    icon: PanelsTopLeft,
    examples: [
      "Design a clean homepage that quickly tells visitors what your business does.",
      "Arrange a shop website so customers can find products, prices and contact details without stress.",
      "Design an online order form that is easy to complete on a phone.",
      "Create a simple booking screen for a salon, hotel, tutor or service provider.",
      "Design a dashboard where a business owner can see orders, customers and important updates.",
      "Plan the screens for a new app before the app is built.",
      "Improve a sign-up and login process so users know what information to enter.",
      "Design a school portal where students, parents or staff can find the right information.",
      "Create a simple course page where learners can view lessons and track what they have completed.",
      "Redesign a confusing menu so visitors can move around a website more easily.",
      "Choose matching colours, text styles, buttons and icons so every page feels like part of the same brand.",
      "Create a clickable sample of an app or website so you can see how it may work before development.",
      "Make layouts that adjust properly to small phone screens and larger computer screens.",
      "Review an existing website or app and point out places where users may get confused."
    ],
    outcome: "Help customers find their way, understand your offer and complete tasks with less confusion.",
    keywords: ["Interface design", "User experience", "Wireframes and prototypes"]
  },
  {
    id: "ai-content-creation",
    number: "09",
    title: "AI Content Creation",
    tagline: "Get fresh content ideas and turn them into ready-to-review material.",
    intro: "If you run a business or create content, you know how hard it can be to think of something new to post every day. We use AI tools to help create drafts, ideas and visuals based on your message. You review and approve the content before it goes out.",
    who: "TikTokers, YouTubers, Instagram and Facebook creators, musicians, coaches, online vendors, restaurants, professionals and small businesses.",
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=82",
    alt: "Creative team workspace with computers and content planning",
    icon: WandSparkles,
    examples: [
      "Create a month of post ideas for a boutique, food seller, salon or other small business.",
      "Write simple product captions that tell customers what an item does, its price and how to order.",
      "Prepare TikTok, Instagram Reels and YouTube Shorts scripts with a strong opening and clear message.",
      "Turn one long video, lesson or voice note into several short post ideas and captions.",
      "Write Facebook posts that explain your services in everyday language and invite people to contact you.",
      "Create a weekly content plan for a creator, business owner, church or organisation.",
      "Prepare YouTube video titles, descriptions, outlines and thumbnail text ideas.",
      "Create promotional text for a new product, discount, event, opening or special offer.",
      "Write WhatsApp status updates and broadcast message drafts for your business.",
      "Create blog articles and helpful guides for your website.",
      "Prepare email newsletters, welcome messages and customer update drafts.",
      "Generate image ideas and AI-assisted visuals for adverts, posts, product concepts or presentations.",
      "Create simple educational posts that explain a topic step by step.",
      "Write scripts for product demonstrations, customer stories or behind-the-scenes videos.",
      "Turn frequently asked customer questions into a helpful FAQ post series.",
      "Prepare different versions of an advert for different audiences, such as new customers and returning customers."
    ],
    outcome: "Spend less time wondering what to post and more time sharing useful content with the people you want to reach.",
    keywords: ["AI-assisted writing", "Social content", "Creative production"]
  },
  {
    id: "ebooks-digital-products",
    number: "10",
    title: "Ebook & Digital Product Development",
    tagline: "Package what you know into something people can read, use or buy.",
    intro: "Do people often ask you how to do something? Do you have lessons, business tips, recipes, skills or useful experience in your head or in scattered notes? We can help arrange that knowledge into a neat digital product people can download and use.",
    who: "Teachers, students, coaches, authors, content creators, business owners, trainers and anyone with useful knowledge or resources to share.",
    image: "https://images.unsplash.com/photo-1455390582262-044c394e0648?auto=format&fit=crop&w=1200&q=82",
    alt: "Notebook and writing tools on a desk",
    icon: BookOpen,
    examples: [
      "A beginner's ebook that teaches people how to start a small business or learn a skill.",
      "A recipe ebook with food photos, ingredient lists and clear cooking steps.",
      "A fashion guide with style ideas, clothing care tips or measurement guidance.",
      "A study guide, revision notes or practice workbook for learners.",
      "A business starter pack with a simple business plan, price list and record-keeping templates.",
      "A content creator pack with caption ideas, content calendars and video planning sheets.",
      "A budget planner that helps people record income, spending and savings goals.",
      "A fitness or healthy-habit tracker designed around general routines and personal goals.",
      "A guide for new parents, new workers, students or another group you understand well.",
      "A collection of ready-to-edit CV, cover letter, invoice, quotation or proposal templates.",
      "A workbook with questions and exercises to help readers practise what they have learned.",
      "A step-by-step PDF guide that shows customers how to use your product or service.",
      "A lesson pack for a teacher or trainer, with notes, worksheets and quizzes.",
      "A digital planner for appointments, tasks, study time, meal planning or business activities.",
      "A bundle of printable checklists, trackers, forms and worksheets.",
      "An ebook cover and inside-page layout that makes your content look neat and easy to read.",
      "A digital product sales page that explains what buyers will receive and how to get it."
    ],
    outcome: "Turn useful knowledge into a clear, well-arranged digital product that you can share or sell through a suitable platform.",
    keywords: ["Ebook creation", "PDF guides", "Templates and workbooks"]
  }
];

const faqs = [
  {
    q: "I do not understand technology. Can I still work with Chenar?",
    a: "Absolutely. Explain what you want to happen in your own words. You do not need to know technical terms or choose the tools yourself before contacting us."
  },
  {
    q: "I am not sure which service I need. What should I do?",
    a: "Tell us what is difficult, what takes too much time or what you want to create. We can discuss the possible options and help identify a sensible starting point."
  },
  {
    q: "Can you give me examples of what can be built?",
    a: "Yes. The examples on this page are starting points. The final solution depends on your goal, the tools you already use, available integrations, project scope and budget."
  },
  {
    q: "Can you connect the apps my business already uses?",
    a: "Often, yes. It depends on whether those platforms provide a suitable integration method and the required access. We will check this before agreeing on the work."
  },
  {
    q: "How much do your services cost?",
    a: "There is no single price for every project. The cost depends on what you need, the features involved and the amount of work. We will discuss the scope and price with you before work begins."
  },
  {
    q: "Will AI or automation work without any human involvement?",
    a: "Not always, and it should not be assumed. Some tasks can run automatically, while important, sensitive or uncertain actions may need a person to review or approve them."
  },
  {
    q: "How do I get started?",
    a: "Send us a WhatsApp message or email. Tell us what you want to achieve, who it is for and what is currently difficult. A rough idea is enough to start the conversation."
  }
];

export default function ServicesPage() {
  usePageMeta({
    title: "AI Automation, Chatbots, Websites & Digital Services",
    exactTitle: true,
    description: "Explore Chenar services: AI automation, AI chatbots, AI agents, website and AI app development, n8n and Make.com workflow automation, API integration, UI/UX design, AI content creation, ebooks and digital products.",
    ogTitle: "Chenar — AI, Technology & Digital Services",
    ogDescription: "Explore practical digital services explained in plain language, with examples of what Chenar can help you build.",
    ogImage: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=85",
    ogImageWidth: 1200,
    ogImageHeight: 630,
    ogImageAlt: "Laptop displaying a digital workspace"
  });

  useEffect(() => {
    const id = "chenar-services-faq-jsonld";
    document.getElementById(id)?.remove();
    const script = document.createElement("script");
    script.id = id;
    script.type = "application/ld+json";
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map(({ q, a }) => ({
        "@type": "Question",
        name: q,
        acceptedAnswer: { "@type": "Answer", text: a }
      }))
    });
    document.head.appendChild(script);
    return () => script.remove();
  }, []);

  return (
    <div className="chenar-services-page min-h-screen w-full max-w-full overflow-x-clip pb-16">
      <section className="relative isolate overflow-hidden border-b border-border bg-slate-950 text-white">
        <img
          src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=2000&q=85"
          alt="Laptop and digital workspace representing practical technology"
          className="absolute inset-0 -z-20 h-full w-full object-cover opacity-35"
          fetchPriority="high"
          width="2000"
          height="1200"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-900/55" />
        <div className="container mx-auto w-full min-w-0 max-w-6xl px-4 py-16 sm:px-6 md:py-28">
          <p className="mb-5 inline-flex max-w-full flex-wrap items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white/90">
            <Sparkles className="h-4 w-4 shrink-0" /> Practical digital solutions by Chenar
          </p>
          <h1 className="w-full max-w-4xl text-[clamp(2rem,8vw,3.75rem)] font-extrabold leading-[1.12] tracking-tight [overflow-wrap:break-word] md:text-6xl">
            Have a business problem or a digital idea? Let us make the next step easier.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/80 md:text-xl">
            From automating everyday work to building websites, apps and digital products,
            explore what we can help with — explained in simple language and real-life examples.
          </p>
          <div className="mt-9 flex w-full min-w-0 flex-col gap-3 sm:flex-row">
            <a href={WHATSAPP} target="_blank" rel="noopener noreferrer"
              className="inline-flex w-full min-w-0 flex-wrap items-center justify-center gap-2 whitespace-normal break-words rounded-xl bg-primary px-4 py-4 text-center font-bold text-primary-foreground shadow-lg transition hover:opacity-90 sm:w-auto sm:px-6">
              <MessageCircle className="h-5 w-5 shrink-0" /> Tell us what you need <ArrowRight className="h-4 w-4 shrink-0" />
            </a>
            <a href="#all-services"
              className="inline-flex w-full min-w-0 items-center justify-center whitespace-normal break-words rounded-xl border border-white/30 px-4 py-4 text-center font-semibold text-white transition hover:bg-white/10 sm:w-auto sm:px-6">
              Browse all 10 services
            </a>
          </div>
          <p className="mt-5 text-sm text-white/60">No technical knowledge needed. Start with the problem you want to solve.</p>
        </div>
      </section>

      <section className="container mx-auto w-full min-w-0 max-w-5xl px-4 py-12 sm:px-6 md:py-16">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">Find what you need</p>
          <h2 className="mt-3 text-3xl font-extrabold md:text-4xl">Choose a service to explore</h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            You do not have to understand the technical side. Start with the result you want,
            then open a service below to see examples of what it could look like.
          </p>
        </div>
        <nav aria-label="Jump to a service" className="mt-8 flex flex-wrap justify-center gap-2">
          {services.map((service) => (
            <a key={service.id} href={`#${service.id}`}
              className="rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold transition hover:border-primary hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
              {service.number}. {service.title}
            </a>
          ))}
        </nav>
      </section>

      <section className="bg-muted/40 py-14 md:py-20">
        <div className="container mx-auto w-full min-w-0 max-w-6xl px-4 sm:px-6">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">What Chenar can help you do</p>
            <h2 id="all-services" className="mt-3 text-3xl font-extrabold md:text-5xl">Ten services. Practical ways to move forward.</h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              Each project starts with understanding your needs. These examples show the kinds
              of things we can discuss — your final solution will be shaped around your situation.
            </p>
          </div>

          <div className="grid min-w-0 grid-cols-1 gap-7 lg:grid-cols-2">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <article id={service.id} key={service.id} className="min-w-0 scroll-mt-24 overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
                  <div className="relative">
                    <img src={service.image} alt={service.alt} loading="lazy" width="1200" height="800"
                      className="h-52 w-full object-cover sm:h-60" />
                    <span className="absolute left-4 top-4 rounded-full bg-slate-950/80 px-3 py-1.5 text-xs font-bold text-white backdrop-blur">
                      SERVICE {service.number}
                    </span>
                  </div>
                  <div className="min-w-0 p-5 sm:p-7">
                    <div className="flex min-w-0 items-start gap-3">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" />
                      </span>
                      <div className="min-w-0">
                        <h3 className="text-2xl font-extrabold leading-tight [overflow-wrap:break-word]">{service.title}</h3>
                        <p className="mt-1 font-semibold text-primary">{service.tagline}</p>
                      </div>
                    </div>
                    <p className="mt-5 leading-relaxed text-muted-foreground">{service.intro}</p>
                    <div className="mt-5 rounded-2xl bg-muted/60 p-4">
                      <p className="text-xs font-bold uppercase tracking-wider text-primary">Who this is for</p>
                      <p className="mt-2 text-sm leading-relaxed">{service.who}</p>
                    </div>
                    <div className="mt-6">
                      <h4 className="font-bold">Examples of what we could create</h4>
                      <ul className="mt-3 space-y-3">
                        {service.examples.map((example) => (
                          <li key={example} className="flex min-w-0 items-start gap-2.5 text-sm leading-relaxed">
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                            <span className="min-w-0">{example}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="mt-6 border-t border-border pt-5">
                      <p className="text-sm leading-relaxed text-muted-foreground"><strong className="text-foreground">The benefit:</strong> {service.outcome}</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {service.keywords.map((keyword) => (
                          <span key={keyword} className="rounded-full bg-primary/5 px-3 py-1 text-xs font-medium text-primary">{keyword}</span>
                        ))}
                      </div>
                      <a href={`${WHATSAPP}?text=${encodeURIComponent(`Hello Chenar, I would like to ask about ${service.title}. I am interested in discussing: `)}`}
                        target="_blank" rel="noopener noreferrer"
                        className="mt-6 inline-flex max-w-full items-center gap-2 rounded-lg bg-primary px-4 py-3 font-bold text-primary-foreground transition hover:opacity-90">
                        Ask about {service.title} <ArrowRight className="h-4 w-4 shrink-0" />
                      </a>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="container mx-auto w-full min-w-0 max-w-6xl px-4 py-14 sm:px-6 md:py-20">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">Start with what you know</p>
            <h2 className="mt-3 text-3xl font-extrabold md:text-4xl">You do not need to know the technical name for what you need.</h2>
            <p className="mt-5 leading-relaxed text-muted-foreground">
              Maybe you are tired of answering the same questions. Maybe your business needs
              a website. Maybe you have an idea for an app or an ebook but are unsure how to begin.
              That is enough to start a conversation.
            </p>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Tell us what you want to happen and what is getting in the way. We will discuss
              suitable options in everyday language, including what is practical and what it may involve.
            </p>
          </div>
          <div className="rounded-3xl border border-border bg-primary/5 p-6 sm:p-8">
            <h3 className="text-xl font-bold">You could simply tell us:</h3>
            <ul className="mt-5 space-y-4">
              {[
                "I keep doing the same tasks every day. Can some of them be automated?",
                "Customers ask me the same questions. Can a chatbot help?",
                "I need a website that explains my business clearly.",
                "I have an app idea but do not know how to turn it into a real product.",
                "My business apps are separate. Can they share information?",
                "I have knowledge I want to turn into an ebook or useful digital product."
              ].map((item) => (
                <li key={item} className="flex min-w-0 items-start gap-3 text-sm leading-relaxed">
                  <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm font-semibold">You explain it your way. We help you work out a practical next step.</p>
          </div>
        </div>
      </section>

      <section className="bg-muted/40 py-14 md:py-20">
        <div className="container mx-auto w-full min-w-0 max-w-5xl px-4 sm:px-6">
          <div className="mb-10 text-center">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">A clear process</p>
            <h2 className="mt-3 text-3xl font-extrabold md:text-4xl">How working with Chenar starts</h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["1", "Tell us your goal", "Explain the problem or idea in your own words."],
              ["2", "We understand the need", "We ask questions and discuss what would be useful."],
              ["3", "Agree on the scope", "We explain the proposed work, timeline and cost before starting."],
              ["4", "Build and review", "We work on the agreed solution and review the result with you."]
            ].map(([number, title, desc]) => (
              <div key={number} className="rounded-2xl border border-border bg-card p-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-lg font-extrabold text-primary-foreground">{number}</span>
                <h3 className="mt-5 font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto w-full min-w-0 max-w-4xl px-4 py-14 sm:px-6 md:py-20">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">Good to know</p>
          <h2 className="mt-3 text-3xl font-extrabold md:text-4xl">Frequently asked questions</h2>
        </div>
        <div className="mt-9 divide-y divide-border rounded-2xl border border-border bg-card px-5 sm:px-6">
          {faqs.map(({ q, a }) => (
            <details key={q} className="group py-5">
              <summary className="cursor-pointer list-none pr-2 font-bold marker:hidden">
                <span className="inline-flex items-start gap-3"><span className="text-primary">+</span><span>{q}</span></span>
              </summary>
              <p className="mt-3 pl-6 leading-relaxed text-muted-foreground">{a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="container mx-auto w-full min-w-0 max-w-6xl px-4 pb-8 sm:px-6">
        <div className="overflow-hidden rounded-3xl bg-slate-950 px-5 py-12 text-center text-white sm:px-8 md:px-12 md:py-16">
          <div className="mx-auto max-w-3xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
              <Sparkles className="h-7 w-7 text-white" />
            </div>
            <h2 className="mt-6 text-3xl font-extrabold md:text-5xl">Tell us what you want to make easier.</h2>
            <p className="mx-auto mt-5 max-w-2xl leading-relaxed text-white/75">
              You do not need a perfect plan. Tell us what you are trying to achieve,
              and we can discuss whether one of these services is a good fit.
            </p>
            <div className="mt-8 flex min-w-0 flex-col justify-center gap-3 sm:flex-row">
              <a href={WHATSAPP} target="_blank" rel="noopener noreferrer"
                className="inline-flex w-full min-w-0 flex-wrap items-center justify-center gap-2 whitespace-normal break-words rounded-xl bg-primary px-4 py-4 text-center font-bold text-primary-foreground hover:opacity-90 sm:w-auto sm:px-6">
                <MessageCircle className="h-5 w-5 shrink-0" /> WhatsApp: +234 704 611 8938
              </a>
              <a href={EMAIL}
                className="inline-flex w-full min-w-0 items-center justify-center gap-2 whitespace-normal break-words rounded-xl border border-white/30 px-4 py-4 text-center font-semibold text-white hover:bg-white/10 sm:w-auto sm:px-6">
                <Mail className="h-5 w-5 shrink-0" /> Send an email
              </a>
            </div>
            <p className="mt-5 break-all text-sm text-white/60">chinecheremjoseph39@gmail.com</p>
          </div>
        </div>
      </section>
    </div>
  );
}
