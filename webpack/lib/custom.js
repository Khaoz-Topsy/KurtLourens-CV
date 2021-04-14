import $ from './jquery';
import * as announcement from './announcements';

window.onload = function () {
    // var raf = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
    //     window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    // if (raf) raf(function () { window.setTimeout(loadDeferredStyles, 0); });
    // else window.addEventListener('load', loadDeferredStyles);

    updateLazyLoadedImagesFromSelector(".inner img.lazy[data-src]");

    removeLoader();
    announcement.getAnnouncements();

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


// function loadDeferredStyles() {
//     var addStylesNode = document.getElementById("deferred-styles");
//     var replacement = document.createElement("div");
//     replacement.innerHTML = addStylesNode.textContent;
//     document.body.appendChild(replacement)
//     addStylesNode.parentElement.removeChild(addStylesNode);
// }

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
    $('#' + selector).children('.row').toggle();

    updateLazyLoadedImagesPerSection(selector);
}

export function darkModeToggle() {
    $("body").toggleClass('dark');
    $("#darkModeSwitch").toggleClass('icon-brightness_4').toggleClass('icon-brightness_low');
}

export function clearAnnouncements(element) { announcement.clearAnnouncements(element) }
