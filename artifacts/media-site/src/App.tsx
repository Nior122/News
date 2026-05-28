import React, { Suspense, lazy, Component, type ReactNode } from "react";
import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";

class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null };
  static getDerivedStateFromError(error: Error) { return { error }; }
  render() {
    if (this.state.error) {
      return (
        <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#0a0a0f", color: "#f5f5f5", fontFamily: "system-ui, sans-serif", padding: "2rem", textAlign: "center" }}>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.5rem" }}>Something went wrong</h1>
          <pre style={{ color: "#f87171", background: "#1a1a1a", padding: "1rem", borderRadius: "0.5rem", fontSize: "0.75rem", textAlign: "left", maxWidth: "90vw", overflowX: "auto", marginBottom: "1.5rem", whiteSpace: "pre-wrap", wordBreak: "break-all" }}>{String(this.state.error)}</pre>
          <button onClick={() => window.location.reload()} style={{ background: "#3b82f6", color: "#fff", border: "none", borderRadius: "0.5rem", padding: "0.6rem 1.5rem", cursor: "pointer", fontSize: "1rem" }}>Refresh</button>
        </div>
      );
    }
    return this.props.children;
  }
}

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { ScrollToTop } from "@/components/ScrollToTop";
import { ActiveCategoryProvider } from "@/contexts/ActiveCategoryContext";

const Home = lazy(() => import("@/pages/Home"));
const ArticlePage = lazy(() => import("@/pages/ArticlePage"));
const CategoryPage = lazy(() => import("@/pages/CategoryPage"));
const SearchPage = lazy(() => import("@/pages/SearchPage"));
const AboutPage = lazy(() => import("@/pages/AboutPage"));
const ContactPage = lazy(() => import("@/pages/ContactPage"));
const PrivacyPage = lazy(() => import("@/pages/PrivacyPage"));
const NotFound = lazy(() => import("@/pages/not-found"));
const AdminLogin = lazy(() => import("@/pages/admin/AdminLogin"));
const AdminDashboard = lazy(() => import("@/pages/admin/AdminDashboard"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 60_000,
    },
  },
});

function PageSkeleton() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
    </div>
  );
}

function Router() {
  const [location] = useLocation();
  const isAdmin = location.startsWith("/admin");

  if (isAdmin) {
    return (
      <Suspense fallback={<PageSkeleton />}>
        <Switch>
          <Route path="/admin/login" component={AdminLogin} />
          <Route path="/admin" component={AdminDashboard} />
        </Switch>
      </Suspense>
    );
  }

  return (
    <ActiveCategoryProvider>
      <div className="flex min-h-screen flex-col bg-background text-foreground">
        <ScrollToTop />
        <Header />
        <main className="flex-1 pb-16 md:pb-0">
          <Suspense fallback={<PageSkeleton />}>
            <Switch>
              <Route path="/" component={Home} />
              <Route path="/article/:slug" component={ArticlePage} />
              <Route path="/category/:slug" component={CategoryPage} />
              <Route path="/search" component={SearchPage} />
              <Route path="/about" component={AboutPage} />
              <Route path="/contact" component={ContactPage} />
              <Route path="/privacy" component={PrivacyPage} />
              <Route component={NotFound} />
            </Switch>
          </Suspense>
        </main>
        <Footer />
        <MobileNav />
      </div>
    </ActiveCategoryProvider>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="dark" storageKey="scrolltek-theme">
          <TooltipProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <Router />
            </WouterRouter>
            <Toaster />
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
