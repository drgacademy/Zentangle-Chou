# 後台 (Sanity Cloud) 設定指南

這份指南會帶你把 Sanity Studio 接到網站,讓你能用瀏覽器登入後台、上傳作品、貼 YouTube 連結、編輯文案,publish 後 GitHub Pages 自動重新建置上線。

---

## 為什麼是 Sanity?

- **免費額度足夠**:單站作品集每月 API 用量遠低於免費上限
- **網站維持靜態**:Astro 在 build 時拉資料,訪客不會打到 Sanity API,GitHub Pages 仍可繼續使用
- **管理介面成熟**:支援圖片裁切熱點、Portable Text、即時協作、版本歷史
- **雙語友善**:每個欄位都可以用 `{ zh, en }` 物件直接編輯

---

## 一次性設定 (約 15 分鐘)

### 1. 建立 Sanity 帳號與專案

```bash
cd site
pnpm dlx sanity@latest init --create-project "Zentangle Chou" --dataset production
```

它會引導你登入或註冊,建立一個新專案,並輸出:
- **Project ID** (例:`abc123xy`)
- **Dataset name**:`production`

### 2. 安裝 Studio 相依套件

預設沒裝 `sanity` 與 `@sanity/vision`,因為它們僅給 Studio 用。

```bash
cd site
pnpm add -D sanity @sanity/vision styled-components tsx
```

### 3. 建立 `.env.local`

```bash
cp .env.local.example .env.local
```

在 `.env.local` 填入:

```
SANITY_PROJECT_ID=你的 project id
SANITY_DATASET=production
SANITY_API_READ_TOKEN=
SANITY_API_WRITE_TOKEN=
SANITY_STUDIO_PROJECT_ID=你的 project id
SANITY_STUDIO_DATASET=production
```

### 4. 取得 Read / Write Token

1. 進入 https://sanity.io/manage 找到你的專案
2. **API → Tokens → Add API token**
3. 建立兩個 token:
   - `read-token`,權限選 Viewer → 貼到 `SANITY_API_READ_TOKEN`
   - `write-token`,權限選 Editor → 貼到 `SANITY_API_WRITE_TOKEN`(僅 seed 腳本用)

### 5. 把現有的 41 個 tangle 與 8 個 artwork 一次性匯入 Sanity

```bash
cd site
pnpm seed
```

成功後,你會在 Sanity Studio 看到所有現存內容已經就位。

### 6. 啟動 Studio

```bash
cd site
pnpm sanity:dev
```

開啟 http://localhost:3333,登入後就可以開始上傳作品了。

### 7. 部署 Studio (二擇一)

**A. Sanity 託管 (推薦)**

```bash
pnpm sanity:deploy
```

它會問你想要的子網域,確認後 Studio 上線於 `<你選的名字>.sanity.studio`,以後從任何裝置瀏覽器登入即可。

**B. 跟主站同網域** (可選,進階)

可以把 Studio 嵌入 Astro 的 `/admin` 路由 (需另寫 React island)。預設不做,維持簡單。

---

## 接通網站 (build-time 拉資料)

### 1. 更新 GitHub Repository Secrets

到 GitHub repo → **Settings → Secrets and variables → Actions** 新增:

| Secret | 內容 |
|---|---|
| `SANITY_PROJECT_ID` | 你的 Project ID |
| `SANITY_DATASET` | `production` |
| `SANITY_API_READ_TOKEN` | 步驟 4 建立的 read token |
| `SANITY_WEBHOOK_TOKEN` | 隨意一段長密碼,給 webhook 驗證用 |

### 2. 修改 `.github/workflows/deploy.yml`

把 `pnpm build` 那一步加上環境變數:

```yaml
      - name: Build
        run: pnpm build
        working-directory: site
        env:
          SANITY_PROJECT_ID: ${{ secrets.SANITY_PROJECT_ID }}
          SANITY_DATASET: ${{ secrets.SANITY_DATASET }}
          SANITY_API_READ_TOKEN: ${{ secrets.SANITY_API_READ_TOKEN }}
```

並在 trigger 新增 `repository_dispatch`:

```yaml
on:
  push: { branches: [main] }
  workflow_dispatch:
  repository_dispatch:
    types: [sanity-publish]
```

### 3. 在 Sanity 設定 publish webhook

到 Sanity manage → **API → Webhooks → Create webhook**:

- **URL**: `https://api.github.com/repos/drgacademy/Zentangle-Chou/dispatches`
- **Method**: POST
- **HTTP Headers**:
  ```
  Authorization: Bearer <GitHub Personal Access Token with repo scope>
  Accept: application/vnd.github.v3+json
  ```
- **Trigger on**: Create / Update / Delete
- **Filter**: `_type in ["artwork", "tangle", "video", "homepage", "aboutPage", "siteSettings"]`
- **Body**:
  ```json
  { "event_type": "sanity-publish" }
  ```

從現在起,你在 Studio publish 任何文件,GitHub Actions 約 90 秒後完成重新建置,新內容上線。

---

## 日常使用流程

```
你 → sanity studio (瀏覽器) → 編輯作品 → publish
                                          ↓ (自動)
                          GitHub Actions 重新 build
                                          ↓
                              GitHub Pages 上線 (~ 90s)
```

---

## 常見任務

### 新增一張作品

1. 開啟 Studio,左側點「作品」→ 右上「Create new」
2. 填中英標題、上傳主圖 (用瀏覽器拖曳即可)、選日期
3. 在「使用的圖樣」多選 — 從你的 41 個 tangle 字典裡挑
4. 寫雙語描述 (Portable Text 支援多段)
5. 勾「精選作品」會出現在首頁
6. 右下「Publish」

### 新增一支 YouTube 影片

1. 「影片」→ Create new
2. 直接貼 YouTube 完整網址 — 系統自動抽 ID
3. 寫標題與說明,publish

### 編輯首頁文案

1. 「首頁設定」(singleton — 只有一份)
2. 改 hero 標題、引言、精選作品清單
3. publish

### 不上傳圖,只設 tangles?

可以。沒有圖片時,網站會根據作品 ID + tangles 自動生成獨一無二的程式化禪繞 SVG 作為佔位,看起來像真的禪繞畫 tile。等你有時間掃描或拍照,再回來補上即可。

---

## 緊急回滾

Sanity 自動保留每個文件的所有修訂歷史。
- 在 Studio 開啟任何文件 → 右上 ⋯ → **Review changes** → 選想要回到的版本

GitHub Pages 也保留每個 commit 的部署紀錄,Actions 頁面點「Re-run」可重跑舊版。

---

## 仍未實作的進階功能 (Phase 2)

這些不在本次升級範圍,但架構已預留:

- 把 `tangles` 頁面也改吃 Sanity (目前還用 `tangles.json`)
- 在 `/zh/videos` 嵌入式播放器改吃 `fetchVideos()`
- 首頁文字改吃 `fetchHomepage()`
- 作品集列表改吃 `fetchArtworks()`,移除 `artworks.json`
- Sanity Studio 嵌入 `/admin` 路由 (跟主站同網域)
- 訪客 wall (留下「禪繞之感」短句)

完成 Sanity 帳號 + token 設定後,可一頁一頁逐步切換。每個頁面只要把 `import data from '@/data/...json'` 換成 `await fetchXxx()` 即可。
