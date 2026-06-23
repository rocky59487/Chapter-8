import type { CoursePack } from '@/types/pack';

/**
 * First-party course pack — Chapter 8 Calculus (極限、級數、多項式微積分、
 * 定積分、微積分基本定理). Authored from the source exam. Demonstrates the full
 * teach → check → practice → checkpoint → exam flow that the engine renders.
 */
export const calculusCh8: CoursePack = {
  id: 'calculus-ch8',
  schemaVersion: 1,
  version: '1.0.0',
  title: '微積分・第 8 章',
  subtitle: '極限、級數、導數、定積分、微積分基本定理',
  description:
    '用 Duolingo 式的闖關節奏，從直覺到計算，把第 8 章的核心觀念一步步建立起來，最後挑戰完整考卷。',
  language: 'zh-Hant',
  subject: '數學・微積分',
  icon: '∫',
  accent: '#2fd49d',
  authors: ['Lumina'],
  estimatedMinutes: 120,

  units: [
    /* ===================== UNIT 1 — 極限與無窮級數 ===================== */
    {
      id: 'u1',
      title: '極限與無窮級數',
      subtitle: '無窮，不一定是無限大',
      color: '#56c6ff',
      icon: '∞',
      lessons: [
        {
          id: 'u1l0',
          title: '暖身：極限是什麼',
          type: 'teach',
          subtitle: '直覺、數列 vs 級數、記號',
          xp: 20,
          steps: [
            {
              kind: 'teach',
              id: 'u1l0s1',
              title: '「越來越接近」就是極限',
              say: '別怕「極限」兩個字，它其實只是把「越靠越近」講清楚而已～',
              body: [
                { t: 'p', text: '把 $x$ 一步步往某個數推近，看看函數值 $f(x)$ 想往哪個值靠。那個被靠近的目標，就叫做**極限**。' },
                { t: 'p', text: '例如 $f(x)=\\dfrac{x^2-1}{x-1}$ 在 $x=1$ 沒定義（會變成 $\\frac00$），但只要 $x$ 不等於 1，就能約分成 $x+1$。' },
                { t: 'math', tex: '\\frac{x^2-1}{x-1}=\\frac{(x-1)(x+1)}{x-1}=x+1\\quad(x\\neq1)' },
                { t: 'p', text: '所以當 $x$ 趨近 1，$f(x)$ 趨近 $1+1=2$。我們寫成：' },
                { t: 'formula', name: '極限記號', tex: '\\lim_{x\\to 1}\\frac{x^2-1}{x-1}=2', note: '$x\\to1$ 讀作「$x$ 趨近 1」' },
                { t: 'callout', tone: 'key', title: '極限的精神', text: '極限問的是「靠近時往哪去」，**不在乎**該點本身有沒有定義、或值是多少。' },
              ],
            },
            {
              kind: 'question',
              id: 'u1l0q1',
              prompt: [{ t: 'p', text: '先把 $\\dfrac{x^2-9}{x-3}$ 約分，再代入。' }],
              question: { type: 'fill', prompt: '$\\displaystyle\\lim_{x\\to 3}\\frac{x^2-9}{x-3}=?$', accept: ['6'], chips: ['6'] },
              explanation: [
                { t: 'math', tex: '\\frac{(x-3)(x+3)}{x-3}=x+3\\to 3+3=6' },
                { t: 'callout', tone: 'tip', text: '看到 $\\frac00$，先想能不能**因式分解約分**。' },
              ],
            },
            {
              kind: 'teach',
              id: 'u1l0s2',
              title: '數列 vs 級數，差在哪？',
              body: [
                { t: 'p', text: '**數列 (sequence)** 是一串「分開的數」：$a_1, a_2, a_3, \\dots$，像點名一樣一個一個。' },
                { t: 'p', text: '**級數 (series)** 是把數列「全部加起來」：$a_1+a_2+a_3+\\cdots$。級數本身是一個總和。' },
                {
                  t: 'widget',
                  widget: {
                    type: 'series',
                    height: 230,
                    params: { term: '(1/2)^x', from: 1, maxN: 12, mode: 'sequence' },
                    caption: '數列 $a_k=(\\tfrac12)^k$：每一項本身越來越小、趨近 0',
                  },
                },
                {
                  t: 'widget',
                  widget: {
                    type: 'series',
                    height: 230,
                    params: { term: '(1/2)^x', from: 1, maxN: 12, target: 1, targetLabel: '1', mode: 'partial' },
                    caption: '對應的級數（部分和）：$\\tfrac12+\\tfrac14+\\cdots$ 越加越接近 1',
                  },
                },
                { t: 'callout', tone: 'trap', title: '別搞混', text: '「項趨近 0」是在講**數列**；「加起來等於某數」是在講**級數**。兩件事不一樣！' },
              ],
            },
            {
              kind: 'question',
              id: 'u1l0q2',
              question: {
                type: 'mcq',
                prompt: '下列哪一個是「級數」？',
                choices: [
                  { id: 'A', label: '$1,\\ \\tfrac12,\\ \\tfrac14,\\ \\tfrac18,\\dots$', feedback: '這是一串分開的數，是數列。' },
                  { id: 'B', label: '$1+\\tfrac12+\\tfrac14+\\tfrac18+\\cdots$', feedback: '加總起來，正是級數。' },
                  { id: 'C', label: '$a_n = n^2$' },
                ],
                answer: 'B',
              },
              explanation: [{ t: 'p', text: '有「$+$」把所有項加起來的才是級數；單純一串數是數列。' }],
            },
            {
              kind: 'teach',
              id: 'u1l0s3',
              title: '看懂 $\\sum$ 與 $\\lim$ 記號',
              body: [
                { t: 'p', text: '希臘字母 $\\Sigma$（Sigma）就是英文 **S**um（總和）。下面寫起點、上面寫終點。' },
                { t: 'formula', name: '求和記號', tex: '\\sum_{k=1}^{n} a_k = a_1 + a_2 + \\cdots + a_n', note: '$k$ 從 1 跑到 $n$，把每個 $a_k$ 加起來' },
                { t: 'p', text: '若上限是 $\\infty$，代表「無窮級數」——其實是**部分和**的極限：' },
                { t: 'formula', name: '無窮級數的定義', tex: '\\sum_{k=1}^{\\infty} a_k = \\lim_{n\\to\\infty}\\sum_{k=1}^{n} a_k = \\lim_{n\\to\\infty} S_n', note: '$S_n$ 是前 $n$ 項的部分和' },
                { t: 'callout', tone: 'info', text: '所以「算無窮級數」永遠是「算一個極限」。這兩個記號其實是同一件事的兩面。' },
              ],
            },
            {
              kind: 'question',
              id: 'u1l0q3',
              question: { type: 'fill', prompt: '$\\displaystyle\\sum_{k=1}^{4} k^2 = ?$', accept: ['30'], chips: ['3', '0'] },
              explanation: [{ t: 'math', tex: '1+4+9+16 = 30' }],
            },
            {
              kind: 'question',
              id: 'u1l0q4',
              question: { type: 'truefalse', prompt: '$\\displaystyle\\sum_{k=1}^{\\infty} a_k$ 的值定義為部分和 $S_n$ 在 $n\\to\\infty$ 的極限。', answer: true },
              explanation: [{ t: 'p', text: '無窮級數就是部分和數列的極限；若該極限不存在，級數發散。' }],
            },
          ],
        },
        {
          id: 'u1l1',
          title: '無窮的直覺',
          type: 'teach',
          subtitle: '芝諾、0.999… 與收斂',
          xp: 20,
          steps: [
            {
              kind: 'teach',
              id: 'u1l1s1',
              title: '無窮多步，未必是無窮久',
              say: '嗨！我是 Lumi，先帶你看一個有名的悖論～',
              body: [
                { t: 'p', text: '阿基里斯比烏龜快 10 倍，烏龜先領先 1000 公尺。每當阿基里斯追到烏龜剛剛的位置，烏龜又前進一點。把追趕分成 $1000, 100, 10, 1, \\dots$ 公尺。' },
                { t: 'callout', tone: 'info', title: '關鍵問題', text: '「無窮多段」距離，加起來會不會是無窮長？' },
                {
                  t: 'widget',
                  widget: {
                    type: 'series',
                    height: 230,
                    params: { term: '1000*(0.1)^x', from: 0, maxN: 12, target: 1111.111, targetLabel: '10000/9 ≈ 1111.11', mode: 'partial' },
                    caption: '部分和很快逼近 10000/9，並非無限大',
                  },
                },
                { t: 'math', tex: '1000+100+10+1+\\cdots = \\frac{1000}{1-0.1} = \\frac{10000}{9}' },
                { t: 'callout', tone: 'tip', text: '距離總和有限，對應的時間也有限，所以阿基里斯**追得上**。' },
              ],
            },
            {
              kind: 'question',
              id: 'u1l1q1',
              prompt: [{ t: 'p', text: '芝諾說：因為要經過無窮多段，阿基里斯永遠追不上烏龜。這個結論正確嗎？' }],
              question: {
                type: 'truefalse',
                prompt: '阿基里斯永遠追不上烏龜。',
                answer: false,
              },
              explanation: [
                { t: 'p', text: '分段距離是收斂的等比級數，總和 $\\frac{10000}{9}$ 有限，所以追得上。' },
                { t: 'callout', tone: 'trap', text: '陷阱：把「無窮多項」直接想成「總和發散」。' },
              ],
            },
            {
              kind: 'teach',
              id: 'u1l1s2',
              title: '$1.999\\ldots = 2$ 嗎？',
              body: [
                { t: 'p', text: '令 $x = 1.999\\ldots$，則 $10x = 19.999\\ldots$。兩式相減：' },
                { t: 'steps', items: ['設 $x = 1.\\overline{9}$', '$10x = 19.\\overline{9}$', '相減：$9x = 18$', '所以 $x = 2$'] },
                { t: 'callout', tone: 'key', text: '無窮循環小數是一個**極限**，不是「差一點點」的有限寫法。' },
              ],
            },
            {
              kind: 'question',
              id: 'u1l1q2',
              question: { type: 'truefalse', prompt: '$1.999999\\cdots = 2$', answer: true },
              explanation: [{ t: 'p', text: '可寫成 $1+0.9+0.09+\\cdots = 1+\\frac{0.9}{1-0.1}=2$。' }],
            },
          ],
        },
        {
          id: 'u1l2',
          title: '部分和決定一切',
          type: 'teach',
          subtitle: '發散、收斂與括號陷阱',
          xp: 20,
          steps: [
            {
              kind: 'teach',
              id: 'u1l2s1',
              title: '先看部分和 $S_n$',
              say: '判斷級數，永遠先問：部分和有沒有極限？',
              body: [
                { t: 'p', text: '無窮級數 $\\sum a_k$ 是否收斂，看的是**部分和數列** $S_n = a_1+\\cdots+a_n$ 是否有極限。' },
                { t: 'p', text: '考慮 $3-3+3-3+\\cdots$。它的部分和在 $3,0,3,0,\\dots$ 之間跳動，沒有極限。' },
                {
                  t: 'widget',
                  widget: {
                    type: 'series',
                    height: 230,
                    params: { term: '3*(-1)^x', from: 0, maxN: 16, mode: 'partial' },
                    caption: '部分和在 3 與 0 間跳動 → 發散',
                  },
                },
                { t: 'callout', tone: 'trap', title: '括號陷阱', text: '$(3-3)+(3-3)+\\cdots = 0$ 把無窮項任意分組，掩蓋了部分和不收斂的事實。' },
              ],
            },
            {
              kind: 'question',
              id: 'u1l2q1',
              question: { type: 'truefalse', prompt: '$3-3+3-3+\\cdots = (3-3)+(3-3)+\\cdots = 0$', answer: false },
              explanation: [{ t: 'p', text: '部分和不收斂，級數發散；不可先任意加括號。' }],
            },
            {
              kind: 'teach',
              id: 'u1l2s2',
              title: '等比級數與一般項',
              body: [
                { t: 'formula', name: '等比級數', tex: '\\sum_{n=1}^{\\infty} r^{\\,n} = \\frac{r}{1-r}\\quad(|r|<1)', note: '收斂的充要條件是 $|r|<1$' },
                { t: 'callout', tone: 'key', text: '級數收斂 $\\Rightarrow$ 一般項 $\\to 0$（必要條件）。反之不一定成立。' },
              ],
            },
            {
              kind: 'question',
              id: 'u1l2q2',
              question: {
                type: 'truefalse',
                prompt: '若 $\\sum_{n=1}^{\\infty} r^{n}$ 收斂，則數列 $\\langle r^{n}\\rangle$ 必收斂。',
                answer: true,
              },
              explanation: [{ t: 'p', text: '收斂等價於 $|r|<1$，此時 $r^n \\to 0$，數列收斂。' }],
            },
          ],
        },
        {
          id: 'u1l3',
          title: '無窮大處的極限',
          type: 'teach',
          subtitle: '主導項、$\\infty/\\infty$ 與 $\\infty-\\infty$',
          xp: 20,
          steps: [
            {
              kind: 'teach',
              id: 'u1l3s1',
              title: '誰主導，就看誰',
              say: '$x$ 衝向無窮大時，只有「長得最快」的那一項說了算。',
              body: [
                { t: 'p', text: '當 $x\\to\\infty$，比較大小要看**成長最快**的項（主導項）。多項式看最高次、指數看最大底數。' },
                { t: 'p', text: '處理 $\\dfrac{\\infty}{\\infty}$ 型，技巧是**上下同除以主導項**，把其餘項壓成趨近 0。' },
                { t: 'steps', ordered: true, items: [
                  '找出分子分母各自的主導項',
                  '上下同時除以「最大」的那個主導項',
                  '把含 $\\frac1x$ 或 $(\\frac{小}{大})^x$ 的項都讓它 $\\to 0$',
                  '讀出剩下的常數比值',
                ] },
                { t: 'p', text: '例如指數型 $\\dfrac{2^x+3^x}{3^x+1}$，主導項是 $3^x$，上下同除 $3^x$：' },
                { t: 'math', tex: '\\frac{(\\tfrac23)^x+1}{1+(\\tfrac13)^x}\\xrightarrow{x\\to\\infty}\\frac{0+1}{1+0}=1' },
                { t: 'callout', tone: 'key', text: '指數比大小：**底數大的贏**。$3^x$ 遠遠壓過 $2^x$，所以 $(\\tfrac23)^x\\to0$。' },
              ],
            },
            {
              kind: 'question',
              id: 'u1l3q1',
              question: { type: 'fill', prompt: '$\\displaystyle\\lim_{x\\to\\infty}\\frac{5x^2-x}{2x^2+7}=?$', accept: ['5/2', '2.5'], chips: ['5', '/', '2'] },
              explanation: [{ t: 'math', tex: '\\frac{5-\\frac1x}{2+\\frac{7}{x^2}}\\to\\frac{5}{2}' }],
            },
            {
              kind: 'teach',
              id: 'u1l3s2',
              title: '$\\infty-\\infty$ 要先有理化',
              body: [
                { t: 'p', text: '$\\infty-\\infty$ **不是** 0！兩個都衝向無窮大，誰減誰、減多少都不一定。遇到含根號的差，標準招式是**乘上共軛根式**有理化。' },
                { t: 'p', text: '示範 $\\lim_{n\\to\\infty}\\left(\\sqrt{n^2+n}-n\\right)$：' },
                { t: 'steps', ordered: true, items: [
                  '乘以共軛 $\\dfrac{\\sqrt{n^2+n}+n}{\\sqrt{n^2+n}+n}$',
                  '分子變平方差：$(n^2+n)-n^2 = n$',
                  '得 $\\dfrac{n}{\\sqrt{n^2+n}+n}$',
                  '上下同除 $n$：$\\dfrac{1}{\\sqrt{1+\\frac1n}+1}$',
                  '令 $n\\to\\infty$：$\\dfrac{1}{1+1}=\\dfrac12$',
                ] },
                { t: 'callout', tone: 'trap', title: '常見大坑', text: '把 $\\sqrt{n^2+n}$ 直接看成 $n$ 而得 0——錯！差距正好趨近 $\\frac12$，不能忽略低次項。' },
              ],
            },
            {
              kind: 'question',
              id: 'u1l3q2',
              prompt: [{ t: 'p', text: '把計算 $\\displaystyle\\lim_{n\\to\\infty}\\bigl(\\sqrt{n^2+n}-n\\bigr)$ 的步驟，依正確順序排好。' }],
              question: {
                type: 'order',
                prompt: '點選步驟排成正確順序',
                tokens: [
                  { id: 't1', label: '乘上共軛 $\\dfrac{\\sqrt{n^2+n}+n}{\\sqrt{n^2+n}+n}$' },
                  { id: 't2', label: '分子用平方差化簡為 $n$' },
                  { id: 't3', label: '上下同除以 $n$' },
                  { id: 't4', label: '令 $n\\to\\infty$，得 $\\dfrac12$' },
                ],
                answer: ['t1', 't2', 't3', 't4'],
              },
              explanation: [
                { t: 'p', text: '先有理化（乘共軛）→ 平方差化簡 → 同除主導項 $n$ → 取極限。' },
                { t: 'math', tex: '\\sqrt{n^2+n}-n=\\frac{n}{\\sqrt{n^2+n}+n}\\to\\frac12' },
              ],
            },
          ],
        },
        {
          id: 'u1cp',
          title: '單元測驗 1',
          type: 'checkpoint',
          subtitle: '極限與級數',
          xp: 40,
          steps: [
            {
              kind: 'question',
              id: 'u1cpq1',
              prompt: [{ t: 'p', text: '計算指數極限（先抓主導項）：' }],
              question: {
                type: 'fill',
                prompt: '$\\displaystyle\\lim_{x\\to\\infty}\\frac{4^{x-1}+3^{x+7}}{3^{x+5}-2^{2x+1}}$',
                accept: ['-1/8', '-0.125'],
                placeholder: '例如 -1/8',
                chips: ['-', '1', '8', '/'],
              },
              explanation: [
                { t: 'p', text: '同除以 $4^x$。注意 $2^{2x+1}=2\\cdot 4^x$ 與 $4^{x-1}$ 同底。' },
                { t: 'math', tex: '\\frac{\\frac14 + 3^7(\\frac34)^x}{3^5(\\frac34)^x - 2}\\to\\frac{1/4}{-2}=-\\frac18' },
              ],
            },
            {
              kind: 'question',
              id: 'u1cpq2',
              question: {
                type: 'fill',
                prompt: '$\\displaystyle\\sum_{k=0}^{\\infty}\\frac{3^k-2^k}{6^k}$',
                accept: ['1/2', '0.5'],
                chips: ['1', '/', '2'],
              },
              explanation: [{ t: 'math', tex: '\\sum (\\tfrac12)^k-\\sum(\\tfrac13)^k = 2-\\tfrac32 = \\tfrac12' }],
            },
            {
              kind: 'question',
              id: 'u1cpq3',
              prompt: [{ t: 'callout', tone: 'trap', text: '$\\infty-\\infty$ 型不可直接忽略低次項，要有理化。' }],
              question: {
                type: 'truefalse',
                prompt: '$\\lim_{n\\to\\infty}(n-\\sqrt{n^2-n}) = 0$',
                answer: false,
              },
              explanation: [{ t: 'math', tex: 'n-\\sqrt{n^2-n}=\\frac{n}{n+\\sqrt{n^2-n}}\\to\\frac12' }],
            },
          ],
        },
      ],
    },

    /* ===================== UNIT 2 — 多項式函數微積分 ===================== */
    {
      id: 'u2',
      title: '多項式函數微積分',
      subtitle: '從導數讀出圖形',
      color: '#b59bff',
      icon: 'ƒ',
      lessons: [
        {
          id: 'u2l0',
          title: '暖身：導數怎麼算',
          type: 'teach',
          subtitle: '瞬時變化率與冪次法則',
          xp: 20,
          steps: [
            {
              kind: 'teach',
              id: 'u2l0s1',
              title: '導數 = 切線斜率 = 瞬時變化率',
              say: '導數聽起來嚇人，其實就是「在某一點，曲線傾斜多少」。',
              body: [
                { t: 'p', text: '兩點連線的斜率是 $\\dfrac{\\Delta y}{\\Delta x}$。把兩點越拉越近，割線就變成**切線**，那個極限斜率就是**導數**。' },
                { t: 'formula', name: '導數定義', tex: "f'(x)=\\lim_{h\\to0}\\frac{f(x+h)-f(x)}{h}", note: '$h$ 是兩點的間距，讓它趨近 0' },
                {
                  t: 'widget',
                  widget: {
                    type: 'functionPlot',
                    height: 240,
                    params: {
                      fns: [{ expr: 'x*x' }],
                      domain: [-3, 3], range: [-1, 8],
                      mode: 'tangent',
                      slider: { label: '切點 x', min: -2.5, max: 2.5, step: 0.05, value: 1, role: 'tangent-x' },
                    },
                    caption: '拖動切點：$y=x^2$ 在 $x$ 處的切線斜率正好是 $2x$',
                  },
                },
                { t: 'callout', tone: 'info', text: '導數是「在那一瞬間，函數變化得多快」。正的往上、負的往下、零代表水平。' },
              ],
            },
            {
              kind: 'teach',
              id: 'u2l0s2',
              title: '多項式的冪次法則',
              body: [
                { t: 'formula', name: '冪次法則', tex: '\\frac{d}{dx}x^n = n\\,x^{\\,n-1}', note: '指數掉下來當係數，指數再減 1' },
                { t: 'p', text: '再配上「常數倍可提出、逐項相加」，多項式微分就只是機械化套公式。示範 $f(x)=x^3-3x$：' },
                { t: 'steps', ordered: true, items: [
                  '$x^3$ 微分成 $3x^2$',
                  '$-3x$ 微分成 $-3$',
                  "合起來 $f'(x)=3x^2-3$",
                ] },
                { t: 'callout', tone: 'tip', text: '常數微分為 0；一次項 $cx$ 微分為常數 $c$。' },
              ],
            },
            {
              kind: 'question',
              id: 'u2l0q1',
              question: { type: 'fill', prompt: "若 $f(x)=2x^3-5x^2+4$，則 $f'(x)=?$（填在 $x=1$ 的值）", accept: ['-4'], chips: ['-', '4'] },
              explanation: [
                { t: 'math', tex: "f'(x)=6x^2-10x,\\quad f'(1)=6-10=-4" },
              ],
            },
            {
              kind: 'teach',
              id: 'u2l0s3',
              title: '臨界點：斜率為 0 的地方',
              body: [
                { t: 'p', text: '極大、極小一定出現在**斜率為 0**（或不可微）的地方，這種點叫**臨界點**。解 $f\'(x)=0$ 就能找出候選。' },
                { t: 'callout', tone: 'key', text: '找極值的第一步永遠是：解 $f\'(x)=0$。' },
                { t: 'callout', tone: 'trap', text: '$f\'(x)=0$ 只是「候選」，不保證是極值（例如水平反曲點），仍要檢查左右升降。' },
              ],
            },
            {
              kind: 'question',
              id: 'u2l0q2',
              question: {
                type: 'mcq',
                prompt: '$f(x)=x^3-3x$ 的臨界點 $x$ 是？',
                choices: [
                  { id: 'A', label: '$x=0$' },
                  { id: 'B', label: '$x=\\pm1$', feedback: '$3x^2-3=0\\Rightarrow x=\\pm1$。' },
                  { id: 'C', label: '$x=\\pm3$' },
                ],
                answer: 'B',
              },
              explanation: [{ t: 'math', tex: "f'(x)=3x^2-3=0\\Rightarrow x^2=1\\Rightarrow x=\\pm1" }],
            },
          ],
        },
        {
          id: 'u2l1',
          title: '導數與形狀',
          type: 'teach',
          subtitle: '遞增遞減、凹凸、反曲點',
          xp: 20,
          steps: [
            {
              kind: 'teach',
              id: 'u2l1s1',
              title: '一階導數看升降',
              body: [
                { t: 'p', text: '$f\'(x)>0$ 時遞增，$f\'(x)<0$ 時遞減；$f\'(x)=0$ 的點是臨界點，可能是極大或極小。' },
                {
                  t: 'widget',
                  widget: {
                    type: 'functionPlot',
                    height: 240,
                    params: {
                      fns: [{ expr: 'x^3-3*x' }],
                      domain: [-3, 3], range: [-4, 4],
                      mode: 'tangent',
                      slider: { label: '切點 x', min: -2.5, max: 2.5, step: 0.05, value: 1, role: 'tangent-x' },
                    },
                    caption: '拖動切點，觀察斜率正負與升降的對應',
                  },
                },
                { t: 'callout', tone: 'tip', text: '二階導數 $f\'\'(x)$ 看凹凸：$f\'\'>0$ 凹向上，$f\'\'<0$ 凹向下，變號處是反曲點。' },
              ],
            },
            {
              kind: 'question',
              id: 'u2l1q1',
              prompt: [{ t: 'p', text: '設 $f(x)=ax^3+bx^2+cx+d$。反曲點為原點且在原點切線為 $y=-x$，求 $b+c+d$。' }],
              question: { type: 'fill', prompt: '$b+c+d=?$', accept: ['-1'], chips: ['-', '1'] },
              explanation: [
                { t: 'steps', items: ['過原點：$f(0)=d=0$', '反曲點：$f\'\'(0)=2b=0\\Rightarrow b=0$', '切線斜率：$f\'(0)=c=-1$'] },
                { t: 'math', tex: 'b+c+d = 0+(-1)+0 = -1' },
              ],
            },
          ],
        },
        {
          id: 'u2l2',
          title: '配合題技巧',
          type: 'practice',
          subtitle: '看端點方向與轉折個數',
          xp: 20,
          steps: [
            {
              kind: 'teach',
              id: 'u2l2s1',
              title: '辨識多項式圖形',
              say: '配合題不用全解，看「端點方向 + 轉折個數」最快！',
              body: [
                { t: 'steps', items: ['看**最高次項**決定兩端走向（奇次一上一下，偶次同向）', '數**轉折點**個數（三次最多 2 個，四次最多 3 個）', '注意**重根**會造成切觸 x 軸'] },
              ],
            },
            {
              kind: 'question',
              id: 'u2l2q1',
              prompt: [{ t: 'p', text: '把每個圖形配對到正確的方程式。' }],
              question: {
                type: 'match',
                prompt: '依圖形特徵配對',
                left: [
                  { id: '圖1', label: '左上往右下、有水平反曲點', widget: { type: 'graphThumb', height: 130, params: { expr: '-(x-1)^3-1', domain: [-1.5, 3.5], range: [-5, 5], color: '#b59bff' } } },
                  { id: '圖2', label: '左低右高、一峰一谷', widget: { type: 'graphThumb', height: 130, params: { expr: '(x-1)*(2-3*x)^2', domain: [-0.5, 2], range: [-3, 3], color: '#56c6ff' } } },
                  { id: '圖3', label: '兩端向上、左深谷右平台', widget: { type: 'graphThumb', height: 130, params: { expr: 'x^4+4*x^3+1', domain: [-4, 1.5], range: [-30, 20], color: '#ffb454' } } },
                ],
                right: [
                  { id: 'C', label: '$y=-x^3+3x^2-3x$' },
                  { id: 'E', label: '$y=(x-1)(2-3x)^2$' },
                  { id: 'H', label: '$y=x^4+4x^3+1$' },
                ],
                pairs: [['圖1', 'C'], ['圖2', 'E'], ['圖3', 'H']],
              },
              explanation: [
                { t: 'p', text: 'C 可寫成 $-(x-1)^3-1$，整體遞減且有水平反曲點；E 展開為正首項三次式並在 $x=\\frac23$ 切觸；H 的 $y\'=4x^2(x+3)$，在 $x=-3$ 有深谷、$x=0$ 有水平反曲點。' },
              ],
            },
          ],
        },
        {
          id: 'u2l3',
          title: '閉區間極值與根的個數',
          type: 'teach',
          subtitle: '端點檢查與三次方程的根',
          xp: 20,
          steps: [
            {
              kind: 'teach',
              id: 'u2l3s1',
              title: '閉區間：別忘了端點',
              say: '在 $[a,b]$ 上找最大最小，端點也是嫌疑犯！',
              body: [
                { t: 'p', text: '連續函數在閉區間 $[a,b]$ 上一定有最大值與最小值（極值定理）。它們只可能出現在**臨界點**或**端點**。' },
                { t: 'formula', name: '閉區間極值流程', tex: '\\{\\,M,\\,m\\,\\}=\\{\\text{比較 } f(\\text{臨界點}) \\text{ 與 } f(a),\\,f(b)\\,\\}', note: '把候選點的函數值全列出來，挑最大與最小' },
                { t: 'p', text: '示範 $f(t)=-t^3+9t^2-15t+10$ 在 $[2,6]$：' },
                { t: 'steps', ordered: true, items: [
                  "求導：$f'(t)=-3t^2+18t-15=-3(t-1)(t-5)$",
                  '令 $f\'(t)=0$：臨界點 $t=1,5$；只有 $t=5$ 落在 $[2,6]$',
                  '算候選值：$f(2)=8$、$f(5)=35$、$f(6)=28$',
                  '比較：最大 $M=35$、最小 $m=8$',
                ] },
                { t: 'callout', tone: 'trap', title: '最常見失分', text: '只比較臨界點、忘了算端點 $f(a),f(b)$。本題若漏掉 $f(2)=8$ 就會抓錯最小值。' },
              ],
            },
            {
              kind: 'question',
              id: 'u2l3q1',
              prompt: [{ t: 'p', text: '把「求閉區間 $[a,b]$ 上最大／最小值」的步驟排成正確順序。' }],
              question: {
                type: 'order',
                prompt: '點選步驟排成正確順序',
                tokens: [
                  { id: 's1', label: '對 $f$ 求導得 $f\'(x)$' },
                  { id: 's2', label: '解 $f\'(x)=0$ 找臨界點' },
                  { id: 's3', label: '只留下落在 $[a,b]$ 內的臨界點' },
                  { id: 's4', label: '算臨界點與兩端點 $f(a),f(b)$ 的值' },
                  { id: 's5', label: '比較所有值，挑出最大與最小' },
                ],
                answer: ['s1', 's2', 's3', 's4', 's5'],
              },
              explanation: [{ t: 'p', text: '求導 → 解臨界點 → 篩進區間 → 連同端點一起算值 → 比較。端點絕不能漏。' }],
            },
            {
              kind: 'teach',
              id: 'u2l3s2',
              title: '三次方程有幾個實根？',
              body: [
                { t: 'p', text: '三次式 $f(x)$（首項正）的圖形是「左下往右上、中間一個極大一個極小」。實根個數看**極大值與極小值的正負號**。' },
                { t: 'callout', tone: 'key', title: '判別原則', text: '令極大值 $f_{\\max}$、極小值 $f_{\\min}$。當 $f_{\\max}\\cdot f_{\\min}>0$（同號）時只有**一個**實根（兩個虛根）；$=0$ 時有重根；$<0$ 時有三個相異實根。' },
                { t: 'p', text: '示範 $x^3-6x^2+9x+k=0$：$f\'(x)=3(x-1)(x-3)$，極大在 $x=1$、極小在 $x=3$。' },
                { t: 'steps', ordered: true, items: [
                  '極大值 $f(1)=1-6+9+k=k+4$',
                  '極小值 $f(3)=27-54+27+k=k$',
                  '一實根需同號：$(k+4)\\cdot k>0$',
                  '解得 $k>0$ 或 $k<-4$',
                ] },
              ],
            },
            {
              kind: 'question',
              id: 'u2l3q2',
              question: {
                type: 'truefalse',
                prompt: '若三次式（首項正）的極大值與極小值同為正，則方程式恰有一個實根。',
                answer: true,
              },
              explanation: [{ t: 'p', text: '兩個轉折值同號 $\\Rightarrow$ 圖形只穿越 x 軸一次 $\\Rightarrow$ 一實根、兩虛根。' }],
            },
          ],
        },
        {
          id: 'u2cp',
          title: '單元測驗 2',
          type: 'checkpoint',
          subtitle: '極值與根的個數',
          xp: 40,
          steps: [
            {
              kind: 'question',
              id: 'u2cpq1',
              prompt: [{ t: 'p', text: '閉區間極值（記得檢查端點！）：$f(t)=-t^3+9t^2-15t+10$，$2\\le t\\le 6$。最大 $M$、最小 $m$，求 $M+m$。' }],
              question: { type: 'fill', prompt: '$M+m=?$', accept: ['43'] },
              explanation: [
                { t: 'math', tex: 'f\'(t)=-3(t-1)(t-5),\\ t=5\\in[2,6]' },
                { t: 'p', text: '$f(2)=8,\\ f(5)=35,\\ f(6)=28$，故 $M=35, m=8, M+m=43$。' },
              ],
            },
            {
              kind: 'question',
              id: 'u2cpq2',
              prompt: [{ t: 'p', text: '$x^3-6x^2+9x+k=0$ 有一實根與兩虛根，求 $k$ 範圍。' }],
              question: { type: 'fill', prompt: 'k 的範圍', accept: ['k<-4或k>0', 'k<-4 或 k>0', 'k>0或k<-4'], normalize: 'text', placeholder: '例如 k<-4 或 k>0' },
              explanation: [{ t: 'p', text: '$f\'(x)=3(x-1)(x-3)$，$f(1)=k+4$（極大）、$f(3)=k$（極小）。一實根需 $k+4<0$ 或 $k>0$。' }],
            },
          ],
        },
      ],
    },

    /* ===================== UNIT 3 — 定積分與幾何意義 ===================== */
    {
      id: 'u3',
      title: '定積分與幾何意義',
      subtitle: '帶正負號的累積',
      color: '#2fd49d',
      icon: '∑',
      lessons: [
        {
          id: 'u3l1',
          title: '積分就是累積',
          type: 'teach',
          subtitle: '從黎曼和到 ∫',
          xp: 20,
          steps: [
            {
              kind: 'teach',
              id: 'u3l1s1',
              title: '∫ 是拉長的 S（sum）',
              body: [
                { t: 'p', text: '把面積切成許多小矩形 $f(x_i)\\Delta x$ 相加，再讓切割越來越細，就得到定積分。' },
                {
                  t: 'widget',
                  widget: {
                    type: 'functionPlot',
                    height: 240,
                    params: {
                      fns: [{ expr: '0.25*x*x+0.55' }],
                      domain: [0, 3], range: [0, 3.2],
                      mode: 'riemann',
                      shade: { fnIndex: 0, from: 0, to: 3 },
                      slider: { label: '矩形數 N', min: 2, max: 60, step: 1, value: 12, role: 'riemann-n' },
                    },
                    caption: 'N 越大，黎曼和越接近真正的積分',
                  },
                },
                { t: 'formula', tex: '\\sum f(x_i)\\,\\Delta x \\;\\longrightarrow\\; \\int_a^b f(x)\\,dx' },
              ],
            },
            {
              kind: 'question',
              id: 'u3l1q1',
              question: { type: 'truefalse', prompt: '積分符號 $\\int$ 可理解為 sum 的 s 拉長而來。', answer: true },
              explanation: [{ t: 'p', text: '符號來源確實與拉長的 S 有關，但真正的定義仍是黎曼和的極限。' }],
            },
            {
              kind: 'teach',
              id: 'u3l1s2',
              title: '線性與方向',
              body: [
                { t: 'formula', tex: '\\int_b^a f = -\\int_a^b f,\\qquad \\int_a^b cf = c\\int_a^b f' },
                { t: 'callout', tone: 'trap', text: '上下限交換要**變號**！這是填充題最常見的失分點。' },
              ],
            },
            {
              kind: 'question',
              id: 'u3l1q2',
              prompt: [{ t: 'p', text: '已知 $\\int_{-3}^{2}f=5$、$\\int_{3}^{2}f=7$，求 $\\int_{-3}^{3}2f\\,dx$。' }],
              question: { type: 'fill', prompt: '$\\int_{-3}^{3}2f\\,dx=?$', accept: ['-4'] },
              explanation: [{ t: 'p', text: '$\\int_2^3 f=-7$，$\\int_{-3}^3 f=5-7=-2$，乘 2 得 $-4$。' }],
            },
          ],
        },
        {
          id: 'u3l2',
          title: '面積要取正',
          type: 'teach',
          subtitle: '絕對值、符號面積、封閉區域',
          xp: 20,
          steps: [
            {
              kind: 'teach',
              id: 'u3l2s1',
              title: '符號面積 vs 幾何面積',
              body: [
                { t: 'p', text: '定積分會抵消 x 軸上下的部分。問「面積」時，必須依圖形與 x 軸的上下分段取正。' },
                {
                  t: 'widget',
                  widget: {
                    type: 'functionPlot',
                    height: 240,
                    params: {
                      fns: [{ expr: 'sin(x)' }],
                      domain: [0, 9.5], range: [-1.4, 1.4],
                      mode: 'area',
                      shade: { fnIndex: 0, from: 0, to: 3.14159 },
                      slider: { label: '上限 b', min: 0, max: 9.42, step: 0.1, value: 3.14159, role: 'area-upper' },
                    },
                    caption: '$y=\\sin x$：超過 π 後累積開始被抵消',
                  },
                },
              ],
            },
            {
              kind: 'question',
              id: 'u3l2q1',
              prompt: [{ t: 'p', text: '已知 $\\int_0^\\pi \\sin x\\,dx=2$，求 $\\int_0^{3\\pi}\\sin x\\,dx$。' }],
              question: { type: 'fill', prompt: '$\\int_0^{3\\pi}\\sin x\\,dx=?$', accept: ['2'] },
              explanation: [{ t: 'math', tex: '2 + (-2) + 2 = 2' }],
            },
            {
              kind: 'question',
              id: 'u3l2q2',
              prompt: [{ t: 'p', text: '求 $|x-1|$ 在 $[0,5]$ 的積分（依零點 $x=1$ 分段）。' }],
              question: { type: 'fill', prompt: '$\\int_0^5 |x-1|\\,dx=?$', accept: ['17/2', '8.5'] },
              explanation: [{ t: 'math', tex: '\\int_0^1(1-x)+\\int_1^5(x-1)=\\tfrac12+8=\\tfrac{17}{2}' }],
            },
          ],
        },
        {
          id: 'u3l3',
          title: '怎麼算定積分',
          type: 'teach',
          subtitle: '反導數、冪次積分與代換',
          xp: 20,
          steps: [
            {
              kind: 'teach',
              id: 'u3l3s1',
              title: '反導數與冪次積分',
              say: '積分就是「反著做微分」，把冪次法則倒過來用。',
              body: [
                { t: 'p', text: '求 $\\int_a^b f(x)\\,dx$，先找一個 $F$ 使 $F\'=f$（**反導數**），再代入上下限相減。' },
                { t: 'formula', name: '牛頓–萊布尼茲', tex: "\\int_a^b f(x)\\,dx = F(b)-F(a)\\quad(F'=f)", note: '先積出 $F$，再算 $F(b)-F(a)$' },
                { t: 'formula', name: '冪次積分', tex: '\\int x^n\\,dx = \\frac{x^{\\,n+1}}{n+1}+C\\quad(n\\neq-1)', note: '指數加 1、再除以新指數（微分的逆操作）' },
                { t: 'p', text: '示範 $\\int_{-1}^{1}(x+2)(x-3)\\,dx$：' },
                { t: 'steps', ordered: true, items: [
                  '展開：$(x+2)(x-3)=x^2-x-6$',
                  '逐項積分：$\\dfrac{x^3}{3}-\\dfrac{x^2}{2}-6x$',
                  '對稱區間：奇函數項 $-\\dfrac{x^2}{2}$ 積分為 0（其原函數在 $\\pm1$ 相減為 0）',
                  '剩 $\\left[\\dfrac{x^3}{3}-6x\\right]_{-1}^{1}=\\left(\\dfrac13-6\\right)-\\left(-\\dfrac13+6\\right)=-\\dfrac{34}{3}$',
                ] },
                { t: 'callout', tone: 'tip', title: '對稱小技巧', text: '在對稱區間 $[-a,a]$ 上，**奇函數積分為 0**、偶函數積分為一半的兩倍。能省下大量計算。' },
              ],
            },
            {
              kind: 'question',
              id: 'u3l3q1',
              question: { type: 'fill', prompt: '$\\displaystyle\\int_0^2 3x^2\\,dx=?$', accept: ['8'], chips: ['8'] },
              explanation: [{ t: 'math', tex: "\\bigl[x^3\\bigr]_0^2 = 8-0 = 8" }],
            },
            {
              kind: 'teach',
              id: 'u3l3s2',
              title: '$u$-代換：換變數也要換上下限',
              body: [
                { t: 'p', text: '遇到「一團東西的次方」如 $(2x-1)^5$，令 $u=2x-1$，則 $du=2\\,dx$。**上下限也要換成 $u$ 的值**。' },
                { t: 'p', text: '示範 $\\int_1^2 (2x-1)^5\\,dx$：' },
                { t: 'steps', ordered: true, items: [
                  '令 $u=2x-1$，$dx=\\dfrac{du}{2}$',
                  '換限：$x=1\\Rightarrow u=1$；$x=2\\Rightarrow u=3$',
                  '$\\dfrac12\\displaystyle\\int_1^3 u^5\\,du=\\dfrac12\\left[\\dfrac{u^6}{6}\\right]_1^3$',
                  '$=\\dfrac{3^6-1}{12}=\\dfrac{729-1}{12}=\\dfrac{182}{3}$',
                ] },
                { t: 'callout', tone: 'trap', title: '最致命的錯', text: '換了變數卻沒換上下限——用 $x$ 的 1、2 去套 $u$ 的式子，答案必錯。' },
              ],
            },
            {
              kind: 'question',
              id: 'u3l3q2',
              prompt: [{ t: 'p', text: '把 $u$-代換計算 $\\int_1^2(2x-1)^5dx$ 的步驟排成正確順序。' }],
              question: {
                type: 'order',
                prompt: '點選步驟排成正確順序',
                tokens: [
                  { id: 'a', label: '令 $u=2x-1$、$dx=\\frac{du}{2}$' },
                  { id: 'b', label: '換上下限：$1\\to1$、$2\\to3$' },
                  { id: 'c', label: '積分 $\\frac12\\int_1^3 u^5\\,du=\\frac12\\big[\\frac{u^6}{6}\\big]_1^3$' },
                  { id: 'd', label: '代入得 $\\frac{182}{3}$' },
                ],
                answer: ['a', 'b', 'c', 'd'],
              },
              explanation: [{ t: 'p', text: '設 $u$ → 換限 → 積分 → 代入。換限與設 $u$ 都要在積分前完成。' }],
            },
          ],
        },
        {
          id: 'u3cp',
          title: '單元測驗 3',
          type: 'checkpoint',
          subtitle: '定積分計算',
          xp: 40,
          steps: [
            {
              kind: 'question',
              id: 'u3cpq1',
              question: { type: 'fill', prompt: '$\\int_{-1}^{1}(x+2)(x-3)\\,dx$', accept: ['-34/3'] },
              explanation: [{ t: 'p', text: '展開 $x^2-x-6$；奇函數項在對稱區間積分為 0：$\\frac23-12=-\\frac{34}{3}$。' }],
            },
            {
              kind: 'question',
              id: 'u3cpq2',
              prompt: [{ t: 'callout', tone: 'tip', text: '代換時上下限要跟著改！' }],
              question: { type: 'fill', prompt: '$\\int_1^2 (2x-1)^5\\,dx$', accept: ['182/3'] },
              explanation: [{ t: 'math', tex: '\\tfrac12\\int_1^3 u^5\\,du=\\frac{3^6-1}{12}=\\frac{182}{3}' }],
            },
            {
              kind: 'question',
              id: 'u3cpq3',
              prompt: [{ t: 'p', text: '求 $y=x^2-x$、$x=0$、$x=2$ 與 x 軸圍成的**面積**。' }],
              question: { type: 'fill', prompt: '面積 =', accept: ['1'] },
              explanation: [{ t: 'math', tex: '\\int_0^1(x-x^2)+\\int_1^2(x^2-x)=\\tfrac16+\\tfrac56=1' }],
            },
          ],
        },
      ],
    },

    /* ===================== UNIT 4 — 微積分基本定理 ===================== */
    {
      id: 'u4',
      title: '微積分基本定理',
      subtitle: '變化與累積的橋梁',
      color: '#ffb454',
      icon: '∂',
      lessons: [
        {
          id: 'u4l1',
          title: '變上限積分',
          type: 'teach',
          subtitle: 'FTC 第一部分',
          xp: 20,
          steps: [
            {
              kind: 'teach',
              id: 'u4l1s1',
              title: '微分會「抵消」積分',
              say: '這是整章的核心——把累積量微分，會回到被積函數本身。',
              body: [
                { t: 'formula', name: '微積分基本定理', tex: '\\frac{d}{dx}\\int_a^x g(t)\\,dt = g(x)' },
                { t: 'callout', tone: 'key', text: '外層的 $\\frac{d}{dx}$ 已經把累積函數微分，不需要先把積分算出來。' },
              ],
            },
            {
              kind: 'question',
              id: 'u4l1q1',
              prompt: [{ t: 'p', text: '$F(x)=\\frac{d}{dx}\\left[\\int_1^x \\frac{1}{t^2+1}\\,dt\\right]$，求 $F(2)$。' }],
              question: { type: 'fill', prompt: '$F(2)=?$', accept: ['1/5', '0.2'] },
              explanation: [{ t: 'p', text: '由 FTC，$F(x)=\\frac{1}{x^2+1}$，$F(2)=\\frac15$。' }],
            },
            {
              kind: 'question',
              id: 'u4l1q2',
              question: { type: 'truefalse', prompt: '$\\int x\\,dx = \\tfrac12 x^2 + c$（$c$ 為常數）', answer: true },
              explanation: [{ t: 'p', text: '$\\frac{d}{dx}(\\tfrac12x^2+c)=x$。不定積分是一族函數，$c$ 不可漏。' }],
            },
          ],
        },
        {
          id: 'u4l2',
          title: '累積函數與複合上限',
          type: 'teach',
          subtitle: 'FTC 直覺與鏈鎖法則',
          xp: 20,
          steps: [
            {
              kind: 'teach',
              id: 'u4l2s1',
              title: '累積函數的斜率就是被積函數',
              say: '把面積一路累積，累積得快不快，正好由當下的高度 $g(x)$ 決定。',
              body: [
                { t: 'p', text: '定義累積函數 $A(x)=\\displaystyle\\int_a^x g(t)\\,dt$，它記錄「從 $a$ 到 $x$ 累積了多少面積」。當 $x$ 多走一點點 $dx$，面積就多一條高 $g(x)$、寬 $dx$ 的細條。' },
                { t: 'p', text: '所以 $A$ 的增長速率（導數）正是當下高度 $g(x)$——這就是 FTC 的幾何直覺。' },
                {
                  t: 'widget',
                  widget: {
                    type: 'functionPlot',
                    height: 240,
                    params: {
                      fns: [{ expr: '0.4*x*x+0.3' }],
                      domain: [0, 3], range: [0, 4.2],
                      mode: 'area',
                      shade: { fnIndex: 0, from: 0, to: 1.5 },
                      slider: { label: '上限 x', min: 0, max: 3, step: 0.05, value: 1.5, role: 'area-upper' },
                    },
                    caption: '推動上限 $x$，累積面積 $A(x)$ 增長的快慢由曲線高度決定',
                  },
                },
                { t: 'formula', name: 'FTC 第一部分', tex: '\\frac{d}{dx}\\int_a^x g(t)\\,dt = g(x)', note: '累積函數的導數 = 被積函數' },
                { t: 'callout', tone: 'key', text: '下限 $a$ 是常數，換成別的常數不影響導數（只差一個常數）。' },
              ],
            },
            {
              kind: 'question',
              id: 'u4l2q1',
              question: { type: 'fill', prompt: '$\\dfrac{d}{dx}\\displaystyle\\int_2^x (t^3+1)\\,dt$ 在 $x=1$ 的值', accept: ['2'], chips: ['2'] },
              explanation: [{ t: 'p', text: '由 FTC，導數為 $x^3+1$，代 $x=1$ 得 $2$。' }],
            },
            {
              kind: 'teach',
              id: 'u4l2s2',
              title: '上限是 $x$ 的函數時，配鏈鎖法則',
              body: [
                { t: 'p', text: '若上限不是單純的 $x$ 而是 $u(x)$，要乘上 $u\'(x)$（鏈鎖法則）。' },
                { t: 'formula', name: 'FTC + 鏈鎖', tex: "\\frac{d}{dx}\\int_a^{u(x)} g(t)\\,dt = g\\bigl(u(x)\\bigr)\\cdot u'(x)" },
                { t: 'p', text: '例如 $\\dfrac{d}{dx}\\displaystyle\\int_0^{x^2}\\sin t\\,dt = \\sin(x^2)\\cdot 2x$。' },
                { t: 'callout', tone: 'tip', text: '上限是 $x$ 時 $u\'(x)=1$，所以平常看不到這一步——但上限變複雜就不能漏。' },
              ],
            },
            {
              kind: 'question',
              id: 'u4l2q2',
              question: {
                type: 'mcq',
                prompt: '$\\dfrac{d}{dx}\\displaystyle\\int_0^{x^2} e^{t}\\,dt = ?$',
                choices: [
                  { id: 'A', label: '$e^{x^2}$', feedback: '漏了鏈鎖因子 $u\'(x)=2x$。' },
                  { id: 'B', label: '$2x\\,e^{x^2}$', feedback: '正確：$g(u)\\cdot u\'=e^{x^2}\\cdot 2x$。' },
                  { id: 'C', label: '$e^{x^2}-1$' },
                ],
                answer: 'B',
              },
              explanation: [{ t: 'math', tex: "g(u(x))\\cdot u'(x)=e^{x^2}\\cdot 2x" }],
            },
          ],
        },
        {
          id: 'u4l3',
          title: '碎形與幾何級數',
          type: 'teach',
          subtitle: '無窮自相似的面積總和',
          xp: 20,
          steps: [
            {
              kind: 'teach',
              id: 'u4l3s1',
              title: '自相似 = 等比級數',
              say: '碎形每縮一階，面積就乘一個固定比例——這正是等比級數！',
              body: [
                { t: 'p', text: '很多碎形問題（謝爾賓斯基地毯、科赫雪花…）本質都是**等比級數**：每一階「去掉」或「新增」的量，是上一階的固定倍率。' },
                { t: 'formula', name: '等比級數和（首項版）', tex: '\\sum_{k=0}^{\\infty} a\\,r^{\\,k} = \\frac{a}{1-r}\\quad(|r|<1)', note: '$a$ 是首項、$r$ 是公比' },
                { t: 'p', text: '謝爾賓斯基地毯：邊長 3 的正方形（面積 9），切 $3\\times3$ 去掉正中央（面積 1），對剩下 8 塊重複。每階去掉的面積：' },
                { t: 'steps', ordered: true, items: [
                  '第 1 階去掉 $1$',
                  '第 2 階：8 塊各去掉 $\\frac19$，共 $\\frac89$',
                  '第 3 階：共 $\\left(\\frac89\\right)^2$ …公比 $r=\\frac89$',
                  '總和 $\\dfrac{1}{1-\\frac89}=9$，剛好等於整塊面積（地毯面積趨近 0）',
                ] },
                {
                  t: 'widget',
                  widget: {
                    type: 'series',
                    height: 230,
                    params: { term: '(8/9)^x', from: 0, maxN: 14, target: 9, targetLabel: '9', mode: 'partial' },
                    caption: '去掉面積的部分和趨近 9 = 整塊面積',
                  },
                },
                { t: 'callout', tone: 'key', text: '只有 $|r|<1$ 才收斂；$|r|\\ge1$ 的「碎形」面積會發散到無窮。' },
              ],
            },
            {
              kind: 'question',
              id: 'u4l3q1',
              question: { type: 'fill', prompt: '$\\displaystyle\\sum_{k=0}^{\\infty}\\left(\\frac14\\right)^k=?$', accept: ['4/3'], chips: ['4', '/', '3'] },
              explanation: [{ t: 'math', tex: '\\frac{1}{1-\\frac14}=\\frac{1}{\\frac34}=\\frac43' }],
            },
            {
              kind: 'question',
              id: 'u4l3q2',
              question: {
                type: 'truefalse',
                prompt: '公比 $r=\\frac98$ 的等比級數會收斂到一個有限值。',
                answer: false,
              },
              explanation: [{ t: 'p', text: '$|r|=\\frac98>1$，項越來越大，級數發散，沒有有限和。' }],
            },
          ],
        },
        {
          id: 'u4cp',
          title: '終極測驗',
          type: 'checkpoint',
          subtitle: '碎形與級數收尾',
          xp: 40,
          steps: [
            {
              kind: 'question',
              id: 'u4cpq1',
              prompt: [{ t: 'p', text: '謝爾賓斯基地毯：邊長 3 的正方形，每次切 $3\\times3$ 去掉正中央，對剩下 8 塊重複。求去掉的面積總和。' }],
              question: { type: 'fill', prompt: '去掉面積總和 =', accept: ['9'] },
              explanation: [{ t: 'math', tex: '1+\\tfrac89+(\\tfrac89)^2+\\cdots=\\frac{1}{1-8/9}=9' }],
            },
            {
              kind: 'question',
              id: 'u4cpq2',
              question: { type: 'fill', prompt: '$\\displaystyle\\lim_{n\\to\\infty}\\frac{1+3+5+\\cdots+(2n-1)}{3n^2}$', accept: ['1/3'] },
              explanation: [{ t: 'p', text: '前 $n$ 個奇數和為 $n^2$，故極限 $=\\frac{n^2}{3n^2}=\\frac13$。' }],
            },
          ],
        },
      ],
    },
  ],

  /* ============================ 期末考卷 ============================ */
  exam: {
    id: 'final',
    title: '第 8 章・完整考卷',
    intro: '涵蓋是非題、配合題與填充題。作答完成後可看到逐題詳解。',
    passScore: 60,
    sections: [
      {
        id: 's1',
        title: '一、是非題',
        instructions: '正確打 ◯，錯誤打 ✕。',
        pointsEach: 3,
        questions: [
          { kind: 'question', id: 'e-tf1', question: { type: 'truefalse', prompt: '阿基里斯追龜：因為無窮多段，所以永遠追不上烏龜。', answer: false }, explanation: [{ t: 'p', text: '等比級數收斂，總和有限，追得上。' }] },
          { kind: 'question', id: 'e-tf2', question: { type: 'truefalse', prompt: '$1.999999\\cdots = 2$', answer: true }, explanation: [{ t: 'math', tex: '9x=18\\Rightarrow x=2' }] },
          { kind: 'question', id: 'e-tf3', question: { type: 'truefalse', prompt: '$3-3+3-\\cdots=(3-3)+(3-3)+\\cdots=0$', answer: false }, explanation: [{ t: 'p', text: '部分和不收斂，級數發散。' }] },
          { kind: 'question', id: 'e-tf4', question: { type: 'truefalse', prompt: '$\\int x\\,dx=\\tfrac12 x^2+c$', answer: true } },
          { kind: 'question', id: 'e-tf5', question: { type: 'truefalse', prompt: '積分符號 $\\int$ 可理解為 sum 的 s 拉長。', answer: true } },
          { kind: 'question', id: 'e-tf6', question: { type: 'truefalse', prompt: '若 $\\sum r^n$ 收斂，則數列 $\\langle r^n\\rangle$ 必收斂。', answer: true } },
          { kind: 'question', id: 'e-tf7', question: { type: 'truefalse', prompt: '$\\lim_{n\\to\\infty}(n-\\sqrt{n^2-n})=0$', answer: false }, explanation: [{ t: 'math', tex: '=\\frac12' }] },
        ],
      },
      {
        id: 's2',
        title: '二、配合題',
        instructions: '依圖形特徵選出最適合的方程式。',
        pointsEach: 3,
        questions: [
          {
            kind: 'question', id: 'e-m1',
            question: {
              type: 'match', prompt: '圖形配對',
              left: [
                { id: '圖1', label: '遞減・水平反曲點', widget: { type: 'graphThumb', height: 120, params: { expr: '-(x-1)^3-1', domain: [-1.5, 3.5], range: [-5, 5], color: '#b59bff' } } },
                { id: '圖2', label: '一峰一谷', widget: { type: 'graphThumb', height: 120, params: { expr: '(x-1)*(2-3*x)^2', domain: [-0.5, 2], range: [-3, 3], color: '#56c6ff' } } },
                { id: '圖3', label: '左深谷右平台', widget: { type: 'graphThumb', height: 120, params: { expr: 'x^4+4*x^3+1', domain: [-4, 1.5], range: [-30, 20], color: '#ffb454' } } },
              ],
              right: [
                { id: 'C', label: '$y=-x^3+3x^2-3x$' },
                { id: 'E', label: '$y=(x-1)(2-3x)^2$' },
                { id: 'H', label: '$y=x^4+4x^3+1$' },
              ],
              pairs: [['圖1', 'C'], ['圖2', 'E'], ['圖3', 'H']],
            },
          },
        ],
      },
      {
        id: 's3',
        title: '三、填充題',
        pointsEach: 4,
        questions: [
          { kind: 'question', id: 'e-f1', question: { type: 'fill', prompt: '$\\lim_{x\\to\\infty}\\frac{4^{x-1}+3^{x+7}}{3^{x+5}-2^{2x+1}}$', accept: ['-1/8', '-0.125'] } },
          { kind: 'question', id: 'e-f2', question: { type: 'fill', prompt: '$\\lim_{n\\to\\infty}\\frac{1+3+\\cdots+(2n-1)}{3n^2}$', accept: ['1/3'] } },
          { kind: 'question', id: 'e-f3', question: { type: 'fill', prompt: '$\\sum_{k=0}^{\\infty}\\frac{3^k-2^k}{6^k}$', accept: ['1/2', '0.5'] } },
          { kind: 'question', id: 'e-f4', question: { type: 'fill', prompt: '$\\int_{-3}^{2}f=5,\\ \\int_{3}^{2}f=7$，求 $\\int_{-3}^{3}2f$', accept: ['-4'] } },
          { kind: 'question', id: 'e-f5', question: { type: 'fill', prompt: '$\\int_0^\\pi\\sin x=2$，求 $\\int_0^{3\\pi}\\sin x$', accept: ['2'] } },
          { kind: 'question', id: 'e-f6', question: { type: 'fill', prompt: '$\\int_{-1}^{1}(x+2)(x-3)\\,dx$', accept: ['-34/3'] } },
          { kind: 'question', id: 'e-f7', question: { type: 'fill', prompt: '$\\int_0^5 |x-1|\\,dx$', accept: ['17/2', '8.5'] } },
          { kind: 'question', id: 'e-f8', question: { type: 'fill', prompt: '$\\int_1^2 (2x-1)^5\\,dx$', accept: ['182/3'] } },
          { kind: 'question', id: 'e-f9', question: { type: 'fill', prompt: '$F(x)=\\frac{d}{dx}\\int_1^x\\frac{1}{t^2+1}dt$，求 $F(2)$', accept: ['1/5', '0.2'] } },
          { kind: 'question', id: 'e-f10', question: { type: 'fill', prompt: '$y=x^2-x,\\ x=0,\\ x=2$ 與 x 軸圍成面積', accept: ['1'] } },
          { kind: 'question', id: 'e-f11', question: { type: 'fill', prompt: '$x^3-6x^2+9x+k=0$ 有一實根兩虛根，$k$ 範圍', accept: ['k<-4或k>0', 'k<-4 或 k>0'], normalize: 'text' } },
          { kind: 'question', id: 'e-f12', question: { type: 'fill', prompt: '反曲點原點、切線 $y=-x$ 的 $ax^3+bx^2+cx+d$，求 $b+c+d$', accept: ['-1'] } },
          { kind: 'question', id: 'e-f13', question: { type: 'fill', prompt: '$f(t)=-t^3+9t^2-15t+10,\\ 2\\le t\\le6$，求 $M+m$', accept: ['43'] } },
          { kind: 'question', id: 'e-f14', question: { type: 'fill', prompt: '謝爾賓斯基地毯（邊長3）去掉的面積總和', accept: ['9'] } },
        ],
      },
    ],
  },

  glossary: [
    { term: '收斂', definition: '部分和（或數列）有有限極限。' },
    { term: '等比級數', definition: '$\\sum r^n$，當 $|r|<1$ 收斂於 $\\frac{r}{1-r}$（從 $n=1$）。' },
    { term: '反曲點', definition: '二階導數變號、凹凸改變的點。' },
    { term: '微積分基本定理', definition: '$\\frac{d}{dx}\\int_a^x g(t)dt=g(x)$。' },
  ],
};
