import Link from "next/link";
import { ScrollInkReveal } from "@/components/motion/ScrollInkReveal";
import type { HomeSection } from "@/content/home";
import { cn, localePath } from "@/lib/utils";
import type { Locale } from "@/lib/i18n/config";

type Props = {
  section: HomeSection;
  locale: Locale;
};

export function SectionPreview({ section, locale }: Props) {
  const href = localePath(locale, `/${section.slug}`);
  return (
    <ScrollInkReveal>
      <Link
        href={href}
        className={cn(
          "glass-card glass-sweep block p-7 md:p-9 h-full",
          "group relative overflow-hidden"
        )}
      >
        <div className="flex items-baseline justify-between gap-4">
          <span className="font-serif text-2xl md:text-3xl text-ink-mute">
            {section.number}
          </span>
          <span className="eyebrow">{section.eyebrow}</span>
        </div>
        <h3 className="mt-5 text-2xl md:text-3xl tracking-wide leading-snug">
          {section.title}
        </h3>
        <p className="mt-4 text-ink-soft leading-relaxed">{section.body}</p>
        <span className="mt-8 flex items-center gap-3 text-xs uppercase tracking-[0.32em] text-ink-mute group-hover:text-ink transition-colors">
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
      </Link>
    </ScrollInkReveal>
  );
}
