"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";

/**
 * Wraps the [lang] children in AnimatePresence so route transitions can
 * cross-fade with a subtle ink-bleed wash on top.  The wash is a CSS
 * radial gradient from the screen centre — it's lightweight enough to
 * never block paint, while still reading as "墨水暈染" on dark themes.
 */
export default function InkPageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0, filter: "blur(8px)" }}
        animate={{ opacity: 1, filter: "blur(0px)" }}
        exit={{ opacity: 0, filter: "blur(6px)" }}
        transition={{ duration: 0.55, ease: [0.65, 0, 0.35, 1] }}
        className="relative"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
