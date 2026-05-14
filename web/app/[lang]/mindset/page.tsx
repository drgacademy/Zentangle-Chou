import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getMindset } from "@/content/mindset";
import { PageShell } from "@/components/layout/PageShell";
import { ScrollInkReveal } from "@/components/motion/ScrollInkReveal";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const content = getMindset(lang as Locale);
  return { title: content.title };
}

export default async function MindsetPage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const content = getMindset(lang as Locale);

  return (
    <PageShell eyebrow={content.eyebrow} title={content.title} intro={content.intro}>
      <div className="mt-12 grid gap-10 md:grid-cols-2 md:gap-x-16 md:gap-y-16">
        {content.precepts.map((p, i) => (
          <ScrollInkReveal key={p.title} delay={i * 0.05}>
            <article className="relative pl-6 border-l border-ink-faint/60">
              <h3 className="text-2xl md:text-3xl tracking-wide leading-snug">{p.title}</h3>
              <p className="mt-5 leading-relaxed text-ink-soft">{p.body}</p>
            </article>
          </ScrollInkReveal>
        ))}
      </div>

      <ScrollInkReveal>
        <section className="relative mt-28 md:mt-36 max-w-3xl mx-auto">
          <div className="glass glass-sweep p-10 md:p-14">
            <p className="eyebrow">Meditation</p>
            <h2 className="mt-3 text-3xl md:text-4xl tracking-wide">
              {content.meditation.title}
            </h2>
            <p className="mt-6 leading-relaxed text-lg text-ink-soft">
              {content.meditation.body}
            </p>
          </div>
        </section>
      </ScrollInkReveal>

      <ScrollInkReveal>
        <p className="mt-20 max-w-3xl text-lg leading-relaxed text-ink-soft">{content.closing}</p>
      </ScrollInkReveal>
    </PageShell>
  );
}
