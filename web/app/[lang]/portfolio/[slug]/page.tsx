import { notFound } from "next/navigation";
import Link from "next/link";
import { getDict, isLang, type Lang } from "@/lib/i18n";
import { getArtworkBySlug, getArtworks } from "@/lib/sanity/queries";
import TangleCanvas from "@/components/tangle/TangleCanvas";
import RevealOnScroll from "@/components/motion/RevealOnScroll";
import type { PatternSlug } from "@/lib/tangles/patterns";

export async function generateStaticParams() {
  const works = await getArtworks();
  return works.flatMap((w) => [
    { lang: "zh", slug: w.slug },
    { lang: "en", slug: w.slug },
  ]);
}

export default async function ArtworkPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  if (!isLang(lang)) notFound();
  const dict = getDict(lang as Lang);
  const work = await getArtworkBySlug(slug);
  if (!work) notFound();
  const isZh = lang === "zh";

  return (
    <main className="mx-auto max-w-5xl px-6 pt-32 pb-24 text-ink">
      <RevealOnScroll>
        <Link href={`/${lang}/portfolio`} className="font-mono text-[var(--fs-caption)] uppercase tracking-[0.2em] text-ink-shade hover:text-ink">
          ← {dict.portfolio.title}
        </Link>
      </RevealOnScroll>

      <RevealOnScroll yFrom={32}>
        <div className="mt-8 grid gap-12 md:grid-cols-[3fr_2fr]">
          <div className="aspect-square overflow-hidden rounded-sm bg-paper-tile">
            <TangleCanvas
              pattern={(work.pattern as PatternSlug) ?? "florz"}
              mode="ambient"
              seed={work.seed ?? `detail-${work.slug}`}
              size={720}
              density={1}
              jitter={1.4}
              withScaffold
            />
          </div>
          <div>
            <h1 className="mb-3 font-masthead text-[var(--fs-h2)] font-semibold leading-tight">
              {isZh ? work.titleZh : work.titleEn}
            </h1>
            <p className="mb-6 font-mono text-[var(--fs-caption)] uppercase tracking-[0.2em] text-ink-shade">
              {isZh ? work.titleEn : work.titleZh}
            </p>
            {work.descriptionZh && (
              <p className="leading-relaxed text-ink-shade">
                {isZh ? work.descriptionZh : work.descriptionEn}
              </p>
            )}
          </div>
        </div>
      </RevealOnScroll>
    </main>
  );
}
