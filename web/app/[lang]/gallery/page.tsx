import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getGallery } from "@/content/gallery";
import { PageShell } from "@/components/layout/PageShell";
import { ScrollInkReveal } from "@/components/motion/ScrollInkReveal";
import { InkStroke } from "@/components/motion/InkStroke";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const content = getGallery(lang as Locale);
  return { title: content.title };
}

function TilePlaceholder({ seed }: { seed: number }) {
  const offset = (seed * 13) % 30;
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full text-ink">
      <InkStroke
        d={`M ${10 + offset / 2} 80 Q 50 ${10 + offset} 90 80`}
        duration={2.4}
        length={220}
        delay={0.2}
      />
      <InkStroke
        d={`M ${20 + offset / 3} 70 Q 50 ${30 + offset / 2} 80 70`}
        duration={2.2}
        length={200}
        delay={0.6}
      />
      <InkStroke
        d={`M ${30 - offset / 3} 60 Q 50 ${40 - offset / 2} 70 60`}
        duration={2}
        length={180}
        delay={1.0}
      />
      <InkStroke
        d={`M ${50} 90 m -3 0 a 3 3 0 1 0 6 0 a 3 3 0 1 0 -6 0`}
        duration={0.6}
        length={30}
        delay={1.6}
        strokeWidth={1}
      />
    </svg>
  );
}

export default async function GalleryPage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const content = getGallery(lang as Locale);

  return (
    <PageShell eyebrow={content.eyebrow} title={content.title} intro={content.intro}>
      <p className="mt-2 max-w-3xl text-sm text-ink-mute">{content.placeholderNotice}</p>

      <div className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {content.artworks.map((a, i) => (
          <ScrollInkReveal key={a.slug} delay={i * 0.06}>
            <figure className="group">
              <div className="tile-frame paper-grain aspect-square">
                <TilePlaceholder seed={i + 1} />
              </div>
              <figcaption className="mt-4">
                <p className="text-[10px] uppercase tracking-[0.32em] text-ink-mute">
                  {a.year} · {a.medium}
                </p>
                <h3 className="mt-2 text-xl tracking-wide">{a.title}</h3>
                <p className="mt-2 text-sm text-ink-soft leading-relaxed">{a.note}</p>
              </figcaption>
            </figure>
          </ScrollInkReveal>
        ))}
      </div>
    </PageShell>
  );
}
