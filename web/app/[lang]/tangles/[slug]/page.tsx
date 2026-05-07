import { notFound } from "next/navigation";
import Link from "next/link";
import { getDict, isLang, type Lang } from "@/lib/i18n";
import { patterns } from "@/lib/tangles/patterns";
import { patternCards } from "@/lib/data/patternIndex";
import TangleCanvas from "@/components/tangle/TangleCanvas";
import RevealOnScroll from "@/components/motion/RevealOnScroll";

export function generateStaticParams() {
  return patternCards.flatMap((c) => [
    { lang: "zh", slug: c.slug },
    { lang: "en", slug: c.slug },
  ]);
}

export default async function TangleDetail({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  if (!isLang(lang)) notFound();
  const dict = getDict(lang as Lang);
  const card = patternCards.find((c) => c.slug === slug);
  const pattern = patterns[slug];
  if (!card || !pattern) notFound();
  const isZh = lang === "zh";

  return (
    <main className="mx-auto max-w-5xl px-6 pt-32 pb-24 text-ink">
      <RevealOnScroll>
        <Link
          href={`/${lang}/tangles`}
          className="font-mono text-[var(--fs-caption)] uppercase tracking-[0.2em] text-ink-shade hover:text-ink"
        >
          ← {dict.patternIndex.title}
        </Link>
      </RevealOnScroll>

      <RevealOnScroll yFrom={32}>
        <header className="mt-8 mb-12">
          <h1 className="mb-2 font-masthead text-[var(--fs-pull)] font-semibold leading-tight">
            {card.nameZh}
            <span className="ml-3 font-mono text-[0.9rem] uppercase tracking-[0.18em] text-ink-shade">
              {card.nameEn}
            </span>
          </h1>
          <p className="text-ink-shade">
            {isZh ? "由" : "by"} {card.origin}
          </p>
        </header>
      </RevealOnScroll>

      <RevealOnScroll yFrom={28}>
        <div className="mb-12 aspect-square overflow-hidden rounded-sm bg-paper-tile">
          <TangleCanvas
            pattern={card.slug}
            mode="interactive"
            seed={`detail-${card.slug}`}
            size={720}
            density={1}
            jitter={1.4}
            withScaffold
          />
        </div>
      </RevealOnScroll>

      <RevealOnScroll>
        <h2 className="mb-6 font-masthead text-[var(--fs-h2)] font-medium">
          {isZh ? "步驟" : "Steps"}
        </h2>
        <ol className="m-0 grid gap-4 list-none p-0">
          {pattern.steps.map((step, i) => (
            <RevealOnScroll key={i} yFrom={20} delay={i * 0.05}>
              <li className="flex items-baseline gap-4 border-b border-ink-bleed pb-3">
                <span className="font-mono text-[1.1rem] text-ink-pencil min-w-[2rem]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="leading-relaxed text-ink">
                  {isZh ? step.labelZh : step.labelEn}
                </span>
              </li>
            </RevealOnScroll>
          ))}
        </ol>
      </RevealOnScroll>
    </main>
  );
}
