# Image Sourcing Policy — Zentangle Research Package and Website

**Owner:** Dr. G. Academy
**Last updated:** 2026-05-05
**Scope:** every image used in this research package, the future Dr. G. Academy Zentangle website, social media, marketing emails, printed handouts, and any derivative work.

---

## 1. The Hard Rule

**We do NOT download, embed, or republish copyrighted images from third parties.** This includes — and is not limited to — `zentangle.com`, `tanglepatterns.com`, `sarah-henna.com`, individual CZT blogs, Pinterest, Instagram, Facebook, Google Image Search, screenshots of Zoom workshops, scans of published books, and AI image generators that reproduce identifiable copyrighted styles.

The Zentangle community is small and tightly networked. Image misuse will be noticed and will damage the brand. The downside is permanent; the upside (saving time on illustration) is small. Don't do it.

---

## 2. Acceptable Image Sources

In descending order of preference:

### a) Original Dr. G. Academy artwork (preferred)

Tiles, tutorials, and gallery sample images created in-house by Dr. G. Academy or by a CZT under work-for-hire contract. Best long-term option: full ownership, full editorial control, brand-consistent style.

### b) Commissioned CZT artwork

For each tangle in the dictionary, the recommended approach is to **commission a CZT artist** to draw an original example specifically for the Dr. G. Academy site. Suggested terms:

- **Scope:** one finished tile per tangle, plus a 4-step deconstruction strip.
- **Rate (Taiwan market, 2026):** NTD 800–2,000 per tangle depending on artist seniority.
- **Rights:** unlimited use on Dr. G. Academy properties (web, social, print, video) in perpetuity, with mandatory artist credit on the page where the image appears.
- **Artist retains:** the right to display the work in their own portfolio with "commissioned for Dr. G. Academy" attribution.
- **Contract:** written, signed (electronic OK), one page, in Mandarin and English.

For 50 tangles, total budget: **NTD 40,000–100,000**. This is the single highest-leverage spend in the year-one content budget.

### c) Licensed stock — CC0 only

Acceptable platforms (all CC0 / public domain):

- **Unsplash** — for lifestyle/contextual imagery (desk shots, hands, paper textures).
- **Pexels** — same use case as Unsplash.
- **Pixabay** — same; verify license per image, some entries are not CC0.
- **Wikimedia Commons** — for historical/illustrative content; verify each image's specific license tag.

Even on CC0 platforms, **avoid stock images that themselves depict identifiable Zentangle work** unless the photographer is verifiably the original artist.

### d) Licensed CZT images with written permission

If a CZT colleague offers an image, get permission **in writing** (email is fine) covering:

- Specific image (attach or link).
- Use case (web, social, print, all).
- Credit format ("Image by [Name], CZT-[number]").
- Term (perpetual is best; if time-limited, note the expiry on a tracker).
- Withdrawal clause (we will remove within 14 days if the artist requests).

Save the email and the image together in a permission log. Without this log, treat the image as if no permission exists.

---

## 3. Forbidden Sources

- **Pinterest.** Pins are still copyrighted by their creators. "Found on Pinterest" is not a license. Don't.
- **Google Image Search.** Same reasoning. Filtering by "Creative Commons" is not reliable — re-verify on the source site.
- **AI image generators that imitate Zentangle.** Two problems: (a) the output may reproduce copyrighted training data; (b) the broader Zentangle community is openly hostile to AI-generated tangle imagery, and using it will cost trust faster than any other single mistake.
- **Screenshots.** Of zentangle.com, of CZT Zoom classes, of Mosaic app, of YouTube videos, of book pages.
- **"It was on the internet."** Default to: copyrighted unless proven otherwise.

---

## 4. Practical Workflow for Each Tangle Page

For each of the ~50 tangles in the eventual dictionary:

1. Brief a commissioned CZT (see Section 2b) with the tangle name and creator attribution.
2. Receive: one final tile image (square, ≥ 2000 px) + four deconstruction step images.
3. Save originals in `assets/tangles/<slug>/` with filenames `final.jpg`, `step-1.jpg` … `step-4.jpg`.
4. Generate web-optimized versions via the image CDN (WebP + AVIF, 800 px and 1600 px widths).
5. Each `<img>` tag includes alt text in EN and ZH, and a `<figcaption>` crediting both the tangle creator (e.g., "*Hollibaugh* by Rick Roberts") and the example artist (e.g., "Example by Sarah, CZT-23").
6. Image metadata file (CSV or JSON) tracks: tangle slug, tangle creator, example artist, commission date, contract reference, license terms.

---

## 5. Lifestyle and Atmosphere Photography

The home page hero, About page, and blog post headers benefit from non-tangle photography (hands holding a pen, a cup of tea on a desk, an open notebook). For these:

- Prefer Unsplash with a search filter for the visual aesthetic.
- Always download the original-resolution file and credit the photographer in the page's image-credits block, even though CC0 doesn't require it. Goodwill matters and protects against future license changes.
- Avoid imagery that feels generic-stock (overlit, shallow-DOF cliché). Prefer imagery that matches the calm, slightly-aged, paper-and-ink mood of Zentangle.

---

## 6. Audit Checklist Before Any Image Goes Live

- [ ] Is the source one of the four acceptable sources above?
- [ ] If commissioned: is the contract on file?
- [ ] If CZT-permitted: is the email log saved?
- [ ] If CC0 stock: is the license verified on the source page (screenshot saved)?
- [ ] Alt text in EN.
- [ ] Alt text in ZH (for the ZH version of the page).
- [ ] Credit caption visible to the user.
- [ ] Image stored in CDN, not directly hot-linked from a third-party domain.
- [ ] Filename does not contain a copyrighted word ("Zentangle" is fine; "TanglePatterns" is not — it's TanglePatterns.com's brand).

If any answer is "no" or "not sure", the image does not ship.

---

## 7. Takedown Policy

If any artist or rights holder contacts Dr. G. Academy alleging unauthorized use:

1. Acknowledge receipt within 48 hours.
2. Remove the image within 14 days while investigating.
3. Restore only after license is confirmed in writing or replaced with a cleared image.
4. Log the request in an internal compliance file.

This is both legally correct and a community-trust signal. Most artists, when treated this way, become advocates rather than adversaries.

---

*This policy is the operating standard for image use across all Dr. G. Academy Zentangle properties. When in doubt, don't ship — ask the project lead.*
