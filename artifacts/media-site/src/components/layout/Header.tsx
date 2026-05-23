import React from "react";
import { Link } from "wouter";
import { Search, Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";

const CATEGORIES = [
  "Tech",
  "Culture",
  "Lifestyle",
  "AI Tools",
  "Phone Tips",
  "Productivity",
  "Trending",
];

export function Header() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-display font-bold text-2xl tracking-tighter text-primary">
              PulseWire
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {CATEGORIES.map((cat) => {
              const slug = cat.toLowerCase().replace(/\s+/g, "-");
              return (
                <Link
                  key={slug}
                  href={`/category/${slug}`}
                  className="transition-colors hover:text-primary"
                >
                  {cat}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/search" className="hidden md:flex">
            <Button variant="ghost" size="icon" aria-label="Search" data-testid="button-search-nav">
              <Search className="h-5 w-5" />
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            aria-label="Toggle theme"
            data-testid="button-theme-toggle"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden" aria-label="Menu" data-testid="button-mobile-menu">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}