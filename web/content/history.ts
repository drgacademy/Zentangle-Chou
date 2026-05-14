import type { Locale } from "@/lib/i18n/config";

export type TimelineEntry = {
  year: string;
  title: string;
  body: string;
};

export type HistoryContent = {
  eyebrow: string;
  title: string;
  intro: string;
  timeline: TimelineEntry[];
  pullQuote: string;
  pullQuoteAttribution: string;
  closing: string;
};

const zh: HistoryContent = {
  eyebrow: "歷史 — Origin",
  title: "禪繞畫的起源",
  intro:
    "禪繞畫（Zentangle）誕生於二〇〇〇年代初期的美國麻州，由 Rick Roberts 與 Maria Thomas 共同發展。它將反覆繪製的小型圖樣，化為一種冥想練習：在一張 9 公分見方的小紙磚（Tile）上，一筆一畫，安住當下。",
  timeline: [
    {
      year: "2003",
      title: "靈感乍現",
      body:
        "書法藝術家 Maria Thomas 在繪製字母手抄稿時，描述自己「感到無比寧靜，彷彿世界都安靜下來」。前修士、企業家 Rick Roberts 聽見後說：『妳剛剛經歷的，就是冥想。』",
    },
    {
      year: "2004",
      title: "Zentangle® 命名",
      body:
        "Rick 與 Maria 將這套方法命名為 Zentangle，並以「任何人都能做、結果永遠美麗」為原則，發展出可教可學的八個步驟。",
    },
    {
      year: "2005",
      title: "第一塊紙磚",
      body:
        "他們選用 9 公分見方的義大利純棉紙磚（Tile），尺寸小到能在一坐之間完成，足以讓人專注完成，又不至於令人卻步。",
    },
    {
      year: "2006",
      title: "CZT 認證教師計畫",
      body:
        "首屆 Certified Zentangle Teacher (CZT) 認證課程舉行，至今全球已有超過 8,000 位認證教師，在 40 多個國家持續推廣這套靜心方法。",
    },
    {
      year: "今",
      title: "走向世界",
      body:
        "禪繞畫已被引入學校、醫院、安寧病房、企業培訓與正念課程。它不是純粹的繪畫，也不是純粹的冥想；它是一種以筆觸落定呼吸的儀式。",
    },
  ],
  pullQuote: "Anything is possible, one stroke at a time.",
  pullQuoteAttribution: "Rick Roberts ＆ Maria Thomas",
  closing:
    "在禪繞畫裡，沒有橡皮擦、沒有錯誤、沒有上下左右。每一筆都是當下的選擇，每一個轉折都通向下一個圖樣。",
};

const en: HistoryContent = {
  eyebrow: "History — Origin",
  title: "Where Zentangle Began",
  intro:
    "Zentangle was developed in the early 2000s in Massachusetts by Rick Roberts and Maria Thomas. It turns the slow, repeated drawing of small patterns into a meditative practice — one stroke at a time, on a 3.5-inch paper tile.",
  timeline: [
    {
      year: "2003",
      title: "The Spark",
      body:
        "While lettering a manuscript, calligrapher Maria Thomas described feeling \"completely at peace, as if everything else had quieted.\" Former monk and entrepreneur Rick Roberts replied: \"What you just experienced is meditation.\"",
    },
    {
      year: "2004",
      title: "Naming Zentangle®",
      body:
        "Rick and Maria named the method Zentangle, building it around a promise: anyone can do it, and the result is always beautiful. They distilled the practice into eight teachable steps.",
    },
    {
      year: "2005",
      title: "The First Tile",
      body:
        "They chose a 3.5-inch (about 9 cm) Italian cotton paper tile — small enough to finish in one sitting, large enough to invite deep focus, yet never overwhelming.",
    },
    {
      year: "2006",
      title: "The CZT Program",
      body:
        "The first Certified Zentangle Teacher (CZT) seminar was held. Today over 8,000 CZTs in more than 40 countries continue to teach the method worldwide.",
    },
    {
      year: "Today",
      title: "A Practice Without Borders",
      body:
        "Zentangle is now taught in classrooms, hospitals, hospice care, corporate training, and mindfulness programs. It is neither pure drawing nor pure meditation — it is a small ritual that anchors breath to ink.",
    },
  ],
  pullQuote: "Anything is possible, one stroke at a time.",
  pullQuoteAttribution: "Rick Roberts & Maria Thomas",
  closing:
    "There are no erasers, no mistakes, no up or down. Each stroke is a present-tense choice; each turn leads into the next pattern.",
};

export function getHistory(locale: Locale): HistoryContent {
  return locale === "en" ? en : zh;
}
