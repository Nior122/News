import { QueryClient } from "@tanstack/react-query";
import {
  getGetArticleQueryKey,
  getListArticlesQueryKey,
  getListRelatedArticlesQueryKey,
  getListTickerHeadlinesQueryKey,
  getListTrendingArticlesQueryKey,
  type Article,
} from "@workspace/api-client-react";
import { MAX_ARTICLE_PAGE_SIZE } from "@/lib/api-limits";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 10 * 60_000,
      gcTime: 60 * 60_000,
    },
  },
});

const CATEGORY_NAME_TO_SLUG: Record<string, string> = {
  tech: "tech",
  culture: "culture",
  lifestyle: "lifestyle",
  "ai tools": "ai-tools",
  "phone tips": "phone-tips",
  productivity: "productivity",
  trending: "trending",
};

const ALL_REAL_CATEGORY_SLUGS = [
  "tech",
  "culture",
  "lifestyle",
  "ai-tools",
  "phone-tips",
  "productivity",
];

let hydratedArticlesPool: Article[] = [];

export function getHydratedArticlesPool(): Article[] {
  return hydratedArticlesPool;
}

function normalizeCategorySlug(category: string): string {
  return (
    CATEGORY_NAME_TO_SLUG[category.toLowerCase()] ??
    category.toLowerCase().replace(/\s+/g, "-")
  );
}

function seedCategorySlices(articles: Article[]) {
  for (const catSlug of ALL_REAL_CATEGORY_SLUGS) {
    const matching = articles.filter(
      (item) => normalizeCategorySlug(item.category) === catSlug,
    );
    queryClient.setQueryData(
      getListArticlesQueryKey({ category: catSlug, page: 1, limit: 12 }),
      {
        articles: matching.slice(0, 12),
        total: matching.length,
        page: 1,
        limit: 12,
        hasMore: matching.length > 12,
      },
    );
    queryClient.setQueryData(
      getListArticlesQueryKey({ category: catSlug, limit: 50 }),
      {
        articles: matching.slice(0, 50),
        total: matching.length,
        page: 1,
        limit: 50,
        hasMore: matching.length > 50,
      },
    );
  }

  const trending = [...articles]
    .sort(
      (a, b) =>
        (b.views || 0) - (a.views || 0) ||
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    )
    .slice(0, 20);
  queryClient.setQueryData(
    getListTrendingArticlesQueryKey({ limit: 20 } as never),
    trending,
  );
}

type SsrHydrationPayload =
  | { kind: "home"; articles: Article[] }
  | { kind: "article"; article: Article; related: Article[] }
  | { kind: "category"; slug: string; articles: Article[] }
  | { kind: "author"; slug: string; authorData: unknown };

function seedQueryClientFromSsr() {
  if (typeof document === "undefined") return;
  const el = document.getElementById("ssr-data");
  if (!el) return;

  try {
    const raw = el.textContent;
    el.remove();
    if (!raw) return;
    const payload = JSON.parse(raw) as SsrHydrationPayload;

    if (payload.kind === "home" && Array.isArray(payload.articles)) {
      const articles = payload.articles;
      hydratedArticlesPool = articles;
      const total = articles.length;

      queryClient.setQueryData(
        getListArticlesQueryKey({ limit: MAX_ARTICLE_PAGE_SIZE }),
        {
          articles: articles.slice(0, MAX_ARTICLE_PAGE_SIZE),
          total,
          page: 1,
          limit: MAX_ARTICLE_PAGE_SIZE,
          hasMore: total > MAX_ARTICLE_PAGE_SIZE,
        },
      );
      queryClient.setQueryData(getListArticlesQueryKey({ page: 1, limit: 9 }), {
        articles: articles.slice(0, 9),
        total,
        page: 1,
        limit: 9,
        hasMore: total > 9,
      });
      queryClient.setQueryData(
        getListTickerHeadlinesQueryKey(),
        articles.slice(0, 10).map((item) => ({
          id: item.id,
          slug: item.slug,
          title: item.title,
          category: item.category,
        })),
      );
      seedCategorySlices(articles);
      return;
    }

    if (payload.kind === "article" && payload.article?.slug) {
      queryClient.setQueryData(
        getGetArticleQueryKey(payload.article.slug),
        payload.article,
      );
      if (Array.isArray(payload.related)) {
        queryClient.setQueryData(
          getListRelatedArticlesQueryKey(payload.article.slug),
          payload.related,
        );
      }
      return;
    }

    if (payload.kind === "category" && payload.slug && Array.isArray(payload.articles)) {
      const { slug, articles } = payload;
      hydratedArticlesPool = articles;
      if (slug === "trending") {
        queryClient.setQueryData(
          getListTrendingArticlesQueryKey({ limit: 20 } as never),
          articles.slice(0, 20),
        );
        return;
      }
      if (slug === "ai-productivity" || slug === "culture-lifestyle") {
        const subSlugs =
          slug === "ai-productivity"
            ? ["ai-tools", "productivity"]
            : ["culture", "lifestyle"];
        for (const subSlug of subSlugs) {
          const matching = articles.filter(
            (item) => normalizeCategorySlug(item.category) === subSlug,
          );
          queryClient.setQueryData(
            getListArticlesQueryKey({ category: subSlug, limit: 50 }),
            {
              articles: matching.slice(0, 50),
              total: matching.length,
              page: 1,
              limit: 50,
              hasMore: matching.length > 50,
            },
          );
        }
        return;
      }
      queryClient.setQueryData(
        getListArticlesQueryKey({ category: slug, page: 1, limit: 12 }),
        {
          articles: articles.slice(0, 12),
          total: articles.length,
          page: 1,
          limit: 12,
          hasMore: articles.length > 12,
        },
      );
      queryClient.setQueryData(
        getListArticlesQueryKey({ category: slug, limit: 50 }),
        {
          articles: articles.slice(0, 50),
          total: articles.length,
          page: 1,
          limit: 50,
          hasMore: articles.length > 50,
        },
      );
      return;
    }

    if (payload.kind === "author" && payload.slug && payload.authorData) {
      queryClient.setQueryData(["author", payload.slug], payload.authorData);
    }
  } catch {
    // Ignore malformed hydration payloads; regular queries remain as fallback.
  }
}

seedQueryClientFromSsr();
