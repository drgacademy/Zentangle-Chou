"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, type Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

type Props = {
  currentLocale: Locale;
};

export function LanguageSwitcher({ currentLocale }: Props) {
  const pathname = usePathname() ?? "/";
  const segments = pathname.split("/").filter(Boolean);
  const rest = segments.slice(1).join("/");

  return (
    <div className="flex items-center gap-3 text-xs uppercase tracking-[0.32em]">
      {locales.map((loc, idx) => {
        const href = rest ? `/${loc}/${rest}` : `/${loc}`;
        const active = loc === currentLocale;
        return (
          <span key={loc} className="flex items-center gap-3">
            {idx > 0 && <span aria-hidden className="text-ink-faint">/</span>}
            <Link
              href={href}
              className={cn("nav-link", active && "text-ink")}
              data-active={active}
              aria-current={active ? "true" : undefined}
            >
              {loc === "zh" ? "中" : "EN"}
            </Link>
          </span>
        );
      })}
    </div>
  );
}
