import type { Question } from '@/types/pack';
import { checkFill } from '@/lib/answer';

export type AnswerValue =
  | string
  | boolean
  | string[]
  | Record<string, string>
  | null;

export function isAnswered(q: Question, v: AnswerValue): boolean {
  switch (q.type) {
    case 'mcq':
      return typeof v === 'string' && v.length > 0;
    case 'truefalse':
      return typeof v === 'boolean';
    case 'fill':
      return typeof v === 'string' && v.trim().length > 0;
    case 'match':
      return !!v && typeof v === 'object' && Object.keys(v).length === q.left.length;
    case 'order':
      return Array.isArray(v) && v.length === q.answer.length;
  }
}

export function grade(q: Question, v: AnswerValue): boolean {
  switch (q.type) {
    case 'mcq':
      return v === q.answer;
    case 'truefalse':
      return v === q.answer;
    case 'fill':
      return typeof v === 'string' && checkFill(v, q.accept, q.normalize ?? 'number');
    case 'match': {
      if (!v || typeof v !== 'object') return false;
      const map = v as Record<string, string>;
      return q.pairs.every(([l, r]) => map[l] === r);
    }
    case 'order':
      return Array.isArray(v) && v.length === q.answer.length && v.every((id, i) => id === q.answer[i]);
  }
}
