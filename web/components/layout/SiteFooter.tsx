import Link from "next/link";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import { localePath } from "@/lib/utils";
import { InkBrushDivider } from "@/components/motion/InkBrushDivider";

type Props = {
  locale: Locale;
};

export function SiteFooter({ locale }: Props) {
  const dict = getDictionary(locale);
  const year = new Date().getFullYear();

  const links: { href: string; label: string }[] = [
    { href: localePath(locale, "/history"), label: dict.nav.history },
    { href: localePath(locale, "/masters"), label: dict.nav.masters },
    { href: localePath(locale, "/method"), label: dict.nav.method },
    { href: localePath(locale, "/mindset"), label: dict.nav.mindset },
    { href: localePath(locale, "/interactive"), label: dict.nav.interactive },
    { href: localePath(locale, "/gallery"), label: dict.nav.gallery },
    { href: localePath(locale, "/videos"), label: dict.nav.videos },
    { href: localePath(locale, "/about"), label: dict.nav.about },
  ];

  return (
    <footer className="mt-32">
      <div className="container-paper">
        <InkBrushDivider />
      </div>
      <div className="container-paper py-16 grid gap-10 md:grid-cols-[1fr_auto]">
        <div className="max-w-md space-y-3">
          <p className="eyebrow">Zentangle Zhou</p>
          <p className="text-lg leading-relaxed text-ink-soft">{dict.common.tagline}</p>
          <p className="text-sm text-ink-mute">{dict.footer.pseudonymNote}</p>
        </div>
        <nav className="grid grid-cols-2 gap-x-10 gap-y-2 text-sm" aria-label="Footer">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="nav-link">
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="container-paper pb-10 text-xs text-ink-mute flex flex-wrap justify-between gap-3">
        <span>© {year} Zentangle Zhou — {dict.footer.rights}.</span>
        <span>Zentangle® is a registered trademark of Zentangle, Inc.</span>
      </div>
    </footer>
  );
}
