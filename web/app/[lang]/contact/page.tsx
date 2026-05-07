import { notFound } from "next/navigation";
import { getDict, isLang, type Lang } from "@/lib/i18n";
import RevealOnScroll from "@/components/motion/RevealOnScroll";
import SketchBorder from "@/components/motion/SketchBorder";

export default async function ContactPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const dict = getDict(lang as Lang);

  return (
    <main className="mx-auto max-w-3xl px-6 pt-32 pb-24 text-ink">
      <RevealOnScroll>
        <h1 className="mb-12 text-center font-masthead text-[var(--fs-pull)] font-semibold">
          {dict.contact.title}
        </h1>
      </RevealOnScroll>

      <RevealOnScroll yFrom={32}>
        <SketchBorder seed="contact" pad={48}>
          <div className="px-6 py-12 text-center">
            <p className="mb-10 font-masthead text-[var(--fs-h3)] font-medium leading-snug text-ink">
              {dict.contact.lede}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-ink px-7 py-3 text-paper-rice transition-transform hover:-translate-y-0.5"
              >
                Instagram →
              </a>
              <a
                href="mailto:hello@zentanglechou.com"
                className="rounded-full border-[1.5px] border-ink-bleed bg-transparent px-7 py-3 text-ink transition-transform hover:-translate-y-0.5 hover:bg-ink-bleed/40"
              >
                hello@zentanglechou.com
              </a>
            </div>
          </div>
        </SketchBorder>
      </RevealOnScroll>
    </main>
  );
}
