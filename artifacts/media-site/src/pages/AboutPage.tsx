import React from "react";

export default function AboutPage() {
  return (
    <div className="min-h-screen pb-16">
      <div className="bg-primary/5 py-20 border-b border-border">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <h1 className="font-display text-5xl md:text-7xl font-extrabold mb-6">
            About <span className="text-primary">PulseWire</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground font-medium">
            Where the internet's most curious minds come for fast, smart takes on tech, culture, and everything in between.
          </p>
        </div>
      </div>

      <div className="container max-w-3xl mx-auto px-4 mt-16 prose prose-lg dark:prose-invert prose-headings:font-display">
        <h2>Our Mission</h2>
        <p>
          PulseWire was built for people who live online. We don't just report the news; we try to understand what it means for the culture. From the latest AI models to viral TikTok trends, we connect the dots so you don't have to.
        </p>
        
        <h2>The Vibe</h2>
        <p>
          Dense with energy but never cluttered. We believe media should be fast, visual, and bold. Dark mode by default, electric accents, and stories that earn their place on your screen.
        </p>

        <h2>Our Team</h2>
        <div className="not-prose grid grid-cols-2 md:grid-cols-3 gap-6 my-8">
          {[
            { name: "Alex Chen", role: "Editor in Chief", img: "https://picsum.photos/seed/alex/200/200" },
            { name: "Sarah Jenkins", role: "Tech Lead", img: "https://picsum.photos/seed/sarah/200/200" },
            { name: "Marcus Torres", role: "Culture Writer", img: "https://picsum.photos/seed/marcus/200/200" },
            { name: "Elena Rostova", role: "AI Correspondent", img: "https://picsum.photos/seed/elena/200/200" },
            { name: "David Kim", role: "Productivity", img: "https://picsum.photos/seed/david/200/200" },
            { name: "Maya Patel", role: "Lifestyle", img: "https://picsum.photos/seed/maya/200/200" },
          ].map(person => (
            <div key={person.name} className="flex flex-col items-center text-center">
              <img src={person.img} alt={person.name} className="w-24 h-24 rounded-full object-cover mb-3 border-2 border-border" />
              <h3 className="font-bold">{person.name}</h3>
              <p className="text-sm text-muted-foreground">{person.role}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}