import React from "react";
import { Link } from "wouter";
import { Zap, Globe, Lightbulb, Heart } from "lucide-react";

const PILLARS = [
  {
    icon: Zap,
    title: "Fast & Relevant",
    desc: "We cover what matters right now — no fluff, no filler. Just smart, timely content you can actually use.",
  },
  {
    icon: Globe,
    title: "Digitally Native",
    desc: "We live where you live — online. Our writers understand internet culture from the inside out.",
  },
  {
    icon: Lightbulb,
    title: "Genuinely Useful",
    desc: "Every article is written to leave you better informed, more capable, or simply more curious than before.",
  },
  {
    icon: Heart,
    title: "Built for Real People",
    desc: "No jargon walls. No gatekeeping. Scrolltek is for anyone who wants to stay ahead of the digital world.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen pb-16">
      {/* Hero */}
      <div className="bg-primary/5 py-20 border-b border-border">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <h1 className="font-display text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
            About <span className="text-primary">Scrolltek</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed">
            Your go-to source for tech, digital culture, lifestyle, AI tools, and the trends shaping how we live online.
          </p>
        </div>
      </div>

      <div className="container max-w-3xl mx-auto px-4 mt-16">

        {/* Mission */}
        <div className="prose prose-lg dark:prose-invert prose-headings:font-display mb-16">
          <h2>Our Mission</h2>
          <p>
            Scrolltek exists to make the digital world easier to navigate. We believe that technology, culture, and everyday life are more connected than ever — and we're here to cover all of it in a way that's honest, accessible, and genuinely worth your time.
          </p>
          <p>
            Whether you're trying to get more out of your phone, understand the latest AI tools, or just keep up with what's happening online, Scrolltek is the place to scroll. We cut through the noise and bring you content that's clear, current, and actually useful.
          </p>

          <h2>What We Cover</h2>
          <p>
            Scrolltek publishes articles across a range of topics that matter in today's connected world:
          </p>
          <ul>
            <li><strong>Technology</strong> — The gadgets, software, and platforms shaping the way we work and play.</li>
            <li><strong>AI Tools</strong> — Honest, practical breakdowns of artificial intelligence products you can use today.</li>
            <li><strong>Phone Tips</strong> — Hidden features, productivity hacks, and smarter ways to use the device in your pocket.</li>
            <li><strong>Digital Culture</strong> — Memes, movements, creators, and the stories that define life online.</li>
            <li><strong>Lifestyle</strong> — How technology intersects with how we work, rest, connect, and grow.</li>
            <li><strong>Trending</strong> — What everyone is talking about right now, with context that actually makes sense.</li>
          </ul>

          <h2>How We Work</h2>
          <p>
            Every piece of content on Scrolltek is written with one standard in mind: would a smart, curious person find this genuinely valuable? We don't chase clicks for the sake of it. We research, we verify, and we write in plain language that respects your time and intelligence.
          </p>
          <p>
            We're a small, focused team of writers and editors who care deeply about quality. We're also readers ourselves — which means we hold our own work to the same standard we'd expect from any publication we trust.
          </p>
        </div>

        {/* Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">
          {PILLARS.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="rounded-xl border border-border bg-card p-6 flex gap-4 items-start"
            >
              <div className="shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-base mb-1">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Closing */}
        <div className="rounded-2xl bg-primary/5 border border-border p-8 md:p-12 text-center mb-16">
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">
            Thanks for being here.
          </h2>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-xl mx-auto mb-6">
            Scrolltek is built for people who are curious about the world around them — especially the digital one. We're glad you found us, and we hope you stick around. There's always something worth reading.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
          >
            Start Reading
          </Link>
        </div>

      </div>
    </div>
  );
}
