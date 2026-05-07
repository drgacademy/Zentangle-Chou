"use client";

import { motion } from "framer-motion";
import EnsoStamp from "@/components/motion/EnsoStamp";
import { t, type Dict } from "@/lib/i18n";

export default function SceneFooterMark({ dict }: { dict: Dict }) {
  return (
    <section
      className="text-paper-tile px-6 py-24 text-center"
      style={{ background: "var(--bg-spotlight)" }}
      aria-label="signature"
    >
      <div className="mb-6 inline-block">
        <EnsoStamp glyph={t(dict, "signature.stamp")} size={140} />
      </div>
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-15% 0px" }}
        transition={{ duration: 0.7, delay: 1.5 }}
        className="mb-2 font-masthead text-[clamp(1.8rem,4vw,2.6rem)] font-semibold tracking-[0.04em]"
      >
        {t(dict, "site.title")}
      </motion.h2>
      <p className="font-mono text-[0.75rem] uppercase tracking-[0.32em] text-paper-tile/55">
        {t(dict, "hero.subtitle")}
      </p>
    </section>
  );
}
