import { CONTACT, FILMS } from "@/constants";

export const SITE_NAME = "LOWGRADEFILMS";
export const SITE_URL = "https://lowgradefilms.com";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/opengraph.jpg`;

export type AppRoutePath = "/" | "/about" | "/work" | "/contact";

export type RouteSeo = {
  path: AppRoutePath;
  title: string;
  description: string;
  canonicalUrl: string;
  ogImage: string;
  ogType?: "website" | "article";
};

export const ROUTE_SEO: Record<AppRoutePath, RouteSeo> = {
  "/": {
    path: "/",
    title: `${SITE_NAME} | International visual productions`,
    description:
      "LOWGRADEFILMS creates international visual productions for automotive, tactical, and commercial brands.",
    canonicalUrl: `${SITE_URL}/`,
    ogImage: DEFAULT_OG_IMAGE,
    ogType: "website",
  },
  "/about": {
    path: "/about",
    title: `About | ${SITE_NAME}`,
    description:
      "Discover LOWGRADEFILMS and the production approach behind automotive, tactical, and commercial visual work.",
    canonicalUrl: `${SITE_URL}/about`,
    ogImage: DEFAULT_OG_IMAGE,
    ogType: "website",
  },
  "/work": {
    path: "/work",
    title: `Work | ${SITE_NAME}`,
    description:
      "Explore LOWGRADEFILMS short films, gallery work, and production services across automotive, tactical, and commercial campaigns.",
    canonicalUrl: `${SITE_URL}/work`,
    ogImage: DEFAULT_OG_IMAGE,
    ogType: "website",
  },
  "/contact": {
    path: "/contact",
    title: `Contact | ${SITE_NAME}`,
    description:
      "Start a project with LOWGRADEFILMS through WhatsApp or email for commercial, automotive, and tactical productions.",
    canonicalUrl: `${SITE_URL}/contact`,
    ogImage: DEFAULT_OG_IMAGE,
    ogType: "website",
  },
};

export const ALL_ROUTE_PATHS = Object.keys(ROUTE_SEO) as AppRoutePath[];
const FILM_POSTERS: Record<number, string> = {
  1: "/photos/gallery-6.JPG",
  2: "/photos/gallery-10.jpeg",
};

export function normalizeRoutePath(pathname: string): AppRoutePath {
  const path = pathname.replace(/\/+$/, "") || "/";
  if (path === "/about" || path === "/work" || path === "/contact") {
    return path;
  }
  return "/";
}

export function getRouteSeo(pathname: string): RouteSeo {
  return ROUTE_SEO[normalizeRoutePath(pathname)];
}

export function getOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/lgf-logo.png`,
    image: DEFAULT_OG_IMAGE,
    description: ROUTE_SEO["/"].description,
    email: CONTACT.email,
    sameAs: [CONTACT.instagram, CONTACT.linkedin].filter(
      (value) => value && value !== "#",
    ),
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: CONTACT.email,
        url: `${SITE_URL}/contact`,
      },
    ],
  };
}

export function getFilmVideosJsonLd() {
  return FILMS.map((film) => ({
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: film.title,
    description: film.description,
    thumbnailUrl: `${SITE_URL}${FILM_POSTERS[film.id]}`,
    embedUrl: film.vimeoSrc,
    contentUrl: film.vimeoSrc,
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/lgf-logo.png`,
      },
    },
  }));
}

export function getStructuredData(pathname: string) {
  const path = normalizeRoutePath(pathname);
  if (path === "/") {
    return [getOrganizationJsonLd(), ...getFilmVideosJsonLd()];
  }

  if (path === "/work") {
    return getFilmVideosJsonLd();
  }

  return [];
}

export function getNavHref(
  currentPath: string,
  target: "work" | "films" | "about" | "partners" | "contact",
) {
  const path = normalizeRoutePath(currentPath);
  if (path === "/") {
    return `#${target}`;
  }

  if (target === "about") return "/about";
  if (target === "work") return "/work";
  if (target === "contact") return "/contact";
  if (target === "films") return "/work#films";
  return "/#partners";
}
