import React from "react";
import { Link } from "wouter";
import { Article } from "@workspace/api-client-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

interface ArticleCardProps {
  article: Article;
  layout?: "grid" | "horizontal" | "hero";
  className?: string;
}

const CATEGORY_SLUGS: Record<string, string> = {
  tech: "tech",
  culture: "culture",
  lifestyle: "lifestyle",
  "ai tools": "ai-tools",
  "phone tips": "phone-tips",
  productivity: "productivity",
  trending: "trending",
};

function getCategoryColor(cat: string) {
  switch (cat.toLowerCase()) {
    case "tech":         return "bg-blue-500/10 text-blue-500 border-blue-500/20 hover:bg-blue-500/25";
    case "culture":      return "bg-purple-500/10 text-purple-500 border-purple-500/20 hover:bg-purple-500/25";
    case "lifestyle":    return "bg-pink-500/10 text-pink-500 border-pink-500/20 hover:bg-pink-500/25";
    case "ai tools":     return "bg-cyan-500/10 text-cyan-500 border-cyan-500/20 hover:bg-cyan-500/25";
    case "phone tips":   return "bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/25";
    case "productivity": return "bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500/25";
    case "trending":     return "bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/25";
    default:             return "bg-primary/10 text-primary border-primary/20 hover:bg-primary/25";
  }
}

function categorySlug(category: string) {
  return CATEGORY_SLUGS[category.toLowerCase()] ?? category.toLowerCase().replace(/\s+/g, "-");
}

/** Standalone badge — links directly to the category page. Safe to use outside of card links. */
export function CategoryBadge({
  category,
  className,
}: {
  category: string;
  className?: string;
}) {
  const slug = categorySlug(category);
  return (
    <Link href={`/category/${slug}`} className="inline-flex">
      <Badge
        variant="outline"
        className={cn(
          getCategoryColor(category),
          "font-semibold cursor-pointer transition-colors",
          className
        )}
      >
        {category}
      </Badge>
    </Link>
  );
}

export function ArticleCard({ article, layout = "grid", className }: ArticleCardProps) {
  if (layout === "horizontal") {
    return (
      /* Stretched-link pattern: card is a div, the article anchor covers it,
         and the category badge is a separate sibling link above the overlay. */
      <div className={cn("group relative flex gap-4 items-start touch-manipulation", className)}>
        {/* Invisible stretched article link */}
        <Link
          href={`/article/${article.slug}`}
          className="absolute inset-0 z-0"
          aria-label={article.title}
        />

        {/* Thumbnail */}
        <div
          className="relative z-10 shrink-0 rounded-xl overflow-hidden bg-muted pointer-events-none"
          style={{ width: 120, height: 90 }}
        >
          <img
            src={article.imageUrl}
            alt={article.title}
            width={120}
            height={90}
            loading="lazy"
            decoding="async"
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        {/* Text content */}
        <div className="relative z-10 flex flex-col flex-1 py-0.5 min-w-0 pointer-events-none">
          {/* Category badge — real link above the stretched article link */}
          <div className="pointer-events-auto w-fit mb-2">
            <CategoryBadge category={article.category} className="text-xs" />
          </div>
          <h3 className="font-display font-bold text-sm md:text-base leading-snug mb-1.5 group-hover:text-primary transition-colors line-clamp-2 pointer-events-none">
            {article.title}
          </h3>
          <div className="flex items-center text-xs text-muted-foreground mt-auto gap-1.5 flex-wrap pointer-events-none">
            <span className="font-medium text-foreground/70 truncate max-w-[100px]">{article.author.name}</span>
            <span className="text-border">·</span>
            <span>{new Date(article.publishedAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</span>
            <span className="text-border">·</span>
            <span className="flex items-center gap-0.5">
              <Clock className="w-3 h-3" />
              {article.readTime}m
            </span>
          </div>
        </div>
      </div>
    );
  }

  /* Grid / default layout */
  return (
    <div
      className={cn(
        "group relative flex flex-col touch-manipulation bg-card rounded-xl overflow-hidden border border-border/50 hover:border-primary/25 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300",
        className,
      )}
    >
      {/* Stretched article link (behind everything) */}
      <Link
        href={`/article/${article.slug}`}
        className="absolute inset-0 z-0"
        aria-label={article.title}
      />

      {/* Image */}
      <div className="relative w-full overflow-hidden bg-muted pointer-events-none" style={{ aspectRatio: "16/9" }}>
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

      {/* Card body */}
      <div className="relative z-10 flex flex-col flex-1 p-4 pointer-events-none">
        {/* Category badge is a real link above the stretched overlay */}
        <div className="pointer-events-auto w-fit mb-3">
          <CategoryBadge category={article.category} />
        </div>
        <h3 className="font-display font-bold text-base md:text-lg leading-snug mb-2 group-hover:text-primary transition-colors line-clamp-2 pointer-events-none">
          {article.title}
        </h3>
        {article.excerpt && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3 leading-relaxed flex-1 pointer-events-none">
            {article.excerpt}
          </p>
        )}
        <div className="flex items-center text-xs text-muted-foreground mt-auto pt-3 border-t border-border/50 flex-wrap gap-x-2 gap-y-1 pointer-events-none">
          <span className="font-medium text-foreground/80">{article.author.name}</span>
          <span className="text-border">·</span>
          <span>{new Date(article.publishedAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</span>
          <span className="ml-auto flex items-center gap-1 text-muted-foreground/70">
            <Clock className="w-3 h-3" />
            {article.readTime} min
          </span>
        </div>
      </div>
    </div>
  );
}
