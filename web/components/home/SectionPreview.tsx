import Link from "next/link";
import { ScrollInkReveal } from "@/components/motion/ScrollInkReveal";
import type { HomeSection } from "@/content/home";
import { cn, localePath } from "@/lib/utils";
import type { Locale } from "@/lib/i18n/config";

type Props = {
  section: HomeSection;
  locale: Locale;
  reverse?: boolean;
};

export function SectionPreview({ section, locale, reverse }: Props) {
  const href = localePath(locale, `/${section.slug}`);
  return (
    <ScrollInkReveal>
      <Link
        href={href}
        className={cn(
          "group block py-12 md:py-20 border-t border-ink-faint/40 transition-[background,color] duration-700 hover:bg-paper-soft",
          "first:border-t-0"
        )}
      >
        <div
          className={cn(
            "container-paper grid items-baseline gap-6 md:gap-12",
            "md:grid-cols-[80px_1fr_240px]",
            reverse && "md:[direction:rtl] md:[&>*]:[direction:ltr]"
          )}
        >
          <span className="font-serif text-2xl md:text-3xl text-ink-mute">{section.number}</span>
          <div>
            <p className="eyebrow mb-2">{section.eyebrow}</p>
            <h3 className="text-3xl md:text-5xl tracking-wide">{section.title}</h3>
            <p className="mt-4 max-w-xl text-ink-soft leading-relaxed">{section.body}</p>
          </div>
          <span className="flex items-center gap-2 text-sm uppercase tracking-[0.32em] text-ink-mute group-hover:text-ink transition-colors">
            <span>{section.cta}</span>
            <svg width="32" height="10" viewBox="0 0 32 10" aria-hidden>
              <path
                d="M 0 5 L 28 5 M 22 1 L 30 5 L 22 9"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
      </Link>
    </ScrollInkReveal>
  );
}
