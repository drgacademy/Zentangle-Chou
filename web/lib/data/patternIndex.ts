import type { PatternSlug } from "@/lib/tangles/patterns";

export type PatternCard = {
  slug: PatternSlug;
  nameZh: string;
  nameEn: string;
  origin: string;
};

export const patternCards: PatternCard[] = [
  { slug: "hollibaugh", nameZh: "立體編帶", nameEn: "Hollibaugh", origin: "Maria Thomas" },
  { slug: "paradox", nameZh: "矛盾螺旋", nameEn: "Paradox", origin: "Rick Roberts" },
  { slug: "printemps", nameZh: "春之螺", nameEn: "Printemps", origin: "Maria Thomas" },
  { slug: "nzeppel", nameZh: "鏈環", nameEn: "'Nzeppel", origin: "Maria Thomas" },
  { slug: "crescent-moon", nameZh: "彎月", nameEn: "Crescent Moon", origin: "Maria Thomas" },
  { slug: "florz", nameZh: "花瓣", nameEn: "Florz", origin: "Maria Thomas" },
  { slug: "tipple", nameZh: "點點", nameEn: "Tipple", origin: "Maria Thomas" },
];
