# Component Library — 個人禪繞畫網站

完整的 React / Astro 元件清單。Sprint 1–5 會依序建立。

---

## 命名規則

- **Astro 元件**：`.astro` 副檔名（純 HTML/CSS，no client JS）
- **React 元件（互動）**：`.tsx`，需 `client:*` directive 才會 hydrate
- **元件名 PascalCase**，檔名同名
- **資料夾依功能分組**：`layout/`, `ui/`, `hero/`, `portfolio/`, `tangles/`, `cursor/`

---

## Layout 元件（src/components/layout/）

### `SiteHeader.astro`
**用途**：全站頂部導航。
**Props**：`{ currentPath: string, lang: 'zh' | 'en' }`
**結構**：logo + 6 個 nav item + LanguageSwitcher + ThemeToggle
**動畫**：scroll 過 100px 後 backdrop-blur + 縮短 padding

### `SiteFooter.astro`
**用途**：全站頁尾。
**Props**：`{ lang: 'zh' | 'en' }`
**結構**：3 欄（Learn / Connect / About）+ social icons + copyright
**特殊**：右下角 ambient Mooka 藤蔓動畫

### `LanguageSwitcher.astro`
**用途**：切換 zh / en。
**Props**：`{ currentPath: string }`
**邏輯**：保留同一 path，只換 `/zh` ↔ `/en` prefix
**a11y**：`hreflang` 屬性

### `ThemeToggle.tsx` (client:idle)
**用途**：切換 light / dark mode。
**動畫**：tile flip 1s rotateY
**儲存**：`localStorage['theme']` + 初始時讀取系統偏好

### `MobileNav.tsx` (client:idle)
**用途**：行動版 bottom nav。
**Props**：`{ currentPath: string }`
**結構**：5 個圖示按鈕（Home / Portfolio / Tangles / About / Menu）

### `PageTransition.tsx` (client:load)
**用途**：頁面切換動畫 wrapper。
**特殊**：與 Astro ViewTransitions 整合

### `Layout.astro`
**用途**：所有頁面 wrap 用的根 layout。
**Props**：`{ title, description, ogImage?, lang, currentPath, noIndex? }`
**結構**：`<html lang>` → `<head>`（meta、hreflang、preload fonts）→ `<body>` → SiteHeader + slot + SiteFooter + TangleCursor + MobileNav

---

## UI 元件（src/components/ui/）

### `Tile.astro`
**用途**：通用「紙磚」容器。
**Props**：`{ class?: string }`
**樣式**：white bg + 1px ink-200 border + soft shadow + rounded-sm

### `DrawnPath.tsx` (client:visible)
**用途**：單條 SVG path 帶 draw animation。
**Props**：`{ d, duration?, delay?, stroke?, strokeWidth?, loop? }`

### `DrawnLink.astro`
**用途**：連結，hover 時下方 string 畫出來。
**Props**：`{ href, class? }`

### `DrawnButton.astro`
**用途**：按鈕，hover 時邊框 string 畫出來。
**Props**：`{ variant: 'primary' | 'ghost', size?: 'sm' | 'md' | 'lg' }`
**Primary**：bg-ink-700 + text-white + hover string outline
**Ghost**：transparent + border-ink-300 + hover string outline

### `ScrollCue.astro`
**用途**：首頁向下捲動提示。
**動畫**：垂直細線從上而下 loop draw（5s）+ 「↓」箭頭

### `Tag.astro`
**用途**：tangle / mood / year 等 tag。
**Props**：`{ label, variant?: 'default' | 'active' | 'subtle' }`

### `Lightbox.tsx` (client:idle)
**用途**：作品 detail 的圖片放大檢視。
**Props**：`{ images: { url, alt }[], initialIndex }`
**特殊**：鍵盤 ←→ 切換、ESC 關閉、pinch zoom

### `LqipImage.astro`
**用途**：blur placeholder 圖片。
**Props**：`{ src, alt, lqip, width, height, sizes?, loading? }`
**整合**：Cloudinary / Sanity image 自動 srcset

### `Quote.astro`
**用途**：引言區塊（Maria Thomas、Rick Roberts 名言）。
**Props**：`{ author?, role?, lang? }`
**樣式**：左側引用線、italic、置中

