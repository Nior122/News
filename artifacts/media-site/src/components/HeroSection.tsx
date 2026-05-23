import React from "react";
import { Link } from "wouter";
import { useGetFeaturedArticle } from "@workspace/api-client-react";
import { CategoryBadge } from "@/components/ArticleCard";
import { Skeleton } from "@/components/ui/skeleton";

export function HeroSection() {
  const { data: article, isLoading } = useGetFeaturedArticle();

  if (isLoading) {
    return (
      <div className="w-full h-[60vh] min-h-[400px] relative mt-4 container px-4 md:px-8 max-w-screen-2xl">
        <Skeleton className="w-full h-full rounded-2xl" />
      </div>
    );
  }

  if (!article) return null;

  return (
    <div className="container max-w-screen-2xl px-4 md:px-8 mt-6">
      <Link href={`/article/${article.slug}`} className="group relative block w-full h-[60vh] min-h-[400px] max-h-[600px] rounded-2xl overflow-hidden">
        <img 
          src={article.imageUrl} 
          alt={article.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        
        <div className="absolute bottom-0 left-0 p-6 md:p-12 w-full md:w-3/4">
          <CategoryBadge category={article.category} className="mb-4 bg-primary text-primary-foreground border-none" />
          <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-4 group-hover:text-primary transition-colors">
            {article.title}
          </h2>
          <p className="text-white/80 text-lg md:text-xl line-clamp-2 mb-6 max-w-2xl">
            {article.excerpt}
          </p>
          <div className="flex items-center text-sm text-white/70 font-medium">
            <span className="text-white">{article.author.name}</span>
            <span className="mx-3">•</span>
            <span>{article.readTime} min read</span>
          </div>
        </div>
      </Link>
    </div>
  );
}