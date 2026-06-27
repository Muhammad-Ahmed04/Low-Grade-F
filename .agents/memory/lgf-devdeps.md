---
name: LGF devDependencies rule
description: All packages in artifacts/lgf-website must go to devDependencies, never dependencies.
---

## Rule
Always use `pnpm add -D <pkg>` when installing packages for `artifacts/lgf-website`.

**Why:** The artifact is a static Vite app — nothing runs server-side. When packages land in `dependencies` instead of `devDependencies`, pnpm creates a second node_modules resolution tree that duplicates React. This triggers the "Invalid hook call / Cannot read properties of null (reading 'useContext')" error because component libraries (like @phosphor-icons/react) pick up a different React instance.

**How to apply:** Any `pnpm add` targeting this package — always add the `-D` flag.
