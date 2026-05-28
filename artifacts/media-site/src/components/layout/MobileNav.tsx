import React from "react";
import { Link, useLocation } from "wouter";
import { Home, TrendingUp, Cpu, Smartphone, Layers, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/category/tech", label: "Tech", icon: Cpu },
  { href: "/category/trending", label: "Trending", icon: TrendingUp },
  { href: "/category/ai-productivity", label: "AI", icon: Layers },
  { href: "/category/culture-lifestyle", label: "Lifestyle", icon: Sparkles },
  { href: "/category/phone-tips", label: "Gadgets", icon: Smartphone },
];

export function MobileNav() {
  const [location] = useLocation();

  return (
    <div
      className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-background/98 backdrop-blur-md border-t border-border/50"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <nav className="flex items-center justify-around px-1" style={{ height: "56px" }}>
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive =
            href === "/" ? location === "/" : location.startsWith(href);
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
              {/* Pill indicator behind icon */}
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
