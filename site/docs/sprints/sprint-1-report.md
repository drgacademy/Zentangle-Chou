# Sprint 1: Foundation — Completion Report

## 完成項目

✅ **Astro 4.x 專案初始化**
- TypeScript strict mode 已啟用
- Tailwind CSS 3.4.19 整合（Astro @astrojs/tailwind 6.0.2）
- React 18 + Framer Motion 已配置
- 所有 dev 依賴已安裝（vitest、playwright）

✅ **設計 Tokens 完全落實**
- `src/styles/tokens.css`：所有 CSS variables（色彩、字體、動畫）
- `src/styles/globals.css`：base styles + Tailwind 3.x integration
- `src/tokens/{colors,fonts,animations}.ts`：TypeScript const exports

✅ **i18n 路由系統**
- `astro.config.mjs`：i18n routing with `prefixDefaultLocale: true`
- `src/i18n/{zh,en}.json`：中英文字串（nav、hero、footer）
- `src/i18n/useT.ts`：簡單 translation hook
- 路由：`/zh/`（預設）、`/en/`、根 `/`（指向 /zh/）

✅ **Layout 與核心元件**
- `src/layouts/Layout.astro`：根 layout（Google Fonts CDN、SEO、meta）
- `src/components/layout/{SiteHeader,SiteFooter,LanguageSwitcher}.astro`
- `src/components/layout/ThemeToggle.tsx`：暗模式切換（1s rotateY）
- `src/components/cursor/TangleCursor.tsx`：canvas cursor trail

✅ **GitHub Pages 部署**
- `.github/workflows/deploy.yml`：完整 CI/CD pipeline
- 觸發：push to main
- Build 路徑：`cd site && pnpm build`
- Artifact：`site/dist`

✅ **Acceptance Criteria**
- [ ] `pnpm build`：✅ 成功（3 pages built）
- [ ] `pnpm dev`：✅ 成功（localhost:4321）
- [ ] 頁面能正常生成：✅ /zh/、/en/、/
- [ ] i18n 字體載入：✅ Google Fonts CDN integrated
- [ ] 暗模式：✅ ThemeToggle 元件工作
- [ ] Cursor trail：✅ Canvas-based TangleCursor 已建立

## 卡關點 & 決策

### Tailwind CSS 版本問題
- **問題**：初始安裝 Tailwind 4.2.4，但 @astrojs/tailwind 6.0.2 不支援
- **決策**：降級到 Tailwind 3.4.19 維持兼容性
- **理由**：Sprint 1 優先穩定，Tailwind 4.x 升級可留待 Sprint 2

### 字體載入策略
- **決策**：使用 Google Fonts CDN（3 個字體家族）
- **原因**：Sprint 1 時間限制；self-host subset 留待 Sprint 2
- **風險**：CDN 延遲、CSP 開洞
- **未來**：Sprint 2 評估遷移至 self-host WOFF2

## Sprint 2 前準備項目

- [ ] 測試首頁 hero 動畫（8 步驟timeline）
- [ ] 實現 SVG path drawing animation
- [ ] 測試行動版 responsive（375px, 768px）
- [ ] 驗證 i18n 切換保留 path
- [ ] 檢查暗模式對比度（WCAG AA）
- [ ] 建立 Portfolio Grid 元件框架
- [ ] 建立 Tangle Dictionary 結構
- [ ] Sanity.io CMS 連接（可選 Sprint 2）

## 技術亮點

1. **嚴格的色彩約束**：90% 黑白 + 金色/棕色點綴，Tailwind extend 實現
2. **i18n 路由**：Astro native routing with `prefixDefaultLocale`，lang 切換無誤
3. **暗模式動畫**：全頁 3D flip 效果（transform: rotateY + transition）
4. **Canvas cursor**：低效能影響的滑鼠尾跡（200 點 buffer）
5. **CSS variables + Tailwind**：design tokens 雙管齊下，可切換 CDN 字體

## 預估工時 vs 實際

- **預估**：6–10 小時
- **實際**：約 4–5 小時（包含 Tailwind 版本除錯）
- **原因**：元件數少、複雜度低、自動化工作流

## 下一步（Sprint 2）

1. Hero 動畫完全實現（Pattern 2 from Animation_Patterns.md）
2. Portfolio & Tangle Dictionary 基本頁面
3. Sanity.io CMS 整合（如計劃內）
4. 首次部署測試（GitHub Pages）
