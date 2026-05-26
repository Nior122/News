import React from "react";
import { useListTickerHeadlines } from "@workspace/api-client-react";
import { Link } from "wouter";

export function BreakingTicker() {
  const { data: headlines, isLoading } = useListTickerHeadlines();

  if (isLoading || !headlines || headlines.length === 0) return null;

  return (
    <div className="bg-primary/10 border-b border-primary/20 flex items-center h-10 overflow-hidden">
      <div className="bg-primary text-primary-foreground font-semibold px-4 h-full flex items-center shrink-0 z-10 text-sm">
        Trending Now 🔥
      </div>
      <div className="ticker-wrap w-full">
        <div className="ticker-content flex gap-8 px-4 items-center">
          {headlines.map((item) => (
            <Link
              key={item.id}
              href={`/article/${item.slug}`}
              className="text-sm font-medium hover:text-primary transition-colors whitespace-nowrap"
            >
              {item.title}
            </Link>
          ))}
          {/* Duplicate for seamless scrolling */}
          {headlines.map((item) => (
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