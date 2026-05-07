"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { buildScene } from "@/lib/tangles/engine";
import { patterns, type PatternSlug } from "@/lib/tangles/patterns";
import { randomSeed } from "@/lib/tangles/rng";
import type { Stroke } from "@/lib/tangles/types";

type Mode = "ambient" | "interactive" | "static";

type Props = {
  pattern: PatternSlug;
  mode?: Mode;
  seed?: string;
  size?: number;
  density?: number;
  jitter?: number;
  withScaffold?: boolean;
  className?: string;
};

function strokeColorFor(layer: Stroke["layer"]) {
  switch (layer) {
    case "pencil-border":
    case "pencil-string":
    case "dot":
      return "var(--ink-pencil)";
    case "shade":
      return "var(--ink-shade)";
    default:
      return "var(--ink)";
  }
}

function fillFor(s: Stroke) {
  if (!s.fill) return "none";
  if (s.fill === "currentColor") return strokeColorFor(s.layer);
  return s.fill;
}

export default function TangleCanvas({
  pattern,
  mode = "ambient",
  seed: seedProp,
  size = 600,
  density = 1,
  jitter = 1.4,
  withScaffold = true,
  className,
}: Props) {
  const [seed, setSeed] = useState(seedProp ?? randomSeed());
  const svgRef = useRef<SVGSVGElement>(null);

  const strokes = useMemo<Stroke[]>(() => {
    const p = patterns[pattern];
    if (!p) return [];
    return buildScene({
      pattern: p,
      rect: { x: 0, y: 0, w: size, h: size },
      seed,
      density,
      jitter,
      withScaffold,
    });
  }, [pattern, seed, size, density, jitter, withScaffold]);

  useGSAP(
    () => {
      if (!svgRef.current) return;
      const reduce = document.documentElement.dataset.motion === "reduce";
      const paths = Array.from(svgRef.current.querySelectorAll<SVGPathElement>("path[data-stroke]"));
      if (reduce || mode === "static") {
        paths.forEach((p) => {
          p.style.opacity = "1";
          p.style.strokeDasharray = "";
          p.style.strokeDashoffset = "";
        });
        return;
      }
      const tl = gsap.timeline({});
      paths.forEach((p, i) => {
        try {
          const len = p.getTotalLength();
          p.style.strokeDasharray = String(len);
          p.style.strokeDashoffset = String(len);
        } catch {
          return;
        }
        const dur = Math.max(0.18, Math.min(1.4, p.getTotalLength() * 0.004));
        tl.to(p, { strokeDashoffset: 0, duration: dur, ease: "power2.out" }, i === 0 ? 0 : `>-${Math.max(dur - 0.07, 0)}`);
      });
    },
    { dependencies: [strokes, mode], scope: svgRef },
  );

  const handleClick = () => {
    if (mode === "interactive") setSeed(randomSeed());
  };

  const svg = (
    <svg ref={svgRef} viewBox={`0 0 ${size} ${size}`} className="block h-full w-full" role="img" aria-label={`${pattern} tangle`}>
      {strokes.map((s) => (
        <path
          key={s.id}
          data-stroke
          data-layer={s.layer}
          d={s.d}
          fill={fillFor(s)}
          stroke={strokeColorFor(s.layer)}
          strokeWidth={s.width ?? 1}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={s.opacity ?? 1}
        />
      ))}
    </svg>
  );

  if (mode === "interactive") {
    return (
      <button
        type="button"
        className={["block h-full w-full cursor-pointer p-0 bg-transparent border-0", className].filter(Boolean).join(" ")}
        onClick={handleClick}
        aria-label={`Re-seed ${pattern}`}
      >
        {svg}
      </button>
    );
  }
  return <div className={className}>{svg}</div>;
}
