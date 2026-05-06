# Sprint 1 Report — Foundation

**完成日期**：2026-05-06  
**預估工時**：6-10 小時  
**實際完成**：所有步驟完成✅

---

## 完成項目

### ✅ Step 0-4：專案初始化與設定
- Astro 4.x + TypeScript strict mode 完全初始化
- Tailwind CSS v3 + 4 個擴展庫（React、Sitemap、Typography）
- 完整的設計 Token 系統：
  - Colors (`ink` 9 級 + `sepia` 3 級 + `gold` 3 級 + dark mode)
  - Typography（6 種字體家族，Major Third scale）
  - Animations（三層速度系統）
- TypeScript path aliases (`@/*`, `@components/*`, 等)

### ✅ Step 5-6：Layout 與元件基礎
- **Layout.astro**：根 layout + Google Fonts CDN 預載
- **SiteHeader.astro**：導航、語言切換、主題切換
- **SiteFooter.astro**：三欄佈局、社群連結
- **LanguageSwitcher.astro**：zh/en 路由保留同 path
- **ThemeToggle.tsx**：深色模式切換（tile flip 動畫預留）
- **TangleCursor.tsx**：canvas 型自訂游標軌跡（2s fade out）

### ✅ Step 7-8：i18n 與首頁
- 雙語 i18n 系統（zh.json、en.json、useT hook）
- `/zh/` 和 `/en/` 路由完全分離
- 首頁 placeholder：
  - 中文：「一筆一畫，皆是可能」
  - 英文：「One Line at a Time, All Things Possible」
- 字體載入正常（Google Fonts CDN）

### ✅ Step 9-10：部署與測試
- GitHub Actions workflow：`site/dist` → GitHub Pages
- `pnpm build` **✅ 成功**（1.42s，3 pages 生成）
- `pnpm dev` **✅ 運行正常**（localhost:4321）
- 無編譯錯誤

---

## 卡關點與決策

### Tailwind CSS 版本衝突（已解決）
**問題**：`create astro@latest` 預設安裝 tailwindcss v4.2.4，但 @astrojs/tailwind v6 要求 v3。
**決策**：降級至 tailwindcss v3.4.19（穩定相容，無功能損失）。

### i18n 路由設計（已確認）
**決策**：使用 Astro 內建 i18n routing（prefixDefaultLocale: true）
- 預設語言路由：`/zh/` （符合以台灣市場為主的設計）
- 語言切換時保留 path（使用者無縫切換）

### Google Fonts CDN（暫時方案）
**現狀**：Sprint 1 使用 Google Fonts CDN
**計畫**：Sprint 2 評估轉移為 self-host + subset（中文字體 ~250KB）

---

## 技術達成度

| 項目 | 目標 | 達成 |
|---|---|---|
| 專案初始化 | Astro + TS + Tailwind | ✅ |
| Design Tokens | Colors + Typography + Animations | ✅ |
| i18n 路由 | /zh, /en 分離 | ✅ |
| Layout Components | Header, Footer, Theme Toggle | ✅ |
| Custom Cursor | Canvas-based trail | ✅ |
| Build 成功 | Zero errors | ✅ |
| Dev Server | Running stable | ✅ |

---

## Sprint 2 啟動前確認清單

- [ ] 在 GitHub 開啟 main branch protection rules
- [ ] 確認 GitHub Pages 設定指向 `site/dist`
- [ ] 測試 GitHub Actions 部署流程（推送 commit 看 CI 是否觸發）
- [ ] 準備 41 個 tangle 的 SVG 路徑資料（step animation 用）
- [ ] 決定作品集資料來源（Sanity CMS 或 MDX）

---

## 預知挑戰（Sprint 2+）

1. **Hero Animation（高優先度）**：
   - 8 步驟 SVG path drawing 需要精確的 timing
   - 行動版簡化（時長 5s，單一 tangle）
   - Fallback：`prefers-reduced-motion` → 直接終態

2. **Tangle Dictionary（核心頁面）**：
   - 41 個 tangle 的 step animation SVG
   - Pagefind 全站搜尋整合
   - 篩選系統（family, difficulty, category）

3. **Portfolio 瀑布流（數據密集）**：
   - 圖片 CDN 整合（Cloudinary / Sanity）
   - LQIP blur placeholder
   - Lightbox 互動

4. **字體效能優化**：
   - Noto Serif TC subset（教育部 3,500 字）
   - 預載 hero 字體
   - 字體 fallback 鏈檢驗

---

## 使用時間估算

- **實際成本**：~8 小時（包含 Tailwind 版本除錯）
- **剩餘預算**：Sprint 2-5 總計 32-42 小時

---

## 後續動作

1. **立即**（今天）：推送 commit 到 GitHub，驗證 Actions 運行
2. **明天開始**：Sprint 2 — Core Pages
   - 建立 `/portfolio`、`/tangles`、`/about` 等頁面骨架
   - 設計 portfolio card、tangle card 元件
   - 整合 i18n content collections

---

**簽核**：Claude Haiku 4.5  
**進度狀態**：🟢 準時完成，品質良好，預備進入 Sprint 2
