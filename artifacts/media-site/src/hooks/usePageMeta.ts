import { useEffect } from "react";

interface PageMeta {
  title?: string;
  description?: string;
  ogTitle?: string;
  ogDescription?: string;
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

export function usePageMeta(meta: PageMeta) {
  useEffect(() => {
    const prevTitle = document.title;

    const pageTitle = meta.title
      ? `${meta.title} — ${SITE_NAME}`
      : `${SITE_NAME} — Tech, Culture, Lifestyle & AI Tools`;

    document.title = pageTitle;

    const desc = meta.description || DEFAULT_DESCRIPTION;
    setMeta("description", desc);
    setMeta("og:title", meta.ogTitle || pageTitle);
    setMeta("og:description", meta.ogDescription || desc);
    setMeta("twitter:title", meta.ogTitle || pageTitle);
    setMeta("twitter:description", meta.ogDescription || desc);

    if (meta.canonical) {
      let link = document.querySelector<HTMLLinkElement>("link[rel='canonical']");
      if (!link) {
        link = document.createElement("link");
        link.rel = "canonical";
        document.head.appendChild(link);
      }
      link.href = meta.canonical;
    }

    return () => {
      document.title = prevTitle;
    };
  }, [meta.title, meta.description]);
}
