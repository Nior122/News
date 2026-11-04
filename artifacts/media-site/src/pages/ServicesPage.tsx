import React, { useEffect } from "react";
import { Link } from "wouter";
import {
  ArrowRight, Bot, Code2, Globe2, Lightbulb, MessageCircle,
  Palette, Workflow, BookOpen, Sparkles, CheckCircle2, Mail,
} from "lucide-react";
import { usePageMeta } from "@/hooks/usePageMeta";

const WHATSAPP = "https://wa.me/2347046118938";
const EMAIL = "mailto:chinecheremjoseph39@gmail.com";

const serviceGroups = [
  {
    number: "01",
    title: "AI & Technology",
    subtitle: "Make everyday work easier.",
    description:
      "Imagine having a helpful assistant that answers common customer questions, or a system that takes care of repeated computer tasks while you focus on running your business. We build practical digital tools that help make this possible.",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=82",
    imageAlt: "Business professional using a laptop to manage digital work",
    icon: Bot,
    services: [
      ["AI automation", "Set up systems that handle repeated tasks such as sorting enquiries, sending reminders and moving information between tools."],
      ["AI chatbots", "Give customers a digital assistant that can answer common questions and guide them to the information they need."],
      ["AI agents", "Build computer assistants that can use approved tools to research, organise information and carry out clearly defined tasks."],
      ["Website development", "Create a professional online home where people can learn about your business, see what you offer and contact you."],
      ["AI app development", "Turn a useful application idea into a working digital product, including apps that use artificial intelligence."],
      ["Custom software", "Build software around the way your business works when ready-made tools do not meet your needs."],
      ["API and database integration", "Connect compatible applications and organise information so different systems can work together."],
      ["Workflow automation", "Connect tools such as n8n and Make to reduce repeated copying, messaging and manual steps."],
    ],
  },
  {
    number: "02",
    title: "Creative & Media",
    subtitle: "Make your business easier to notice and remember.",
    description:
      "People often meet your business through a picture, a video, a website or a social media post before they ever speak to you. We help you present your ideas clearly with thoughtful design and digital content.",
    image:
      "https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=1200&q=82",
    imageAlt: "Creative workspace with visual design materials",
    icon: Palette,
    services: [
      ["Website design", "Design attractive, easy-to-use pages that help visitors understand your business and find their way around."],
      ["UI/UX design", "Make websites and applications easier to understand and more comfortable to use."],
      ["Brand identity design", "Create a consistent visual look that helps people recognise your business."],
      ["AI image generation", "Create visual material for advertisements, websites, presentations and creative projects."],
      ["AI video content", "Develop video content with AI-powered tools for promotions, social media and other digital projects."],
      ["Social media content", "Prepare useful written and visual content that helps your business communicate with its audience."],
    ],
  },
  {
    number: "03",
    title: "Digital Products & Education",
    subtitle: "Turn what you know into something useful.",
    description:
      "You may have a book inside your head, a skill worth teaching or an idea for a digital product. We help organise that knowledge and turn it into material people can read, use or learn from.",
    image:
      "https://images.unsplash.com/photo-1455390582262-044c394e0648?auto=format&fit=crop&w=1200&q=82",
    imageAlt: "Notebook and writing tools on a desk",
    icon: BookOpen,
    services: [
      ["Ebook creation", "Turn your ideas, notes or knowledge into a well-organised digital book."],
      ["Digital product development", "Develop downloadable resources and other digital products around a useful idea."],
      ["Educational content", "Prepare guides, tutorials and learning materials that explain a subject in clear steps."],
      ["AI training and tutorials", "Learn what AI tools can do and how to use them for practical everyday tasks."],
      ["Prompt engineering", "Create clear instructions that help AI tools understand what you want and produce more useful results."],
    ],
  },
];

const faqs = [
  {
    q: "Do I need to understand technology before contacting Chenar?",
    a: "No. You can explain what you want in everyday language. You do not need to know technical terms or how the tools work.",
  },
  {
    q: "Can Chenar help a small business?",
    a: "Yes. We can discuss practical options such as a business website, a customer chatbot or a system that reduces repeated tasks. The right option depends on your needs and budget.",
  },
  {
    q: "Can you build a website, app or software for my idea?",
    a: "Yes. We offer website development, AI app development and custom software development. We will first discuss what you want the product to do and what is practical to build.",
  },
  {
    q: "What is the difference between a chatbot and an AI agent?",
    a: "A chatbot mainly talks with people and answers questions. An AI agent can also be connected to approved tools to carry out specific tasks, such as organising information or following a work process.",
  },
  {
    q: "How much do your services cost?",
    a: "The cost depends on what you need and how much work is involved. Contact us with your idea so we can understand the project and discuss the scope and price before work begins.",
  },
  {
    q: "How do I get started?",
    a: "Send us a WhatsApp message or email. Tell us what you are trying to achieve, even if you are not sure what the solution is called.",
  },
];

