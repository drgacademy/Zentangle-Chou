import type { Locale } from "@/lib/i18n/config";

export type Precept = {
  title: string;
  body: string;
};

export type MindsetContent = {
  eyebrow: string;
  title: string;
  intro: string;
  precepts: Precept[];
  meditation: { title: string; body: string };
  closing: string;
};

const zh: MindsetContent = {
  eyebrow: "心法 — Mindset",
  title: "禪繞畫的心法",
  intro:
    "禪繞畫不是「畫得好看的方法」，而是「在動筆時不被自己干擾的方法」。以下是六個被反覆驗證的心法，是禪繞畫之所以為禪的理由。",
  precepts: [
    {
      title: "一、沒有錯誤，只有下一筆",
      body:
        "用代針筆代替鉛筆，意味著無法擦掉。但畫錯不是失敗，而是讓你練習「接住意外」的時刻。每一條歪掉的線，都可以變成下一個圖樣的起點。",
    },
    {
      title: "二、慢，比快好看",
      body:
        "禪繞畫不比速度。讓筆稍微停留一秒，讓墨在紙上落實。慢下來不是拖延，是把注意力安放在筆尖。",
    },
    {
      title: "三、不為作品擔心，只為下一筆負責",
      body:
        "整張紙磚會不會好看，不是你現在能決定的事。你能決定的只有「此刻這一筆要往哪裡」。把心收回到 1 公分的距離。",
    },
    {
      title: "四、轉動紙磚，世界就會跟著轉",
      body:
        "畫禪繞畫時隨時可以把紙磚轉九十度、一八〇度。沒有「上下左右」這件事。當你願意轉動紙磚，你也願意換一個角度看世界。",
    },
    {
      title: "五、留白是聲音裡的呼吸",
      body:
        "不要把每一個區塊都填滿。讓圖樣與圖樣之間留一道白，那是畫面的呼吸口，也是觀者的眼睛可以歇腳的地方。",
    },
    {
      title: "六、簽下名字，是把當下封存",
      body:
        "完成後簽名與寫日期，不是為了證明這是你的作品，而是承認：今天的我，曾經這樣安靜地坐過一段時間。",
    },
  ],
  meditation: {
    title: "落筆前的三個呼吸",
    body:
      "坐下，紙磚放在面前。閉上眼睛，做三個慢呼吸：第一個呼吸，感謝這段時間；第二個呼吸，把肩膀放下來；第三個呼吸，告訴自己「我只負責下一筆」。睜開眼睛，從第一個角點開始。",
  },
  closing:
    "心法不是規條，是提醒。當你忘記時，把紙磚轉九十度，重新開始。",
};

const en: MindsetContent = {
  eyebrow: "Mindset — Principles",
  title: "How Zentangle Thinks",
  intro:
    "Zentangle is not a method for drawing well. It is a method for not interrupting yourself while you draw. These are six principles that explain why the practice earns its name.",
  precepts: [
    {
      title: "1. There are no mistakes, only the next stroke.",
      body:
        "Working in pen means there is nothing to erase. A wrong line is not a failure — it is an invitation to fold the unexpected into the next tangle.",
    },
    {
      title: "2. Slow is more beautiful than fast.",
      body:
        "Zentangle is not a race. Let the pen rest for a moment so the ink settles. Slowing down isn't delay; it places your attention on the tip of the pen.",
    },
    {
      title: "3. Worry only about the next stroke.",
      body:
        "Whether the whole tile will be beautiful is not something you can decide now. You can only decide where this stroke will go. Bring attention back to the centimetre in front of you.",
    },
    {
      title: "4. Rotate the tile; let the world turn with it.",
      body:
        "There is no up or down. Turn the tile ninety, one-eighty degrees at any time. When you are willing to rotate the paper, you are willing to see from another angle.",
    },
    {
      title: "5. White space is the breath inside the sound.",
      body:
        "Do not fill every zone. The white between tangles is the breathing space of the composition — a resting place for the viewer's eyes.",
    },
    {
      title: "6. Signing seals the moment.",
      body:
        "We sign and date the tile not to claim ownership, but to acknowledge: today, for a while, I sat quietly. The signature is the seal of a small, completed presence.",
    },
  ],
  meditation: {
    title: "Three Breaths Before the First Stroke",
    body:
      "Sit. Place the tile in front of you. Close your eyes and breathe three slow breaths: the first, in gratitude for this time; the second, to let your shoulders drop; the third, to remind yourself \"I'm only responsible for the next stroke.\" Open your eyes, and begin at the first corner dot.",
  },
  closing:
    "These principles are reminders, not rules. When you forget, rotate the tile ninety degrees, and begin again.",
};

export function getMindset(locale: Locale): MindsetContent {
  return locale === "en" ? en : zh;
}
