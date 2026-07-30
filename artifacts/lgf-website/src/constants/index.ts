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
  "https://player.vimeo.com/video/1205085259?autoplay=1&muted=1&loop=1&background=1&playsinline=1&quality=auto";

// ─── Short Films ──────────────────────────────────────────────────────────────
export const FILMS = [
  {
    id: 1,
    vimeoSrc:
      "https://player.vimeo.com/video/1204904726?autoplay=1&muted=1&loop=1&background=1&playsinline=1&quality=auto",
    title: "GRAND REVEALS",
    description: "Corporate event filming.",
    cta: "EXPERIENCE >",
  },
  {
    id: 2,
    vimeoSrc:
      "https://player.vimeo.com/video/1204904725?autoplay=1&muted=1&loop=1&background=1&playsinline=1&quality=auto",
    title: "STEEL & SMOKE",
    description: "Motorsports event coverages.",
    cta: "EXPLORE >",
  },
] as const;

// ─── Services ─────────────────────────────────────────────────────────────────
export const SERVICES = [
  {
    id: 1,
    iconName: "Car" as const,
    title: "AUTOMOBILE FILMS",
    description:
      "Precision-led visuals for performance, design, and motion.",
    bgImage: "/photos/bts-2.jpg",
  },
  {
    id: 2,
    iconName: "Crosshair" as const,
    title: "TACTICAL COVERAGE",
    description:
      "Controlled, cinematic coverage built around detail and power.",
    bgImage: "/photos/bts-3.jpg",
  },
  {
    id: 3,
    iconName: "Aperture" as const,
    title: "COMMERCIAL SHOOTS",
    description:
      "Sharper product and campaign visuals with stronger recall.",
    bgImage: "/photos/bts-1.jpg",
  },
] as const;

// ─── Gallery ──────────────────────────────────────────────────────────────────
export const GALLERY_PHOTOS = [
  { src: "/photos/gallery-8.JPG",     label: "AUTOMOBILE" },
  { src: "/photos/gallery-new-2.jpg", label: "TACTICAL" },
  { src: "/photos/gallery-new-3.jpg", label: "COMMERCIAL" },
  { src: "/photos/gallery-7.JPG",     label: "AUTOMOBILE" },
  { src: "/photos/gallery-5.JPG",     label: "TACTICAL" },
  { src: "/photos/gallery-new-6.jpg", label: "COMMERCIAL" },
  { src: "/photos/gallery-new-7.jpg", label: "AUTOMOBILE" },
  { src: "/photos/gallery-new-8.jpg", label: "TACTICAL" },
  { src: "/photos/gallery-new-9.jpg", label: "AUTOMOBILE" },
] as const;

// ─── Behind the Lens ──────────────────────────────────────────────────────────
export const BTS_PHOTOS = [
  { src: "/photos/bts-1.jpg", caption: "On location — Desert Shoot",       large: true },
  { src: "/photos/bts-2.jpg", caption: "Automobile Showroom",               large: false },
  { src: "/photos/bts-3.jpg", caption: "Behind the frame",                  large: false },
] as const;

// ─── Partners ─────────────────────────────────────────────────────────────────
export const PARTNER_LOGOS = [
  { src: "/photos/partner-nasa-autocare.PNG", alt: "NASA Autocare", scale: 1.08 },
  { src: "/photos/partner-rust-oleum.PNG", alt: "Rust-Oleum", scale: 1.14 },
  { src: "/photos/partner-guns-armor.PNG", alt: "Guns & Armor", scale: 1.3 },
  { src: "/photos/partner-rex-motors.PNG", alt: "Rex Motors", scale: 1.2 },
  { src: "/photos/partner-1.PNG",  alt: "Partner 1", scale: 1.42 },
  { src: "/photos/partner-3.PNG",  alt: "Porsche", scale: 0.98 },
  { src: "/photos/partner-4.PNG",  alt: "Lamborghini", scale: 1.42 },
  { src: "/photos/partner-5.PNG",  alt: "Partner 5", scale: 2.34 },
  { src: "/photos/partner-7.PNG",  alt: "Partner 7", scale: 1.34 },
  { src: "/photos/partner-9.PNG",  alt: "Partner 9", scale: 2.08 },
  { src: "/photos/partner-10.PNG", alt: "Ferrari", scale: 2.02 },
  { src: "/photos/partner-11.PNG", alt: "Partner 11", scale: 1.02 },
  { src: "/photos/partner-12.PNG", alt: "Partner 12", scale: 1.02 },
  { src: "/photos/partner-13.WEBP", alt: "Partner 13", scale: 1.18 },
  { src: "/photos/partner-14.PNG", alt: "Partner 14", scale: 1.22 },
] as const;

// ─── Community ────────────────────────────────────────────────────────────────
export const BEHOLD_FEED_ID = "CshoDpAzaLz8Unyr7NmE";

// ─── Contact ──────────────────────────────────────────────────────────────────
export const CONTACT = {
  whatsapp: "https://wa.me/96895421806",
  email: "info@lowgradefilms.com",
  instagram: "https://www.instagram.com/lowgradefilms",
  linkedin: "#",
} as const;
