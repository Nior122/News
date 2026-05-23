import React from "react";
import { Link, useLocation } from "wouter";
import { Home, TrendingUp, Cpu, Search, Layers } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/category/tech", label: "Tech", icon: Cpu },
  { href: "/category/trending", label: "Trending", icon: TrendingUp },
  { href: "/category/ai-tools", label: "AI", icon: Layers },
  { href: "/search", label: "Search", icon: Search },
];

export function MobileNav() {
  const [location] = useLocation();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-background/95 backdrop-blur border-t border-border/40 pb-safe">
      <nav className="flex items-center justify-around h-16 px-2">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = location === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
