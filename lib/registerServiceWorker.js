var deferredPrompt;

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('serviceWorker.js').then(function () { })
    .catch(function () { });

  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault()
    deferredPrompt = e
  });
}


function addToHomeScreen() {
  deferredPrompt.prompt()
}