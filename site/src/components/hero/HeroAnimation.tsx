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
  /** localized hero headline. Required so this component is i18n-safe. */
  title: string;
  /** localized hero subtitle. */
  subtitle: string;
  /** path to the real artwork to reveal (default `/artworks/hero-tile.jpg`).
   *  If the file is missing, we fall back to a procedural tile drawn from
   *  the same region geometry so the page still looks like a zentangle. */
  imageSrc?: string;
  isReduced?: boolean;
  seed?: string;
}

/**
 * HeroAnimation — slowly "draws" a real zentangle artwork onto the page.
 *
 * Sequence (~21 seconds total, but text is readable by 5s):
 *   0.0–1.2s    four corner dots fade in (staggered)
 *   1.2–4.0s    wobbly hand-drawn border draws (4 edges)
 *   4.0–8.4s    pencil-graphite "string" sketches the region boundaries
 *   4.6–5.6s    hero text fades in (parallel — viewer never waits)
 *   8.4–19.4s   10 regions of the real artwork "develop" one after another
 *               (each starts from heavy blur + low opacity and sharpens to
 *               the photographic ink, like a darkroom print emerging)
 *   19.4–21.0s  shading + signature
 *   21.0s+      enters permanent breathing loop
 *
 * If `/artworks/hero-tile.jpg` is missing, each region falls back to a
 * procedurally-drawn tangle that matches the reference composition, so the
 * page is never empty and dev/preview always works.
 */
