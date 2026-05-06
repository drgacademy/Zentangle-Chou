# Sprint 3: Portfolio — Claude Code Prompt

> 前置條件：Sprint 1 + Sprint 2 完成。
> 預估 wall-clock：6–10 小時。

---

## 給 Claude Code 的指令

你正執行 Sprint 3：Portfolio（作品集瀑布流 + Detail 頁 + Cloudinary 整合）。

### Step 0：閱讀順序

1. `C:\Claude\DrG_Academy\Personal_Zentangle_Site_Brief_2026-05\Claude_Code_Project_Brief.md` Part 3.2.2、3.2.3、Part 5.1（Artwork schema）、Part 6.3
2. `C:\Claude\DrG_Academy\Personal_Zentangle_Site_Brief_2026-05\Visual_Mockups\Animation_Patterns.md` Pattern 6（Portfolio Card hover）
3. `docs/sprints/sprint-2-report.md`

### Step 1：Sanity 內容導入

如果 Sanity Studio 還沒有作品資料：
1. 詢問使用者：「請放至少 8 件作品於 `C:\Claude\DrG_Academy\Personal_Zentangle_Site_Brief_2026-05\artworks-input\` 資料夾，每件含：高解析圖（≥ 2000×2000）、標題（zh/en）、年份、tile 尺寸、使用 tangle 列表、創作筆記（zh/en）」
2. 若使用者沒空準備，**先用 placeholder**：8 件假資料（cover image 用 https://placeholder.com/2000 + 隨機 caption）

寫一支 import 腳本 `scripts/seed-artworks.ts` 用 Sanity SDK 一次匯入。

### Step 2：Cloudinary 整合（如果用）

替代方案：直接用 Sanity 內建 image CDN（簡單但少 AVIF）。

**選 Cloudinary 的話**：
1. 註冊 Cloudinary 免費帳號
2. 環境變數：`CLOUDINARY_CLOUD_NAME`、`CLOUDINARY_API_KEY`、`CLOUDINARY_API_SECRET`
3. 上傳 preset：建立 unsigned preset `zentangle_portfolio`
4. 寫 `src/lib/cloudinary.ts`：

```ts
export function cld(publicId: string, opts: { w?: number; h?: number; q?: 'auto' | number; f?: 'auto' | 'avif' | 'webp' } = {}) {
  const { w, h, q = 'auto', f = 'auto' } = opts;
  const cloud = import.meta.env.PUBLIC_CLOUDINARY_CLOUD_NAME;
  const transforms = [
    `f_${f}`,
    `q_${q}`,
    w && `w_${w}`,
    h && `h_${h}`,
    'c_fill',
    'g_auto',
    'dpr_auto',
  ].filter(Boolean).join(',');
  return `https://res.cloudinary.com/${cloud}/image/upload/${transforms}/${publicId}`;
}
```

5. `LqipImage.astro` 自動產 srcset：

```astro
---
const { src, alt, lqip, sizes = '(min-width: 768px) 33vw, 100vw' } = Astro.props;
const widths = [320, 640, 960, 1280, 1920];
const srcset = widths.map(w => `${cld(src, { w })} ${w}w`).join(', ');
---
<img
  src={cld(src, { w: 640 })}
  srcset={srcset}
  sizes={sizes}
  alt={alt}
  loading="lazy"
  decoding="async"
  style={`background-image: url(${lqip}); background-size: cover;`}
