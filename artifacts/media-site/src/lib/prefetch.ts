import {
  getGetArticleQueryOptions,
  getListArticlesQueryOptions,
  getListRelatedArticlesQueryOptions,
  getListTrendingArticlesQueryOptions,
} from "@workspace/api-client-react";
import { queryClient } from "@/lib/query-client";

const prefetchedSlugs = new Set<string>();
const prefetchedCategories = new Set<string>();
const prefetchedAuthors = new Set<string>();

export function prefetchArticle(slug: string) {
  if (!slug || prefetchedSlugs.has(slug)) return;
  prefetchedSlugs.add(slug);

  void queryClient.prefetchQuery({
    ...getGetArticleQueryOptions(slug),
    staleTime: 10 * 60_000,
  });
  void queryClient.prefetchQuery({
    ...getListRelatedArticlesQueryOptions(slug),
    staleTime: 10 * 60_000,
  });
}

export function prefetchCategory(slug: string) {
  if (!slug || prefetchedCategories.has(slug)) return;
  prefetchedCategories.add(slug);

  void import("@/pages/CategoryPage");

  if (slug === "trending") {
    void queryClient.prefetchQuery({
      ...getListTrendingArticlesQueryOptions({ limit: 20 } as never),
      staleTime: 10 * 60_000,
    });
    return;
  }

  if (slug === "ai-productivity" || slug === "culture-lifestyle") {
    const subs =
      slug === "ai-productivity"
        ? ["ai-tools", "productivity"]
        : ["culture", "lifestyle"];
    for (const sub of subs) {
      void queryClient.prefetchQuery({
        ...getListArticlesQueryOptions({ category: sub, limit: 50 }),
        staleTime: 10 * 60_000,
      });
    }
    return;
  }

  void queryClient.prefetchQuery({
    ...getListArticlesQueryOptions({ category: slug, page: 1, limit: 12 }),
    staleTime: 10 * 60_000,
  });
}

export function prefetchAuthor(slug: string) {
  if (!slug || prefetchedAuthors.has(slug)) return;
  prefetchedAuthors.add(slug);

  void import("@/pages/AuthorPage");
  void queryClient.prefetchQuery({
    queryKey: ["author", slug],
    queryFn: async () => {
      const res = await fetch(`/api/authors/${slug}`);
      if (!res.ok) throw new Error("Author not found");
      return res.json();
    },
    staleTime: 10 * 60_000,
  });
}

export function prefetchStaticRoute(path: string) {
  if (path === "/about") void import("@/pages/AboutPage");
  else if (path === "/contact") void import("@/pages/ContactPage");
  else if (path === "/privacy") void import("@/pages/PrivacyPage");
  else if (path === "/search") void import("@/pages/SearchPage");
}
