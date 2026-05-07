"use client";

import { motion, useReducedMotion } from "framer-motion";

type Props = {
  text: string;
  className?: string;
  perCharMs?: number;
  delayMs?: number;
  as?: "h1" | "h2" | "h3" | "p" | "span";
};

/**
 * Per-character reveal: each glyph fades + slides up sequentially with a
 * subtle pen-pressure ease.  CJK characters get a slightly longer window
 * so their stroke complexity has time to read.
 */
export default function HandDrawnText({
  text,
  className,
  perCharMs = 70,
  delayMs = 0,
  as = "p",
}: Props) {
  const reduce = useReducedMotion();
  const Tag = motion[as] as typeof motion.p;

  if (reduce) {
    return <Tag className={className}>{text}</Tag>;
  }

  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10% 0px" }}
      aria-label={text}
    >
      {Array.from(text).map((ch, i) => {
        const isCJK = /[　-鿿＀-￯]/.test(ch);
        return (
          <motion.span
            key={`${ch}-${i}`}
            aria-hidden
            style={{ display: "inline-block", whiteSpace: "pre" }}
            variants={{
              hidden: { opacity: 0, y: 12, filter: "blur(4px)" },
              visible: {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                transition: {
                  delay: delayMs / 1000 + (i * perCharMs * (isCJK ? 1.4 : 1)) / 1000,
                  duration: 0.55,
                  ease: [0.22, 1, 0.36, 1],
                },
              },
            }}
          >
            {ch}
          </motion.span>
        );
      })}
    </Tag>
  );
}
