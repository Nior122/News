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
    tagline: "Let technology handle the repetitive work.",
    intro: "If you spend too much time doing the same computer tasks every day, some of that work may be handled automatically. We create practical systems that use AI where it is useful, so you can spend more time serving customers and running your business.",
    who: "Businesses that repeat the same tasks, handle lots of enquiries, or move information between different tools.",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=82",
    alt: "Person working on a laptop in a modern workspace",
    icon: BrainCircuit,
    examples: [
      "Automatically sort new customer enquiries and send them to the right person.",
      "Read information from incoming forms or messages and organise it in a spreadsheet or database.",
      "Send appointment reminders, follow-up messages and task notifications.",
      "Prepare regular business summaries from information collected during the week.",
      "Organise new leads so that no enquiry is easily forgotten.",
      "Use AI to classify messages, summarise documents or draft replies for approval."
    ],
    outcome: "Less manual copying, fewer forgotten follow-ups and more time for work that needs a human touch.",
    keywords: ["Task automation", "AI-assisted processes", "Business productivity"]
  },
  {
    id: "ai-chatbots",
    number: "02",
    title: "AI Chatbot Development",
    tagline: "Give customers helpful answers, even when you are busy.",
    intro: "An AI chatbot is a digital assistant people can talk to on your website or another supported channel. It can answer common questions using information you provide, guide visitors and collect details when a person needs to follow up.",
    who: "Businesses that receive repeated customer questions, enquiries, booking requests or product questions.",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=82",
    alt: "Team discussing customer communication around a laptop",
    icon: Headphones,
    examples: [
      "A website assistant that explains your services, opening hours and contact details.",
      "A product assistant that helps shoppers understand product features and options.",
      "A booking assistant that asks for a preferred date and collects the details your team needs.",
      "A support bot that answers questions about delivery, returns or how to use a service.",
      "A lead-capture assistant that asks what a visitor needs and passes the enquiry to your team.",
      "A school or training-centre assistant that answers questions about courses, fees and registration steps."
    ],
    outcome: "Customers can find basic information faster, while your team can focus on questions that need personal attention.",
    keywords: ["Website chatbot", "Customer support", "Enquiry assistant"]
  },
  {
    id: "ai-agents",
    number: "03",
    title: "AI Agent Development",
    tagline: "Move beyond answering questions to getting tasks done.",
    intro: "An AI agent is a digital assistant that can work through a defined task using tools you allow it to use. Unlike a basic chatbot, it may search approved information, organise results, update connected systems or prepare an action for a person to approve.",
    who: "Businesses that want help with multi-step digital tasks, research, information handling or internal processes.",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=82",
    alt: "Abstract artificial intelligence technology visual",
    icon: Bot,
    examples: [
      "A research assistant that gathers information from approved sources and prepares a summary.",
      "A sales assistant that reviews new enquiries, organises them and suggests the next follow-up.",
      "A document assistant that reads supplied files and finds answers from their contents.",
      "An operations assistant that checks a task list and prepares updates for a manager.",
      "A content assistant that turns an approved brief into draft captions, outlines or email responses.",
      "A support assistant that checks a knowledge base and prepares a reply for a staff member to review."
    ],
    outcome: "A carefully defined assistant can handle several connected steps, while important decisions and sensitive actions remain under human control.",
    keywords: ["AI assistants", "Task execution", "Human approval"]
  },
  {
    id: "website-development",
    number: "04",
    title: "Website Development",
    tagline: "Give your business a professional home on the internet.",
    intro: "A website helps people understand who you are, what you offer and how to reach you. We build websites around your purpose, with clear pages, mobile-friendly layouts and simple ways for visitors to take the next step.",
    who: "Businesses, professionals, organisations and creators who need a website or want to improve an existing one.",
    image: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&w=1200&q=82",
    alt: "Website layout displayed on a desktop computer",
    icon: Globe,
    examples: [
      "A business website with Home, About, Services, FAQs and Contact pages.",
      "A portfolio website where a designer, developer, photographer or professional can show their work.",
      "A landing page for one product, service, event or campaign.",
      "A restaurant, salon or local-service website with menus, service details and enquiry links.",
      "A blog or information website for publishing articles and useful resources.",
      "A product or online-store website, where the required catalogue and checkout features are agreed in advance."
    ],
    outcome: "A clear online presence that helps visitors learn about your business and contact you from their phone or computer.",
    keywords: ["Business websites", "Landing pages", "Portfolio websites"]
  },
  {
    id: "ai-app-development",
    number: "05",
    title: "AI App Development",
    tagline: "Turn a useful idea into an application people can use.",
    intro: "Have an idea for an app that uses artificial intelligence? We can help shape the idea and develop an application around a real problem. It could help people work with information, make a process easier or use an AI feature in one convenient place.",
    who: "Entrepreneurs, businesses and creators with an app idea or a process that would benefit from a custom digital tool.",
    image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=1200&q=82",
    alt: "Mobile application screens displayed on a smartphone",
    icon: Smartphone,
    examples: [
      "A document assistant that summarises uploaded files and answers questions about them.",
      "A writing helper that turns notes into organised drafts.",
      "A customer-facing app that recommends suitable products or services based on user choices.",
      "An internal business tool that helps staff search information or complete a defined process.",
      "A learning app that explains topics, creates practice questions or gives feedback.",
      "A simple AI-powered tool that solves one specific problem for a particular audience."
    ],
    outcome: "An application designed around the job it needs to do, rather than adding AI just because it sounds impressive.",
    keywords: ["Custom AI apps", "AI-powered tools", "Application development"]
  },
  {
    id: "workflow-automation",
    number: "06",
    title: "Workflow Automation",
    tagline: "Make the apps you already use work together.",
    intro: "A workflow is simply a series of steps people follow to get something done. Workflow automation connects those steps so information can move between your tools without someone having to repeat every action by hand. We work with platforms such as n8n and Make.com.",
    who: "Businesses that use several apps and regularly copy information, send updates or repeat the same sequence of actions.",
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1200&q=82",
    alt: "Team collaborating on a digital workflow",
    icon: Workflow,
    examples: [
      "When someone fills in a form, add their details to a customer list and notify the right person.",
      "When an order is received, send an acknowledgement and create a fulfilment task.",
      "When a new lead arrives, record it, assign it and schedule a follow-up reminder.",
      "When a customer books an appointment, add it to a calendar and send a confirmation.",
      "When a new article is approved, prepare the content for the agreed publishing channels.",
      "Connect email, spreadsheets, forms, calendars, databases and messaging tools into one process."
    ],
    outcome: "Fewer repetitive steps and a more consistent process from the moment information comes in to the moment the task is complete.",
    keywords: ["n8n automation", "Make.com integrations", "Connected workflows"]
  },
  {
    id: "api-integration",
    number: "07",
    title: "API Integration",
    tagline: "Connect software that does not talk to each other by itself.",
    intro: "Sometimes two apps need to share information, but they do not have a ready-made connection. An API is a supported way for software to exchange information. We help connect compatible platforms so the right data can move between them.",
    who: "Businesses using separate tools for payments, forms, customer records, websites, messaging or internal operations.",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=82",
    alt: "Server and network equipment representing connected software systems",
    icon: Plug,
    examples: [
      "Connect a website enquiry form to a customer database or CRM.",
      "Send payment confirmation information from a supported payment provider to an order system.",
      "Connect a booking platform to a calendar or notification service.",
      "Pass approved customer or product information between two business applications.",
      "Connect an AI service to a website or internal tool so it can perform a specific feature.",
      "Create a connection that retrieves information from one platform and displays it in another."
    ],
    outcome: "Less duplicate data entry and fewer disconnected systems, provided the platforms offer the access and permissions needed.",
    keywords: ["Software connections", "API development", "Data exchange"]
  },
  {
    id: "ui-ux-design",
    number: "08",
    title: "UI/UX Design",
    tagline: "Make your website or app easier and more pleasant to use.",
    intro: "UI means the screens and visual elements people interact with. UX means the overall experience of using them. Good design makes it easier for people to understand where to go, what to do and how to complete a task.",
    who: "Businesses building a website or app, or improving a digital product that feels confusing or difficult to use.",
    image: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?auto=format&fit=crop&w=1200&q=82",
    alt: "Digital interface and user experience design displayed on a screen",
    icon: PanelsTopLeft,
    examples: [
      "Plan the screens and user journey for a new mobile or web application.",
      "Redesign a confusing website menu so visitors can find important information.",
      "Create a clean dashboard for staff to view information and complete common tasks.",
      "Design sign-up, login, booking or checkout screens that are easier to follow.",
      "Create wireframes, which are simple layouts showing where content and buttons will go.",
      "Prepare a consistent visual system for buttons, forms, headings, colours and spacing."
    ],
    outcome: "A more understandable experience that helps people complete the task they came to do.",
    keywords: ["Interface design", "User experience", "Wireframes and prototypes"]
  },
  {
    id: "ai-content-creation",
    number: "09",
    title: "AI Content Creation",
    tagline: "Create useful content without starting from a blank page.",
    intro: "Creating content takes time, especially when you need fresh ideas and material for different platforms. AI tools can help with drafts and creative production. We help turn your brief into content that is organised, relevant and reviewed before it is used.",
    who: "Creators, small businesses, professionals and organisations that need regular written or visual content.",
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=82",
    alt: "Creative team workspace with computers and content planning",
    icon: WandSparkles,
    examples: [
      "Social media captions and post ideas based on your business, audience and message.",
      "Blog article drafts, outlines and website content written for real readers.",
      "Product descriptions that explain features and benefits in everyday language.",
      "Short video scripts, talking points and promotional concepts.",
      "AI-assisted images and visual concepts for campaigns, presentations or online content.",
      "Email newsletters, announcements and frequently asked question drafts."
    ],
    outcome: "A more manageable content process, with human review to check accuracy, tone and suitability before publishing.",
    keywords: ["AI-assisted writing", "Social content", "Creative production"]
  },
  {
    id: "ebooks-digital-products",
    number: "10",
    title: "Ebook & Digital Product Development",
    tagline: "Turn your knowledge or idea into something people can download and use.",
    intro: "You may have useful knowledge, a teaching idea or a resource people keep asking you for. We help organise that information into a digital product that is clear, attractive and practical for its intended audience.",
    who: "Authors, educators, coaches, creators and businesses that want to package knowledge or useful resources into digital products.",
    image: "https://images.unsplash.com/photo-1455390582262-044c394e0648?auto=format&fit=crop&w=1200&q=82",
    alt: "Notebook and writing tools on a desk",
    icon: BookOpen,
    examples: [
      "An ebook that teaches beginners how to understand or complete a specific task.",
      "A practical PDF guide, checklist or step-by-step handbook.",
      "A workbook with exercises, reflection questions and space to write answers.",
      "Templates such as planners, business documents, content calendars or trackers.",
      "A set of downloadable learning resources for a class, workshop or training programme.",
      "A structured digital product bundle that combines guides, worksheets and templates."
    ],
    outcome: "A well-organised digital resource that is easier for your audience to read, follow and put into practice.",
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
