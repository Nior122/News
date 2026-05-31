import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useRoute, Link, useLocation } from "wouter";
import { useGetArticle, getGetArticleQueryKey, useListRelatedArticles, getListRelatedArticlesQueryKey } from "@workspace/api-client-react";
import { usePageMeta } from "@/hooks/usePageMeta";
import { ArticleCard, CategoryBadge } from "@/components/ArticleCard";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowUp, BookmarkPlus, Twitter, Facebook, Linkedin, Clock, Share2, CalendarClock, List, ChevronDown, ChevronUp, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useActiveCategory } from "@/contexts/ActiveCategoryContext";
import { useToast } from "@/hooks/use-toast";
import { nameToSlug } from "@/data/authors";
import { getArticleFaqs } from "@/data/faqs";

function JsonLd({ data }: { data: Record<string, unknown> }) {
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "article-jsonld";
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
    return () => {
      document.getElementById("article-jsonld")?.remove();
    };
  }, [data]);
  return null;
}

function ShareButtons({ url, title, className }: { url: string; title: string; className?: string }) {
  const encoded = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const shareTwitter = () => window.open(`https://twitter.com/intent/tweet?url=${encoded}&text=${encodedTitle}`, "_blank", "noopener");
  const shareFacebook = () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encoded}`, "_blank", "noopener");
  const shareLinkedIn = () => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`, "_blank", "noopener");
  const copyLink = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      toast({ title: "Link copied!", description: "The article link is ready to paste." });
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      toast({ title: "Couldn't copy", description: "Please copy the URL from your browser.", variant: "destructive" });
    });
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Button onClick={shareTwitter} variant="ghost" size="icon" aria-label="Share on Twitter" className="rounded-full bg-card shadow-sm border border-border hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all">
        <Twitter className="w-4 h-4" />
      </Button>
      <Button onClick={shareFacebook} variant="ghost" size="icon" aria-label="Share on Facebook" className="rounded-full bg-card shadow-sm border border-border hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all">
        <Facebook className="w-4 h-4" />
      </Button>
      <Button onClick={shareLinkedIn} variant="ghost" size="icon" aria-label="Share on LinkedIn" className="rounded-full bg-card shadow-sm border border-border hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all">
        <Linkedin className="w-4 h-4" />
      </Button>
      <Button
        onClick={copyLink}
        variant="ghost"
        size="icon"
        aria-label="Copy link"
        className={cn(
          "rounded-full bg-card shadow-sm border transition-all",
          copied
            ? "border-green-500/40 bg-green-500/10 text-green-500"
            : "border-border hover:bg-primary/10 hover:text-primary hover:border-primary/30"
        )}
      >
        {copied ? <Check className="w-4 h-4" /> : <BookmarkPlus className="w-4 h-4" />}
      </Button>
    </div>
  );
}

interface TocEntry {
  id: string;
  text: string;
  level: number;
}

interface FaqEntry {
  question: string;
  answer: string;
}

function isFaqHeading(text: string) {
  return /faq|frequently asked/i.test(text);
}

function processBody(html: string): { processed: string; toc: TocEntry[]; faq: FaqEntry[] } {
  if (typeof document === "undefined") return { processed: html, toc: [], faq: [] };

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  // Extract FAQ from <details>/<summary> blocks and remove them (+ any FAQ heading) from the body
  const faq: FaqEntry[] = [];
  const details = doc.querySelectorAll("details");
  details.forEach((d) => {
    const summary = d.querySelector("summary");
    const question = summary?.textContent?.trim() || "";
    summary?.remove();
    const answer = d.innerHTML.trim();
    if (question) faq.push({ question, answer });
    d.remove();
  });

  // Remove standalone FAQ headings from body so they don't appear in TOC or prose
  doc.querySelectorAll("h2, h3").forEach((el) => {
    if (isFaqHeading(el.textContent?.trim() || "")) {
      el.remove();
    }
  });

  // Build TOC from remaining headings (FAQ headings already removed above)
  const toc: TocEntry[] = [];
  let headingIndex = 0;
  doc.querySelectorAll("h2, h3").forEach((el) => {
    const text = el.textContent?.trim() || "";
    const slug = text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .slice(0, 60) || `heading-${headingIndex}`;
    const id = `toc-${slug}-${headingIndex}`;
    el.setAttribute("id", id);
    toc.push({ id, text, level: parseInt(el.tagName[1]) });
    headingIndex++;
  });

  return {
    processed: doc.body.innerHTML,
    toc,
    faq,
  };
}

