/**
 * Course Pack schema — the contract between content and engine.
 *
 * A course pack is a self-contained, downloadable JSON document describing an
 * entire learning experience: teaching units, interactive lessons, quizzes and
 * a final exam. The engine renders any pack that conforms to this schema, so a
 * new course == a new JSON file (an "update pack"), no code changes required.
 *
 * Design goals:
 *  - Authorable by an AI given only a problem set.
 *  - Rich teaching content (text, math, callouts, interactive widgets).
 *  - Duolingo-style flow: teach -> check -> practice -> checkpoint -> exam.
 */

export const PACK_SCHEMA_VERSION = 1;

/** Inline text may contain `$...$` for inline math and **bold** markers. */
export type RichText = string;

export interface CoursePack {
  id: string;
  schemaVersion: number;
  /** Human content version, e.g. "1.0.0" — used to detect update packs. */
  version: string;
  title: string;
  subtitle?: string;
  description?: RichText;
  language: string;
  subject: string;
  /** Emoji or short glyph shown on the course card / path header. */
  icon?: string;
  /** Hex accent color that themes the course. */
  accent?: string;
  authors?: string[];
  estimatedMinutes?: number;
  units: Unit[];
  exam?: Exam;
  glossary?: GlossaryEntry[];
}

export interface Unit {
  id: string;
  title: string;
  subtitle?: string;
  /** Hex color for this unit's path segment. */
  color?: string;
  icon?: string;
  lessons: Lesson[];
}

export type LessonType = 'teach' | 'practice' | 'checkpoint' | 'review';

export interface Lesson {
  id: string;
  title: string;
  type: LessonType;
  /** Short tagline shown in the node popover. */
  subtitle?: string;
  icon?: string;
  /** Base XP awarded for a clean completion. */
  xp?: number;
  steps: Step[];
}

/** A step is one screen inside the lesson player. */
export type Step = TeachStep | QuestionStep;

export interface TeachStep {
  kind: 'teach';
  id: string;
  title?: string;
  /** Optional mascot line shown while teaching. */
  say?: string;
  body: ContentBlock[];
}

export interface QuestionStep {
  kind: 'question';
  id: string;
  /** Optional lead-in / context blocks shown above the question. */
  prompt?: ContentBlock[];
  question: Question;
  /** Optional interactive widget shown with the question. */
  widget?: WidgetSpec;
  hint?: RichText;
  /** Shown after answering, regardless of correctness. */
  explanation?: ContentBlock[];
  /** Optional difficulty 1..3 for adaptive review. */
  difficulty?: number;
}

/* ----------------------------- Content blocks ----------------------------- */

export type ContentBlock =
  | { t: 'p'; text: RichText }
  | { t: 'h'; text: RichText }
  | { t: 'math'; tex: string; label?: string }
  | { t: 'steps'; ordered?: boolean; items: RichText[] }
  | { t: 'callout'; tone: CalloutTone; title?: string; text: RichText }
  | { t: 'image'; src: string; alt?: string; caption?: string }
  | { t: 'widget'; widget: WidgetSpec }
  | { t: 'formula'; tex: string; name?: RichText; note?: RichText };

export type CalloutTone = 'info' | 'tip' | 'trap' | 'key' | 'warn';

/* -------------------------------- Questions ------------------------------- */

export type Question =
  | McqQuestion
  | TrueFalseQuestion
  | FillQuestion
  | MatchQuestion
  | OrderQuestion;

export interface Choice {
  id: string;
  /** Rich label (may contain math). */
  label: RichText;
  /** Optional per-choice feedback shown when chosen. */
  feedback?: RichText;
}

export interface McqQuestion {
  type: 'mcq';
  prompt: RichText;
  choices: Choice[];
  /** id of the correct choice. */
  answer: string;
  shuffle?: boolean;
}

export interface TrueFalseQuestion {
  type: 'truefalse';
  prompt: RichText;
  answer: boolean;
  trueLabel?: string;
  falseLabel?: string;
}

/** Free-text / numeric answer with flexible acceptance. */
export interface FillQuestion {
  type: 'fill';
  prompt: RichText;
  /** Accepted answers; matched after normalization. */
  accept: string[];
  placeholder?: string;
  /** number → parse fractions/decimals; text → trimmed/case-insensitive. */
  normalize?: 'number' | 'text';
  /** Optional tappable suggestion chips. */
  chips?: string[];
  unit?: string;
}

export interface MatchItem {
  id: string;
  label: RichText;
  /** Optional widget (e.g. a graph thumbnail) instead of text. */
  widget?: WidgetSpec;
}

export interface MatchQuestion {
  type: 'match';
  prompt: RichText;
  left: MatchItem[];
  right: MatchItem[];
  /** Correct [leftId, rightId] pairs. */
  pairs: [string, string][];
}

/** Build a sequence by tapping tokens in the right order. */
export interface OrderQuestion {
  type: 'order';
  prompt: RichText;
  tokens: { id: string; label: RichText }[];
  /** token ids in correct order. */
  answer: string[];
}

/* --------------------------------- Widgets -------------------------------- */

export interface WidgetSpec {
  /** Registry key, e.g. 'functionPlot', 'riemann', 'series', 'numberLine'. */
  type: string;
  params?: Record<string, unknown>;
  height?: number;
  caption?: RichText;
}

/* --------------------------------- Exam ----------------------------------- */

export interface Exam {
  id: string;
  title: string;
  intro?: RichText;
  /** Percentage 0..100 needed to pass. */
  passScore?: number;
  sections: ExamSection[];
}

export interface ExamSection {
  id: string;
  title: string;
  instructions?: RichText;
  /** Points per question in this section. */
  pointsEach?: number;
  questions: QuestionStep[];
}

export interface GlossaryEntry {
  term: string;
  definition: RichText;
}
