let CACHE_NAME = 'kurtlourens-1.5.7';
let criticalResources = [
  '/',
  // '/index.html',
  '/dist/bundle.css',
  '/dist/bundle.js',
  '/dist/fonts/icomoon.eot',
  '/dist/fonts/icomoon.svg',
  '/dist/fonts/icomoon.ttf',
  '/dist/fonts/icomoon.woff',
  '/assets/images/loader.svg',
  '/assets/images/KurtAvatar.svg',
  'https://khaoznet.visualstudio.com/KhaozNet/_apis/build/status/KhaozNet.CV.v2%20-%20CI',
  'https://khaoznet.vsrm.visualstudio.com/_apis/public/Release/badge/b5441643-fd7c-4330-92d7-bffc23a7e0a4/15/20',
  'https://khaoznet.visualstudio.com/KhaozNet/_apis/build/status/KhaozNet.FlutterCV%20-%20CI',
  'https://khaoznet.vsrm.visualstudio.com/_apis/public/Release/badge/b5441643-fd7c-4330-92d7-bffc23a7e0a4/18/25'
];
let networkTimeout = 2500;
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
  if (event.request.url.includes('azurewebsites')) return;

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