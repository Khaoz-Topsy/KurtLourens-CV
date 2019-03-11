window.onload = function () {
    // var raf = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
    //     window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    // if (raf) raf(function () { window.setTimeout(loadDeferredStyles, 0); });
    // else window.addEventListener('load', loadDeferredStyles);

    var instance = $("img.lazy").Lazy({ effect: "fadeIn", chainable: false });

    window.setTimeout(afterDocumentLoad(instance), 500);
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

function addToHomeScreen() {
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

function afterDocumentLoad(instance) {
    instance.update();
    removeLoader();
}

function removeLoader() {
    $(".full-page-loader").remove();
    $("body").removeClass("is-loading");
}

function hideOrShowInstallPwaButton(hasDeferredPromptLocal) {
    var sPageURL = window.location.search.substring(1);
    if (sPageURL.includes("standalone")) {
        console.log("app already installed");
        $("#custom-actions").remove();
        return;
    }

    if (hasDeferredPromptLocal) {
        console.log("hasDeferredPrompt show install button");
        $("#custom-actions").removeClass("hidden");
    } else {
        //console.log("no prompt stored, remove install button");
        //$("#custom-actions").remove();
    }
}

function sendEmail() {
    window.location = "mailto:hi@kurtlourens.com";
}

function toggleChildRowVisibility(selector) {
    console.log(selector);
    $('#' + selector + '>h2>i').toggleClass('upsideDown')
    $('#' + selector).children('.row').toggle()
}
