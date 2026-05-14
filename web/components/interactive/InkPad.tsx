"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Stroke = { points: { x: number; y: number }[] };

type Props = {
  className?: string;
  locale: "zh" | "en";
};

const PROMPTS_ZH = [
  "畫一條線。不必好看。",
  "把紙磚轉九十度。再畫一條。",
  "停在筆尖上一秒，再畫下一筆。",
  "讓一條線繞回它自己。",
];
const PROMPTS_EN = [
  "Draw a line. It does not need to be beautiful.",
  "Rotate the tile ninety degrees. Draw another.",
  "Pause at the pen tip for a second. Then the next stroke.",
  "Let a line curl back into itself.",
];

export function InkPad({ className, locale }: Props) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [current, setCurrent] = useState<Stroke | null>(null);
  const [promptIdx, setPromptIdx] = useState(0);

  const prompts = locale === "en" ? PROMPTS_EN : PROMPTS_ZH;

  useEffect(() => {
    const id = window.setInterval(() => {
      setPromptIdx((v) => (v + 1) % prompts.length);
    }, 7000);
    return () => window.clearInterval(id);
  }, [prompts.length]);

  const toLocal = useCallback((evt: React.PointerEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const rect = svg.getBoundingClientRect();
    const x = ((evt.clientX - rect.left) / rect.width) * 100;
    const y = ((evt.clientY - rect.top) / rect.height) * 100;
    return { x, y };
  }, []);

  const onPointerDown = (evt: React.PointerEvent<SVGSVGElement>) => {
    evt.preventDefault();
    (evt.target as Element).setPointerCapture?.(evt.pointerId);
    setCurrent({ points: [toLocal(evt)] });
  };
  const onPointerMove = (evt: React.PointerEvent<SVGSVGElement>) => {
    if (!current) return;
    setCurrent((prev) => (prev ? { points: [...prev.points, toLocal(evt)] } : prev));
  };
  const onPointerUp = () => {
    if (current && current.points.length > 1) {
      setStrokes((prev) => [...prev, current]);
    }
    setCurrent(null);
  };
  const clearAll = () => {
    setStrokes([]);
    setCurrent(null);
  };
  const undo = () => {
    setStrokes((prev) => prev.slice(0, -1));
  };

  const toPath = (stroke: Stroke) => {
    if (!stroke.points.length) return "";
    const [first, ...rest] = stroke.points;
    return `M ${first.x.toFixed(2)} ${first.y.toFixed(2)} ` + rest.map((p) => `L ${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(" ");
  };

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="glass glass-sweep relative aspect-square">
        <svg
          ref={svgRef}
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full touch-none cursor-crosshair text-ink"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
          role="img"
          aria-label={locale === "en" ? "Drawing surface" : "練習板"}
        >
          {strokes.map((s, i) => (
            <path
              key={i}
              d={toPath(s)}
              fill="none"
              stroke="currentColor"
              strokeWidth={0.6}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
          {current && (
            <path
              d={toPath(current)}
              fill="none"
              stroke="currentColor"
              strokeWidth={0.6}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
        </svg>
        <p className="absolute bottom-3 left-4 right-4 text-center text-xs text-ink-mute tracking-[0.2em] pointer-events-none">
          {prompts[promptIdx]}
        </p>
      </div>
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.32em]">
        <span className="text-ink-mute">
          {locale === "en"
            ? `${strokes.length} stroke${strokes.length === 1 ? "" : "s"}`
            : `${strokes.length} 筆`}
        </span>
        <div className="flex items-center gap-4">
          <button type="button" onClick={undo} className="nav-link" disabled={!strokes.length}>
            {locale === "en" ? "Undo" : "上一筆"}
          </button>
          <button type="button" onClick={clearAll} className="nav-link" disabled={!strokes.length && !current}>
            {locale === "en" ? "Clear" : "重新開始"}
          </button>
        </div>
      </div>
    </div>
  );
}
