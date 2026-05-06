# 🚀 Zentangle Chou — Claude Code 啟動指南

## 狀態

✅ GitHub Repo: https://github.com/drgacademy/Zentangle-Chou  
✅ Google Drive 參考資料：全部下載並 commit  
✅ Sprint 1 指令：已準備 (`CLAUDE_SPRINT_1.md`)  

## 快速啟動

在終端機執行：

```powershell
cd "C:\Users\George Huang\.openclaw\workspace\Zentangle-Chou"
claude
```

然後在 Claude Code 中貼上：

```
請讀取 CLAUDE_SPRINT_1.md 並執行其中所有步驟。參考檔案在 reference/Zentangle/Personal_Zentangle_Site_Brief_2026-05/ 目錄下。
```

## 參考檔案結構

```
reference/Zentangle/
├── Personal_Zentangle_Site_Brief_2026-05/
│   ├── Claude_Code_Project_Brief.md      ← 主企劃書（22,000 字）
│   ├── Visual_Mockups/
│   │   ├── Color_Palette.md              ← 色票 + Tailwind config
│   │   ├── Typography_System.md          ← 字體系統
│   │   ├── Animation_Patterns.md         ← 動畫 patterns
│   │   └── Component_Library.md          ← 元件清單
│   ├── Sprint_Prompts/
│   │   ├── Sprint_1_Foundation.md
│   │   ├── Sprint_2_Core_Pages.md
│   │   ├── Sprint_3_Portfolio.md
│   │   ├── Sprint_4_Tangle_Dictionary.md
│   │   └── Sprint_5_Polish_and_Launch.md
│   └── Reference/
│       └── Tangle_Data_JSON.md           ← 41 個圖樣 JSON
└── Zentangle_Research/                    ← 禪繞畫研究資料（中英雙語）
```

## Sprint 計畫

| Sprint | 主題 | 預估時數 |
|--------|------|----------|
| 1 | Foundation（架站底盤、design tokens） | 6–10 hr |
| 2 | Core Pages（Home/About/Process + Hero 動畫） | 8–14 hr |
| 3 | Portfolio（作品瀑布流 + Detail） | 6–10 hr |
| 4 | Tangle Dictionary（41 個圖樣互動頁） | 8–12 hr |
| 5 | Polish（Videos、SEO、效能、測試、發布） | 4–8 hr |

## 技術架構

- **框架**: Astro 4.x + TypeScript strict
- **樣式**: Tailwind CSS + 自定義 design tokens
- **動畫**: Framer Motion + CSS stroke-dasharray（純 CSS 路線）
- **CMS**: Sanity（作品、影片、圖樣資料）
- **部署**: GitHub Pages
- **雙語**: zh-TW / en，URL prefix 模式

## 核心美學

> 「網站本身就是一幅禪繞畫」
> — 線條會延伸、頁面會慢繪、滑鼠會留下淡淡的線
> — 整體氛圍：沉思、靜定、驚奇、被允許

## 注意事項

1. **不要手動修改程式碼** — 所有 coding 交給 Claude Code
2. **Sprint 4 的圖樣動畫**可先只做 8 個重點 tangle，其餘漸進補完
3. **圖片素材**需 YuChiao 提供原創作品掃描檔
4. **影片**可先用 YouTube/Vimeo embed，之後再上傳

---

*準備完成。啟動 Claude Code 開始 Sprint 1！*
