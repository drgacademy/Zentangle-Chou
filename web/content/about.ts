import type { Locale } from "@/lib/i18n/config";

export type AboutContent = {
  eyebrow: string;
  title: string;
  penName: string;
  body: string[];
  practice: { label: string; value: string }[];
  pullQuote: string;
};

const zh: AboutContent = {
  eyebrow: "關於 — About",
  title: "Zentangle Zhou",
  penName: "化名 / Pen name",
  body: [
    "我以 Zentangle Zhou 之名，寫下與畫下這個網站上的每一張紙磚與每一段文字。本名隱於筆後；落在紙上的，才是更可靠的那一部分。",
    "我從一支 Sakura Micron 01 開始接觸禪繞畫。第一張紙磚畫得歪歪斜斜，但結束時我發現自己已經坐了五十分鐘——比任何冥想 App 都還久。從此我相信：一支筆是最便宜的禪堂。",
    "這個站之所以存在，是因為我希望被禪繞畫接住的那種「肩膀放下來」的感覺，也能被別人嚐到一點。如果你看完了某一頁、忘了滑手機，那就值得了。",
  ],
  practice: [
    { label: "目前累積紙磚", value: "300+" },
    { label: "最常用圖樣", value: "Crescent Moon / Mooka" },
    { label: "落筆時段", value: "週末清晨 6 – 8 時" },
    { label: "工具", value: "Micron 01・2B 鉛筆・義大利紙磚" },
  ],
  pullQuote: "一筆一畫，靜心成形。",
};

const en: AboutContent = {
  eyebrow: "About — The Author",
  title: "Zentangle Zhou",
  penName: "Pen name",
  body: [
    "Everything you read and see on this site — every tile, every line of writing — is published under the pen name Zentangle Zhou. The legal name stays behind the pen; what lands on paper is the more trustworthy part.",
    "I came to Zentangle through a single Sakura Micron 01. My first tile came out crooked, but by the end of it I realised I had been sitting for fifty minutes — longer than any meditation app had ever held me. From then on, I believed a pen is the cheapest meditation hall in the world.",
    "This site exists because I want the shoulder-dropping feeling that Zentangle gave me to reach someone else. If you finish a page here and forget about your phone for a while, that is enough.",
  ],
  practice: [
    { label: "Tiles drawn so far", value: "300+" },
    { label: "Most-used tangles", value: "Crescent Moon / Mooka" },
    { label: "Drawing window", value: "Weekend mornings 6 – 8 am" },
    { label: "Tools", value: "Micron 01 · 2B pencil · Italian tiles" },
  ],
  pullQuote: "One stroke at a time, a quiet mind takes shape.",
};

export function getAbout(locale: Locale): AboutContent {
  return locale === "en" ? en : zh;
}
