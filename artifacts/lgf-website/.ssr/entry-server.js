import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { renderToString } from "react-dom/server";
import { useLocation, Router as Router$1, Switch, Route } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as React from "react";
import { useState, useEffect, useRef, lazy, Suspense } from "react";
import * as ToastPrimitives from "@radix-ui/react-toast";
import { cva } from "class-variance-authority";
import { X, AlertCircle, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Check } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { List, X as X$1, InstagramLogo, EnvelopeSimple, Aperture, Crosshair, Car, WhatsappLogo } from "@phosphor-icons/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { useFormContext, FormProvider, Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Slot } from "@radix-ui/react-slot";
import * as LabelPrimitive from "@radix-ui/react-label";
import * as SelectPrimitive from "@radix-ui/react-select";
const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1e6;
let count = 0;
function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}
const toastTimeouts = /* @__PURE__ */ new Map();
const addToRemoveQueue = (toastId) => {
  if (toastTimeouts.has(toastId)) {
    return;
  }
  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({
      type: "REMOVE_TOAST",
      toastId
    });
  }, TOAST_REMOVE_DELAY);
  toastTimeouts.set(toastId, timeout);
};
const reducer = (state, action) => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT)
      };
    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map(
          (t) => t.id === action.toast.id ? { ...t, ...action.toast } : t
        )
      };
    case "DISMISS_TOAST": {
      const { toastId } = action;
      if (toastId) {
        addToRemoveQueue(toastId);
      } else {
        state.toasts.forEach((toast2) => {
          addToRemoveQueue(toast2.id);
        });
      }
      return {
        ...state,
        toasts: state.toasts.map(
          (t) => t.id === toastId || toastId === void 0 ? {
            ...t,
            open: false
          } : t
        )
      };
    }
    case "REMOVE_TOAST":
      if (action.toastId === void 0) {
        return {
          ...state,
          toasts: []
        };
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId)
      };
  }
};
const listeners = [];
let memoryState = { toasts: [] };
function dispatch(action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}
function toast({ ...props }) {
  const id = genId();
  const update = (props2) => dispatch({
    type: "UPDATE_TOAST",
    toast: { ...props2, id }
  });
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id });
  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss();
      }
    }
  });
  return {
    id,
    dismiss,
    update
  };
}
function useToast() {
  const [state, setState] = React.useState(memoryState);
  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, [state]);
  return {
    ...state,
    toast,
    dismiss: (toastId) => dispatch({ type: "DISMISS_TOAST", toastId })
  };
}
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const ToastProvider = ToastPrimitives.Provider;
const ToastViewport = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  ToastPrimitives.Viewport,
  {
    ref,
    className: cn(
      "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
      className
    ),
    ...props
  }
));
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;
const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
  {
    variants: {
      variant: {
        default: "border bg-background text-foreground",
        destructive: "destructive group border-destructive bg-destructive text-destructive-foreground"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
const Toast = React.forwardRef(({ className, variant, ...props }, ref) => {
  return /* @__PURE__ */ jsx(
    ToastPrimitives.Root,
    {
      ref,
      className: cn(toastVariants({ variant }), className),
      ...props
    }
  );
});
Toast.displayName = ToastPrimitives.Root.displayName;
const ToastAction = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  ToastPrimitives.Action,
  {
    ref,
    className: cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive",
      className
    ),
    ...props
  }
));
ToastAction.displayName = ToastPrimitives.Action.displayName;
const ToastClose = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  ToastPrimitives.Close,
  {
    ref,
    className: cn(
      "absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600",
      className
    ),
    "toast-close": "",
    ...props,
    children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" })
  }
));
ToastClose.displayName = ToastPrimitives.Close.displayName;
const ToastTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  ToastPrimitives.Title,
  {
    ref,
    className: cn("text-sm font-semibold", className),
    ...props
  }
));
ToastTitle.displayName = ToastPrimitives.Title.displayName;
const ToastDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  ToastPrimitives.Description,
  {
    ref,
    className: cn("text-sm opacity-90", className),
    ...props
  }
));
ToastDescription.displayName = ToastPrimitives.Description.displayName;
function Toaster() {
  const { toasts } = useToast();
  return /* @__PURE__ */ jsxs(ToastProvider, { children: [
    toasts.map(function({ id, title, description, action, ...props }) {
      return /* @__PURE__ */ jsxs(Toast, { ...props, children: [
        /* @__PURE__ */ jsxs("div", { className: "grid gap-1", children: [
          title && /* @__PURE__ */ jsx(ToastTitle, { children: title }),
          description && /* @__PURE__ */ jsx(ToastDescription, { children: description })
        ] }),
        action,
        /* @__PURE__ */ jsx(ToastClose, {})
      ] }, id);
    }),
    /* @__PURE__ */ jsx(ToastViewport, {})
  ] });
}
const TooltipProvider = TooltipPrimitive.Provider;
const TooltipContent = React.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsx(TooltipPrimitive.Portal, { children: /* @__PURE__ */ jsx(
  TooltipPrimitive.Content,
  {
    ref,
    sideOffset,
    className: cn(
      "z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-tooltip-content-transform-origin]",
      className
    ),
    ...props
  }
) }));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;
const Card = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    className: cn(
      "rounded-xl border bg-card text-card-foreground shadow",
      className
    ),
    ...props
  }
));
Card.displayName = "Card";
const CardHeader = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    className: cn("flex flex-col space-y-1.5 p-6", className),
    ...props
  }
));
CardHeader.displayName = "CardHeader";
const CardTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    className: cn("font-semibold leading-none tracking-tight", className),
    ...props
  }
));
CardTitle.displayName = "CardTitle";
const CardDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
CardDescription.displayName = "CardDescription";
const CardContent = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", { ref, className: cn("p-6 pt-0", className), ...props }));
CardContent.displayName = "CardContent";
const CardFooter = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    className: cn("flex items-center p-6 pt-0", className),
    ...props
  }
));
CardFooter.displayName = "CardFooter";
function NotFound() {
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen w-full flex items-center justify-center bg-gray-50", children: /* @__PURE__ */ jsx(Card, { className: "w-full max-w-md mx-4", children: /* @__PURE__ */ jsxs(CardContent, { className: "pt-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex mb-4 gap-2", children: [
      /* @__PURE__ */ jsx(AlertCircle, { className: "h-8 w-8 text-red-500" }),
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "404 Page Not Found" })
    ] }),
    /* @__PURE__ */ jsx("p", { className: "mt-4 text-sm text-gray-600", children: "Did you forget to add the page to the router?" })
  ] }) }) });
}
const NAV_LINKS = [
  { label: "Work", href: "#work" },
  { label: "Films", href: "#films" },
  { label: "About", href: "#about" },
  { label: "Partners", href: "#partners" },
  { label: "Contact", href: "#contact" }
];
const VIMEO_HERO = "https://player.vimeo.com/video/1205085259?autoplay=1&muted=1&loop=1&background=1&playsinline=1&quality=auto";
const FILMS = [
  {
    id: 1,
    vimeoSrc: "https://player.vimeo.com/video/1204904726?autoplay=1&muted=1&loop=1&background=1&playsinline=1&quality=auto",
    title: "GRAND REVEALS",
    description: "Corporate event filming.",
    cta: "EXPERIENCE >"
  },
  {
    id: 2,
    vimeoSrc: "https://player.vimeo.com/video/1204904725?autoplay=1&muted=1&loop=1&background=1&playsinline=1&quality=auto",
    title: "STEEL & SMOKE",
    description: "Motorsports event coverages.",
    cta: "EXPLORE >"
  }
];
const SERVICES = [
  {
    id: 1,
    iconName: "Car",
    title: "AUTOMOBILE FILMS",
    description: "Precision-led visuals for performance, design, and motion.",
    bgImage: "/photos/bts-2.jpg"
  },
  {
    id: 2,
    iconName: "Crosshair",
    title: "TACTICAL COVERAGE",
    description: "Controlled, cinematic coverage built around detail and power.",
    bgImage: "/photos/bts-3.jpg"
  },
  {
    id: 3,
    iconName: "Aperture",
    title: "COMMERCIAL SHOOTS",
    description: "Sharper product and campaign visuals with stronger recall.",
    bgImage: "/photos/bts-1.jpg"
  }
];
const GALLERY_PHOTOS = [
  { src: "/photos/gallery-8.JPG", label: "AUTOMOBILE" },
  { src: "/photos/gallery-new-2.jpg", label: "TACTICAL" },
  { src: "/photos/gallery-new-3.jpg", label: "COMMERCIAL" },
  { src: "/photos/gallery-7.JPG", label: "AUTOMOBILE" },
  { src: "/photos/gallery-5.JPG", label: "TACTICAL" },
  { src: "/photos/gallery-new-6.jpg", label: "COMMERCIAL" },
  { src: "/photos/gallery-new-7.jpg", label: "AUTOMOBILE" },
  { src: "/photos/gallery-new-8.jpg", label: "TACTICAL" },
  { src: "/photos/gallery-new-9.jpg", label: "AUTOMOBILE" }
];
const PARTNER_LOGOS = [
  { src: "/photos/partner-nasa-autocare.PNG", alt: "NASA Autocare", scale: 1.08 },
  { src: "/photos/partner-rust-oleum.PNG", alt: "Rust-Oleum", scale: 1.14 },
  { src: "/photos/partner-guns-armor.PNG", alt: "Guns & Armor", scale: 1.3 },
  { src: "/photos/partner-rex-motors.PNG", alt: "Rex Motors", scale: 1.2 },
  { src: "/photos/partner-1.PNG", alt: "Partner 1", scale: 1.42 },
  { src: "/photos/partner-3.PNG", alt: "Porsche", scale: 0.98 },
  { src: "/photos/partner-4.PNG", alt: "Lamborghini", scale: 1.42 },
  { src: "/photos/partner-5.PNG", alt: "Partner 5", scale: 2.34 },
  { src: "/photos/partner-7.PNG", alt: "Partner 7", scale: 1.34 },
  { src: "/photos/partner-9.PNG", alt: "Partner 9", scale: 2.08 },
  { src: "/photos/partner-10.PNG", alt: "Ferrari", scale: 2.02 },
  { src: "/photos/partner-11.PNG", alt: "Partner 11", scale: 1.02 },
  { src: "/photos/partner-12.PNG", alt: "Partner 12", scale: 1.02 },
  { src: "/photos/partner-13.WEBP", alt: "Partner 13", scale: 1.18 },
  { src: "/photos/partner-14.PNG", alt: "Partner 14", scale: 1.22 }
];
const BEHOLD_FEED_ID = "CshoDpAzaLz8Unyr7NmE";
const CONTACT = {
  whatsapp: "https://wa.me/96895421806",
  email: "info@lowgradefilms.com",
  instagram: "https://www.instagram.com/lowgradefilms",
  linkedin: "#"
};
const SITE_NAME = "LOWGRADEFILMS";
const SITE_URL = "https://lowgradefilms.com";
const DEFAULT_OG_IMAGE = `${SITE_URL}/opengraph.jpg`;
const ROUTE_SEO = {
  "/": {
    path: "/",
    title: `${SITE_NAME} | International visual productions`,
    description: "LOWGRADEFILMS creates international visual productions for automotive, tactical, and commercial brands.",
    canonicalUrl: `${SITE_URL}/`,
    ogImage: DEFAULT_OG_IMAGE,
    ogType: "website"
  },
  "/about": {
    path: "/about",
    title: `About | ${SITE_NAME}`,
    description: "Discover LOWGRADEFILMS and the production approach behind automotive, tactical, and commercial visual work.",
    canonicalUrl: `${SITE_URL}/about`,
    ogImage: DEFAULT_OG_IMAGE,
    ogType: "website"
  },
  "/work": {
    path: "/work",
    title: `Work | ${SITE_NAME}`,
    description: "Explore LOWGRADEFILMS short films, gallery work, and production services across automotive, tactical, and commercial campaigns.",
    canonicalUrl: `${SITE_URL}/work`,
    ogImage: DEFAULT_OG_IMAGE,
    ogType: "website"
  },
  "/contact": {
    path: "/contact",
    title: `Contact | ${SITE_NAME}`,
    description: "Start a project with LOWGRADEFILMS through WhatsApp or email for commercial, automotive, and tactical productions.",
    canonicalUrl: `${SITE_URL}/contact`,
    ogImage: DEFAULT_OG_IMAGE,
    ogType: "website"
  }
};
const FILM_POSTERS = {
  1: "/photos/gallery-6.JPG",
  2: "/photos/gallery-10.jpeg"
};
function normalizeRoutePath(pathname) {
  const path = pathname.replace(/\/+$/, "") || "/";
  if (path === "/about" || path === "/work" || path === "/contact") {
    return path;
  }
  return "/";
}
function getRouteSeo(pathname) {
  return ROUTE_SEO[normalizeRoutePath(pathname)];
}
function getOrganizationJsonLd() {
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
      (value) => value && value !== "#"
    ),
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: CONTACT.email,
        url: `${SITE_URL}/contact`
      }
    ]
  };
}
function getFilmVideosJsonLd() {
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
        url: `${SITE_URL}/lgf-logo.png`
      }
    }
  }));
}
function getStructuredData(pathname) {
  const path = normalizeRoutePath(pathname);
  if (path === "/") {
    return [getOrganizationJsonLd(), ...getFilmVideosJsonLd()];
  }
  if (path === "/work") {
    return getFilmVideosJsonLd();
  }
  return [];
}
function getNavHref(currentPath, target) {
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
function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [location] = useLocation();
  const currentPath = normalizeRoutePath(location);
  const navItems = NAV_LINKS.map(({ label, href }) => ({
    label,
    href: getNavHref(
      currentPath,
      href.replace("#", "")
    )
  }));
  const handleNavClick = (href) => {
    setMenuOpen(false);
    if (!href.startsWith("#")) return;
    setTimeout(() => {
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      "header",
      {
        "data-testid": "navbar",
        className: "absolute top-0 left-0 right-0",
        style: { zIndex: 1e3 },
        children: /* @__PURE__ */ jsxs("div", { className: "relative flex items-center justify-between px-6 lg:px-10 pt-5 md:pt-6", children: [
          /* @__PURE__ */ jsx(
            "a",
            {
              href: "/",
              "data-testid": "link-logo",
              className: "inline-flex items-center justify-center",
              children: /* @__PURE__ */ jsx(
                "img",
                {
                  src: "/lgf-logo.png",
                  alt: "LOWGRADEFILMS",
                  className: "h-[3.9rem] md:h-[4.4rem] w-auto object-contain"
                }
              )
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              "data-testid": "button-hamburger",
              className: "text-white/85 hover:text-white transition-colors flex items-center justify-center",
              style: { minWidth: 44, minHeight: 44 },
              onClick: () => setMenuOpen(true),
              "aria-label": "Open menu",
              children: /* @__PURE__ */ jsx(List, { size: 26, weight: "light" })
            }
          )
        ] })
      }
    ),
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: "fixed inset-0 bg-black/98 flex flex-col justify-center items-center",
        style: {
          zIndex: 1100,
          transform: menuOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.35s cubic-bezier(0.4,0,0.2,1)"
        },
        children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              "data-testid": "button-close-menu",
              className: "absolute top-6 right-6 text-white flex items-center justify-center",
              style: { minWidth: 44, minHeight: 44 },
              onClick: () => setMenuOpen(false),
              "aria-label": "Close menu",
              children: /* @__PURE__ */ jsx(X$1, { size: 32, weight: "light" })
            }
          ),
          /* @__PURE__ */ jsx("nav", { className: "flex flex-col gap-7 text-center", children: navItems.map(({ label, href }) => /* @__PURE__ */ jsx(
            "a",
            {
              href,
              "data-testid": `link-mobile-nav-${label.toLowerCase()}`,
              onClick: (e) => {
                if (href.startsWith("#")) {
                  e.preventDefault();
                  handleNavClick(href);
                } else {
                  setMenuOpen(false);
                }
              },
              className: "ui-card-title text-white",
              style: { fontSize: "clamp(1.5rem, 4vw, 2.25rem)" },
              children: label
            },
            label
          )) })
        ]
      }
    )
  ] });
}
const FOOTER_ICON_SIZE = 24;
const FOOTER_MAIL_ICON_SIZE = 26;
function Footer() {
  return /* @__PURE__ */ jsx(
    "footer",
    {
      className: "bg-black py-8 md:py-10 font-legacy",
      style: { borderTop: "1px solid rgba(192,192,192,0.2)" },
      children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-5 md:px-6 lg:px-16", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row items-center justify-between gap-5 md:gap-6", children: [
        /* @__PURE__ */ jsx("div", { className: "flex items-center flex-shrink-0", children: /* @__PURE__ */ jsx(
          "img",
          {
            src: "/lgf-logo.png",
            alt: "LOWGRADEFILMS",
            className: "object-contain",
            style: { height: 58, width: "auto", opacity: 0.84 }
          }
        ) }),
        /* @__PURE__ */ jsxs("div", { className: "text-gray-500 text-[11px] md:text-xs tracking-widest uppercase text-center order-3 md:order-2", children: [
          "© ",
          (/* @__PURE__ */ new Date()).getFullYear(),
          " LOWGRADEFILMS. All rights reserved."
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 text-gray-400 order-2 md:order-3", children: [
          /* @__PURE__ */ jsx(
            "a",
            {
              "data-testid": "link-instagram",
              href: CONTACT.instagram,
              target: "_blank",
              rel: "noreferrer",
              className: "hover:text-white transition-colors flex items-center justify-center",
              style: { minWidth: 44, minHeight: 44 },
              "aria-label": "Instagram",
              children: /* @__PURE__ */ jsx(
                InstagramLogo,
                {
                  size: FOOTER_ICON_SIZE,
                  weight: "light",
                  style: { width: FOOTER_ICON_SIZE, height: FOOTER_ICON_SIZE }
                }
              )
            }
          ),
          /* @__PURE__ */ jsx(
            "a",
            {
              "data-testid": "link-email",
              href: `mailto:${CONTACT.email}`,
              className: "hover:text-white transition-colors flex items-center justify-center",
              style: { minWidth: 44, minHeight: 44 },
              "aria-label": "Email",
              children: /* @__PURE__ */ jsx(
                EnvelopeSimple,
                {
                  size: FOOTER_MAIL_ICON_SIZE,
                  weight: "light",
                  style: { width: FOOTER_MAIL_ICON_SIZE, height: FOOTER_MAIL_ICON_SIZE }
                }
              )
            }
          )
        ] })
      ] }) })
    }
  );
}
function PageShell({
  children
}) {
  useEffect(() => {
    const scrollToHash = () => {
      const hash = window.location.hash;
      if (!hash) return;
      window.requestAnimationFrame(() => {
        document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" });
      });
    };
    scrollToHash();
    window.addEventListener("hashchange", scrollToHash);
    return () => window.removeEventListener("hashchange", scrollToHash);
  }, []);
  return /* @__PURE__ */ jsxs("div", { className: "bg-black min-h-screen text-white w-full overflow-x-hidden selection:bg-white selection:text-black", children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsx("main", { children }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}
function upsertMeta(selector, attrs, content) {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement("meta");
    Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value));
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}
function upsertLink(selector, attrs, href) {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement("link");
    Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value));
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}
function RouteMeta({ path }) {
  useEffect(() => {
    const seo = getRouteSeo(path);
    const structuredData = getStructuredData(path);
    document.title = seo.title;
    upsertMeta('meta[name="description"]', { name: "description" }, seo.description);
    upsertMeta('meta[property="og:title"]', { property: "og:title" }, seo.title);
    upsertMeta(
      'meta[property="og:description"]',
      { property: "og:description" },
      seo.description
    );
    upsertMeta('meta[property="og:url"]', { property: "og:url" }, seo.canonicalUrl);
    upsertMeta(
      'meta[property="og:site_name"]',
      { property: "og:site_name" },
      "LOWGRADEFILMS"
    );
    upsertMeta('meta[property="og:image"]', { property: "og:image" }, seo.ogImage);
    upsertMeta(
      'meta[property="og:type"]',
      { property: "og:type" },
      seo.ogType ?? "website"
    );
    upsertMeta(
      'meta[name="twitter:card"]',
      { name: "twitter:card" },
      "summary_large_image"
    );
    upsertMeta('meta[name="twitter:title"]', { name: "twitter:title" }, seo.title);
    upsertMeta(
      'meta[name="twitter:description"]',
      { name: "twitter:description" },
      seo.description
    );
    upsertMeta(
      'meta[name="twitter:image"]',
      { name: "twitter:image" },
      seo.ogImage
    );
    upsertLink('link[rel="canonical"]', { rel: "canonical" }, seo.canonicalUrl);
    const existing = Array.from(
      document.head.querySelectorAll('script[data-route-jsonld="true"]')
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
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}
const HERO_LOADER_MIN_DURATION = 900;
const HERO_LOADER_CURSOR_SIZE = 170;
const HERO_LOADER_MOBILE_QUERY = "(max-width: 767px)";
function LoaderLogo({
  tone
}) {
  const filter = tone === "dark" ? "brightness(0) saturate(100%)" : "grayscale(1) brightness(1.16) contrast(1.06) drop-shadow(0 0 16px rgba(255,255,255,0.14))";
  return /* @__PURE__ */ jsx(
    "img",
    {
      src: "/lgf-logo.png",
      alt: "LGF",
      style: {
        width: "64%",
        height: "auto",
        display: "block",
        filter,
        animation: "lgf-loader-logo-breathe 3.2s ease-in-out infinite"
      }
    }
  );
}
function Hero() {
  const headlineRef = useRef(null);
  const taglineRef = useRef(null);
  const ctaRef = useRef(null);
  const arrowRef = useRef(null);
  const loaderRef = useRef(null);
  const loaderLogoRef = useRef(null);
  const loaderCardRef = useRef(null);
  const loaderCursorRef = useRef(null);
  const loaderCardRevealRef = useRef(null);
  const exitTimelineRef = useRef(null);
  const loaderStartRef = useRef(0);
  const [showLoader, setShowLoader] = useState(false);
  const [heroReady, setHeroReady] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [isMobileLoader, setIsMobileLoader] = useState(false);
  useEffect(() => {
    loaderStartRef.current = performance.now();
    setShowLoader(true);
  }, []);
  useEffect(() => {
    const media = window.matchMedia(HERO_LOADER_MOBILE_QUERY);
    const sync = () => setIsMobileLoader(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);
  useEffect(() => {
    if (!heroReady) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        [headlineRef.current, taglineRef.current, ctaRef.current, arrowRef.current],
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power2.out",
          stagger: 0.22,
          delay: 0.3
        }
      );
    });
    return () => ctx.revert();
  }, [heroReady]);
  useEffect(() => {
    if (!showLoader) return;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    const introTimeline = gsap.timeline();
    introTimeline.fromTo(
      loaderLogoRef.current,
      { autoAlpha: 0, y: 14, scale: 0.96 },
      {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: "power2.out"
      }
    );
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      introTimeline.kill();
    };
  }, [showLoader]);
  useEffect(() => {
    if (!showLoader || !videoReady || !loaderRef.current) return;
    const elapsed = performance.now() - loaderStartRef.current;
    const remaining = Math.max(0, HERO_LOADER_MIN_DURATION - elapsed);
    const finishLoader = () => {
      exitTimelineRef.current?.kill();
      exitTimelineRef.current = gsap.timeline({
        onComplete: () => {
          document.body.style.overflow = "";
          document.documentElement.style.overflow = "";
          setShowLoader(false);
          setHeroReady(true);
        }
      });
      exitTimelineRef.current.to(
        loaderRef.current,
        {
          autoAlpha: 0,
          scale: 1.015,
          duration: 0.6,
          ease: "power2.out"
        }
      );
    };
    const timeout = window.setTimeout(finishLoader, remaining);
    return () => {
      window.clearTimeout(timeout);
      exitTimelineRef.current?.kill();
      exitTimelineRef.current = null;
    };
  }, [showLoader, videoReady]);
  useEffect(
    () => () => {
      exitTimelineRef.current?.kill();
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    },
    []
  );
  const handleLoaderPointerMove = (event) => {
    if (isMobileLoader) return;
    const loaderEl = loaderRef.current;
    const cardEl = loaderCardRef.current;
    const cursorEl = loaderCursorRef.current;
    const revealEl = loaderCardRevealRef.current;
    if (!loaderEl || !cursorEl) return;
    const loaderRect = loaderEl.getBoundingClientRect();
    const pointerX = event.clientX - loaderRect.left;
    const pointerY = event.clientY - loaderRect.top;
    cursorEl.style.opacity = "1";
    cursorEl.style.transform = `translate3d(${pointerX - HERO_LOADER_CURSOR_SIZE / 2}px, ${pointerY - HERO_LOADER_CURSOR_SIZE / 2}px, 0)`;
    if (!cardEl || !revealEl) {
      return;
    }
    const cardRect = cardEl.getBoundingClientRect();
    const insideCard = event.clientX >= cardRect.left && event.clientX <= cardRect.right && event.clientY >= cardRect.top && event.clientY <= cardRect.bottom;
    if (!insideCard) {
      revealEl.style.opacity = "0";
      return;
    }
    const cardX = event.clientX - cardRect.left;
    const cardY = event.clientY - cardRect.top;
    revealEl.style.opacity = "1";
    revealEl.style.clipPath = `circle(${HERO_LOADER_CURSOR_SIZE / 2}px at ${cardX}px ${cardY}px)`;
    revealEl.style.webkitClipPath = `circle(${HERO_LOADER_CURSOR_SIZE / 2}px at ${cardX}px ${cardY}px)`;
  };
  const handleLoaderPointerLeave = () => {
    loaderCursorRef.current?.style.setProperty("opacity", "0");
    loaderCardRevealRef.current?.style.setProperty("opacity", "0");
  };
  return /* @__PURE__ */ jsxs("section", { className: "relative h-[100dvh] w-full bg-black", children: [
    showLoader && /* @__PURE__ */ jsxs(
      "div",
      {
        ref: loaderRef,
        onMouseMove: handleLoaderPointerMove,
        onMouseEnter: handleLoaderPointerMove,
        onMouseLeave: handleLoaderPointerLeave,
        style: {
          position: "fixed",
          inset: 0,
          zIndex: 5e3,
          background: "#000000",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
          overflow: "hidden"
        },
        children: [
          !isMobileLoader && /* @__PURE__ */ jsx(
            "div",
            {
              ref: loaderCursorRef,
              "aria-hidden": "true",
              className: "pointer-events-none absolute rounded-full bg-white",
              style: {
                left: 0,
                top: 0,
                width: HERO_LOADER_CURSOR_SIZE,
                height: HERO_LOADER_CURSOR_SIZE,
                mixBlendMode: "difference",
                zIndex: 2,
                opacity: 0,
                transform: "translate3d(-9999px, -9999px, 0)",
                willChange: "transform, opacity",
                transition: "opacity 120ms ease-out"
              }
            }
          ),
          /* @__PURE__ */ jsx(
            "div",
            {
              ref: loaderLogoRef,
              className: "relative",
              style: {
                width: isMobileLoader ? "min(10rem, 42vw)" : "min(42rem, 92vw)",
                minHeight: isMobileLoader ? "min(10rem, 42vw)" : "min(42rem, 92vw)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: isMobileLoader ? "1.25rem" : "2rem",
                overflow: "visible",
                zIndex: 1
              },
              children: isMobileLoader ? /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    "aria-hidden": "true",
                    style: {
                      pointerEvents: "none",
                      position: "absolute",
                      inset: "-18%",
                      borderRadius: "50%",
                      background: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.075), rgba(255,255,255,0.022) 34%, rgba(255,255,255,0.006) 54%, rgba(0,0,0,0) 76%)",
                      filter: "blur(24px)",
                      opacity: 0.8
                    }
                  }
                ),
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    "aria-hidden": "true",
                    style: {
                      pointerEvents: "none",
                      position: "absolute",
                      inset: "-42%",
                      borderRadius: "50%",
                      background: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.03), rgba(255,255,255,0.008) 42%, rgba(0,0,0,0) 74%)",
                      filter: "blur(38px)",
                      opacity: 0.55
                    }
                  }
                ),
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    "aria-hidden": "true",
                    style: {
                      position: "relative",
                      zIndex: 1,
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    },
                    children: /* @__PURE__ */ jsx(LoaderLogo, { tone: "chrome" })
                  }
                )
              ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    "aria-hidden": "true",
                    style: {
                      position: "absolute",
                      inset: "10%",
                      borderRadius: "999px",
                      background: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.045), rgba(255,255,255,0.012) 44%, rgba(0,0,0,0) 76%)",
                      pointerEvents: "none",
                      zIndex: 0,
                      filter: "blur(18px)"
                    }
                  }
                ),
                /* @__PURE__ */ jsxs(
                  "div",
                  {
                    ref: loaderCardRef,
                    className: "relative overflow-hidden",
                    style: {
                      textAlign: "center",
                      zIndex: 1,
                      width: "min(18rem, 60vw)",
                      aspectRatio: "1 / 1",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "2.5rem",
                      background: "#ffffff",
                      boxShadow: "0 28px 90px rgba(0,0,0,0.32), 0 0 0 1px rgba(255,255,255,0.08)"
                    },
                    children: [
                      /* @__PURE__ */ jsx(
                        "div",
                        {
                          "aria-hidden": "true",
                          style: {
                            position: "absolute",
                            inset: "1px",
                            borderRadius: "calc(2.5rem - 1px)",
                            border: "1px solid rgba(0,0,0,0.04)",
                            pointerEvents: "none",
                            zIndex: 0
                          }
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        "div",
                        {
                          style: {
                            position: "relative",
                            zIndex: 1,
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                          },
                          children: /* @__PURE__ */ jsx(LoaderLogo, { tone: "dark" })
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        "div",
                        {
                          ref: loaderCardRevealRef,
                          "aria-hidden": "true",
                          className: "pointer-events-none absolute inset-0 overflow-hidden",
                          style: {
                            zIndex: 2,
                            transition: "opacity 120ms ease-out",
                            opacity: 0
                          },
                          children: /* @__PURE__ */ jsx(
                            "div",
                            {
                              style: {
                                width: "100%",
                                height: "100%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                              },
                              children: /* @__PURE__ */ jsx(LoaderLogo, { tone: "chrome" })
                            }
                          )
                        }
                      )
                    ]
                  }
                )
              ] })
            }
          ),
          /* @__PURE__ */ jsx("style", { children: `
            @keyframes lgf-loader-logo-breathe {
              0%, 100% {
                transform: scale(1);
                opacity: 0.96;
              }
              50% {
                transform: scale(1.028);
                opacity: 1;
              }
            }
          ` })
        ]
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 overflow-hidden", style: { zIndex: 0 }, children: /* @__PURE__ */ jsx(
      "iframe",
      {
        src: VIMEO_HERO,
        frameBorder: "0",
        allow: "autoplay; fullscreen; picture-in-picture",
        title: "Hero background",
        className: "vimeo-cover absolute inset-0",
        style: { pointerEvents: "none" },
        onLoad: () => setVideoReady(true)
      }
    ) }),
    /* @__PURE__ */ jsx(
      "div",
      {
        "aria-hidden": "true",
        style: {
          position: "absolute",
          inset: 0,
          zIndex: 1,
          pointerEvents: "none",
          background: "radial-gradient(ellipse 120% 100% at 50% 40%, transparent 30%, rgba(0,0,0,0.5) 70%, rgba(0,0,0,0.82) 100%)"
        }
      }
    ),
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "absolute inset-0",
        style: {
          background: "rgba(0,0,0,0.35)",
          pointerEvents: "none",
          zIndex: 1
        }
      }
    ),
    /* @__PURE__ */ jsx(
      "div",
      {
        "aria-hidden": "true",
        style: {
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "22%",
          zIndex: 2,
          pointerEvents: "none",
          background: "linear-gradient(to top, transparent 0%, rgba(0,0,0,0.45) 100%)"
        }
      }
    ),
    /* @__PURE__ */ jsx(
      "div",
      {
        "aria-hidden": "true",
        style: {
          position: "absolute",
          bottom: -2,
          left: 0,
          right: 0,
          height: "45%",
          zIndex: 2,
          pointerEvents: "none",
          background: "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.65) 55%, #000000 100%)"
        }
      }
    ),
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: "absolute inset-0 flex flex-col items-center justify-center px-6",
        style: { zIndex: 10 },
        children: [
          /* @__PURE__ */ jsx(
            "h1",
            {
              ref: headlineRef,
              className: "section-heading-xl text-white text-center max-w-[12ch]",
              style: {
                opacity: 0,
                fontSize: "clamp(2.35rem, 7.4vw, 5.8rem)",
                lineHeight: 0.92,
                letterSpacing: "-0.04em",
                textWrap: "balance"
              },
              children: "BUILT TO BE REMEMBERED."
            }
          ),
          /* @__PURE__ */ jsx(
            "p",
            {
              ref: taglineRef,
              className: "ui-body text-center font-legacy",
              style: {
                fontSize: "clamp(0.98rem, 1.5vw, 1.18rem)",
                lineHeight: 1.55,
                color: "rgba(232,232,232,0.82)",
                maxWidth: "36rem",
                marginTop: "1rem",
                opacity: 0
              },
              children: "International visual productions for automotive, tactical, and commercial brands that need sharper presence and lasting recall."
            }
          ),
          /* @__PURE__ */ jsxs(
            "div",
            {
              ref: ctaRef,
              className: "mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4",
              style: { opacity: 0 },
              children: [
                /* @__PURE__ */ jsxs(
                  "a",
                  {
                    href: "#work",
                    className: "group relative inline-flex min-w-[190px] items-center justify-center overflow-hidden surface-rounded px-8 py-4 text-white transition-all duration-300",
                    style: {
                      minHeight: 52,
                      border: "1.5px solid rgba(255,255,255,0.85)",
                      background: "#ffffff",
                      color: "#000000"
                    },
                    children: [
                      /* @__PURE__ */ jsx("span", { className: "ui-cta-text relative z-10 transition-colors duration-300 group-hover:text-white", children: "VIEW WORK" }),
                      /* @__PURE__ */ jsx(
                        "span",
                        {
                          "aria-hidden": "true",
                          className: "absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100",
                          style: { background: "linear-gradient(135deg, #0f0f12, #1b1b20)" }
                        }
                      )
                    ]
                  }
                ),
                /* @__PURE__ */ jsxs(
                  "a",
                  {
                    href: "#contact",
                    className: "group relative inline-flex min-w-[190px] items-center justify-center overflow-hidden surface-rounded px-8 py-4 text-white transition-all duration-300",
                    style: {
                      minHeight: 52,
                      border: "1.5px solid rgba(192,192,192,0.48)",
                      background: "rgba(0,0,0,0.24)",
                      backdropFilter: "blur(4px)",
                      WebkitBackdropFilter: "blur(4px)"
                    },
                    children: [
                      /* @__PURE__ */ jsx(
                        "span",
                        {
                          "aria-hidden": "true",
                          className: "absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100",
                          style: { background: "linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.04))" }
                        }
                      ),
                      /* @__PURE__ */ jsx("span", { className: "ui-cta-text relative z-10 text-white transition-colors duration-300", children: "START A PROJECT" })
                    ]
                  }
                )
              ]
            }
          )
        ]
      }
    )
  ] });
}
const FILM_COPY = [
  {
    title: "GRAND REVEALS",
    label: "Corporate Event Filming"
  },
  {
    title: "STEEL & SMOKE",
    label: "Motorsports Event Coverages"
  }
];
function Films() {
  const sectionRef = useRef(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".films-anim",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          stagger: 0.12,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%"
          }
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);
  return /* @__PURE__ */ jsxs(
    "section",
    {
      id: "films",
      ref: sectionRef,
      className: "relative bg-black section-shell-tight",
      children: [
        /* @__PURE__ */ jsx("div", { className: "text-center section-heading-wrap section-inner films-anim", children: /* @__PURE__ */ jsx("h2", { className: "section-heading text-white", children: "SHORT FILMS" }) }),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "films-layout mx-auto px-4 md:px-6 lg:px-10",
            style: { gap: "clamp(1.5rem, 5vw, 82px)" },
            children: FILMS.map((film, index) => {
              const copy = FILM_COPY[index];
              return /* @__PURE__ */ jsxs("div", { className: "films-card films-anim flex flex-col", children: [
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: "films-panel-box surface-rounded relative overflow-hidden",
                    style: { background: "#000" },
                    children: /* @__PURE__ */ jsx("div", { className: "films-media-mask", children: /* @__PURE__ */ jsx(
                      "iframe",
                      {
                        src: film.vimeoSrc,
                        frameBorder: "0",
                        allow: "autoplay; fullscreen; picture-in-picture",
                        title: film.title,
                        className: "vimeo-cover absolute inset-0",
                        style: { pointerEvents: "none" }
                      }
                    ) })
                  }
                ),
                /* @__PURE__ */ jsxs("div", { className: "mt-4 px-1", children: [
                  /* @__PURE__ */ jsx("p", { className: "ui-card-title text-white", style: { fontSize: 20 }, children: copy.title }),
                  /* @__PURE__ */ jsx(
                    "p",
                    {
                      className: "ui-cta-text mt-1 inline-block",
                      style: { color: "#C0C0C0", textDecoration: "none" },
                      children: copy.label
                    }
                  )
                ] })
              ] }, film.id);
            })
          }
        )
      ]
    }
  );
}
const clamp01 = (v) => Math.min(1, Math.max(0, v));
const easeInOutCubic = (x) => x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
const CameraGimbalScene = lazy(
  () => import("./assets/CameraGimbalScene-CI5MpF_N.js")
);
const TITLE_LINES = [
  { text: "BEING SEEN", className: "text-white", marginTop: "0", align: "left" },
  { text: "IS EASY.", className: "text-white", marginTop: "0.08em", align: "right" },
  {
    text: "BEING REMEMBERED",
    className: "text-chrome",
    marginTop: "0.08em",
    align: "left"
  },
  { text: "IS NOT.", className: "text-chrome", marginTop: "0.08em", align: "right" }
];
const HUD_STATS = [
  {
    key: "activeClients",
    label: "ACTIVE CLIENTS",
    target: 15,
    suffix: "+",
    dot: { top: "37.2%", left: "74.6%" },
    text: { top: "30.4%", left: "78.1%", width: "8.2rem" },
    line: { x2: "78.0%", y2: "33.6%" }
  },
  {
    key: "projectsDone",
    label: "PROJECTS DONE",
    target: 250,
    suffix: "+",
    dot: { top: "50.1%", left: "61.1%" },
    text: { top: "46.5%", left: "52%", width: "7.8rem" },
    line: { x2: "59.85%", y2: "49.25%" }
  },
  {
    key: "gloriousYears",
    label: "GLORIOUS YEARS",
    target: 7,
    suffix: "+",
    dot: { top: "61.4%", left: "73.1%" },
    text: { top: "65.6%", left: "76.2%", width: "7.8rem" },
    line: { x2: "76.1%", y2: "67.8%" }
  }
];
function About() {
  const wrapperRef = useRef(null);
  const pinRef = useRef(null);
  const rigProgressRef = useRef(1);
  const rigPanRef = useRef(1);
  const targetProgressRef = useRef(0);
  const smoothProgressRef = useRef(0);
  const rafRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [hudValues, setHudValues] = useState({
    activeClients: 0,
    projectsDone: 0,
    gloriousYears: 0
  });
  const hudStartedRef = useRef(false);
  const hudTweenRef = useRef(null);
  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const sync = () => setIsMobile(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);
  useEffect(() => {
    const track = wrapperRef.current;
    const pinEl = pinRef.current;
    if (!track || !pinEl) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      targetProgressRef.current = 1;
      smoothProgressRef.current = 1;
      setProgress(1);
      return;
    }
    targetProgressRef.current = smoothProgressRef.current;
    const refresh = () => ScrollTrigger.refresh();
    const trigger = ScrollTrigger.create({
      trigger: track,
      start: "top top",
      end: () => `+=${Math.max(1, track.offsetHeight - window.innerHeight)}`,
      pin: pinEl,
      pinSpacing: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      scrub: true,
      fastScrollEnd: false,
      onUpdate: (self) => {
        targetProgressRef.current = self.progress;
        const delta = Math.abs(self.progress - smoothProgressRef.current);
        const velocity = Math.abs(self.getVelocity());
        const catchUpDelta = isMobile ? 0.2 : 0.15;
        const catchUpVelocity = isMobile ? 2400 : 1800;
        if (delta > catchUpDelta && velocity > catchUpVelocity) {
          const boostedProgress = gsap.utils.interpolate(
            smoothProgressRef.current,
            self.progress,
            isMobile ? 0.48 : 0.42
          );
          smoothProgressRef.current = boostedProgress;
          setProgress(boostedProgress);
        }
      },
      onRefresh: (self) => {
        targetProgressRef.current = self.progress;
        smoothProgressRef.current = self.progress;
        setProgress(self.progress);
      },
      onLeave: () => {
        targetProgressRef.current = 1;
        smoothProgressRef.current = 1;
        setProgress(1);
      },
      onLeaveBack: () => {
        targetProgressRef.current = 0;
        smoothProgressRef.current = 0;
        setProgress(0);
      }
    });
    const tick = () => {
      const target = targetProgressRef.current;
      const current = smoothProgressRef.current;
      const delta = target - current;
      const magnitude = Math.abs(delta);
      const baseEase = isMobile ? 0.18 : 0.13;
      const adaptiveEase = Math.min(
        isMobile ? 0.34 : 0.28,
        baseEase + magnitude * (isMobile ? 0.38 : 0.32)
      );
      const next = magnitude < 12e-4 ? target : current + delta * adaptiveEase;
      smoothProgressRef.current = next;
      setProgress((prev) => {
        if (Math.abs(prev - next) < 8e-4) return prev;
        return next;
      });
      rafRef.current = window.requestAnimationFrame(tick);
    };
    rafRef.current = window.requestAnimationFrame(tick);
    const rafA = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(refresh);
    });
    window.addEventListener("load", refresh);
    document.fonts?.ready.then(refresh).catch(() => void 0);
    return () => {
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
      window.cancelAnimationFrame(rafA);
      window.removeEventListener("load", refresh);
      trigger.kill();
    };
  }, [isMobile]);
  useEffect(() => {
    const triggerPoint = 0.8;
    const resetPoint = 0.62;
    if (progress < resetPoint) {
      hudTweenRef.current?.kill();
      hudTweenRef.current = null;
      hudStartedRef.current = false;
      setHudValues((prev) => {
        if (prev.activeClients === 0 && prev.projectsDone === 0 && prev.gloriousYears === 0) {
          return prev;
        }
        return {
          activeClients: 0,
          projectsDone: 0,
          gloriousYears: 0
        };
      });
      return;
    }
    if (hudStartedRef.current || progress < triggerPoint) return;
    hudStartedRef.current = true;
    const proxy = {
      activeClients: 0,
      projectsDone: 0,
      gloriousYears: 0
    };
    setHudValues({
      activeClients: 0,
      projectsDone: 0,
      gloriousYears: 0
    });
    hudTweenRef.current?.kill();
    hudTweenRef.current = gsap.to(proxy, {
      activeClients: 15,
      projectsDone: 250,
      gloriousYears: 7,
      duration: 2,
      ease: "power2.out",
      onUpdate: () => {
        setHudValues({
          activeClients: Math.round(proxy.activeClients),
          projectsDone: Math.round(proxy.projectsDone),
          gloriousYears: Math.round(proxy.gloriousYears)
        });
      }
    });
  }, [progress]);
  useEffect(
    () => () => {
      hudTweenRef.current?.kill();
      hudTweenRef.current = null;
    },
    []
  );
  const visualProgress = clamp01(progress / (isMobile ? 0.9 : 0.86));
  const linePhase = clamp01(
    (visualProgress - (isMobile ? 0.12 : 0.08)) / (isMobile ? 0.08 : 0.06)
  );
  const panelPhase = clamp01(
    (visualProgress - (isMobile ? 0.2 : 0.14)) / (isMobile ? 0.18 : 0.14)
  );
  const text1Fade = clamp01(
    (visualProgress - (isMobile ? 0.38 : 0.28)) / (isMobile ? 0.08 : 0.07)
  );
  const swapPhase = clamp01(
    (visualProgress - (isMobile ? 0.48 : 0.35)) / (isMobile ? 0.2 : 0.18)
  );
  const titleDriftPhase = easeInOutCubic(
    clamp01((visualProgress - 0.01) / (isMobile ? 0.22 : 0.16))
  );
  const panelVisible = visualProgress >= 0.08 ? 1 : 0;
  const lineVisible = panelPhase < (isMobile ? 0.88 : 0.96) ? panelVisible : 0;
  const stagePhase = clamp01(
    (visualProgress - (isMobile ? 0.76 : 0.7)) / (isMobile ? 0.12 : 0.14)
  );
  const rigPhase = isMobile ? clamp01((visualProgress - 0.67) / 0.2) : clamp01((visualProgress - 0.55) / 0.28);
  const rigSettlePhase = isMobile ? clamp01((visualProgress - 0.84) / 0.08) : clamp01((visualProgress - 0.78) / 0.08);
  const paragraphPhase = clamp01(
    (visualProgress - (isMobile ? 0.73 : 0.65)) / (isMobile ? 0.08 : 0.09)
  );
  const easedRigSettlePhase = easeInOutCubic(rigSettlePhase);
  const titleDriftOffset = isMobile ? 4 : 9;
  rigProgressRef.current = rigPhase;
  rigPanRef.current = 0;
  return /* @__PURE__ */ jsx(
    "div",
    {
      ref: wrapperRef,
      id: "about",
      style: {
        height: isMobile ? "252vh" : "306vh",
        position: "relative",
        background: "#000"
      },
      children: /* @__PURE__ */ jsxs(
        "div",
        {
          ref: pinRef,
          style: {
            width: "100%",
            height: "100vh",
            background: "#18181b",
            overflow: isMobile ? "clip" : "hidden",
            position: "relative",
            color: "#fff"
          },
          children: [
            /* @__PURE__ */ jsx(
              "div",
              {
                "aria-hidden": "true",
                style: {
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "clamp(140px, 18vw, 240px)",
                  pointerEvents: "none",
                  background: "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.86) 18%, rgba(0,0,0,0.54) 42%, rgba(0,0,0,0.18) 68%, rgba(0,0,0,0) 100%)",
                  zIndex: 2
                }
              }
            ),
            /* @__PURE__ */ jsx(
              "div",
              {
                style: {
                  position: "absolute",
                  inset: 0,
                  zIndex: 0,
                  display: "flex",
                  alignItems: "center",
                  padding: "0 clamp(1.5rem, 4vw, 4rem)",
                  opacity: 1 - text1Fade,
                  willChange: "opacity"
                },
                children: /* @__PURE__ */ jsx(
                  "div",
                  {
                    style: {
                      width: "100%",
                      maxWidth: isMobile ? "22.5rem" : "min(70rem, 92vw)",
                      margin: "0 auto",
                      paddingInline: isMobile ? "clamp(0.65rem, 3.2vw, 1rem)" : "clamp(0.75rem, 1.5vw, 1.4rem)",
                      overflow: "visible"
                    },
                    children: TITLE_LINES.map((line, index) => /* @__PURE__ */ jsx(
                      "div",
                      {
                        className: `${line.className} font-sans`,
                        style: {
                          display: "block",
                          width: "100%",
                          boxSizing: "border-box",
                          textAlign: line.align,
                          marginTop: line.marginTop,
                          paddingRight: !isMobile && line.text === "BEING REMEMBERED" ? "0.42em" : isMobile && line.text === "BEING REMEMBERED" ? "0.12em" : "0",
                          transform: `translate3d(${index < 2 ? -titleDriftPhase * titleDriftOffset : titleDriftPhase * titleDriftOffset}px, 0, 0)`,
                          willChange: "transform",
                          fontSize: isMobile ? "clamp(1.38rem, 7.2vw, 2.4rem)" : line.text === "BEING REMEMBERED" ? "clamp(2.48rem, 6.15vw, 6.32rem)" : "clamp(2.8rem, 6.8vw, 7rem)",
                          lineHeight: 1,
                          letterSpacing: "-0.035em",
                          fontWeight: 850,
                          textTransform: "uppercase"
                        },
                        children: isMobile && line.text === "BEING REMEMBERED" ? /* @__PURE__ */ jsxs(Fragment, { children: [
                          /* @__PURE__ */ jsx("span", { style: { display: "block", width: "100%", textAlign: "left" }, children: "BEING" }),
                          /* @__PURE__ */ jsx("span", { style: { display: "block" }, children: "REMEMBERED" })
                        ] }) : line.text
                      },
                      line.text
                    ))
                  }
                )
              }
            ),
            /* @__PURE__ */ jsxs(
              "div",
              {
                style: {
                  position: "absolute",
                  inset: 0,
                  zIndex: 10,
                  pointerEvents: "none",
                  overflow: "hidden"
                },
                children: [
                  /* @__PURE__ */ jsx(
                    "div",
                    {
                      style: {
                        position: "absolute",
                        top: "50%",
                        left: 0,
                        width: "100%",
                        height: "2px",
                        transform: `translateY(-50%) scaleX(${linePhase})`,
                        transformOrigin: "center center",
                        background: "#000",
                        opacity: lineVisible,
                        willChange: "transform, opacity"
                      }
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "div",
                    {
                      style: {
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: "50%",
                        transform: `scaleY(${panelPhase})`,
                        transformOrigin: "bottom center",
                        background: "#000",
                        opacity: panelVisible,
                        willChange: "transform"
                      }
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "div",
                    {
                      style: {
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: "50%",
                        transform: `scaleY(${panelPhase})`,
                        transformOrigin: "top center",
                        background: "#000",
                        opacity: panelVisible,
                        willChange: "transform"
                      }
                    }
                  )
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              "div",
              {
                style: {
                  position: "absolute",
                  inset: 0,
                  zIndex: 20,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: isMobile ? "0 clamp(1.25rem, 5vw, 1.75rem)" : "0 clamp(2rem, 4vw, 3rem)",
                  overflow: isMobile ? "clip" : "hidden"
                },
                children: [
                  /* @__PURE__ */ jsx(
                    "div",
                    {
                      style: {
                        width: "100%",
                        height: "100%",
                        position: "relative",
                        clipPath: `inset(0 0 ${(1 - swapPhase) * 100}% 0)`,
                        willChange: "clip-path"
                      },
                      children: /* @__PURE__ */ jsx(
                        "div",
                        {
                          style: {
                            position: "absolute",
                            left: isMobile ? "clamp(1.25rem, 6vw, 1.75rem)" : "clamp(2rem, 8vw, 7rem)",
                            right: isMobile ? "clamp(1.25rem, 6vw, 1.75rem)" : "auto",
                            top: isMobile ? "55.5%" : "50%",
                            width: isMobile ? "auto" : "min(34rem, 44vw)",
                            transform: isMobile ? `translate3d(0, ${56 - stagePhase * 56}px, 0)` : `translate3d(0, calc(${72 - stagePhase * 72}px - 50%), 0)`,
                            willChange: "transform",
                            opacity: paragraphPhase,
                            textAlign: isMobile ? "center" : "initial"
                          },
                          children: /* @__PURE__ */ jsxs(
                            "div",
                            {
                              style: {
                                position: "relative",
                                paddingTop: "clamp(1rem, 1.4vw, 1.25rem)",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: isMobile ? "center" : "stretch"
                              },
                              children: [
                                !isMobile && /* @__PURE__ */ jsxs(Fragment, { children: [
                                  /* @__PURE__ */ jsx(
                                    "div",
                                    {
                                      style: {
                                        position: "absolute",
                                        left: 0,
                                        top: 0,
                                        width: "clamp(3.5rem, 5vw, 5.25rem)",
                                        height: "1px",
                                        background: "linear-gradient(90deg, rgba(192,192,192,0.95), rgba(232,232,232,0.55), rgba(232,232,232,0))",
                                        opacity: 0.92
                                      }
                                    }
                                  ),
                                  /* @__PURE__ */ jsx(
                                    "div",
                                    {
                                      style: {
                                        position: "absolute",
                                        left: 0,
                                        top: "-0.22rem",
                                        width: "0.42rem",
                                        height: "0.42rem",
                                        borderRadius: "999px",
                                        background: "#d9d9d9",
                                        boxShadow: "0 0 16px rgba(255,255,255,0.22)"
                                      }
                                    }
                                  )
                                ] }),
                                isMobile && /* @__PURE__ */ jsx(
                                  "div",
                                  {
                                    style: {
                                      display: "none"
                                    },
                                    children: /* @__PURE__ */ jsx("span", {})
                                  }
                                ),
                                /* @__PURE__ */ jsx(
                                  "p",
                                  {
                                    style: {
                                      margin: 0,
                                      color: "rgba(255,255,255,0.84)",
                                      fontSize: isMobile ? "clamp(0.95rem, 3.9vw, 1.1rem)" : "clamp(1.02rem, 1.18vw, 1.28rem)",
                                      lineHeight: isMobile ? 1.72 : 1.66,
                                      fontWeight: 500,
                                      letterSpacing: "-0.008em",
                                      maxWidth: isMobile ? "18.5rem" : "29rem",
                                      textAlign: isMobile ? "center" : "left"
                                    },
                                    children: "LGF develops visual productions designed to stand apart from the ordinary, combining refined execution with a relentless attention to detail."
                                  }
                                ),
                                isMobile && /* @__PURE__ */ jsx(
                                  "div",
                                  {
                                    style: {
                                      marginTop: "1.35rem",
                                      width: "100%",
                                      maxWidth: "18.5rem",
                                      display: "flex",
                                      justifyContent: "space-between",
                                      alignItems: "flex-start",
                                      gap: "1rem"
                                    },
                                    children: HUD_STATS.map((stat) => /* @__PURE__ */ jsxs(
                                      "div",
                                      {
                                        style: {
                                          flex: 1,
                                          minWidth: 0,
                                          textAlign: "center"
                                        },
                                        children: [
                                          /* @__PURE__ */ jsxs(
                                            "div",
                                            {
                                              style: {
                                                fontSize: "24px",
                                                fontWeight: 700,
                                                color: "#fff",
                                                lineHeight: 1
                                              },
                                              children: [
                                                hudValues[stat.key],
                                                stat.suffix
                                              ]
                                            }
                                          ),
                                          /* @__PURE__ */ jsx(
                                            "div",
                                            {
                                              style: {
                                                fontSize: "8px",
                                                textTransform: "uppercase",
                                                letterSpacing: "0.1em",
                                                color: "rgba(255,255,255,0.58)",
                                                marginTop: "7px",
                                                lineHeight: 1.3
                                              },
                                              children: stat.label
                                            }
                                          )
                                        ]
                                      },
                                      stat.key
                                    ))
                                  }
                                )
                              ]
                            }
                          )
                        }
                      )
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "div",
                    {
                      style: {
                        position: "absolute",
                        left: isMobile ? "48.5%" : "auto",
                        right: isMobile ? "auto" : "clamp(5rem, 16vw, 14rem)",
                        top: isMobile ? "35.5%" : "50%",
                        width: isMobile ? "min(86vw, 480px)" : "min(46vw, 700px)",
                        height: isMobile ? "min(48vh, 420px)" : "min(68vh, 720px)",
                        pointerEvents: "none",
                        filter: "drop-shadow(0 28px 70px rgba(0,0,0,0.46))",
                        transform: isMobile ? `translate3d(calc(-50% + ${14 - easedRigSettlePhase * 14}px), calc(-50% + ${10 - easedRigSettlePhase * 10}px), 0)` : `translate3d(${48 - easedRigSettlePhase * 58}px, calc(-50% + ${18 - easedRigSettlePhase * 8}px), 0)`,
                        transformOrigin: "center center",
                        overflow: "visible",
                        opacity: 0.14 + rigPhase * 0.86,
                        willChange: "transform, opacity"
                      },
                      children: /* @__PURE__ */ jsx(
                        "div",
                        {
                          style: {
                            position: "absolute",
                            inset: isMobile ? "0 0.55rem 0 0" : "clamp(0.2rem, 0.8vw, 0.8rem) clamp(1.4rem, 3vw, 2.6rem) clamp(0.8rem, 1.8vw, 1.6rem) clamp(0.2rem, 0.8vw, 0.8rem)"
                          },
                          children: /* @__PURE__ */ jsx(Suspense, { fallback: null, children: /* @__PURE__ */ jsx(
                            CameraGimbalScene,
                            {
                              progress: rigProgressRef,
                              panProgress: rigPanRef
                            }
                          ) })
                        }
                      )
                    }
                  ),
                  !isMobile && /* @__PURE__ */ jsxs(
                    "div",
                    {
                      style: {
                        position: "absolute",
                        inset: 0,
                        zIndex: 24,
                        pointerEvents: "none",
                        opacity: paragraphPhase,
                        transition: "opacity 220ms linear"
                      },
                      children: [
                        /* @__PURE__ */ jsx(
                          "svg",
                          {
                            "aria-hidden": "true",
                            style: {
                              position: "absolute",
                              inset: 0,
                              width: "100%",
                              height: "100%",
                              overflow: "visible"
                            },
                            children: HUD_STATS.map((stat) => /* @__PURE__ */ jsx(
                              "line",
                              {
                                x1: stat.dot.left,
                                y1: stat.dot.top,
                                x2: stat.line.x2,
                                y2: stat.line.y2,
                                stroke: "rgba(255,255,255,0.55)",
                                strokeWidth: "1",
                                strokeLinecap: "round"
                              },
                              `${stat.key}-line`
                            ))
                          }
                        ),
                        HUD_STATS.map((stat) => /* @__PURE__ */ jsxs(
                          "div",
                          {
                            style: {
                              position: "absolute",
                              inset: 0
                            },
                            children: [
                              /* @__PURE__ */ jsxs(
                                "div",
                                {
                                  style: {
                                    position: "absolute",
                                    top: stat.dot.top,
                                    left: stat.dot.left,
                                    width: "0.92rem",
                                    height: "0.92rem",
                                    transform: "translate(-50%, -50%)"
                                  },
                                  children: [
                                    /* @__PURE__ */ jsx(
                                      "span",
                                      {
                                        style: {
                                          position: "absolute",
                                          inset: 0,
                                          borderRadius: "999px",
                                          border: "1px solid rgba(255,255,255,0.4)"
                                        }
                                      }
                                    ),
                                    /* @__PURE__ */ jsx(
                                      "span",
                                      {
                                        style: {
                                          position: "absolute",
                                          left: "50%",
                                          top: "50%",
                                          width: "0.34rem",
                                          height: "0.34rem",
                                          borderRadius: "999px",
                                          background: "#fff",
                                          transform: "translate(-50%, -50%)",
                                          boxShadow: "0 0 10px rgba(255,255,255,0.25)"
                                        }
                                      }
                                    )
                                  ]
                                }
                              ),
                              /* @__PURE__ */ jsxs(
                                "div",
                                {
                                  style: {
                                    position: "absolute",
                                    top: stat.text.top,
                                    left: stat.text.left,
                                    width: stat.text.width,
                                    padding: "0",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "flex-start",
                                    gap: "2px",
                                    textAlign: "left"
                                  },
                                  children: [
                                    /* @__PURE__ */ jsx(
                                      "div",
                                      {
                                        style: {
                                          fontSize: "8px",
                                          letterSpacing: "0.1em",
                                          textTransform: "uppercase",
                                          color: "rgba(255,255,255,0.66)",
                                          fontWeight: 600,
                                          lineHeight: 1.1
                                        },
                                        children: stat.label
                                      }
                                    ),
                                    /* @__PURE__ */ jsxs(
                                      "div",
                                      {
                                        style: {
                                          fontSize: "clamp(1.55rem, 1.9vw, 2rem)",
                                          lineHeight: 0.95,
                                          fontWeight: 700,
                                          color: "rgba(255,255,255,0.96)",
                                          textShadow: "0 0 10px rgba(255,255,255,0.1)",
                                          fontVariantNumeric: "tabular-nums"
                                        },
                                        children: [
                                          hudValues[stat.key],
                                          stat.suffix
                                        ]
                                      }
                                    )
                                  ]
                                }
                              )
                            ]
                          },
                          stat.key
                        ))
                      ]
                    }
                  )
                ]
              }
            )
          ]
        }
      )
    }
  );
}
function useDragScroll() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;
    const onMouseDown = (e) => {
      isDown = true;
      el.style.cursor = "grabbing";
      startX = e.pageX - el.offsetLeft;
      scrollLeft = el.scrollLeft;
    };
    const onMouseLeave = () => {
      isDown = false;
      el.style.cursor = "grab";
    };
    const onMouseUp = () => {
      isDown = false;
      el.style.cursor = "grab";
    };
    const onMouseMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - el.offsetLeft;
      const walk = (x - startX) * 1.6;
      el.scrollLeft = scrollLeft - walk;
    };
    el.style.cursor = "grab";
    el.addEventListener("mousedown", onMouseDown);
    el.addEventListener("mouseleave", onMouseLeave);
    el.addEventListener("mouseup", onMouseUp);
    el.addEventListener("mousemove", onMouseMove);
    return () => {
      el.removeEventListener("mousedown", onMouseDown);
      el.removeEventListener("mouseleave", onMouseLeave);
      el.removeEventListener("mouseup", onMouseUp);
      el.removeEventListener("mousemove", onMouseMove);
    };
  }, []);
  return ref;
}
const Dialog = DialogPrimitive.Root;
const DialogPortal = DialogPrimitive.Portal;
const DialogOverlay = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Overlay,
  {
    ref,
    className: cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props
  }
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;
const DialogContent = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(DialogPortal, { children: [
  /* @__PURE__ */ jsx(DialogOverlay, {}),
  /* @__PURE__ */ jsxs(
    DialogPrimitive.Content,
    {
      ref,
      className: cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsxs(DialogPrimitive.Close, { className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground", children: [
          /* @__PURE__ */ jsx(X, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Close" })
        ] })
      ]
    }
  )
] }));
DialogContent.displayName = DialogPrimitive.Content.displayName;
const DialogTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Title,
  {
    ref,
    className: cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    ),
    ...props
  }
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;
const DialogDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Description,
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;
function Gallery() {
  const introRef = useRef(null);
  const stripRef = useDragScroll();
  const [activeIndex, setActiveIndex] = useState(null);
  const activePhoto = activeIndex === null ? null : GALLERY_PHOTOS[activeIndex];
  const goToPrevious = () => {
    setActiveIndex((current) => {
      if (current === null) return current;
      return current === 0 ? GALLERY_PHOTOS.length - 1 : current - 1;
    });
  };
  const goToNext = () => {
    setActiveIndex((current) => {
      if (current === null) return current;
      return current === GALLERY_PHOTOS.length - 1 ? 0 : current + 1;
    });
  };
  useEffect(() => {
    const el = introRef.current;
    if (!el) return;
    const anim = gsap.fromTo(
      el.querySelectorAll("[data-gallery-intro-item]"),
      { opacity: 0, y: 22 },
      {
        opacity: 1,
        y: 0,
        duration: 0.72,
        ease: "power2.out",
        stagger: 0.1,
        scrollTrigger: { trigger: el, start: "top 85%" }
      }
    );
    return () => {
      anim.kill();
    };
  }, []);
  useEffect(() => {
    if (activeIndex === null) return;
    const onKeyDown = (event) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goToPrevious();
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        goToNext();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeIndex]);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("section", { id: "work", className: "section-shell bg-black pt-12 md:pt-0", children: [
      /* @__PURE__ */ jsxs("div", { ref: introRef, className: "section-inner section-heading-wrap text-center", children: [
        /* @__PURE__ */ jsx(
          "h2",
          {
            "data-gallery-intro-item": true,
            className: "section-heading-xl text-chrome",
            style: { opacity: 0 },
            children: "THE WORK"
          }
        ),
        /* @__PURE__ */ jsx(
          "p",
          {
            "data-gallery-intro-item": true,
            className: "ui-body mx-auto mt-4 text-white/70",
            style: {
              maxWidth: "42rem",
              fontSize: "clamp(0.98rem, 1.15vw, 1.08rem)",
              lineHeight: 1.62
            },
            children: "A tightly edited selection across automotive, tactical, and commercial productions. Open any frame to move through the full gallery."
          }
        )
      ] }),
      /* @__PURE__ */ jsx(
        "div",
        {
          ref: stripRef,
          "data-testid": "gallery-strip",
          className: "flex section-inner select-none work-strip",
          style: {
            gap: "clamp(0.5rem, 1vw, 0.85rem)",
            overflowX: "auto",
            overflowY: "visible",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
            touchAction: "pan-x pan-y pinch-zoom",
            overscrollBehaviorX: "contain"
          },
          children: GALLERY_PHOTOS.map((photo, i) => /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              "data-testid": `card-gallery-${i}`,
              "aria-label": `Open ${photo.label.toLowerCase()} gallery image ${i + 1}`,
              className: "group relative overflow-hidden bg-[#111] flex-shrink-0 surface-rounded work-card text-left",
              style: {
                width: "clamp(272px, 23vw, 342px)",
                height: "clamp(412px, 31vw, 520px)",
                scrollSnapAlign: "start"
              },
              onClick: () => setActiveIndex(i),
              children: [
                /* @__PURE__ */ jsx(
                  "img",
                  {
                    src: photo.src,
                    alt: photo.label,
                    loading: "lazy",
                    decoding: "async",
                    className: "w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.045]",
                    draggable: false,
                    style: { pointerEvents: "none", display: "block" }
                  }
                ),
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: "absolute inset-0",
                    style: {
                      background: "linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.04) 38%, rgba(0,0,0,0.28) 68%, rgba(0,0,0,0.74) 100%)",
                      zIndex: 1,
                      pointerEvents: "none"
                    }
                  }
                ),
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: "absolute left-4 top-4 md:left-5 md:top-5",
                    style: {
                      zIndex: 3,
                      pointerEvents: "none",
                      border: "1px solid rgba(232,232,232,0.16)",
                      background: "rgba(0,0,0,0.24)",
                      backdropFilter: "blur(4px)",
                      WebkitBackdropFilter: "blur(4px)",
                      borderRadius: "999px",
                      padding: "0.42rem 0.7rem"
                    },
                    children: /* @__PURE__ */ jsx("span", { className: "ui-eyebrow text-white/76", children: photo.label })
                  }
                ),
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: "absolute inset-x-0 bottom-0 px-4 pb-4 pt-12 md:px-5 md:pb-5",
                    style: { zIndex: 3, pointerEvents: "none" }
                  }
                ),
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: "absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100",
                    style: {
                      zIndex: 2,
                      border: "1px solid rgba(232,232,232,0.18)",
                      pointerEvents: "none"
                    }
                  }
                )
              ]
            },
            i
          ))
        }
      ),
      /* @__PURE__ */ jsx("style", { children: `
          [data-testid="gallery-strip"]::-webkit-scrollbar { display: none; }

          @media (max-width: 767px) {
            .work-strip {
              gap: 0.75rem;
            }

            .work-card {
              width: min(74vw, 300px) !important;
              height: min(112vw, 430px) !important;
            }
          }

          @media (min-width: 768px) {
            .work-strip {
              scroll-snap-type: x proximity;
            }

            .work-card:nth-child(3n + 2) {
              width: clamp(292px, 24.8vw, 370px) !important;
            }

            .work-card:nth-child(3n) {
              width: clamp(258px, 21.8vw, 320px) !important;
            }
          }
        ` })
    ] }),
    /* @__PURE__ */ jsx(
      Dialog,
      {
        open: activeIndex !== null,
        onOpenChange: (open) => {
          if (!open) setActiveIndex(null);
        },
        children: /* @__PURE__ */ jsx(
          DialogContent,
          {
            className: "max-h-[92vh] max-w-[min(94vw,1200px)] overflow-hidden border-white/10 bg-black/96 p-0 text-white shadow-[0_24px_120px_rgba(0,0,0,0.7)]",
            children: activePhoto && /* @__PURE__ */ jsx("div", { className: "relative overflow-hidden surface-rounded", children: /* @__PURE__ */ jsxs("div", { className: "relative flex h-[min(92vh,860px)] min-h-0 items-center justify-center bg-black", children: [
              /* @__PURE__ */ jsx(
                "img",
                {
                  src: activePhoto.src,
                  alt: activePhoto.label,
                  className: "h-full max-h-full w-full object-contain",
                  draggable: false
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  "aria-label": "Previous image",
                  onClick: goToPrevious,
                  className: "absolute left-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/14 bg-black/42 text-white/82 backdrop-blur-sm transition hover:border-white/28 hover:bg-black/62 hover:text-white focus:outline-none",
                  children: /* @__PURE__ */ jsx(ChevronLeft, { className: "h-5 w-5" })
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  "aria-label": "Next image",
                  onClick: goToNext,
                  className: "absolute right-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/14 bg-black/42 text-white/82 backdrop-blur-sm transition hover:border-white/28 hover:bg-black/62 hover:text-white focus:outline-none",
                  children: /* @__PURE__ */ jsx(ChevronRight, { className: "h-5 w-5" })
                }
              ),
              /* @__PURE__ */ jsxs(
                "div",
                {
                  className: "absolute bottom-4 left-1/2 z-10 -translate-x-1/2 rounded-full border border-white/12 bg-black/46 px-4 py-2 backdrop-blur-sm",
                  style: {
                    fontFamily: "var(--font-primary)",
                    fontSize: "0.78rem",
                    fontWeight: 600,
                    letterSpacing: "0.18em"
                  },
                  children: [
                    String(activeIndex + 1).padStart(2, "0"),
                    " /",
                    " ",
                    String(GALLERY_PHOTOS.length).padStart(2, "0")
                  ]
                }
              )
            ] }) })
          }
        )
      }
    )
  ] });
}
const ICON_MAP = { Car, Crosshair, Aperture };
function ServiceCard({
  title,
  description,
  iconName,
  bgImage
}) {
  const [hovered, setHovered] = useState(false);
  const Icon = ICON_MAP[iconName];
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: "group relative overflow-hidden bg-[#0a0a0a] surface-rounded services-anim",
      style: {
        minHeight: "clamp(340px, 35vw, 490px)",
        boxShadow: hovered ? "0 0 34px rgba(255,255,255,0.12)" : "none"
      },
      onMouseEnter: () => setHovered(true),
      onMouseLeave: () => setHovered(false),
      children: [
        /* @__PURE__ */ jsx(
          "img",
          {
            src: bgImage,
            alt: title,
            loading: "lazy",
            decoding: "async",
            className: "absolute inset-0 w-full h-full object-cover transition-all duration-500 ease-out",
            style: {
              transform: hovered ? "scale(1.025)" : "scale(1)",
              filter: hovered ? "brightness(1.12) saturate(1.06)" : "brightness(0.98) saturate(0.98)"
            },
            draggable: false
          }
        ),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "absolute inset-0 transition-opacity duration-500",
            style: {
              opacity: hovered ? 0.97 : 0.9,
              background: hovered ? "linear-gradient(to bottom, rgba(18,18,18,0.08) 0%, rgba(0,0,0,0.24) 34%, rgba(0,0,0,0.58) 100%)" : "linear-gradient(to bottom, rgba(0,0,0,0.32) 0%, rgba(0,0,0,0.5) 34%, rgba(0,0,0,0.82) 100%)"
            }
          }
        ),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "absolute inset-0 pointer-events-none transition-opacity duration-500",
            style: {
              opacity: hovered ? 1 : 0,
              border: "1px solid rgba(255,255,255,0.16)"
            }
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "relative h-full flex flex-col p-6 md:p-10", style: { zIndex: 2 }, children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              className: "mb-8 md:mb-10 flex items-center justify-between transition-transform duration-300",
              style: { transform: hovered ? "translateY(-2px)" : "translateY(0)" },
              children: /* @__PURE__ */ jsx(
                "div",
                {
                  className: "text-white/92",
                  style: {
                    border: "1px solid rgba(232,232,232,0.16)",
                    background: "rgba(0,0,0,0.24)",
                    backdropFilter: "blur(4px)",
                    WebkitBackdropFilter: "blur(4px)",
                    borderRadius: "999px",
                    padding: "0.75rem"
                  },
                  children: /* @__PURE__ */ jsx(Icon, { size: 36, weight: "thin" })
                }
              )
            }
          ),
          /* @__PURE__ */ jsx(
            "h3",
            {
              className: "text-white uppercase font-bold",
              style: {
                fontSize: "clamp(1.08rem, 1.65vw, 1.42rem)",
                lineHeight: 1.08,
                letterSpacing: "0.01em",
                fontWeight: "var(--fw-heading)",
                maxWidth: "12ch"
              },
              children: title
            }
          ),
          /* @__PURE__ */ jsx(
            "p",
            {
              className: "mt-4 text-white/68",
              style: {
                fontSize: "clamp(0.92rem, 0.98vw, 0.98rem)",
                lineHeight: 1.5,
                maxWidth: "22ch",
                fontWeight: "var(--fw-body)"
              },
              children: description
            }
          )
        ] })
      ]
    }
  );
}
function Services() {
  const sectionRef = useRef(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".services-anim",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          stagger: 0.12,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%"
          }
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);
  return /* @__PURE__ */ jsx("section", { id: "services", ref: sectionRef, className: "section-shell bg-black", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto section-inner", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center section-heading-wrap services-anim", children: [
      /* @__PURE__ */ jsx("h2", { className: "section-heading text-chrome", children: "WHAT WE DO" }),
      /* @__PURE__ */ jsx(
        "p",
        {
          className: "ui-body mx-auto mt-4 text-white/70",
          style: {
            maxWidth: "42rem",
            fontSize: "clamp(0.98rem, 1.15vw, 1.08rem)",
            lineHeight: 1.62
          },
          children: "Purpose-built productions for machines, products, and brands that need sharper visual presence without losing clarity or restraint."
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-6 md:mt-10", children: SERVICES.map((service) => /* @__PURE__ */ jsx(
      ServiceCard,
      {
        title: service.title,
        description: service.description,
        iconName: service.iconName,
        bgImage: service.bgImage
      },
      service.id
    )) })
  ] }) });
}
function Community() {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: "600px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (!visible) return;
    const d = document;
    if (d.querySelector('script[src="https://w.behold.so/widget.js"]')) return;
    const s = d.createElement("script");
    s.type = "module";
    s.src = "https://w.behold.so/widget.js";
    d.head.append(s);
  }, [visible]);
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".community-anim",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          stagger: 0.15,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%"
          }
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);
  return /* @__PURE__ */ jsx("section", { id: "community", ref: sectionRef, className: "section-shell bg-black", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto section-inner", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center section-heading-wrap community-anim", children: [
      /* @__PURE__ */ jsx("h2", { className: "section-heading text-chrome mb-4", children: "COMMUNITY" }),
      /* @__PURE__ */ jsx(
        "a",
        {
          href: CONTACT.instagram,
          target: "_blank",
          rel: "noreferrer",
          className: "ui-eyebrow text-gray-400 hover:text-white transition-colors",
          children: "@lowgradefilms"
        }
      )
    ] }),
    visible && /* @__PURE__ */ jsx(
      "div",
      {
        className: "community-anim",
        style: {
          maxWidth: 1200,
          width: "100%",
          margin: "0 auto 48px",
          minHeight: "clamp(420px, 62vw, 820px)"
        },
        dangerouslySetInnerHTML: {
          __html: `<behold-widget feed-id="${BEHOLD_FEED_ID}"></behold-widget>`
        }
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "flex justify-center community-anim", children: /* @__PURE__ */ jsxs(
      "a",
      {
        href: CONTACT.instagram,
        target: "_blank",
        rel: "noreferrer",
        className: "group relative inline-flex items-center justify-center px-12 py-4 text-white transition-all duration-300 overflow-hidden surface-rounded",
        style: { border: "1.5px solid rgba(192,192,192,0.5)", minHeight: 52 },
        children: [
          /* @__PURE__ */ jsx(
            "span",
            {
              className: "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300",
              style: { background: "linear-gradient(135deg, #C0C0C0, #E8E8E8, #A8A8A8)" }
            }
          ),
          /* @__PURE__ */ jsx("span", { className: "ui-cta-text relative z-10 group-hover:text-black transition-colors duration-300", children: "FOLLOW US" })
        ]
      }
    ) })
  ] }) });
}
function LogoItem({
  src,
  alt,
  scale = 1
}) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      style: {
        flex: "0 0 clamp(132px, 12vw, 190px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "clamp(132px, 12vw, 190px)",
        padding: "0 clamp(12px, 2.2vw, 22px)",
        height: "clamp(68px, 7vw, 88px)",
        overflow: "visible"
      },
      children: /* @__PURE__ */ jsx(
        "img",
        {
          src,
          alt,
          loading: "lazy",
          decoding: "async",
          draggable: false,
          className: "partner-logo",
          style: { transform: `scale(${scale})` }
        }
      )
    }
  );
}
function Partners() {
  const headingRef = useRef(null);
  useEffect(() => {
    const el = headingRef.current;
    if (!el) return;
    const anim = gsap.fromTo(
      el,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 85%" }
      }
    );
    return () => {
      anim.kill();
    };
  }, []);
  return /* @__PURE__ */ jsxs("section", { id: "partners", className: "section-shell-tight bg-black overflow-hidden", children: [
    /* @__PURE__ */ jsx("div", { ref: headingRef, className: "text-center section-heading-wrap", children: /* @__PURE__ */ jsx("h2", { className: "section-heading text-chrome", children: "TRUSTED BY" }) }),
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: "relative w-full overflow-hidden bg-[#050505] marquee-wrapper",
        style: {
          borderTop: "1px solid rgba(192,192,192,0.15)",
          borderBottom: "1px solid rgba(192,192,192,0.15)",
          borderRadius: 0
        },
        children: [
          /* @__PURE__ */ jsx("div", { className: "absolute left-0 top-0 bottom-0 pointer-events-none", style: { width: "clamp(60px, 10vw, 160px)", background: "linear-gradient(to right, #050505 20%, transparent)", zIndex: 10 } }),
          /* @__PURE__ */ jsx("div", { className: "absolute right-0 top-0 bottom-0 pointer-events-none", style: { width: "clamp(60px, 10vw, 160px)", background: "linear-gradient(to left, #050505 20%, transparent)", zIndex: 10 } }),
          /* @__PURE__ */ jsxs("div", { className: "marquee-track", style: { padding: "clamp(18px, 4vw, 28px) 0" }, children: [
            PARTNER_LOGOS.map((logo, i) => /* @__PURE__ */ jsx(LogoItem, { src: logo.src, alt: logo.alt, scale: logo.scale }, `a-${i}`)),
            PARTNER_LOGOS.map((logo, i) => /* @__PURE__ */ jsx(LogoItem, { src: logo.src, alt: logo.alt, scale: logo.scale }, `b-${i}`))
          ] })
        ]
      }
    )
  ] });
}
const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
);
const Label = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  LabelPrimitive.Root,
  {
    ref,
    className: cn(labelVariants(), className),
    ...props
  }
));
Label.displayName = LabelPrimitive.Root.displayName;
const Form = FormProvider;
const FormFieldContext = React.createContext(null);
const FormField = ({
  ...props
}) => {
  return /* @__PURE__ */ jsx(FormFieldContext.Provider, { value: { name: props.name }, children: /* @__PURE__ */ jsx(Controller, { ...props }) });
};
const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();
  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>");
  }
  if (!itemContext) {
    throw new Error("useFormField should be used within <FormItem>");
  }
  const fieldState = getFieldState(fieldContext.name, formState);
  const { id } = itemContext;
  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState
  };
};
const FormItemContext = React.createContext(null);
const FormItem = React.forwardRef(({ className, ...props }, ref) => {
  const id = React.useId();
  return /* @__PURE__ */ jsx(FormItemContext.Provider, { value: { id }, children: /* @__PURE__ */ jsx("div", { ref, className: cn("space-y-2", className), ...props }) });
});
FormItem.displayName = "FormItem";
const FormLabel = React.forwardRef(({ className, ...props }, ref) => {
  const { error, formItemId } = useFormField();
  return /* @__PURE__ */ jsx(
    Label,
    {
      ref,
      className: cn(error && "text-destructive", className),
      htmlFor: formItemId,
      ...props
    }
  );
});
FormLabel.displayName = "FormLabel";
const FormControl = React.forwardRef(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField();
  return /* @__PURE__ */ jsx(
    Slot,
    {
      ref,
      id: formItemId,
      "aria-describedby": !error ? `${formDescriptionId}` : `${formDescriptionId} ${formMessageId}`,
      "aria-invalid": !!error,
      ...props
    }
  );
});
FormControl.displayName = "FormControl";
const FormDescription = React.forwardRef(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField();
  return /* @__PURE__ */ jsx(
    "p",
    {
      ref,
      id: formDescriptionId,
      className: cn("text-[0.8rem] text-muted-foreground", className),
      ...props
    }
  );
});
FormDescription.displayName = "FormDescription";
const FormMessage = React.forwardRef(({ className, children, ...props }, ref) => {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error?.message ?? "") : children;
  if (!body) {
    return null;
  }
  return /* @__PURE__ */ jsx(
    "p",
    {
      ref,
      id: formMessageId,
      className: cn("text-[0.8rem] font-medium text-destructive", className),
      ...props,
      children: body
    }
  );
});
FormMessage.displayName = "FormMessage";
const Input = React.forwardRef(
  ({ className, type, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "input",
      {
        type,
        className: cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        ),
        ref,
        ...props
      }
    );
  }
);
Input.displayName = "Input";
const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  return /* @__PURE__ */ jsx(
    "textarea",
    {
      className: cn(
        "flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      ),
      ref,
      ...props
    }
  );
});
Textarea.displayName = "Textarea";
const Select = SelectPrimitive.Root;
const SelectValue = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(SelectPrimitive.Value, { ref, className, ...props }));
SelectValue.displayName = SelectPrimitive.Value.displayName;
const SelectTrigger = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(
  SelectPrimitive.Trigger,
  {
    ref,
    className: cn(
      "flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsx(SelectPrimitive.Icon, { asChild: true, children: /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4 opacity-50" }) })
    ]
  }
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;
const SelectScrollUpButton = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SelectPrimitive.ScrollUpButton,
  {
    ref,
    className: cn(
      "flex cursor-default items-center justify-center py-1",
      className
    ),
    ...props,
    children: /* @__PURE__ */ jsx(ChevronUp, { className: "h-4 w-4" })
  }
));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;
const SelectScrollDownButton = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SelectPrimitive.ScrollDownButton,
  {
    ref,
    className: cn(
      "flex cursor-default items-center justify-center py-1",
      className
    ),
    ...props,
    children: /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4" })
  }
));
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName;
const SelectContent = React.forwardRef(({ className, children, position = "popper", ...props }, ref) => /* @__PURE__ */ jsx(SelectPrimitive.Portal, { children: /* @__PURE__ */ jsxs(
  SelectPrimitive.Content,
  {
    ref,
    className: cn(
      "relative z-50 max-h-[--radix-select-content-available-height] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-select-content-transform-origin]",
      position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
      className
    ),
    position,
    ...props,
    children: [
      /* @__PURE__ */ jsx(SelectScrollUpButton, {}),
      /* @__PURE__ */ jsx(
        SelectPrimitive.Viewport,
        {
          className: cn(
            "p-1",
            position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
          ),
          children
        }
      ),
      /* @__PURE__ */ jsx(SelectScrollDownButton, {})
    ]
  }
) }));
SelectContent.displayName = SelectPrimitive.Content.displayName;
const SelectLabel = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SelectPrimitive.Label,
  {
    ref,
    className: cn("px-2 py-1.5 text-sm font-semibold", className),
    ...props
  }
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;
const SelectItem = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(
  SelectPrimitive.Item,
  {
    ref,
    className: cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    ...props,
    children: [
      /* @__PURE__ */ jsx("span", { className: "absolute right-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsx(SelectPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx(Check, { className: "h-4 w-4" }) }) }),
      /* @__PURE__ */ jsx(SelectPrimitive.ItemText, { children })
    ]
  }
));
SelectItem.displayName = SelectPrimitive.Item.displayName;
const SelectSeparator = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SelectPrimitive.Separator,
  {
    ref,
    className: cn("-mx-1 my-1 h-px bg-muted", className),
    ...props
  }
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;
const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  projectType: z.string().min(1, "Please select a project type"),
  message: z.string().min(10, "Please provide more details")
});
const inputClass = "bg-[#0a0a0a] border-[#333] text-white placeholder:text-gray-600 focus-visible:ring-1 focus-visible:ring-gray-400 surface-rounded-sm h-12 font-legacy";
const labelClass = "ui-eyebrow text-gray-300 font-legacy";
function Contact() {
  const sectionRef = useRef(null);
  const [submitState, setSubmitState] = useState({ tone: "idle", message: "" });
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", projectType: "", message: "" }
  });
  const onSubmit = async (values) => {
    setSubmitState({ tone: "idle", message: "" });
    try {
      const response = await fetch(
        `https://formsubmit.co/ajax/${encodeURIComponent(CONTACT.email)}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
          },
          body: JSON.stringify({
            name: values.name,
            email: values.email,
            projectType: values.projectType,
            message: values.message,
            _subject: `New LGF inquiry: ${values.projectType}`,
            _captcha: "false",
            _template: "table"
          })
        }
      );
      const data = await response.json();
      if (!response.ok || data.success === false || data.success === "false") {
        throw new Error(data.message || "Unable to send your message right now.");
      }
      setSubmitState({
        tone: "success",
        message: "Message sent. We'll be in touch shortly."
      });
      form.reset();
    } catch (error) {
      setSubmitState({
        tone: "error",
        message: error instanceof Error ? error.message : "Something went wrong while sending your message."
      });
    }
  };
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".contact-anim",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          stagger: 0.15,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%"
          }
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);
  return /* @__PURE__ */ jsx("section", { id: "contact", ref: sectionRef, className: "section-shell bg-black", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto section-inner", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center section-heading-wrap contact-anim", children: [
      /* @__PURE__ */ jsx("h2", { className: "section-heading text-chrome mb-4 leading-tight", children: "LET'S CREATE SOMETHING." }),
      /* @__PURE__ */ jsx("p", { className: "ui-body text-gray-400 text-base md:text-lg max-w-xl mx-auto font-legacy", children: "Drop us a message or hit us on WhatsApp. We respond fast." })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-12 lg:gap-16 max-w-5xl mx-auto", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-6 md:gap-8 contact-anim order-1 lg:order-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-[#0D0D0D] p-6 md:p-10 border border-[#1e1e1e] flex flex-col items-center text-center flex-1 justify-center min-h-[280px] md:min-h-[320px] surface-rounded", children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              className: "w-20 h-20 flex items-center justify-center mb-6",
              style: { background: "rgba(37,211,102,0.1)", borderRadius: "50%" },
              children: /* @__PURE__ */ jsx(WhatsappLogo, { size: 40, color: "#25D366", weight: "fill" })
            }
          ),
          /* @__PURE__ */ jsx("h3", { className: "ui-card-title text-white mb-3", children: "Prefer to chat?" }),
          /* @__PURE__ */ jsx("p", { className: "ui-body text-gray-400 mb-8 text-sm md:text-base max-w-[26ch] mx-auto font-legacy", children: "Message us directly on WhatsApp. We're online and ready to roll." }),
          /* @__PURE__ */ jsxs(
            "a",
            {
              "data-testid": "link-whatsapp",
              href: CONTACT.whatsapp,
              target: "_blank",
              rel: "noreferrer",
              className: "ui-cta-text font-legacy flex items-center justify-center gap-3 px-8 py-4 transition-colors animate-pulse-green w-full surface-rounded-sm",
              style: { background: "#25D366", color: "#000", minHeight: 52 },
              children: [
                /* @__PURE__ */ jsx(WhatsappLogo, { size: 20, weight: "fill" }),
                "Open WhatsApp"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "text-center py-1 md:py-4", children: [
          /* @__PURE__ */ jsx("p", { className: "ui-eyebrow text-gray-600 mb-2 font-legacy", children: "Or email us directly" }),
          /* @__PURE__ */ jsx(
            "a",
            {
              "data-testid": "link-email",
              href: `mailto:${CONTACT.email}`,
              className: "ui-cta-text text-chrome hover:text-white transition-colors break-all sm:break-normal",
              children: CONTACT.email
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "contact-anim order-2 lg:order-1", children: /* @__PURE__ */ jsx(Form, { ...form, children: /* @__PURE__ */ jsxs("form", { onSubmit: form.handleSubmit(onSubmit), className: "space-y-6", children: [
        /* @__PURE__ */ jsx(
          FormField,
          {
            control: form.control,
            name: "name",
            render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
              /* @__PURE__ */ jsx(FormLabel, { className: labelClass, children: "Name" }),
              /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
                Input,
                {
                  "data-testid": "input-name",
                  placeholder: "John Doe",
                  ...field,
                  className: inputClass
                }
              ) }),
              /* @__PURE__ */ jsx(FormMessage, { className: "text-red-400" })
            ] })
          }
        ),
        /* @__PURE__ */ jsx(
          FormField,
          {
            control: form.control,
            name: "email",
            render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
              /* @__PURE__ */ jsx(FormLabel, { className: labelClass, children: "Email" }),
              /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
                Input,
                {
                  "data-testid": "input-email",
                  placeholder: "john@example.com",
                  ...field,
                  className: inputClass
                }
              ) }),
              /* @__PURE__ */ jsx(FormMessage, { className: "text-red-400" })
            ] })
          }
        ),
        /* @__PURE__ */ jsx(
          FormField,
          {
            control: form.control,
            name: "projectType",
            render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
              /* @__PURE__ */ jsx(FormLabel, { className: labelClass, children: "Project Type" }),
              /* @__PURE__ */ jsxs(Select, { onValueChange: field.onChange, defaultValue: field.value, children: [
                /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
                  SelectTrigger,
                  {
                    "data-testid": "select-project-type",
                    className: "bg-[#0a0a0a] border-[#333] text-white focus:ring-1 focus:ring-gray-400 surface-rounded-sm h-12 font-legacy [&>span]:font-legacy",
                    style: { fontFamily: "var(--font-legacy)" },
                    children: /* @__PURE__ */ jsx(
                      SelectValue,
                      {
                        className: "font-legacy",
                        placeholder: "Select type",
                        style: { fontFamily: "var(--font-legacy)" }
                      }
                    )
                  }
                ) }),
                /* @__PURE__ */ jsxs(
                  SelectContent,
                  {
                    className: "bg-[#0a0a0a] border-[#333] text-white surface-rounded-sm font-legacy [&_*]:!font-legacy",
                    style: { fontFamily: "var(--font-legacy)" },
                    children: [
                      /* @__PURE__ */ jsx(SelectItem, { className: "font-legacy [&_*]:!font-legacy", value: "Automobile", style: { fontFamily: "var(--font-legacy)" }, children: "Automobile Productions" }),
                      /* @__PURE__ */ jsx(SelectItem, { className: "font-legacy [&_*]:!font-legacy", value: "Tactical", style: { fontFamily: "var(--font-legacy)" }, children: "Tactical & Firearms" }),
                      /* @__PURE__ */ jsx(SelectItem, { className: "font-legacy [&_*]:!font-legacy", value: "Commercial", style: { fontFamily: "var(--font-legacy)" }, children: "Commercial Campaigns" }),
                      /* @__PURE__ */ jsx(SelectItem, { className: "font-legacy [&_*]:!font-legacy", value: "Product Launch", style: { fontFamily: "var(--font-legacy)" }, children: "Product Launch" }),
                      /* @__PURE__ */ jsx(SelectItem, { className: "font-legacy [&_*]:!font-legacy", value: "Corporate Films", style: { fontFamily: "var(--font-legacy)" }, children: "Corporate Films" }),
                      /* @__PURE__ */ jsx(SelectItem, { className: "font-legacy [&_*]:!font-legacy", value: "Other", style: { fontFamily: "var(--font-legacy)" }, children: "Other" })
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsx(FormMessage, { className: "text-red-400" })
            ] })
          }
        ),
        /* @__PURE__ */ jsx(
          FormField,
          {
            control: form.control,
            name: "message",
            render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
              /* @__PURE__ */ jsx(FormLabel, { className: labelClass, children: "Message" }),
              /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
                Textarea,
                {
                  "data-testid": "textarea-message",
                  placeholder: "Tell us about your project...",
                  className: "bg-[#0a0a0a] border-[#333] text-white placeholder:text-gray-600 focus-visible:ring-1 focus-visible:ring-gray-400 surface-rounded-sm min-h-[130px] resize-none font-legacy",
                  ...field
                }
              ) }),
              /* @__PURE__ */ jsx(FormMessage, { className: "text-red-400" })
            ] })
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            "data-testid": "button-submit",
            type: "submit",
            disabled: form.formState.isSubmitting,
            className: "ui-cta-text group flex w-full items-center justify-center surface-rounded-sm border border-[rgba(232,232,232,0.6)] bg-transparent px-6 text-white transition-colors duration-300 hover:bg-white hover:text-black",
            style: { height: 56 },
            children: form.formState.isSubmitting ? "Sending..." : "Send Message"
          }
        ),
        submitState.message ? /* @__PURE__ */ jsx(
          "p",
          {
            className: submitState.tone === "error" ? "ui-body text-sm text-red-400 font-legacy" : "ui-body text-sm text-gray-300 font-legacy",
            children: submitState.message
          }
        ) : null
      ] }) }) })
    ] })
  ] }) });
}
function Home() {
  return /* @__PURE__ */ jsxs(PageShell, { children: [
    /* @__PURE__ */ jsx(RouteMeta, { path: "/" }),
    /* @__PURE__ */ jsx(Hero, {}),
    /* @__PURE__ */ jsx(Films, {}),
    /* @__PURE__ */ jsx(About, {}),
    /* @__PURE__ */ jsx(Gallery, {}),
    /* @__PURE__ */ jsx(Services, {}),
    /* @__PURE__ */ jsx(Community, {}),
    /* @__PURE__ */ jsx(Partners, {}),
    /* @__PURE__ */ jsx(Contact, {})
  ] });
}
function PageIntro({
  title,
  description
}) {
  return /* @__PURE__ */ jsx("section", { className: "bg-black pt-28 md:pt-32 lg:pt-36 pb-8 md:pb-10", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto section-inner", children: /* @__PURE__ */ jsxs("div", { className: "max-w-3xl", children: [
    /* @__PURE__ */ jsx(
      "h1",
      {
        className: "text-white",
        style: {
          fontSize: "clamp(2.5rem, 6vw, 4.75rem)",
          lineHeight: 0.95,
          fontWeight: "var(--fw-heading)",
          letterSpacing: "-0.045em",
          textTransform: "uppercase"
        },
        children: title
      }
    ),
    /* @__PURE__ */ jsx("p", { className: "ui-body text-gray-400 mt-5 text-base md:text-lg max-w-xl", children: description })
  ] }) }) });
}
function AboutPage() {
  return /* @__PURE__ */ jsxs(PageShell, { children: [
    /* @__PURE__ */ jsx(RouteMeta, { path: "/about" }),
    /* @__PURE__ */ jsx(
      PageIntro,
      {
        title: "About",
        description: "An international production house turning machines, metal, and motion into distinctive visual work."
      }
    ),
    /* @__PURE__ */ jsx(About, {}),
    /* @__PURE__ */ jsx(Services, {}),
    /* @__PURE__ */ jsx(Partners, {})
  ] });
}
function WorkPage() {
  return /* @__PURE__ */ jsxs(PageShell, { children: [
    /* @__PURE__ */ jsx(RouteMeta, { path: "/work" }),
    /* @__PURE__ */ jsx(
      PageIntro,
      {
        title: "Work",
        description: "Short films, gallery features, and campaign production across automotive, tactical, and commercial storytelling."
      }
    ),
    /* @__PURE__ */ jsx(Films, {}),
    /* @__PURE__ */ jsx(Gallery, {}),
    /* @__PURE__ */ jsx(Services, {}),
    /* @__PURE__ */ jsx(Community, {})
  ] });
}
function ContactPage() {
  return /* @__PURE__ */ jsxs(PageShell, { children: [
    /* @__PURE__ */ jsx(RouteMeta, { path: "/contact" }),
    /* @__PURE__ */ jsx(
      PageIntro,
      {
        title: "Contact",
        description: "Start a conversation with LOWGRADEFILMS for automotive, tactical, commercial, and launch-focused productions."
      }
    ),
    /* @__PURE__ */ jsx(Contact, {}),
    /* @__PURE__ */ jsx(Partners, {})
  ] });
}
const queryClient = new QueryClient();
function Router() {
  return /* @__PURE__ */ jsxs(Switch, { children: [
    /* @__PURE__ */ jsx(Route, { path: "/", component: Home }),
    /* @__PURE__ */ jsx(Route, { path: "/about", component: AboutPage }),
    /* @__PURE__ */ jsx(Route, { path: "/work", component: WorkPage }),
    /* @__PURE__ */ jsx(Route, { path: "/contact", component: ContactPage }),
    /* @__PURE__ */ jsx(Route, { component: NotFound })
  ] });
}
function App({
  ssrPath,
  ssrSearch
}) {
  return /* @__PURE__ */ jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsxs(TooltipProvider, { children: [
    /* @__PURE__ */ jsx(
      Router$1,
      {
        base: "/".replace(/\/$/, ""),
        ssrPath,
        ssrSearch,
        children: /* @__PURE__ */ jsx(Router, {})
      }
    ),
    /* @__PURE__ */ jsx(Toaster, {})
  ] }) });
}
function render(url) {
  const normalized = new URL(url, "https://lowgradefilms.com");
  const seo = getRouteSeo(normalized.pathname);
  const structuredData = getStructuredData(normalized.pathname);
  const appHtml = renderToString(
    /* @__PURE__ */ jsx(App, { ssrPath: normalized.pathname, ssrSearch: normalized.search })
  );
  return {
    appHtml,
    seo,
    structuredData
  };
}
export {
  render
};
