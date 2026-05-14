import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getAbout } from "@/content/about";
import { PageShell } from "@/components/layout/PageShell";
import { ScrollInkReveal } from "@/components/motion/ScrollInkReveal";
import { HandDrawnFrame } from "@/components/motion/HandDrawnFrame";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const content = getAbout(lang as Locale);
  return { title: content.title };
}

export default async function AboutPage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const content = getAbout(lang as Locale);

  return (
    <PageShell eyebrow={content.eyebrow} title={content.title}>
      <div className="grid gap-16 md:gap-20 md:grid-cols-[300px_1fr] items-start max-w-5xl">
        <ScrollInkReveal>
          <HandDrawnFrame ratio="tile">
            <div className="text-center">
              <p className="eyebrow mb-3">{content.penName}</p>
              <p className="font-serif text-5xl md:text-6xl tracking-[0.08em]">ZZ</p>
              <p className="mt-4 text-sm text-ink-mute">Zentangle Zhou</p>
            </div>
          </HandDrawnFrame>
        </ScrollInkReveal>

        <div className="space-y-8">
          {content.body.map((para, i) => (
            <ScrollInkReveal key={i} delay={i * 0.05}>
              <p className="text-lg leading-relaxed text-ink-soft">{para}</p>
            </ScrollInkReveal>
          ))}

          <ScrollInkReveal>
            <dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-ink-faint/60 pt-8">
              {content.practice.map((p) => (
                <div key={p.label}>
                  <dt className="eyebrow">{p.label}</dt>
                  <dd className="mt-2 text-lg">{p.value}</dd>
                </div>
              ))}
            </dl>
          </ScrollInkReveal>
        </div>
      </div>

      <ScrollInkReveal>
        <p className="mt-24 md:mt-32 text-center text-2xl md:text-4xl tracking-wide max-w-3xl mx-auto leading-[1.5]">
          “{content.pullQuote}”
        </p>
      </ScrollInkReveal>
    </PageShell>
  );
}
