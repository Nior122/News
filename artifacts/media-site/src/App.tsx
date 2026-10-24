import React, { Suspense, lazy, useEffect, useState } from "react";
import { Switch, Route, useLocation, Router as WouterRouter } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/theme-provider";
import { ActiveCategoryProvider } from "@/contexts/ActiveCategoryContext";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { queryClient } from "@/lib/query-client";

import Home from "@/pages/Home";

const loadArticlePage = () => import("@/pages/ArticlePage");
if (typeof window !== "undefined" && window.location.pathname.startsWith("/article/")) {
  loadArticlePage();
}

const ArticlePage = lazy(loadArticlePage);
const CategoryPage = lazy(() => import("@/pages/CategoryPage"));
const AuthorPage = lazy(() => import("@/pages/AuthorPage"));
const AboutPage = lazy(() => import("@/pages/AboutPage"));
const ContactPage = lazy(() => import("@/pages/ContactPage"));
const PrivacyPage = lazy(() => import("@/pages/PrivacyPage"));
const SearchPage = lazy(() => import("@/pages/SearchPage"));
const NotFound = lazy(() => import("@/pages/not-found"));
const AdminLogin = lazy(() => import("@/pages/admin/AdminLogin"));
const AdminDashboard = lazy(() => import("@/pages/admin/AdminDashboard"));
const LazyToaster = lazy(() =>
  import("@/components/ui/toaster").then((m) => ({ default: m.Toaster })),
);

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  return null;
}

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary selection:text-primary-foreground pb-[calc(56px+env(safe-area-inset-bottom))] md:pb-0">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <MobileNav />
    </div>
  );
}

function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
    </div>
  );
}

function DeferredToaster() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const win = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    if (typeof win.requestIdleCallback === "function") {
      const id = win.requestIdleCallback(
        () => {
          setReady(true);
          loadArticlePage();
        },
        { timeout: 2500 },
      );
      return () => {
        if (typeof win.cancelIdleCallback === "function") {
          win.cancelIdleCallback(id);
        }
      };
    }
    const timer = window.setTimeout(() => {
      setReady(true);
      loadArticlePage();
    }, 1500);
    return () => window.clearTimeout(timer);
  }, []);

  if (!ready) return null;
  return (
    <Suspense fallback={null}>
      <LazyToaster />
    </Suspense>
  );
}

function Router() {
  return (
    <>
      <ScrollToTop />
      <Switch>
        <Route path="/admin/login">
          <Suspense fallback={<PageLoader />}>
            <AdminLogin />
          </Suspense>
        </Route>
        <Route path="/admin">
          <Suspense fallback={<PageLoader />}>
            <AdminDashboard />
          </Suspense>
        </Route>

        <Route>
          <PublicLayout>
            <Suspense fallback={<PageLoader />}>
              <Switch>
                <Route path="/" component={Home} />
                <Route path="/article/:slug" component={ArticlePage} />
                <Route path="/category/:slug" component={CategoryPage} />
                <Route path="/author/:slug" component={AuthorPage} />
                <Route path="/about" component={AboutPage} />
                <Route path="/contact" component={ContactPage} />
                <Route path="/privacy" component={PrivacyPage} />
                <Route path="/search" component={SearchPage} />
                <Route component={NotFound} />
              </Switch>
            </Suspense>
          </PublicLayout>
        </Route>
      </Switch>
    </>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="scrolltek-theme-v2">
      <ActiveCategoryProvider>
        <QueryClientProvider client={queryClient}>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <DeferredToaster />
        </QueryClientProvider>
      </ActiveCategoryProvider>
    </ThemeProvider>
  );
}

export default App;
