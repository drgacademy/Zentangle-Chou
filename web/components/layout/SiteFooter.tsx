import Link from "next/link";
import { t, type Dict, type Lang } from "@/lib/i18n";

export default function SiteFooter({ lang, dict }: { lang: Lang; dict: Dict }) {
  return (
    <footer className="relative z-10 border-t border-ink-bleed bg-paper px-6 pt-16 pb-12 text-ink mt-16">
      <div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-8">
        <div>
          <p className="font-masthead text-[1.1rem] tracking-[0.04em]">Zentangle Chou</p>
          <p className="mt-1 font-script text-ink-warm" style={{ fontFamily: "var(--font-display-script)" }}>
            {t(dict, "site.tagline")}
          </p>
        </div>
        <nav aria-label="footer" className="flex gap-6 font-mono text-[var(--fs-caption)] uppercase tracking-[0.2em] text-ink-shade">
          <Link href={`/${lang}/about`} className="hover:text-ink">{t(dict, "footer.about")}</Link>
          <Link href={`/${lang}/contact`} className="hover:text-ink">{t(dict, "footer.contact")}</Link>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-ink">
            {t(dict, "footer.instagram")}
          </a>
        </nav>
      </div>
      <p className="mx-auto mt-10 max-w-7xl text-center font-mono text-[var(--fs-caption)] uppercase tracking-[0.2em] text-ink-shade">
        {t(dict, "footer.rights")}
      </p>
    </footer>
  );
}
