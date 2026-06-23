# 課程包撰寫指南 (Course Pack Authoring Guide)

Lumina 的核心理念：**引擎與內容分離**。整個學習體驗（教學 → 小測 → 闖關 → 考卷、
遊戲化、互動動畫、吉祥物、音效）都由引擎負責；一門「課程」只是一份符合 schema 的
**JSON / TypeScript 物件**。要新增任何科目的課程，只要產生一份新的課程包即可，
**不需要改動任何引擎程式碼**。

> 這正是平台的目標：把題目交給 AI，AI 依照本指南輸出一份課程包，平台就能渲染出
> 對應的頂級互動教學。

---

## 1. 課程包放在哪裡

- **第一方課程**（隨 App 內建）：`src/content/<id>.ts`，並在 `src/store/packs.ts`
  的 `packs` 物件註冊。型別為 `CoursePack`（定義於 `src/types/pack.ts`）。
- **更新包 / 下載課程**（不需重新發版 App）：一份 `.json` 檔，符合相同 schema。
  使用者可在 App 內的「課程庫」用「匯入課程包」貼上 JSON、上傳檔案或輸入網址載入；
  程式會呼叫 `usePacks().registerPack(pack)` 或 `loadFromUrl(url)` 註冊到目錄。

JSON 與 TS 物件欄位完全相同（TS 版多了型別檢查）。AI 產生新課程時，**輸出 JSON 最方便**。

---

## 2. 頂層結構 `CoursePack`

```jsonc
{
  "id": "physics-kinematics",        // 全域唯一 id
  "schemaVersion": 1,
  "version": "1.0.0",                 // 內容版本，用來辨識更新包
  "title": "物理・運動學",
  "subtitle": "位移、速度、加速度",
  "description": "一句話介紹這門課。",
  "language": "zh-Hant",
  "subject": "物理",
  "icon": "🚀",                       // emoji 或短符號，顯示在課程卡與路徑標頭
  "accent": "#56c6ff",               // 主題色 (hex)
  "authors": ["你的名字"],
  "estimatedMinutes": 90,
  "units": [ /* 見 §3 */ ],
  "exam": { /* 見 §6，可省略 */ },
  "glossary": [ { "term": "速度", "definition": "位移對時間的變化率。" } ]
}
```

---

## 3. 單元 `Unit` 與關卡 `Lesson`

課程由多個 **單元 (Unit)** 組成；每個單元是學習路徑上的一段，內含一串 **關卡 (Lesson)**
節點。建議節奏：先 1～3 個 `teach`（教學）關，再 1 個 `practice`（練習），最後 1 個
`checkpoint`（單元測驗）。

```jsonc
{
  "id": "u1",
  "title": "等速度運動",
  "subtitle": "最簡單的開始",
  "color": "#56c6ff",     // 此單元路徑節點顏色
  "icon": "→",
  "lessons": [
    {
      "id": "u1l1",
      "title": "什麼是位移",
      "type": "teach",          // teach | practice | checkpoint | review
      "subtitle": "向量 vs 純量",
      "icon": "📘",             // 可省略，會依 type 自動給圖示
      "xp": 20,                  // 完成可得的基礎 XP
      "steps": [ /* 見 §4 */ ]
    }
  ]
}
```

關卡解鎖規則：路徑上**前一關完成後**才會解鎖下一關（第一關預設解鎖）。

---

## 4. 關卡步驟 `Step`

一個關卡是一連串 **步驟**，每個步驟是一個畫面。共有兩種：

### 4.1 教學步驟 `teach`

```jsonc
{
  "kind": "teach",
  "id": "u1l1s1",
  "title": "位移是向量",
  "say": "嗨～這句話會由吉祥物 Lumi 用對話框說出來（可省略）",
  "body": [ /* ContentBlock[]，見 §5 */ ]
}
```

### 4.2 題目步驟 `question`

```jsonc
{
  "kind": "question",
  "id": "u1l1q1",
  "prompt": [ /* 可省略：題目上方的情境內容 ContentBlock[] */ ],
  "question": { /* 見 §7：題型物件 */ },
  "widget": { /* 可省略：題目旁的互動元件 WidgetSpec，見 §8 */ },
  "hint": "可省略的提示（答題前可展開）",
  "explanation": [ /* 作答後顯示的詳解 ContentBlock[] */ ]
}
```

答錯時：扣一顆愛心，該題會被重新排入本關卡尾端（間隔複習）。

---

## 5. 內容區塊 `ContentBlock`

教學與詳解的內容都是 `ContentBlock[]`。每個區塊用 `t` 欄位區分型別。

