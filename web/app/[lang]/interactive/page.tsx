import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getPatterns } from "@/content/patterns";
import { PageShell } from "@/components/layout/PageShell";
import { ScrollInkReveal } from "@/components/motion/ScrollInkReveal";
import { PatternCard } from "@/components/tangle/PatternCard";
import { InkPad } from "@/components/interactive/InkPad";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const content = getPatterns(lang as Locale);
  return { title: content.title };
}

export default async function InteractivePage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale = lang as Locale;
  const content = getPatterns(locale);

  const padTitle = locale === "en" ? "An Ink Pad" : "練習板";
  const padBody =
    locale === "en"
      ? "Drag your cursor across the tile below. No undo button hurries you — there is one for when you want it, not for when you must."
      : "把游標當成自己的筆，在下方紙磚上隨意畫。沒有時間壓力，也沒有要交出去的作品。";

  return (
    <PageShell eyebrow={content.eyebrow} title={content.title} intro={content.intro}>
      <section className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {content.patterns.map((p, i) => (
          <ScrollInkReveal key={p.slug} delay={i * 0.04}>
            <PatternCard pattern={p} />
          </ScrollInkReveal>
        ))}
      </section>

      <div className="rule my-24" />

      <section className="grid gap-12 md:grid-cols-[1fr_1fr] items-start max-w-5xl mx-auto">
        <ScrollInkReveal>
          <p className="eyebrow">Practice</p>
          <h2 className="mt-3 text-3xl md:text-4xl tracking-wide">{padTitle}</h2>
          <p className="mt-6 leading-relaxed text-lg text-ink-soft">{padBody}</p>
          <ul className="mt-8 text-sm text-ink-mute space-y-2">
            <li>
              {locale === "en"
                ? "Tip: do not lift the pen mid-stroke — the line breathes more honestly that way."
                : "提示：一筆畫完之前不要抬筆，線條會更誠實。"}
            </li>
            <li>
              {locale === "en"
                ? "Tip: rotate the screen and try again. There is no up or down."
                : "提示：把螢幕轉九十度再試一次。沒有上下之分。"}
            </li>
          </ul>
        </ScrollInkReveal>
        <ScrollInkReveal delay={0.1}>
          <InkPad locale={locale} />
        </ScrollInkReveal>
      </section>
    </PageShell>
  );
}
