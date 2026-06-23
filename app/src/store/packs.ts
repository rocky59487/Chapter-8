import { create } from 'zustand';
import type { CoursePack, Lesson, Unit } from '@/types/pack';
import { calculusCh8 } from '@/content/calculus-ch8';

/**
 * Pack catalog. First-party packs are bundled as typed modules; additional
 * packs ("update packs") can be fetched at runtime from a URL or imported file
 * and registered here — that is how new courses are delivered without shipping
 * a new app build.
 */
interface PackState {
  packs: Record<string, CoursePack>;
  activeId: string;
  setActive: (id: string) => void;
  registerPack: (pack: CoursePack) => void;
  loadFromUrl: (url: string) => Promise<CoursePack>;
}

export const usePacks = create<PackState>((set, get) => ({
  packs: { [calculusCh8.id]: calculusCh8 },
  activeId: calculusCh8.id,
  setActive: (id) => set({ activeId: id }),
  registerPack: (pack) => set({ packs: { ...get().packs, [pack.id]: pack } }),
  loadFromUrl: async (url) => {
    const res = await fetch(url);
    const pack = (await res.json()) as CoursePack;
    get().registerPack(pack);
    return pack;
  },
}));

export function useActivePack(): CoursePack {
  return usePacks((s) => s.packs[s.activeId]);
}

/** Flatten lessons in path order with their unit context. */
export function lessonSequence(pack: CoursePack): { unit: Unit; lesson: Lesson; index: number }[] {
  const out: { unit: Unit; lesson: Lesson; index: number }[] = [];
  let idx = 0;
  for (const unit of pack.units) {
    for (const lesson of unit.lessons) {
      out.push({ unit, lesson, index: idx++ });
    }
  }
  return out;
}

export function findLesson(pack: CoursePack, lessonId: string) {
  for (const unit of pack.units) {
    const lesson = unit.lessons.find((l) => l.id === lessonId);
    if (lesson) return { unit, lesson };
  }
  return null;
}
