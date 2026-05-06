# 繼續執行 Sprint 2–5 — 加速模式

## 當前狀態

Sprint 2 已部分完成：
- ✅ HeroAnimation.tsx（已建立，需確認完整）
- ✅ Tile.astro
- ✅ ScrollCue.tsx
- ✅ ProcessTabs.tsx
- ✅ About pages (zh/en)
- ✅ Process page (zh)
- ✅ i18n 更新

## 剩餘工作（依優先順序）

### Sprint 2 剩餘（2–3 小時）
1. **完成 HeroAnimation** — 確認 SVG paths、timeline、暗模式、行動版簡化
2. **About 頁內容** — 700 字散文（先用 placeholder + TODO 標記）
3. **Process 頁內容** — 8 步驟內容（從參考檔案 `02_哲學與方法.md` 改寫）
4. **404 頁**
5. **SEO.astro** — Open Graph, hreflang, JSON-LD
6. **ViewTransitions**
7. **commit + Sprint 2 報告**

### Sprint 3（3–4 小時）
1. **建立 8 件 placeholder 作品資料**（`src/data/artworks.json`）
2. **Portfolio 列表頁** — masonry grid + filter
3. **PortfolioCard** — hover SVG overlay
4. **Portfolio Detail 頁**
5. **Lightbox**（簡化版：modal + ←→ + ESC）
6. **commit + Sprint 3 報告**

### Sprint 4（4–6 小時）
1. **41 個 tangle 資料** — 從 `reference/Zentangle/Personal_Zentangle_Site_Brief_2026-05/Reference/Tangle_Data_JSON.md` 提取，建立 `src/data/tangles.json`
2. **Tangle Dictionary 列表頁** — 41 張卡片 + filter/search
3. **Tangle Detail 頁**
4. **8 個重點 tangle step animation**（Crescent Moon, Hollibaugh, Printemps, Cadent, Mooka, Florz, Tipple, Knightsbridge）
5. **其餘 33 個顯示「動畫即將上線」**
6. **commit + Sprint 4 報告**

### Sprint 5（2–3 小時）
1. **Videos 頁** — 3 支假資料 + YouTube lazy embed
2. **Contact 頁** — 表單 + Web3Forms
3. **Mobile Bottom Nav**（5 個圖示）
4. **暗模式完整化** — localStorage + prefers + SSR 防 flash
5. **404 頁**
6. **robots.txt + sitemap**
7. **GitHub Pages 部署測試**
8. **git tag v1.0.0 + Sprint 5 報告**

## 加速原則

1. **先求有，再求好** — placeholder 可接受，標 TODO 即可
2. **每完成一個 Sprint 就 commit + push**，不要等全部做完
3. **簡化動畫** — 用純 CSS stroke-dasharray，不要 GSAP
4. **簡化搜尋** — client-side filter，不要 Pagefind
5. **簡化圖片** — SVG placeholder，不要 Cloudinary
6. **跳過** — 複雜的 morph 動畫、pinch zoom、Sanity CMS

## 重要提醒

- 作者 = **YuChiao Chou**
- 標題 = "Zentangle Chou — YuChiao Chou 的禪繞畫作品集"
- 網址 = `https://yuchiaochou.github.io/Zentangle-Chou`
- 工作目錄 = `site/`
- 參考檔案 = `reference/Zentangle/`
- 忽略所有 "Dr. G. Academy" 字樣

請立即開始，依序完成 Sprint 2 → 3 → 4 → 5，每個 Sprint 結束時 commit + push。
