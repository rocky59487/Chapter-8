/**
 * Tiny, safe math-expression compiler.
 *
 * Compiles a string like "x^3 - 2*x + sin(x)" into a fast `(x) => number`
 * function WITHOUT using eval/Function on raw input. It is a hand-written
 * shunting-yard parser producing a small AST, then an evaluator closure.
 *
 * Supported: + - * / ^, unary minus, parentheses, implicit multiplication
 * (2x, 3(x+1), x(x-1)), constants pi/e, and a whitelist of functions.
 */

type Token =
  | { t: 'num'; v: number }
  | { t: 'var'; v: string }
  | { t: 'fn'; v: string }
  | { t: 'op'; v: string }
  | { t: 'lp' }
  | { t: 'rp' };

const FUNCS: Record<string, (x: number) => number> = {
  sin: Math.sin,
  cos: Math.cos,
  tan: Math.tan,
  asin: Math.asin,
  acos: Math.acos,
  atan: Math.atan,
  sqrt: Math.sqrt,
  cbrt: Math.cbrt,
  abs: Math.abs,
  exp: Math.exp,
  ln: Math.log,
  log: Math.log10,
  sign: Math.sign,
  floor: Math.floor,
  ceil: Math.ceil,
};

const CONSTS: Record<string, number> = {
  pi: Math.PI,
  e: Math.E,
};

const PREC: Record<string, number> = { '+': 1, '-': 1, '*': 2, '/': 2, '^': 3 };
const RIGHT_ASSOC: Record<string, boolean> = { '^': true };

function tokenize(input: string): Token[] {
  const s = input.replace(/\s+/g, '');
  const tokens: Token[] = [];
  let i = 0;
  const isDigit = (c: string) => c >= '0' && c <= '9';
  const isAlpha = (c: string) => /[a-zA-Z]/.test(c);

  while (i < s.length) {
    const c = s[i];
    if (isDigit(c) || (c === '.' && isDigit(s[i + 1]))) {
      let j = i + 1;
      while (j < s.length && (isDigit(s[j]) || s[j] === '.')) j++;
      tokens.push({ t: 'num', v: parseFloat(s.slice(i, j)) });
      i = j;
    } else if (isAlpha(c)) {
      let j = i + 1;
      while (j < s.length && (isAlpha(s[j]) || isDigit(s[j]))) j++;
      const name = s.slice(i, j);
      if (name in FUNCS) tokens.push({ t: 'fn', v: name });
      else if (name in CONSTS) tokens.push({ t: 'num', v: CONSTS[name] });
      else tokens.push({ t: 'var', v: name });
      i = j;
    } else if ('+-*/^'.includes(c)) {
      tokens.push({ t: 'op', v: c });
      i++;
    } else if (c === '(' || c === '[') {
      tokens.push({ t: 'lp' });
      i++;
    } else if (c === ')' || c === ']') {
      tokens.push({ t: 'rp' });
      i++;
    } else {
      // skip unknown char
      i++;
    }
  }
  return insertImplicitMul(tokens);
}

/** Insert explicit '*' for implicit multiplication: 2x, )( , x( , 2( , )x */
function insertImplicitMul(tokens: Token[]): Token[] {
  const out: Token[] = [];
  for (let k = 0; k < tokens.length; k++) {
    const cur = tokens[k];
    const prev = out[out.length - 1];
    if (prev) {
      const prevEnds =
        prev.t === 'num' || prev.t === 'var' || prev.t === 'rp';
      const curStarts =
        cur.t === 'num' || cur.t === 'var' || cur.t === 'fn' || cur.t === 'lp';
      if (prevEnds && curStarts) out.push({ t: 'op', v: '*' });
    }
    out.push(cur);
  }
  return out;
}

type Node =
  | { k: 'num'; v: number }
  | { k: 'var' }
  | { k: 'fn'; name: string; arg: Node }
  | { k: 'op'; op: string; a: Node; b: Node }
  | { k: 'neg'; a: Node };

function parse(tokens: Token[]): Node {
  let pos = 0;
  const peek = () => tokens[pos];
  const next = () => tokens[pos++];

  function parseExpr(minPrec = 0): Node {
    let left = parseUnary();
    while (true) {
      const tk = peek();
      if (!tk || tk.t !== 'op') break;
      const prec = PREC[tk.v];
      if (prec < minPrec) break;
      next();
      const nextMin = RIGHT_ASSOC[tk.v] ? prec : prec + 1;
      const right = parseExpr(nextMin);
      left = { k: 'op', op: tk.v, a: left, b: right };
    }
    return left;
  }

  function parseUnary(): Node {
    const tk = peek();
    if (tk && tk.t === 'op' && (tk.v === '-' || tk.v === '+')) {
      next();
      const a = parseUnary();
      return tk.v === '-' ? { k: 'neg', a } : a;
    }
    return parseAtom();
  }

  function parseAtom(): Node {
    const tk = next();
    if (!tk) return { k: 'num', v: 0 };
    if (tk.t === 'num') return { k: 'num', v: tk.v };
    if (tk.t === 'var') return { k: 'var' };
    if (tk.t === 'fn') {
      // expects (...)
      if (peek() && peek().t === 'lp') {
        next();
        const arg = parseExpr(0);
        if (peek() && peek().t === 'rp') next();
        return { k: 'fn', name: tk.v, arg };
      }
      const arg = parseUnary();
      return { k: 'fn', name: tk.v, arg };
    }
    if (tk.t === 'lp') {
      const e = parseExpr(0);
      if (peek() && peek().t === 'rp') next();
      return e;
    }
    return { k: 'num', v: 0 };
  }

  return parseExpr(0);
}

function evalNode(n: Node, x: number): number {
  switch (n.k) {
    case 'num':
      return n.v;
    case 'var':
      return x;
    case 'neg':
      return -evalNode(n.a, x);
    case 'fn':
      return FUNCS[n.name](evalNode(n.arg, x));
    case 'op': {
      const a = evalNode(n.a, x);
      const b = evalNode(n.b, x);
      switch (n.op) {
        case '+':
          return a + b;
        case '-':
          return a - b;
        case '*':
          return a * b;
        case '/':
          return a / b;
        case '^':
          return Math.pow(a, b);
      }
      return NaN;
    }
  }
}

export type CompiledFn = (x: number) => number;

const cache = new Map<string, CompiledFn>();

/** Compile an expression string into a numeric function of x. */
export function compile(expr: string): CompiledFn {
  const cached = cache.get(expr);
  if (cached) return cached;
  let ast: Node;
  try {
    ast = parse(tokenize(expr));
  } catch {
    const fallback: CompiledFn = () => NaN;
    cache.set(expr, fallback);
    return fallback;
  }
  const fn: CompiledFn = (x: number) => {
    const v = evalNode(ast, x);
    return Number.isFinite(v) ? v : NaN;
  };
  cache.set(expr, fn);
  return fn;
}
