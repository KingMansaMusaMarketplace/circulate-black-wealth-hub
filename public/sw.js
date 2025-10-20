
// Service Worker for Circulate Black Wealth Hub PWA
const CACHE_NAME = 'wealth-hub-cache-v5'; // UPDATED: v5 - cache bump to prevent stale pages
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

  // Only handle GET requests to avoid Cache API errors for POST/PUT/etc
  if (req.method !== 'GET') {
    return; // Let the network handle non-GET requests
  }

  const url = new URL(req.url);
  const acceptsHTML = req.headers.get('accept')?.includes('text/html');

  // Network-first for navigations (HTML pages)
  if (req.mode === 'navigate' || acceptsHTML) {
    event.respondWith(
      fetch(req, { cache: 'no-store' })
        .then(response => {
          const resClone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(req, resClone));
          return response;
        })
        .catch(() => caches.match(req).then(res => res || caches.match('/index.html')))
    );
    return;
  }

  const isAsset = url.pathname.startsWith('/assets/');
  const isJSorCSS = isAsset && (url.pathname.endsWith('.js') || url.pathname.endsWith('.css'));
  const isImage = /\.(png|jpe?g|gif|svg|webp|ico)$/.test(url.pathname);

  if (isJSorCSS) {
    // Network-first for JS/CSS to avoid version mismatches after deploys
    event.respondWith(
      fetch(req)
        .then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(req, clone));
          return response;
        })
        .catch(() => caches.match(req))
    );
    return;
  }

  if (isImage) {
    // Cache-first for images
    event.respondWith(
      caches.match(req).then(cached => {
        if (cached) return cached;
        return fetch(req).then(response => {
          if (response && response.status === 200 && response.type === 'basic') {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(req, clone));
          }
          return response;
        });
      })
    );
    return;
  }

  // Default: network-first for other GET requests
  event.respondWith(
    fetch(req)
      .then(response => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(req, clone));
        return response;
      })
      .catch(() => caches.match(req))
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
