# Zentangle Aesthetic Brief
*Reference for /web/ design and animation decisions. Compiled from in-repo research + Zentangle.com / TanglePatterns.com / iteachtangling 2026-05.*

## What a Zentangle tile actually looks like

A classic tile is **3.5 × 3.5 inches**, made of 100% cotton, vellum-finish, **cream-coloured** paper (Renaissance tan, warm white, or — for inverse — black). The composition has five visual layers, drawn in a fixed order:

1. **Four pencil corner dots**, a pen's width inset.
2. **Pencil border** connecting the dots — gentle, freehand, slightly wavy. *Stays pencil.*
3. **Pencil "string"** — one free-form curve (Z, S, loop) splitting the tile into 3–6 zones. *Stays pencil.*
4. **Black ink tangles** (Sakura Pigma Micron 01/05) filling each zone with one or more named patterns: Crescent Moon, Hollibaugh, Florz, Tipple, Mooka, Knightsbridge, Printemps, etc.
5. **Graphite shading** added last with a 2B/4B and a tortillon — soft warm-grey gradients along one edge of each tangle to give 3D lift.

The artist's **initials / chop** are tucked discreetly into one pattern. Edges are intentionally **uneven and imperfect** — "we are not pursuing perfection."

## Visual hallmarks (what makes something "look Zentangle")

| Element | Visual quality |
|---|---|
| Paper | Cream / warm white (`#FAF7F1` family), never cold pure white. Vellum grain. |
| Ink | Pure black, Micron-fine (1px equivalent). No grey ink. |
| Pencil layers (border, string, shading) | Warm graphite grey. Visible but never inked over. |
| Line | Deliberate, monoline, slightly wobbly. Never CAD-perfect. |
| Pattern density | High inside zones; large negative space between zones via the string. |
| Colour | Two-tone: cream + black + graphite. Optional warm sepia/gold accent (artist's mood, ≤2% of surface). |
| Shading | Soft, one-sided; suggests low side-light. Always last. |
| Edges | Wobbly, imperfect. No perfect rectangles. |

## Atmosphere & philosophy (must inform pacing, motion, voice)

- "Yoga with a pen." Compared explicitly with Japanese tea ceremony — ritual, slow, present.
- **8 official steps** begin with **gratitude + breath** and end with **appreciation**.
- **"There are no mistakes, only opportunities."** No eraser is included in any kit. Every "wrong" stroke becomes the seed of a new pattern.
- **"Anything is possible, one stroke at a time."**
- Goal state: selflessness, timelessness, effortlessness — flow.
- Output is **non-representational and unplanned** — the artist focuses on the next stroke, not the result.

## Translation to /web/ design rules

### Colour
- Background = cream. Use `--paper-rice` (`#FCFAF4`) or `--paper-bg` (`#FAF7F1`). **Never `#FFFFFF`.**
- Ink = pure black `#1A1A1A` for primary text/lines. `#0A0A0A` reserved for solid filled tangles only.
- All "pencil" elements (borders we draw, strings, scaffold lines) use `--ink-pencil` (`#C8C2B5`) — visibly graphite, never inked.
- Accent: sepia / gold ≤ 2% of any view. Reserved for hover, signature, the red 印章 stamp.
- Dark mode = inverse tile (deep paper-night `#1B1A18` + moonlight ink). Never grey on grey.

### Layered drawing as the core motion vocabulary
Every "drawing" animation in the site renders the layers in their real order:
1. Corner dots fade in
2. Wobbly pencil border draws (graphite)
3. Pencil string draws (graphite)
4. Ink tangles draw inside zones (black, monoline)
5. Soft graphite shading fades in last (radial / linear gradient)

This sequence drives Scene 1 (Cover) and Scene 4 (Tangle Demo). The 5-layer order is non-negotiable — it is what makes the animation feel Zentangle and not generic "SVG animation."

### Pacing
- **Slow tier 4–6 s** — ambient hero draws, scroll-cue, breath cycle.
- **Medium tier 1.5–3 s** — section reveals, page transitions, single tangle.
- **Fast tier 0.3–0.6 s** — hover, focus, button feedback.
- Never under 250 ms for any meaningful element. Snappy = wrong. Deliberate = right.

### Imperfection as feature
- All borders that the site itself draws (cards, tile frames, scrolling cues) use `wobblyLine` from the new `lib/tangles/geometry.ts` — never CSS `border: 1px solid`.
- Polaroid frames use `<TornEdge>`, not square clips.
- Marginal notes rotate −2° to +2°.
- Hand-drawn text uses real per-character stroke timing, not uniform timing.

### Voice
- First-person, present-tense, breath-paced.
- Use "stroke", "breath", "begin again", "no mistakes", "one at a time".
- Avoid product-marketing verbs ("explore", "discover", "unlock"). Prefer ritual verbs ("draw", "rest", "look", "stay").
- Bilingual symmetry: zh and en should feel like the same artist speaking, not translated marketing copy.

### What to refuse
- Gradients spanning multiple hues (`linear-gradient(blue, purple)`).
- Saturated UI colour beyond ≤60% saturation (except the single red stamp).
- Drop shadows beyond a single soft graphite-toned offset.
- Glassmorphism, neumorphism, brutalism — none of these are Zentangle.
- Snap-cut motion (`duration < 0.2s` for content reveals).
- Auto-playing video or sound.

## Sources

- [Zentangle "No Mistakes" philosophy](https://zentangle.com/blogs/blog/a-no-mistakes-philosophy-on-and-off-the-tile)
- [The 8 Steps of the Zentangle Method](https://zentangle.com/blogs/blog/the-8-steps-of-the-zentangle-method-a-tutorial)
- [TanglePatterns.com — Linda Farmer's tangle archive](https://tanglepatterns.com/)
- [Sakura Zentangle tile specs (3.5" cream cotton vellum)](https://www.jetpens.com/Sakura-Zentangle-11-Piece-Drawing-Set-White-3.5-x-3.5-Tiles/pd/14742)
- [Zentangle Method origin story](https://zentangle.com/pages/how-did-zentangle-begin)
- In-repo: `reference/Zentangle/Personal_Zentangle_Site_Brief_2026-05/Visual_Mockups/{Color_Palette,Animation_Patterns,Typography_System}.md`
- In-repo: `reference/Zentangle/Zentangle_Research/ZH/04_經典圖樣字典.md` (41 patterns)
