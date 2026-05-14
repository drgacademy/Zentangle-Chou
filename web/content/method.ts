import type { Locale } from "@/lib/i18n/config";

export type Step = {
  index: number;
  name: string;
  body: string;
};

export type MethodContent = {
  eyebrow: string;
  title: string;
  intro: string;
  steps: Step[];
  tools: { title: string; items: string[] };
  closing: string;
};

const zh: MethodContent = {
  eyebrow: "畫法 — Method",
  title: "八個步驟，一張紙磚",
  intro:
    "禪繞畫的標準流程由八個步驟組成，刻意慢、刻意安靜。它不要求技巧，只要求願意停下來。",
  steps: [
    {
      index: 1,
      name: "感謝與欣賞 / Gratitude & Appreciation",
      body:
        "把紙磚拿在手上，先停一下。感謝自己撥出這段時間，感謝紙、筆、光。這個動作很小，卻是禪繞畫之所以稱為禪的入口。",
    },
    {
      index: 2,
      name: "角點 / Corner Dots",
      body:
        "用鉛筆在紙磚四角各輕點一個小點。這四個點宣告：練習從此開始，世界其他事先暫停。",
    },
    {
      index: 3,
      name: "邊界 / Border",
      body:
        "以鉛筆連接四個角點，畫出可彎可直的邊界。邊界不必方正，它只是告訴你「這是我今天願意投入的範圍」。",
    },
    {
      index: 4,
      name: "細繩 / String",
      body:
        "用鉛筆在邊界內畫一條任意的「細繩」——一條弧線、一個漩渦、一個 S。它把畫面分成幾個區塊，但它不需要好看，因為它最後會消失。",
    },
    {
      index: 5,
      name: "圖樣 / Tangle",
      body:
        "換上代針筆。在每個區塊裡填入一個圖樣（Tangle），一筆一筆慢慢畫。不思考整體，只思考下一筆要往哪裡。",
    },
    {
      index: 6,
      name: "陰影 / Shade",
      body:
        "回到鉛筆，用 2B 或更軟的筆芯，在邊緣、轉折處輕輕暈染。陰影讓平面有了呼吸，也讓觀者的目光有了停留的地方。",
    },
    {
      index: 7,
      name: "簽名與日期 / Sign & Date",
      body:
        "在紙磚正面找一個不打擾畫面的角落，用代針筆寫下自己的縮寫；翻到背面，寫下日期、地點、心情。每一張紙磚都是一份小小的日記。",
    },
    {
      index: 8,
      name: "欣賞 / Appreciate",
      body:
        "把紙磚拿遠一些，從不同角度看它。轉九十度，再看。允許自己驚訝。允許自己說：「這真的是我畫的。」",
    },
  ],
  tools: {
    title: "標準工具",
    items: [
      "9 公分見方紙磚（白色或黑色義大利純棉紙）",
      "Sakura Micron 01 代針筆（黑色或白色）",
      "2B 鉛筆 + 紙筆（暈染陰影用）",
      "一張安靜的桌子，與一段不被打斷的時間",
    ],
  },
  closing:
    "八個步驟看似有序，其實非常自由。它的紀律不在於控制線條，而在於不替下一筆預先擔心。",
};

const en: MethodContent = {
  eyebrow: "Method — Eight Steps",
  title: "Eight Steps, One Tile",
  intro:
    "The classic Zentangle process unfolds in eight steps. It is deliberately slow and deliberately quiet — no skill required, only willingness to pause.",
  steps: [
    {
      index: 1,
      name: "Gratitude & Appreciation",
      body:
        "Hold the tile in your hand and breathe. Be thankful for this time, this paper, this light. The gesture is small, but it is the door through which the practice earns the word \"zen\".",
    },
    {
      index: 2,
      name: "Corner Dots",
      body:
        "Place a soft pencil dot in each of the four corners. The dots declare: practice begins now; everything else can wait.",
    },
    {
      index: 3,
      name: "Border",
      body:
        "Connect the dots with a pencil border — curved or straight, it doesn't matter. The border simply says: this is the scope I am offering today.",
    },
    {
      index: 4,
      name: "String",
      body:
        "Inside the border, draw an arbitrary \"string\" — a curve, a spiral, an S. It divides the surface into small zones. It does not need to be beautiful, because it will disappear.",
    },
    {
      index: 5,
      name: "Tangle",
      body:
        "Switch to a fine-liner. Fill each zone with a tangle, stroke by stroke. Don't think about the whole — only the next stroke and where it wants to go.",
    },
    {
      index: 6,
      name: "Shade",
      body:
        "Return to the pencil. With a 2B (or softer), shade gently along edges and turns. Shading lets a flat surface breathe and gives the viewer's eye a place to rest.",
    },
    {
      index: 7,
      name: "Sign & Date",
      body:
        "Find an unobtrusive corner on the front and sign with your initials. On the back, write the date, the place, the mood. Each tile is a tiny diary.",
    },
    {
      index: 8,
      name: "Appreciate",
      body:
        "Hold the tile at arm's length. Turn it ninety degrees, then again. Allow yourself to be surprised. Allow yourself to say: I really made this.",
    },
  ],
  tools: {
    title: "Standard Toolkit",
    items: [
      "A 3.5-inch (≈9 cm) Italian cotton tile, white or black",
      "Sakura Micron 01 fine-liner, black or white",
      "A 2B pencil and a paper tortillon for shading",
      "A quiet table and a stretch of uninterrupted time",
    ],
  },
  closing:
    "The eight steps look orderly, yet the practice is deeply free. The discipline is not in controlling the line; it is in not worrying ahead of the next stroke.",
};

export function getMethod(locale: Locale): MethodContent {
  return locale === "en" ? en : zh;
}
