import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "wouter";
import { Search, X, Loader2, ArrowRight } from "lucide-react";
import { useSearchArticles, getSearchArticlesQueryKey } from "@workspace/api-client-react";
import { useDebounce } from "@/hooks/use-debounce";
import { CategoryBadge } from "@/components/ArticleCard";
import { cn } from "@/lib/utils";

export function LiveSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);
  const inputRef = useRef<HTMLInputElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [, navigate] = useLocation();

  const { data, isFetching } = useSearchArticles(
    { q: debouncedQuery, limit: 6 },
    {
      query: {
        enabled: debouncedQuery.trim().length >= 1,
        queryKey: getSearchArticlesQueryKey({ q: debouncedQuery, limit: 6 }),
      },
    }
  );

  const openSearch = useCallback(() => {
    setOpen(true);
    setQuery("");
  }, []);

  const closeSearch = useCallback(() => {
    setOpen(false);
    setQuery("");
  }, []);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeSearch();
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        open ? closeSearch() : openSearch();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, openSearch, closeSearch]);

  const handleResultClick = (slug: string) => {
    navigate(`/article/${slug}`);
    closeSearch();
  };

  const handleSeeAll = () => {
    navigate(`/search?q=${encodeURIComponent(debouncedQuery)}`);
    closeSearch();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      closeSearch();
    }
  };

  const articles = data?.articles ?? [];
  const total = data?.total ?? 0;
  const showResults = debouncedQuery.trim().length >= 1;

  return (
    <>
      <button
        type="button"
        onClick={openSearch}
        aria-label="Search"
        className="inline-flex items-center justify-center h-9 w-9 rounded-md hover:bg-muted transition-colors"
      >
        <Search className="h-5 w-5" />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex flex-col items-center"
          role="dialog"
          aria-modal="true"
          aria-label="Search"
        >
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeSearch}
            aria-hidden="true"
          />

          <div
            ref={overlayRef}
            className="relative z-10 w-full max-w-2xl mx-auto mt-[80px] px-4"
          >
            <form onSubmit={handleSubmit} className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5 pointer-events-none" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search articles, topics, tags, authors…"
                className="w-full h-14 pl-12 pr-12 text-base bg-background border-2 border-border rounded-2xl shadow-2xl outline-none focus:border-primary transition-colors"
              />
              {isFetching && debouncedQuery ? (
                <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5 animate-spin" />
              ) : query ? (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Clear"
                >
                  <X className="h-5 w-5" />
                </button>
              ) : null}
            </form>

            {showResults && (
              <div className="mt-2 bg-background border border-border rounded-2xl shadow-2xl overflow-hidden">
                {articles.length > 0 ? (
                  <>
                    <ul className="divide-y divide-border">
                      {articles.map((article) => (
                        <li key={article.id}>
                          <button
                            type="button"
                            onClick={() => handleResultClick(article.slug)}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors text-left"
                          >
                            <div className="shrink-0 w-16 h-12 rounded-lg overflow-hidden bg-muted">
                              <img
                                src={article.imageUrl}
                                alt=""
                                className="w-full h-full object-cover"
                                loading="lazy"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold line-clamp-1 text-foreground">
                                {article.title}
                              </p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <CategoryBadge
                                  category={article.category}
                                  className="text-[10px] px-1.5 py-0 h-4 pointer-events-none"
                                />
                                <span className="text-xs text-muted-foreground truncate">
                                  {article.author.name}
                                </span>
                              </div>
                            </div>
                            <ArrowRight className="shrink-0 h-4 w-4 text-muted-foreground" />
                          </button>
                        </li>
                      ))}
                    </ul>
                    <button
                      type="button"
                      onClick={handleSeeAll}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-primary hover:bg-primary/5 transition-colors border-t border-border"
                    >
                      See all {total} result{total !== 1 ? "s" : ""} for &ldquo;{debouncedQuery}&rdquo;
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </>
                ) : !isFetching ? (
                  <div className="px-4 py-8 text-center text-muted-foreground">
                    <p className="text-sm font-medium">No results for &ldquo;{debouncedQuery}&rdquo;</p>
                    <p className="text-xs mt-1">Try different keywords or check your spelling</p>
                  </div>
                ) : null}
              </div>
            )}

            {!showResults && (
              <p className="mt-3 text-center text-xs text-white/50">
                Press <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-white/70 font-mono">Esc</kbd> to close
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