### `SkipLink.astro`
**用途**：a11y 跳到主內容。
**位置**：layout 第一個元素，`:focus-visible` 才顯示

---

## Hero 元件（src/components/hero/）

### `HeroAnimation.tsx` (client:visible)
**用途**：首頁 8 步驟 hero 動畫。
**邏輯**：見 `Animation_Patterns.md` Pattern 2
**Fallback**：`prefers-reduced-motion` 直接顯示終態 + 標題立即 fade

### `HeroTitle.astro`
**用途**：hero 主標 + 副標。
**Props**：`{ lang }`
**特殊**：fade in 在動畫結束後 9s

### `HeroBackground.astro`
**用途**：hero 區塊的背景 layer（紙磚紋理 SVG）。
**樣式**：subtle paper grain texture，opacity 0.05

---

## Portfolio 元件（src/components/portfolio/）

### `PortfolioGrid.tsx` (client:idle)
**用途**：作品瀑布流主元件。
**Props**：`{ artworks: Artwork[], lang }`
**狀態**：filter（year / mood / tangle）+ sort
**Layout**：CSS columns masonry

### `PortfolioCard.astro`
**用途**：單張作品卡片。
**Props**：`{ artwork: Artwork, lang }`
**特殊**：hover 時 SVG overlay path drawing

### `FilterBar.tsx` (client:idle)
**用途**：作品集 filter bar。
**Props**：`{ value, onChange, options: { years, moods, tangles } }`
**結構**：3 個 dropdown（年 / mood / tangle）+ 排序

### `SortDropdown.tsx` (client:idle)
**用途**：排序下拉。
**Props**：`{ value: 'newest' | 'oldest' | 'a-z', onChange }`

### `ArtworkDetail.astro`
**用途**：作品 detail 頁主體。
**Props**：`{ artwork, relatedArtworks, lang }`

### `ArtworkGallery.tsx` (client:idle)
**用途**：作品 detail 的細節圖 gallery。
**Props**：`{ images, mainImage }`
**特殊**：點擊任一圖開 Lightbox

### `RelatedArtworks.astro`
**用途**：底部「相關作品」row。
**Props**：`{ artworks: Artwork[], excludeSlug }`

---

## Tangle Dictionary 元件（src/components/tangles/）

### `TangleDictionary.tsx` (client:idle)
**用途**：41 個 tangle 字典主元件。
**Props**：`{ tangles: Tangle[], lang }`
**狀態**：filter（family / difficulty / category）+ search

### `TangleCard.astro`
**用途**：單一 tangle 卡片。
**Props**：`{ tangle, lang }`
**結構**：縮圖 SVG + 名（en + zh）+ 創作者 + 難度星

### `TangleStepAnimation.tsx` (client:visible)
**用途**：tangle detail 的步驟動畫。
**Props**：`{ steps: TangleStep[], viewBox, loopGap? }`
**功能**：自動 loop、可暫停、可重播
**Code**：見 `Claude_Code_Project_Brief.md` Part 6.2.3

### `TangleFilter.tsx` (client:idle)
**用途**：字典 filter bar。
**Props**：`{ value, onChange }`
**結構**：family pills + difficulty stars + category checkboxes

### `TangleSearch.tsx` (client:idle)
**用途**：搜尋框（與 Pagefind 整合）。
**Props**：`{ onSearch, lang }`

### `TangleStepList.astro`
**用途**：步驟文字列表（搭配 step animation）。
**Props**：`{ steps: string[], lang }`

### `TangleMetadata.astro`
**用途**：tangle 的 meta 資訊區（創作者、年份、家族）。
**Props**：`{ tangle, lang }`

### `RelatedTangles.astro`
**用途**：底部「相關 tangle」row。
**Props**：`{ tangles: Tangle[], excludeSlug }`

---

## Process 元件（src/components/process/）

### `EightSteps.tsx` (client:visible)
**用途**：互動式 8 步驟方法。
**Props**：`{ steps: ProcessStep[], lang }`
**狀態**：currentStep
**結構**：上方 8 個 tab + 下方詳細內容（含 SVG 動畫）

### `ProcessStep.astro`
**用途**：單一步驟詳細內容。
**Props**：`{ step, lang }`

