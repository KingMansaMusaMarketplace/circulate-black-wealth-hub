
// Service Worker for Circulate Black Wealth Hub PWA
const CACHE_NAME = 'wealth-hub-cache-v3'; // UPDATED: v3 - network-first for navigations to fix blank page
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico'
];

// Check if the app is running in Capacitor
const isCapacitor = () => {
  // Service workers use 'self' not 'window'
  return self.location.protocol === 'capacitor:';
};

self.addEventListener('install', event => {
  // Force the new service worker to take over immediately
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  // Skip caching for Capacitor requests
  if (isCapacitor()) {
    // Do not intercept; let the network handle it in Capacitor
    return; 
  }

  const req = event.request;

  // Network-first for navigations (HTML pages)
  if (req.mode === 'navigate' || (req.method === 'GET' && req.headers.get('accept')?.includes('text/html'))) {
    event.respondWith(
      fetch(req)
        .then(response => {
          const resClone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(req, resClone));
          return response;
        })
        .catch(() => caches.match(req).then(res => res || caches.match('/index.html')))
    );
    return;
  }

  // Cache-first for other assets (CSS/JS/images)
  event.respondWith(
    caches.match(req).then(cached => {
      if (cached) return cached;
      return fetch(req).then(response => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(req, responseToCache));
        return response;
      });
    })
  );
});

self.addEventListener('activate', event => {
  // Take control of all clients immediately
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME) {
              return caches.delete(cacheName);
            }
          })
        );
      })
    ])
  );
});
