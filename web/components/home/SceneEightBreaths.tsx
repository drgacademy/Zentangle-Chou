"use client";

import RevealOnScroll from "@/components/motion/RevealOnScroll";
import { eightBreaths } from "@/lib/data/eightBreaths";
import { t, type Dict } from "@/lib/i18n";

const layerStyles: Record<string, string> = {
  gratitude: "bg-[var(--ink-red-stamp)]",
  dot: "bg-[var(--ink-pencil)]",
  "pencil-border": "bg-transparent border-2 border-[var(--ink-pencil)]",
  "pencil-string": "bg-transparent border-2 border-dashed border-[var(--ink-pencil)]",
  ink: "bg-[var(--ink)]",
  shade: "bg-[var(--ink-shade)]",
  initial: "bg-[var(--ink-red-stamp)] opacity-65",
  appreciate: "bg-gradient-to-br from-[var(--ink-red-stamp)] to-[var(--gold-500)]",
};

export default function SceneEightBreaths({ dict }: { dict: Dict }) {
  return (
    <section className="relative px-6 py-24 bg-paper-rice text-ink" aria-labelledby="breaths-title">
      <RevealOnScroll>
        <header className="mx-auto mb-16 max-w-3xl text-center">
          <p className="mb-2 font-mono text-[var(--fs-caption)] uppercase tracking-[0.32em] text-ink-shade">
            {t(dict, "eightBreaths.subtitle")}
          </p>
          <h2 id="breaths-title" className="font-masthead text-[var(--fs-pull)] font-semibold">
            {t(dict, "eightBreaths.title")}
          </h2>
        </header>
      </RevealOnScroll>

      <ol className="mx-auto grid max-w-3xl gap-10 list-none p-0 m-0">
        {eightBreaths.map((step) => (
          <RevealOnScroll key={step.index} yFrom={32}>
            <li className="grid grid-cols-[3rem_1fr_3rem] sm:grid-cols-[4rem_1fr_4rem] items-center gap-6 border-b border-ink-bleed pb-6">
              <span className="font-mono text-[1.4rem] tracking-[0.02em] text-ink-pencil">
                {String(step.index).padStart(2, "0")}
              </span>
              <div>
                <h3 className="mb-1 font-masthead text-[var(--fs-h3)] font-medium">
                  {t(dict, step.i18nKey + ".title")}
                </h3>
                <p className="text-ink-shade leading-relaxed">{t(dict, step.i18nKey + ".desc")}</p>
              </div>
              <span
                className={["inline-block h-10 w-10 sm:h-12 sm:w-12 rounded-full opacity-80", layerStyles[step.layerHint] || ""].join(
                  " ",
                )}
                aria-hidden="true"
              />
            </li>
          </RevealOnScroll>
        ))}
      </ol>
    </section>
  );
}
