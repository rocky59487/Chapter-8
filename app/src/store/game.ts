import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/** Per-lesson progress record. */
export interface LessonProgress {
  completed: boolean;
  /** 0..1 best accuracy achieved. */
  bestScore: number;
  /** legendary = perfect run after completion. */
  crown: number;
  attempts: number;
}

export interface ExamRecord {
  score: number; // 0..100
  total: number;
  correct: number;
  takenAt: number;
}

const MAX_HEARTS = 5;
const HEART_REGEN_MS = 1000 * 60 * 20; // 20 min per heart

function todayKey(d = new Date()): string {
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}
function dayDiff(aKey: string, bKey: string): number {
  const [ay, am, ad] = aKey.split('-').map(Number);
  const [by, bm, bd] = bKey.split('-').map(Number);
  const a = Date.UTC(ay, am - 1, ad);
  const b = Date.UTC(by, bm - 1, bd);
  return Math.round((b - a) / 86400000);
}

export function levelFromXp(xp: number): { level: number; into: number; need: number } {
  // gentle curve: need grows each level
  let level = 1;
  let need = 50;
  let acc = 0;
  while (xp >= acc + need) {
    acc += need;
    level += 1;
    need = 50 + (level - 1) * 30;
  }
  return { level, into: xp - acc, need };
}

interface GameState {
  xp: number;
  hearts: number;
  heartsUpdatedAt: number;
  streak: number;
  lastActiveDay: string | null;
  lessons: Record<string, LessonProgress>;
  mastery: Record<string, boolean>;
  exam: ExamRecord | null;
  gems: number;

  // derived helpers
  regenHearts: () => void;
  loseHeart: () => void;
  refillHearts: () => void;
  addXp: (n: number) => void;
  markActiveToday: () => void;
  completeLesson: (id: string, score: number, xp: number) => void;
  setMastery: (id: string, v: boolean) => void;
  recordExam: (rec: ExamRecord) => void;
  resetAll: () => void;
}

export const useGame = create<GameState>()(
  persist(
    (set, get) => ({
      xp: 0,
      hearts: MAX_HEARTS,
      heartsUpdatedAt: Date.now(),
      streak: 0,
      lastActiveDay: null,
      lessons: {},
      mastery: {},
      exam: null,
      gems: 0,

      regenHearts: () => {
        const { hearts, heartsUpdatedAt } = get();
        if (hearts >= MAX_HEARTS) {
          if (heartsUpdatedAt !== 0) set({ heartsUpdatedAt: 0 });
          return;
        }
        const elapsed = Date.now() - heartsUpdatedAt;
        const gained = Math.floor(elapsed / HEART_REGEN_MS);
        if (gained > 0) {
          const newHearts = Math.min(MAX_HEARTS, hearts + gained);
          set({
            hearts: newHearts,
            heartsUpdatedAt:
              newHearts >= MAX_HEARTS ? 0 : heartsUpdatedAt + gained * HEART_REGEN_MS,
          });
        }
      },
      loseHeart: () => {
        const { hearts, heartsUpdatedAt } = get();
        const next = Math.max(0, hearts - 1);
        set({
          hearts: next,
          heartsUpdatedAt:
            hearts >= MAX_HEARTS ? Date.now() : heartsUpdatedAt || Date.now(),
        });
      },
      refillHearts: () => set({ hearts: MAX_HEARTS, heartsUpdatedAt: 0 }),
      addXp: (n) => set({ xp: get().xp + n }),

      markActiveToday: () => {
        const today = todayKey();
        const last = get().lastActiveDay;
        if (last === today) return;
        let streak = get().streak;
        if (last && dayDiff(last, today) === 1) streak += 1;
        else streak = 1;
        set({ streak, lastActiveDay: today });
      },

      completeLesson: (id, score, xp) => {
        const prev = get().lessons[id];
        const crown = score >= 0.999 ? Math.min((prev?.crown ?? 0) + (prev?.completed ? 0 : 1), 3) : prev?.crown ?? 0;
        const rec: LessonProgress = {
          completed: true,
          bestScore: Math.max(prev?.bestScore ?? 0, score),
          crown: prev?.completed ? Math.max(prev.crown, score >= 0.999 ? prev.crown + 1 : prev.crown) : crown,
          attempts: (prev?.attempts ?? 0) + 1,
        };
        set({ lessons: { ...get().lessons, [id]: rec } });
        get().addXp(xp);
        get().markActiveToday();
      },

      setMastery: (id, v) => set({ mastery: { ...get().mastery, [id]: v } }),
      recordExam: (rec) => {
        set({ exam: rec });
        get().addXp(Math.round(rec.score));
        get().markActiveToday();
      },
      resetAll: () =>
        set({
          xp: 0,
          hearts: MAX_HEARTS,
          heartsUpdatedAt: 0,
          streak: 0,
          lastActiveDay: null,
          lessons: {},
          mastery: {},
          exam: null,
          gems: 0,
        }),
    }),
    { name: 'lumina-progress-v1' }
  )
);

export { MAX_HEARTS };