/>
```

### Step 3：Portfolio 列表頁

`src/pages/[lang]/portfolio/index.astro`：

1. fetch 所有 artworks（依 `sort_order` 與 `created_at`）
2. 顯示 H1 + filter bar + masonry grid
3. CSS columns masonry：
   ```css
   .masonry { column-count: 2; column-gap: 1rem; }
   @media (min-width: 768px) { .masonry { column-count: 3; } }
   @media (min-width: 1024px) { .masonry { column-count: 4; } }
   .masonry > * { break-inside: avoid; margin-bottom: 1rem; }
   ```
4. FilterBar 是 React island（互動）：
   - 篩 year（dropdown）
   - 篩 mood（pills）
   - 篩 tangle used（auto-complete search）
   - filter 變更時用 Framer Motion `layout` animation 重排

### Step 4：PortfolioCard

```astro
---
import { cld } from '@/lib/cloudinary';
const { artwork } = Astro.props;
---
<a href={`/${lang}/portfolio/${artwork.slug}`} class="block group relative break-inside-avoid">
  <div class="relative overflow-hidden">
    <LqipImage
      src={artwork.cover_image}
      alt={artwork.title_zh}
      lqip={artwork.lqip}
    />
    {/* hover overlay：主 tangle 線條重新 draw */}
    <svg class="absolute inset-0 w-full h-full pointer-events-none opacity-0 group-hover:opacity-70 transition-opacity">
      <path d={artwork.outline_path} class="hover-draw" stroke="white" stroke-width="1.5" fill="none" />
    </svg>
  </div>
  <div class="mt-3">
    <h3 class="font-heading text-lg text-ink-700">{artwork.title_zh}</h3>
    <p class="text-sm text-ink-400 mt-1">{artwork.year} · {artwork.tile_size}</p>
  </div>
</a>
```

### Step 5：Portfolio Detail 頁

`src/pages/[lang]/portfolio/[slug].astro`：

實作 `Claude_Code_Project_Brief.md` Part 3.2.3 的所有區塊：

1. 麵包屑：作品集 / [作品名]
2. 主圖（最大 1600px、可 zoom 用 `Lightbox`）
3. H1 + meta（年份、tile size、材料）
4. 「使用了哪些 tangle」chips（每個連 `/tangles/[name]`）
5. 創作筆記（zh / en 並列或切換）
6. 細節照片 gallery（縮圖網格，點開 lightbox）
7. 販售狀態（如有）
8. 相關作品 row（同 series 或 mood）

進場動畫：用 Astro ViewTransitions，主圖從上一頁卡片位置 morph 到大圖位置（`transition:name="artwork-{slug}"`）。

### Step 6：Lightbox

`src/components/ui/Lightbox.tsx`：

- 點擊任一圖開啟 modal
- ←→ 鍵切換
- ESC 關閉
- pinch zoom（用 `react-easy-crop` 或自製 transform）
- 背景 fade in
- 圖片用 max-resolution loaded（不是 thumbnail）

### Step 7：SEO 與 schema.org

每件作品 detail 頁注入：

```json
{
  "@context": "https://schema.org",
  "@type": "VisualArtwork",
  "name": "...",
  "creator": { "@type": "Person", "name": "Dr. G." },
  "dateCreated": "2025-09-15",
  "artform": "Zentangle",
  "artMedium": "Sakura Pigma Micron pen, graphite pencil, 100% cotton paper",
  "width": { "@type": "Distance", "value": "9 cm" },
  "height": { "@type": "Distance", "value": "9 cm" },
  "image": "...",
  "url": "..."
}
```

Portfolio 列表頁注入 `ItemList` schema。

### Acceptance Criteria

- [ ] `/zh/portfolio` 顯示 8+ 件作品 masonry
- [ ] FilterBar 篩 year / mood / tangle 都正確（用 React island，無 reload）
- [ ] hover 卡片：SVG overlay path drawing 動畫 0.5s
- [ ] 點任一卡：跳到 detail 頁，主圖有 morph 動畫
- [ ] Detail 頁 lightbox：←→ 鍵盤切換、ESC 關閉、pinch zoom
- [ ] LCP < 2.5s（首頁 + portfolio 列表）
- [ ] thumbnail < 80KB（AVIF）；detail 主圖 < 300KB
- [ ] schema.org JSON-LD 用 https://search.google.com/test/rich-results 驗證 pass
- [ ] hreflang 雙語都對
- [ ] Lighthouse 全部 ≥ 90
- [ ] git commit ≥ 6

### Step 8：commit + 報告

寫 `docs/sprints/sprint-3-report.md`：完成項、image 策略決策（Cloudinary vs Sanity native）、Sprint 4 之前需確認 8 個重點 tangle 的順序。

開始吧。預估 6–10 小時。
