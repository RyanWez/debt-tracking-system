// Service Worker for Debt Tracking System PWA
const CACHE_NAME = 'debt-tracker-v1.5.2';
const urlsToCache = [
  './',
  './index.html',
  './styles/fonts.css',
  './styles/animations.css',
  './styles/brutalist.css',
  './styles/gradients.css',
  './styles/scrollbar.css',
  './styles/toast.css',
  './styles/dropdown.css',
  './styles/responsive.css',
  './styles/datepicker.css',
  './scripts/utils.js',
  './scripts/storage.js',
  './scripts/customers.js',
  './scripts/debts.js',
  './scripts/payments.js',
  './scripts/dashboard.js',
  './scripts/modals.js',
  './scripts/dropdown.js',
  './scripts/settings.js',
  './scripts/app.js',
  './scripts/pin.js',
  './scripts/pin-ui.js',
  './images/logo.svg',
  './images/android-chrome-192x192.png',
  './images/android-chrome-512x512.png',
  './images/apple-touch-icon.png',
  './images/favicon-16x16.png',
  './images/favicon-32x32.png',
  './images/favicon.ico'
];

// Listen for messages from the client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Install event - cache resources
self.addEventListener('install', event => {


  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - Network First, Fallback to Cache
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        const responseToCache = response.clone();

        caches.open(CACHE_NAME)
          .then(cache => {
            cache.put(event.request, responseToCache);
          });

        return response;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  // Claim any clients immediately, so they don't have to reload to be controlled
  event.waitUntil(clients.claim());

  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});