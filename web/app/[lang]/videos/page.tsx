import { notFound } from "next/navigation";
import { getDict, isLang, type Lang } from "@/lib/i18n";
import RevealOnScroll from "@/components/motion/RevealOnScroll";
import { getVideos } from "@/lib/sanity/queries";

export default async function VideosPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const dict = getDict(lang as Lang);
  const videos = await getVideos();
  const isZh = lang === "zh";

  return (
    <main className="mx-auto max-w-7xl px-6 pt-32 pb-24 text-ink">
      <RevealOnScroll>
        <h1 className="mb-16 text-center font-masthead text-[var(--fs-pull)] font-semibold">
          {dict.nav.videos}
        </h1>
      </RevealOnScroll>

      {videos.length === 0 ? (
        <RevealOnScroll>
          <p className="text-center text-ink-shade">
            {isZh ? "影片即將上線。" : "Videos coming soon."}
          </p>
        </RevealOnScroll>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
          {videos.map((v, i) => (
            <RevealOnScroll key={v.id} yFrom={28} delay={i * 0.05}>
              <article className="rounded border border-ink-bleed bg-paper-rice p-5">
                <h3 className="mb-2 font-masthead text-[1.15rem] font-medium">
                  {isZh ? v.titleZh : v.titleEn}
                </h3>
                {v.url && (
                  <a href={v.url} target="_blank" rel="noopener noreferrer" className="font-mono text-[var(--fs-caption)] uppercase tracking-[0.18em] text-ink-shade hover:text-ink">
                    {isZh ? "觀看" : "Watch"} →
                  </a>
                )}
              </article>
            </RevealOnScroll>
          ))}
        </div>
      )}
    </main>
  );
}
