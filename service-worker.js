let CACHE_NAME = 'download-cache-v1.7';
let urlsToCache = [
	'/',
	'/#!/',
	'/index.html',
	'/index.html#!/',
	'/app.js',
	
	'/views/loading.tmpl.html',
	'/views/templates/home.tmpl.html',
	'/views/templates/dashboard.tmpl.html',
	
	'/assets/css/main.css',
	'/assets/css/grid.css',
	'/assets/css/custom.css',
	'/assets/css/scrollbar.css',
	'/assets/css/table.responsive.css',
	'/assets/css/fullscreen-loading.css',
	
	'/dist/DownloadApp.base.bundle.js',
	'/dist/DownloadApp.components.bundle.js',
	'/dist/DownloadApp.shared.bundle.js',
	
	'/assets/js/skel.min.js',
	'/assets/js/jquery.min.js',
	'/assets/js/jquery.scrollex.min.js',
	'/assets/js/util.js',
	
	'/images/Magnet-500.png',
	'/images/Logo.png',
	'/images/Menu/Home.png',
	'/images/Menu/Login.png',
	'/images/Menu/Logout.png',
	'/images/Menu/Dashboard.png',
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
    .then(function(cache) {
      console.log('Installed cache');
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});
