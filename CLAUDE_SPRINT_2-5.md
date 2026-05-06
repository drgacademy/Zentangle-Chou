# Sprint 2–5: Core Pages → Launch — Claude Code 執行指令

> 本專案為 **YuChiao Chou（周語喬）** 的個人禪繞畫作品集網站。
> 參考檔案中出現的「Dr. G. Academy」字樣一律忽略，所有內容以 YuChiao Chou 為作者。

---

## Part 1: Sprint 2 — Core Pages

### 前置條件
Sprint 1 已完成，專案在 `C:\Users\George Huang\.openclaw\workspace\Zentangle-Chou\site\`

### Step 0: 閱讀順序
1. `..\reference\Zentangle\Personal_Zentangle_Site_Brief_2026-05\Claude_Code_Project_Brief.md` Part 3（頁面）、Part 6.1（hero 動畫）
2. `..\reference\Zentangle\Personal_Zentangle_Site_Brief_2026-05\Visual_Mockups\Animation_Patterns.md` Pattern 2
3. `..\reference\Zentangle\Zentangle_Research\Website_Wireframe\Sample_Homepage_Copy_ZH.md`
4. `..\reference\Zentangle\Zentangle_Research\ZH\02_哲學與方法.md`
5. `docs/sprints/sprint-1-report.md`

### Step 1: Hero 動畫
建立 `src/components/hero/HeroAnimation.tsx`：
- SVG viewBox `0 0 800 600`
- 包含：4 個角點、邊框、string 曲線、Crescent Moon、Hollibaugh、shading、signature
- 用純 CSS `stroke-dasharray` 實作（不用 GSAP DrawSVGPlugin，避免付費）
- Timeline 總長約 10 秒，對應企劃書 Part 6.1.3
- 行動版簡化（< 768px）：總時長壓到 5 秒
- `prefers-reduced-motion`：直接 render 終態

### Step 2: 首頁 `/zh/` 與 `/en/`
1. Hero 動畫區（100vh）
2. ScrollCue
3. 三個入口卡（Portfolio / Tangles / About）— 用 Tile，hover 時下緣畫 string
4. 「最近作品」橫向 scroll（先用 placeholder）
5. 引言 Quote（Maria Thomas: "There are no mistakes, only opportunities."）
6. Footer

文案從 `Sample_Homepage_Copy_ZH.md` 取用，但刪除商業課程口吻，改成個人作品集口吻。

### Step 3: About 頁
- 開場一句話（64px）
- 700 字散文（為什麼開始畫、從哪張紙磚開始、目前的練習狀態、為什麼建這個網站）
- 個人照片 grid（placeholder，標 TODO）
- 時間線：學習歷程

### Step 4: Process 頁
互動式 8 步驟方法：
- 上方 8 個 tab（SVG 圖示 + 數字 + 步驟名）
- 點 tab 下方切換內容
- 每步含官方說明 + 「我的版本」（placeholder）
- 切換時 fade transition

### Step 5: SEO + PageTransition
- `SEO.astro`：title, description, OG, Twitter Card, hreflang, canonical, JSON-LD
- Astro ViewTransitions

### Step 6: 路由 fallback
- 根 `/` redirect 依 Accept-Language
- 404 頁帶簡化 tangle 動畫

---

## Part 2: Sprint 3 — Portfolio

### Step 1: 作品資料
由於尚無真實作品照片，建立 8 件 placeholder 作品：
- cover: 用 SVG 生成的簡單 tangle pattern（每張不同）
- 標題（zh/en）、年份、tile 尺寸、tangle 列表、創作筆記

### Step 2: Portfolio 列表頁
`src/pages/[lang]/portfolio/index.astro`：
- H1 + filter bar + masonry grid（CSS columns）
- Filter：year / mood / tangle（React island）
- PortfolioCard：hover 時 SVG overlay path drawing

### Step 3: Portfolio Detail 頁
`src/pages/[lang]/portfolio/[slug].astro`：
- 麵包屑、主圖、H1、meta
- 使用 tangle chips（連到字典）
- 創作筆記（雙語）
- 細節照片 gallery
- 相關作品 row

### Step 4: Lightbox
- 點擊開 modal
- ←→ 鍵盤切換、ESC 關閉
- 背景 fade

---

## Part 3: Sprint 4 — Tangle Dictionary

### Step 1: 資料導入
41 個 tangle JSON 在 `..\reference\Zentangle\Personal_Zentangle_Site_Brief_2026-05\Reference\Tangle_Data_JSON.md`

建立 `src/data/tangles.json`，直接 import 進頁面（不用 Sanity，簡化）。

### Step 2: 8 個重點 tangle step animation
挑 8 個：Crescent Moon、Hollibaugh、Printemps、Cadent、Mooka、Florz、Tipple、Knightsbridge

用 CSS stroke-dasharray 實作 step animation：
- 每步一個 path
- 自動 loop（畫完停留 1.5 秒 → reset → 重播）
- 可暫停

其餘 33 個顯示「動畫即將上線」placeholder。

### Step 3: Tangle Dictionary 列表頁
`src/pages/[lang]/tangles/index.astro`：
- 41 個卡片 masonry
- Filter bar：家族 / 難度 / 類型 / 搜尋
- TangleCard：縮圖 SVG + 名 + creator + 難度星

### Step 4: Tangle Detail 頁
`src/pages/[lang]/tangles/[name].astro`：
- 麵包屑、H1、metadata
- TangleStepAnimation（8 個重點才有）
- 步驟文字列表（雙語）
- 「為什麼重要」段落
- 「我的應用範例」（連 portfolio）
- 「相關 tangle」row

### Step 5: 搜尋
用簡單的 client-side filter（不用 Pagefind，簡化）。搜尋名稱、creator、category。

---

## Part 4: Sprint 5 — Polish & Launch

### Step 1: Videos 頁
`src/pages/[lang]/videos/index.astro`：
- 3–5 支假資料（YouTube embed，lazy load）
- Filter：tutorial / time-lapse / reflection

### Step 2: Contact 頁
`src/pages/[lang]/contact.astro`：
- H1 + 歡迎來信
- Email、IG、LINE link
- ContactForm（Web3Forms）

### Step 3: 行動版 Bottom Nav
5 個圖示：Home / Portfolio / Tangles / About / Contact
Touch target ≥ 44px

### Step 4: 暗模式完整化
- localStorage + prefers-color-scheme
- rotateY 切換動畫
- 所有元件 dark mode 對比 ≥ AA
- SSR 防 flash：`<script is:inline>` 先注入

### Step 5: A11y
- 鍵盤導航
- aria-label
- prefers-reduced-motion 全面尊重

### Step 6: 效能優化
- `client:visible` 而非 `client:load`
- 圖片 lazy loading
- prefetch 重要頁

### Step 7: 404 頁
簡化版 hero 動畫 + 「這頁迷路了」+ Go back home

### Step 8: robots.txt + sitemap
Astro sitemap 已整合，確認 build 後產出。

### Step 9: GitHub Pages 部署
- 確認 `.github/workflows/deploy.yml` 正確
- Build path: `cd site && pnpm build`
- Output: `site/dist`
- 推送到 GitHub，確認 Actions 成功

### Step 10: 上線
- git tag `v1.0.0`
- 寫 `docs/sprints/sprint-5-report.md`

---

## 重要提醒

1. **作者 = YuChiao Chou**，不是 Dr. G. Academy
2. **網站標題**: "Zentangle Chou — YuChiao Chou 的禪繞畫作品集"
3. **風格**: 90% 黑白，金色/棕色點綴， contemplative 氛圍
4. **動畫原則**: 慢、有意圖、可暫停，不是炫技
5. **文案**: 個人作品集口吻，不要商業課程口吻
6. **完成 Sprint 2 後自動繼續 Sprint 3，依此類推直到 Sprint 5 完成**
7. 每個 Sprint 結束寫 `docs/sprints/sprint-N-report.md`

---

開始執行 Sprint 2。完成後自動繼續 Sprint 3、4、5。
