import React from "react";
import { Link, useLocation } from "wouter";
import { Home, TrendingUp, Grid, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const [location] = useLocation();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur border-t border-border/40 pb-safe">
      <nav className="flex items-center justify-around h-16 px-4">
        <Link 
          href="/" 
          className={cn(
            "flex flex-col items-center justify-center w-full h-full gap-1 text-muted-foreground hover:text-foreground transition-colors",
            location === "/" && "text-primary"
          )}
        >
          <Home className="h-5 w-5" />
          <span className="text-[10px] font-medium">Home</span>
        </Link>
        <Link 
          href="/category/trending" 
          className={cn(
            "flex flex-col items-center justify-center w-full h-full gap-1 text-muted-foreground hover:text-foreground transition-colors",
            location === "/category/trending" && "text-primary"
          )}
        >
          <TrendingUp className="h-5 w-5" />
          <span className="text-[10px] font-medium">Trending</span>
        </Link>
        <Link 
          href="/search" 
          className={cn(
            "flex flex-col items-center justify-center w-full h-full gap-1 text-muted-foreground hover:text-foreground transition-colors",
            location === "/search" && "text-primary"
          )}
        >
          <Search className="h-5 w-5" />
          <span className="text-[10px] font-medium">Search</span>
        </Link>
      </nav>
    </div>
  );
}