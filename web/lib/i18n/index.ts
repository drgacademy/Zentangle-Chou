import zh from "./zh.json";
import en from "./en.json";

export const LANGUAGES = ["zh", "en"] as const;
export const DEFAULT_LANG = "zh" as const;

export type Lang = (typeof LANGUAGES)[number];
export type Dict = typeof zh;

const DICTS: Record<Lang, Dict> = { zh, en: en as Dict };

export function isLang(value: string): value is Lang {
  return (LANGUAGES as readonly string[]).includes(value);
}

export function getDict(lang: Lang): Dict {
  return DICTS[lang];
}

/** dot-path lookup, e.g. t(dict, "footer.rights") */
export function t(dict: Dict | Record<string, unknown>, key: string): string {
  const parts = key.split(".");
  let cur: unknown = dict;
  for (const p of parts) {
    if (cur && typeof cur === "object" && p in (cur as Record<string, unknown>)) {
      cur = (cur as Record<string, unknown>)[p];
    } else {
      return key;
    }
  }
  return typeof cur === "string" ? cur : key;
}
