# Zentangle Zhou — 禪繞畫的安靜時刻

A personal Zentangle site by **Zentangle Zhou** (pen name).
Built with Next.js 16 (App Router) · React 19 · Tailwind v4 · Framer Motion · Lenis.

## Local development

```bash
pnpm install
pnpm dev
```

Open <http://localhost:3000>. The root redirects to `/zh`; English lives at `/en`.

## Structure

```
app/
  layout.tsx          root html + global fonts
  page.tsx            redirect to /<defaultLocale>
  [lang]/
    layout.tsx        per-locale header/footer + smooth-scroll
    page.tsx          home (hero + manifesto + section previews)
    history/page.tsx
    masters/page.tsx
    method/page.tsx
    mindset/page.tsx
    gallery/page.tsx
    videos/page.tsx
    interactive/page.tsx
    about/page.tsx
components/
  layout/   site chrome (header, footer, language switcher, page shell)
  motion/   ink-stroke + scroll reveal primitives, smooth scroll, brush divider
  tangle/   pattern cards with stroke-order animation
  home/     hero tile + section preview
  interactive/  pointer-driven InkPad
content/    bilingual data: history, masters, method, mindset, patterns, gallery, videos, about, home
lib/        i18n config + dictionaries + utilities
```

## Scripts

```bash
pnpm dev              # next dev
pnpm build            # next build
pnpm typecheck        # tsc --noEmit
pnpm lint             # eslint
pnpm check:branding   # grep for real-name leaks (must stay empty)
```

## Author identity

The author writes under the pen name **Zentangle Zhou**. The real name is intentionally not present in the codebase or in the published copy. The `check:branding` script enforces this.
