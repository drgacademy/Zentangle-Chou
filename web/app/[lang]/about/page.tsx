import { notFound } from "next/navigation";
import { getDict, isLang, type Lang } from "@/lib/i18n";
import RevealOnScroll from "@/components/motion/RevealOnScroll";
import SketchBorder from "@/components/motion/SketchBorder";
import EnsoStamp from "@/components/motion/EnsoStamp";

const tools = [
  { zh: "紙", en: "Paper", descZh: "3.5 × 3.5 英吋，奶油色純棉。沒有純白。", descEn: "3.5 × 3.5 in. cream cotton vellum. Never pure white." },
  { zh: "墨筆", en: "Pen", descZh: "Sakura Pigma Micron 01／05，純黑、單線寬。", descEn: "Sakura Pigma Micron 01/05. Pure black, monoline." },
  { zh: "鉛筆", en: "Pencil", descZh: "2B 或 4B，畫邊框、字串、最後的陰影。", descEn: "2B or 4B for borders, strings, and the final shading." },
  { zh: "抹擦筆", en: "Tortillon", descZh: "紙捲擦筆，把鉛筆暈開成柔和漸層。", descEn: "Paper stump that smudges graphite into soft gradients." },
];

const influences = [
  { quoteZh: "禪繞畫不是畫技，是一種專注的儀式。", quoteEn: "Zentangle is not a drawing skill — it is a ritual of presence.", attr: "Maria Thomas & Rick Roberts" },
  { quoteZh: "沒有錯誤，只有契機。", quoteEn: "There are no mistakes, only opportunities.", attr: "Zentangle Method" },
  { quoteZh: "一筆一畫，一切都成為可能。", quoteEn: "Anything is possible, one stroke at a time.", attr: "Zentangle Method" },
];

export default async function AboutPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const dict = getDict(lang as Lang);
  const isZh = lang === "zh";

  return (
    <main className="mx-auto max-w-7xl px-6 pt-32 pb-24 text-ink">
      <section className="mb-24">
        <RevealOnScroll>
          <div className="mx-auto grid max-w-4xl items-center gap-10 sm:grid-cols-[auto_1fr]">
            <EnsoStamp size={160} seed="about-enso" delay={0.2} />
            <div>
              <p className="mb-2 font-mono text-[var(--fs-caption)] uppercase tracking-[0.32em] text-ink-shade">
                {dict.about.title}
              </p>
              <p className="mb-5 font-masthead text-[var(--fs-h2)] font-medium leading-tight">
                {dict.about.lede}
              </p>
              <p className="text-ink-shade leading-relaxed">{dict.about.body}</p>
            </div>
          </div>
        </RevealOnScroll>
      </section>

      <section className="mb-24">
        <RevealOnScroll>
          <h2 className="mb-10 text-center font-masthead text-[var(--fs-h2)] font-medium">
            {dict.about.tools}
          </h2>
        </RevealOnScroll>
        <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {tools.map((tool, i) => (
            <RevealOnScroll key={tool.en} yFrom={32} duration={0.6} delay={i * 0.05}>
              <SketchBorder seed={`tool-${i}`} pad={20} className="min-h-[180px] p-8">
                <h3 className="mb-2 flex items-baseline gap-2">
                  <span className="font-masthead text-[1.4rem] font-medium">{tool.zh}</span>
                  <span className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-ink-shade">
                    {tool.en}
                  </span>
                </h3>
                <p className="text-ink-shade leading-relaxed">{isZh ? tool.descZh : tool.descEn}</p>
              </SketchBorder>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      <section>
        <RevealOnScroll>
          <h2 className="mb-10 text-center font-masthead text-[var(--fs-h2)] font-medium">
            {dict.about.influences}
          </h2>
        </RevealOnScroll>
        <div className="mx-auto grid max-w-2xl gap-10">
          {influences.map((q, i) => (
            <RevealOnScroll key={q.attr} yFrom={20} delay={i * 0.05}>
              <blockquote
                className={[
                  "text-center",
                  i > 0 ? "border-t border-ink-bleed pt-8" : "",
                ].join(" ")}
              >
                <p
                  className="mb-4 leading-relaxed text-ink-warm"
                  style={{
                    fontFamily: "var(--font-display-script)",
                    fontSize: "clamp(1.5rem, 3vw, 2rem)",
                  }}
                >
                  {isZh ? q.quoteZh : q.quoteEn}
                </p>
                <footer className="font-mono text-[var(--fs-caption)] uppercase tracking-[0.18em] text-ink-shade">
                  — {q.attr}
                </footer>
              </blockquote>
            </RevealOnScroll>
          ))}
        </div>
      </section>
    </main>
  );
}
