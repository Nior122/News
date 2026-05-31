import React, { useEffect } from "react";
import { useRoute, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { usePageMeta } from "@/hooks/usePageMeta";
import { ArticleCard } from "@/components/ArticleCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { getAuthorProfile, nameToSlug } from "@/data/authors";
import { Twitter, Linkedin, BookOpen, Eye, Award, Briefcase } from "lucide-react";

interface AuthorApiResponse {
  id: number;
  name: string;
  avatarUrl: string;
  slug: string;
  articleCount: number;
  totalViews: number;
  articles: {
    id: number;
    slug: string;
    title: string;
    subtitle: string | null;
    excerpt: string;
    category: string;
    author: { id: number; name: string; avatarUrl: string };
    publishedAt: string;
    readTime: number;
    imageUrl: string;
    views: number;
    featured: boolean;
    editorsPick: boolean;
    tags: string[];
  }[];
}

function JsonLdPerson({ data }: { data: Record<string, unknown> }) {
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "author-jsonld";
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
    return () => { document.getElementById("author-jsonld")?.remove(); };
  }, [data]);
  return null;
}

function AuthorSkeleton() {
  return (
    <div className="container max-w-screen-xl px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="flex gap-6 items-start mb-8">
          <Skeleton className="w-24 h-24 rounded-full shrink-0" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="space-y-3">
              <Skeleton className="w-full aspect-[16/9] rounded-xl" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-5 w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AuthorPage() {
  const [, params] = useRoute("/author/:slug");
  const slug = params?.slug ?? "";

  const { data: authorData, isLoading, isError } = useQuery<AuthorApiResponse>({
    queryKey: ["author", slug],
    queryFn: async () => {
      const res = await fetch(`/api/authors/${slug}`);
      if (!res.ok) throw new Error("Author not found");
      return res.json();
    },
    enabled: !!slug,
    staleTime: 5 * 60_000,
  });

  const profile = getAuthorProfile(slug);
  const displayName = authorData?.name ?? profile?.name ?? slug;
  const displayTitle = profile?.title ?? "Staff Writer";

  usePageMeta({
    title: `${displayName} — Scrolltek`,
    description: profile?.bio ?? `Articles by ${displayName} on Scrolltek.`,
    ogImage: authorData?.avatarUrl,
  });

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const jsonLd = authorData ? {
    "@context": "https://schema.org",
    "@type": "Person",
    name: displayName,
    url: `${origin}/author/${slug}`,
    image: authorData.avatarUrl || undefined,
    jobTitle: displayTitle,
    description: profile?.longBio ?? profile?.bio,
    knowsAbout: profile?.expertise ?? [],
    worksFor: {
      "@type": "Organization",
      name: "Scrolltek",
      url: origin,
    },
  } : null;

  if (isLoading) return <AuthorSkeleton />;

  if (isError || !authorData) {
    return (
      <div className="container max-w-screen-xl px-4 py-24 text-center">
        <h1 className="font-display text-3xl font-bold mb-4">Author Not Found</h1>
        <p className="text-muted-foreground mb-8">We couldn't find this author profile.</p>
        <Link href="/" className="inline-flex items-center gap-2 text-primary hover:underline">← Back to Home</Link>
      </div>
    );
  }

  const initials = displayName.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <>
      {jsonLd && <JsonLdPerson data={jsonLd} />}

      {/* Author hero */}
      <div className="border-b border-border bg-gradient-to-b from-muted/60 to-background">
        <div className="container max-w-screen-xl px-4 py-12 md:py-16">
          <div className="max-w-3xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
              {/* Avatar */}
              {authorData.avatarUrl ? (
                <img
                  src={authorData.avatarUrl}
                  alt={displayName}
                  className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover border-4 border-border shadow-lg shrink-0"
                />
              ) : (
                <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-primary/20 flex items-center justify-center border-4 border-border shadow-lg shrink-0">
                  <span className="font-bold text-primary text-2xl md:text-3xl">{initials}</span>
                </div>
              )}

              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-1">Author</p>
                <h1 className="font-display text-2xl md:text-4xl font-extrabold leading-tight mb-1">{displayName}</h1>
                <p className="text-muted-foreground font-medium mb-3">{displayTitle}</p>

                {profile?.bio && (
                  <p className="text-sm md:text-base text-foreground/80 leading-relaxed">{profile.bio}</p>
                )}

                {/* Social links */}
                {profile?.social && (
                  <div className="flex gap-2 mt-3">
                    {profile.social.twitter && (
                      <a href={profile.social.twitter} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors border border-border rounded-full px-3 py-1 hover:border-primary/30 bg-card">
                        <Twitter className="w-3.5 h-3.5" /> Twitter
                      </a>
                    )}
                    {profile.social.linkedin && (
                      <a href={profile.social.linkedin} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors border border-border rounded-full px-3 py-1 hover:border-primary/30 bg-card">
                        <Linkedin className="w-3.5 h-3.5" /> LinkedIn
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-border/60">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1.5 text-primary mb-1">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div className="font-display text-2xl font-bold">{authorData.articleCount}</div>
                <div className="text-xs text-muted-foreground mt-0.5">Articles</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1.5 text-primary mb-1">
                  <Eye className="w-4 h-4" />
                </div>
                <div className="font-display text-2xl font-bold">
                  {authorData.totalViews >= 1000
                    ? `${(authorData.totalViews / 1000).toFixed(1)}k`
                    : authorData.totalViews}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">Total Views</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1.5 text-primary mb-1">
                  <Briefcase className="w-4 h-4" />
                </div>
                <div className="font-display text-lg font-bold leading-tight">
                  {profile?.experience?.split(" ").slice(0, 2).join(" ") ?? "Staff"}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">Experience</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-screen-xl px-4 py-10 md:py-14">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-10">

            {/* Sidebar — bio + expertise */}
            <aside className="lg:w-72 shrink-0 space-y-8">

              {/* Full bio */}
              {profile?.longBio && (
                <div>
                  <h2 className="font-display text-sm font-bold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
                    <Award className="w-4 h-4" /> About
                  </h2>
                  <p className="text-sm text-foreground/80 leading-relaxed">{profile.longBio}</p>
                </div>
              )}

              {/* Experience */}
              {profile?.experience && (
                <div>
                  <h2 className="font-display text-sm font-bold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
                    <Briefcase className="w-4 h-4" /> Experience
                  </h2>
                  <p className="text-sm text-foreground/80">{profile.experience}</p>
                </div>
              )}

              {/* Expertise */}
              {profile?.expertise && profile.expertise.length > 0 && (
                <div>
                  <h2 className="font-display text-sm font-bold uppercase tracking-widest text-muted-foreground mb-3">
                    Expertise
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {profile.expertise.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs font-medium">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </aside>

            {/* Articles grid */}
            <div className="flex-1 min-w-0">
              <h2 className="font-display text-xl font-bold mb-6 border-l-[3px] border-primary pl-3">
                All Articles
                <span className="text-muted-foreground font-normal text-base ml-2">({authorData.articleCount})</span>
              </h2>
              {authorData.articles.length === 0 ? (
                <p className="text-muted-foreground">No articles published yet.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {authorData.articles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
