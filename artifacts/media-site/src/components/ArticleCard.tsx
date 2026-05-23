import React from "react";
import { Link } from "wouter";
import { Article } from "@workspace/api-client-react/src/generated/api.schemas";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface ArticleCardProps {
  article: Article;
  layout?: "grid" | "horizontal" | "hero";
  className?: string;
}

export function CategoryBadge({ category, className }: { category: string; className?: string }) {
  const getCategoryColor = (cat: string) => {
    switch (cat.toLowerCase()) {
      case "tech": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "culture": return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case "lifestyle": return "bg-pink-500/10 text-pink-500 border-pink-500/20";
      case "ai tools": return "bg-cyan-500/10 text-cyan-500 border-cyan-500/20";
      case "phone tips": return "bg-green-500/10 text-green-500 border-green-500/20";
      case "productivity": return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "trending": return "bg-red-500/10 text-red-500 border-red-500/20";
      default: return "bg-primary/10 text-primary border-primary/20";
    }
  };

  return (
    <Badge variant="outline" className={cn(getCategoryColor(category), className)}>
      {category}
    </Badge>
  );
}

export function ArticleCard({ article, layout = "grid", className }: ArticleCardProps) {
  if (layout === "horizontal") {
    return (
      <Link
        href={`/article/${article.slug}`}
        className={cn(
          "group flex gap-4 items-start min-h-[44px] touch-manipulation",
          className,
        )}
      >
        {/* Fixed dimensions prevent CLS */}
        <div className="relative shrink-0 rounded-lg overflow-hidden bg-muted" style={{ width: 112, height: 84 }}>
          <img
            src={article.imageUrl}
            alt={article.title}
            width={112}
            height={84}
            loading="lazy"
            decoding="async"
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="flex flex-col flex-1 py-1 min-w-0">
          <CategoryBadge category={article.category} className="w-fit mb-2 text-xs" />
          <h3 className="font-display font-bold text-base leading-snug mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {article.title}
          </h3>
          <div className="flex items-center text-xs text-muted-foreground mt-auto gap-1 flex-wrap">
            <span>{article.author.name}</span>
            <span>·</span>
            <span>{new Date(article.publishedAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/article/${article.slug}`}
      className={cn("group flex flex-col touch-manipulation", className)}
    >
      {/* Aspect-ratio box prevents CLS before image loads */}
      <div className="relative w-full rounded-xl overflow-hidden mb-4 bg-muted" style={{ aspectRatio: "16/9" }}>
        <img
          src={article.imageUrl}
          alt={article.title}
          width={640}
          height={360}
          loading="lazy"
          decoding="async"
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <CategoryBadge category={article.category} className="w-fit mb-3" />
      <h3 className="font-display font-bold text-lg md:text-xl leading-snug mb-2 group-hover:text-primary transition-colors line-clamp-2">
        {article.title}
      </h3>
      <div className="flex items-center text-sm text-muted-foreground mt-auto pt-2 flex-wrap gap-x-2 gap-y-1">
        <span className="font-medium text-foreground">{article.author.name}</span>
        <span className="text-border">·</span>
        <span>{new Date(article.publishedAt).toLocaleDateString(undefined, { month: "long", day: "numeric" })}</span>
        <span className="text-border">·</span>
        <span>{article.readTime} min read</span>
      </div>
    </Link>
  );
}
