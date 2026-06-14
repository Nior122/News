import React from "react";
import { Link } from "wouter";
import { Article } from "@workspace/api-client-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface ArticleCardProps {
  article: Article;
  layout?: "grid" | "horizontal";
  featured?: boolean;
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

export function ArticleCard({ article, layout = "grid", featured = false, className }: ArticleCardProps) {
  if (layout === "horizontal") {
    return (
      <div className={cn("group relative flex gap-4 items-start touch-manipulation", className)}>
        {/* Invisible overlay makes the whole card clickable for mouse/touch — aria-hidden so screen readers only use the title link */}
        <Link
          href={`/article/${article.slug}`}
          className="absolute inset-0 z-0"
          aria-hidden="true"
          tabIndex={-1}
        />
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
        <div className="relative z-10 flex flex-col flex-1 py-0.5 min-w-0">
          <div className="pointer-events-auto w-fit mb-2">
            <CategoryBadge category={article.category} className="text-xs" />
          </div>
          <h3 className="font-display font-bold text-sm md:text-base leading-snug mb-1.5 transition-colors line-clamp-2">
            <Link
              href={`/article/${article.slug}`}
              className="relative z-10 group-hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
            >
              {article.title}
            </Link>
          </h3>
          <div className="flex items-center text-xs text-muted-foreground mt-auto gap-1.5 pointer-events-none">
            <span className="font-medium text-foreground/70 truncate max-w-[110px]">{article.author.name}</span>
            <span className="text-border">·</span>
            <span>{new Date(article.publishedAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "group relative flex flex-col touch-manipulation rounded-2xl overflow-hidden bg-card border border-border/50 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300",
        className,
      )}
    >
      {/* Invisible overlay makes the whole card clickable — aria-hidden so screen readers only use the title link */}
      <Link
        href={`/article/${article.slug}`}
        className="absolute inset-0 z-0"
        aria-hidden="true"
        tabIndex={-1}
      />

      {/* Image with category badge overlay */}
      <div
        className="relative w-full overflow-hidden bg-muted pointer-events-none"
        style={{ aspectRatio: "16/9" }}
      >
        <img
          src={article.imageUrl}
          alt={article.title}
          width={featured ? 1200 : 640}
          height={featured ? 675 : 360}
          loading="lazy"
          decoding="async"
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
        <div className="absolute bottom-3 left-3 pointer-events-auto z-10">
          <CategoryBadge
            category={article.category}
            className="backdrop-blur-sm shadow-sm text-xs"
          />
        </div>
      </div>

      {/* Card body */}
      <div className={cn("relative z-10 flex flex-col flex-1", featured ? "p-5" : "p-4")}>
        <h3
          className={cn(
            "font-display font-bold leading-snug transition-colors line-clamp-2",
            featured ? "text-xl md:text-2xl mb-3" : "text-base md:text-lg mb-2"
          )}
        >
          <Link
            href={`/article/${article.slug}`}
            className="relative z-10 group-hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
          >
            {article.title}
          </Link>
        </h3>

        {featured && article.excerpt && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3 leading-relaxed pointer-events-none">
            {article.excerpt}
          </p>
        )}

        <div className="flex items-center text-xs text-muted-foreground mt-auto gap-1.5 flex-wrap pointer-events-none">
          <span className="font-medium text-foreground/70">{article.author.name}</span>
          <span className="text-border">·</span>
          <span>{new Date(article.publishedAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</span>
          <span className="text-border">·</span>
          <span>{article.readTime} min read</span>
        </div>
      </div>
    </div>
  );
}
