/* Lumina service worker — minimal cache-first offline support.
 *
 * Strategy: cache-first for same-origin GET requests with a network
 * fallback. On a cache miss we fetch from the network and, when the
 * response is OK, store a copy for next time. Non-GET and cross-origin
 * requests are passed straight through to the network.
 */
const CACHE = 'lumina-cache-v1';

self.addEventListener('install', (event) => {
  // Activate the new worker as soon as it has installed.
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      // Drop any caches from previous versions.
      const keys = await caches.keys();
      await Promise.all(
        keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))
      );
      await self.clients.claim();
    })()
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Only handle same-origin GET requests; everything else goes to network.
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE);
      const cached = await cache.match(request);
      if (cached) return cached;

      try {
        const response = await fetch(request);
        // Cache successful, basic (same-origin) responses for next time.
        if (response && response.ok && response.type === 'basic') {
          cache.put(request, response.clone());
        }
        return response;
      } catch (err) {
        // Offline and not cached: for navigations, fall back to the shell.
        if (request.mode === 'navigate') {
          const shell = await cache.match('./index.html');
          if (shell) return shell;
        }
        throw err;
      }
    })()
  );
});
