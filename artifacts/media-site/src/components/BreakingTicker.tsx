import React, { useState, useEffect } from "react";
import { useListTickerHeadlines } from "@workspace/api-client-react";
import { Link } from "wouter";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function BreakingTicker() {
  const { data: headlines, isLoading } = useListTickerHeadlines();
  const [shuffled, setShuffled] = useState<NonNullable<typeof headlines>>([]);

  useEffect(() => {
    if (headlines && headlines.length > 0) {
      setShuffled(shuffle(headlines));
    }
  }, [headlines]);

  useEffect(() => {
    if (!headlines || headlines.length === 0) return;
    const id = setInterval(() => {
      setShuffled(shuffle(headlines));
    }, 60000);
    return () => clearInterval(id);
  }, [headlines]);

  if (isLoading || !shuffled || shuffled.length === 0) return null;

  return (
    <div className="bg-primary/10 border-b border-primary/20 flex items-center h-10 overflow-hidden">
      <div className="bg-primary text-primary-foreground font-semibold px-4 h-full flex items-center shrink-0 z-10 text-sm">
        Trending Now 🔥
      </div>
      <div className="ticker-wrap w-full">
        <div className="ticker-content flex gap-8 px-4 items-center">
          {shuffled.map((item) => (
            <Link
              key={item.id}
              href={`/article/${item.slug}`}
              className="text-sm font-medium hover:text-primary transition-colors whitespace-nowrap"
            >
              {item.title}
            </Link>
          ))}
          {shuffled.map((item) => (
            <Link
              key={`dup-${item.id}`}
              href={`/article/${item.slug}`}
              className="text-sm font-medium hover:text-primary transition-colors whitespace-nowrap"
            >
              {item.title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
