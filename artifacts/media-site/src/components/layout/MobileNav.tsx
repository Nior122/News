import React from "react";
import { Link, useLocation } from "wouter";
import { Home, TrendingUp, Cpu, Search, Layers, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/category/tech", label: "Tech", icon: Cpu },
  { href: "/category/trending", label: "Trending", icon: TrendingUp },
  { href: "/category/lifestyle", label: "Lifestyle", icon: Heart },
  { href: "/category/ai-tools", label: "AI", icon: Layers },
  { href: "/search", label: "Search", icon: Search },
];

export function MobileNav() {
  const [location] = useLocation();

  return (
    <div
      className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-background/95 backdrop-blur border-t border-border/40"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <nav className="flex items-stretch justify-around h-[60px]">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive =
            href === "/"
              ? location === "/"
              : location.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center justify-center flex-1 gap-[3px] min-w-0 touch-manipulation select-none",
                "active:scale-95 transition-transform duration-100",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground active:text-foreground",
              )}
              aria-label={label}
              aria-current={isActive ? "page" : undefined}
            >
              <div
                className={cn(
                  "flex items-center justify-center w-10 h-6 rounded-full transition-colors duration-150",
                  isActive ? "bg-primary/15" : "",
                )}
              >
                <Icon
                  className={cn(
                    "h-[18px] w-[18px] transition-all duration-150",
                    isActive ? "stroke-[2.5px]" : "stroke-[1.75px]",
                  )}
                />
              </div>
              <span
                className={cn(
                  "text-[9px] font-semibold tracking-wide leading-none truncate",
                  isActive ? "opacity-100" : "opacity-60",
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
