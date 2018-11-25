window.onload = function () {
    var raf = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    if (raf) raf(function () { window.setTimeout(loadDeferredStyles, 0); });
    else window.addEventListener('load', loadDeferredStyles);

    $("img.lazy").lazyload({
        effect: "fadeIn"
    });

    window.setTimeout(removeLoader, 500);
}

function loadDeferredStyles() {
    var addStylesNode = document.getElementById("deferred-styles");
    var replacement = document.createElement("div");
    replacement.innerHTML = addStylesNode.textContent;
    document.body.appendChild(replacement)
    addStylesNode.parentElement.removeChild(addStylesNode);
}

function removeLoader() {
    $(".full-page-loader").remove();
    $("body").removeClass("is-loading");
}

function sendEmail() {
    window.location = "mailto:hi@kurtlourens.com";
}
