import type { Locale } from "./config";

type Nav = {
  home: string;
  history: string;
  masters: string;
  method: string;
  mindset: string;
  gallery: string;
  videos: string;
  interactive: string;
  about: string;
};

type Common = {
  brand: string;
  tagline: string;
  scroll: string;
  readMore: string;
  comingSoon: string;
  back: string;
};

type Footer = {
  rights: string;
  pseudonymNote: string;
};

export type Dictionary = {
  nav: Nav;
  common: Common;
  footer: Footer;
};

const zh: Dictionary = {
  nav: {
    home: "首頁",
    history: "歷史",
    masters: "名家",
    method: "畫法",
    mindset: "心法",
    gallery: "作品",
    videos: "影片",
    interactive: "互動",
    about: "關於",
  },
  common: {
    brand: "Zentangle Zhou",
    tagline: "一筆一畫，靜心成形",
    scroll: "向下捲動",
    readMore: "繼續閱讀",
    comingSoon: "即將推出",
    back: "返回",
  },
  footer: {
    rights: "保留所有權利",
    pseudonymNote: "本站作者以 Zentangle Zhou 之名發表所有作品與文章。",
  },
};

const en: Dictionary = {
  nav: {
    home: "Home",
    history: "History",
    masters: "Masters",
    method: "Method",
    mindset: "Mindset",
    gallery: "Gallery",
    videos: "Videos",
    interactive: "Interactive",
    about: "About",
  },
  common: {
    brand: "Zentangle Zhou",
    tagline: "One stroke at a time, a quiet mind takes shape.",
    scroll: "Scroll",
    readMore: "Read more",
    comingSoon: "Coming soon",
    back: "Back",
  },
  footer: {
    rights: "All rights reserved",
    pseudonymNote: "Works and writings on this site are published under the pen name Zentangle Zhou.",
  },
};

export const dictionaries: Record<Locale, Dictionary> = { zh, en };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? zh;
}
