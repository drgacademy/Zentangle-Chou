import { notFound } from "next/navigation";
import { getDict, isLang, type Lang } from "@/lib/i18n";
import RevealOnScroll from "@/components/motion/RevealOnScroll";
import SceneEightBreaths from "@/components/home/SceneEightBreaths";

export default async function ProcessPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const dict = getDict(lang as Lang);
  const isZh = lang === "zh";

  return (
    <main className="text-ink pt-24">
      <RevealOnScroll>
        <header className="mx-auto max-w-3xl px-6 py-12 text-center">
          <h1 className="mb-2 font-masthead text-[var(--fs-pull)] font-semibold">
            {dict.eightBreaths.title}
          </h1>
          <p className="text-ink-warm" style={{ fontFamily: "var(--font-display-script)", fontSize: "1.5rem" }}>
            {dict.eightBreaths.subtitle}
          </p>
        </header>
      </RevealOnScroll>

      <SceneEightBreaths dict={dict} />

      <RevealOnScroll>
        <footer className="mx-auto max-w-3xl px-6 py-24 text-center">
          <blockquote
            className="m-0 text-ink-warm"
            style={{
              fontFamily: "var(--font-display-script)",
              fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
            }}
          >
            {isZh ? "一筆一畫，找回安靜。" : "One stroke, one breath. Stillness returned."}
          </blockquote>
        </footer>
      </RevealOnScroll>
    </main>
  );
}
