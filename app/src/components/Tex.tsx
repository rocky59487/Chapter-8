import { useMemo } from 'react';
import katex from 'katex';

interface TexProps {
  tex: string;
  display?: boolean;
  className?: string;
}

/** Render a single KaTeX expression. */
export function Tex({ tex, display = false, className }: TexProps) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(tex, {
        displayMode: display,
        throwOnError: false,
        output: 'html',
        trust: false,
      });
    } catch {
      return tex;
    }
  }, [tex, display]);
  return <span className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}

/**
 * Rich inline text: renders `$...$` segments as KaTeX and `**bold**` as <strong>.
 * Everything else is plain text. Safe — no raw HTML from content is injected
 * except KaTeX's own sanitized output.
 */
export function Rich({ text, className }: { text: string; className?: string }) {
  const parts = useMemo(() => splitRich(text), [text]);
  return (
    <span className={className}>
      {parts.map((p, i) => {
        if (p.type === 'math') return <Tex key={i} tex={p.value} />;
        if (p.type === 'bold') return <strong key={i}>{p.value}</strong>;
        return <span key={i}>{p.value}</span>;
      })}
    </span>
  );
}

type Part = { type: 'text' | 'math' | 'bold'; value: string };

function splitRich(text: string): Part[] {
  const parts: Part[] = [];
  // First split out math by $...$
  const mathRe = /\$([^$]+)\$/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = mathRe.exec(text))) {
    if (m.index > last) pushText(parts, text.slice(last, m.index));
    parts.push({ type: 'math', value: m[1] });
    last = m.index + m[0].length;
  }
  if (last < text.length) pushText(parts, text.slice(last));
  return parts;
}

function pushText(parts: Part[], chunk: string) {
  const boldRe = /\*\*([^*]+)\*\*/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = boldRe.exec(chunk))) {
    if (m.index > last) parts.push({ type: 'text', value: chunk.slice(last, m.index) });
    parts.push({ type: 'bold', value: m[1] });
    last = m.index + m[0].length;
  }
  if (last < chunk.length) parts.push({ type: 'text', value: chunk.slice(last) });
}
