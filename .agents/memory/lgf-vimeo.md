---
name: LGF Vimeo background iframe setup
description: How ambient fullscreen Vimeo iframes are implemented in the LGF site.
---

## Setup
Vimeo URL params for ambient background: `?autoplay=1&muted=1&loop=1&background=1&playsinline=1&quality=auto`
- `background=1` — hides all controls, autoplays, mutes, loops.

CSS class `.vimeo-cover` (in `index.css`):
```css
position: absolute; top: 50%; left: 50%;
transform: translate(-50%, -50%);
width: 177.78vh;   /* 16/9 × 100vh */
height: 56.25vw;   /* 9/16 × 100vw */
min-width: 100%; min-height: 100%;
border: none;
```

**Why:** Iframes don't support `object-fit: cover`. The 16:9 math ensures the iframe always fills its container in the larger dimension and overflows in the smaller — equivalent to `object-fit: cover`.

**How to apply:** Any Vimeo ambient video container needs `position: relative; overflow: hidden`, and the iframe gets `className="vimeo-cover"` with `style={{ pointerEvents: "none" }}`.

**Gotcha:** Vimeo iframes return 401 inside Replit's nested preview iframe — this is expected and harmless. Videos play normally in real browsers and on the published domain.
