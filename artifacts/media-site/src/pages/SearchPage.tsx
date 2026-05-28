import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useSearchArticles, getSearchArticlesQueryKey } from "@workspace/api-client-react";
import { ArticleCard } from "@/components/ArticleCard";
import { Input } from "@/components/ui/input";
import { Search as SearchIcon, Loader2 } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import { usePageMeta } from "@/hooks/usePageMeta";

export default function SearchPage() {
  const [location] = useLocation();

  const getQueryFromUrl = () => {
    const searchParams = new URLSearchParams(window.location.search);
    return searchParams.get("q") || "";
  };

  const [query, setQuery] = useState(getQueryFromUrl);
  const debouncedQuery = useDebounce(query, 400);

  // Re-sync query whenever the URL changes (e.g. clicking a tag from an article)
  useEffect(() => {
    setQuery(getQueryFromUrl());
  }, [location]);

  const { data, isLoading, isFetching } = useSearchArticles(
    { q: debouncedQuery },
    {
      query: {
        enabled: debouncedQuery.length > 0,
        queryKey: getSearchArticlesQueryKey({ q: debouncedQuery }),
      },
    }
  );

  useEffect(() => {
    if (debouncedQuery) {
      window.history.replaceState(null, "", `/search?q=${encodeURIComponent(debouncedQuery)}`);
    } else {
      window.history.replaceState(null, "", `/search`);
    }
  }, [debouncedQuery]);

  usePageMeta({
    title: debouncedQuery ? `Search: "${debouncedQuery}"` : "Search",
    description: debouncedQuery
      ? `Scrolltek search results for "${debouncedQuery}" — tech, culture, lifestyle, AI tools and more.`
      : "Search Scrolltek for articles on tech, culture, lifestyle, AI tools, phone tips, productivity and trending topics.",
  });

  return (
    <div className="min-h-screen pb-16">
      <div className="bg-muted py-12 border-b border-border">
        <div className="container max-w-screen-md mx-auto px-4">
          <div className="relative">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-6 w-6" />
            <Input
              autoFocus
              className="w-full pl-12 h-16 text-lg font-medium rounded-full bg-background border-2 border-border focus-visible:ring-primary focus-visible:border-primary shadow-sm"
              placeholder="Search articles, topics, tags, or authors..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {isFetching && debouncedQuery && (
              <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5 animate-spin" />
            )}
          </div>
        </div>
      </div>

      <div className="container max-w-screen-2xl mx-auto px-4 md:px-8 mt-12">
        {debouncedQuery.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <SearchIcon className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <h2 className="text-xl font-medium">Type something to start searching</h2>
            <p className="text-sm mt-2">Search by article title, topic, tag, or author name</p>
          </div>
        ) : isLoading && isFetching ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse bg-card rounded-xl aspect-[4/3] border border-border" />
            ))}
          </div>
        ) : data?.articles && data.articles.length > 0 ? (
          <>
            <h2 className="font-display font-bold text-2xl mb-8">
              {data.total} result{data.total !== 1 ? "s" : ""} for &ldquo;{debouncedQuery}&rdquo;
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
              {data.articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20 text-muted-foreground">
            <h2 className="text-xl font-medium mb-2">
              No results found for &ldquo;{debouncedQuery}&rdquo;
            </h2>
            <p>Try different keywords, a tag name, or check your spelling.</p>
          </div>
        )}
      </div>
    </div>
  );
}
