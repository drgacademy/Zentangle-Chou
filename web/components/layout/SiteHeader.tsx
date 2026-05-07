"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { t, type Dict, type Lang } from "@/lib/i18n";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeToggle from "./ThemeToggle";
import MotionToggle from "./MotionToggle";

export default function SiteHeader({ lang, dict }: { lang: Lang; dict: Dict }) {
  const pathname = usePathname();
  const isHome = pathname === `/${lang}`;

  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const transparent = isHome && !scrolled;

  const items = [
    { href: `/${lang}`, label: t(dict, "nav.home") },
    { href: `/${lang}/about`, label: t(dict, "nav.about") },
    { href: `/${lang}/portfolio`, label: t(dict, "nav.portfolio") },
    { href: `/${lang}/tangles`, label: t(dict, "nav.tangles") },
    { href: `/${lang}/process`, label: t(dict, "nav.process") },
    { href: `/${lang}/contact`, label: t(dict, "nav.contact") },
  ];

  return (
    <header
      className={[
        "fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-5 transition-[background-color,color,border-color] duration-500",
        transparent
          ? "bg-transparent text-paper-tile [&_a:hover]:text-white"
          : "bg-paper/85 backdrop-blur-md border-b border-ink-bleed text-ink",
      ].join(" ")}
    >
      <Link href={`/${lang}`} aria-label={t(dict, "site.title")} className="font-masthead text-[1.05rem] font-semibold tracking-[0.04em]">
        Zentangle Chou
      </Link>

      <nav aria-label="primary" className="hidden gap-6 font-mono text-[var(--fs-caption)] uppercase tracking-[0.2em] md:flex">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={[
              "transition-colors duration-300",
              transparent ? "text-paper-tile/75 hover:text-paper-tile" : "text-ink-shade hover:text-ink",
            ].join(" ")}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-2">
        <LanguageSwitcher lang={lang} />
        <ThemeToggle dark={transparent} />
        <MotionToggle dark={transparent} />
      </div>
    </header>
  );
}
