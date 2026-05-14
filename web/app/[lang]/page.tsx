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
      <section className="container-paper pt-20 md:pt-28 pb-24 md:pb-32">
        <div className="grid gap-12 md:grid-cols-[1.05fr_1fr] md:gap-20 items-center">
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
            <div className="mt-14 flex items-center gap-4 text-sm uppercase tracking-[0.32em]">
              <Link href={localePath(locale, "/method")} className="nav-link" data-active="true">
                {dict.nav.method}
              </Link>
              <span className="text-ink-faint">/</span>
              <Link href={localePath(locale, "/interactive")} className="nav-link">
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

      <section className="mt-12 md:mt-20">
        {home.sections.map((s, i) => (
          <SectionPreview key={s.slug} section={s} locale={locale} reverse={i % 2 === 1} />
        ))}
      </section>

      <section className="container-paper py-24 md:py-32 text-center">
        <ScrollInkReveal>
          <blockquote className="text-2xl md:text-4xl tracking-wide leading-[1.4] max-w-3xl mx-auto">
            “{home.closingQuote}”
          </blockquote>
          <p className="mt-6 eyebrow">— {home.closingAttribution}</p>
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
