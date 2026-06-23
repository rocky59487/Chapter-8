/**
 * Answer normalization & checking.
 *
 * Supports numeric answers written as fractions ("1/2", "-34/3"), decimals,
 * percentages, and plain text. Numeric comparison is tolerant so that
 * "0.5", "1/2", ".5" all match.
 */

function parseNumeric(raw: string): number | null {
  let s = raw.trim();
  if (!s) return null;
  // strip common math wrappers
  s = s
    .replace(/\\frac\s*\{([^{}]+)\}\s*\{([^{}]+)\}/g, '($1)/($2)')
    .replace(/[，]/g, ',')
    .replace(/\s+/g, '')
    .replace(/[$\\]/g, '');
  // percentage
  if (/%$/.test(s)) {
    const n = parseNumeric(s.slice(0, -1));
    return n === null ? null : n / 100;
  }
  // simple fraction a/b (allow parentheses)
  const frac = s.match(/^\(?(-?\d*\.?\d+)\)?\/\(?(-?\d*\.?\d+)\)?$/);
  if (frac) {
    const a = parseFloat(frac[1]);
    const b = parseFloat(frac[2]);
    if (b === 0) return null;
    return a / b;
  }
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

function normalizeText(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[，]/g, ',')
    .replace(/[（(]/g, '(')
    .replace(/[）)]/g, ')')
    .replace(/[或]/g, '|');
}

export function checkFill(
  input: string,
  accept: string[],
  mode: 'number' | 'text' = 'number'
): boolean {
  if (!input.trim()) return false;
  if (mode === 'number') {
    const got = parseNumeric(input);
    if (got === null) {
      // fall back to text compare (e.g. "k<-4 或 k>0")
      const it = normalizeText(input);
      return accept.some((a) => normalizeText(a) === it);
    }
    return accept.some((a) => {
      const want = parseNumeric(a);
      if (want === null) return normalizeText(a) === normalizeText(input);
      return Math.abs(got - want) < 1e-6 * Math.max(1, Math.abs(want));
    });
  }
  const it = normalizeText(input);
  return accept.some((a) => normalizeText(a) === it);
}
