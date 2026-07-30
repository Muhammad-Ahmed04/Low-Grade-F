import { useEffect } from "react";
import { getRouteSeo, getStructuredData } from "@/lib/site";

function upsertMeta(
  selector: string,
  attrs: Record<string, string>,
  content: string,
) {
  let el = document.head.querySelector(selector) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    Object.entries(attrs).forEach(([key, value]) => el!.setAttribute(key, value));
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertLink(
  selector: string,
  attrs: Record<string, string>,
  href: string,
) {
  let el = document.head.querySelector(selector) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement("link");
    Object.entries(attrs).forEach(([key, value]) => el!.setAttribute(key, value));
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

export default function RouteMeta({ path }: { path: string }) {
  useEffect(() => {
    const seo = getRouteSeo(path);
    const structuredData = getStructuredData(path);

    document.title = seo.title;
    upsertMeta('meta[name="description"]', { name: "description" }, seo.description);
    upsertMeta('meta[property="og:title"]', { property: "og:title" }, seo.title);
    upsertMeta(
      'meta[property="og:description"]',
      { property: "og:description" },
      seo.description,
    );
    upsertMeta('meta[property="og:url"]', { property: "og:url" }, seo.canonicalUrl);
    upsertMeta(
      'meta[property="og:site_name"]',
      { property: "og:site_name" },
      "LOWGRADEFILMS",
    );
    upsertMeta('meta[property="og:image"]', { property: "og:image" }, seo.ogImage);
    upsertMeta(
      'meta[property="og:type"]',
      { property: "og:type" },
      seo.ogType ?? "website",
    );
    upsertMeta(
      'meta[name="twitter:card"]',
      { name: "twitter:card" },
      "summary_large_image",
    );
    upsertMeta('meta[name="twitter:title"]', { name: "twitter:title" }, seo.title);
    upsertMeta(
      'meta[name="twitter:description"]',
      { name: "twitter:description" },
      seo.description,
    );
    upsertMeta(
      'meta[name="twitter:image"]',
      { name: "twitter:image" },
      seo.ogImage,
    );
    upsertLink('link[rel="canonical"]', { rel: "canonical" }, seo.canonicalUrl);

    const existing = Array.from(
      document.head.querySelectorAll('script[data-route-jsonld="true"]'),
    );
    existing.forEach((node) => node.remove());

    structuredData.forEach((entry) => {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.dataset.routeJsonld = "true";
      script.textContent = JSON.stringify(entry);
      document.head.appendChild(script);
    });
  }, [path]);

  return null;
}
