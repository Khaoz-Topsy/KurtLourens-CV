import $ from './jquery';
// import * as announcement from './announcements';

window.onload = function () {

    updateLazyLoadedImagesFromSelector('.inner img.lazy[data-src]');

    removeLoader();
    // announcement.getAnnouncements();

    window.setTimeout(updateAllLazyLoadedImages, 10000);
}

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
        hideOrShowInstallPwaButton(hasDeferredPrompt);
    });
}

export function addToHomeScreen() {
    if (hasDeferredPrompt) {
        deferredPrompt.prompt();
    } else {
        alert('Service Worker could not be installed, this might mean that your browser is not supported');
    }
}

function updateLazyLoadedImagesFromSelector(selector) {
    var instance = $(selector).Lazy({ effect: "fadeIn", chainable: false });
    instance.update();
}

function updateAllLazyLoadedImages() {
    console.log('updateAllLazyLoadedImages');
    updateLazyLoadedImagesFromSelector("img.lazy[data-src]");
}

function updateLazyLoadedImagesPerSection(id) {
    console.log(`updateLazyLoadedImages for #${id}`);
    updateLazyLoadedImagesFromSelector(`#${id} img.lazy[data-src]`);
}

function removeLoader() {
    $(".full-page-loader").remove();
    $("body").removeClass("is-loading");
}

export function hideOrShowInstallPwaButton(hasDeferredPromptLocal) {
    var sPageURL = window.location.search.substring(1);
    if (sPageURL.includes("standalone")) {
        console.log("app already installed");
        $("#pwa-install").remove();
        return;
    }

    if (hasDeferredPromptLocal) {
        console.log("hasDeferredPrompt show install button");
        $("#pwa-install").removeClass("hidden");
    } else {
        console.log("no prompt stored, remove install button");
        $("#pwa-install").remove();
    }
}

export function toggleChildRowVisibility(selector) {
    $('#' + selector + '>h2>i').toggleClass('upsideDown');
    $('#' + selector).children('.row').toggleClass('collapse');

    updateLazyLoadedImagesPerSection(selector);
}

export function toggleChildRowItemVisibility(selector, secondSelector) {
    $('#' + selector + ' .items').toggleClass(secondSelector);

    updateLazyLoadedImagesPerSection(selector);
}

export function toggleTechStacks() {
    $('body').toggleClass('hideTechStacks');

    updateLazyLoadedImagesPerSection(selector);
}

export function darkModeToggle() {
    $('body').toggleClass('dark');
    $('#darkModeSwitch').toggleClass('icon-brightness_4').toggleClass('icon-brightness_low');
}

// export function clearAnnouncements(element) { announcement.clearAnnouncements(element) }
