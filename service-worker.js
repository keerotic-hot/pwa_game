var dataCacheName = 'pwagame';
var cachedName = 'pwagame';
var base = '';
var filesToCache = [
  base+'/',
  base+'/index.html',
  base+'/js/three.min.js',
  base+'/js/game.js',
  base+'/img/skybox.jpg',
  base+'/img/floor.jpg',
  base+'/img/coin.png',
  base+'/img/mute.png',
  base+'/img/obj/cactus.obj',
  base+'/snd/coin.mp3',
  base+'/snd/hurt.mp3',
  base+'/snd/bg.mp3',
];

self.addEventListener('install', e => {
  console.log('[ServiceWorker] Installed')
  e.waitUntil(preCache())
})

self.addEventListener('fetch', e => {
  console.log('[ServiceWorker] Serving the asset.')
  e.respondWith(fromNetwork(e.request, 1000).catch(() => {
    return fromCache(e.request)
  }))
})

const preCache = () => {
  caches.open(cachedName).then((cache) => {
    console.log('[ServiceWorker] Caching app shell')
    return cache.addAll(filesToCache)
  })
}

const fromNetwork = (req, timeout) => {
  return new Promise((resolve, reject) => {
    let timeoutId = setTimeout(reject, timeout)
    fetch(req).then((res) => {
      clearTimeout(timeoutId)
      resolve(res)
    }, reject)
  })
}

const fromCache = (req) => {
  return caches.open(cachedName).then(cache => {
    return cache.match(req).then(matching => {
      return matching || Promise.reject(new Error('no-match'))
    })
  })
}