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
