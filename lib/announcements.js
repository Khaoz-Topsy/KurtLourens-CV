function clearAnnouncements(element) {
    $(element).remove();

    //$('#announcements > p::nth-child(' + childNum + ')').remove();
}

// function getAnnouncements() {
//     $.get('https://kurtlourens-cv-backend.azurewebsites.net/api/AnnouncementsV1', function (dataArray) {
//         displayAnnouncements(dataArray);
//     });
// }

function getAnnouncements() {
    $.ajax({
        url: 'https://api.remoteconfigs.com/Configurations/be4671bc/Object',
        type: 'GET',
        beforeSend: function (xhr) { xhr.setRequestHeader('apikey', 'RC_f3233311c1a97b5bfc77a6bf390933d9bf0c9194'); },
        success: function (result) {
            displayStatus(result.settings.announcements);
        }
    });
}

function displayStatus(statusValue) {
    var statuses = statusValue.split('||');
    var statusHtml = '';
    for (var statusIndex = 0; statusIndex < statuses.length; statusIndex++) {
        statusHtml += '<p onclick="clearAnnouncements(this)"><span>' + statuses[statusIndex] + '</span></p>';
    }
    $("#announcements").html(statusHtml);
}

function compareAnnouncements(a, b) {
    var keyA = parseInt(a.key);
    var keyB = parseInt(b.key);

    var comparison = 0;
    if (keyA > keyB) {
        comparison = 1;
    } else if (keyA < keyB) {
        comparison = -1;
    }
    return comparison;
}