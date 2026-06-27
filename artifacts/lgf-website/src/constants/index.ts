// ─── Navigation ───────────────────────────────────────────────────────────────
export const NAV_LINKS = [
  { label: "Work",     href: "#work" },
  { label: "Films",    href: "#films" },
  { label: "About",    href: "#about" },
  { label: "Partners", href: "#partners" },
  { label: "Contact",  href: "#contact" },
] as const;

// ─── Hero ─────────────────────────────────────────────────────────────────────
export const VIMEO_HERO =
  "https://player.vimeo.com/video/1204904727?autoplay=1&muted=1&loop=1&background=1&playsinline=1&quality=auto";

// ─── Short Films ──────────────────────────────────────────────────────────────
export const FILMS = [
  {
    id: 1,
    vimeoSrc:
      "https://player.vimeo.com/video/1204904726?autoplay=1&muted=1&loop=1&background=1&playsinline=1&quality=auto",
    title: "DESERT MACHINES",
    description: "Karachi's finest automobiles, raw desert, cinematic fire.",
    cta: "EXPERIENCE ›",
  },
  {
    id: 2,
    vimeoSrc:
      "https://player.vimeo.com/video/1204904725?autoplay=1&muted=1&loop=1&background=1&playsinline=1&quality=auto",
    title: "STEEL & SMOKE",
    description: "Tactical. Precise. Unfiltered.",
    cta: "EXPLORE ›",
  },
] as const;

// ─── Services ─────────────────────────────────────────────────────────────────
export const SERVICES = [
  {
    id: 1,
    iconName: "Car" as const,
    title: "AUTOMOBILE PHOTOGRAPHY & FILM",
    description:
      "Ferraris, muscle cars, supercars — we make every machine look like it belongs on a poster.",
    bgImage: "/photos/bts-2.jpg",
  },
  {
    id: 2,
    iconName: "Crosshair" as const,
    title: "TACTICAL & FIREARMS PHOTOGRAPHY",
    description:
      "Precision. Power. We capture the craft behind every firearm with cinematic intensity.",
    bgImage: "/photos/bts-1.jpg",
  },
  {
    id: 3,
    iconName: "Aperture" as const,
    title: "COMMERCIAL & BRAND SHOOTS",
    description: "Product launches, brand campaigns, content creation — built for impact.",
    bgImage: "/photos/bts-3.jpg",
  },
] as const;

// ─── Gallery ──────────────────────────────────────────────────────────────────
export const GALLERY_PHOTOS = [
  { src: "/photos/gallery-1.JPG",   label: "AUTOMOBILE" },
  { src: "/photos/gallery-2.JPEG",  label: "TACTICAL" },
  { src: "/photos/gallery-3.JPG",   label: "COMMERCIAL" },
  { src: "/photos/gallery-4.JPG",   label: "AUTOMOBILE" },
  { src: "/photos/gallery-5.JPG",   label: "TACTICAL" },
  { src: "/photos/gallery-6.JPG",   label: "COMMERCIAL" },
  { src: "/photos/gallery-7.JPG",   label: "AUTOMOBILE" },
  { src: "/photos/gallery-8.JPG",   label: "TACTICAL" },
  { src: "/photos/gallery-9.JPEG",  label: "COMMERCIAL" },
  { src: "/photos/gallery-10.jpeg", label: "AUTOMOBILE" },
] as const;

// ─── Behind the Lens ──────────────────────────────────────────────────────────
export const BTS_PHOTOS = [
  { src: "/photos/bts-1.jpg", caption: "On location — Desert Shoot",       large: true },
  { src: "/photos/bts-2.jpg", caption: "Automobile Showroom, Karachi",      large: false },
  { src: "/photos/bts-3.jpg", caption: "Behind the frame",                  large: false },
] as const;

// ─── Partners ─────────────────────────────────────────────────────────────────
export const PARTNER_LOGOS = [
  { src: "/photos/partner-1.PNG",  alt: "Partner 1" },
  { src: "/photos/partner-2.PNG",  alt: "Partner 2" },
  { src: "/photos/partner-3.PNG",  alt: "Porsche" },
  { src: "/photos/partner-4.PNG",  alt: "Lamborghini" },
  { src: "/photos/partner-5.PNG",  alt: "Partner 5" },
  { src: "/photos/partner-6.PNG",  alt: "Partner 6" },
  { src: "/photos/partner-7.PNG",  alt: "Partner 7" },
  { src: "/photos/partner-9.PNG",  alt: "Partner 9" },
  { src: "/photos/partner-10.PNG", alt: "Ferrari" },
  { src: "/photos/partner-11.PNG", alt: "Partner 11" },
  { src: "/photos/partner-12.PNG", alt: "Partner 12" },
  { src: "/photos/partner-13.WEBP", alt: "Partner 13" },
  { src: "/photos/partner-14.PNG", alt: "Partner 14" },
] as const;

// ─── Community ────────────────────────────────────────────────────────────────
export const BEHOLD_FEED_ID = "CshoDpAzaLz8Unyr7NmE";

// ─── Contact ──────────────────────────────────────────────────────────────────
export const CONTACT = {
  whatsapp: "https://wa.me/923001234567",
  email: "hello@lowgradefilms.com",
  instagram: "https://www.instagram.com/lowgradefilms",
  youtube: "https://youtube.com/@lowgradefilms2099",
} as const;
