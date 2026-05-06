# Sprint 1: Foundation — Claude Code 執行指令

> 請完整執行以下所有步驟。這是為「Zentangle Chou」個人禪繞畫作品集網站建立基礎架構。

## Step 0：先讀以下檔案（按順序）

所有參考檔案位於：
`C:\Users\George Huang\.openclaw\workspace\Zentangle-Chou\reference\Zentangle\Personal_Zentangle_Site_Brief_2026-05\`

1. `Claude_Code_Project_Brief.md`（主企劃書，特別注意 Part 1、Part 2、Part 4、Part 5）
2. `Visual_Mockups\Color_Palette.md`
3. `Visual_Mockups\Typography_System.md`
4. `Visual_Mockups\Animation_Patterns.md`
5. `Visual_Mockups\Component_Library.md`

讀完後簡述你理解到的「核心美學」（不超過 3 句），然後再開始動手。

## Step 1：建立專案

在 `C:\Users\George Huang\.openclaw\workspace\Zentangle-Chou` 這個目錄下初始化 Astro 專案（注意：這個目錄已經有 git repo 和 README，請在現有目錄內初始化，或建立子資料夾 `site/`）：

```bash
# 請在現有 repo 內建立子目錄，避免覆蓋已存在的 README
cd "C:\Users\George Huang\.openclaw\workspace\Zentangle-Chou"
mkdir site && cd site
pnpm create astro@latest . -- --template minimal --typescript strict --install --git
```

選項：
- 是否安裝依賴：是
- 是否初始化 git：否（上層已有）
- TypeScript strict mode：是

加裝以下：

```bash
pnpm add -D tailwindcss @tailwindcss/typography postcss autoprefixer
pnpm add -D @astrojs/tailwind @astrojs/react @astrojs/sitemap
pnpm add react@18 react-dom@18 framer-motion
pnpm add @types/react @types/react-dom -D
pnpm add @sanity/client @sanity/image-url
pnpm add -D vitest @vitest/ui playwright @playwright/test
```

## Step 2：設定檔

**`astro.config.mjs`**：

```js
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://drgacademy.github.io/Zentangle-Chou',
  output: 'static',
  integrations: [
    tailwind({ applyBaseStyles: false }),
    react(),
    sitemap(),
  ],
  i18n: {
    defaultLocale: 'zh',
    locales: ['zh', 'en'],
    routing: {
      prefixDefaultLocale: true,
    },
  },
});
```

**`tailwind.config.ts`**：完整貼入 `Color_Palette.md` 與 `Typography_System.md` 的 config。

**`tsconfig.json`**：加 path alias

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@layouts/*": ["src/layouts/*"],
      "@lib/*": ["src/lib/*"]
    }
  }
}
```

## Step 3：建立資料夾結構

依 `Component_Library.md` 建立：

```
site/src/
├── pages/
│   ├── index.astro
│   ├── zh/
│   │   └── index.astro
│   └── en/
│       └── index.astro
├── components/
│   ├── layout/
│   ├── ui/
│   ├── hero/
│   ├── portfolio/
│   ├── tangles/
│   └── cursor/
├── content/
│   └── config.ts
├── i18n/
│   ├── zh.json
│   ├── en.json
│   └── useT.ts
├── styles/
│   ├── globals.css
│   └── tokens.css
├── tokens/
│   ├── colors.ts
│   ├── fonts.ts
│   └── animations.ts
└── lib/
    ├── sanity.ts
    └── seo.ts
```

## Step 4：design tokens 落實

依 `Color_Palette.md` 與 `Typography_System.md`：
1. 把所有 CSS variables 寫進 `src/styles/tokens.css`
2. `src/styles/globals.css` import tokens.css，加上 base styles
3. `src/tokens/colors.ts` & `fonts.ts` & `animations.ts` 用 `as const` 輸出

## Step 5：字體策略

由於 self-host 中文字體需要 subset 工具，**Sprint 1 先使用 Google Fonts CDN**：
- 在 `Layout.astro` 的 `<head>` 加入 Google Fonts link
- 使用 `font-display: swap`
- 字體：Noto Serif TC、Lora、Caveat Brush
- Sprint 2 再評估是否轉為 self-host

## Step 6：建立 Layout 與基本元件

依 `Component_Library.md`：

1. `src/layouts/Layout.astro`：根 layout
2. `src/components/layout/SiteHeader.astro`：頂部 nav
3. `src/components/layout/SiteFooter.astro`：頁尾
4. `src/components/layout/LanguageSwitcher.astro`：zh ↔ en
5. `src/components/layout/ThemeToggle.tsx`：暗模式 toggle
6. `src/components/cursor/TangleCursor.tsx`：自訂 cursor（參考 `Animation_Patterns.md` Pattern 3）

## Step 7：i18n 系統

`src/i18n/zh.json`：

```json
{
  "site": {
    "title": "Zentangle Chou — 禪繞畫個人作品集",
    "description": "台灣個人創作者的禪繞畫作品集..."
  },
  "nav": {
    "home": "首頁",
    "portfolio": "作品集",
    "tangles": "圖樣字典",
    "videos": "影片",
    "process": "創作流程",
    "about": "關於",
    "contact": "聯絡"
  }
}
```

`src/i18n/en.json`：對應翻譯。

`src/i18n/useT.ts`：簡單 hook。

## Step 8：首頁 placeholder

`src/pages/zh/index.astro` 與 `src/pages/en/index.astro`：

顯示主標「一筆一畫，皆是可能」with 中文字體，確認 i18n 與字體載入正常。

## Step 9：GitHub Pages 部署設定

1. 確保 `site/` 內的 build output 指向 `dist`
2. 在 `../.github/workflows/deploy.yml` 建立 GitHub Actions workflow
3. Build command: `cd site && pnpm build`
4. Output: `site/dist`

## Step 10：Acceptance Criteria

執行下列驗證，全部通過才算完成：

- [ ] `pnpm dev` 跑起來無錯誤
- [ ] 訪問 `/zh/` 顯示 placeholder + 主標 with 中文字體
- [ ] 訪問 `/en/` 顯示英文 placeholder
- [ ] 點 LanguageSwitcher 從 `/zh/` 切到 `/en/` 保留同 path
- [ ] 切換 dark mode 背景變黑
- [ ] 桌機 hover 滑鼠看得到 cursor trail
- [ ] `pnpm build` 成功
- [ ] git commit 並 push

## Step 11：commit + 寫報告

commit message：

```
chore: complete Sprint 1 — Foundation

- Project init with Astro 4.x + TypeScript + Tailwind
- Design tokens (colors, fonts, animations) wired
- i18n routing (zh / en) with language switcher
- Layout components (Header, Footer, ThemeToggle)
- TangleCursor (canvas-based)
- GitHub Actions deploy setup
```

在 `site/docs/sprints/sprint-1-report.md` 寫簡短報告：完成項目、卡關點、偏離決策、Sprint 2 啟動前需確認的事。

### 如果遇到問題

若某個決策有兩個合理選項，**停下來明確列出兩個選項與優缺**，等使用者回應再繼續——不要私自決定影響整體美學的事。

---

開始吧。整個 sprint 完成預估 6–10 小時。請每完成一個 step 簡短摘要給使用者。
