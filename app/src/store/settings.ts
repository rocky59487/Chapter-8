import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { setSfxEnabled } from '@/lib/sfx';

type Theme = 'light' | 'dark';

interface SettingsState {
  theme: Theme;
  sound: boolean;
  haptics: boolean;
  reducedMotion: boolean;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
  setSound: (v: boolean) => void;
  setHaptics: (v: boolean) => void;
}

function applyTheme(theme: Theme) {
  if (typeof document === 'undefined') return;
  document.documentElement.classList.toggle('dark', theme === 'dark');
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', theme === 'dark' ? '#070d18' : '#f3f6fb');
}

export const useSettings = create<SettingsState>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      sound: true,
      haptics: true,
      reducedMotion: false,
      setTheme: (theme) => {
        applyTheme(theme);
        set({ theme });
      },
      toggleTheme: () => {
        const next = get().theme === 'dark' ? 'light' : 'dark';
        applyTheme(next);
        set({ theme: next });
      },
      setSound: (sound) => {
        setSfxEnabled(sound);
        set({ sound });
      },
      setHaptics: (haptics) => set({ haptics }),
    }),
    {
      name: 'lumina-settings-v1',
      onRehydrateStorage: () => (state) => {
        if (state) {
          applyTheme(state.theme);
          setSfxEnabled(state.sound);
        }
      },
    }
  )
);
