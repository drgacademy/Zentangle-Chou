"use client";

import Link from "next/link";
import RevealOnScroll from "@/components/motion/RevealOnScroll";
import TangleCanvas from "@/components/tangle/TangleCanvas";
import { patternCards } from "@/lib/data/patternIndex";
import { t, type Dict, type Lang } from "@/lib/i18n";

export default function ScenePatternIndex({ dict, lang }: { dict: Dict; lang: Lang }) {
  return (
    <section className="px-6 py-24 bg-paper text-ink" aria-labelledby="patterns-title">
      <RevealOnScroll>
        <header className="mx-auto mb-12 max-w-3xl text-center">
          <h2 id="patterns-title" className="mb-2 font-masthead text-[var(--fs-pull)] font-semibold">
            {t(dict, "patternIndex.title")}
          </h2>
          <p className="text-ink-warm" style={{ fontFamily: "var(--font-display-script)", fontSize: "1.4rem" }}>
            {t(dict, "patternIndex.intro")}
          </p>
        </header>
      </RevealOnScroll>

      <div className="mx-auto grid max-w-7xl gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {patternCards.map((p) => (
          <RevealOnScroll key={p.slug} yFrom={20} duration={0.65}>
            <Link
              href={`/${lang}/tangles#${p.slug}`}
              className="block rounded border border-ink-bleed bg-paper-rice p-5 transition hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(0,0,0,0.06)]"
            >
              <div className="mb-4 aspect-square overflow-hidden rounded-sm bg-paper-tile">
                <TangleCanvas
                  pattern={p.slug}
                  mode="ambient"
                  seed={`idx-${p.slug}`}
                  size={200}
                  density={0.7}
                  jitter={1}
                  withScaffold={false}
                />
              </div>
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-masthead text-[1.1rem] font-medium">{p.nameZh}</span>
                <span className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-ink-shade">
                  {p.nameEn}
                </span>
              </div>
            </Link>
          </RevealOnScroll>
        ))}
      </div>
    </section>
  );
}
