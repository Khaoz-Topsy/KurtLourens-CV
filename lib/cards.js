function generateHtmlFromJson() {
    var cvJson = 'assets/json/cv.json';
    var request = new XMLHttpRequest();
    request.open('GET', cvJson, true);

    request.onload = function () {
        if (request.status >= 200 && request.status < 400) {
            var data = JSON.parse(request.responseText);

            var workExpsHtml = generateCardHtmlFromArray(data.workExperiences);
            $('#work > .row').html(workExpsHtml);

            var certHtml = generateCardHtmlFromArray(data.certificates);
            $('#certificates > .row').html(certHtml);

            var projectsHtml = generateCardHtmlFromArray(data.projects);
            $('#projects > .row').html(projectsHtml);
        } else {
            alert('error');
        }
    };

    request.onerror = function () {
        alert('error');
    };

    request.send();
}

function generateCardHtml(card) {
    if (card.pureHtml) {
        return card.pureHtml;
    }
    var cardHtml = '<article class="col-6 col-12-large col-12-medium col-12-small col-12-xsmall work-item">' +
        '<div class="card full2">' +
        '<div class="top-right">' +
        '<img src="assets/images/loader.svg" data-src="' + card.image + '" class="company lazy invert" alt="' + card.imageAlt + '" />' +
        '<br />' +
        '<p class="label ' + card.timePeriodClass + '">' + card.timePeriodText + '</p>' +
        '</div>' +
        '<h2>';

    cardHtml += card.isAward ? '<strong itemprop="award">' : '<strong>';
    cardHtml += card.title + '</strong>';

    if (card.links && card.links.length > 0) {
        var linksHtml = '<small>';
        for (var linkIndex = 0; linkIndex < card.links.length; linkIndex++) {
            var link = card.links[linkIndex];
            if (linkIndex > 0) {
                linksHtml += ', ';
            }
            linksHtml += '<a href="' + link.altUrl + '" target="_blank" rel="noopener" title="' + link.alt + '" alt="' + link.alt + '">' + link.text + '</a>';
        }
        linksHtml += '</small>';
        cardHtml += linksHtml;
    } else {
        cardHtml += '<small>' + card.location + '</small>';
    }

    cardHtml += '</h2>';

    if (card.contentHtml) {
        cardHtml += card.contentHtml;
    } else {
        cardHtml += '<p>' + card.content + '</p>';
    }

    if (card.buttons) {
        var linksHtml = '<div class="pretty-button-container">';
        for (var buttonIndex = 0; buttonIndex < card.buttons.length; buttonIndex++) {
            var button = card.buttons[buttonIndex];
            linksHtml += '<a href="' + button.url + '" target="_blank" rel="noopener" class="pretty-button -blue center" title="' + button.alt + '">' + button.text + '</a>';
        }
        linksHtml += '</div>';
        cardHtml += linksHtml;
    }
    cardHtml += '</div></article>';
    return cardHtml;
}

function generateCardHtmlFromArray(array) {
    var html = "";
    for (i = 0; i < array.length; i++) {
        var item = array[i];
        html += generateCardHtml(item);
    }
    return html;
}
