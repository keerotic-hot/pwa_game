var dataCacheName = 'pwagame';
var cacheName = 'pwagame';
var filesToCache = [
  '/',
  '/index.html',
  '/js/three.js',
  '/js/game.js',
  '/js/DeviceOrientationControls.js',
  '/img/skybox.jpg',
];

self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(filesToCache);
    })
  );
});