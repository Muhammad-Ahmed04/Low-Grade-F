# LOWGRADEFILMS Website

Premium videography/photography company in Karachi, Pakistan — single-page cinematic website.

## Run & Operate

- `pnpm --filter @workspace/lgf-website run dev` — start the website (port assigned by workflow)
- `pnpm --filter @workspace/api-server run dev` — start the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React 19 + Vite 7, Tailwind v4
- Animations: GSAP + ScrollTrigger (replaces framer-motion)
- Icons: @phosphor-icons/react (replaces Lucide / react-icons)
- Forms: react-hook-form + zod
- API: Express 5 + Drizzle ORM + PostgreSQL
- Build: Vite (frontend), esbuild (API)

## Where things live

- `artifacts/lgf-website/src/constants/index.ts` — ALL site content (nav links, video URLs, photos, services, partner logos, contact info). Edit here first.
- `artifacts/lgf-website/src/hooks/useScrollAnimation.ts` — GSAP ScrollTrigger hook for single-element fade-up
- `artifacts/lgf-website/src/hooks/useDragScroll.ts` — click-and-drag horizontal scroll (used by Gallery)
- `artifacts/lgf-website/src/lib/gsap.ts` — registers GSAP + ScrollTrigger plugin once (import from here)
- `artifacts/lgf-website/public/photos/` — all images and partner logos
- `artifacts/lgf-website/public/lgf-logo.png` — site logo

## Sections (Home.tsx order)

1. **Navbar** — transparent → frosted-glass on scroll, CSS-transition mobile menu
2. **Hero** — fullscreen Vimeo ambient video (`/video/1204904727`), GSAP entrance
3. **Films** — two 45vw panels, Vimeo ambient (`/1204904726`, `/1204904725`)
4. **Gallery** — 320×480px drag-scroll strip, `useDragScroll` hook
5. **About** — gun-barrel breakout on desktop
6. **Services** — 3-column BTS-card grid, Phosphor icons (Car, Crosshair, Aperture)
7. **BehindTheLens** — asymmetric photo grid
8. **Community** — Behold Instagram feed widget (feed ID: `CshoDpAzaLz8Unyr7NmE`)
9. **Partners** — GPU-marquee with 13 partner logos, pause-on-hover
10. **Contact** — react-hook-form + zod form, WhatsApp CTA (Phosphor `WhatsappLogo`)
11. **Footer** — Instagram + YouTube links (Phosphor `InstagramLogo`, `YoutubeLogo`)

## Architecture decisions

- **GSAP over framer-motion** — ScrollTrigger gives more precise scroll-based control with better performance for cinematic scroll reveals.
- **Constants file as single source of truth** — all content lives in `src/constants/index.ts`; swap videos, photos, or partner logos there without touching components.
- **Vimeo `background=1`** — hides all controls, autoplays, mutes, loops. The `.vimeo-cover` CSS class handles object-fit: cover math (`177.78vh` width, `56.25vw` height, `min 100%/100%`).
- **TypeScript + Tailwind kept** — TypeScript is strictly better for the monorepo structure and catches errors before they reach production. Tailwind v4 is far less verbose than per-component CSS Modules for a single-page site.
- **All packages in devDependencies** — static Vite app; nothing is server-side, so there is no runtime `dependencies` section. This prevents React deduplication issues in pnpm.

## Product

A premium, cinematic single-page marketing site for LOWGRADEFILMS — showcasing automobile, tactical, and commercial photography/videography work in Karachi. Features ambient Vimeo background videos, a drag-scrollable photo gallery, Instagram feed, partner marquee, and a contact form.

## User preferences

- Keep all site data in `constants/index.ts` — don't hardcode content in components.
- Use GSAP for all scroll animations (not framer-motion).
- Use @phosphor-icons/react for all icons (not Lucide or react-icons).
- Silver/chrome color palette: `#C0C0C0` (silver), `#E8E8E8` (bright chrome), `#A8A8A8` (dim silver).
- Cinematic, minimal aesthetic — black backgrounds, sparse text, large display font.

## Gotchas

- Vimeo iframes show 401 errors inside Replit's nested preview iframe — this is expected. Videos play fine in any real browser and on the published URL.
- `.vimeo-cover` CSS class must be present in `index.css` for iframe background videos to cover their container correctly.
- Register GSAP plugins via `src/lib/gsap.ts` — registering in multiple component files is safe (idempotent) but importing from the central file is cleaner.
- `pnpm add <pkg>` without `-D` puts packages in `dependencies`, which creates duplicate React in pnpm and breaks hooks. Always use `pnpm add -D` for this artifact.
- Google Font `@import` must be the FIRST line in `index.css`, before `@import "tailwindcss"`.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
