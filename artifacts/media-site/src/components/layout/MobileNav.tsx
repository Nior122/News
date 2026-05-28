import React from "react";
import { Link, useLocation } from "wouter";
import { Home, TrendingUp, Cpu, Smartphone, Sparkles, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { useActiveCategory } from "@/contexts/ActiveCategoryContext";

// Maps every real category slug → the nav item slug it belongs to
const CATEGORY_TO_NAV: Record<string, string> = {
  tech: "tech",
  "phone-tips": "phone-tips",
  "ai-tools": "ai-productivity",
  productivity: "ai-productivity",
  "ai-productivity": "ai-productivity",
  culture: "culture-lifestyle",
  lifestyle: "culture-lifestyle",
  "culture-lifestyle": "culture-lifestyle",
  trending: "trending",
};

const NAV_ITEMS = [
  {
    href: "/",
    label: "Home",
    icon: Home,
    navSlug: "home",
  },
  {
    href: "/category/tech",
    label: "Tech",
    icon: Cpu,
    navSlug: "tech",
  },
  {
    href: "/category/phone-tips",
    label: "Phone Tips",
    icon: Smartphone,
    navSlug: "phone-tips",
  },
  {
    href: "/category/ai-productivity",
    label: "AI & More",
    icon: Sparkles,
    navSlug: "ai-productivity",
  },
  {
    href: "/category/culture-lifestyle",
    label: "Culture",
    icon: Globe,
    navSlug: "culture-lifestyle",
  },
  {
    href: "/category/trending",
    label: "Trending",
    icon: TrendingUp,
    navSlug: "trending",
  },
];

export function MobileNav() {
  const [location] = useLocation();
  const { activeCategory } = useActiveCategory();

  // Resolve which nav slug is active for the current page
  function getActiveNavSlug(): string | null {
    if (location === "/") return "home";

    // Category page — extract slug and map to nav slug
    const catMatch = location.match(/^\/category\/([^/?#]+)/);
    if (catMatch) {
      const slug = catMatch[1];
      return CATEGORY_TO_NAV[slug] ?? null;
    }

    // Article page — use the category set by ArticlePage via context
    if (location.startsWith("/article/") && activeCategory) {
      return CATEGORY_TO_NAV[activeCategory] ?? null;
    }

    return null;
  }

  const activeNavSlug = getActiveNavSlug();

  return (
    <div
      className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-background/98 backdrop-blur-md border-t border-border/50"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <nav className="flex items-center justify-around px-1" style={{ height: "56px" }}>
        {NAV_ITEMS.map(({ href, label, icon: Icon, navSlug }) => {
          const isActive = activeNavSlug === navSlug;
          return (
            <Link
              key={href}
              href={href}
              aria-label={label}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex flex-col items-center justify-center gap-1 flex-1 h-full min-w-0",
                "touch-manipulation select-none transition-opacity duration-100 active:opacity-60",
                isActive ? "text-primary" : "text-muted-foreground",
              )}
            >
              <div
                className={cn(
                  "flex items-center justify-center rounded-2xl transition-all duration-200",
                  "w-12 h-7",
                  isActive ? "bg-primary/12" : "bg-transparent",
                )}
              >
                <Icon
                  className={cn(
                    "transition-all duration-200",
                    isActive
                      ? "h-[19px] w-[19px] stroke-[2.4px]"
                      : "h-[18px] w-[18px] stroke-[1.7px]",
                  )}
                />
              </div>
              <span
                className={cn(
                  "text-[9.5px] font-semibold leading-none tracking-wide truncate max-w-[52px] text-center",
                  isActive ? "opacity-100" : "opacity-55",
                )}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