| `t` | 用途 | 範例 |
| --- | --- | --- |
| `p` | 段落（支援行內語法） | `{ "t": "p", "text": "速度是 $v=\\frac{dx}{dt}$。" }` |
| `h` | 小標題 | `{ "t": "h", "text": "重點整理" }` |
| `math` | 置中顯示數學式 | `{ "t": "math", "tex": "v = v_0 + at" }` |
| `formula` | 強調的公式卡（可加名稱/註解） | `{ "t": "formula", "name": "運動方程", "tex": "s = v_0 t + \\tfrac12 a t^2", "note": "等加速度" }` |
| `steps` | 編號步驟 | `{ "t": "steps", "items": ["移項", "化簡", "代入"] }` |
| `callout` | 重點框 | `{ "t": "callout", "tone": "trap", "text": "別忘了單位換算！" }` |
| `image` | 圖片 | `{ "t": "image", "src": "...", "caption": "..." }` |
| `widget` | 嵌入互動元件 | `{ "t": "widget", "widget": { "type": "functionPlot", "params": {…} } }` |

**行內語法**（用在 `text` 欄位）：
- 行內數學：用 `$...$` 包住，例如 `這是 $x^2$`。
- 粗體：用 `**...**`。

**Callout 色調 `tone`**：`info`(概念💡) · `tip`(訣竅✨) · `trap`(陷阱⚠️) · `key`(重點🔑) · `warn`(注意🚨)。

數學一律使用 **KaTeX / LaTeX** 語法。JSON 中反斜線要跳脫成 `\\`（例如 `\\frac`、`\\int`）。

---

## 6. 考卷 `Exam`

```jsonc
{
  "id": "final",
  "title": "期末考卷",
  "intro": "涵蓋所有單元。",
  "passScore": 60,            // 及格百分比
  "sections": [
    {
      "id": "s1",
      "title": "一、是非題",
      "instructions": "正確打 ◯，錯誤打 ✕。",
      "pointsEach": 3,         // 此大題每題分數
      "questions": [ /* QuestionStep[]，同 §4.2 的 question 步驟 */ ]
    }
  ]
}
```

考卷為一次作答、交卷後計分，並逐題顯示對錯與詳解（答錯才展開）。

---

## 7. 題型 `Question`

用 `type` 欄位區分。所有題型都有 `prompt`（題幹，支援行內語法）。

### `mcq` 單選題
```jsonc
{
  "type": "mcq",
  "prompt": "下列何者是向量？",
  "choices": [
    { "id": "A", "label": "速率", "feedback": "速率只有大小（可省略）" },
    { "id": "B", "label": "速度" }
  ],
  "answer": "B",
  "shuffle": true              // 可省略：是否打亂選項
}
```

### `truefalse` 是非題
```jsonc
{ "type": "truefalse", "prompt": "$1.999\\cdots = 2$", "answer": true,
  "trueLabel": "正確 ◯", "falseLabel": "錯誤 ✕" }   // label 可省略
```

### `fill` 填充題（數值/分數/文字）
```jsonc
{
  "type": "fill",
  "prompt": "$\\int_1^2 (2x-1)^5\\,dx = ?$",
  "accept": ["182/3"],          // 可接受的答案（會做正規化比對）
  "normalize": "number",         // number：分數/小數視為相等；text：純文字比對
  "placeholder": "例如 182/3",
  "chips": ["1","8","2","/"],   // 可省略：可點的快捷輸入鍵
  "unit": "公尺"                 // 可省略：單位提示
}
```
`number` 模式下 `1/2`、`0.5`、`.5` 互相視為相等；分數、負號、百分比都支援。
答案是文字（如不等式範圍 `k<-4 或 k>0`）時用 `"normalize": "text"`，並在 `accept`
中列出可能寫法。

### `match` 配合題（可配圖）
```jsonc
{
  "type": "match",
  "prompt": "把圖形配對到方程式",
  "left": [
    { "id": "圖1", "label": "遞減曲線",
      "widget": { "type": "graphThumb", "params": { "expr": "-(x-1)^3-1" } } }
  ],
  "right": [ { "id": "C", "label": "$y=-x^3+3x^2-3x$" } ],
  "pairs": [ ["圖1","C"] ]       // 正確配對
}
```
`left`/`right` 的每一項可用 `label`（文字）或 `widget`（嵌互動元件，如 `graphThumb`）。

### `order` 排序題（點選步驟排序）
```jsonc
{
  "type": "order",
  "prompt": "把解題步驟排成正確順序",
  "tokens": [ { "id": "a", "label": "有理化" }, { "id": "b", "label": "約分" } ],
  "answer": ["a", "b"]
}
```

---

## 8. 互動元件 `WidgetSpec`

互動元件由引擎內建、以 `type` + `params` 宣告使用。可放在教學區塊（`{ "t":"widget" }`）、
題目旁（`question step` 的 `widget`）或配合題選項裡。

