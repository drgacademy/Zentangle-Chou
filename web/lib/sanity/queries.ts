import { getSanityClient } from "./client";

export type Artwork = {
  id: string;
  slug: string;
  titleZh: string;
  titleEn: string;
  descriptionZh?: string;
  descriptionEn?: string;
  pattern?: string;
  seed?: string;
};

export type Video = {
  id: string;
  titleZh: string;
  titleEn: string;
  url?: string;
};

const FALLBACK_ARTWORKS: Artwork[] = [
  { id: "fallback-1", slug: "early-spring", titleZh: "初春", titleEn: "Early Spring", pattern: "florz", seed: "work-spring", descriptionZh: "細雨初下，紙上慢慢長出花瓣。", descriptionEn: "Soft rain. A diamond grid grows on the paper." },
  { id: "fallback-2", slug: "night-rain", titleZh: "夜雨", titleEn: "Night Rain", pattern: "crescent-moon", seed: "work-rain", descriptionZh: "月光下，每一道弧線都是一個呼吸。", descriptionEn: "Under moonlight, each arc is a breath." },
  { id: "fallback-3", slug: "south-wind", titleZh: "南風", titleEn: "South Wind", pattern: "paradox", seed: "work-wind", descriptionZh: "風從南方來，旋轉成沒有盡頭的方框。", descriptionEn: "South wind, twisting into endless quadrilaterals." },
  { id: "fallback-4", slug: "morning", titleZh: "清晨", titleEn: "Morning", pattern: "tipple", seed: "work-morning", descriptionZh: "一千個小圓點是一千次靜心。", descriptionEn: "A thousand tiny circles, a thousand stillnesses." },
  { id: "fallback-5", slug: "deep-valley", titleZh: "深谷", titleEn: "Deep Valley", pattern: "hollibaugh", seed: "work-valley", descriptionZh: "編穿往返，越畫越深。", descriptionEn: "Weaving back and forth, deeper with every pass." },
  { id: "fallback-6", slug: "still-lake", titleZh: "靜湖", titleEn: "Still Lake", pattern: "printemps", seed: "work-lake", descriptionZh: "水面上的螺旋，浮著光。", descriptionEn: "Spirals on the water, holding light." },
  { id: "fallback-7", slug: "walking-zen", titleZh: "禪行", titleEn: "Walking Zen", pattern: "nzeppel", seed: "work-walking", descriptionZh: "一格一格走完一個下午。", descriptionEn: "Cell by cell, an entire afternoon walked through." },
  { id: "fallback-8", slug: "one-breath", titleZh: "一息", titleEn: "One Breath", pattern: "florz", seed: "work-breath" },
];

export async function getArtworks(): Promise<Artwork[]> {
  const client = getSanityClient();
  if (!client) return FALLBACK_ARTWORKS;
  try {
    const data = await client.fetch<Artwork[]>(`
      *[_type == "artwork"] | order(_createdAt desc) {
        "id": _id,
        "slug": slug.current,
        "titleZh": titleZh,
        "titleEn": titleEn,
        "descriptionZh": descriptionZh,
        "descriptionEn": descriptionEn,
        "pattern": pattern,
        "seed": seed
      }
    `);
    return data && data.length > 0 ? data : FALLBACK_ARTWORKS;
  } catch {
    return FALLBACK_ARTWORKS;
  }
}

export async function getArtworkBySlug(slug: string): Promise<Artwork | null> {
  const all = await getArtworks();
  return all.find((w) => w.slug === slug) ?? null;
}

export async function getVideos(): Promise<Video[]> {
  const client = getSanityClient();
  if (!client) return [];
  try {
    const data = await client.fetch<Video[]>(`
      *[_type == "video"] | order(_createdAt desc) {
        "id": _id,
        "titleZh": titleZh,
        "titleEn": titleEn,
        "url": url
      }
    `);
    return data || [];
  } catch {
    return [];
  }
}
