import { notFound } from "next/navigation";
import Link from "next/link";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getHome } from "@/content/home";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localePath } from "@/lib/utils";
import { HeroTile } from "@/components/home/HeroTile";
import { SectionPreview } from "@/components/home/SectionPreview";
import { ScrollInkReveal } from "@/components/motion/ScrollInkReveal";
import { InkBrushDivider } from "@/components/motion/InkBrushDivider";
import { GlassOrb } from "@/components/glass/GlassOrb";

type Props = {
  params: Promise<{ lang: string }>;
};

export default async function HomePage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale = lang as Locale;
  const home = getHome(locale);
  const dict = getDictionary(locale);

  return (
    <>
      <section className="relative container-paper pt-20 md:pt-28 pb-24 md:pb-32 overflow-hidden">
        <GlassOrb
          size={420}
          hue="cool"
          className="-z-0 top-[8%] -left-[10%] md:left-[5%] opacity-80"
        />
        <GlassOrb
          size={300}
          hue="rouge"
          delay={4}
          className="-z-0 top-[55%] right-[-8%] md:right-[12%] opacity-70"
        />

        <div className="relative grid gap-12 md:grid-cols-[1.05fr_1fr] md:gap-20 items-center">
          <div>
            <p className="eyebrow">{home.heroEyebrow}</p>
            <h1 className="mt-6 text-[clamp(3rem,9vw,7rem)] leading-[0.95] tracking-[0.06em]">
              {home.heroTitle}
            </h1>
            <div className="mt-10 space-y-2 text-lg md:text-xl text-ink-soft max-w-md">
              {home.heroLines.map((line, i) => (
                <p
                  key={i}
                  className="opacity-0 animate-[fade-in_1s_ease_forwards]"
                  style={{ animationDelay: `${1.4 + i * 0.5}s` }}
                >
                  {line}
                </p>
              ))}
            </div>
            <p className="mt-12 text-xs text-ink-mute max-w-md">{home.heroFootnote}</p>
            <div className="mt-14 flex flex-wrap items-center gap-3">
              <Link
                href={localePath(locale, "/method")}
                className="glass-pill text-sm uppercase tracking-[0.28em]"
              >
                <span aria-hidden className="w-1 h-1 rounded-full bg-ink" />
                {dict.nav.method}
              </Link>
              <Link
                href={localePath(locale, "/interactive")}
                className="glass-pill text-sm uppercase tracking-[0.28em] text-ink-mute hover:text-ink"
              >
                {dict.nav.interactive}
              </Link>
            </div>
          </div>
          <HeroTile className="max-w-md md:max-w-none md:ml-auto" />
        </div>
      </section>

      <div className="container-paper">
        <InkBrushDivider />
      </div>

      <section className="container-paper pt-24 pb-20 max-w-3xl mx-auto">
        <ScrollInkReveal>
          <p className="eyebrow">Manifesto</p>
          <h2 className="mt-4 text-3xl md:text-4xl tracking-wide">{home.manifestoTitle}</h2>
          <p className="mt-8 leading-relaxed text-lg text-ink-soft">{home.manifestoBody}</p>
        </ScrollInkReveal>
      </section>

      <section className="relative container-paper pb-20">
        <GlassOrb
          size={280}
          hue="neutral"
          delay={2}
          className="-z-0 top-[30%] -left-[5%] opacity-60 hidden md:block"
        />
        <GlassOrb
          size={240}
          hue="rouge"
          delay={6}
          className="-z-0 bottom-[10%] right-[-4%] opacity-60 hidden md:block"
        />
        <div className="relative grid gap-6 md:grid-cols-2 mt-8">
          {home.sections.map((s) => (
            <SectionPreview key={s.slug} section={s} locale={locale} />
          ))}
        </div>
      </section>

      <section className="relative container-paper py-24 md:py-32 text-center overflow-hidden">
        <GlassOrb
          size={520}
          hue="cool"
          className="-z-0 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-50"
        />
        <ScrollInkReveal>
          <blockquote className="relative text-2xl md:text-4xl tracking-wide leading-[1.4] max-w-3xl mx-auto">
            “{home.closingQuote}”
          </blockquote>
          <p className="relative mt-6 eyebrow">— {home.closingAttribution}</p>
        </ScrollInkReveal>
      </section>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
