window.onload = function () {
    $("img.lazy").lazyload({
        effect: "fadeIn"
    });
}

function sendEmail() {
    window.location = "mailto:hi@kurtlourens.com";
}