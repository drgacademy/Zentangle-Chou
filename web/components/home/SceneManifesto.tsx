"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import RevealOnScroll from "@/components/motion/RevealOnScroll";
import { t, type Dict, type Lang } from "@/lib/i18n";

export default function SceneManifesto({ dict, lang }: { dict: Dict; lang: Lang }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const yPrimary = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const ySecondary = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-32"
      aria-labelledby="manifesto-title"
    >
      <RevealOnScroll>
        <blockquote className="relative mx-auto max-w-4xl text-center">
          <motion.p
            id="manifesto-title"
            style={{ y: yPrimary }}
            className="mb-8 font-masthead text-[var(--fs-pull)] font-medium leading-tight text-ink"
          >
            {lang === "zh" ? t(dict, "manifesto.quoteZh") : t(dict, "manifesto.quoteEn")}
          </motion.p>
          <motion.p
            style={{ y: ySecondary, fontFamily: "var(--font-display-script)" }}
            className="text-[clamp(1.4rem,2.5vw,1.9rem)] text-ink-warm"
          >
            {lang === "zh" ? t(dict, "manifesto.quoteEn") : t(dict, "manifesto.quoteZh")}
          </motion.p>
        </blockquote>
      </RevealOnScroll>
    </section>
  );
}
