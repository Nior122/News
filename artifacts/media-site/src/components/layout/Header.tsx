import React, { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Search, Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
  const [mobileOpen, setMobileOpen] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center space-x-2">
              <span className="font-display font-bold text-2xl tracking-tighter text-primary">
                Scrolltek
              </span>
            </Link>
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
              {CATEGORIES.map((cat) => {
                const slug = cat.toLowerCase().replace(/\s+/g, "-");
                const isActive = location === `/category/${slug}`;
                return (
                  <Link
                    key={slug}
                    href={`/category/${slug}`}
                    className={cn(
                      "transition-colors hover:text-primary",
                      isActive ? "text-primary font-semibold" : "text-muted-foreground"
                    )}
                  >
                    {cat}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/search" className="hidden md:flex">
              <Button variant="ghost" size="icon" aria-label="Search">
                <Search className="h-5 w-5" />
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              onClick={() => setMobileOpen((o) => !o)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile menu drawer */}
      <div
        className={cn(
          "fixed top-16 left-0 right-0 z-40 md:hidden bg-background border-b border-border shadow-xl transition-transform duration-300 ease-in-out",
          mobileOpen ? "translate-y-0" : "-translate-y-full pointer-events-none"
        )}
      >
        <nav className="container max-w-screen-2xl px-4 py-6 flex flex-col gap-1">
          <Link
            href="/"
            className={cn(
              "flex items-center px-3 py-3 rounded-lg text-base font-medium transition-colors",
              location === "/"
                ? "bg-primary/10 text-primary"
                : "text-foreground hover:bg-muted"
            )}
          >
            Home
          </Link>
          <div className="h-px bg-border my-2" />
          <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
            Categories
          </p>
          {CATEGORIES.map((cat) => {
            const slug = cat.toLowerCase().replace(/\s+/g, "-");
            const isActive = location === `/category/${slug}`;
            return (
              <Link
                key={slug}
                href={`/category/${slug}`}
                className={cn(
                  "flex items-center px-3 py-3 rounded-lg text-base font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-foreground hover:bg-muted"
                )}
              >
                {cat}
              </Link>
            );
          })}
          <div className="h-px bg-border my-2" />
          <Link
            href="/search"
            className={cn(
              "flex items-center gap-2 px-3 py-3 rounded-lg text-base font-medium transition-colors",
              location === "/search"
                ? "bg-primary/10 text-primary"
                : "text-foreground hover:bg-muted"
            )}
          >
            <Search className="h-4 w-4" />
            Search
          </Link>
          <Link
            href="/about"
            className={cn(
              "flex items-center px-3 py-3 rounded-lg text-base font-medium transition-colors",
              location === "/about"
                ? "bg-primary/10 text-primary"
                : "text-foreground hover:bg-muted"
            )}
          >
            About
          </Link>
          <Link
            href="/contact"
            className={cn(
              "flex items-center px-3 py-3 rounded-lg text-base font-medium transition-colors",
              location === "/contact"
                ? "bg-primary/10 text-primary"
                : "text-foreground hover:bg-muted"
            )}
          >
            Contact
          </Link>
        </nav>
      </div>
    </>
  );
}
