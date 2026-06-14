import { useEffect } from "react";

interface PageMeta {
  title?: string;
  description?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogImageWidth?: number;
  ogImageHeight?: number;
  ogType?: string;
  canonical?: string;
}

const SITE_NAME = "Scrolltek";
const DEFAULT_DESCRIPTION =
  "Your go-to source for tech, digital culture, AI tools, phone tips, lifestyle, and the trends shaping how we live online.";

function setMeta(name: string, content: string) {
  let el =
    document.querySelector(`meta[name="${name}"]`) ||
    document.querySelector(`meta[property="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    if (name.startsWith("og:") || name.startsWith("twitter:")) {
      el.setAttribute("property", name);
    } else {
      el.setAttribute("name", name);
    }
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function removeMeta(name: string) {
  const el =
    document.querySelector(`meta[name="${name}"]`) ||
    document.querySelector(`meta[property="${name}"]`);
  el?.remove();
}

const HOME_CANONICAL = "https://scrolltek.com/";
const HOME_TITLE = `${SITE_NAME} — Tech, Culture, Lifestyle & AI Tools`;

export function usePageMeta(meta: PageMeta) {
  useEffect(() => {
    const prevTitle = document.title;
    const prevCanonical = document.querySelector<HTMLLinkElement>("link[rel='canonical']")?.href ?? HOME_CANONICAL;

    const pageTitle = meta.title
      ? `${meta.title} — ${SITE_NAME}`
      : HOME_TITLE;

    document.title = pageTitle;

    const desc = meta.description || DEFAULT_DESCRIPTION;
    setMeta("description", desc);
    setMeta("og:type", meta.ogType || "website");
    setMeta("og:title", meta.ogTitle || pageTitle);
    setMeta("og:description", meta.ogDescription || desc);
    setMeta("twitter:title", meta.ogTitle || pageTitle);
    setMeta("twitter:description", meta.ogDescription || desc);

    if (meta.ogImage) {
      setMeta("og:image", meta.ogImage);
      setMeta("og:image:width", String(meta.ogImageWidth ?? 1200));
      setMeta("og:image:height", String(meta.ogImageHeight ?? 630));
      setMeta("og:image:type", "image/jpeg");
      setMeta("twitter:card", "summary_large_image");
      setMeta("twitter:image", meta.ogImage);
    } else {
      removeMeta("og:image");
      removeMeta("og:image:width");
      removeMeta("og:image:height");
      removeMeta("og:image:type");
      removeMeta("twitter:image");
    }

    // Always update canonical — fall back to home if not provided
    const canonicalHref = meta.canonical ?? HOME_CANONICAL;
    let link = document.querySelector<HTMLLinkElement>("link[rel='canonical']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = canonicalHref;

    return () => {
      document.title = prevTitle;
      // Reset canonical to its previous value on unmount (handles back-navigation)
      const l = document.querySelector<HTMLLinkElement>("link[rel='canonical']");
      if (l) l.href = prevCanonical;
    };
  }, [
    meta.title,
    meta.description,
    meta.ogImage,
    meta.ogImageWidth,
    meta.ogImageHeight,
    meta.ogType,
    meta.canonical,
  ]);
}
