let CACHE_NAME = 'kurtlourens-1.3.8';
let criticalResources = [
  '/',
  '/index.html',
  '/offline.html',
  '/assets/css/main.min.css',
  '/assets/css/icon-pack.min.css',
  '/assets/fonts/icomoon.eot',
  '/assets/fonts/icomoon.svg',
  '/assets/fonts/icomoon.ttf',
  '/assets/fonts/icomoon.woff',
  '/assets/images/loader.svg',
  '/assets/images/KurtAvatar.svg',
  '/assets/js/bundle.min.js',
];

const clearOldCaches = function () {
  return caches.keys().then(keys => {
    var keyToDelete = keys.filter(key => key !== CACHE_NAME);
    return keyToDelete.map(key => Promise.resolve(caches.delete(key)));
  });
};

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function (cache) {
        return cache.addAll(criticalResources);
      })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(clearOldCaches().then(function () {
    self.clients.claim()
  }));
});

// const addToCache = function(cacheName, request, response) { 
//   caches.open(cacheName).then(cache => cache.put(request, response)); 
// };

// Default fetch
self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      return response || fetch(event.request);
    })
  );
});


// Online first
// self.addEventListener('fetch', function (event) { 
//   event.respondWith(
//     fetch(event.request).then(function (response) {
//       let responseCopy = response.clone();
//       addToCache(event.request, responseCopy);
//       return response;
//     }).catch(function () {
//       return caches.match(event.request)
//         .then(response => response || caches.match('/offline.html'));
//     })
//   );
// });

// Offline first
// self.addEventListener('fetch', function (event) {
//   event.respondWith(
//     caches.match(event.request).then(function (response) {
//       return response || fetch(event.request).then(function (response) {
//         let responseCopy = response.clone();
//         addToCache(event.request, responseCopy);
//       }).catch(function () {
//         return caches.match('/offline.html');
//       });
//     })
//   );
// });