function TableOfContents({ toc }: { toc: TocEntry[] }) {
  const [open, setOpen] = useState(true);

  if (toc.length < 3) return null;

  return (
    <div className="my-8 rounded-xl border border-border bg-muted/50 overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left hover:bg-muted/80 transition-colors"
        aria-expanded={open}
      >
        <span className="flex items-center gap-2 font-semibold text-sm">
          <List className="w-4 h-4 text-primary shrink-0" />
          Table of Contents
        </span>
        {open ? <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />}
      </button>
      {open && (
        <ol className="px-5 pb-4 space-y-1.5 border-t border-border/60">
          {toc.map((entry, i) => (
            <li
              key={entry.id}
              className={cn(
                "text-sm leading-snug",
                entry.level === 3 && "pl-4"
              )}
            >
              <a
                href={`#${entry.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(entry.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className="flex items-start gap-2 text-muted-foreground hover:text-primary transition-colors py-0.5 group"
              >
                <span className="shrink-0 text-primary/50 font-mono text-xs mt-0.5 group-hover:text-primary transition-colors">
                  {entry.level === 2 ? String(i + 1).padStart(2, "0") : "↳"}
                </span>
                <span>{entry.text}</span>
              </a>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

function FaqSection({ faq }: { faq: FaqEntry[] }) {
  if (faq.length === 0) return null;

  return (
    <div className="mt-12 pt-8 border-t border-border">
      <h2 className="font-display text-xl font-bold mb-6">
        Frequently Asked Questions
      </h2>
      <div className="space-y-6">
        {faq.map((item, i) => (
          <div key={i} className="rounded-xl border border-border bg-card px-5 py-5">
            <p className="font-semibold text-sm leading-snug mb-2">{item.question}</p>
            <p className="text-sm text-muted-foreground leading-relaxed">{item.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ArticlePage() {
  const [, params] = useRoute("/article/:slug");
  const slug = params?.slug || "";
  const [, navigate] = useLocation();
  const { setActiveCategory } = useActiveCategory();

  const { data: article, isLoading } = useGetArticle(slug, {
    query: {
      enabled: !!slug,
      queryKey: getGetArticleQueryKey(slug),
    },
  });

  const { data: related, isLoading: relatedLoading } = useListRelatedArticles(slug, {
    query: {
      enabled: !!slug,
      queryKey: getListRelatedArticlesQueryKey(slug),
    },
  });

  usePageMeta({
    title: article?.title,
    description: article?.excerpt ?? undefined,
    ogImage: article?.imageUrl ?? undefined,
    ogImageWidth: 1200,
    ogImageHeight: 630,
    ogType: "article",
    canonical: article ? `${window.location.origin}/article/${article.slug}` : undefined,
  });

  useEffect(() => {
    if (article?.category) {
      setActiveCategory(article.category.toLowerCase().replace(/\s+/g, "-"));
    }
    return () => setActiveCategory(null);
  }, [article?.category, setActiveCategory]);

  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);

  const handleBodyClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const target = (e.target as HTMLElement).closest('a.article-backlink');
    if (!target) return;
    e.preventDefault();
    const href = target.getAttribute('href');
    if (href) navigate(href);
  }, [navigate]);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
      setScrollProgress(Math.min(progress, 100));
      setShowBackToTop(window.scrollY > 600);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const { processed: processedBody, toc, faq } = useMemo(() => {
    const result = article?.body
      ? processBody(article.body)
      : { processed: "", toc: [], faq: [] };
    const staticFaqs = article?.slug ? getArticleFaqs(article.slug) : [];
    return { ...result, faq: [...result.faq, ...staticFaqs] };
  }, [article?.body, article?.slug]);

  if (isLoading) {
    return (
      <div className="container max-w-screen-xl px-4 py-8">
        <Skeleton className="w-full h-[50vh] rounded-2xl mb-8" />
        <div className="max-w-2xl mx-auto space-y-4">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-48 mt-6" />
          <div className="mt-8 space-y-3">
            {[1,2,3,4].map(i => <Skeleton key={i} className="h-4 w-full" />)}
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="container max-w-screen-xl px-4 py-24 text-center">
        <h1 className="font-display text-3xl font-bold mb-4">Article Not Found</h1>
        <p className="text-muted-foreground mb-8">This article may have been removed or the link is incorrect.</p>
        <Link href="/">
          <Button>Back to Home</Button>
        </Link>
      </div>
    );
  }

  const articleUrl = typeof window !== "undefined" ? window.location.href : "";
  const origin = typeof window !== "undefined" ? window.location.origin : "";

  const formattedDate = new Date(article.publishedAt).toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.excerpt,
    image: article.imageUrl
      ? [{ "@type": "ImageObject", url: article.imageUrl, width: 1200, height: 630 }]
      : undefined,
    datePublished: new Date(article.publishedAt).toISOString(),
    dateModified: new Date(article.publishedAt).toISOString(),
    url: articleUrl,
    mainEntityOfPage: { "@type": "WebPage", "@id": articleUrl },
    author: {
      "@type": "Person",
      name: article.author.name,
      image: article.author.avatarUrl || undefined,
    },
    publisher: {
      "@type": "Organization",
      name: "Scrolltek",
      logo: { "@type": "ImageObject", url: `${origin}/favicon.svg` },
    },
    articleSection: article.category,
    keywords: article.tags?.join(", ") || article.category,
    timeRequired: `PT${article.readTime}M`,
  };

  return (
    <>
      <JsonLd data={jsonLdData} />

      {/* Reading progress bar */}
      <div className="fixed top-0 left-0 right-0 h-[3px] bg-border/40 z-[60]" aria-hidden="true">
        <div
          className="h-full bg-primary transition-[width] duration-75 ease-out shadow-[0_0_8px_0px] shadow-primary/60"
          style={{ width: `${scrollProgress}%` }}
          role="progressbar"
          aria-valuenow={Math.round(scrollProgress)}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>

      <article className="pb-16 md:pb-24" itemScope itemType="https://schema.org/Article">

        {/* Hero */}
        <div className="w-full h-[45vh] md:h-[62vh] relative mb-8 md:mb-12">
          <img
            src={article.imageUrl}
            alt={article.title}
            fetchPriority="high"
            decoding="async"
            className="w-full h-full object-cover"
            itemProp="image"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          <div className="absolute bottom-0 left-0 w-full p-4 md:p-8">
            <div className="container max-w-screen-md mx-auto text-center">
              {/* Breadcrumb */}
              <nav aria-label="Breadcrumb" className="flex items-center justify-center gap-1.5 text-xs mb-4 text-muted-foreground">
                <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                <span>/</span>
                <Link
                  href={`/category/${article.category.toLowerCase().replace(/\s+/g, "-")}`}
                  className="hover:text-primary transition-colors"
                >
                  {article.category}
                </Link>
                <span>/</span>
                <span className="truncate max-w-[180px] text-foreground/60">{article.title}</span>
              </nav>

              <div className="flex justify-center mb-4">
                <CategoryBadge category={article.category} />
              </div>

              <h1
                className="font-display text-xl sm:text-3xl md:text-5xl font-extrabold leading-tight mb-3"
                itemProp="headline"
              >
                {article.title}
              </h1>

              {article.subtitle && (
                <p className="text-sm md:text-lg text-muted-foreground mb-5 font-medium leading-relaxed">
                  {article.subtitle}
                </p>
              )}

              {/* Reading time + Last updated badges */}
              <div className="flex items-center justify-center gap-3 flex-wrap mb-4">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 text-primary px-3 py-1 text-xs font-semibold border border-primary/20">
                  <Clock className="w-3.5 h-3.5" />
                  {article.readTime} min read
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-muted/80 text-muted-foreground px-3 py-1 text-xs font-semibold border border-border/60">
                  <CalendarClock className="w-3.5 h-3.5" />
                  Updated {formattedDate}
                </span>
              </div>

              <div className="flex items-center justify-center border-t border-border/50 pt-4 flex-wrap gap-4">
                <Link href={`/author/${nameToSlug(article.author.name)}`} className="flex items-center gap-3 group" itemProp="author" itemScope itemType="https://schema.org/Person">
                  {article.author.avatarUrl ? (
                    <img
                      src={article.author.avatarUrl}
                      alt={article.author.name}
                      className="w-10 h-10 rounded-full object-cover border-2 border-border shrink-0 group-hover:border-primary transition-colors"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                      <span className="font-bold text-primary text-sm">
                        {article.author.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div>
                    <div className="font-semibold text-sm group-hover:text-primary transition-colors" itemProp="name">{article.author.name}</div>
                    <div className="text-xs text-muted-foreground">
                      <time
                        dateTime={new Date(article.publishedAt).toISOString()}
                        itemProp="datePublished"
                      >
                        {formattedDate}
                      </time>
                    </div>
                  </div>
                </Link>

                {/* Desktop share */}
                <div className="hidden sm:block">
                  <ShareButtons url={articleUrl} title={article.title} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Article body */}
        <div className="container max-w-screen-xl px-4 flex flex-col md:flex-row gap-8 relative">
          {/* Desktop sticky share sidebar */}
          <div className="hidden md:flex flex-col gap-3 sticky top-28 w-14 shrink-0 h-fit items-center">
            <span className="text-xs text-muted-foreground font-medium rotate-0 mb-1">Share</span>
            <ShareButtons url={articleUrl} title={article.title} className="flex-col" />
          </div>

          <div className="flex-1 max-w-[740px] mx-auto w-full">

            {/* Table of Contents */}
            <TableOfContents toc={toc} />

            <div
              className="prose prose-lg dark:prose-invert prose-headings:font-display prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-blockquote:border-primary prose-blockquote:not-italic prose-blockquote:font-medium [&_h1]:text-2xl [&_h1]:md:text-3xl [&_h1]:font-bold [&_h1]:leading-tight [&_h1]:mb-6 [&_h1]:mt-0 [&_figure]:my-8 [&_figcaption]:text-sm [&_figcaption]:text-center [&_figcaption]:italic [&_figcaption]:text-muted-foreground [&_figcaption]:mt-3 [&_img]:w-full [&_img]:object-cover"
              itemProp="articleBody"
              onClick={handleBodyClick}
            >
              {processedBody ? (
                <div dangerouslySetInnerHTML={{ __html: processedBody }} />
              ) : article.body ? (
                <div dangerouslySetInnerHTML={{ __html: article.body }} />
              ) : (
                <>
                  <p className="lead">{article.excerpt}</p>
                  <p>Content coming soon. Check back for the full article.</p>
                </>
              )}
            </div>

            {/* FAQ Section */}
            <FaqSection faq={faq} />

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-2 pt-6 border-t border-border">
                <span className="text-sm text-muted-foreground font-medium mr-1">Tagged:</span>
                {article.tags.map((tag) => (
                  <Link key={tag} href={`/search?q=${tag}`}>
                    <span className="inline-flex items-center rounded-full border border-border px-3 py-1 text-xs font-semibold hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors cursor-pointer">
                      #{tag}
                    </span>
                  </Link>
                ))}
              </div>
            )}

            {/* Mobile share row */}
            <div className="flex sm:hidden items-center gap-3 mt-6 pt-6 border-t border-border">
              <span className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                <Share2 className="w-4 h-4" /> Share
              </span>
              <ShareButtons url={articleUrl} title={article.title} />
            </div>
          </div>
        </div>
      </article>

      {/* Related articles */}
      <section className="bg-muted py-12 border-t border-border">
        <div className="container max-w-screen-xl px-4 md:px-8">
          <h2 className="font-display text-2xl font-bold mb-2 border-l-[3px] border-primary pl-3">Keep Reading</h2>
          <p className="text-muted-foreground text-sm mb-8">More stories you might enjoy</p>
          {relatedLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1,2,3,4].map((i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="w-full aspect-[16/9] rounded-xl" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-5 w-full" />
                </div>
              ))}
            </div>
          ) : related && related.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.slice(0, 4).map((rel) => (
                <ArticleCard key={rel.id} article={rel} />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No related articles found.</p>
          )}
        </div>
      </section>

      {/* Back to top */}
      <Button
        variant="secondary"
        size="icon"
        className={cn(
          "fixed bottom-20 md:bottom-8 right-4 md:right-8 rounded-full shadow-lg transition-all duration-300 z-40 border border-border",
          showBackToTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        )}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
      >
        <ArrowUp className="w-5 h-5" />
      </Button>
    </>
  );
}