---

## Video 元件（src/components/videos/）

### `VideoEmbed.tsx` (client:idle)
**用途**：影片嵌入（lazy-load）。
**Props**：`{ embedId, provider, thumbnail, title }`
**特殊**：點擊才嵌入（不自動載 iframe）

### `VideoCard.astro`
**用途**：影片牆的卡片。
**Props**：`{ video, lang }`

### `VideoGrid.tsx` (client:idle)
**用途**：影片牆 + filter（type）。
**Props**：`{ videos, lang }`

---

## Cursor 元件（src/components/cursor/）

### `TangleCursor.tsx` (client:idle, only desktop)
**用途**：自訂 cursor trail。
**Code**：見 `Claude_Code_Project_Brief.md` Part 2.4.3
**Render condition**：`!matchMedia('(pointer: coarse)').matches && !matchMedia('(prefers-reduced-motion)').matches`

---

## Form 元件（src/components/forms/）

### `ContactForm.tsx` (client:idle)
**用途**：聯絡表單。
**Props**：`{ lang }`
**整合**：Web3Forms / Formspree
**驗證**：HTML5 + 自製錯誤訊息
**特殊**：送出按鈕 hover 時 button 邊緣 string 畫出來

### `NewsletterForm.tsx` (client:idle)
**用途**：電子報訂閱（v2 才用）。
**整合**：Buttondown API

---

## SEO 元件（src/components/seo/）

### `SEO.astro`
**用途**：所有頁面的 meta tags wrapper。
**Props**：`{ title, description, image?, type?, lang, currentPath, noIndex? }`
**輸出**：title、description、og:*、twitter:*、hreflang、canonical

### `JsonLd.astro`
**用途**：schema.org JSON-LD 注入。
**Props**：`{ data: object }`

### `Breadcrumbs.astro`
**用途**：麵包屑（SEO + 視覺）。
**Props**：`{ items: { label, href }[] }`
**特殊**：emit BreadcrumbList schema

---

## 元件依賴圖

```
Layout.astro
├── SiteHeader
│   ├── LanguageSwitcher
│   └── ThemeToggle
├── PageTransition
├── [page content]
├── SiteFooter
├── TangleCursor (desktop only)
└── MobileNav (mobile only)

Home page
├── HeroAnimation
│   └── HeroTitle
├── PortfolioRow（橫向 scroll）
│   └── PortfolioCard × 6
└── Tile（quote）

Portfolio page
├── FilterBar
│   └── Tag × N
└── PortfolioGrid
    └── PortfolioCard × N
        └── LqipImage

Portfolio detail
├── Breadcrumbs
├── ArtworkDetail
│   ├── ArtworkGallery
│   │   └── Lightbox
│   ├── TangleList（連到字典）
│   └── ArtworkMetadata
└── RelatedArtworks

Tangle dictionary
├── TangleSearch
├── TangleFilter
└── (Masonry of) TangleCard

Tangle detail
├── Breadcrumbs
├── TangleStepAnimation
├── TangleStepList
├── TangleMetadata
├── ExampleArtworks
└── RelatedTangles

Process page
└── EightSteps
    └── ProcessStep × 8

Videos page
├── VideoFilter
└── VideoGrid
    └── VideoCard
        └── VideoEmbed

Contact page
└── ContactForm
```

---

## 預估工時（每元件）

| 類別 | 元件數 | 平均工時 | 小計 |
|---|---|---|---|
| Layout | 7 | 30 min | 3.5 hr |
| UI 基礎 | 11 | 20 min | 3.7 hr |
| Hero | 3 | 1.5 hr | 4.5 hr |
| Portfolio | 7 | 30 min | 3.5 hr |
| Tangle | 8 | 30 min | 4.0 hr |
| Process | 2 | 1 hr | 2.0 hr |
| Video | 3 | 20 min | 1.0 hr |
| Cursor | 1 | 1 hr | 1.0 hr |
| Form | 2 | 30 min | 1.0 hr |
| SEO | 3 | 20 min | 1.0 hr |
| **小計** | **47** | — | **25 hr** |

加上整合、debug、跨裝置測試，總計約 30–40 hr——對應 Claude Code 主導的 5 個 sprint 總時數。