export default function HeroAnimation({
  title,
  subtitle,
  imageSrc = '/artworks/hero-tile.jpg',
  isReduced = false,
  seed = 'zentangle-chou-hero-v3',
}: HeroAnimationProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [replayKey, setReplayKey] = useState(0);
  const [imageStatus, setImageStatus] = useState<'pending' | 'loaded' | 'failed'>('pending');

  const tile = useMemo(() => buildTileGeometry(seed), [seed]);

  // Probe the image so we can swap to the procedural fallback before the
  // reveal phase starts (~8s in).
  useEffect(() => {
    if (!imageSrc) { setImageStatus('failed'); return; }
    const img = new window.Image();
    img.onload  = () => setImageStatus('loaded');
    img.onerror = () => setImageStatus('failed');
    img.src = imageSrc;
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [imageSrc, replayKey]);

  // For each path tagged data-draw, set --length so the dasharray reveal works.
  useEffect(() => {
    if (!svgRef.current || isReduced) return;
    const paths = svgRef.current.querySelectorAll<SVGPathElement>('[data-draw]');
    paths.forEach(path => {
      const length = path.getTotalLength();
      path.style.setProperty('--length', `${length}`);
      path.style.strokeDasharray = `${length}`;
      path.style.strokeDashoffset = `${length}`;
    });
  }, [isReduced, replayKey, tile, imageStatus]);

  if (isReduced) {
    return (
      <div className="relative w-full" style={{ maxWidth: '640px' }}>
        <svg viewBox="0 0 1000 1000" className="w-full h-auto block">
          <rect x="0" y="0" width="1000" height="1000" fill="var(--paper-bg, #FAF7F1)" />
          {imageStatus === 'loaded' && (
            <image href={imageSrc} x="0" y="0" width="1000" height="1000" preserveAspectRatio="xMidYMid slice" />
          )}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
          <h1 className="text-3xl md:text-4xl font-heading text-ink-700 dark:text-ink-50 px-4">{title}</h1>
          <p className="text-sm md:text-base text-ink-500 dark:text-ink-400 mt-3">{subtitle}</p>
        </div>
      </div>
    );
  }

  const useImage = imageStatus !== 'failed';

  return (
    <div className="relative w-full hero-anim-v3 breathe" style={{ maxWidth: '640px' }} key={replayKey}>
      <svg
        ref={svgRef}
        viewBox="0 0 1000 1000"
        className="w-full h-auto block hand-drawn"
        aria-label="Zentangle tile drawing in progress"
        role="img"
      >
        <defs>
          {tile.regions.map(r => (
            <clipPath key={r.id} id={`hero-clip-${r.id}`}>
              <polygon points={r.polygon.map(p => `${p[0]},${p[1]}`).join(' ')} />
            </clipPath>
          ))}
          <style>{`
            .hero-anim-v3 svg [data-stage] { opacity: 0; }

            @keyframes hv3-fade-in { from { opacity: 0; } to { opacity: 1; } }
            @keyframes hv3-draw {
              from { stroke-dashoffset: var(--length, 1000); opacity: 0; }
              to   { stroke-dashoffset: 0; opacity: 1; }
            }
            /* ink-developing reveal: starts heavily blurred & desaturated,
               sharpens to the final crisp photograph. */
            @keyframes hv3-develop {
              0%   { opacity: 0; filter: blur(14px) saturate(0.4) brightness(1.08); }
              30%  { opacity: 0.55; filter: blur(8px) saturate(0.65) brightness(1.05); }
              70%  { opacity: 0.95; filter: blur(2px) saturate(0.9) brightness(1.02); }
              100% { opacity: 1; filter: blur(0) saturate(1) brightness(1); }
            }

            /* 1) corner dots */
            .hero-anim-v3 .hv3-dot { animation: hv3-fade-in 0.35s var(--easing-smooth) forwards; }
            .hero-anim-v3 .hv3-dot.d-1 { animation-delay: 0.0s; }
            .hero-anim-v3 .hv3-dot.d-2 { animation-delay: 0.4s; }
            .hero-anim-v3 .hv3-dot.d-3 { animation-delay: 0.8s; }
            .hero-anim-v3 .hv3-dot.d-4 { animation-delay: 1.1s; }

            /* 2) wobbly border, slow */
            .hero-anim-v3 .hv3-border { animation: hv3-draw 0.85s var(--easing-smooth) forwards; }
            .hero-anim-v3 .hv3-border.b-1 { animation-delay: 1.2s; }
            .hero-anim-v3 .hv3-border.b-2 { animation-delay: 1.85s; }
            .hero-anim-v3 .hv3-border.b-3 { animation-delay: 2.5s; }
            .hero-anim-v3 .hv3-border.b-4 { animation-delay: 3.15s; }

            /* 3) pencil string lays out the regions */
            .hero-anim-v3 .hv3-string { animation: hv3-draw 1.3s var(--easing-smooth) forwards; }
            .hero-anim-v3 .hv3-string.s-1 { animation-delay: 4.00s; }
            .hero-anim-v3 .hv3-string.s-2 { animation-delay: 4.55s; }
            .hero-anim-v3 .hv3-string.s-3 { animation-delay: 5.10s; }
            .hero-anim-v3 .hv3-string.s-4 { animation-delay: 5.65s; }
            .hero-anim-v3 .hv3-string.s-5 { animation-delay: 6.20s; }
            .hero-anim-v3 .hv3-string.s-6 { animation-delay: 6.75s; }
            .hero-anim-v3 .hv3-string.s-7 { animation-delay: 7.30s; }
            .hero-anim-v3 .hv3-string.s-8 { animation-delay: 7.85s; }

            /* 4) regions develop one at a time, slow & deliberate */
            .hero-anim-v3 .hv3-region { animation: hv3-develop 1.8s cubic-bezier(0.45, 0, 0.3, 1) forwards; }
            .hero-anim-v3 .hv3-region.r-1  { animation-delay: 8.40s; }
            .hero-anim-v3 .hv3-region.r-2  { animation-delay: 9.45s; }
            .hero-anim-v3 .hv3-region.r-3  { animation-delay: 10.50s; }
            .hero-anim-v3 .hv3-region.r-4  { animation-delay: 11.55s; }
            .hero-anim-v3 .hv3-region.r-5  { animation-delay: 12.60s; }
            .hero-anim-v3 .hv3-region.r-6  { animation-delay: 13.65s; }
            .hero-anim-v3 .hv3-region.r-7  { animation-delay: 14.70s; }
            .hero-anim-v3 .hv3-region.r-8  { animation-delay: 15.75s; animation-duration: 2.4s; }
            .hero-anim-v3 .hv3-region.r-9  { animation-delay: 17.40s; }
            .hero-anim-v3 .hv3-region.r-10 { animation-delay: 18.45s; }

            /* 5) finishing touches */
            .hero-anim-v3 .hv3-shade { animation: hv3-fade-in 1.0s var(--easing-smooth) forwards; animation-delay: 19.80s; }
            .hero-anim-v3 .hv3-sig   { animation: hv3-fade-in 0.8s var(--easing-smooth) forwards; animation-delay: 20.40s; }

            /* hero text — visible by 5.5s */
            .hero-anim-v3 .hv3-text { opacity: 0; }
            .hero-anim-v3 .hv3-text.t-h1  { animation: hv3-fade-in 0.9s var(--easing-smooth) forwards; animation-delay: 4.6s; }
            .hero-anim-v3 .hv3-text.t-sub { animation: hv3-fade-in 0.9s var(--easing-smooth) forwards; animation-delay: 5.2s; }

            @media (prefers-reduced-motion: reduce) {
              .hero-anim-v3 svg [data-stage] { opacity: 1 !important; animation: none !important; stroke-dashoffset: 0 !important; filter: none !important; }
              .hero-anim-v3 .hv3-text { opacity: 1 !important; animation: none !important; }
            }
          `}</style>
        </defs>

        {/* paper backing */}
        <rect x="0" y="0" width="1000" height="1000" fill="var(--paper-bg, #FAF7F1)" />

        {/* corner dots */}
        <g fill="currentColor" stroke="none" className="text-ink-700 dark:text-ink-100">
          {tile.corners.map((c, i) => (
            <circle key={i} cx={c[0]} cy={c[1]} r="4" data-stage className={`hv3-dot d-${i + 1}`} />
          ))}
        </g>

        {/* wobbly border */}
        <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"
           className="text-ink-700 dark:text-ink-100">
          {tile.borders.map((d, i) => (
            <path key={i} d={d} data-draw data-stage className={`hv3-border b-${i + 1}`} />
          ))}
        </g>

        {/* pencil string — graphite layer that sketches the composition */}
        <g fill="none" stroke="var(--ink-pencil)" strokeWidth="1.2" strokeLinecap="round" opacity="0.85">
          {tile.strings.map((d, i) => (
            <path key={i} d={d} data-draw data-stage className={`hv3-string s-${i + 1}`} />
          ))}
        </g>

        {/* tangle regions — either real image or procedural fallback */}
        <g className="text-ink-700 dark:text-ink-100">
          {tile.regions.map((r, i) => (
            <g
              key={r.id}
              clipPath={`url(#hero-clip-${r.id})`}
              data-stage
              className={`hv3-region r-${i + 1}`}
            >
              {useImage ? (
                <image
                  href={imageSrc}
                  x="0"
                  y="0"
                  width="1000"
                  height="1000"
                  preserveAspectRatio="xMidYMid slice"
                />
              ) : (
                <g
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  dangerouslySetInnerHTML={{ __html: r.svg }}
                />
              )}
            </g>
          ))}
        </g>

        {/* shading wash */}
        <ellipse
          cx="450" cy="640" rx="240" ry="170"
          fill="currentColor"
          className="text-ink-700 dark:text-ink-100 hv3-shade"
          data-stage
          opacity="0.05"
        />

        {/* signature dot */}
        <g data-stage className="hv3-sig">
          <circle cx={tile.signature[0]} cy={tile.signature[1]} r="3.6"
                  fill="currentColor" className="text-ink-700 dark:text-ink-100" opacity="0.65" />
        </g>
      </svg>

      {/* Text overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
        <h1
          className="hv3-text t-h1 font-heading text-3xl md:text-5xl text-ink-700 dark:text-ink-50 px-4 drop-shadow-[0_2px_10px_rgba(250,247,241,0.85)] dark:drop-shadow-[0_2px_10px_rgba(27,26,24,0.85)]"
        >
          {title}
        </h1>
        <p
          className="hv3-text t-sub text-sm md:text-base text-ink-600 dark:text-ink-300 mt-4 px-4 drop-shadow-[0_2px_10px_rgba(250,247,241,0.85)] dark:drop-shadow-[0_2px_10px_rgba(27,26,24,0.85)]"
        >
          {subtitle}
        </p>
      </div>

      {/* Replay button */}
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

// ─────────────────────────────────────────────────────────────────
// Tile geometry: 10 polygon regions matching the reference artwork's
// composition. Used both for clipping the real image and for the
// procedural fallback when the image is missing.
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

  const regions: RegionSpec[] = [
    { id: 'r1', polygon: [[40, 40], [380, 40], [400, 200], [330, 290], [180, 360], [60, 410], [40, 350]],
      svg: hollibaugh(rectFor([[40, 40], [400, 200]]), { rng, density: 1.6, strokeWidth: 1.2 }) },
    { id: 'r2', polygon: [[380, 40], [600, 40], [580, 240], [430, 230], [400, 200]],
      svg: tipple(rectFor([[380, 40], [600, 240]]), { rng, density: 1.8, strokeWidth: 0.9 }) },
    { id: 'r3', polygon: [[600, 40], [770, 40], [760, 320], [580, 360], [490, 280], [580, 240]],
      svg: mooka(rectFor([[490, 40], [770, 360]]), { rng, density: 1.4, strokeWidth: 1.2 }) },
    { id: 'r4', polygon: [[770, 40], [960, 40], [960, 340], [820, 320], [760, 320]],
      svg: florz(rectFor([[760, 40], [960, 340]]), { rng, density: 1.4, strokeWidth: 0.8 }) },
    { id: 'r5', polygon: [[820, 320], [960, 340], [960, 600], [780, 580], [700, 540], [580, 460], [490, 280], [580, 360], [760, 320]],
      svg: florz(rectFor([[580, 320], [960, 600]]), { rng, density: 1.0, strokeWidth: 0.7 }) },
    { id: 'r6', polygon: [[40, 350], [60, 410], [180, 360], [330, 290], [400, 360], [380, 580], [310, 700], [40, 720]],
      svg: crescentMoon(rectFor([[40, 290], [400, 720]]), { rng, density: 1.1, strokeWidth: 1.0 }) },
    { id: 'r7', polygon: [[40, 720], [310, 700], [320, 880], [240, 960], [40, 960]],
      svg: knightsbridge(rectFor([[40, 700], [320, 960]]), { rng, density: 1.2 }) },
    { id: 'r8', polygon: [[400, 360], [490, 280], [580, 460], [700, 540], [780, 580], [720, 760], [560, 870], [380, 870], [320, 740], [380, 580]],
      svg: nautilus(rectFor([[300, 280], [780, 870]]), { rng, strokeWidth: 1.4 }) },
    { id: 'r9', polygon: [[240, 960], [320, 880], [380, 870], [560, 870], [660, 920], [660, 960]],
      svg: paradox(rectFor([[240, 870], [660, 960]]), { rng, density: 1.4, strokeWidth: 0.8 }) },
    { id: 'r10', polygon: [[720, 760], [780, 580], [960, 600], [960, 960], [660, 960], [660, 920], [560, 870]],
      svg: printemps(rectFor([[660, 580], [960, 960]]), { rng, density: 1.4, strokeWidth: 1.0 }) },
  ];

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

  return { corners, borders, strings, regions, signature: [925, 925] };
}

function rectFor(box: [[number, number], [number, number]]): Rect {
  const [tl, br] = box;
  return { x: tl[0], y: tl[1], w: br[0] - tl[0], h: br[1] - tl[1] };
}

function bezier(rng: () => number, a: [number, number], b: [number, number], c: [number, number], d: [number, number]): string {
  const j = () => (rng() - 0.5) * 8;
  return `M ${a[0]} ${a[1]} C ${b[0] + j()} ${b[1] + j()}, ${c[0] + j()} ${c[1] + j()}, ${d[0]} ${d[1]}`;
}
