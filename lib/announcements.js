function clearAnnouncements() {
    $('#announcements > .announcements').each(function () {
        $(this).addClass("noselect");
    });
}

function getAnnouncements() {
    $.get('https://kurtlourens-cv-backend.azurewebsites.net/api/AnnouncementsV1', function (dataArray) {
        var rightNow = new Date();
        var todaysDate = rightNow.toISOString().slice(0, 10).replace(/-/g, "");
        var announcementsToDisplay = [];
        for (var dataIndex = 0; dataIndex < dataArray.length; dataIndex++) {
            if ((parseInt(dataArray[dataIndex].key) + 7) > parseInt(todaysDate)) {
                announcementsToDisplay.push(dataArray[dataIndex]);
            }

        }
        announcementsToDisplay.sort(compareAnnouncements);

        var announcementsHtml = "";
        for (var announcementIndex = 0; announcementIndex < announcementsToDisplay.length; announcementIndex++) {
            var announcement = announcementsToDisplay[announcementIndex];
            announcementsHtml += '<p class="announcements">' + announcement.value + '</p>';
        }
        $("#announcements").html(announcementsHtml);
    });
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