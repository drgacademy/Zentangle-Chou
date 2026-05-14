import type { Locale } from "@/lib/i18n/config";

export type HomeSection = {
  slug: "history" | "masters" | "method" | "mindset" | "gallery" | "videos" | "interactive" | "about";
  number: string;
  eyebrow: string;
  title: string;
  body: string;
  cta: string;
};

export type HomeContent = {
  heroEyebrow: string;
  heroTitle: string;
  heroLines: string[];
  heroFootnote: string;
  manifestoTitle: string;
  manifestoBody: string;
  sections: HomeSection[];
  closingQuote: string;
  closingAttribution: string;
};

const zh: HomeContent = {
  heroEyebrow: "Zentangle Zhou",
  heroTitle: "禪 ・ 繞 ・ 畫",
  heroLines: ["一筆，一畫，", "在小小一張紙磚上", "讓世界安靜一段時間。"],
  heroFootnote: "Zentangle® 是 Rick Roberts ＆ Maria Thomas 註冊之冥想繪畫方法。",
  manifestoTitle: "為什麼這個網站存在",
  manifestoBody:
    "禪繞畫教我們：在筆尖落下之前，先深呼吸；當筆畫歪了，就讓它成為下一個圖樣的起點。這個網站是一份慢慢走的入門指南——從歷史、名家、畫法、心法，到一個小小的互動體驗區。沒有廣告，沒有彈窗，希望你能讀久一點、忘了時間久一點。",
  sections: [
    {
      slug: "history",
      number: "01",
      eyebrow: "History",
      title: "歷史與由來",
      body: "從 2003 年的麻州小鎮到全球 40 國 — Zentangle 為什麼是禪。",
      cta: "進入歷史",
    },
    {
      slug: "masters",
      number: "02",
      eyebrow: "Masters",
      title: "名家與聲音",
      body: "Rick Roberts、Maria Thomas，以及把禪繞畫帶回自己語言裡的人。",
      cta: "認識名家",
    },
    {
      slug: "method",
      number: "03",
      eyebrow: "Method",
      title: "八個步驟",
      body: "從感謝、角點、邊界、細繩，到陰影與簽名——把一張紙磚走完。",
      cta: "看畫法",
    },
    {
      slug: "mindset",
      number: "04",
      eyebrow: "Mindset",
      title: "禪繞畫的心法",
      body: "六條練習原則，比任何技巧都更接近這套方法的核心。",
      cta: "讀心法",
    },
    {
      slug: "interactive",
      number: "05",
      eyebrow: "Interactive",
      title: "互動體驗",
      body: "圖樣字典與線上臨摹板——把游標當成自己的筆，試試看。",
      cta: "去體驗",
    },
    {
      slug: "gallery",
      number: "06",
      eyebrow: "Gallery",
      title: "作者作品",
      body: "Zentangle Zhou 的紙磚紀錄，每一張都帶著一段安靜的時間。",
      cta: "看作品",
    },
    {
      slug: "videos",
      number: "07",
      eyebrow: "Sessions",
      title: "作畫影片",
      body: "盡量不剪、不快轉、不配樂——希望你的肩膀也跟著放下來。",
      cta: "看影片",
    },
    {
      slug: "about",
      number: "08",
      eyebrow: "About",
      title: "關於作者",
      body: "為什麼以 Zentangle Zhou 為化名，以及一支 Micron 01 如何成為禪堂。",
      cta: "讀關於",
    },
  ],
  closingQuote: "Anything is possible, one stroke at a time.",
  closingAttribution: "Rick Roberts ＆ Maria Thomas",
};

const en: HomeContent = {
  heroEyebrow: "Zentangle Zhou",
  heroTitle: "Zen · Tangle · Draw",
  heroLines: [
    "One stroke, one line —",
    "on a small paper tile,",
    "let the world go quiet for a while.",
  ],
  heroFootnote: "Zentangle® is a meditative drawing method founded by Rick Roberts & Maria Thomas.",
  manifestoTitle: "Why this site exists",
  manifestoBody:
    "Zentangle teaches us: breathe before the pen lands; when a line wanders, let it begin the next tangle. This site is a slow walking guide — through history, masters, method, mindset, and a small interactive practice space. No ads, no popups. I hope you stay longer than you planned.",
  sections: [
    {
      slug: "history",
      number: "01",
      eyebrow: "History",
      title: "Origin & timeline",
      body: "From a small Massachusetts town in 2003 to forty countries — why Zentangle earns the word zen.",
      cta: "Enter history",
    },
    {
      slug: "masters",
      number: "02",
      eyebrow: "Masters",
      title: "Founders & voices",
      body: "Rick Roberts, Maria Thomas, and the people who carried the method back into their own languages.",
      cta: "Meet the masters",
    },
    {
      slug: "method",
      number: "03",
      eyebrow: "Method",
      title: "The eight steps",
      body: "From gratitude, corner dots, border, string — to shading and signature. Walk one tile from start to end.",
      cta: "See the method",
    },
    {
      slug: "mindset",
      number: "04",
      eyebrow: "Mindset",
      title: "How Zentangle thinks",
      body: "Six principles that are closer to the heart of the practice than any technique.",
      cta: "Read the mindset",
    },
    {
      slug: "interactive",
      number: "05",
      eyebrow: "Interactive",
      title: "A small practice space",
      body: "A pattern library and an online tracing pad — let your cursor be your pen.",
      cta: "Try it",
    },
    {
      slug: "gallery",
      number: "06",
      eyebrow: "Gallery",
      title: "Author's tiles",
      body: "A running record of Zentangle Zhou's tiles. Each one carries a stretch of quiet time.",
      cta: "View tiles",
    },
    {
      slug: "videos",
      number: "07",
      eyebrow: "Sessions",
      title: "Drawing sessions",
      body: "Unedited, unmusicked, untimelapsed — so your shoulders drop with mine.",
      cta: "Watch sessions",
    },
    {
      slug: "about",
      number: "08",
      eyebrow: "About",
      title: "About the author",
      body: "Why the pen name Zentangle Zhou — and how a single Micron 01 became a meditation hall.",
      cta: "Read about",
    },
  ],
  closingQuote: "Anything is possible, one stroke at a time.",
  closingAttribution: "Rick Roberts & Maria Thomas",
};

export function getHome(locale: Locale): HomeContent {
  return locale === "en" ? en : zh;
}
