# site-legacy/ — Frozen reference

This directory was the original Astro 6 + Tailwind implementation. It is now **frozen**.

Active development has moved to `/web/` (SvelteKit 2 + Svelte 5, deployed to Vercel) — see the project root `README.md`.

Why kept on disk:
- The 41 procedural tangle patterns in `src/lib/tangles/` are reference for re-authoring against the new engine.
- The bilingual JSON dictionaries in `src/i18n/` are ported into `/web/src/lib/i18n/`.
- The CSS tokens in `src/styles/tokens.css` seed the new design system.
- The hero animation in `src/components/common/HeroAnimation.tsx` documents the stroke-dashoffset technique used by the new tangle engine.

Do not edit files under this directory. Treat as read-only history.
