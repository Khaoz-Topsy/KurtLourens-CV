import $ from './jquery';

const announcementDismissalTimeInMilli = 10000;

export function clearAnnouncements(element) {
    $(element).remove();
}

export function getAnnouncements() {
    $.ajax({
        url: 'https://api.remoteconfigs.com/Configurations/be4671bc/Object',
        type: 'GET',
        beforeSend: function (xhr) { xhr.setRequestHeader('apikey', 'RC_f3233311c1a97b5bfc77a6bf390933d9bf0c9194'); },
        success: function (result) {
            displayStatus(result.settings.announcements);
            setTimeout(() => {
                removeAnnouncement()
            }, announcementDismissalTimeInMilli);
        }
    });
}

function removeAnnouncement() {
    var items = $("#announcements").children();
    if (items == null) return;
    if (items.length < 1) return;

    clearAnnouncements(items[0]);

    if (items.length < 2) return;

    setTimeout(() => {
        removeAnnouncement();
    }, announcementDismissalTimeInMilli / 3);
}

function displayStatus(statusValue) {
    var statuses = statusValue.split('||');
    var statusHtml = '';
    for (var statusIndex = 0; statusIndex < statuses.length; statusIndex++) {
        statusHtml += '<p onclick="KurtLourens.clearAnnouncements(this)"><span>' + statuses[statusIndex] + '</span></p>';
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