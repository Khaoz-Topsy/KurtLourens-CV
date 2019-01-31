let CACHE_NAME = 'kurtlourens-1.4.5';
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
let networkTimeout = 500;
let onlineFirst = true;

let clearOldCaches = function () {
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


self.addEventListener('fetch', function (event) {
  if (event.request.method !== 'GET') return;
  if (event.request.url.includes('docs')) return;

  if (onlineFirst) {
    event.respondWith(fromNetwork(event.request, networkTimeout)
      .catch(function () {
        console.log('request took too long, serving from cache', event.request.url);
        return fromCache(event.request);
      })
    );
  }
  else {
    const cachedItem = fromCache(event.request);
    event.respondWith(cachedItem || fetch(event.request));
  }
});

function fromNetwork(request, timeout) {
  return new Promise(function (fulfill, reject) {
    var timeoutId = setTimeout(reject, timeout);
    fetch(request).then(function (response) {
      clearTimeout(timeoutId);
      fulfill(response);
    }, reject);
  });
}

function fromCache(request) {
  caches.match(request).then(function (response) {
    return response;
  });
  return null;
}