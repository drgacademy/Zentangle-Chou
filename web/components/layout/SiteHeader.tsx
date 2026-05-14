"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import { cn, localePath } from "@/lib/utils";

type Props = {
  locale: Locale;
};

export function SiteHeader({ locale }: Props) {
  const dict = getDictionary(locale);
  const pathname = usePathname() ?? "/";
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const nav = [
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
    <header
      className={cn(
        "sticky top-0 z-50 transition-[background,backdrop-filter,border-color] duration-500",
        scrolled
          ? "bg-paper/85 backdrop-blur-md border-b border-ink-faint/40"
          : "bg-transparent border-b border-transparent"
      )}
    >
      <div className="container-paper flex items-center justify-between py-5">
        <Link
          href={localePath(locale, "/")}
          className="flex items-center gap-3 group"
          aria-label={dict.common.brand}
        >
          <svg width="32" height="32" viewBox="0 0 32 32" aria-hidden className="text-ink">
            <circle cx="16" cy="16" r="14" fill="none" stroke="currentColor" strokeWidth="1" />
            <path
              d="M 6 22 C 12 8, 20 8, 26 22"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
            <circle cx="16" cy="16" r="2" fill="currentColor" />
          </svg>
          <span className="flex flex-col leading-tight">
            <span className="text-base tracking-[0.18em] uppercase">{dict.common.brand}</span>
            <span className="text-[10px] uppercase tracking-[0.36em] text-ink-mute">
              {locale === "zh" ? "禪繞畫的安靜時刻" : "A quiet zentangle space"}
            </span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-7 text-sm" aria-label="Primary">
          {nav.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className="nav-link"
                data-active={active}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
          <LanguageSwitcher currentLocale={locale} />
        </nav>

        <div className="flex items-center gap-4 lg:hidden">
          <LanguageSwitcher currentLocale={locale} />
          <button
            type="button"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
            className="flex flex-col gap-[5px] py-2 px-1"
          >
            <span
              className={cn(
                "block w-6 h-px bg-ink transition-transform origin-center",
                open && "translate-y-[6px] rotate-45"
              )}
            />
            <span
              className={cn("block w-6 h-px bg-ink transition-opacity", open && "opacity-0")}
            />
            <span
              className={cn(
                "block w-6 h-px bg-ink transition-transform origin-center",
                open && "-translate-y-[6px] -rotate-45"
              )}
            />
          </button>
        </div>
      </div>

      <div
        id="mobile-nav"
        className={cn(
          "lg:hidden overflow-hidden border-t border-ink-faint/30 transition-[max-height,opacity] duration-500",
          open ? "max-h-[80vh] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <nav className="container-paper py-6 grid gap-4 text-lg" aria-label="Primary mobile">
          {nav.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className="nav-link block"
                data-active={active}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
