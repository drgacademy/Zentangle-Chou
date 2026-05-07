import { notFound } from "next/navigation";
import Link from "next/link";
import { getDict, isLang, type Lang } from "@/lib/i18n";
import RevealOnScroll from "@/components/motion/RevealOnScroll";
import TangleCanvas from "@/components/tangle/TangleCanvas";
import { getArtworks } from "@/lib/sanity/queries";
import type { PatternSlug } from "@/lib/tangles/patterns";

export default async function PortfolioPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const dict = getDict(lang as Lang);
  const isZh = lang === "zh";

  const works = await getArtworks();

  return (
    <main className="mx-auto max-w-7xl px-6 pt-32 pb-24 text-ink">
      <RevealOnScroll>
        <header className="mb-16 text-center">
          <h1 className="mb-2 font-masthead text-[var(--fs-pull)] font-semibold">
            {dict.portfolio.title}
          </h1>
          <p className="text-ink-warm" style={{ fontFamily: "var(--font-display-script)", fontSize: "1.4rem" }}>
            {dict.portfolio.intro}
          </p>
        </header>
      </RevealOnScroll>

      <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
        {works.map((w, i) => (
          <RevealOnScroll key={w.id} yFrom={28} delay={i * 0.05}>
            <Link
              href={`/${lang}/portfolio/${w.slug}`}
              className="block rounded border border-ink-bleed bg-paper-rice p-5 transition hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(0,0,0,0.06)]"
            >
              <div className="mb-4 aspect-square overflow-hidden rounded-sm bg-paper-tile">
                <TangleCanvas
                  pattern={(w.pattern as PatternSlug) ?? "florz"}
                  mode="ambient"
                  seed={w.seed ?? `work-${w.slug}`}
                  size={360}
                  density={0.85}
                  jitter={1.2}
                  withScaffold
                />
              </div>
              <h3 className="flex items-baseline justify-between gap-2 m-0">
                <span className="font-masthead text-[1.15rem] font-medium">
                  {isZh ? w.titleZh : w.titleEn}
                </span>
                <span className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-ink-shade">
                  {isZh ? w.titleEn : w.titleZh}
                </span>
              </h3>
            </Link>
          </RevealOnScroll>
        ))}
      </div>
    </main>
  );
}
