"use client";

import { useEffect } from "react";
import type { Lang } from "@/lib/i18n";

export default function HtmlLang({ lang }: { lang: Lang }) {
  useEffect(() => {
    document.documentElement.lang = lang === "zh" ? "zh-Hant" : "en";
  }, [lang]);
  return null;
}
