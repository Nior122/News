import React, { useState, useEffect, useMemo } from "react";
import { Link } from "wouter";
import { Article } from "@workspace/api-client-react";
import { CategoryBadge } from "@/components/ArticleCard";
import { Skeleton } from "@/components/ui/skeleton";
import { prefetchArticle } from "@/lib/prefetch";

interface HeroSectionProps {
  articles: Article[];
  isLoading: boolean;
}

function pickRandom(arr: Article[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function HeroSection({ articles, isLoading }: HeroSectionProps) {
  const recentArticles = useMemo(
    () =>
      [...articles]
        .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
        .slice(0, 5),
    [articles],
  );

  const [current, setCurrent] = useState<Article | null>(() => recentArticles[0] ?? null);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (recentArticles.length > 0 && !current) {
      setCurrent(recentArticles[0]);
    }
  }, [recentArticles, current]);

  useEffect(() => {
    if (recentArticles.length < 2) return;
    const id = setInterval(() => {
      if (document.hidden) return;
      setFading(true);
      setTimeout(() => {
        setCurrent(pickRandom(recentArticles));
        setFading(false);
      }, 500);
    }, 10000);
    return () => clearInterval(id);
  }, [recentArticles]);

  const active = current ?? recentArticles[0] ?? null;

  if (isLoading && !active) {
    return (
      <div className="container max-w-screen-2xl px-4 md:px-8 mt-6">
        <Skeleton className="w-full rounded-2xl" style={{ aspectRatio: "16/7", minHeight: 320 }} />
      </div>
    );
  }

  if (!active) return null;

  const handlePrefetch = () => prefetchArticle(active.slug);

  return (
    <div className="container max-w-screen-2xl px-4 md:px-8 mt-4 md:mt-6">
      <div
        onMouseEnter={handlePrefetch}
        onTouchStart={handlePrefetch}
        className="group relative flex w-full overflow-hidden rounded-2xl"
        style={{
          aspectRatio: "16/7",
          minHeight: 280,
          maxHeight: 600,
          opacity: fading ? 0 : 1,
          transition: "opacity 0.5s ease",
        }}
      >
        {/* Invisible overlay for mouse/touch click coverage — aria-hidden so only title link is announced */}
        <Link
          href={`/article/${active.slug}`}
          className="absolute inset-0 z-0"
          aria-hidden="true"
          tabIndex={-1}
        />
        <img
          src={active.imageUrl}
          alt={active.title}
          width={1600}
          height={700}
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent pointer-events-none" />
        <div className="relative z-10 mt-auto p-5 md:p-10 w-full md:w-3/4">
          <div className="pointer-events-auto w-fit mb-3">
            <CategoryBadge
              category={active.category}
              className="bg-primary text-primary-foreground border-none"
            />
          </div>
          <h1 className="font-display text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-3 md:mb-4">
            <Link
              href={`/article/${active.slug}`}
              onFocus={handlePrefetch}
              className="relative z-10 group-hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
            >
              {active.title}
            </Link>
          </h1>
          <p className="hidden sm:block text-white/80 text-base md:text-xl line-clamp-2 mb-5 max-w-2xl pointer-events-none">
            {active.excerpt}
          </p>
          <div className="flex items-center text-sm text-white/70 font-medium gap-0 pointer-events-none">
            <span className="text-white font-semibold">{active.author.name}</span>
            <span className="mx-3 text-white/40">•</span>
            <span>{active.readTime} min read</span>
          </div>
        </div>
      </div>
    </div>
  );
}
