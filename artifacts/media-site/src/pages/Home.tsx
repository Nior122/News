import React from "react";
import { Link } from "wouter";
import {
  useListArticles,
  useListTrendingArticles,
  useListPopularArticles,
  useListEditorsPicks,
} from "@workspace/api-client-react";
import { BreakingTicker } from "@/components/BreakingTicker";
import { HeroSection } from "@/components/HeroSection";
import { ArticleCard } from "@/components/ArticleCard";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { usePageMeta } from "@/hooks/usePageMeta";
import useEmblaCarousel from "embla-carousel-react";

function SectionHeader({
  title,
  viewAllLink,
}: {
  title: string;
  viewAllLink?: string;
}) {
  return (
    <div className="flex items-center gap-4 mb-6 md:mb-8">
      <h2 className="font-display text-xl md:text-3xl font-bold shrink-0">{title}</h2>
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

function TrendingCarousel() {
  const { data: articles, isLoading } = useListTrendingArticles();
  const [emblaRef] = useEmblaCarousel({ dragFree: true, align: "start" });

  if (isLoading)
    return (
      <div className="container max-w-screen-2xl px-4 md:px-8 py-10">
        <Skeleton className="w-40 h-7 mb-6 rounded-lg" />
        <Skeleton className="w-full h-36 rounded-xl" />
      </div>
    );
  if (!articles) return null;

  return (
    <section className="container max-w-screen-2xl px-4 md:px-8 py-10">
      <SectionHeader title="Trending Now" />
      <div className="overflow-hidden -mx-1" ref={emblaRef}>
        <div className="flex gap-4 px-1">
          {articles.map((article, index) => (
            <div
              key={article.id}
              className="flex-[0_0_82%] sm:flex-[0_0_55%] md:flex-[0_0_38%] lg:flex-[0_0_28%] min-w-0"
            >
              <Link
                href={`/article/${article.slug}`}
                className="flex gap-4 items-center bg-card p-4 rounded-xl border border-border h-full hover:border-primary/50 transition-colors group touch-manipulation"
              >
                <span className="font-display text-4xl font-extrabold text-muted-foreground/20 group-hover:text-primary/40 transition-colors shrink-0 w-10 text-center">
                  {index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold font-display leading-snug line-clamp-2 mb-2 group-hover:text-primary transition-colors text-sm md:text-base">
                    {article.title}
                  </h3>
                  <div className="text-xs text-muted-foreground flex items-center gap-2">
                    <span>{article.category}</span>
                    <span>·</span>
                    <span>{article.readTime} min read</span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function LatestArticles() {
  const { data, isLoading } = useListArticles({ page: 1, limit: 12 });

  return (
    <section className="container max-w-screen-2xl px-4 md:px-8 py-10">
      <SectionHeader title="Latest Wire" />
      {isLoading ? (
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
            {data?.articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
          {data?.hasMore && (
            <div className="mt-12 text-center">
              <Button
                variant="outline"
                size="lg"
                className="font-bold min-h-[48px] px-8 touch-manipulation"
              >
                Load More
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
        <SectionHeader title="Popular This Week" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.slice(0, 6).map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              layout="horizontal"
              className="bg-background p-4 rounded-xl shadow-sm border border-border"
            />
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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          {featured && <ArticleCard article={featured} className="h-full" />}
        </div>
        <div className="lg:col-span-4 flex flex-col gap-6">
          {rest.map((article) => (
            <ArticleCard key={article.id} article={article} layout="horizontal" />
          ))}
        </div>
      </div>
    </section>
  );
}

function CategorySpotlight({ category }: { category: string }) {
  const { data, isLoading } = useListArticles({
    category: category.toLowerCase().replace(/\s+/g, "-"),
    limit: 4,
  });

  if (isLoading || !data || data.articles.length === 0) return null;

  const featured = data.articles[0];
  const rest = data.articles.slice(1);

  return (
    <section className="cv-auto container max-w-screen-2xl px-4 md:px-8 py-10">
      <SectionHeader
        title={category}
        viewAllLink={`/category/${category.toLowerCase().replace(/\s+/g, "-")}`}
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ArticleCard article={featured} />
        <div className="flex flex-col gap-6 justify-between">
          {rest.map((article) => (
            <ArticleCard key={article.id} article={article} layout="horizontal" />
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
      <LatestArticles />
      <PopularArticles />
      <EditorsPicks />
      <CategorySpotlight category="Tech" />
      <CategorySpotlight category="Culture" />
      <NewsletterSignup />
    </div>
  );
}
