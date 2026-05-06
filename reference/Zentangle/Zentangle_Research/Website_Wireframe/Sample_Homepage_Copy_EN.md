# Sample Homepage Copy — English

**Page URL:** `/en/`
**Status:** ready-to-paste
**Last updated:** 2026-05-05
**Word counts:** hero 24, what-is block 81, value props 3 × ~45, footer trust ~110

---

## SEO Meta

- **Title tag (max 60 chars):** Zentangle for Beginners — Dr. G. Academy
- **Meta description (max 158 chars):** Learn Zentangle the calm, structured way. Free tutorials, certified-teacher workshops, and a bilingual library of tangles. Anyone can do it.
- **Primary keyword:** zentangle for beginners
- **Secondary:** what is zentangle, zentangle method, zentangle workshop

---

## HERO SECTION

### Headline (max 8 words)
**One stroke at a time, anything is possible.**

### Subhead (one sentence, ≤ 22 words)
A bilingual home for Zentangle® — the meditative drawing method anyone can learn in fifteen minutes, no art experience required.

### Primary CTA (button)
**Try your first tangle →**
*(links to `/en/method/eight-steps/5-tangle` with the Crescent Moon tutorial)*

### Secondary CTA (text link)
Find a workshop near you →
*(links to `/en/workshops/upcoming`)*

### Hero visual placeholder
Original Dr. G. Academy tile (3.5"), photographed top-down on warm grey paper, soft natural light from upper left. No text overlay. See Image Sourcing Policy.

---

## "WHAT IS ZENTANGLE" BLOCK (80 words)

### Section H2
**What is Zentangle?**

### Body (81 words)
Zentangle® is a structured method of meditative drawing developed by Rick Roberts and Maria Thomas in Massachusetts in the early 2000s. You combine simple repeating patterns — called *tangles* — on a 3.5-inch paper tile, using only a black pen and a graphite pencil. There is no eraser. There are no mistakes. The goal isn't a perfect picture; it's the focused, calm state you enter while drawing. A complete tile takes about thirty minutes.

### Inline link
**Read the full method →** *(links to `/en/method`)*

---

## THREE VALUE PROPOSITIONS

Three-column layout. Each card has an icon placeholder, a one-word headline, and ~45 words of body copy.

### Card 1 — Calm

**Calm**

Repetitive, deliberate strokes engage the parasympathetic nervous system the way slow breathing does. Practitioners describe Zentangle as "moving meditation" — a way to settle a busy mind without sitting still. Thirty minutes can reset a stressful afternoon.

### Card 2 — Creative

**Creative**

You don't need to know how to draw. Zentangle has no perspective, no proportion, no color theory to learn first. Anyone who can hold a pen can begin today, and every tile you finish surprises you with what you didn't know you could make.

### Card 3 — Complete

**Complete**

Every session ends with a signed, dated, finished piece of art. In a world of unfinished to-do lists, that completion matters. Practitioners often save their tiles in a small box — a visible record of attention paid, days lived deliberately.

---

## FEATURED TANGLES TEASER

### Section H2
**Three tangles to start with**

### Intro (one sentence)
Each of these is foundational — easy to learn, endlessly variable, and credited to its creator.

### Three cards (image + name + creator + 1-line description)

**Crescent Moon** — by Maria Thomas
Curved arcs nested behind a simple shape. The first tangle most teachers introduce.
*[Learn Crescent Moon →](/en/tangles/crescent-moon)*

**Hollibaugh** — by Rick Roberts
Crossing bands that appear to weave over and under. A masterclass in implied depth.
*[Learn Hollibaugh →](/en/tangles/hollibaugh)*

**Printemps** — by Maria Thomas
Tight spirals nested together like blossoms. Calming, rhythmic, infinitely scalable.
*[Learn Printemps →](/en/tangles/printemps)*

### Section CTA
**Browse all 50 tangles in our library →** *(links to `/en/tangles`)*

---

## TESTIMONIAL SLOT

Single-quote layout. Use a real, named, opt-in-permitted quote only. Until then, use this placeholder structure:

> "I came in expecting to be bad at it. I left with three finished tiles, a quieter mind, and the first piece of art I've made since I was twelve. The method really does what it says."
>
> — **[Name]**, [role], Taipei
>
> *Workshop attendee, [Month] 2026. Photo credit: Dr. G. Academy.*

If no permission-cleared quote is available at launch, omit this section entirely. Do not use stock testimonials.

---

## WORKSHOP CTA BLOCK

### Section H2
**Learn in person, with a certified teacher**

### Body (50 words)
Our workshops are taught by Certified Zentangle Teachers (CZTs) trained directly by the founders of the method. Half-day beginner sessions in Taipei, Taichung, and online via Zoom. Materials included. No experience required.

### CTA button
**See upcoming workshops →** *(links to `/en/workshops/upcoming`)*

### Secondary line
Looking for a private session for your team or clinic? **[Inquire about a private workshop →](/en/workshops/private)**

---

## NEWSLETTER SIGNUP

### Section H2
**One tangle a month, in your inbox**

### Body (35 words)
Each first Sunday, we send one new tangle tutorial, one short philosophy reflection, and a quiet recommendation. No promotions, no pressure. Unsubscribe in one click. About 600 readers across Taiwan and beyond.

### Form
- **Field:** email address (single field, no name required)
- **Button label:** "Send me one tangle a month"
- **Below button (small grey text):** "We'll never share your email. See our [privacy policy](/en/privacy)."

---

## FOOTER TRUST BLOCK

### Three-column layout

**Taught by Certified Teachers**
Our lead instructor is a Certified Zentangle Teacher (CZT-[XX], 20XX) trained at the founders' studio in Massachusetts. Every workshop follows the official Zentangle® method.

**Independent and Respectful**
Dr. G. Academy is an independent Zentangle® education resource. We are not affiliated with Zentangle, Inc. All tangle names are credited to their original creators.

**Original Art, Always**
Every illustration on this site is original artwork commissioned for Dr. G. Academy or used with the artist's written permission. We never repost copyrighted images.

### Below the trust block — small print

`© 2026 Dr. G. Academy. Zentangle® is a registered trademark of Zentangle, Inc., used under nominative fair use.`

`Privacy · Terms · Affiliate Disclosure · Contact`

`[EN | 中文]`

---

## Implementation Notes for the Developer

- Hero CTA must be above the fold on a 1366×768 viewport.
- "What is Zentangle?" block triggers `Article` schema (it's the page's primary text content).
- Three value-prop cards: stack to single column on screens < 768 px.
- Featured tangles section uses `ItemList` schema with three `HowTo` items linked.
- Newsletter form posts to the email service provider (Mailchimp / ConvertKit / Buttondown — TBD); double opt-in mandatory.
- Footer "EN | 中文" link must preserve the user's current page path (so `/en/` swaps to `/zh/`, not just to `/zh/`'s home).
- All `<img>` tags include alt text and `loading="lazy"` except the hero image, which uses `fetchpriority="high"`.

*End of homepage copy. The ZH counterpart is in `Sample_Homepage_Copy_ZH.md`.*
