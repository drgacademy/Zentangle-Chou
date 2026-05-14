import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getVideos } from "@/content/videos";
import { PageShell } from "@/components/layout/PageShell";
import { ScrollInkReveal } from "@/components/motion/ScrollInkReveal";
import { InkStroke } from "@/components/motion/InkStroke";
import { getDictionary } from "@/lib/i18n/dictionaries";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const content = getVideos(lang as Locale);
  return { title: content.title };
}

export default async function VideosPage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale = lang as Locale;
  const content = getVideos(locale);
  const dict = getDictionary(locale);

  return (
    <PageShell eyebrow={content.eyebrow} title={content.title} intro={content.intro}>
      <p className="mt-2 max-w-3xl text-sm text-ink-mute">{content.placeholderNotice}</p>

      <div className="mt-16 grid gap-12 md:grid-cols-2">
        {content.videos.map((v, i) => (
          <ScrollInkReveal key={v.slug} delay={i * 0.06}>
            <article className="group">
              <div className="tile-frame paper-grain aspect-video relative flex items-center justify-center">
                <svg viewBox="0 0 200 100" className="absolute inset-0 w-full h-full text-ink">
                  <InkStroke
                    d={`M 10 50 Q 50 ${20 + i * 6} 100 50 T 190 50`}
                    duration={2.8}
                    length={320}
                    delay={0.3}
                  />
                </svg>
                <span className="relative inline-flex items-center justify-center w-16 h-16 rounded-full border border-ink/40 bg-paper-soft/90 backdrop-blur-sm transition-transform group-hover:scale-105">
                  <svg width="18" height="20" viewBox="0 0 18 20" className="ml-1" aria-hidden>
                    <path d="M 0 0 L 18 10 L 0 20 Z" fill="currentColor" />
                  </svg>
                </span>
                <span className="absolute bottom-3 right-4 text-xs text-ink-mute font-mono tracking-wider">
                  {v.duration}
                </span>
              </div>
              <p className="mt-4 text-[10px] uppercase tracking-[0.32em] text-ink-mute">
                {v.pattern}
              </p>
              <h3 className="mt-2 text-xl md:text-2xl tracking-wide">{v.title}</h3>
              <p className="mt-3 text-ink-soft leading-relaxed">{v.note}</p>
              <p className="mt-3 text-xs text-ink-faint">{dict.common.comingSoon}</p>
            </article>
          </ScrollInkReveal>
        ))}
      </div>
    </PageShell>
  );
}