export default function ServicesPage() {
  usePageMeta({
    title: "AI Automation, Website & Digital Services",
    exactTitle: true,
    description:
      "Chenar helps businesses, entrepreneurs and creators with AI automation, chatbots, AI agents, website and app development, creative media and digital products.",
    ogTitle: "Chenar — Practical AI, Technology & Digital Services",
    ogDescription:
      "Make work easier and bring your ideas to life with practical AI automation, websites, apps, creative media and digital products from Chenar.",
    ogImage:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=85",
    ogImageWidth: 1200,
    ogImageHeight: 630,
    ogImageAlt: "Laptop displaying a digital workspace",
  });

  useEffect(() => {
    const id = "chenar-services-faq-jsonld";
    const existing = document.getElementById(id);
    existing?.remove();
    const script = document.createElement("script");
    script.id = id;
    script.type = "application/ld+json";
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map(({ q, a }) => ({
        "@type": "Question",
        name: q,
        acceptedAnswer: { "@type": "Answer", text: a },
      })),
    });
    document.head.appendChild(script);
    return () => script.remove();
  }, []);

  return (
    <div className="min-h-screen pb-16">
      <section className="relative isolate overflow-hidden border-b border-border bg-slate-950 text-white">
        <img
          src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=2000&q=85"
          alt="A laptop and digital workspace representing technology that helps people work"
          className="absolute inset-0 -z-20 h-full w-full object-cover opacity-35"
          fetchPriority="high"
          width="2000"
          height="1200"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-900/55" />
        <div className="container mx-auto max-w-6xl px-4 py-20 md:py-28">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white/90">
            <Sparkles className="h-4 w-4" /> Practical digital solutions by Chenar
          </p>
          <h1 className="max-w-4xl text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
            What if some of the hard work in your business could be handled for you?
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/80 md:text-xl">
            From websites and AI assistants to creative content and digital products,
            Chenar helps you use technology without needing to understand all the
            complicated parts.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a href={WHATSAPP} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 font-bold text-primary-foreground shadow-lg transition hover:opacity-90">
              <MessageCircle className="h-5 w-5" /> Talk to us on WhatsApp <ArrowRight className="h-4 w-4" />
            </a>
            <a href="#our-services"
              className="inline-flex items-center justify-center rounded-xl border border-white/30 px-6 py-4 font-semibold text-white transition hover:bg-white/10">
              Explore our services
            </a>
          </div>
          <p className="mt-5 text-sm text-white/60">No technical knowledge needed. Start by telling us what you want to achieve.</p>
        </div>
      </section>

      <section className="container mx-auto max-w-4xl px-4 py-16 md:py-20">
        <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-display">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">A simpler way to get things done</p>
          <h2 className="text-3xl font-bold md:text-4xl">You have a business to run. You should not have to do every little thing by hand.</h2>
          <p>
            Picture a shop owner who spends the morning answering the same questions,
            writing down orders, sending reminders and trying to keep customer details
            in order. By the time the day ends, there is little time left to think about
            growing the business.
          </p>
          <p>
            Now imagine having a website that explains the business at any time, a
            chatbot that answers common questions, and simple systems that take care
            of some repeated jobs. The owner can spend more time serving customers and
            making important decisions.
          </p>
          <p>
            That is the kind of practical improvement technology can make. <strong>Chenar
            helps you choose and build digital solutions around the problem you want
            to solve</strong> — and we explain the process in plain language.
          </p>
        </div>
      </section>

      <section id="our-services" className="scroll-mt-24 bg-muted/40 py-16 md:py-20">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">What we can help with</p>
            <h2 className="mt-3 text-3xl font-extrabold md:text-5xl">Three ways Chenar can help</h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              Whether you want to save time, improve how your business looks online,
              or turn an idea into a digital product, start with the area that fits your need.
            </p>
          </div>

          <div className="space-y-10">
            {serviceGroups.map((group, index) => {
              const Icon = group.icon;
              return (
                <article key={group.number} className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
                  <div className="grid md:grid-cols-2">
                    <div className={index % 2 === 1 ? "md:order-2" : ""}>
                      <img src={group.image} alt={group.imageAlt} loading="lazy" width="1200" height="800"
                        className="h-64 w-full object-cover md:h-full md:min-h-[430px]" />
                    </div>
                    <div className="p-6 md:p-10">
                      <div className="mb-5 flex items-center gap-3">
                        <span className="rounded-lg bg-primary/10 px-3 py-2 text-sm font-bold text-primary">{group.number}</span>
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="text-2xl font-extrabold md:text-3xl">{group.title}</h3>
                      <p className="mt-2 text-lg font-semibold text-primary">{group.subtitle}</p>
                      <p className="mt-4 leading-relaxed text-muted-foreground">{group.description}</p>
                      <div className="mt-7 space-y-5">
                        {group.services.map(([name, description]) => (
                          <div key={name} className="flex gap-3">
                            <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-primary" />
                            <div>
                              <h4 className="font-bold">{name}</h4>
                              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <a href={WHATSAPP} target="_blank" rel="noopener noreferrer"
                        className="mt-8 inline-flex items-center gap-2 font-bold text-primary hover:underline">
                        Ask us about this area <ArrowRight className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="container mx-auto max-w-6xl px-4 py-16 md:py-20">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">Made for real people</p>
            <h2 className="mt-3 text-3xl font-extrabold md:text-4xl">You do not need to speak the language of technology.</h2>
            <p className="mt-5 leading-relaxed text-muted-foreground">
              You do not need to know how to build a website before asking for one.
              You do not need to understand how AI works before asking for a digital
              assistant. And you do not need to know how computer systems connect
              before asking us to help connect them.
            </p>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Just tell us what is difficult, what you want to improve, or what idea
              you have in mind. We will talk through the options with you.
            </p>
          </div>
          <div className="rounded-3xl border border-border bg-primary/5 p-7 md:p-9">
            <h3 className="text-xl font-bold">You can start with a simple message:</h3>
            <ul className="mt-5 space-y-4">
              {[
                "I want people to find my business online.",
                "I receive too many customer messages and need help.",
                "I want to stop repeating the same computer tasks.",
                "I have an idea for an app but do not know where to begin.",
                "I want to turn my knowledge into an ebook.",
              ].map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-relaxed">
                  <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {item}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm font-semibold">You explain it your way. We help you find a practical next step.</p>
          </div>
        </div>
      </section>

      <section className="bg-muted/40 py-16 md:py-20">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="mb-10 text-center">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">Getting started</p>
            <h2 className="mt-3 text-3xl font-extrabold md:text-4xl">Working with Chenar is straightforward</h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["1", "Tell us what you need", "Explain the problem or idea in your own words."],
              ["2", "We discuss the options", "We ask questions and understand what you want to achieve."],
              ["3", "Agree on the plan", "We explain the work, delivery expectations and cost before starting."],
              ["4", "We build the solution", "Once everything is agreed, we get to work on the project."],
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

      <section className="container mx-auto max-w-4xl px-4 py-16 md:py-20">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">Questions people ask</p>
          <h2 className="mt-3 text-3xl font-extrabold md:text-4xl">Frequently asked questions</h2>
        </div>
        <div className="mt-9 divide-y divide-border rounded-2xl border border-border bg-card px-6">
          {faqs.map(({ q, a }) => (
            <details key={q} className="group py-5">
              <summary className="cursor-pointer list-none pr-8 font-bold marker:hidden">
                <span className="inline-flex items-start gap-3"><span className="text-primary">+</span>{q}</span>
              </summary>
              <p className="mt-3 pl-6 leading-relaxed text-muted-foreground">{a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="container mx-auto max-w-6xl px-4 pb-8">
        <div className="overflow-hidden rounded-3xl bg-slate-950 px-6 py-12 text-center text-white md:px-12 md:py-16">
          <div className="mx-auto max-w-3xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
              <Lightbulb className="h-7 w-7 text-white" />
            </div>
            <h2 className="mt-6 text-3xl font-extrabold md:text-5xl">Have an idea or a problem you want to solve?</h2>
            <p className="mx-auto mt-5 max-w-2xl leading-relaxed text-white/75">
              You do not need to have all the answers before reaching out. Tell us
              what you want to achieve and let's discuss a practical way to make it happen.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <a href={WHATSAPP} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 font-bold text-primary-foreground hover:opacity-90">
                <MessageCircle className="h-5 w-5" /> WhatsApp: +234 704 611 8938
              </a>
              <a href={EMAIL}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 px-6 py-4 font-semibold text-white hover:bg-white/10">
                <Mail className="h-5 w-5" /> Send an email
              </a>
            </div>
            <p className="mt-5 text-sm text-white/60">chinecheremjoseph39@gmail.com</p>
          </div>
        </div>
      </section>
    </div>
  );
}
