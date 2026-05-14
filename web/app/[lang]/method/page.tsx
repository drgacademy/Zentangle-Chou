import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getMethod } from "@/content/method";
import { PageShell } from "@/components/layout/PageShell";
import { ScrollInkReveal } from "@/components/motion/ScrollInkReveal";
import { InkStroke } from "@/components/motion/InkStroke";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const content = getMethod(lang as Locale);
  return { title: content.title };
}

const stepArt: Record<number, React.ReactNode> = {
  1: (
    <svg viewBox="0 0 100 100" className="w-full h-full text-ink">
      <InkStroke d="M 30 50 Q 50 30 70 50" duration={1.6} length={180} delay={0.2} />
      <InkStroke d="M 50 28 L 50 18" duration={0.8} length={20} delay={1.6} />
      <InkStroke d="M 42 22 L 58 22" duration={0.8} length={30} delay={1.9} />
    </svg>
  ),
  2: (
    <svg viewBox="0 0 100 100" className="w-full h-full text-ink">
      {[[20,20],[80,20],[20,80],[80,80]].map(([x,y],i)=>(
        <InkStroke key={i} d={`M ${x} ${y} L ${x} ${y}.1`} duration={0.5} length={6} delay={0.2 + i * 0.18} strokeWidth={3} />
      ))}
    </svg>
  ),
  3: (
    <svg viewBox="0 0 100 100" className="w-full h-full text-ink">
      <InkStroke d="M 20 20 Q 50 14 80 20" duration={1.4} length={170} delay={0.2} />
      <InkStroke d="M 80 20 Q 88 50 80 80" duration={1.4} length={170} delay={0.8} />
      <InkStroke d="M 80 80 Q 50 86 20 80" duration={1.4} length={170} delay={1.4} />
      <InkStroke d="M 20 80 Q 12 50 20 20" duration={1.4} length={170} delay={2.0} />
    </svg>
  ),
  4: (
    <svg viewBox="0 0 100 100" className="w-full h-full text-ink">
      <InkStroke d="M 22 26 C 35 40, 65 22, 78 40 S 50 70, 22 70" duration={2.4} length={280} delay={0.3} strokeWidth={1} />
    </svg>
  ),
  5: (
    <svg viewBox="0 0 100 100" className="w-full h-full text-ink">
      <InkStroke d="M 28 28 Q 40 18 52 28 Q 64 38 76 28" duration={1.4} length={180} delay={0.3} />
      <InkStroke d="M 28 28 Q 40 14 52 28 Q 64 42 76 28" duration={1.4} length={180} delay={0.6} />
      {Array.from({length: 6}).map((_,i)=>(
        <InkStroke key={i} d={`M ${30 + i * 8} 60 L ${34 + i * 8} 50 L ${38 + i * 8} 60`} duration={0.8} length={40} delay={1.0 + i * 0.1} />
      ))}
      <InkStroke d="M 30 80 m -3 0 a 3 3 0 1 0 6 0 a 3 3 0 1 0 -6 0" duration={0.6} length={40} delay={1.8} />
      <InkStroke d="M 60 76 m -4 0 a 4 4 0 1 0 8 0 a 4 4 0 1 0 -8 0" duration={0.6} length={50} delay={2.0} />
      <InkStroke d="M 76 82 m -2 0 a 2 2 0 1 0 4 0 a 2 2 0 1 0 -4 0" duration={0.6} length={30} delay={2.2} />
    </svg>
  ),
  6: (
    <svg viewBox="0 0 100 100" className="w-full h-full text-ink">
      <defs>
        <linearGradient id="shade" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.4" />
        </linearGradient>
      </defs>
      <InkStroke d="M 20 50 Q 50 18 80 50 Q 50 82 20 50 Z" duration={2} length={260} delay={0.2} />
      <ellipse cx="50" cy="60" rx="28" ry="12" fill="url(#shade)" opacity="0.7" />
    </svg>
  ),
  7: (
    <svg viewBox="0 0 100 100" className="w-full h-full text-ink">
      <InkStroke d="M 30 60 L 30 40 L 36 50 L 42 40 L 42 60" duration={1.0} length={70} delay={0.3} />
      <InkStroke d="M 52 40 L 52 60 L 60 60 L 66 50 L 60 50" duration={1.0} length={70} delay={0.8} />
      <InkStroke d="M 30 70 L 70 70" duration={0.8} length={50} delay={1.4} />
    </svg>
  ),
  8: (
    <svg viewBox="0 0 100 100" className="w-full h-full text-ink">
      <InkStroke d="M 50 50 m -32 0 a 32 32 0 1 0 64 0 a 32 32 0 1 0 -64 0" duration={2.4} length={260} delay={0.2} />
      <InkStroke d="M 50 50 m -22 0 a 22 22 0 1 0 44 0 a 22 22 0 1 0 -44 0" duration={2.0} length={200} delay={0.8} />
      <InkStroke d="M 50 50 m -12 0 a 12 12 0 1 0 24 0 a 12 12 0 1 0 -24 0" duration={1.6} length={140} delay={1.4} />
    </svg>
  ),
};

export default async function MethodPage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const content = getMethod(lang as Locale);

  return (
    <PageShell eyebrow={content.eyebrow} title={content.title} intro={content.intro}>
      <ol className="mt-12 grid gap-16 md:gap-24">
        {content.steps.map((step, i) => (
          <ScrollInkReveal key={step.index} delay={0.05}>
            <li
              className={
                "grid gap-8 md:gap-16 items-center " +
                (i % 2 === 0 ? "md:grid-cols-[1fr_360px]" : "md:grid-cols-[360px_1fr] md:[direction:rtl] md:[&>*]:[direction:ltr]")
              }
            >
              <div>
                <p className="eyebrow">Step {String(step.index).padStart(2, "0")}</p>
                <h3 className="mt-2 text-3xl md:text-5xl tracking-wide">{step.name}</h3>
                <p className="mt-6 leading-relaxed text-ink-soft text-lg max-w-xl">{step.body}</p>
              </div>
              <div className="glass glass-sweep aspect-square p-4">{stepArt[step.index]}</div>
            </li>
          </ScrollInkReveal>
        ))}
      </ol>

      <ScrollInkReveal>
        <section className="mt-24 md:mt-32 max-w-3xl">
          <div className="glass glass-sweep p-10 md:p-12">
            <p className="eyebrow">{content.tools.title}</p>
            <ul className="mt-6 grid gap-3 text-lg text-ink-soft">
              {content.tools.items.map((t) => (
                <li key={t} className="flex gap-3">
                  <span className="text-ink-mute select-none">·</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </ScrollInkReveal>

      <ScrollInkReveal>
        <p className="mt-20 max-w-3xl text-lg leading-relaxed text-ink-soft">{content.closing}</p>
      </ScrollInkReveal>
    </PageShell>
  );
}
