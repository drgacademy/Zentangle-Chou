import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getMasters, type Master } from "@/content/masters";
import { PageShell } from "@/components/layout/PageShell";
import { ScrollInkReveal } from "@/components/motion/ScrollInkReveal";
import { HandDrawnFrame } from "@/components/motion/HandDrawnFrame";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const content = getMasters(lang as Locale);
  return { title: content.title };
}

function MasterRow({ master, large }: { master: Master; large?: boolean }) {
  return (
    <ScrollInkReveal>
      <article
        className={
          "grid gap-8 md:gap-12 items-start " +
          (large ? "md:grid-cols-[260px_1fr]" : "md:grid-cols-[180px_1fr]")
        }
      >
        <HandDrawnFrame ratio="tile" delay={0.2}>
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-[0.32em] text-ink-mute mb-2">Initials</p>
            <p className="font-serif text-4xl md:text-5xl tracking-[0.1em]">
              {master.name
                .split(/\s|\(/)
                .filter(Boolean)
                .map((p) => p[0])
                .slice(0, 2)
                .join("")
                .toUpperCase()}
            </p>
          </div>
        </HandDrawnFrame>
        <div>
          <p className="eyebrow">{master.role} · {master.era}</p>
          <h3 className={"mt-3 " + (large ? "text-3xl md:text-5xl" : "text-2xl md:text-3xl") + " tracking-wide"}>
            {master.name}
          </h3>
          <p className="mt-5 leading-relaxed text-ink-soft">{master.body}</p>
          {master.signaturePattern && (
            <p className="mt-4 text-sm text-ink-mute">
              <span className="eyebrow mr-2">Signature tangle</span>
              {master.signaturePattern}
            </p>
          )}
        </div>
      </article>
    </ScrollInkReveal>
  );
}

export default async function MastersPage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const content = getMasters(lang as Locale);

  return (
    <PageShell eyebrow={content.eyebrow} title={content.title} intro={content.intro}>
      <section className="mt-16 grid gap-20 max-w-4xl">
        {content.founders.map((m) => (
          <MasterRow key={m.slug} master={m} large />
        ))}
      </section>

      <div className="rule my-20" />

      <section className="grid gap-16 max-w-4xl">
        {content.voices.map((m) => (
          <MasterRow key={m.slug} master={m} />
        ))}
      </section>

      <ScrollInkReveal>
        <p className="mt-24 max-w-3xl text-lg leading-relaxed text-ink-soft">{content.closing}</p>
      </ScrollInkReveal>
    </PageShell>
  );
}
