import { useEffect } from "react";

interface PageMeta {
  title?: string;
  exactTitle?: boolean;
  description?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogImageWidth?: number;
  ogImageHeight?: number;
  ogType?: string;
  canonical?: string | null;
  robots?: string;
  articlePublishedTime?: string;
  articleModifiedTime?: string;
  articleAuthor?: string;
  enabled?: boolean;
}

const SITE_NAME = "Scrolltek";
export const SITE_ORIGIN = "https://scrolltek.name.ng";
const DEFAULT_DESCRIPTION =
  "Your go-to source for tech, digital culture, AI tools, phone tips, lifestyle, and the trends shaping how we live online.";
const HOME_TITLE = `${SITE_NAME} — Tech, Culture, Lifestyle & AI Tools`;

export function canonicalUrlForPath(pathname: string): string {
  let path = String(pathname || "/").split(/[?#]/, 1)[0];
  if (!path.startsWith("/")) path = `/${path}`;
  path = path.replace(/\/{2,}/g, "/");
  if (path.length > 1) path = path.replace(/\/+$/, "");
  return `${SITE_ORIGIN}${path}`;
}

function canonicalFor(metaCanonical: string | null | undefined): string | null {
  if (metaCanonical === null) return null;
  if (!metaCanonical) return canonicalUrlForPath(window.location.pathname);

  try {
    const candidate = new URL(metaCanonical, SITE_ORIGIN);
    return canonicalUrlForPath(candidate.pathname);
  } catch {
    return canonicalUrlForPath(window.location.pathname);
  }
}

function findMeta(name: string): HTMLMetaElement | null {
  return (
    document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`) ||
    document.querySelector<HTMLMetaElement>(`meta[property="${name}"]`)
  );
}

function setMeta(name: string, content: string) {
  let element = findMeta(name);
  if (!element) {
    element = document.createElement("meta");
    if (name.startsWith("og:") || name.startsWith("article:")) {
      element.setAttribute("property", name);
    } else {
      element.setAttribute("name", name);
    }
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
}

function removeMeta(name: string) {
  findMeta(name)?.remove();
}

function captureMeta(name: string): string | null {
  return findMeta(name)?.getAttribute("content") ?? null;
}

function restoreMeta(name: string, content: string | null) {
  if (content === null) {
    removeMeta(name);
  } else {
    setMeta(name, content);
  }
}

export function usePageMeta(meta: PageMeta) {
  useEffect(() => {
    if (meta.enabled === false) return;

    const previousTitle = document.title;
    const previousCanonical = document.querySelector<HTMLLinkElement>("link[rel='canonical']")?.getAttribute("href") ?? null;
    const metaNames = [
      "description", "robots", "og:type", "og:title", "og:description", "og:url", "og:image",
      "og:image:width", "og:image:height", "og:image:type", "twitter:title", "twitter:description",
      "twitter:card", "twitter:image", "article:published_time", "article:modified_time",
      "article:author",
    ];
    const previousMeta = new Map<string, string | null>(
      metaNames.map((name) => [name, captureMeta(name)] as const),
    );

    const pageTitle = meta.title ? (meta.exactTitle ? meta.title : `${meta.title} — ${SITE_NAME}`) : HOME_TITLE;
    const description = meta.description || DEFAULT_DESCRIPTION;
    const canonical = canonicalFor(meta.canonical);

    document.title = pageTitle;
    setMeta("description", description);
    setMeta("robots", meta.robots || "index, follow, max-image-preview:large");
    setMeta("og:type", meta.ogType || "website");
    setMeta("og:title", meta.ogTitle || pageTitle);
    setMeta("og:description", meta.ogDescription || description);
    if (canonical) setMeta("og:url", canonical);
    else removeMeta("og:url");
    setMeta("twitter:title", meta.ogTitle || pageTitle);
    setMeta("twitter:description", meta.ogDescription || description);
    if (meta.articlePublishedTime) setMeta("article:published_time", meta.articlePublishedTime);
    else removeMeta("article:published_time");
    if (meta.articleModifiedTime) setMeta("article:modified_time", meta.articleModifiedTime);
    else removeMeta("article:modified_time");
    if (meta.articleAuthor) setMeta("article:author", meta.articleAuthor);
    else removeMeta("article:author");

    if (meta.ogImage) {
      setMeta("og:image", meta.ogImage);
      if (meta.ogImageWidth !== undefined) setMeta("og:image:width", String(meta.ogImageWidth));
      else removeMeta("og:image:width");
      if (meta.ogImageHeight !== undefined) setMeta("og:image:height", String(meta.ogImageHeight));
      else removeMeta("og:image:height");
      removeMeta("og:image:type");
      setMeta("twitter:card", "summary_large_image");
      setMeta("twitter:image", meta.ogImage);
    } else {
      removeMeta("og:image");
      removeMeta("og:image:width");
      removeMeta("og:image:height");
      removeMeta("og:image:type");
      removeMeta("twitter:image");
      setMeta("twitter:card", "summary");
    }

    const existingCanonicalLink = document.querySelector<HTMLLinkElement>("link[rel='canonical']");
    if (canonical === null) {
      existingCanonicalLink?.remove();
    } else {
      const canonicalLink = existingCanonicalLink ?? document.createElement("link");
      canonicalLink.rel = "canonical";
      canonicalLink.href = canonical;
      if (!canonicalLink.isConnected) document.head.appendChild(canonicalLink);
    }

    return () => {
      document.title = previousTitle;
      const link = document.querySelector<HTMLLinkElement>("link[rel='canonical']");
      if (previousCanonical === null) {
        link?.remove();
      } else {
        const restoredLink = link ?? document.createElement("link");
        restoredLink.rel = "canonical";
        restoredLink.href = previousCanonical;
        if (!restoredLink.isConnected) document.head.appendChild(restoredLink);
      }
      for (const [name, content] of previousMeta) restoreMeta(name, content);
    };
  }, [
    meta.title, meta.exactTitle,
    meta.description,
    meta.ogTitle,
    meta.ogDescription,
    meta.ogImage,
    meta.ogImageWidth,
    meta.ogImageHeight,
    meta.ogType,
    meta.canonical,
    meta.robots,
    meta.articlePublishedTime,
    meta.articleModifiedTime,
    meta.articleAuthor,
    meta.enabled,
  ]);
}
