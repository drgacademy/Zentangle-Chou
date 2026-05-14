import type { Locale } from "@/lib/i18n/config";

export type PatternStep = {
  d: string;
  duration?: number;
};

export type Pattern = {
  slug: string;
  name: string;
  origin: string;
  description: string;
  difficulty: 1 | 2 | 3;
  steps: PatternStep[];
};

export type PatternsContent = {
  eyebrow: string;
  title: string;
  intro: string;
  patterns: Pattern[];
};

const sharedPatterns: Pattern[] = [
  {
    slug: "crescent-moon",
    name: "Crescent Moon",
    origin: "Maria Thomas",
    description: "弦月 — 沿邊界排列半月、每一個半月外圍以同心弧線回應。最常用的入門圖樣。",
    difficulty: 1,
    steps: [
      { d: "M 10 80 Q 30 30 50 80" },
      { d: "M 50 80 Q 70 30 90 80" },
      { d: "M 6 80 Q 30 22 54 80" },
      { d: "M 46 80 Q 70 22 94 80" },
      { d: "M 2 80 Q 30 14 58 80" },
      { d: "M 42 80 Q 70 14 98 80" },
    ],
  },
  {
    slug: "hollibaugh",
    name: "Hollibaugh",
    origin: "Rick Roberts",
    description: "互相穿插的長條，營造出「彼此覆蓋」的層次感。是禪繞畫第一個被命名的圖樣。",
    difficulty: 2,
    steps: [
      { d: "M 10 20 L 90 28" },
      { d: "M 10 36 L 90 44" },
      { d: "M 30 8 L 28 92" },
      { d: "M 50 8 L 52 92" },
      { d: "M 72 8 L 70 92" },
      { d: "M 10 60 L 90 68" },
      { d: "M 10 78 L 90 86" },
    ],
  },
  {
    slug: "printemps",
    name: "Printemps",
    origin: "Maria Thomas",
    description: "螺旋 — 從中心向外緩慢繞圈。每一個 printemps 都是一個小宇宙。",
    difficulty: 1,
    steps: [
      { d: "M 50 50 m -4 0 a 4 4 0 1 0 8 0 a 4 4 0 1 0 -8 0" },
      { d: "M 50 50 m -8 0 a 8 8 0 1 0 16 0 a 8 8 0 1 0 -16 0" },
      { d: "M 50 50 m -14 0 a 14 14 0 1 0 28 0 a 14 14 0 1 0 -28 0" },
      { d: "M 50 50 m -22 0 a 22 22 0 1 0 44 0 a 22 22 0 1 0 -44 0" },
      { d: "M 50 50 m -32 0 a 32 32 0 1 0 64 0 a 32 32 0 1 0 -64 0" },
    ],
  },
  {
    slug: "static",
    name: "Static",
    origin: "Zentangle HQ",
    description: "閃電狀的銳角線，在區塊間製造高頻能量。常用作對比柔線的襯底。",
    difficulty: 2,
    steps: [
      { d: "M 10 50 L 20 20 L 30 50 L 40 20 L 50 50 L 60 20 L 70 50 L 80 20 L 90 50" },
      { d: "M 10 70 L 20 40 L 30 70 L 40 40 L 50 70 L 60 40 L 70 70 L 80 40 L 90 70" },
      { d: "M 10 30 L 20 60 L 30 30 L 40 60 L 50 30 L 60 60 L 70 30 L 80 60 L 90 30" },
    ],
  },
  {
    slug: "tipple",
    name: "Tipple",
    origin: "Zentangle HQ",
    description: "由大大小小的圓點密集堆疊，是「填滿」與「呼吸」之間最自由的圖樣。",
    difficulty: 1,
    steps: [
      { d: "M 30 30 m -3 0 a 3 3 0 1 0 6 0 a 3 3 0 1 0 -6 0" },
      { d: "M 60 40 m -5 0 a 5 5 0 1 0 10 0 a 5 5 0 1 0 -10 0" },
      { d: "M 40 60 m -4 0 a 4 4 0 1 0 8 0 a 4 4 0 1 0 -8 0" },
      { d: "M 70 70 m -3 0 a 3 3 0 1 0 6 0 a 3 3 0 1 0 -6 0" },
      { d: "M 25 65 m -2 0 a 2 2 0 1 0 4 0 a 2 2 0 1 0 -4 0" },
      { d: "M 80 30 m -4 0 a 4 4 0 1 0 8 0 a 4 4 0 1 0 -8 0" },
      { d: "M 55 75 m -3 0 a 3 3 0 1 0 6 0 a 3 3 0 1 0 -6 0" },
    ],
  },
  {
    slug: "mooka",
    name: "Mooka",
    origin: "Maria Thomas",
    description: "藤蔓般生長的有機曲線，每一個 Mooka 都從一個點開始，繞回自己。",
    difficulty: 3,
    steps: [
      { d: "M 50 80 C 50 60 30 60 30 40 C 30 25 45 25 50 40" },
      { d: "M 50 80 C 50 60 70 60 70 40 C 70 25 55 25 50 40" },
      { d: "M 50 80 C 50 70 40 70 40 50" },
      { d: "M 50 80 C 50 70 60 70 60 50" },
      { d: "M 50 80 L 50 92" },
    ],
  },
];

const zh: PatternsContent = {
  eyebrow: "圖樣 — Patterns",
  title: "禪繞畫圖樣字典",
  intro: "經典圖樣的筆順示範。把游標移到圖樣上，會自上而下重新示範一次。",
  patterns: sharedPatterns,
};

const en: PatternsContent = {
  eyebrow: "Tangles — Pattern Library",
  title: "A Pocket Dictionary of Tangles",
  intro: "Stroke-order demonstrations of the classics. Hover any pattern to watch it being drawn again.",
  patterns: sharedPatterns,
};

export function getPatterns(locale: Locale): PatternsContent {
  return locale === "en" ? en : zh;
}
