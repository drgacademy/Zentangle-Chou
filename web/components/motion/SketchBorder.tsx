"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { wobblyRect, dot } from "@/lib/tangles/geometry";
import { makeRng } from "@/lib/tangles/rng";

type Props = {
  children: React.ReactNode;
  seed?: string;
  pad?: number;
  className?: string;
};

/**
 * Wraps content in a ResizeObserver-tracked SVG that draws four corner
 * dots followed by a wobbly hand-drawn pencil border on enter.
 */
export default function SketchBorder({ children, seed = "section", pad = 28, className }: Props) {
  const reduce = useReducedMotion();
  const hostRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    if (!hostRef.current) return;
    const el = hostRef.current;
    const ro = new ResizeObserver(() => setSize({ w: el.offsetWidth, h: el.offsetHeight }));
    ro.observe(el);
    setSize({ w: el.offsetWidth, h: el.offsetHeight });
    return () => ro.disconnect();
  }, []);

  const paths = useMemo(() => {
    if (size.w === 0 || size.h === 0) return null;
    const rng = makeRng(seed);
    const inset = pad;
    const rect = { x: inset, y: inset, w: size.w - inset * 2, h: size.h - inset * 2 };
    return {
      dots: [
        dot(rect.x, rect.y, 2.4),
        dot(rect.x + rect.w, rect.y, 2.4),
        dot(rect.x + rect.w, rect.y + rect.h, 2.4),
        dot(rect.x, rect.y + rect.h, 2.4),
      ],
      border: wobblyRect(rect, rng, 2, 28),
    };
  }, [size, seed, pad]);

  return (
    <div ref={hostRef} className={["relative", className].filter(Boolean).join(" ")}>
      {paths && (
        <motion.svg
          className="pointer-events-none absolute inset-0 z-0 h-full w-full"
          viewBox={`0 0 ${size.w} ${size.h}`}
          preserveAspectRatio="none"
          aria-hidden="true"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-12% 0px" }}
        >
          {paths.dots.map((d, i) => (
            <motion.path
              key={`dot-${i}`}
              d={d}
              fill="var(--ink-pencil)"
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { duration: 0.25, delay: reduce ? 0 : i * 0.18 } },
              }}
            />
          ))}
          <motion.path
            d={paths.border}
            fill="none"
            stroke="var(--ink-pencil)"
            strokeWidth={1.2}
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            variants={{
              hidden: { pathLength: reduce ? 1 : 0 },
              visible: {
                pathLength: 1,
                transition: { duration: reduce ? 0 : 1.4, delay: reduce ? 0 : 0.8, ease: [0.22, 1, 0.36, 1] },
              },
            }}
          />
        </motion.svg>
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
