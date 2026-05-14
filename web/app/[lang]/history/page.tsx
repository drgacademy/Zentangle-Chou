import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getHistory } from "@/content/history";
import { PageShell } from "@/components/layout/PageShell";
import { ScrollInkReveal } from "@/components/motion/ScrollInkReveal";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const content = getHistory(lang as Locale);
  return { title: content.title };
}

export default async function HistoryPage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const content = getHistory(lang as Locale);

  return (
    <PageShell eyebrow={content.eyebrow} title={content.title} intro={content.intro}>
      <ol className="relative mt-12 md:mt-20 grid gap-12 max-w-3xl mx-auto">
        <span
          aria-hidden
          className="absolute left-[6px] md:left-[10px] top-2 bottom-2 w-px bg-ink-faint/60"
        />
        {content.timeline.map((entry, i) => (
          <ScrollInkReveal key={entry.year + entry.title} delay={i * 0.05}>
            <li className="relative pl-10 md:pl-14">
              <span
                aria-hidden
                className="absolute left-0 top-2 w-3 h-3 md:w-4 md:h-4 rounded-full bg-ink"
              />
              <p className="eyebrow">{entry.year}</p>
              <h3 className="mt-2 text-2xl md:text-3xl tracking-wide">{entry.title}</h3>
              <p className="mt-4 leading-relaxed text-ink-soft">{entry.body}</p>
            </li>
          </ScrollInkReveal>
        ))}
      </ol>

      <ScrollInkReveal>
        <figure className="my-24 md:my-32 text-center max-w-3xl mx-auto">
          <blockquote className="text-2xl md:text-4xl leading-[1.4] tracking-wide">
            “{content.pullQuote}”
          </blockquote>
          <figcaption className="mt-6 eyebrow">— {content.pullQuoteAttribution}</figcaption>
        </figure>
      </ScrollInkReveal>

      <ScrollInkReveal>
        <p className="max-w-3xl mx-auto text-lg leading-relaxed text-ink-soft">{content.closing}</p>
      </ScrollInkReveal>
    </PageShell>
  );
}
