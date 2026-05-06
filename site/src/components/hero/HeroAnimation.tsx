import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  rngFromSeed,
  wobblyLine,
  hollibaugh,
  tipple,
  mooka,
  florz,
  crescentMoon,
  knightsbridge,
  nautilus,
  paradox,
  printemps,
  type Rect,
} from '@/lib/tangles';

interface HeroAnimationProps {
  paused?: boolean;
  isReduced?: boolean;
  seed?: string;
}

/**
 * HeroAnimation — slowly draws a complete zentangle tile as the page opens.
 * The composition mirrors the reference artwork: 10 regions, each filled with
 * a different tangle pattern, drawn in sequence over ~20 seconds.
 *
 * Sequence:
 *   0.0–1.0s   four corner dots fade in (staggered)
 *   1.0–3.4s   wobbly border draws (4 edges)
 *   3.4–7.4s   pencil-graphite "string" lays down region boundaries
 *   4.5–5.5s   hero text fades in (parallel; viewer is not waiting)
 *   7.4–19.5s  10 tangle regions ink in, slightly overlapping
 *   19.5–20.5s shading wash + signature dot
 *   20.5s+     enters permanent breathing loop
 */
export default function HeroAnimation({
  isReduced = false,
  seed = 'zentangle-chou-hero-v2',
}: HeroAnimationProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [replayKey, setReplayKey] = useState(0);

  const tile = useMemo(() => buildTileGeometry(seed), [seed]);

  // Set --length on each border path so the dasharray animation works
  useEffect(() => {
    if (!svgRef.current || isReduced) return;
    const paths = svgRef.current.querySelectorAll<SVGPathElement>('[data-draw]');
    paths.forEach(path => {
      const length = path.getTotalLength();
      path.style.setProperty('--length', `${length}`);
      path.style.strokeDasharray = `${length}`;
      path.style.strokeDashoffset = `${length}`;
    });
  }, [isReduced, replayKey, tile]);

  if (isReduced) {
    return (
      <div className="relative w-full" style={{ maxWidth: '640px' }}>
        <StaticTileFallback tile={tile} />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
          <h1 className="text-3xl md:text-4xl font-heading text-ink-700 dark:text-ink-50 bg-paper/70 px-4 py-2 rounded">
            一筆一畫,皆是可能
          </h1>
          <p className="text-sm md:text-base text-ink-500 dark:text-ink-400 mt-3 bg-paper/70 px-4 py-1 rounded">
            YuChiao Chou 的禪繞畫作品集
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full hero-anim-v2 breathe" style={{ maxWidth: '640px' }} key={replayKey}>
      <svg
        ref={svgRef}
        viewBox="0 0 1000 1000"
        className="w-full h-auto block hand-drawn"
        aria-label="Zentangle tile drawing in progress"
        role="img"
      >
        <defs>
          {/* clip path for each region so its tangle stays bounded */}
          {tile.regions.map(r => (
            <clipPath key={r.id} id={`hero-clip-${r.id}`}>
              <polygon points={r.polygon.map(p => `${p[0]},${p[1]}`).join(' ')} />
            </clipPath>
          ))}
          <style>{`
            .hero-anim-v2 svg [data-stage] { opacity: 0; }
            @keyframes hv-fade-in { from { opacity: 0; } to { opacity: 1; } }
            @keyframes hv-draw {
              from { stroke-dashoffset: var(--length, 1000); opacity: 0; }
              to   { stroke-dashoffset: 0; opacity: 1; }
            }

            /* 1) corner dots */
            .hero-anim-v2 .hv-dot {
              animation: hv-fade-in 0.3s var(--easing-smooth) forwards;
            }
            .hero-anim-v2 .hv-dot.d-1 { animation-delay: 0.00s; }
            .hero-anim-v2 .hv-dot.d-2 { animation-delay: 0.30s; }
            .hero-anim-v2 .hv-dot.d-3 { animation-delay: 0.60s; }
            .hero-anim-v2 .hv-dot.d-4 { animation-delay: 0.90s; }

            /* 2) border edges, slow */
            .hero-anim-v2 .hv-border {
              animation: hv-draw 0.7s var(--easing-smooth) forwards;
            }
            .hero-anim-v2 .hv-border.b-1 { animation-delay: 1.00s; }
            .hero-anim-v2 .hv-border.b-2 { animation-delay: 1.55s; }
            .hero-anim-v2 .hv-border.b-3 { animation-delay: 2.10s; }
            .hero-anim-v2 .hv-border.b-4 { animation-delay: 2.65s; }

            /* 3) string boundaries, pencil graphite */
            .hero-anim-v2 .hv-string {
              animation: hv-draw 1.1s var(--easing-smooth) forwards;
            }
            .hero-anim-v2 .hv-string.s-1 { animation-delay: 3.40s; }
            .hero-anim-v2 .hv-string.s-2 { animation-delay: 3.85s; }
            .hero-anim-v2 .hv-string.s-3 { animation-delay: 4.30s; }
            .hero-anim-v2 .hv-string.s-4 { animation-delay: 4.75s; }
            .hero-anim-v2 .hv-string.s-5 { animation-delay: 5.20s; }
            .hero-anim-v2 .hv-string.s-6 { animation-delay: 5.65s; }
            .hero-anim-v2 .hv-string.s-7 { animation-delay: 6.10s; }
            .hero-anim-v2 .hv-string.s-8 { animation-delay: 6.55s; }

            /* 4) tangle regions, slow ink, overlapping */
            .hero-anim-v2 .hv-region {
              animation: hv-fade-in 1.4s var(--easing-smooth) forwards;
            }
            .hero-anim-v2 .hv-region.r-1  { animation-delay: 7.40s; }
            .hero-anim-v2 .hv-region.r-2  { animation-delay: 8.30s; }
            .hero-anim-v2 .hv-region.r-3  { animation-delay: 9.20s; }
            .hero-anim-v2 .hv-region.r-4  { animation-delay: 10.20s; }
            .hero-anim-v2 .hv-region.r-5  { animation-delay: 11.20s; }
            .hero-anim-v2 .hv-region.r-6  { animation-delay: 12.30s; }
            .hero-anim-v2 .hv-region.r-7  { animation-delay: 13.40s; }
            .hero-anim-v2 .hv-region.r-8  { animation-delay: 14.40s; animation-duration: 1.8s; }
            .hero-anim-v2 .hv-region.r-9  { animation-delay: 16.40s; }
            .hero-anim-v2 .hv-region.r-10 { animation-delay: 17.50s; }

            /* 5) shading + signature */
            .hero-anim-v2 .hv-shade {
              animation: hv-fade-in 1.0s var(--easing-smooth) forwards;
              animation-delay: 19.20s;
            }
            .hero-anim-v2 .hv-sig {
              animation: hv-fade-in 0.8s var(--easing-smooth) forwards;
              animation-delay: 19.80s;
            }

            /* 6) hero text — appears early, viewer doesn't wait */
            .hero-anim-v2 .hv-text { opacity: 0; }
            .hero-anim-v2 .hv-text.t-h1 {
              animation: hv-fade-in 0.9s var(--easing-smooth) forwards;
              animation-delay: 4.50s;
            }
            .hero-anim-v2 .hv-text.t-sub {
              animation: hv-fade-in 0.9s var(--easing-smooth) forwards;
              animation-delay: 5.10s;
            }

            @media (prefers-reduced-motion: reduce) {
              .hero-anim-v2 svg [data-stage] { opacity: 1 !important; animation: none !important; stroke-dashoffset: 0 !important; }
              .hero-anim-v2 .hv-text { opacity: 1 !important; animation: none !important; }
            }
          `}</style>
        </defs>

        {/* warm paper backing */}
        <rect x="0" y="0" width="1000" height="1000" fill="var(--paper-bg, #FAF7F1)" />

        {/* 1) corner dots */}
        <g fill="currentColor" stroke="none" className="text-ink-700 dark:text-ink-100">
          {tile.corners.map((c, i) => (
            <circle key={i} cx={c[0]} cy={c[1]} r="4" data-stage className={`hv-dot d-${i + 1}`} />
          ))}
        </g>

        {/* 2) wobbly border (4 edges drawn) */}
        <g
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          className="text-ink-700 dark:text-ink-100"
        >
          {tile.borders.map((d, i) => (
            <path key={i} d={d} data-draw data-stage className={`hv-border b-${i + 1}`} />
          ))}
        </g>

        {/* 3) string — pencil graphite layer */}
        <g
          fill="none"
          stroke="var(--ink-pencil)"
          strokeWidth="1.1"
          strokeLinecap="round"
          opacity="0.85"
        >
          {tile.strings.map((d, i) => (
            <path key={i} d={d} data-draw data-stage className={`hv-string s-${i + 1}`} />
          ))}
        </g>

        {/* 4) tangle regions (clipped to their polygons) */}
        <g
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          className="text-ink-700 dark:text-ink-100"
        >
          {tile.regions.map((r, i) => (
            <g
              key={r.id}
              clipPath={`url(#hero-clip-${r.id})`}
              data-stage
              className={`hv-region r-${i + 1}`}
              dangerouslySetInnerHTML={{ __html: r.svg }}
            />
          ))}
        </g>

        {/* 5) soft shading near nautilus */}
        <ellipse
          cx="450"
          cy="640"
          rx="240"
          ry="170"
          fill="currentColor"
          className="text-ink-700 dark:text-ink-100 hv-shade"
          data-stage
          opacity="0.05"
        />

        {/* 6) signature */}
        <g data-stage className="hv-sig">
          <circle
            cx={tile.signature[0]}
            cy={tile.signature[1]}
            r="3.4"
            fill="currentColor"
            className="text-ink-700 dark:text-ink-100"
            opacity="0.65"
          />
        </g>
      </svg>

      {/* Text overlay — appears at 4.5s */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
        <h1
          className="hv-text t-h1 font-heading text-3xl md:text-5xl text-ink-700 dark:text-ink-50 drop-shadow-[0_2px_8px_rgba(250,247,241,0.85)] dark:drop-shadow-[0_2px_8px_rgba(27,26,24,0.85)]"
        >
          一筆一畫,皆是可能
        </h1>
        <p
          className="hv-text t-sub text-sm md:text-base text-ink-600 dark:text-ink-300 mt-4 drop-shadow-[0_2px_8px_rgba(250,247,241,0.85)] dark:drop-shadow-[0_2px_8px_rgba(27,26,24,0.85)]"
        >
          YuChiao Chou 的禪繞畫作品集
        </p>
      </div>

      {/* Replay */}
      <button
        type="button"
        onClick={() => setReplayKey(k => k + 1)}
        className="absolute bottom-4 right-4 px-2.5 py-1 text-xs bg-ink-100/80 dark:bg-ink-700/80 backdrop-blur text-ink-700 dark:text-ink-100 rounded hover:bg-ink-200 dark:hover:bg-ink-600 transition-colors pointer-events-auto"
        aria-label="重新播放動畫"
      >
        ↻ 重播
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Tile geometry: regions, borders, string. Polygon coords match the
// reference artwork's composition (basket-weave NW → tipple N →
// mooka NE → florz E → cadent E-mid → crescent W → knightsbridge SW
// → nautilus center → paradox S → onamato SE).
// ─────────────────────────────────────────────────────────────────

interface RegionSpec {
  id: string;
  polygon: [number, number][];
  svg: string;
}

interface TileGeometry {
  corners: [number, number][];
  borders: string[];
  strings: string[];
  regions: RegionSpec[];
  signature: [number, number];
}

function buildTileGeometry(seed: string): TileGeometry {
  const rng = rngFromSeed(seed);
  const PAD = 38;
  const corners: [number, number][] = [
    [PAD, PAD],
    [1000 - PAD, PAD],
    [1000 - PAD, 1000 - PAD],
    [PAD, 1000 - PAD],
  ];
  const borders = [
    wobblyLine({ x: corners[0][0], y: corners[0][1] }, { x: corners[1][0], y: corners[1][1] }, rng, 1.8, 22),
    wobblyLine({ x: corners[1][0], y: corners[1][1] }, { x: corners[2][0], y: corners[2][1] }, rng, 1.8, 22),
    wobblyLine({ x: corners[2][0], y: corners[2][1] }, { x: corners[3][0], y: corners[3][1] }, rng, 1.8, 22),
    wobblyLine({ x: corners[3][0], y: corners[3][1] }, { x: corners[0][0], y: corners[0][1] }, rng, 1.8, 22),
  ];

  // Region polygons (approximate — capture the spirit of the reference image)
  const regions: RegionSpec[] = [
    {
      id: 'r1',
      polygon: [[40, 40], [380, 40], [400, 200], [330, 290], [180, 360], [60, 410], [40, 350]],
      svg: hollibaugh(rectFor([[40, 40], [400, 200]]), { rng, density: 1.6, strokeWidth: 1.2 }),
    },
    {
      id: 'r2',
      polygon: [[380, 40], [600, 40], [580, 240], [430, 230], [400, 200]],
      svg: tipple(rectFor([[380, 40], [600, 240]]), { rng, density: 1.8, strokeWidth: 0.9 }),
    },
    {
      id: 'r3',
      polygon: [[600, 40], [770, 40], [760, 320], [580, 360], [490, 280], [580, 240]],
      svg: mooka(rectFor([[490, 40], [770, 360]]), { rng, density: 1.4, strokeWidth: 1.2 }),
    },
    {
      id: 'r4',
      polygon: [[770, 40], [960, 40], [960, 340], [820, 320], [760, 320]],
      svg: florz(rectFor([[760, 40], [960, 340]]), { rng, density: 1.4, strokeWidth: 0.8 }),
    },
    {
      id: 'r5',
      polygon: [[820, 320], [960, 340], [960, 600], [780, 580], [700, 540], [580, 460], [490, 280], [580, 360], [760, 320]],
      svg: florz(rectFor([[580, 320], [960, 600]]), { rng, density: 1.0, strokeWidth: 0.7 }),
    },
    {
      id: 'r6',
      polygon: [[40, 350], [60, 410], [180, 360], [330, 290], [400, 360], [380, 580], [310, 700], [40, 720]],
      svg: crescentMoon(rectFor([[40, 290], [400, 720]]), { rng, density: 1.1, strokeWidth: 1.0 }),
    },
    {
      id: 'r7',
      polygon: [[40, 720], [310, 700], [320, 880], [240, 960], [40, 960]],
      svg: knightsbridge(rectFor([[40, 700], [320, 960]]), { rng, density: 1.2 }),
    },
    {
      id: 'r8',
      polygon: [[400, 360], [490, 280], [580, 460], [700, 540], [780, 580], [720, 760], [560, 870], [380, 870], [320, 740], [380, 580]],
      svg: nautilus(rectFor([[300, 280], [780, 870]]), { rng, strokeWidth: 1.4 }),
    },
    {
      id: 'r9',
      polygon: [[240, 960], [320, 880], [380, 870], [560, 870], [660, 920], [660, 960]],
      svg: paradox(rectFor([[240, 870], [660, 960]]), { rng, density: 1.4, strokeWidth: 0.8 }),
    },
    {
      id: 'r10',
      polygon: [[720, 760], [780, 580], [960, 600], [960, 960], [660, 960], [660, 920], [560, 870]],
      svg: printemps(rectFor([[660, 580], [960, 960]]), { rng, density: 1.4, strokeWidth: 1.0 }),
    },
  ];

  // 8 hand-drawn pencil curves that connect the polygon vertices
  // and act as the visible "string" laying out the composition.
  const strings = [
    bezier(rng, [40, 350], [180, 360], [330, 290], [400, 200]),
    bezier(rng, [400, 200], [430, 230], [490, 280], [580, 240]),
    bezier(rng, [580, 240], [580, 360], [700, 540], [780, 580]),
    bezier(rng, [780, 580], [820, 320], [780, 200], [770, 40]),
    bezier(rng, [400, 360], [380, 580], [320, 740], [310, 700]),
    bezier(rng, [310, 700], [320, 880], [560, 870], [720, 760]),
    bezier(rng, [380, 580], [490, 600], [580, 460], [580, 360]),
    bezier(rng, [380, 870], [560, 870], [660, 920], [660, 960]),
  ];

  return {
    corners,
    borders,
    strings,
    regions,
    signature: [925, 925],
  };
}

function rectFor(box: [[number, number], [number, number]]): Rect {
  const [tl, br] = box;
  return { x: tl[0], y: tl[1], w: br[0] - tl[0], h: br[1] - tl[1] };
}

function bezier(rng: () => number, a: [number, number], b: [number, number], c: [number, number], d: [number, number]): string {
  const j = () => (rng() - 0.5) * 8;
  return `M ${a[0]} ${a[1]} C ${b[0] + j()} ${b[1] + j()}, ${c[0] + j()} ${c[1] + j()}, ${d[0]} ${d[1]}`;
}

interface TileGeometryStatic { corners: [number, number][]; }

function StaticTileFallback({ tile }: { tile: TileGeometry }) {
  return (
    <svg viewBox="0 0 1000 1000" className="w-full h-auto block opacity-50">
      <rect x="0" y="0" width="1000" height="1000" fill="var(--paper-bg, #FAF7F1)" />
      <g stroke="currentColor" fill="none" className="text-ink-700 dark:text-ink-100" strokeWidth="1">
        {tile.corners.map((c, i) => (
          <circle key={i} cx={c[0]} cy={c[1]} r="4" fill="currentColor" />
        ))}
        <rect x="40" y="40" width="920" height="920" />
      </g>
    </svg>
  );
}
