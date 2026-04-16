const CACHE_NAME = 'ddf-tracker-v2';
const ASSETS = [
  './',
  'index.html',
  'style.css',
  'script.js',
  'config.js',
  'manifest.json',
  'icon-192.png',
  'icon-512.png',
  'icons/apple_music.svg',
  'icons/Amazon_Music.png',
  'icons/deezer.png',
  'icons/bookbeat.png',
  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2'
];

// Install Service Worker and cache assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate and clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
  return self.clients.claim();
});

// Fetch assets from cache or network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      return cachedResponse || fetch(event.request);
    })
  );
});
