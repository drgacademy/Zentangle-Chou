"use client";

import { useEffect, useMemo, useRef, useState, forwardRef, useImperativeHandle } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { composeTile, type ComposedTile, type PhaseDef, type RegionDef } from "@/lib/tangles/tileCompose";
import type { Stroke } from "@/lib/tangles/types";

export type TangleTileHandle = {
  restart: () => void;
  setSpeed: (n: number) => void;
};

type Props = {
  regions: RegionDef[];
  stringCurves?: string[];
  seed?: string;
  size?: number;
  speed?: number;
  paused?: boolean;
  ariaLabel?: string;
  onPhaseEnter?: (phase: PhaseDef) => void;
  onProgress?: (p: number) => void;
  onComplete?: () => void;
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

const TangleTile = forwardRef<TangleTileHandle, Props>(function TangleTile(
  {
    regions,
    stringCurves,
    seed = "tile-default",
    size = 800,
    speed = 1,
    paused = false,
    ariaLabel = "Zentangle tile",
    onPhaseEnter,
    onProgress,
    onComplete,
  },
  ref,
) {
  const svgRef = useRef<SVGSVGElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  const composed: ComposedTile = useMemo(
    () =>
      composeTile({
        regions,
        stringCurves,
        outerRect: { x: 0, y: 0, w: size, h: size },
        seed,
      }),
    [regions, stringCurves, seed, size],
  );

  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const update = () => setReduce(document.documentElement.dataset.motion === "reduce");
    update();
    const obs = new MutationObserver(update);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-motion"] });
    return () => obs.disconnect();
  }, []);

  useGSAP(
    () => {
      if (!svgRef.current) return;
      tlRef.current?.kill();
      const root = svgRef.current;

      if (reduce) {
        composed.strokes.forEach((s) => {
          const el = root.querySelector<SVGPathElement>(`[data-id="${s.id}"]`);
          if (!el) return;
          el.style.opacity = "1";
          el.style.strokeDasharray = "";
          el.style.strokeDashoffset = "";
        });
        const last = composed.phases[composed.phases.length - 1];
        if (last) onPhaseEnter?.(last);
        onProgress?.(1);
        onComplete?.();
        return;
      }

      const tl = gsap.timeline({ paused: true });
      tlRef.current = tl;

      const strokeMap: Record<string, Stroke> = {};
      composed.strokes.forEach((s) => (strokeMap[s.id] = s));

      composed.strokes.forEach((s) => {
        const el = root.querySelector<SVGPathElement>(`[data-id="${s.id}"]`);
        if (!el) return;
        const isFill = s.fill && s.fill !== "none";
        const opacityOnly = s.layer === "dot" || s.layer === "shade" || isFill;
        if (opacityOnly) {
          el.style.opacity = "0";
        } else {
          try {
            const len = el.getTotalLength();
            el.style.strokeDasharray = String(len);
            el.style.strokeDashoffset = String(len);
          } catch {
            el.style.opacity = "0";
          }
        }
      });

      composed.phases.forEach((phase, i) => {
        tl.addLabel(phase.id);
        tl.call(() => onPhaseEnter?.(phase));
        const phaseStrokes = phase.strokeIds.map((id) => strokeMap[id]).filter(Boolean);
        const stagger = Math.max(0.012, 0.6 / Math.max(phaseStrokes.length, 1));

        phaseStrokes.forEach((s, idx) => {
          const el = root.querySelector<SVGPathElement>(`[data-id="${s.id}"]`);
          if (!el) return;
          const isFill = s.fill && s.fill !== "none";
          const opacityOnly = s.layer === "dot" || s.layer === "shade" || isFill;
          const dur = (s.drawMs ?? 600) / 1000;
          const at = idx === 0 ? ">" : `<+=${stagger}`;
          if (opacityOnly) {
            tl.to(el, { opacity: 1, duration: dur, ease: "power2.out" }, at);
          } else {
            tl.to(el, { strokeDashoffset: 0, duration: dur, ease: "power2.out" }, at);
          }
        });
        if (i < composed.phases.length - 1) tl.to({}, { duration: 0.25 });
      });

      tl.eventCallback("onUpdate", () => onProgress?.(tl.progress()));
      tl.eventCallback("onComplete", () => onComplete?.());
      tl.timeScale(speed);
      if (!paused) tl.play();
    },
    { dependencies: [composed, reduce], scope: svgRef },
  );

  useEffect(() => {
    if (tlRef.current) tlRef.current.timeScale(speed);
  }, [speed]);

  useEffect(() => {
    if (!tlRef.current) return;
    if (paused) tlRef.current.pause();
    else tlRef.current.play();
  }, [paused]);

  useImperativeHandle(ref, () => ({
    restart: () => tlRef.current?.restart(true),
    setSpeed: (n: number) => tlRef.current?.timeScale(n),
  }));

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label={ariaLabel}
      className="block h-full w-full"
      style={{
        borderRadius: 6,
        boxShadow:
          "0 25px 60px rgba(0,0,0,0.5), 0 8px 20px rgba(0,0,0,0.35), inset 0 0 80px rgba(140,100,40,0.15)",
      }}
    >
      <defs>
        {composed.clipPaths.map((cp) => (
          <clipPath key={cp.id} id={cp.id}>
            <path d={cp.d} />
          </clipPath>
        ))}
      </defs>
      <rect x={0} y={0} width={size} height={size} fill="var(--paper-tile, #F0E4C8)" />
      {composed.strokes.map((s) => {
        const inner = (
          <path
            key={s.id}
            data-id={s.id}
            data-layer={s.layer}
            d={s.d}
            fill={fillFor(s)}
            stroke={
              s.fill && s.fill !== "none" && s.fill !== "currentColor"
                ? "none"
                : strokeColorFor(s.layer)
            }
            strokeWidth={s.width ?? 1}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={s.opacity ?? 1}
          />
        );
        return s.clipPathId ? (
          <g key={s.id} clipPath={`url(#${s.clipPathId})`}>
            {inner}
          </g>
        ) : (
          inner
        );
      })}
    </svg>
  );
});

export default TangleTile;
