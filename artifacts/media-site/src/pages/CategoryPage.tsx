import React from "react";
import { useRoute } from "wouter";
import {
  useListArticles,
  useListTrendingArticles,
  getListArticlesQueryKey,
} from "@workspace/api-client-react";
import { ArticleCard } from "@/components/ArticleCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Flame } from "lucide-react";

const SLUG_TO_NAME: Record<string, string> = {
  tech: "Tech",
  culture: "Culture",
  lifestyle: "Lifestyle",
  "ai-tools": "AI Tools",
  "phone-tips": "Phone Tips",
  productivity: "Productivity",
  trending: "Trending",
};

const SLUG_TO_DESCRIPTION: Record<string, string> = {
  tech: "The latest news, reviews, and insights about technology.",
  culture: "Internet culture, social trends, and what the world is talking about.",
  lifestyle: "Modern living — wellness, work, and the way we spend our time.",
  "ai-tools": "Practical guides, reviews, and news about AI tools you can use today.",
  "phone-tips": "Get more from your smartphone with tips, tricks, and hidden features.",
  productivity: "Work smarter, not harder — tools, habits, and systems that actually work.",
  trending: "The most-read stories on Scrolltek right now.",
};

function getCategoryColor(cat: string) {
  switch (cat) {
    case "tech": return "from-blue-500/20";
    case "culture": return "from-purple-500/20";
    case "lifestyle": return "from-pink-500/20";
    case "ai-tools": return "from-cyan-500/20";
    case "phone-tips": return "from-green-500/20";
    case "productivity": return "from-amber-500/20";
    case "trending": return "from-red-500/20";
    default: return "from-primary/20";
  }
}

function SkeletonGrid() {
  return (
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
  );
}

/** Trending page — shows most-read articles across all categories */
function TrendingPage({ displayName, description, gradient }: { displayName: string; description: string; gradient: string }) {
  const { data: articles, isLoading } = useListTrendingArticles({ limit: 20 } as never);

  return (
    <div className="min-h-screen pb-16">
      <div className={`bg-gradient-to-b ${gradient} to-background border-b border-border/50 py-16 mb-12`}>
        <div className="container max-w-screen-2xl px-4 md:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Flame className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-extrabold mb-4">{displayName}</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{description}</p>
        </div>
      </div>
      <div className="container max-w-screen-2xl px-4 md:px-8">
        {isLoading ? (
          <SkeletonGrid />
        ) : articles && articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-muted-foreground">No trending articles yet.</div>
        )}
      </div>
    </div>
  );
}

/** Standard category page — filters articles by category */
function StandardCategoryPage({
  slug,
  displayName,
  description,
  gradient,
}: {
  slug: string;
  displayName: string;
  description: string;
  gradient: string;
}) {
  const [page, setPage] = React.useState(1);
  const [allArticles, setAllArticles] = React.useState<any[]>([]);

  const { data, isLoading } = useListArticles(
    { category: slug, page, limit: 12 },
    {
      query: {
        enabled: !!slug,
        queryKey: getListArticlesQueryKey({ category: slug, page, limit: 12 }),
      },
    }
  );

  React.useEffect(() => {
    if (data?.articles) {
      if (page === 1) {
        setAllArticles(data.articles);
      } else {
        setAllArticles((prev) => {
          const ids = new Set(prev.map((a: any) => a.id));
          return [...prev, ...data.articles.filter((a: any) => !ids.has(a.id))];
        });
      }
    }
  }, [data, page]);

  // Reset when slug changes
  React.useEffect(() => {
    setPage(1);
    setAllArticles([]);
  }, [slug]);

  // Use cached query data as fallback so back-navigation never flashes "no articles"
  // while the useEffect hasn't had a chance to populate allArticles yet.
  const displayArticles = allArticles.length > 0 ? allArticles : (data?.articles ?? []);
  const isInitialLoading = isLoading && displayArticles.length === 0;

  return (
    <div className="min-h-screen pb-16">
      <div className={`bg-gradient-to-b ${gradient} to-background border-b border-border/50 py-16 mb-12`}>
        <div className="container max-w-screen-2xl px-4 md:px-8 text-center">
          <h1 className="font-display text-4xl md:text-6xl font-extrabold mb-4">{displayName}</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{description}</p>
        </div>
      </div>

      <div className="container max-w-screen-2xl px-4 md:px-8">
        {isInitialLoading ? (
          <SkeletonGrid />
        ) : displayArticles.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
              {displayArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
            {data?.hasMore && (
              <div className="mt-12 flex justify-center">
                <Button
                  variant="outline"
                  size="lg"
                  className="font-bold"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={isLoading}
                >
                  {isLoading ? "Loading…" : "Load More"}
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

export default function CategoryPage() {
  const [, params] = useRoute("/category/:slug");
  const slug = params?.slug || "";
  const displayName =
    SLUG_TO_NAME[slug] ?? slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const description =
    SLUG_TO_DESCRIPTION[slug] ?? `The latest news, reviews, and insights about ${displayName}.`;
  const gradient = getCategoryColor(slug);

  if (slug === "trending") {
    return (
      <TrendingPage displayName={displayName} description={description} gradient={gradient} />
    );
  }

  return (
    <StandardCategoryPage
      slug={slug}
      displayName={displayName}
      description={description}
      gradient={gradient}
    />
  );
}
