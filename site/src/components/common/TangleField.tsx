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
  born: number;
  rotation: number;
}

interface TangleFieldProps {
  /** how many tangle micro-tiles can be on screen at once */
  maxItems?: number;
  /** seconds before the oldest tile fades and a new one appears */
  spawnEvery?: number;
  seed?: string;
}

const KINDS: TangleName[] = ['tipple', 'florz', 'printemps', 'crescent-moon', 'static', 'auras'];

function drawByName(kind: TangleName, rect: Rect, rng: Rng): string {
  switch (kind) {
    case 'tipple':       return tipple(rect, { rng, density: 1.4, strokeWidth: 0.7 });
    case 'florz':        return florz(rect, { rng, density: 1.0, strokeWidth: 0.6 });
    case 'printemps':    return printemps(rect, { rng, density: 0.8, strokeWidth: 0.7 });
    case 'crescent-moon':return crescentMoon(rect, { rng, density: 1.0, strokeWidth: 0.7 });
    case 'static':       return staticTangle(rect, { rng, density: 1.0, strokeWidth: 0.6 });
    case 'auras':        return auras(rect, { rng, strokeWidth: 0.7 });
    default:             return tipple(rect, { rng });
  }
}

/**
 * TangleField — a slow ambient background of small zentangle tiles that
 * fade in around the viewport as the user reads. Replaces the old
 * FloatingStrings drift.
 */
export default function TangleField({
  maxItems = 6,
  spawnEvery = 4.5,
  seed = 'tangle-field',
}: TangleFieldProps) {
  const [drops, setDrops] = useState<Drop[]>([]);
  const counter = useRef(0);
  const rngRef = useRef<Rng>(rngFromSeed(seed));

  // initial population — generate a few tiles immediately so the field is
  // present on first paint instead of empty.
  const initial = useMemo(() => {
    if (typeof window === 'undefined') return [];
    const rng = rngFromSeed(seed + '-init');
    const items: Drop[] = [];
    for (let i = 0; i < Math.max(3, Math.floor(maxItems * 0.6)); i++) {
      items.push(makeDrop(i, rng));
    }
    counter.current = items.length;
    return items;
  }, [maxItems, seed]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setDrops(initial);

    const interval = setInterval(() => {
      setDrops(prev => {
        const id = ++counter.current;
        const next = makeDrop(id, rngRef.current);
        const merged = [...prev, next];
        return merged.length > maxItems ? merged.slice(merged.length - maxItems) : merged;
      });
    }, spawnEvery * 1000);

    return () => clearInterval(interval);
  }, [initial, maxItems, spawnEvery]);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 0, opacity: 0.085 }}
    >
      {drops.map(d => (
        <div
          key={d.id}
          className="absolute hand-drawn text-ink-700 dark:text-ink-200"
          style={{
            left: `${d.x}%`,
            top: `${d.y}%`,
            width: `${d.size}px`,
            height: `${d.size}px`,
            transform: `translate(-50%, -50%) rotate(${d.rotation}deg)`,
            animation: 'tangle-field-fade 6s ease-out forwards',
          }}
        >
          <svg
            viewBox="0 0 100 100"
            width={d.size}
            height={d.size}
            dangerouslySetInnerHTML={{ __html: d.svg }}
          />
        </div>
      ))}
      <style>{`
        @keyframes tangle-field-fade {
          0%   { opacity: 0; transform: translate(-50%, -50%) rotate(var(--rot, 0deg)) scale(0.92); }
          18%  { opacity: 1; }
          85%  { opacity: 1; }
          100% { opacity: 0; transform: translate(-50%, -50%) rotate(var(--rot, 0deg)) scale(1.0); }
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes tangle-field-fade {
            0%, 100% { opacity: 1; }
          }
        }
      `}</style>
    </div>
  );
}

function makeDrop(id: number, rng: Rng): Drop {
  const kind = pickOne<TangleName>(rng, KINDS);
  const size = Math.floor(randRange(rng, 80, 140));
  // bias to viewport edges so the field frames the content
  const onEdge = rng() < 0.7;
  const x = onEdge ? (rng() < 0.5 ? randRange(rng, 4, 14) : randRange(rng, 86, 96)) : randRange(rng, 8, 92);
  const y = randRange(rng, 8, 92);
  const rect: Rect = { x: 0, y: 0, w: 100, h: 100 };
  const svg = drawByName(kind, rect, rng);
  const rotation = randRange(rng, -8, 8);
  return { id, x, y, size, svg, born: Date.now(), rotation };
}
