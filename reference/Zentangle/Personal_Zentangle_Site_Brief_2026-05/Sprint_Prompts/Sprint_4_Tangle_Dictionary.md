# Sprint 4: Tangle Dictionary — Claude Code Prompt

> 前置條件：Sprint 1–3 完成。
> 預估 wall-clock：8–12 小時（含 4–6 小時手繪 SVG）。

---

## 給 Claude Code 的指令

你正執行 Sprint 4：Tangle Dictionary。這是核心吸引 SEO 流量的功能——41 個經典 tangle 的雙語互動字典。

### Step 0：閱讀順序

1. `C:\Claude\DrG_Academy\Personal_Zentangle_Site_Brief_2026-05\Claude_Code_Project_Brief.md` Part 3.2.5、3.2.6、Part 5.3（Tangle schema）、Part 6.2
2. `C:\Claude\DrG_Academy\Personal_Zentangle_Site_Brief_2026-05\Reference\Tangle_Data_JSON.md`（41 個 tangle 完整 JSON）
3. `C:\Claude\DrG_Academy\Zentangle_Research_2026-05\ZH\04_經典圖樣字典.md`（中文原始資料）
4. `C:\Claude\DrG_Academy\Zentangle_Research_2026-05\EN\04_Tangles_Dictionary.md`（英文原始資料）
5. `docs/sprints/sprint-3-report.md`

### Step 1：資料導入

41 個 tangle 已在 `Reference/Tangle_Data_JSON.md` 整理為 JSON。寫一支 import 腳本：

`scripts/seed-tangles.ts`：用 Sanity client 把 JSON 一次匯入，每個 tangle 為一個 Sanity document。

驗證：Sanity Studio 看到 41 個 tangle entry，每個含 zh/en 雙語、creator、family、difficulty、3–6 個 step。

### Step 2：8 個重點 tangle 的 step animation SVG

挑 8 個最具代表性的 tangle 手繪 SVG step paths：

1. **Crescent Moon**（4 步：半月、塗黑、第一道 aura、後續 auras）
2. **Hollibaugh**（4 步：第一條帶、第二條從後穿過、第三條、填黑縫隙）
3. **Printemps**（3 步：起始小捲、向外旋轉、收尾）
4. **Cadent**（4 步：點網、水平凸弧、垂直凸弧、菱形中心點）
5. **Mooka**（4 步：S 莖、第一片瓣、第二片瓣、次級瓣）
6. **Florz**（3 步：點網、對角連線、菱形角填黑）
7. **Tipple**（3 步：大圓、中圓、小圓填空）
8. **Knightsbridge**（2 步：方格網、交錯填黑）

**繪製方式**（強烈建議）：
1. 在 Figma 用 200×200 artboard 畫
2. 每一步用一個 layer
3. 用 Pen tool 畫成 paths（不要 stroke，留 path 資料）
4. Export SVG → 取出 `<path d="...">` 的 `d` 屬性
5. 整理成 JSON：

```json
{
  "name": "crescent-moon",
  "steps": [
    { "step": 1, "path_d": "M 20 50 Q 30 30 40 50 ...", "duration": 0.8, "description_zh": "畫半月", "description_en": "Draw crescents" },
    { "step": 2, "path_d": "...", "duration": 0.6, "description_zh": "塗黑", "description_en": "Fill black" },
    ...
  ]
}
```

如果使用者沒空手繪：**先寫一個 fallback**——8 個 tangle 都用文字步驟列表 + 一張靜態 placeholder thumbnail。在 detail 頁顯示 `<div class="step-animation-placeholder">動畫即將上線</div>`。

### Step 3：Tangle Dictionary 列表頁

`src/pages/[lang]/tangles/index.astro`：

1. H1 + 副標
2. Filter bar（黏性 sticky top）：
   - 家族 pills：[All] [Roberts/Thomas] [Bartholomew] [Farmer] [Other CZT]
   - 難度 stars：[All] [★] [★★] [★★★]
   - 類型 checkboxes：[grid] [organic] [3d] [filler] [auras] [border]
   - 搜尋框：用 Pagefind
