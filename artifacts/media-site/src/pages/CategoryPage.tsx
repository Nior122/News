import React, { useState, useEffect } from "react";
import { useRoute } from "wouter";
import {
  useListArticles,
  useListTrendingArticles,
  getListArticlesQueryKey,
  Article,
} from "@workspace/api-client-react";
import { ArticleCard } from "@/components/ArticleCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Flame } from "lucide-react";

// ── Category metadata ─────────────────────────────────────────────────────────

const SLUG_TO_NAME: Record<string, string> = {
  tech: "Tech",
  culture: "Culture",
  lifestyle: "Lifestyle",
  "ai-tools": "AI Tools",
  "phone-tips": "Phone Tips",
  productivity: "Productivity",
  trending: "Trending",
  // virtual mixed slugs
  "ai-productivity": "AI & Productivity",
  "culture-lifestyle": "Culture & Lifestyle",
};

const SLUG_TO_DESCRIPTION: Record<string, string> = {
  tech: "The latest news, reviews, and insights about technology.",
  culture: "Internet culture, social trends, and what the world is talking about.",
  lifestyle: "Modern living — wellness, work, and the way we spend our time.",
  "ai-tools": "Practical guides, reviews, and news about AI tools you can use today.",
  "phone-tips": "Get more from your smartphone with tips, tricks, and hidden features.",
  productivity: "Work smarter, not harder — tools, habits, and systems that actually work.",
  trending: "The most-read stories on Scrolltek right now.",
  "ai-productivity": "The best of AI Tools and Productivity — tools, tips, and systems that save you hours.",
  "culture-lifestyle": "Culture and Lifestyle stories — how we live, connect, and unwind.",
};

// Virtual slugs map to the real category slugs they combine
const MIXED_SLUG_MAP: Record<string, string[]> = {
  "ai-productivity": ["ai-tools", "productivity"],
  "culture-lifestyle": ["culture", "lifestyle"],
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
    case "ai-productivity": return "from-amber-500/20";
    case "culture-lifestyle": return "from-purple-500/20";
    default: return "from-primary/20";
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
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

// ── Trending page ─────────────────────────────────────────────────────────────

function TrendingPage({
  displayName,
  description,
  gradient,
}: {
  displayName: string;
  description: string;
  gradient: string;
}) {
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

// ── Mixed category page (AI+Productivity or Culture+Lifestyle) ────────────────
// Articles from both categories are pooled and reshuffled every 2 minutes.

function MixedCategoryPage({
  slugs,
  displayName,
  description,
  gradient,
}: {
  slugs: string[];
  displayName: string;
  description: string;
  gradient: string;
}) {
  const q0 = useListArticles({ category: slugs[0], limit: 50 });
  const q1 = useListArticles({ category: slugs[1], limit: 50 });

  // Merge both pools, deduplicated
  const pool = React.useMemo(() => {
    const seen = new Set<number>();
    const all: Article[] = [];
    for (const q of [q0, q1]) {
      for (const a of q.data?.articles ?? []) {
        if (!seen.has(a.id)) { seen.add(a.id); all.push(a); }
      }
    }
    return all;
  }, [q0.data, q1.data]);

  const [displayed, setDisplayed] = useState<Article[]>([]);
  const [fading, setFading] = useState(false);
  const isLoading = q0.isLoading || q1.isLoading;

  // Initial shuffle on load
  useEffect(() => {
    if (pool.length > 0) setDisplayed(shuffle(pool));
  }, [pool.length]);

  // Reshuffle every 2 minutes
  useEffect(() => {
    if (pool.length < 2) return;
    const id = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setDisplayed(shuffle(pool));
        setFading(false);
      }, 400);
    }, 120000);
    return () => clearInterval(id);
  }, [pool]);

  return (
    <div className="min-h-screen pb-16">
      <div className={`bg-gradient-to-b ${gradient} to-background border-b border-border/50 py-16 mb-12`}>
        <div className="container max-w-screen-2xl px-4 md:px-8 text-center">
          <h1 className="font-display text-4xl md:text-6xl font-extrabold mb-4">{displayName}</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{description}</p>
        </div>
      </div>
      <div className="container max-w-screen-2xl px-4 md:px-8">
        {isLoading && displayed.length === 0 ? (
          <SkeletonGrid />
        ) : displayed.length > 0 ? (
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10"
            style={{ opacity: fading ? 0 : 1, transition: "opacity 0.4s ease" }}
          >
            {displayed.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-muted-foreground">
            No articles found.
          </div>
        )}
      </div>
    </div>
  );
}

// ── Standard category page ────────────────────────────────────────────────────

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
  const [allArticles, setAllArticles] = React.useState<Article[]>([]);

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
          const ids = new Set(prev.map((a) => a.id));
          return [...prev, ...data.articles.filter((a) => !ids.has(a.id))];
        });
      }
    }
  }, [data, page]);

  React.useEffect(() => {
    setPage(1);
    setAllArticles([]);
  }, [slug]);

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

// ── Router ────────────────────────────────────────────────────────────────────

export default function CategoryPage() {
  const [, params] = useRoute("/category/:slug");
  const slug = params?.slug || "";
  const displayName =
    SLUG_TO_NAME[slug] ?? slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const description =
    SLUG_TO_DESCRIPTION[slug] ?? `The latest news, reviews, and insights about ${displayName}.`;
  const gradient = getCategoryColor(slug);

  if (slug === "trending") {
    return <TrendingPage displayName={displayName} description={description} gradient={gradient} />;
  }

  if (MIXED_SLUG_MAP[slug]) {
    return (
      <MixedCategoryPage
        slugs={MIXED_SLUG_MAP[slug]}
        displayName={displayName}
        description={description}
        gradient={gradient}
      />
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
