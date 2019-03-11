var deferredPrompt;
var hasDeferredPrompt = false;

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('serviceWorker.js').then(function () { })
    .catch(function () { });

  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    deferredPrompt = e;
    hasDeferredPrompt = true;
  });
}


function addToHomeScreen() {
  if (hasDeferredPrompt) {
    deferredPrompt.prompt();
  } else {
    alert('Service Worker could not be installed, this might mean that your browser is not supported');
  }
}