import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  rngFromSeed,
  wobblyLine,
  stringPath,
  crescentMoon,
  florz,
  printemps,
  type Rect,
} from '@/lib/tangles';

interface HeroAnimationProps {
  paused?: boolean;
  isReduced?: boolean;
  seed?: string;
}

/**
 * HeroAnimation — the 3.5s zentangle ritual that opens the site.
 * Phases:
 *   0.00–0.20s  four corner dots
 *   0.20–0.80s  wobbly border draws
 *   0.80–1.40s  pencil string (light graphite) glides in
 *   1.10–1.50s  hero text fades in (parallel; viewer is not waiting)
 *   1.20–2.40s  tangle bands ink in, one after another
 *   2.40–3.00s  shading + signature
 *   3.00s+      permanent breathing loop (subtle scale)
 */
export default function HeroAnimation({
  paused = false,
  isReduced = false,
  seed = 'zentangle-chou-hero',
}: HeroAnimationProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [replayKey, setReplayKey] = useState(0);

  // Build the tile content deterministically from a seed so it never re-rolls
  // on re-render and looks the same on SSR + client.
  const tile = useMemo(() => {
    const size = 800;
    const rng = rngFromSeed(seed);
    const padding = 40;
    const inner: Rect = { x: padding, y: padding, w: size - padding * 2, h: size - padding * 2 };

    // Border: 4 wobbly edges (open polyline)
    const tl = { x: inner.x, y: inner.y };
    const tr = { x: inner.x + inner.w, y: inner.y };
    const br = { x: inner.x + inner.w, y: inner.y + inner.h };
    const bl = { x: inner.x, y: inner.y + inner.h };
    const borderD = [
      wobblyLine(tl, tr, rng, 1.4, 18),
      wobblyLine(tr, br, rng, 1.4, 18),
      wobblyLine(br, bl, rng, 1.4, 18),
      wobblyLine(bl, tl, rng, 1.4, 18),
    ];

    const stringD = stringPath(inner, rng);

    // Three bands holding three different tangles
    const bandTop: Rect    = { x: inner.x, y: inner.y, w: inner.w * 0.55, h: inner.h * 0.5 };
    const bandRight: Rect  = { x: inner.x + inner.w * 0.55, y: inner.y, w: inner.w * 0.45, h: inner.h * 0.55 };
    const bandBottom: Rect = { x: inner.x, y: inner.y + inner.h * 0.5, w: inner.w, h: inner.h * 0.5 };

    return {
      size,
      inner,
      borderD,
      stringD,
      bands: [
        { svg: crescentMoon(bandTop, { rng, stroke: 'currentColor', strokeWidth: 1.4 }), key: 'crescent' },
        { svg: florz(bandRight, { rng, stroke: 'currentColor', strokeWidth: 1.0 }), key: 'florz' },
        { svg: printemps(bandBottom, { rng, stroke: 'currentColor', strokeWidth: 1.2 }), key: 'printemps' },
      ],
      shade: {
        cx: inner.x + inner.w * 0.55,
        cy: inner.y + inner.h * 0.55,
        rx: inner.w * 0.22,
        ry: inner.h * 0.16,
      },
      sig: {
        x: inner.x + inner.w - 28,
        y: inner.y + inner.h - 24,
      },
    };
  }, [seed]);

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
  }, [isReduced, replayKey]);

  if (isReduced) {
    return (
      <div className="relative w-full" style={{ maxWidth: '600px' }}>
        <StaticTileFallback tile={tile} />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
          <h1 className="text-3xl md:text-4xl font-heading text-ink-700 dark:text-ink-50">
            一筆一畫,皆是可能
          </h1>
          <p className="text-sm md:text-base text-ink-500 dark:text-ink-400 mt-3">
            YuChiao Chou 的禪繞畫作品集
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full hero-anim breathe" style={{ maxWidth: '600px' }} key={replayKey}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${tile.size} ${tile.size}`}
        className="w-full h-auto block hand-drawn"
        aria-label="Zentangle hero — drawing in progress"
        role="img"
      >
        <defs>
          <style>{`
            .hero-anim svg [data-stage] { opacity: 0; }
            @keyframes hero-fade-in {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes hero-draw {
              from { stroke-dashoffset: var(--length, 1000); opacity: 0; }
              to   { stroke-dashoffset: 0; opacity: 1; }
            }

            /* Stage 1: corner dots — 0.0 to 0.45s, staggered */
            .hero-anim svg .h-dot {
              animation: hero-fade-in 0.25s var(--easing-smooth) forwards;
            }
            .hero-anim svg .h-dot.dot-1 { animation-delay: 0.00s; }
            .hero-anim svg .h-dot.dot-2 { animation-delay: 0.10s; }
            .hero-anim svg .h-dot.dot-3 { animation-delay: 0.20s; }
            .hero-anim svg .h-dot.dot-4 { animation-delay: 0.30s; }

            /* Stage 2: border edges — 0.20 to 0.85s */
            .hero-anim svg .h-border {
              animation: hero-draw 0.55s var(--easing-smooth) forwards;
              animation-delay: var(--border-delay, 0.2s);
            }
            .hero-anim svg .h-border.b-1 { --border-delay: 0.20s; }
            .hero-anim svg .h-border.b-2 { --border-delay: 0.32s; }
            .hero-anim svg .h-border.b-3 { --border-delay: 0.44s; }
            .hero-anim svg .h-border.b-4 { --border-delay: 0.56s; }

            /* Stage 3: pencil string — 0.80 to 1.40s */
            .hero-anim svg .h-string {
              animation: hero-draw 0.7s var(--easing-smooth) forwards;
              animation-delay: 0.80s;
            }

            /* Stage 4: tangle bands ink in — 1.20 to 2.40s */
            .hero-anim svg .h-tangle {
              animation: hero-fade-in 0.45s var(--easing-smooth) forwards;
            }
            .hero-anim svg .h-tangle.t-1 { animation-delay: 1.20s; }
            .hero-anim svg .h-tangle.t-2 { animation-delay: 1.55s; }
            .hero-anim svg .h-tangle.t-3 { animation-delay: 1.95s; }

            /* Stage 5: shading and signature — 2.40 to 3.00s */
            .hero-anim svg .h-shade {
              animation: hero-fade-in 0.6s var(--easing-smooth) forwards;
              animation-delay: 2.40s;
            }
            .hero-anim svg .h-sig {
              animation: hero-fade-in 0.5s var(--easing-smooth) forwards;
              animation-delay: 2.80s;
            }

            /* Hero text — appears early, viewer doesn't wait */
            .hero-anim .h-text { opacity: 0; }
            .hero-anim .h-text.t-h1 {
              animation: hero-fade-in 0.7s var(--easing-smooth) forwards;
              animation-delay: 1.10s;
            }
            .hero-anim .h-text.t-sub {
              animation: hero-fade-in 0.7s var(--easing-smooth) forwards;
              animation-delay: 1.40s;
            }

            @media (prefers-reduced-motion: reduce) {
              .hero-anim svg [data-stage] { opacity: 1 !important; animation: none !important; stroke-dashoffset: 0 !important; }
              .hero-anim .h-text { opacity: 1 !important; animation: none !important; }
            }
          `}</style>
        </defs>

        {/* Corner dots */}
        <g data-stage stroke="none" fill="currentColor" className="text-ink-700 dark:text-ink-100">
          <circle cx={tile.inner.x} cy={tile.inner.y} r="3" className="h-dot dot-1" data-stage />
          <circle cx={tile.inner.x + tile.inner.w} cy={tile.inner.y} r="3" className="h-dot dot-2" data-stage />
          <circle cx={tile.inner.x + tile.inner.w} cy={tile.inner.y + tile.inner.h} r="3" className="h-dot dot-3" data-stage />
          <circle cx={tile.inner.x} cy={tile.inner.y + tile.inner.h} r="3" className="h-dot dot-4" data-stage />
        </g>

        {/* Border (4 wobbly edges) */}
        <g
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          className="text-ink-700 dark:text-ink-100"
        >
          {tile.borderD.map((d, i) => (
            <path
              key={i}
              d={d}
              data-draw
              data-stage
              className={`h-border b-${i + 1}`}
            />
          ))}
        </g>

        {/* String — pencil graphite layer (under the tangles) */}
        <g
          fill="none"
          stroke="var(--ink-pencil)"
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.85"
        >
          <path d={tile.stringD} data-draw data-stage className="h-string" />
        </g>

        {/* Tangle bands — ink layer */}
        <g
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          className="text-ink-700 dark:text-ink-100"
        >
          {tile.bands.map((b, i) => (
            <g
              key={b.key}
              data-stage
              className={`h-tangle t-${i + 1}`}
              dangerouslySetInnerHTML={{ __html: b.svg }}
            />
          ))}
        </g>

        {/* Shading */}
        <ellipse
          cx={tile.shade.cx}
          cy={tile.shade.cy}
          rx={tile.shade.rx}
          ry={tile.shade.ry}
          fill="currentColor"
          className="text-ink-700 dark:text-ink-100 h-shade"
          data-stage
          style={{ opacity: 0 }}
          opacity="0.07"
        />

        {/* Signature dot */}
        <g data-stage className="h-sig">
          <circle
            cx={tile.sig.x}
            cy={tile.sig.y}
            r="2.4"
            fill="currentColor"
            className="text-ink-700 dark:text-ink-100"
            opacity="0.6"
          />
        </g>
      </svg>

      {/* Text overlay — appears at 1.1s, well before tile finishes */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
        <h1
          className="h-text t-h1 font-heading text-3xl md:text-4xl text-ink-700 dark:text-ink-50"
          style={{ opacity: 0 }}
        >
          一筆一畫,皆是可能
        </h1>
        <p
          className="h-text t-sub text-sm md:text-base text-ink-500 dark:text-ink-400 mt-3"
          style={{ opacity: 0 }}
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
        ↻
      </button>
    </div>
  );
}

interface TileData {
  size: number;
  inner: Rect;
  borderD: string[];
  stringD: string;
  bands: { svg: string; key: string }[];
  shade: { cx: number; cy: number; rx: number; ry: number };
  sig: { x: number; y: number };
}

function StaticTileFallback({ tile }: { tile: TileData }) {
  return (
    <svg viewBox={`0 0 ${tile.size} ${tile.size}`} className="w-full h-auto block opacity-50">
      <g stroke="currentColor" fill="none" className="text-ink-700 dark:text-ink-100">
        <circle cx={tile.inner.x} cy={tile.inner.y} r="3" fill="currentColor" />
        <circle cx={tile.inner.x + tile.inner.w} cy={tile.inner.y} r="3" fill="currentColor" />
        <circle cx={tile.inner.x + tile.inner.w} cy={tile.inner.y + tile.inner.h} r="3" fill="currentColor" />
        <circle cx={tile.inner.x} cy={tile.inner.y + tile.inner.h} r="3" fill="currentColor" />
        <rect
          x={tile.inner.x}
          y={tile.inner.y}
          width={tile.inner.w}
          height={tile.inner.h}
          strokeWidth="1"
        />
      </g>
    </svg>
  );
}
