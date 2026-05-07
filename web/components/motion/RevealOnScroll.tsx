"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  yFrom?: number;
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
};

export default function RevealOnScroll({
  children,
  yFrom = 28,
  delay = 0,
  duration = 0.85,
  className,
  once = true,
}: Props) {
  const reduce = useReducedMotion();

  const variants: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : yFrom, filter: reduce ? "blur(0px)" : "blur(4px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: reduce ? 0 : duration, delay: reduce ? 0 : delay, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-12% 0px" }}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
}
