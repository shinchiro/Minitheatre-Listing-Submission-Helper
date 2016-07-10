var malMenuItem = chrome.contextMenus.create({
    "title": "Copy MAL Information",
    "contexts": ['all'],
    "onclick": malMenuItemClick
});
var mtMenuItem = chrome.contextMenus.create({
    "title": "Paste MAL Information",
    "contexts": ['all'],
    "onclick": mtMenuItemClick
});

var Information = {
    mainTitle: '',
    altTitles: '',
    imgURL: '',
    typePage: '',
    typeCate: '',
    episodes: '',
    chapters: '',
    volumes: '',
    authors: '',
    serialization: '',
    airDate: '',
    producers: new Array(),
    producersL: new Array(),
    genres: new Array(),
    duration: 0,
    rating: 0,
    openingSong: '',
    endingSong: '',
    link: '',
    summary: ''
};

var signal = {
    action: '',
    data: {}
};

function malMenuItemClick(info, tab) {
    signal.action = 'copy';
    signal.data = {};
    chrome.tabs.sendMessage(tab.id, signal, function(respone) {
        if (respone.result == true) {
            Information = respone.data;
            showResult(signal.action);
        }
    });
}

function mtMenuItemClick(info, tab) {
    signal.action = 'paste';
    signal.data = Information;
    chrome.tabs.sendMessage(tab.id, signal, function(respone) {
        if (respone.result == true) {
            showResult(signal.action);
        }
    });
}

function showResult(action) {
    var title = '';
    var msg = '';
    title = Information.typePage + ' ' + Information.typeCate + ': ';
    if (Information.typePage == 'Manga') {
        title = Information.typeCate + ': ';
    }
    title += '"' + Information.mainTitle + '"';
    if (action == 'copy') {
        msg += 'Information Copied! Now you can paste them to your listing submission form';
    } else {
        msg += 'Information Pasted!';
    }
    if (window.webkitNotifications) {
        if (webkitNotifications.checkPermission() == 0) {
            var notification = webkitNotifications.createNotification(
            Information.imgURL, // icon url - can be relative
            title, // notification title
            msg// notification body text
            );
            notification.show();
            setTimeout(function() {
                notification.cancel()
            }, 5000);
        } else {
            alert(title+'\n'+msg);
        }
    } else {
         alert(title+'\n'+msg);
    }
}


//chrome.extension.onMessage.addListener(function(copiedInfo) {
//    Information = copiedInfo;
//    var tempT = Information.typePage + ' ' + Information.typeCate + ': ';
//    if (Information.typePage == 'Manga') {
//        tempT = Information.typeCate + ': ';
//    }
//    tempT += Information.mainTitle;
//    if (window.webkitNotifications) {
//        if (webkitNotifications.checkPermission() == 0) {
//            var notification = webkitNotifications.createNotification(
//            Information.imgURL, // icon url - can be relative
//            tempT, // notification title
//            'Information copied! You can paste into your listing submission form!' // notification body text
//            );
//            notification.show();
//            setTimeout(function() {
//                notification.cancel()
//            }, 5000);
//        } else {
//            alert('Info about' + tempT + ': "' + this.mainTitle + '" Copied!');
//        }
//    } else {
//        alert('Info about' + tempT + ': "' + this.mainTitle + '" Copied!');
//    }
//});