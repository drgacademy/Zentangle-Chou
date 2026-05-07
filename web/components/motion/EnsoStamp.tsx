"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useMemo } from "react";
import { wobblyCircle } from "@/lib/tangles/geometry";
import { makeRng } from "@/lib/tangles/rng";

type Props = {
  glyph?: string;
  size?: number;
  seed?: string;
  className?: string;
  delay?: number;
};

/**
 * Procedural enso (圓相) — a wobbly hand-drawn red circle drawn with one
 * confident gesture, with an optional 篆字 character at its centre.  The
 * circle is slightly open at the top so the gesture reads as a single
 * exhalation, not a closed shape.
 */
export default function EnsoStamp({
  glyph = "禪",
  size = 120,
  seed = "zen-enso",
  className,
  delay = 0.1,
}: Props) {
  const reduce = useReducedMotion();

  const d = useMemo(() => {
    const rng = makeRng(seed);
    const full = wobblyCircle(size / 2, size / 2, size * 0.4, rng, 1.4, 60);
    return full.replace(/\s*Z\s*$/, "");
  }, [size, seed]);

  return (
    <motion.svg
      viewBox={`0 0 ${size} ${size}`}
      width={size}
      height={size}
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-15% 0px" }}
      aria-hidden="true"
    >
      <motion.path
        d={d}
        fill="none"
        stroke="var(--ink-red-stamp)"
        strokeWidth={size * 0.025}
        strokeLinecap="round"
        variants={{
          hidden: { pathLength: reduce ? 1 : 0, opacity: reduce ? 1 : 0.3 },
          visible: {
            pathLength: 1,
            opacity: 1,
            transition: { duration: reduce ? 0 : 1.6, delay: reduce ? 0 : delay, ease: [0.4, 0, 0.4, 1] },
          },
        }}
      />
      <motion.text
        x={size / 2}
        y={size * 0.6}
        textAnchor="middle"
        fontFamily="var(--font-masthead)"
        fontWeight={600}
        fontSize={size * 0.34}
        fill="var(--ink-red-stamp)"
        variants={{
          hidden: { opacity: 0, scale: reduce ? 1 : 0.7 },
          visible: {
            opacity: 1,
            scale: 1,
            transition: {
              duration: reduce ? 0 : 0.55,
              delay: reduce ? 0 : delay + 1.2,
              ease: [0.34, 1.56, 0.64, 1],
            },
          },
        }}
        style={{ transformOrigin: `${size / 2}px ${size * 0.55}px` }}
      >
        {glyph}
      </motion.text>
    </motion.svg>
  );
}
