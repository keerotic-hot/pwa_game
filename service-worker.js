var dataCacheName = 'pwagame';
var cacheName = 'pwagame';
var base = '';
var filesToCache = [
  base+'/',
  base+'/index.html',
  base+'/js/three.js',
  base+'/js/game.js',
  base+'/js/DeviceOrientationControls.js',
  base+'/js/OBJLoader.js',
  base+'/img/skybox.jpg',
  base+'/img/floor.jpg',
  base+'/img/coin.png',
  base+'/img/obj/cactus.obj',
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