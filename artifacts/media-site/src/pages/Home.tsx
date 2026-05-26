import React, { useState, useEffect } from "react";
import { Link } from "wouter";
import {
  useListArticles,
  useListTrendingArticles,
  useListPopularArticles,
  useListEditorsPicks,
  Article,
} from "@workspace/api-client-react";
import { BreakingTicker } from "@/components/BreakingTicker";
import { HeroSection } from "@/components/HeroSection";
import { ArticleCard } from "@/components/ArticleCard";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { usePageMeta } from "@/hooks/usePageMeta";
import { Flame, TrendingUp } from "lucide-react";

function SectionHeader({
  title,
  icon,
  viewAllLink,
}: {
  title: string;
  icon?: React.ReactNode;
  viewAllLink?: string;
}) {
  return (
    <div className="flex items-center gap-4 mb-6 md:mb-8">
      <h2 className="font-display text-xl md:text-3xl font-bold shrink-0 flex items-center gap-2 border-l-[3px] border-primary pl-3">
        {icon && <span className="text-primary">{icon}</span>}
        {title}
      </h2>
      <div className="flex-1 h-px bg-border" />
      {viewAllLink && (
        <Link
          href={viewAllLink}
          className="text-sm font-semibold text-primary hover:underline whitespace-nowrap shrink-0"
        >
          See All →
        </Link>
      )}
    </div>
  );
}

