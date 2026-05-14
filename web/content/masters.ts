import type { Locale } from "@/lib/i18n/config";

export type Master = {
  slug: string;
  name: string;
  role: string;
  era: string;
  body: string;
  signaturePattern?: string;
};

export type MastersContent = {
  eyebrow: string;
  title: string;
  intro: string;
  founders: Master[];
  voices: Master[];
  closing: string;
};

const zh: MastersContent = {
  eyebrow: "名家 — Masters",
  title: "讓禪繞畫被世界看見的人",
  intro:
    "禪繞畫不是一個獨自的發明，而是一條由眾人之筆延伸的長河。以下是奠基者，以及將這套方法以自己的語言重新詮釋、推廣至全球的代表性聲音。",
  founders: [
    {
      slug: "rick-roberts",
      name: "Rick Roberts",
      role: "共同創辦人 / 哲學引導者",
      era: "美國，1947 –",
      body:
        "Rick 曾為修士，長年研究東方冥想與西方音樂理論。他將「冥想」從蒲團上請下來，放進日常的一支筆裡。Zentangle 中那句『Anything is possible, one stroke at a time（一筆一畫，事事皆可能）』，是他為這個練習寫下的核心句。",
      signaturePattern: "Hollibaugh",
    },
    {
      slug: "maria-thomas",
      name: "Maria Thomas",
      role: "共同創辦人 / 書法藝術家",
      era: "美國，1954 –",
      body:
        "Maria 是書法家與插畫家，她相信線條是有呼吸的。她將反覆的微小筆觸組織成可教可學的結構：一個圖樣（Tangle）、一個轉折、一個陰影。她也是首批 CZT 認證課程的主導者。",
      signaturePattern: "Crescent Moon",
    },
  ],
  voices: [
    {
      slug: "molly-hollibaugh",
      name: "Molly Hollibaugh",
      role: "Zentangle 教學設計總監",
      era: "美國",
      body:
        "Maria 的女兒，自小浸潤在書法與紙磚之間。她主導 CZT 認證課程的設計，並開發了多個經典圖樣，是當代禪繞畫教學的關鍵推手。",
      signaturePattern: "Bales",
    },
    {
      slug: "martha-huggins",
      name: "Martha Huggins",
      role: "圖樣創作者",
      era: "美國",
      body:
        "以細緻而帶有植物感的圖樣聞名，作品常見藤蔓、葉脈與微小的「呼吸感」。她示範了如何在嚴謹的步驟之下，仍保有筆觸的溫度。",
      signaturePattern: "Mooka",
    },
    {
      slug: "suzanne-mcneill",
      name: "Suzanne McNeill",
      role: "出版與推廣者",
      era: "美國",
      body:
        "透過大量入門書籍與工作坊，將禪繞畫帶入手作與療癒的廣大讀者群，是英語世界中最早將禪繞畫普及化的作者之一。",
    },
    {
      slug: "international-czt",
      name: "全球 CZT 社群",
      role: "在地化與翻譯",
      era: "亞洲、歐洲、拉丁美洲",
      body:
        "包括日本、台灣、香港、馬來西亞、德國、義大利等地的 CZT，將禪繞畫的語彙翻譯為各自的文化用語，並引入醫療、教育、企業培訓現場。",
    },
  ],
  closing:
    "如果說禪繞畫有一個共同的家族特徵，那是：在線條停下來之前，沒有人在意它要去哪裡。",
};

const en: MastersContent = {
  eyebrow: "Masters — Voices",
  title: "The People Who Made Zentangle Visible",
  intro:
    "Zentangle was never the work of one hand. Below are the founders, and the voices who reinterpreted the method in their own languages and carried it across the world.",
  founders: [
    {
      slug: "rick-roberts",
      name: "Rick Roberts",
      role: "Co-founder / Philosophical Guide",
      era: "USA, 1947 –",
      body:
        "A former monk with deep roots in Eastern meditation and Western music theory, Rick took meditation off the cushion and placed it inside a pen. His core line — \"Anything is possible, one stroke at a time\" — became the practice's defining sentence.",
      signaturePattern: "Hollibaugh",
    },
    {
      slug: "maria-thomas",
      name: "Maria Thomas",
      role: "Co-founder / Calligrapher",
      era: "USA, 1954 –",
      body:
        "A calligrapher and illustrator, Maria believes that lines breathe. She organised repeated micro-strokes into a teachable structure: a tangle, a turn, a shade. She also led the first CZT seminars.",
      signaturePattern: "Crescent Moon",
    },
  ],
  voices: [
    {
      slug: "molly-hollibaugh",
      name: "Molly Hollibaugh",
      role: "Director of Curriculum",
      era: "USA",
      body:
        "Maria's daughter, raised among lettering and paper tiles. She designs the CZT seminars and has authored many canonical tangles. A key force in contemporary Zentangle pedagogy.",
      signaturePattern: "Bales",
    },
    {
      slug: "martha-huggins",
      name: "Martha Huggins",
      role: "Pattern Designer",
      era: "USA",
      body:
        "Known for botanical, breath-like tangles — vines, leaf veins, micro-rhythms. Her work shows how warmth in the line survives a disciplined process.",
      signaturePattern: "Mooka",
    },
    {
      slug: "suzanne-mcneill",
      name: "Suzanne McNeill",
      role: "Publisher / Populariser",
      era: "USA",
      body:
        "Through prolific introductory books and workshops, she carried Zentangle into the wider crafts and healing audience — among the earliest to popularise the practice in English.",
    },
    {
      slug: "international-czt",
      name: "The Global CZT Community",
      role: "Localisation & Translation",
      era: "Asia, Europe, Latin America",
      body:
        "CZTs in Japan, Taiwan, Hong Kong, Malaysia, Germany, Italy and beyond have translated Zentangle's vocabulary into their own cultural register and brought it into clinics, schools and corporate training.",
    },
  ],
  closing:
    "If there is one family resemblance in all this work, it's this: until the line comes to rest, no one is anxious about where it is heading.",
};

export function getMasters(locale: Locale): MastersContent {
  return locale === "en" ? en : zh;
}
