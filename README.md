# Zentangle Chou — 禪繞畫旗艦形象網站

> *「Ten years ago, I picked up a pen and found my peace.」* — YuChiao Chou (周語喬)

## Active app

The active codebase is the **SvelteKit flagship** in [`/web/`](./web).

```bash
cd web
pnpm install
pnpm dev          # localhost:5173
pnpm build        # production build via @sveltejs/adapter-vercel
```

The homepage is composed of six scrolling scenes — Cover, Manifesto, Featured, Tangle Demo (pinned + scroll-scrubbed live tangle), Process, Signature — driven by a new tangle engine that renders strokes in the canonical Zentangle order (corner dots → pencil border → pencil string → ink tangle).

Read [`web/docs/zentangle-aesthetic-brief.md`](./web/docs/zentangle-aesthetic-brief.md) before touching design or motion. It captures the visual rules drawn from real Zentangle practice (cream paper, monoline ink, pencil scaffolding, deliberate pacing, "no mistakes only opportunities").

Design-system playground: open `/_demo` in the dev server to inspect every primitive in isolation.

## Repo layout

```
.
├── web/             ← SvelteKit 2 + Svelte 5 + Tailwind, deployed to Vercel
├── site-legacy/     ← previous Astro 6 site, frozen reference
├── reference/       ← Zentangle research, brand briefs, 41-pattern dictionary
├── docs/            ← design-brief.md, content-plan.md
└── assets/          ← legacy CSS/JS (not used by the new app)
```

The Astro site at `site-legacy/` remains buildable so we can compare and port; do not edit it. See `site-legacy/FROZEN.md`.

## Tech stack (web/)

- SvelteKit 2 + Svelte 5 + TypeScript
- Tailwind CSS 3.4 (theme reads from `lib/styles/tokens.css` CSS variables)
- GSAP 3 + ScrollTrigger (timeline + scroll-driven scenes)
- Lenis (smooth scroll)
- motion-one (lightweight micro-interactions)
- @sveltejs/enhanced-img (build-time image optimisation)

Bilingual zh/en routing via SvelteKit's `[lang=lang]` param matcher.

Deployed to **Vercel** with `@sveltejs/adapter-vercel` (region `hnd1` for Asia-Pacific latency).

## Credits

Zentangle® is a registered trademark of Zentangle Inc. — created by Rick Roberts & Maria Thomas. This site is an artist portfolio; no Zentangle imagery is reproduced — every tangle on the page is procedurally generated in `lib/tangles/`.
