window.onload = function () {
    var raf = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    if (raf) raf(function () { window.setTimeout(loadDeferredStyles, 0); });
    else window.addEventListener('load', loadDeferredStyles);

    var instance = $("img.lazy").Lazy({ effect: "fadeIn", chainable: false });

    window.setTimeout(afterDocumentLoad(instance), 250);
}

function loadDeferredStyles() {
    var addStylesNode = document.getElementById("deferred-styles");
    var replacement = document.createElement("div");
    replacement.innerHTML = addStylesNode.textContent;
    document.body.appendChild(replacement)
    addStylesNode.parentElement.removeChild(addStylesNode);
}

function afterDocumentLoad(instance) {
    removeLoader();
    instance.update()
}

function removeLoader() {
    $(".full-page-loader").remove();
    $("body").removeClass("is-loading");
}

function sendEmail() {
    window.location = "mailto:hi@kurtlourens.com";
}

function toggleChildRowVisibility(selector) {
    $(selector).children('.row').toggle()
}
