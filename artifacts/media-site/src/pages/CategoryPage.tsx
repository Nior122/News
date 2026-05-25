import React from "react";
import { useRoute } from "wouter";
import { useListArticles, getListArticlesQueryKey } from "@workspace/api-client-react";
import { ArticleCard } from "@/components/ArticleCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

const SLUG_TO_NAME: Record<string, string> = {
  tech: "Tech",
  culture: "Culture",
  lifestyle: "Lifestyle",
  "ai-tools": "AI Tools",
  "phone-tips": "Phone Tips",
  productivity: "Productivity",
  trending: "Trending",
};

export default function CategoryPage() {
  const [, params] = useRoute("/category/:slug");
  const slug = params?.slug || "";
  const displayName = SLUG_TO_NAME[slug] ?? slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  const { data, isLoading } = useListArticles({ category: slug }, {
    query: {
      enabled: !!slug,
      queryKey: getListArticlesQueryKey({ category: slug })
    }
  });

  const getCategoryColor = (cat: string) => {
    switch (cat.toLowerCase()) {
      case "tech": return "from-blue-500/20";
      case "culture": return "from-purple-500/20";
      case "lifestyle": return "from-pink-500/20";
      case "ai-tools": return "from-cyan-500/20";
      case "phone-tips": return "from-green-500/20";
      case "productivity": return "from-amber-500/20";
      case "trending": return "from-red-500/20";
      default: return "from-primary/20";
    }
  };

  return (
    <div className="min-h-screen pb-16">
      <div className={`bg-gradient-to-b ${getCategoryColor(slug)} to-background border-b border-border/50 py-16 mb-12`}>
        <div className="container max-w-screen-2xl px-4 md:px-8 text-center">
          <h1 className="font-display text-4xl md:text-6xl font-extrabold mb-4">
            {displayName}
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            The latest news, reviews, and insights about {displayName}.
          </p>
        </div>
      </div>

      <div className="container max-w-screen-2xl px-4 md:px-8">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="w-full aspect-[16/9] rounded-xl" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-2/3" />
              </div>
            ))}
          </div>
        ) : data?.articles && data.articles.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
              {data.articles.map(article => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
            {data.hasMore && (
              <div className="mt-12 flex justify-center">
                <Button variant="outline" size="lg" className="font-bold">
                  Load More
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 text-muted-foreground">
            No articles found in this category.
          </div>
        )}
      </div>
    </div>
  );
}