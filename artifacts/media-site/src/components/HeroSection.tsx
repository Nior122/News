import React, { useState, useEffect } from "react";
import { Link } from "wouter";
import { Article } from "@workspace/api-client-react";
import { CategoryBadge } from "@/components/ArticleCard";
import { Skeleton } from "@/components/ui/skeleton";

interface HeroSectionProps {
  articles: Article[];
  isLoading: boolean;
}

export function HeroSection({ articles, isLoading }: HeroSectionProps) {
  const [current, setCurrent] = useState<Article | null>(null);
  const [fading, setFading] = useState(false);

  function pickRandom(arr: Article[]) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  useEffect(() => {
    if (articles.length > 0) setCurrent(pickRandom(articles));
  }, [articles.length]);

  useEffect(() => {
    if (articles.length === 0) return;
    const id = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setCurrent(pickRandom(articles));
        setFading(false);
      }, 500);
    }, 10000);
    return () => clearInterval(id);
  }, [articles]);

  if (isLoading || !current) {
    return (
      <div className="container max-w-screen-2xl px-4 md:px-8 mt-6">
        <Skeleton className="w-full rounded-2xl" style={{ aspectRatio: "16/7", minHeight: 320 }} />
      </div>
    );
  }

  return (
    <div className="container max-w-screen-2xl px-4 md:px-8 mt-4 md:mt-6">
      <div
        className="group relative flex w-full overflow-hidden rounded-2xl"
        style={{
          aspectRatio: "16/7",
          minHeight: 280,
          maxHeight: 600,
          opacity: fading ? 0 : 1,
          transition: "opacity 0.5s ease",
        }}
      >
        <Link
          href={`/article/${current.slug}`}
          className="absolute inset-0 z-0"
          aria-label={current.title}
        />
        <img
          src={current.imageUrl}
          alt={current.title}
          width={1600}
          height={700}
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent pointer-events-none" />
        <div className="relative z-10 mt-auto p-5 md:p-10 w-full md:w-3/4 pointer-events-none">
          <div className="pointer-events-auto w-fit mb-3">
            <CategoryBadge
              category={current.category}
              className="bg-primary text-primary-foreground border-none"
            />
          </div>
          <h1 className="font-display text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-3 md:mb-4 group-hover:text-primary transition-colors pointer-events-none">
            {current.title}
          </h1>
          <p className="hidden sm:block text-white/80 text-base md:text-xl line-clamp-2 mb-5 max-w-2xl pointer-events-none">
            {current.excerpt}
          </p>
          <div className="flex items-center text-sm text-white/70 font-medium gap-0 pointer-events-none">
            <span className="text-white font-semibold">{current.author.name}</span>
            <span className="mx-3 text-white/40">•</span>
            <span>{current.readTime} min read</span>
          </div>
        </div>
      </div>
    </div>
  );
}
