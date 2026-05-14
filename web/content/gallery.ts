import type { Locale } from "@/lib/i18n/config";

export type Artwork = {
  slug: string;
  title: string;
  year: string;
  medium: string;
  note: string;
};

export type GalleryContent = {
  eyebrow: string;
  title: string;
  intro: string;
  artworks: Artwork[];
  placeholderNotice: string;
};

const sharedArtworks: Artwork[] = [
  {
    slug: "tile-001",
    title: "晨間第一筆 / First Stroke of Morning",
    year: "2024",
    medium: "Sakura Micron 01 on Italian cotton tile",
    note: "在窗邊喝完第一杯熱茶後完成。Crescent Moon + Printemps + Static。",
  },
  {
    slug: "tile-002",
    title: "雨日靜物 / Rain Day Still Life",
    year: "2024",
    medium: "Sakura Micron 01 + 2B graphite",
    note: "外面在下雨。我把雨聲留在 Tipple 的留白裡。",
  },
  {
    slug: "tile-003",
    title: "藤蔓 / Vines",
    year: "2025",
    medium: "Black tile, white gel pen + chalk",
    note: "在黑紙上練習 Mooka。第一次發現留白比落筆更耗心力。",
  },
  {
    slug: "tile-004",
    title: "九十度 / Ninety Degrees",
    year: "2025",
    medium: "Sakura Micron 01 on cream tile",
    note: "畫到一半我把紙轉了九十度，整張畫的呼吸都換了。",
  },
  {
    slug: "tile-005",
    title: "夜車 / Night Train",
    year: "2025",
    medium: "Sakura Micron 03 on cream tile",
    note: "在長途車上完成。Hollibaugh 互相穿插的長條，恰好像窗外的鐵軌。",
  },
  {
    slug: "tile-006",
    title: "留白 / Negative Space",
    year: "2025",
    medium: "Sakura Micron 01 on white tile",
    note: "刻意只畫一半。另一半的白，是給觀者站著休息的位置。",
  },
];

const zh: GalleryContent = {
  eyebrow: "作品 — Gallery",
  title: "Zentangle Zhou 的紙磚集",
  intro:
    "每一張紙磚都是一段不被打擾的時間。下列為作者個人作品集的紀錄，目前仍在持續累積中。",
  artworks: sharedArtworks,
  placeholderNotice:
    "圖檔尚未上傳；此處先以紙磚框與筆觸紋路示意。當作品照片補上後，會替換此處方塊。",
};

const en: GalleryContent = {
  eyebrow: "Gallery — Tiles",
  title: "A Stack of Quiet Tiles",
  intro:
    "Each tile is a stretch of uninterrupted time. What follows is a running record of the artist's personal series, still growing.",
  artworks: sharedArtworks,
  placeholderNotice:
    "Photographs are not yet uploaded; tiles below are rendered as inked frames as a placeholder. They will be replaced when scans arrive.",
};

export function getGallery(locale: Locale): GalleryContent {
  return locale === "en" ? en : zh;
}
