import { useSyncExternalStore } from 'react';

/** Minimal hash router — no dependency, works inside file:// (APK) WebViews. */
function subscribe(cb: () => void) {
  window.addEventListener('hashchange', cb);
  return () => window.removeEventListener('hashchange', cb);
}
function getSnapshot() {
  return window.location.hash || '#/';
}

export function useRoute(): string {
  return useSyncExternalStore(subscribe, getSnapshot);
}

export function navigate(to: string) {
  if (window.location.hash !== to) window.location.hash = to;
  else window.dispatchEvent(new HashChangeEvent('hashchange'));
}

export function parseRoute(hash: string): { name: string; params: string[] } {
  const path = hash.replace(/^#\/?/, '');
  const parts = path.split('/').filter(Boolean);
  return { name: parts[0] ?? 'home', params: parts.slice(1) };
}
