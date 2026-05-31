import React, { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Sun, Moon, ChevronDown } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LiveSearch } from "@/components/LiveSearch";

const CATEGORIES = [
  { label: "Tech", slug: "tech" },
  { label: "Culture", slug: "culture" },
  { label: "Lifestyle", slug: "lifestyle" },
  { label: "AI Tools", slug: "ai-tools" },
  { label: "Phone Tips", slug: "phone-tips" },
  { label: "Productivity", slug: "productivity" },
  { label: "Trending", slug: "trending" },
];

export function Header() {
  const { theme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4 md:px-8">
          {/* Logo */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center space-x-2">
              <span className="font-display font-bold text-2xl tracking-tighter text-primary">
                Scrolltek
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
              {CATEGORIES.map(({ label, slug }) => {
                const isActive = location === `/category/${slug}`;
                return (
                  <Link
                    key={slug}
                    href={`/category/${slug}`}
                    className={cn(
                      "px-3 py-2 rounded-md transition-colors hover:bg-muted hover:text-foreground",
                      isActive
                        ? "text-primary font-semibold bg-primary/5"
                        : "text-muted-foreground"
                    )}
                  >
                    {label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right icons */}
          <div className="flex items-center gap-1">
            {/* Live search — visible on all screen sizes */}
            <LiveSearch />

            {/* Theme toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            {/* Hamburger — mobile only */}
            <button
              type="button"
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-muted transition-colors"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((o) => !o)}
            >
              {mobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile menu ── rendered outside header so no clipping */}
      {mobileOpen && (
        <>
          {/* Dark backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/60 md:hidden"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer panel */}
          <div
            className="fixed left-0 right-0 top-16 z-50 md:hidden bg-background border-b border-border shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            <nav className="px-4 pt-4 pb-6 flex flex-col gap-1">
              {/* Home */}
              <Link
                href="/"
                className={cn(
                  "flex items-center px-4 py-3 rounded-xl text-base font-semibold transition-colors",
                  location === "/"
                    ? "bg-primary/10 text-primary"
                    : "text-foreground hover:bg-muted"
                )}
              >
                Home
              </Link>

              <div className="h-px bg-border mx-1 my-2" />
              <p className="px-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
                Categories
              </p>

              {/* Category links */}
              {CATEGORIES.map(({ label, slug }) => {
                const isActive = location === `/category/${slug}`;
                return (
                  <Link
                    key={slug}
                    href={`/category/${slug}`}
                    className={cn(
                      "flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium transition-colors",
                      isActive
                        ? "bg-primary/10 text-primary font-semibold"
                        : "text-foreground hover:bg-muted"
                    )}
                  >
                    {label}
                    <ChevronDown className="w-4 h-4 -rotate-90 opacity-40" />
                  </Link>
                );
              })}

              <div className="h-px bg-border mx-1 my-2" />

              {/* Extra links */}
              <Link
                href="/about"
                className={cn(
                  "flex items-center px-4 py-3 rounded-xl text-base font-medium transition-colors",
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
                  "flex items-center px-4 py-3 rounded-xl text-base font-medium transition-colors",
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
      )}
    </>
  );
}
