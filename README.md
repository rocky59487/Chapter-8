# Lumina · 互動學習平台

> 一個內容驅動、遊戲化的學習平台。體驗向 Duolingo 看齊：**先教所有基礎、做小測驗、
> 闖關，最後挑戰考卷**，全程有互動動畫、吉祥物與音效。
>
> 核心理念：**引擎與內容分離**。一門課程只是一份 JSON「課程包」。把題目交給 AI，
> 依 [`app/docs/AUTHORING.md`](app/docs/AUTHORING.md) 產生課程包，平台就能渲染出
> 對應的完整教學——**不需要改任何程式碼**。

第一個內建課程是這份 repo 附的微積分**第 8 章**考卷（極限、無窮級數、多項式微積分、
定積分、微積分基本定理），由原始考卷 (`*.jpg`) 與 AI 範本
(`liquid_glass_calculus_lab.html`) 重新打造成正式版。

## 專案位置

完整應用程式在 [`app/`](app/) 目錄。

```bash
cd app
pnpm install
pnpm dev        # 本機開發 http://localhost:5173
pnpm build      # 產生正式版到 app/dist
pnpm preview    # 預覽正式版
```

## 主要特色

- **學習路徑**：技能樹式關卡地圖，逐關解鎖，含教學關、練習關、單元測驗與期末考卷。
- **遊戲化**：XP / 等級進度、愛心（答錯扣血、會回復）、連續學習 streak、滿分皇冠、
  過關彩帶與結算畫面。
- **互動元件**：以 Canvas/SVG 即時繪製的動畫——函數圖、黎曼和、累積（符號）面積、
  動態切線、無窮級數收斂、配合題小圖。全部可由課程包用 `expr` 字串宣告。
- **多題型**：單選、是非、填充（分數/小數/文字自動正規化）、配合（可配圖）、排序。
- **吉祥物 Lumi**：純 SVG 角色，會依答題狀況變換表情並給鼓勵。
- **音效**：Web Audio 即時合成，無外部音檔，可一鍵靜音、離線可用。
- **深/淺色主題**、響應式、行動優先。
- **課程庫 / 匯入課程包**：可貼上 JSON、上傳檔案或從網址載入新課程（更新包模式）。
- **可打包成 APK**：已內建 Capacitor 設定與 PWA / 離線 service worker。
  見 [`app/docs/BUILD_ANDROID.md`](app/docs/BUILD_ANDROID.md)。

## 技術架構

- **Vite + React + TypeScript**，Tailwind CSS 設計系統，Framer Motion 動畫，
  Zustand 狀態（進度/設定持久化），KaTeX 數學渲染。
- **Hash router**（可在 `file://` WebView 下運作，利於 APK）。
- **課程包 schema** 定義於 `app/src/types/pack.ts`；引擎依 schema 渲染任何課程。
- **互動元件登錄表** `app/src/components/widgets/registry.tsx`：新增互動型別只要註冊即可。

## 文件

- 課程包撰寫指南（含給 AI 的產生 prompt 範本）：[`app/docs/AUTHORING.md`](app/docs/AUTHORING.md)
- Android APK 打包步驟：[`app/docs/BUILD_ANDROID.md`](app/docs/BUILD_ANDROID.md)
