import React, { useEffect, useState } from "react";
import { useRoute, Link } from "wouter";
import { useGetArticle, getGetArticleQueryKey, useListRelatedArticles, getListRelatedArticlesQueryKey } from "@workspace/api-client-react";
import { ArticleCard, CategoryBadge } from "@/components/ArticleCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Share2, ArrowUp, BookmarkPlus, Twitter, Facebook, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function ArticlePage() {
  const [, params] = useRoute("/article/:slug");
  const slug = params?.slug || "";
  
  const { data: article, isLoading } = useGetArticle(slug, {
    query: {
      enabled: !!slug,
      queryKey: getGetArticleQueryKey(slug)
    }
  });

  const { data: related, isLoading: relatedLoading } = useListRelatedArticles(slug, {
    query: {
      enabled: !!slug,
      queryKey: getListRelatedArticlesQueryKey(slug)
    }
  });

  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
      setShowBackToTop(window.scrollY > 500);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (isLoading) {
    return (
      <div className="container max-w-screen-xl px-4 py-8">
        <Skeleton className="w-full h-8 mb-4 max-w-md" />
        <Skeleton className="w-full h-[50vh] rounded-2xl mb-8" />
        <Skeleton className="w-full h-4 mb-2" />
        <Skeleton className="w-full h-4 mb-2" />
        <Skeleton className="w-3/4 h-4" />
      </div>
    );
  }

  if (!article) return <div className="p-8 text-center">Article not found</div>;

  return (
    <>
      <div 
        className="fixed top-0 left-0 h-1 bg-primary z-50 transition-all duration-100"
        style={{ width: `${scrollProgress}%` }}
      />
      
      <article className="pb-16 md:pb-24">
        <div className="w-full h-[40vh] md:h-[60vh] relative mb-8 md:mb-12">
          <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          <div className="absolute bottom-0 left-0 w-full p-4 md:p-8">
            <div className="container max-w-screen-md mx-auto">
              <div className="flex items-center gap-2 text-sm mb-4 text-muted-foreground">
                <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                <span>/</span>
                <Link href={`/category/${article.category.toLowerCase()}`} className="hover:text-primary transition-colors">{article.category}</Link>
                <span>/</span>
                <span className="truncate max-w-[200px]">{article.title}</span>
              </div>
              <CategoryBadge category={article.category} className="mb-4" />
              <h1 className="font-display text-3xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-4">
                {article.title}
              </h1>
              {article.subtitle && (
                <p className="text-xl md:text-2xl text-muted-foreground mb-6 font-medium">
                  {article.subtitle}
                </p>
              )}
              <div className="flex items-center justify-between border-t border-border pt-4">
                <div className="flex items-center gap-3">
                  <img src={article.author.avatarUrl} alt={article.author.name} className="w-10 h-10 rounded-full object-cover border border-border" />
                  <div>
                    <div className="font-medium text-sm">{article.author.name}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-2">
                      <span>{new Date(article.publishedAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                      <span>•</span>
                      <span>{article.readTime} min read</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container max-w-screen-xl px-4 flex flex-col md:flex-row gap-8 relative">
          <div className="hidden md:flex flex-col gap-4 sticky top-32 w-16 shrink-0 h-fit items-center">
            <Button variant="ghost" size="icon" className="rounded-full bg-card shadow-sm border border-border hover:bg-primary/10 hover:text-primary">
              <Twitter className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full bg-card shadow-sm border border-border hover:bg-primary/10 hover:text-primary">
              <Facebook className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full bg-card shadow-sm border border-border hover:bg-primary/10 hover:text-primary">
              <Linkedin className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full bg-card shadow-sm border border-border hover:bg-primary/10 hover:text-primary">
              <BookmarkPlus className="w-5 h-5" />
            </Button>
          </div>

          <div className="flex-1 max-w-[720px] mx-auto w-full">
            <div className="prose prose-lg dark:prose-invert prose-headings:font-display prose-a:text-primary">
              {article.body ? (
                <div dangerouslySetInnerHTML={{ __html: article.body }} />
              ) : (
                <>
                  <p className="lead">{article.excerpt}</p>
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor. Ut in nulla enim. Phasellus molestie magna non est bibendum non venenatis nisl tempor. Suspendisse dictum feugiat nisl ut dapibus.</p>
                  <div className="my-8 p-4 bg-muted text-center text-sm text-muted-foreground border border-border rounded-lg">
                    Advertisement
                  </div>
                  <h3>A deep dive into the subject</h3>
                  <p>Mauris ipsum. Nulla metus metus, ullamcorper vel, tincidunt sed, euismod in, nibh. Quisque volutpat condimentum velit. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.</p>
                  <blockquote className="border-l-4 border-primary pl-4 italic text-xl my-6">
                    "This is a revolutionary step forward that will change everything about how we interact with technology."
                  </blockquote>
                  <p>Nam nec ante. Sed lacinia, urna non tincidunt mattis, tortor neque adipiscing diam, a cursus ipsum ante quis turpis. Nulla facilisi. Ut fringilla. Suspendisse potenti. Nunc feugiat mi a tellus consequat imperdiet.</p>
                </>
              )}
            </div>

            <div className="mt-8 flex flex-wrap gap-2 pt-8 border-t border-border">
              {article.tags.map(tag => (
                <Link key={tag} href={`/search?q=${tag}`}>
                  <Badge variant="secondary" className="hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer">
                    #{tag}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </article>

      <section className="bg-muted py-12 border-t border-border">
        <div className="container max-w-screen-xl px-4 md:px-8">
          <h2 className="font-display text-2xl font-bold mb-8">Keep Reading</h2>
          {relatedLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Skeleton className="w-full aspect-[4/3] rounded-xl" />
              <Skeleton className="w-full aspect-[4/3] rounded-xl" />
              <Skeleton className="w-full aspect-[4/3] rounded-xl" />
            </div>
          ) : related && related.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.slice(0, 4).map((rel) => (
                <ArticleCard key={rel.id} article={rel} />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No related articles found.</p>
          )}
        </div>
      </section>

      <Button
        variant="secondary"
        size="icon"
        className={cn(
          "fixed bottom-20 md:bottom-8 right-4 md:right-8 rounded-full shadow-lg transition-opacity duration-300 z-40",
          showBackToTop ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
      >
        <ArrowUp className="w-5 h-5" />
      </Button>
    </>
  );
}

function Badge({ className, variant, ...props }: React.HTMLAttributes<HTMLDivElement> & { variant?: string }) {
  return <div className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", className)} {...props} />
}