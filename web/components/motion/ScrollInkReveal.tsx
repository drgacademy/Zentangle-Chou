"use client";

import { motion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  once?: boolean;
};

const variants: Variants = {
  hidden: { opacity: 0, y: 24, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.9, ease: [0.22, 0.61, 0.36, 1] },
  },
};

export function ScrollInkReveal({ children, className, delay = 0, y, once = true }: Props) {
  return (
    <motion.div
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.25, margin: "0px 0px -10% 0px" }}
      variants={
        y !== undefined
          ? {
              hidden: { opacity: 0, y, filter: "blur(6px)" },
              visible: {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                transition: { duration: 0.9, ease: [0.22, 0.61, 0.36, 1], delay },
              },
            }
          : {
              ...variants,
              visible: {
                ...variants.visible,
                transition: { duration: 0.9, ease: [0.22, 0.61, 0.36, 1], delay },
              },
            }
      }
    >
      {children}
    </motion.div>
  );
}
