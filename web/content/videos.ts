import type { Locale } from "@/lib/i18n/config";

export type Video = {
  slug: string;
  title: string;
  duration: string;
  pattern: string;
  note: string;
};

export type VideosContent = {
  eyebrow: string;
  title: string;
  intro: string;
  videos: Video[];
  placeholderNotice: string;
};

const sharedVideos: Video[] = [
  {
    slug: "v-crescent-moon",
    title: "Crescent Moon — 慢速示範",
    duration: "04:12",
    pattern: "Crescent Moon",
    note: "從第一個半月到第三層同心弧的完整筆順，背景音為窗外蟬聲。",
  },
  {
    slug: "v-printemps-spiral",
    title: "Printemps — 一個漩渦的呼吸",
    duration: "03:48",
    pattern: "Printemps",
    note: "鏡頭極近，僅露出筆尖與紙面。練習在繞圈時穩住手腕。",
  },
  {
    slug: "v-eight-steps",
    title: "八個步驟，一張完整紙磚",
    duration: "12:30",
    pattern: "綜合 / Mixed",
    note: "從感謝、角點、邊界、細繩、圖樣、陰影到簽名的全程紀錄。無人聲。",
  },
  {
    slug: "v-mooka-vines",
    title: "Mooka — 在黑紙上的白藤",
    duration: "06:05",
    pattern: "Mooka",
    note: "黑色紙磚配白色 gel pen 的反向練習，留白變成了暗，落筆變成了光。",
  },
];

const zh: VideosContent = {
  eyebrow: "影片 — Drawing Sessions",
  title: "作畫過程",
  intro:
    "我把作畫的整個過程拍下來，盡量不剪、不快轉、不配樂。希望你看的時候，能跟著一起把肩膀放下來。",
  videos: sharedVideos,
  placeholderNotice:
    "影片連結尚未上線；此處先以「靜止紙磚 + 一條墨線進場」作為佔位。檔案上傳後會替換此處。",
};

const en: VideosContent = {
  eyebrow: "Sessions — Drawing Process",
  title: "Drawing Sessions",
  intro:
    "I record the whole drawing process, without edits, without speed-ups, without music. Watch them and let your shoulders drop with mine.",
  videos: sharedVideos,
  placeholderNotice:
    "Videos are not yet published; each slot below previews with a still tile and a single ink line. Files will replace the placeholders soon.",
};

export function getVideos(locale: Locale): VideosContent {
  return locale === "en" ? en : zh;
}
