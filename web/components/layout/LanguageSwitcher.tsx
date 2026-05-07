"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LANGUAGES, type Lang } from "@/lib/i18n";

export default function LanguageSwitcher({ lang }: { lang: Lang }) {
  const pathname = usePathname();
  return (
    <div className="flex items-center gap-1 font-mono text-[var(--fs-caption)] uppercase tracking-[0.18em]">
      {LANGUAGES.map((l) => {
        const target = pathname.replace(/^\/(zh|en)/, `/${l}`);
        return (
          <Link
            key={l}
            href={target || `/${l}`}
            aria-current={l === lang ? "page" : undefined}
            className={
              l === lang
                ? "px-1.5 underline underline-offset-4"
                : "px-1.5 opacity-60 hover:opacity-100"
            }
          >
            {l}
          </Link>
        );
      })}
    </div>
  );
}
