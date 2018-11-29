if (navigator.serviceWorker.controller) {
} else {
  navigator.serviceWorker.register('pwabuilder-sw.js', {
    scope: './'
  }).then(function () { });
}

