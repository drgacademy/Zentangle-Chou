# Hero artwork

The homepage hero animation reveals a real zentangle artwork region by region.

## What to put here

Save the high-resolution scan of the hero tile (the multi-tangle composition
you want featured on the front page) as:

```
site/public/artworks/hero-tile.jpg
```

Recommended:
- Square aspect ratio (1:1). The component renders into a 1000×1000 viewBox
  with `preserveAspectRatio="xMidYMid slice"` — non-square images will be
  cropped to a square center.
- 1200×1200 to 2000×2000 px is plenty (display size is ~640px wide).
- JPG quality 85 is fine. Keep file under 500KB if possible.
- Background: clean white-ish paper. Avoid heavy shadows around edges, since
  the component overlays its own hand-drawn border.

## What happens if the file is missing

The component auto-detects load failures and falls back to a procedurally-
drawn tile that mirrors the same 10-region composition. The site never breaks.

## Other artworks

When the Sanity admin is wired up (see `ADMIN_SETUP.md`), you'll upload
artwork photos through the Studio and they'll be served from Sanity's CDN.
This local folder is only for the static hero asset.
