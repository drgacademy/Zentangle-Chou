import type { Pattern, Rect, Stroke } from './types';
import { dot, pencilString, wobblyRect } from './geometry';
import { makeRng } from './rng';

export type RegionDef = {
  id: string; // e.g. 'hollibaugh' | 'paradox' | 'printemps' | 'nzeppel'
  pattern: Pattern;
  rect: Rect; // bounding rect for the region's pattern.build()
  clipD: string; // SVG path "d" for the irregular region clip
  stepLabel: { zh: string; en: string };
};

export type PhaseDef = {
  id: string;
  labelZh: string;
  labelEn: string;
  strokeIds: string[];
};

export type ComposedTile = {
  strokes: Stroke[];
  clipPaths: { id: string; d: string }[];
  phases: PhaseDef[];
};

const PHASE_LABELS = {
  dots: { zh: '點四角', en: 'Corner dots' },
  border: { zh: '鉛筆邊框', en: 'Pencil border' },
  string: { zh: '鉛筆引線', en: 'Pencil string' },
  shade: { zh: '鉛筆陰影', en: 'Graphite shading' }
};

/**
 * Compose a multi-region Zentangle tile:
 *   phase 1 — 4 corner dots (graphite)
 *   phase 2 — wobbly pencil border (graphite)
 *   phase 3 — pencil string(s) splitting the tile
 *   phase 4..n — each region's ink tangle, in the order regions[] is supplied
 *   phase last — graphite shading (all `shade` strokes from any region, fade in)
 *
 * Layer ordering is enforced: dot=0 ≤ pencil-border=1 ≤ pencil-string=2 ≤ ink=3 ≤ shade=4.
 */
export function composeTile(opts: {
  regions: RegionDef[];
  stringCurves?: string[];
  outerRect: Rect;
  seed: string;
  density?: number;
  jitter?: number;
}): ComposedTile {
  const { regions, outerRect, seed } = opts;
  const density = opts.density ?? 1;
  const jitter = opts.jitter ?? 1.4;
  const rng = makeRng(seed);

  const allStrokes: Stroke[] = [];
  const clipPaths = regions.map((r) => ({ id: r.id, d: r.clipD }));

  // Phase 1 — corner dots.
  const inset = Math.min(outerRect.w, outerRect.h) * 0.04;
  const corners = [
    { x: outerRect.x + inset, y: outerRect.y + inset },
    { x: outerRect.x + outerRect.w - inset, y: outerRect.y + inset },
    { x: outerRect.x + outerRect.w - inset, y: outerRect.y + outerRect.h - inset },
    { x: outerRect.x + inset, y: outerRect.y + outerRect.h - inset }
  ];
  const dotIds: string[] = [];
  corners.forEach((c, i) => {
    const id = `tile-dot-${i}`;
    dotIds.push(id);
    allStrokes.push({
      id,
      d: dot(c.x, c.y, 1.8),
      layer: 'dot',
      width: 0.8,
      fill: 'currentColor',
      drawMs: 240
    });
  });

  // Phase 2 — wobbly pencil border.
  const borderId = 'tile-border';
  allStrokes.push({
    id: borderId,
    d: wobblyRect(
      {
        x: outerRect.x + inset,
        y: outerRect.y + inset,
        w: outerRect.w - inset * 2,
        h: outerRect.h - inset * 2
      },
      rng,
      jitter,
      28
    ),
    layer: 'pencil-border',
    width: 1.1,
    drawMs: 1400
  });

  // Phase 3 — pencil string(s).
  const stringIds: string[] = [];
  if (opts.stringCurves && opts.stringCurves.length > 0) {
    opts.stringCurves.forEach((d, i) => {
      const id = `tile-string-${i}`;
      stringIds.push(id);
      allStrokes.push({
        id,
        d,
        layer: 'pencil-string',
        width: 0.9,
        drawMs: 1100
      });
    });
  } else {
    const id = 'tile-string-0';
    stringIds.push(id);
    allStrokes.push({
      id,
      d: pencilString(outerRect, rng),
      layer: 'pencil-string',
      width: 0.9,
      drawMs: 1500
    });
  }

  // Phase 4..n — each region's pattern.build, tagged with clipPathId.
  const regionPhases: PhaseDef[] = [];
  const shadeIds: string[] = [];
  regions.forEach((region) => {
    const strokes = region.pattern.build(region.rect, { rng, density, jitter });
    const inkIds: string[] = [];
    strokes.forEach((s, i) => {
      const id = `${region.id}-${i}`;
      const tagged: Stroke = { ...s, id, clipPathId: region.id };
      allStrokes.push(tagged);
      if (s.layer === 'shade') {
        shadeIds.push(id);
      } else {
        inkIds.push(id);
      }
    });
    regionPhases.push({
      id: `phase-${region.id}`,
      labelZh: region.stepLabel.zh,
      labelEn: region.stepLabel.en,
      strokeIds: inkIds
    });
  });

  const phases: PhaseDef[] = [
    { id: 'phase-dots', labelZh: PHASE_LABELS.dots.zh, labelEn: PHASE_LABELS.dots.en, strokeIds: dotIds },
    { id: 'phase-border', labelZh: PHASE_LABELS.border.zh, labelEn: PHASE_LABELS.border.en, strokeIds: [borderId] },
    { id: 'phase-string', labelZh: PHASE_LABELS.string.zh, labelEn: PHASE_LABELS.string.en, strokeIds: stringIds },
    ...regionPhases,
    {
      id: 'phase-shade',
      labelZh: PHASE_LABELS.shade.zh,
      labelEn: PHASE_LABELS.shade.en,
      strokeIds: shadeIds
    }
  ];

  return { strokes: allStrokes, clipPaths, phases };
}

/** Default 4-region clip paths matching the artifact reference (800×800 viewBox). */
export const DEFAULT_REGION_CLIPS: Record<string, string> = {
  hollibaugh: 'M 70 70 L 290 70 C 250 130 200 180 180 240 C 160 320 100 380 70 420 Z',
  paradox:
    'M 290 70 L 730 70 L 730 420 C 600 440 480 480 380 540 C 360 540 355 540 350 540 C 340 380 320 220 290 70 Z',
  printemps:
    'M 70 420 C 100 380 160 320 180 240 L 180 240 C 200 200 250 180 290 70 L 290 70 C 320 220 340 380 350 540 C 360 660 320 720 280 730 L 70 730 Z',
  nzeppel:
    'M 730 420 L 730 730 L 240 730 C 280 640 320 580 380 540 C 480 480 600 440 730 420 Z'
};

export const DEFAULT_REGION_RECTS: Record<string, Rect> = {
  hollibaugh: { x: 70, y: 70, w: 220, h: 360 },
  paradox: { x: 290, y: 70, w: 440, h: 470 },
  printemps: { x: 70, y: 200, w: 290, h: 530 },
  nzeppel: { x: 240, y: 420, w: 490, h: 310 }
};

export const DEFAULT_STRING_CURVES: string[] = [
  'M 290 70 C 250 130 200 180 180 240',
  'M 180 240 C 160 320 100 380 70 420',
  'M 290 70 C 320 220 340 380 350 540 C 360 660 320 720 280 730',
  'M 730 420 C 600 440 480 480 380 540 C 320 580 280 640 240 730'
];
