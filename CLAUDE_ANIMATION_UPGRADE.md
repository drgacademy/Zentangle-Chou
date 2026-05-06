# Zentangle Chou 動畫升級指令

## 目標
讓整個網站充滿禪繞畫手繪感，滾動時有畫筆一筆一畫的感覺，讓人感到放鬆寧靜。

## 工作目錄
`C:\Users\George Huang\.openclaw\workspace\Zentangle-Chou\site`

## 重要規則
- 作者 = **YuChiao Chou**（不是 Dr. G. Academy）
- 所有編碼工作由你執行，不要只寫計畫
- build 成功後 commit + push
- 使用繁體中文（zh-TW）內容

---

## 任務 1：文字手繪書寫效果（HandwritingReveal）

### 說明
讓標題文字像毛筆一筆一畫寫出來，不是單純淡入。

### 實現方式
- 建立 `src/components/common/HandwritingReveal.tsx`
- 用 SVG `stroke-dasharray` + `stroke-dashoffset` 動畫
- 文字轉成 SVG path（或直接用 CSS clip-path 模擬）
- 簡化版：用 CSS `background-clip: text` + `linear-gradient` 動畫模擬書寫感
- 更簡化版：文字逐字顯示，每個字 delay 0.05s，像打字機但更像書寫

### 使用位置
- Hero 區的標題「一筆一畫，皆是可能」
- 各 section 的大標題

---

## 任務 2：墨暈過渡效果（InkTransition）

### 說明
頁面切換或滾動到特定區域時，像墨水滴入水中一樣暈開。

### 實現方式
- 建立 `src/components/common/InkTransition.tsx`
- 用 Canvas 2D 或純 CSS
- 暗模式：白色墨暈在黑色背景上暈開
- 亮模式：黑色墨暈在白色背景上暈開
- 簡化版：用 radial-gradient 動畫模擬墨暈擴散

### 使用位置
- 頁面首次載入時
- 可選：section 之間的過渡

---

## 任務 3：手繪邊框效果（SketchBorder）

### 說明
讓卡片的邊框看起來像手繪的，不是完美的直線。

### 實現方式
- 建立 `src/components/common/SketchBorder.tsx`
- SVG path 用輕微的隨機抖動模擬手繪感
- 或使用 CSS `border-radius` 的不對稱值
- 或 filter: url(#roughpaper) 效果

### 使用位置
- Tile 卡片
- PortfolioCard
- TangleCard

---

## 任務 4：滾動墨線裝飾（ScrollInkLines）

### 說明
頁面兩側有像書法捲軸一樣的裝飾線，滾動時線條會隨之移動。

### 實現方式
- 建立 `src/components/common/ScrollInkLines.tsx`
- 固定在兩側的 SVG 有機曲線
- 滾動時用 `transform: translateY()` 產生視差效果
- 線條粗細變化模擬墨線

---

## 任務 5：改進現有 ScrollReveal

### 說明
現在的 ScrollReveal 只有簡單的邊框繪製，要更像手繪過程。

### 改進
- 邊框繪製加入不規則感（手繪抖動）
- 內容淡入時加入輕微的「墨暈」效果
- 可選：繪製完成後角落出現小墨點裝飾

---

## 任務 6：平滑滾動 + 視差效果

### 說明
讓滾動更流暢，像在水面上滑動。

### 實現方式
- 在 `globals.css` 加入 `scroll-behavior: smooth`
- 為背景元素加入輕微視差（parallax）
- 可選：使用 Lenis 或 Locomotive Scroll 函式庫

---

## 技術限制
- 不要加入大型函式庫（保持輕量）
- 優先使用純 CSS + 少量 React
- 尊重 `prefers-reduced-motion`
- 行動版簡化或禁用複雜效果

---

## 完成標準
1. 所有新組件建立並整合到頁面
2. `pnpm build` 成功
3. git commit + push
4. 簡短報告改了什麼

請依序完成上述任務，從最重要的開始（推薦順序：1 → 5 → 3 → 6 → 4 → 2）。
