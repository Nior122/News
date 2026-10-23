import React, { useState, useEffect, useMemo } from "react";
import {
  useListTickerHeadlines,
  getListTickerHeadlinesQueryKey,
  type Article,
  type TickerItem,
} from "@workspace/api-client-react";
import { Link } from "wouter";
import { prefetchArticle } from "@/lib/prefetch";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function BreakingTicker({ articles }: { articles?: Article[] } = {}) {
  const hasProvidedArticles = Array.isArray(articles) && articles.length > 0;
  const { data: fetchedHeadlines, isLoading } = useListTickerHeadlines({
    query: {
      enabled: !hasProvidedArticles,
      queryKey: getListTickerHeadlinesQueryKey(),
    },
  });

  const baseHeadlines: TickerItem[] = useMemo(() => {
    if (hasProvidedArticles) {
      return articles.slice(0, 10).map((item) => ({
        id: item.id,
        slug: item.slug,
        title: item.title,
        category: item.category,
      }));
    }
    return fetchedHeadlines ?? [];
  }, [hasProvidedArticles, articles, fetchedHeadlines]);

  const [shuffled, setShuffled] = useState<TickerItem[]>(() =>
    baseHeadlines.length > 0 ? shuffle(baseHeadlines) : [],
  );

  useEffect(() => {
    if (baseHeadlines.length > 0) {
      setShuffled((prev) => (prev.length > 0 ? prev : shuffle(baseHeadlines)));
    }
  }, [baseHeadlines]);

  useEffect(() => {
    if (baseHeadlines.length < 2) return;
    const id = setInterval(() => {
      if (document.hidden) return;
      setShuffled(shuffle(baseHeadlines));
    }, 60000);
    return () => clearInterval(id);
  }, [baseHeadlines]);

  const items = shuffled.length > 0 ? shuffled : baseHeadlines;
  if ((!hasProvidedArticles && isLoading && items.length === 0) || items.length === 0) {
    return null;
  }

  return (
    <div className="bg-primary/10 border-b border-primary/20 flex items-center h-10 overflow-hidden">
      <div className="bg-primary text-primary-foreground font-semibold px-4 h-full flex items-center shrink-0 z-10 text-sm">
        Trending Now 🔥
      </div>
      <div className="ticker-wrap w-full">
        <div className="ticker-content flex gap-8 px-4 items-center">
          {items.map((item) => (
            <Link
              key={item.id}
              href={`/article/${item.slug}`}
              onMouseEnter={() => prefetchArticle(item.slug)}
              onTouchStart={() => prefetchArticle(item.slug)}
              className="text-sm font-medium hover:text-primary transition-colors whitespace-nowrap"
            >
              {item.title}
            </Link>
          ))}
          {items.map((item) => (
            <Link
              key={`dup-${item.id}`}
              href={`/article/${item.slug}`}
              onMouseEnter={() => prefetchArticle(item.slug)}
              onTouchStart={() => prefetchArticle(item.slug)}
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
