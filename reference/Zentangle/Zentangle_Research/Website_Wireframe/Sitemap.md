# Site Map — Dr. G. Academy Zentangle Website

**Last updated:** 2026-05-05
**Source authority:** matches Section B of `EN/11_Website_Architecture_Recommendation.md`

This is the canonical structure. Every URL on the live site must map to a node here. New pages are added by updating this file first, then the build.

---

## Top-Level Tree (English)

```
/
├── /about
│
├── /method
│   ├── /method/eight-steps
│   │   ├── /method/eight-steps/1-gratitude
│   │   ├── /method/eight-steps/2-corner-dots
│   │   ├── /method/eight-steps/3-border
│   │   ├── /method/eight-steps/4-string
│   │   ├── /method/eight-steps/5-tangle
│   │   ├── /method/eight-steps/6-shade
│   │   ├── /method/eight-steps/7-initial-and-sign
│   │   └── /method/eight-steps/8-appreciate
│   └── /method/zentangle-vs-zia
│
├── /tangles                        (library index, searchable)
│   ├── /tangles/crescent-moon
│   ├── /tangles/hollibaugh
│   ├── /tangles/printemps
│   ├── /tangles/static
│   ├── /tangles/tipple
│   └── ... (~50 entries planned)
│
├── /gallery                        (community ZIA submissions)
│   └── /gallery/submit             (upload form, gated by consent)
│
├── /workshops
│   ├── /workshops/upcoming
│   ├── /workshops/private          (private + corporate booking)
│   └── /workshops/<slug>           (each workshop detail page)
│
├── /shop                           (Books & Tools, affiliate-disclosed)
│   ├── /shop/books
│   ├── /shop/tools
│   └── /shop/starter-kit           (own-brand kit, future)
│
├── /for-professionals              (Therapists & Educators landing)
│   ├── /for-professionals/clinical-evidence
│   ├── /for-professionals/classroom
│   └── /for-professionals/corporate-wellness
│
├── /czt-directory                  (Find a Teacher)
│   ├── /czt-directory/taiwan
│   ├── /czt-directory/<region>
│   └── /czt-directory/<czt-slug>   (individual CZT profile)
│
├── /blog
│   ├── /blog/category/<slug>
│   ├── /blog/tag/<slug>
│   └── /blog/<post-slug>
│
├── /faq
├── /contact
│
├── /privacy                        (legal, footer)
├── /terms                          (legal, footer)
├── /affiliate-disclosure           (legal, footer)
│
└── /sitemap.xml + /robots.txt      (machine-readable)
```

## Bilingual URL Pattern

Every URL above is mirrored under language prefixes. The site has two parallel trees:

```
/en/        →  English version (mirror of tree above)
/zh/        →  繁體中文 version (mirror of tree above)
/           →  redirects based on Accept-Language header,
               with visible language switcher in header
```

Examples:

| EN | ZH (Hant-TW) |
|---|---|
| `/en/method/eight-steps` | `/zh/method/eight-steps` |
| `/en/tangles/crescent-moon` | `/zh/tangles/crescent-moon` |
| `/en/for-professionals` | `/zh/for-professionals` |
| `/en/blog/what-is-zentangle` | `/zh/blog/what-is-zentangle` |

Slugs are kept identical across languages to simplify cross-linking and analytics. Page titles and body copy are localized; URLs are not.

`hreflang` link tags emitted on every page:

```html
<link rel="alternate" hreflang="en" href="https://example.com/en/method/eight-steps">
<link rel="alternate" hreflang="zh-Hant-TW" href="https://example.com/zh/method/eight-steps">
<link rel="alternate" hreflang="x-default" href="https://example.com/en/method/eight-steps">
```

## Top Navigation (visible header)

Six items maximum, ordered by user value. The seventh item (FAQ) lives in the footer.

```
Home  |  The Method  |  Tangles  |  Workshops  |  For Pros  |  Blog
                                                                    [EN | ZH]
```

## Footer Navigation

```
Column 1 — Learn               Column 2 — Community         Column 3 — About / Trust
  The Method                     Gallery                      About
  Tangles Library                Find a Teacher (CZT)         Contact
  Blog                           Newsletter                   FAQ
  For Professionals                                           Privacy
                                                              Terms
                                                              Affiliate Disclosure
```

## Sitemap Generation

- `/sitemap.xml` is auto-generated at build time from this tree.
- Split into language-specific child sitemaps (`/sitemap-en.xml`, `/sitemap-zh.xml`) referenced from a sitemap index.
- Submit both to Google Search Console and Bing Webmaster Tools after first deploy.
- Resubmit after any structural change (new tangle, new workshop, new blog post).

## Page-Type Schema Mapping

| Path pattern | Primary schema |
|---|---|
| `/` | `Organization`, `WebSite` |
| `/about` | `AboutPage`, `Organization` |
| `/method/**` | `Article`, `Course` (for the pillar) |
| `/tangles/<slug>` | `HowTo`, `CreativeWork` |
| `/workshops/<slug>` | `Event`, `Course` |
| `/czt-directory/<slug>` | `Person` |
| `/blog/<slug>` | `BlogPosting`, `Article` |
| `/faq` | `FAQPage` |
| `/contact` | `ContactPage` |

## Updating This Sitemap

1. Edit this file first.
2. Update the build's route configuration to match.
3. Update the navigation component if the new page belongs in nav.
4. Update internal-link references in related pages (the `/method` page should link to any new `/method/*` child).
5. Resubmit `/sitemap.xml` to Google Search Console.

This file is the source of truth. If the live site disagrees with this file, the live site is wrong.
