// Registers the service worker for offline support.
//
// Only runs in production builds (import.meta.env.PROD) and when the
// browser/WebView supports service workers. Kept side-effect-only so it can
// be imported once from main.tsx.
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // `import.meta.env.BASE_URL` respects Vite's `base: './'` so the worker
    // resolves correctly both from a web server and inside a WebView.
    const swUrl = `${import.meta.env.BASE_URL}sw.js`;
    navigator.serviceWorker.register(swUrl).catch((err) => {
      // Non-fatal: the app works fine without offline caching.
      console.warn('[Lumina] Service worker registration failed:', err);
    });
  });
}

export {};