function TrendingCard({ article, index }: { article: ReturnType<typeof useListTrendingArticles>["data"] extends (infer T)[] | undefined ? T : never; index: number }) {
  return (
    <Link
      href={`/article/${article.slug}`}
      className="flex gap-3 items-center bg-card p-3 rounded-xl border border-border hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group touch-manipulation"
      style={{ width: "clamp(260px, 28vw, 360px)", flexShrink: 0 }}
    >
      <span className="font-display text-3xl font-extrabold text-muted-foreground/20 group-hover:text-primary/30 transition-colors shrink-0 w-8 text-center leading-none">
        {index + 1}
      </span>
      {article.imageUrl && (
        <div className="relative shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-muted">
          <img
            src={article.imageUrl}
            alt={article.title}
            width={64}
            height={64}
            loading="lazy"
            decoding="async"
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
          />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <h3 className="font-bold font-display leading-snug line-clamp-2 mb-1.5 group-hover:text-primary transition-colors text-sm md:text-base">
          {article.title}
        </h3>
        <div className="text-xs text-muted-foreground flex items-center gap-2">
          <span className="font-medium text-primary/70">{article.category}</span>
          <span>·</span>
          <span>{article.readTime} min</span>
        </div>
      </div>
    </Link>
  );
}

function TrendingCarousel() {
  const { data: articles, isLoading } = useListTrendingArticles();

  if (isLoading)
    return (
      <div className="container max-w-screen-2xl px-4 md:px-8 py-10">
        <Skeleton className="w-40 h-7 mb-6 rounded-lg" />
        <div className="flex gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24 rounded-xl" style={{ width: "clamp(260px, 28vw, 360px)", flexShrink: 0 }} />
          ))}
        </div>
      </div>
    );
  if (!articles || articles.length === 0) return null;

  return (
    <section className="py-10">
      <div className="container max-w-screen-2xl px-4 md:px-8">
        <SectionHeader title="Trending Now" icon={<Flame className="w-5 h-5" />} />
      </div>
      <div className="trending-scroll-wrap">
        <div className="trending-scroll-track">
          {/* Original set */}
          {articles.map((article, index) => (
            <TrendingCard key={`a-${article.id}`} article={article} index={index} />
          ))}
          {/* Duplicate for seamless loop */}
          {articles.map((article, index) => (
            <TrendingCard key={`b-${article.id}`} article={article} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function LatestArticles() {
  const [page, setPage] = useState(1);
  const [allArticles, setAllArticles] = useState<Article[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const { data, isLoading } = useListArticles({ page, limit: 12 });

  useEffect(() => {
    if (data?.articles) {
      if (page === 1) {
        setAllArticles(data.articles);
      } else {
        setAllArticles((prev) => {
          const existingIds = new Set(prev.map((a) => a.id));
          const newOnes = data.articles.filter((a) => !existingIds.has(a.id));
          return [...prev, ...newOnes];
        });
        setLoadingMore(false);
      }
      setHasMore(data.hasMore ?? false);
    }
  }, [data, page]);

  const handleLoadMore = () => {
    setLoadingMore(true);
    setPage((p) => p + 1);
  };

  return (
    <section className="container max-w-screen-2xl px-4 md:px-8 py-10">
      <SectionHeader title="Latest Wire" />
      {isLoading && page === 1 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="w-full rounded-xl" style={{ aspectRatio: "16/9" }} />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-2/3" />
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {allArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
          {loadingMore && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="w-full rounded-xl" style={{ aspectRatio: "16/9" }} />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-5 w-full" />
                </div>
              ))}
            </div>
          )}
          {hasMore && !loadingMore && (
            <div className="mt-12 text-center">
              <Button
                variant="outline"
                size="lg"
                onClick={handleLoadMore}
                className="font-bold min-h-[48px] px-8 touch-manipulation hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
              >
                Load More Articles
              </Button>
            </div>
          )}
        </>
      )}
    </section>
  );
}

function PopularArticles() {
  const { data: articles, isLoading } = useListPopularArticles();

  if (isLoading || !articles || articles.length === 0) return null;

  return (
    <section className="cv-auto bg-muted py-14 border-y border-border">
      <div className="container max-w-screen-2xl px-4 md:px-8">
        <SectionHeader title="Popular This Week" icon={<TrendingUp className="w-5 h-5" />} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {articles.slice(0, 6).map((article, index) => (
            <div key={article.id} className="flex items-start gap-4 bg-background p-4 rounded-xl border border-border hover:border-primary/20 hover:shadow-md transition-all duration-200">
              <span className="font-display text-2xl font-extrabold text-muted-foreground/25 shrink-0 w-7 leading-none mt-1">
                {index + 1}
              </span>
              <ArticleCard
                article={article}
                layout="horizontal"
                className="flex-1"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function EditorsPicks() {
  const { data: articles, isLoading } = useListEditorsPicks();

  if (isLoading || !articles || articles.length === 0) return null;

  const featured = articles[0];
  const rest = articles.slice(1, 5);

  return (
    <section className="cv-auto container max-w-screen-2xl px-4 md:px-8 py-14">
      <SectionHeader title="Editor's Picks" />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
        <div className="lg:col-span-7">
          {featured && <ArticleCard article={featured} className="h-full" />}
        </div>
        <div className="lg:col-span-5 flex flex-col gap-4">
          {rest.map((article) => (
            <ArticleCard key={article.id} article={article} layout="horizontal" className="py-3 border-b border-border/50 last:border-0" />
          ))}
        </div>
      </div>
    </section>
  );
}

function CategorySpotlight({ category }: { category: string }) {
  const slug = category.toLowerCase().replace(/\s+/g, "-");
  const { data, isLoading } = useListArticles({
    category: slug,
    limit: 4,
  });

  if (isLoading || !data || data.articles.length === 0) return null;

  const featured = data.articles[0];
  const rest = data.articles.slice(1);

  return (
    <section className="cv-auto container max-w-screen-2xl px-4 md:px-8 py-10">
      <SectionHeader
        title={category}
        viewAllLink={`/category/${slug}`}
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        <ArticleCard article={featured} />
        <div className="flex flex-col gap-4 justify-between">
          {rest.map((article) => (
            <ArticleCard key={article.id} article={article} layout="horizontal" className="py-3 border-b border-border/50 last:border-0" />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  usePageMeta({});

  return (
    <div className="min-h-screen">
      <BreakingTicker />
      <HeroSection />
      <TrendingCarousel />
      <div className="border-t border-border/50" />
      <LatestArticles />
      <PopularArticles />
      <EditorsPicks />
      <CategorySpotlight category="Tech" />
      <div className="border-t border-border/30 container max-w-screen-2xl px-4 md:px-8" />
      <CategorySpotlight category="Culture" />
      <NewsletterSignup />
    </div>
  );
}