```jsonc
{ "type": "functionPlot", "height": 240, "params": { … }, "caption": "可省略說明" }
```

數學表達式（`expr` / `term`）使用一般數學寫法的字串，支援：`+ - * / ^`、括號、
隱含乘法（`2x`、`3(x+1)`、`x(x-1)`）、常數 `pi`/`e`，以及函式
`sin cos tan asin acos atan sqrt cbrt abs exp ln log sign floor ceil`。變數一律用 `x`。

### `functionPlot` — 通用繪圖／黎曼和／累積面積／切線
```jsonc
{
  "type": "functionPlot",
  "params": {
    "fns": [ { "expr": "x^3-3*x", "color": "#2fd49d", "width": 2.8 } ],
    "domain": [-3, 3], "range": [-4, 4],
    "mode": "plot",                 // plot | riemann | area | tangent
    "shade": { "fnIndex": 0, "from": 0, "to": 3, "absolute": false, "color": "rgba(47,212,157,.22)" },
    "points": [ { "x": 1, "fnIndex": 0, "label": "極大", "color": "#ff7a98" } ],
    "slider": { "label": "矩形數 N", "min": 2, "max": 60, "step": 1, "value": 12,
                "role": "riemann-n" }   // riemann-n | area-upper | tangent-x
  }
}
```
- `mode: "plot"`：純畫曲線，可加 `shade`（陰影區）與 `points`。
- `mode: "riemann"`：黎曼和，`slider.role` 用 `riemann-n`（矩形數），需配 `shade.from/to`。
- `mode: "area"`：累積（符號）面積，`slider.role` 用 `area-upper`（上限 b）。
- `mode: "tangent"`：動態切線，`slider.role` 用 `tangent-x`（切點），自動算斜率。

### `series` — 無窮級數 / 數列收斂
```jsonc
{
  "type": "series",
  "params": {
    "term": "1000*(0.1)^x",   // 第 k 項，以 x 當作 k
    "from": 0, "maxN": 12,
    "mode": "partial",          // partial：部分和 S_n；sequence：數列 a_k
    "target": 1111.111,         // 可省略：畫出收斂目標虛線
    "targetLabel": "10000/9"
  }
}
```

### `graphThumb` — 靜態小圖（常用於配合題選項）
```jsonc
{ "type": "graphThumb", "params": { "expr": "x^4+4*x^3+1",
  "domain": [-4,1.5], "range": [-30,20], "color": "#ffb454" } }
```

> 想要新的互動型別？在 `src/components/widgets/` 新增 React 元件並於
> `registry.tsx` 註冊一個 `type` 即可，課程包就能引用。

---

## 9. 給 AI 的產生提示（Prompt 範本）

把下面這段連同題目一起交給 AI，即可產出一份可直接匯入的課程包：

```
你是課程設計師。請依據我提供的題目，輸出一份「Lumina 課程包」JSON，
嚴格遵守 app/docs/AUTHORING.md 的 schema。要求：
1. 先把題目用到的所有基礎觀念，拆成數個單元(Unit)，每個單元含 1~3 個 teach 教學關
   與 1 個 checkpoint 單元測驗；教學要循序漸進、從直覺到計算。
2. 教學內容多用 callout（key/trap/tip）與 formula，並在適合處嵌入互動元件
   （functionPlot / series / graphThumb）幫助理解。
3. 每個觀念後面接 1~2 題即時小測（mcq / truefalse / fill / match / order）。
4. 最後產生一份 exam 考卷，完整收錄我給的題目，分大題、給配分與逐題 explanation。
5. 數學一律用 KaTeX，JSON 內反斜線跳脫成 \\。fill 題的 accept 要列出等價寫法。
只輸出 JSON，不要多餘文字。

題目如下：
<在這裡貼上題目>
```

產生後，於 App 的「課程庫 → 匯入課程包」貼上 JSON 即可預覽與遊玩。
（或存成 `src/content/<id>.ts` 內建發版。）

---

## 10. 檢查清單

- [ ] `id` 全域唯一；`schemaVersion: 1`。
- [ ] 每個 `unit` / `lesson` / `step` / 題目都有唯一 `id`。
- [ ] 所有 LaTeX 反斜線在 JSON 中已跳脫為 `\\`。
- [ ] `fill` 題的 `accept` 已涵蓋分數/小數/文字等價寫法。
- [ ] `match` 題的 `pairs` 內 id 與 `left`/`right` 對得上。
- [ ] 互動元件的 `expr` 只用變數 `x` 與支援的函式。
- [ ] 教學在前、考卷在後；節奏為 教 → 測 → 闖關 → 考卷。
```
