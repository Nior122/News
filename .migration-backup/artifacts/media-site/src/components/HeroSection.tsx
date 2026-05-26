import React from "react";
import { Link } from "wouter";
import { useGetFeaturedArticle } from "@workspace/api-client-react";
import { CategoryBadge } from "@/components/ArticleCard";
import { Skeleton } from "@/components/ui/skeleton";

export function HeroSection() {
  const { data: article, isLoading } = useGetFeaturedArticle();

  if (isLoading) {
    return (
      <div className="container max-w-screen-2xl px-4 md:px-8 mt-6">
        <Skeleton className="w-full rounded-2xl" style={{ aspectRatio: "16/7", minHeight: 320 }} />
      </div>
    );
  }

  if (!article) return null;

  return (
    <div className="container max-w-screen-2xl px-4 md:px-8 mt-4 md:mt-6">
      {/* Stretched-link pattern: div wraps the card, an invisible anchor
          covers the whole area, and CategoryBadge sits above it (z-10). */}
      <div
        className="group relative flex w-full overflow-hidden rounded-2xl"
        style={{ aspectRatio: "16/7", minHeight: 280, maxHeight: 600 }}
      >
        {/* Full-card article link */}
        <Link
          href={`/article/${article.slug}`}
          className="absolute inset-0 z-0"
          aria-label={article.title}
        />

        {/* Hero image — LCP element: fetchpriority high, no lazy */}
        <img
          src={article.imageUrl}
          alt={article.title}
          width={1600}
          height={700}
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent pointer-events-none" />

        <div className="relative z-10 mt-auto p-5 md:p-10 w-full md:w-3/4">
          {/* Category badge — real link above the stretched article overlay */}
          <CategoryBadge
            category={article.category}
            className="mb-3 bg-primary text-primary-foreground border-none"
          />
          <h1 className="font-display text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-3 md:mb-4 group-hover:text-primary transition-colors pointer-events-none">
            {article.title}
          </h1>
          <p className="hidden sm:block text-white/80 text-base md:text-xl line-clamp-2 mb-5 max-w-2xl pointer-events-none">
            {article.excerpt}
          </p>
          <div className="flex items-center text-sm text-white/70 font-medium gap-0 pointer-events-none">
            <span className="text-white font-semibold">{article.author.name}</span>
            <span className="mx-3 text-white/40">•</span>
            <span>{article.readTime} min read</span>
          </div>
        </div>
      </div>
    </div>
  );
}
