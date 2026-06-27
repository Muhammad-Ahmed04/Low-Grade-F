---
name: LGF GSAP plugin registration
description: Where and how to register GSAP plugins for the LGF website.
---

## Rule
Import `gsap` and `ScrollTrigger` from `src/lib/gsap.ts` in every component that needs them — never import directly from the `gsap` package in component files.

```ts
// ✅ Correct
import { gsap, ScrollTrigger } from "@/lib/gsap";

// ❌ Wrong
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger); // repeated in every component
```

**Why:** `gsap.registerPlugin()` is idempotent but calling it in every component file is messy. The central `src/lib/gsap.ts` registers the plugin once at module load time and re-exports the instances.

**How to apply:** The `useScrollAnimation` hook already imports from this file. Any new component that uses GSAP directly should do the same.
