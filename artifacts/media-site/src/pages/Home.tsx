import React, { useState, useEffect, useMemo } from "react";
import { Link } from "wouter";
import {
  useListArticles,
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

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function shuffleWithPinnedTop<T>(arr: T[], pinnedCount = 4): T[] {
  if (arr.length <= pinnedCount) return shuffle(arr);
  return [...shuffle(arr.slice(0, pinnedCount)), ...shuffle(arr.slice(pinnedCount))];
}

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

/* ── Trending Now ── image card grid, no numbers */
function TrendingCarousel({ allArticles }: { allArticles: Article[] }) {
  const [visible, setVisible] = useState<Article[]>([]);
  const [fading, setFading] = useState(false);
  const SHOW = 6;

  useEffect(() => {
    if (allArticles.length > 0) setVisible(shuffle(allArticles).slice(0, SHOW));
  }, [allArticles.length]);

  useEffect(() => {
    if (allArticles.length === 0) return;
    const id = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setVisible(shuffle(allArticles).slice(0, SHOW));
        setFading(false);
      }, 400);
    }, 60000);
    return () => clearInterval(id);
  }, [allArticles]);

  if (visible.length === 0) return null;

  return (
    <section className="py-10">
      <div className="container max-w-screen-2xl px-4 md:px-8">
        <SectionHeader title="Trending Now" icon={<Flame className="w-5 h-5" />} />
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          style={{ opacity: fading ? 0 : 1, transition: "opacity 0.4s ease" }}
        >
          {visible.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Latest Wire ── magazine layout: featured + 2 stacked, then 3-col grid */
function LatestArticles() {
  const [page, setPage] = useState(1);
  const [pool, setPool] = useState<Article[]>([]);
  const [displayed, setDisplayed] = useState<Article[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [fading, setFading] = useState(false);

  const { data, isLoading } = useListArticles({ page, limit: 9 });

  useEffect(() => {
    if (!data?.articles) return;
    if (page === 1) {
      setPool(data.articles);
    } else {
      setPool((prev) => {
        const ids = new Set(prev.map((a) => a.id));
        return [...prev, ...data.articles.filter((a) => !ids.has(a.id))];
      });
      setLoadingMore(false);
    }
    setHasMore(data.hasMore ?? false);
  }, [data, page]);

  useEffect(() => {
    if (pool.length > 0) setDisplayed(pool);
  }, [pool]);

  const featured = displayed[0];
  const stacked = displayed.slice(1, 3);
  const rest = displayed.slice(3);

  return (
    <section className="container max-w-screen-2xl px-4 md:px-8 py-10">
      <SectionHeader title="Latest Wire" />
      {isLoading && page === 1 ? (
        <div className="space-y-6">
          {/* Featured skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Skeleton className="lg:col-span-2 w-full rounded-2xl" style={{ aspectRatio: "16/9" }} />
            <div className="flex flex-col gap-6">
              <Skeleton className="w-full rounded-2xl" style={{ aspectRatio: "16/9" }} />
              <Skeleton className="w-full rounded-2xl" style={{ aspectRatio: "16/9" }} />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="w-full rounded-2xl" style={{ aspectRatio: "16/9" }} />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          <div style={{ opacity: fading ? 0 : 1, transition: "opacity 0.4s ease" }}>
            {/* Magazine top row: 1 featured (2/3 width) + 2 stacked (1/3 width) */}
            {featured && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div className="lg:col-span-2">
                  <ArticleCard article={featured} featured className="h-full" />
                </div>
                <div className="flex flex-col gap-6">
                  {stacked.map((article) => (
                    <ArticleCard key={article.id} article={article} className="flex-1" />
                  ))}
                </div>
              </div>
            )}

            {/* Remaining articles in 3-col grid */}
            {rest.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {rest.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            )}
          </div>

          {loadingMore && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="w-full rounded-2xl" style={{ aspectRatio: "16/9" }} />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              ))}
            </div>
          )}

          {hasMore && !loadingMore && (
            <div className="mt-12 text-center">
              <Button
                variant="outline"
                size="lg"
                onClick={() => { setLoadingMore(true); setPage((p) => p + 1); }}
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

/* ── Popular This Week ── 3-col image card grid (no numbered list) */
function PopularArticles({ allArticles }: { allArticles: Article[] }) {
  const [visible, setVisible] = useState<Article[]>([]);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (allArticles.length > 0) setVisible(shuffle(allArticles).slice(0, 6));
  }, [allArticles.length]);

  useEffect(() => {
    if (allArticles.length === 0) return;
    const id = setInterval(() => {
      setFading(true);
      setTimeout(() => { setVisible(shuffle(allArticles).slice(0, 6)); setFading(false); }, 400);
    }, 60000);
    return () => clearInterval(id);
  }, [allArticles]);

  if (visible.length === 0) return null;

  return (
    <section className="cv-auto bg-muted py-14 border-y border-border">
      <div className="container max-w-screen-2xl px-4 md:px-8">
        <SectionHeader title="Popular This Week" icon={<TrendingUp className="w-5 h-5" />} />
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          style={{ opacity: fading ? 0 : 1, transition: "opacity 0.4s ease" }}
        >
          {visible.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Editor's Picks ── 1 featured wide + 2 stacked horizontals */
function EditorsPicks({ allArticles }: { allArticles: Article[] }) {
  const [visible, setVisible] = useState<Article[]>([]);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (allArticles.length > 0) setVisible(shuffle(allArticles).slice(0, 3));
  }, [allArticles.length]);

  useEffect(() => {
    if (allArticles.length === 0) return;
    const id = setInterval(() => {
      setFading(true);
      setTimeout(() => { setVisible(shuffle(allArticles).slice(0, 3)); setFading(false); }, 400);
    }, 60000);
    return () => clearInterval(id);
  }, [allArticles]);

  if (visible.length === 0) return null;

  const [featured, ...rest] = visible;

  return (
    <section className="cv-auto container max-w-screen-2xl px-4 md:px-8 py-14">
      <SectionHeader title="Editor's Picks" />
      <div
        className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8"
        style={{ opacity: fading ? 0 : 1, transition: "opacity 0.4s ease" }}
      >
        <div className="lg:col-span-7">
          {featured && <ArticleCard article={featured} featured className="h-full" />}
        </div>
        <div className="lg:col-span-5 flex flex-col gap-4">
          {rest.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              layout="horizontal"
              className="py-3 border-b border-border/50 last:border-0"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Category Spotlight ── 1 featured + horizontal list */
function CategorySpotlight({
  category,
  allArticles,
}: {
  category: string;
  allArticles: Article[];
}) {
  const slug = category.toLowerCase().replace(/\s+/g, "-");
  const pool = useMemo(
    () => allArticles.filter((a) => a.category.toLowerCase() === category.toLowerCase()),
    [allArticles, category]
  );
  const [displayed, setDisplayed] = useState<Article[]>([]);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (pool.length > 0) setDisplayed(shuffle(pool).slice(0, 4));
  }, [pool]);

  useEffect(() => {
    if (pool.length < 2) return;
    const id = setInterval(() => {
      setFading(true);
      setTimeout(() => { setDisplayed(shuffle(pool).slice(0, 4)); setFading(false); }, 400);
    }, 60000);
    return () => clearInterval(id);
  }, [pool]);

  if (displayed.length === 0) return null;

  const [featured, ...rest] = displayed;

  return (
    <section className="cv-auto container max-w-screen-2xl px-4 md:px-8 py-10">
      <SectionHeader title={category} viewAllLink={`/category/${slug}`} />
      <div
        className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8"
        style={{ opacity: fading ? 0 : 1, transition: "opacity 0.4s ease" }}
      >
        {featured && <ArticleCard article={featured} featured />}
        <div className="flex flex-col gap-4 justify-between">
          {rest.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              layout="horizontal"
              className="py-3 border-b border-border/50 last:border-0"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

const CATEGORY_META = [
  { label: "Tech",        slug: "tech",        color: "bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/30 text-blue-600 dark:text-blue-400",          emoji: "💻" },
  { label: "Culture",     slug: "culture",     color: "bg-purple-500/10 hover:bg-purple-500/20 border-purple-500/30 text-purple-600 dark:text-purple-400",  emoji: "🎭" },
  { label: "Lifestyle",   slug: "lifestyle",   color: "bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/30 text-emerald-600 dark:text-emerald-400", emoji: "🌿" },
  { label: "AI Tools",    slug: "ai-tools",    color: "bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/30 text-amber-600 dark:text-amber-400",       emoji: "🤖" },
  { label: "Phone Tips",  slug: "phone-tips",  color: "bg-red-500/10 hover:bg-red-500/20 border-red-500/30 text-red-600 dark:text-red-400",               emoji: "📱" },
  { label: "Productivity",slug: "productivity",color: "bg-cyan-500/10 hover:bg-cyan-500/20 border-cyan-500/30 text-cyan-600 dark:text-cyan-400",            emoji: "⚡" },
  { label: "Trending",    slug: "trending",    color: "bg-orange-500/10 hover:bg-orange-500/20 border-orange-500/30 text-orange-600 dark:text-orange-400",  emoji: "🔥" },
];

function CategoryButtons() {
  const [order, setOrder] = useState(() => shuffle(CATEGORY_META));

  useEffect(() => {
    const id = setInterval(() => setOrder(shuffle(CATEGORY_META)), 60000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="container max-w-screen-2xl px-4 md:px-8 py-10">
      <SectionHeader title="Browse by Category" />
      <div className="flex flex-wrap gap-3">
        {order.map((cat) => (
          <Link key={cat.slug} href={`/category/${cat.slug}`}>
            <span
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full border font-semibold text-sm transition-all duration-300 cursor-pointer ${cat.color}`}
            >
              <span>{cat.emoji}</span>
              {cat.label}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

const CATEGORY_SECTIONS = [
  "Tech", "AI Tools", "Phone Tips", "Culture", "Lifestyle", "Productivity", "Trending",
];

export default function Home() {
  usePageMeta({});

  const { data, isLoading } = useListArticles({ limit: 100 });
  const allArticles = data?.articles ?? [];

  return (
    <div className="min-h-screen">
      <BreakingTicker />
      <HeroSection articles={allArticles} isLoading={isLoading} />

      {isLoading ? (
        <div className="container max-w-screen-2xl px-4 md:px-8 py-10">
          <Skeleton className="w-40 h-7 mb-6 rounded-lg" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="w-full rounded-2xl" style={{ aspectRatio: "16/9" }} />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <TrendingCarousel allArticles={allArticles} />
      )}

      <div className="border-t border-border/50" />
      <LatestArticles />

      <PopularArticles allArticles={allArticles} />
      <EditorsPicks allArticles={allArticles} />

      <div className="border-t border-border/30 container max-w-screen-2xl px-4 md:px-8" />

      {CATEGORY_SECTIONS.map((cat, i) => (
        <React.Fragment key={cat}>
          <CategorySpotlight category={cat} allArticles={allArticles} />
          {i < CATEGORY_SECTIONS.length - 1 && (
            <div className="border-t border-border/20 container max-w-screen-2xl px-4 md:px-8" />
          )}
        </React.Fragment>
      ))}

      <div className="border-t border-border/30" />
      <CategoryButtons />

      <NewsletterSignup />
    </div>
  );
}
