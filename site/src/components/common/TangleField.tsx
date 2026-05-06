import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  rngFromSeed,
  randRange,
  pickOne,
  tipple,
  florz,
  printemps,
  crescentMoon,
  staticTangle,
  auras,
  mooka,
  paradox,
  knightsbridge,
  type TangleName,
  type Rect,
  type Rng,
} from '@/lib/tangles';

interface Drop {
  id: number;
  x: number;
  y: number;
  size: number;
  svg: string;
  rotation: number;
  /** ms — when this drop was created */
  bornAt: number;
  /** seconds — wipe-in duration (drawing speed) */
  drawDuration: number;
  /** seconds — total lifespan from birth to full fade out */
  lifespan: number;
}

interface TangleFieldProps {
  /** how many tangle micro-tiles can be on screen at once */
  maxItems?: number;
  /** seconds before the oldest tile fades and a new one appears (idle) */
  spawnEvery?: number;
  seed?: string;
}

const KINDS: TangleName[] = [
  'tipple',
  'florz',
  'printemps',
  'crescent-moon',
  'static',
  'auras',
  'mooka',
  'paradox',
  'knightsbridge',
];

function drawByName(kind: TangleName, rect: Rect, rng: Rng): string {
  switch (kind) {
    case 'tipple':         return tipple(rect, { rng, density: 1.4, strokeWidth: 0.7 });
    case 'florz':          return florz(rect, { rng, density: 1.0, strokeWidth: 0.6 });
    case 'printemps':      return printemps(rect, { rng, density: 0.8, strokeWidth: 0.7 });
    case 'crescent-moon':  return crescentMoon(rect, { rng, density: 1.0, strokeWidth: 0.7 });
    case 'static':         return staticTangle(rect, { rng, density: 1.0, strokeWidth: 0.6 });
    case 'auras':          return auras(rect, { rng, strokeWidth: 0.7 });
    case 'mooka':          return mooka(rect, { rng, density: 0.9, strokeWidth: 0.8 });
    case 'paradox':        return paradox(rect, { rng, density: 1.0, strokeWidth: 0.6 });
    case 'knightsbridge':  return knightsbridge(rect, { rng, density: 1.4 });
    default:               return tipple(rect, { rng });
  }
}

/**
 * TangleField — slow ambient background of small zentangle tiles. Each new
 * drop "draws in" via a left-to-right clip-path wipe so the user sees lines
 * being committed to paper rather than just appearing.
 *
 * Idle: spawns one drop every ~5s.
 * Scrolling: every 100px of scroll travel triggers an extra drop, capped to
 * one new spawn per 600ms, so reading the page steadily reveals more tangles.
 */
export default function TangleField({
  maxItems = 9,
  spawnEvery = 5,
  seed = 'tangle-field',
}: TangleFieldProps) {
  const [drops, setDrops] = useState<Drop[]>([]);
  const counterRef = useRef(0);
  const rngRef = useRef<Rng>(rngFromSeed(seed));
  const lastScrollY = useRef(0);
  const lastSpawnAt = useRef(0);
  const accumulatedScroll = useRef(0);

  const initial = useMemo(() => {
    if (typeof window === 'undefined') return [];
    const rng = rngFromSeed(seed + '-init');
    const now = Date.now();
    const items: Drop[] = [];
    const count = Math.max(3, Math.floor(maxItems * 0.6));
    for (let i = 0; i < count; i++) {
      const d = makeDrop(i, rng);
      // stagger initial births so they don't all expire together
      d.bornAt = now - i * 1500;
      items.push(d);
    }
    counterRef.current = items.length;
    return items;
  }, [maxItems, seed]);

  const spawnOne = () => {
    const now = Date.now();
    if (now - lastSpawnAt.current < 600) return;
    lastSpawnAt.current = now;
    setDrops(prev => {
      const id = ++counterRef.current;
      const next = makeDrop(id, rngRef.current);
      const merged = [...prev, next];
      return merged.length > maxItems ? merged.slice(merged.length - maxItems) : merged;
    });
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setDrops(initial);
    lastScrollY.current = window.scrollY;

    // idle ticker
    const interval = setInterval(spawnOne, spawnEvery * 1000);

    // scroll-driven spawn
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const dy = Math.abs(window.scrollY - lastScrollY.current);
        lastScrollY.current = window.scrollY;
        accumulatedScroll.current += dy;
        if (accumulatedScroll.current >= 120) {
          accumulatedScroll.current = 0;
          spawnOne();
        }
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    // remove drops once their lifespan has elapsed
    const cleanup = setInterval(() => {
      const now = Date.now();
      setDrops(prev => {
        const next = prev.filter(d => now - d.bornAt < d.lifespan * 1000);
        return next.length === prev.length ? prev : next;
      });
    }, 1500);

    return () => {
      clearInterval(interval);
      clearInterval(cleanup);
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [initial, maxItems, spawnEvery]);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 0, opacity: 0.09 }}
    >
      {drops.map(d => (
        <div
          key={d.id}
          className="tangle-drop absolute hand-drawn text-ink-700 dark:text-ink-200"
          style={{
            left: `${d.x}%`,
            top: `${d.y}%`,
            width: `${d.size}px`,
            height: `${d.size}px`,
            transform: `translate(-50%, -50%) rotate(${d.rotation}deg)`,
            ['--draw-duration' as any]: `${d.drawDuration}s`,
            ['--life' as any]: `${d.lifespan}s`,
            animation: `tangle-life var(--life) ease-out forwards`,
          }}
        >
          <div
            className="tangle-drop-inner w-full h-full"
            style={{ animation: `tangle-wipe var(--draw-duration) cubic-bezier(0.45, 0.05, 0.3, 1) forwards` }}
          >
            <svg
              viewBox="0 0 100 100"
              width={d.size}
              height={d.size}
              dangerouslySetInnerHTML={{ __html: d.svg }}
            />
          </div>
        </div>
      ))}
      <style>{`
        @keyframes tangle-life {
          0%   { opacity: 0; }
          12%  { opacity: 1; }
          80%  { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes tangle-wipe {
          0%   { clip-path: inset(0 100% 0 0); }
          100% { clip-path: inset(0 0 0 0); }
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes tangle-life { 0%, 100% { opacity: 1; } }
          @keyframes tangle-wipe { 0%, 100% { clip-path: inset(0 0 0 0); } }
        }
      `}</style>
    </div>
  );
}

function makeDrop(id: number, rng: Rng): Drop {
  const kind = pickOne<TangleName>(rng, KINDS);
  const size = Math.floor(randRange(rng, 90, 170));
  const onEdge = rng() < 0.7;
  const x = onEdge ? (rng() < 0.5 ? randRange(rng, 4, 16) : randRange(rng, 84, 96)) : randRange(rng, 8, 92);
  const y = randRange(rng, 6, 94);
  const rect: Rect = { x: 0, y: 0, w: 100, h: 100 };
  const svg = drawByName(kind, rect, rng);
  const rotation = randRange(rng, -10, 10);
  const drawDuration = randRange(rng, 2.4, 4.0);
  const lifespan = randRange(rng, 9, 14);
  return { id, x, y, size, svg, rotation, drawDuration, lifespan, bornAt: Date.now() };
}
