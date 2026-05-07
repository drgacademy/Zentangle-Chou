import { notFound } from "next/navigation";
import { getDict, isLang, type Lang } from "@/lib/i18n";
import RevealOnScroll from "@/components/motion/RevealOnScroll";
import TangleCanvas from "@/components/tangle/TangleCanvas";
import { patterns } from "@/lib/tangles/patterns";
import { patternCards } from "@/lib/data/patternIndex";

export default async function TanglesPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const dict = getDict(lang as Lang);
  const isZh = lang === "zh";

  return (
    <main className="mx-auto max-w-7xl px-6 pt-32 pb-24 text-ink">
      <RevealOnScroll>
        <header className="mb-16 text-center">
          <h1 className="mb-2 font-masthead text-[var(--fs-pull)] font-semibold">
            {dict.patternIndex.title}
          </h1>
          <p className="mb-2 text-ink-warm" style={{ fontFamily: "var(--font-display-script)", fontSize: "1.4rem" }}>
            {dict.patternIndex.intro}
          </p>
          <p className="font-mono text-[var(--fs-caption)] uppercase tracking-[0.2em] text-ink-shade">
            {isZh ? "點擊圖樣即可重新繪製" : "Click any tangle to re-draw"}
          </p>
        </header>
      </RevealOnScroll>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {patternCards.map((card) => {
          const p = patterns[card.slug];
          return (
            <RevealOnScroll key={card.slug} yFrom={28}>
              <section
                id={card.slug}
                className="rounded border border-ink-bleed bg-paper-rice p-6 scroll-mt-24"
                aria-labelledby={`${card.slug}-title`}
              >
                <div className="mb-4 aspect-square overflow-hidden rounded-sm bg-paper-tile">
                  <TangleCanvas
                    pattern={card.slug}
                    mode="interactive"
                    seed={`tangle-${card.slug}`}
                    size={400}
                    density={1}
                    jitter={1.4}
                    withScaffold
                  />
                </div>
                <h2 id={`${card.slug}-title`} className="mb-1 flex items-baseline gap-2">
                  <span className="font-masthead text-[1.4rem] font-medium">{card.nameZh}</span>
                  <span className="font-mono text-[0.75rem] uppercase tracking-[0.18em] text-ink-shade">
                    {card.nameEn}
                  </span>
                </h2>
                <p className="mb-3 text-[var(--fs-caption)] text-ink-shade">
                  {isZh ? "由" : "by"} {card.origin}
                </p>
                {p && (
                  <ol className="m-0 ml-5 list-decimal space-y-1 text-[0.95rem] text-ink-shade">
                    {p.steps.map((step, i) => (
                      <li key={i}>{isZh ? step.labelZh : step.labelEn}</li>
                    ))}
                  </ol>
                )}
              </section>
            </RevealOnScroll>
          );
        })}
      </div>
    </main>
  );
}