3. Masonry 卡片網格

`TangleCard.astro`：縮圖（80×80 SVG 或靜態 PNG）+ 名（zh / en）+ creator + difficulty stars。

### Step 4：Tangle Detail 頁

`src/pages/[lang]/tangles/[name].astro`：

依 `Claude_Code_Project_Brief.md` Part 3.2.6：

1. 麵包屑
2. H1 + 中文名 + creator + year
3. metadata bar（難度、家族、類型）
4. **TangleStepAnimation.tsx**（核心元件，code 在 brief Part 6.2.3）
5. 步驟文字列表（雙語）
6. 「為什麼重要」段落（雙語）
7. 「我的應用範例」：列出 portfolio 中用過此 tangle 的 artwork（可 click 連到 portfolio detail）
8. 「相關 tangle」row

### Step 5：Pagefind 搜尋整合

```bash
pnpm add -D pagefind
```

`astro.config.mjs`：build 後跑 pagefind：

```js
import { execSync } from 'node:child_process';
export default defineConfig({
  ...
  vite: {
    plugins: [{
      name: 'pagefind',
      closeBundle: () => {
        execSync('pnpm pagefind --site dist', { stdio: 'inherit' });
      }
    }]
  }
});
```

`TangleSearch.tsx`：

```tsx
import { useEffect, useRef } from 'react';

export function TangleSearch({ lang }) {
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!containerRef.current) return;
    (async () => {
      const { PagefindUI } = await import('@pagefind/default-ui');
      new PagefindUI({
        element: containerRef.current,
        showSubResults: true,
        showImages: false,
        translations: lang === 'zh' ? { placeholder: '搜尋圖樣...' } : {}
      });
    })();
  }, [lang]);
  return <div ref={containerRef} />;
}
```

確認搜尋「Hollibaugh」「哈利堡」「Maria」「Bartholomew」「grid」都能找到對的 tangle。

### Step 6：SEO + schema.org

每個 tangle detail 頁 emit `HowTo` schema：

```json
{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to draw Hollibaugh",
  "description": "...",
  "image": "...",
  "step": [
    { "@type": "HowToStep", "name": "Step 1", "text": "..." },
    ...
  ],
  "totalTime": "PT5M",
  "tool": [
    { "@type": "HowToTool", "name": "Sakura Pigma Micron 01 pen" },
    { "@type": "HowToTool", "name": "Graphite pencil 2B" }
  ]
}
```

### Step 7：行動版適配

- Filter bar 改為 collapsible drawer（行動版預設收起）
- TangleStepAnimation 在小螢幕也要清楚（min 250×250）
- 篩選 chips 可橫向滾動

### Acceptance Criteria

- [ ] `/zh/tangles` 顯示 41 個 tangle 卡片
- [ ] 搜尋「Hollibaugh」「哈利堡」「Maria」都找到 2+ 結果
- [ ] 篩 Roberts/Thomas Official 顯示 ~16 個
- [ ] 篩 difficulty=beginner 顯示初級 tangle
- [ ] 點任一卡片進 detail 頁，動畫 morph
- [ ] 8 個重點 tangle 的 step animation 自動 loop
- [ ] 其餘 33 個 tangle 顯示「動畫即將上線」placeholder
- [ ] 雙語切換無誤
- [ ] schema.org HowTo 通過 Rich Results Test
- [ ] Lighthouse 全頁 ≥ 90
- [ ] git commit ≥ 6

### Step 8：commit + Sprint 4 報告

寫 `docs/sprints/sprint-4-report.md`：完成項、SVG 手繪卡關點、剩 33 個 tangle 動畫的補完計畫。

如果手繪 SVG 太花時間，**stop 並建議使用者**：
- 選項 A：先用文字步驟上線，動畫慢慢補
- 選項 B：每週補 5 個 tangle，分 6 週補完
- 選項 C：請外包繪師（建議用 Fiverr / 朋友 1 個 SVG ~$10）

開始吧。預估 8–12 小時。
