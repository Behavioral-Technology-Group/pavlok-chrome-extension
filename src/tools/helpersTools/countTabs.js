var config = {
    accountedWindowsId: [],
    totalTabs: 0,
    lastWindowID: 0,
    winTabs: 0
}

const countTabs = (mode, callback) => {
    if (mode == 'allWindows') {
        chrome.windows.getAll({ populate: true }, (windows, callback) => openTabsCounter(windows, callback));
    }

    else {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs, callback) => tabDetailsGetter(tabs, callback));
    }
    return
}

export default countTabs;

//------------------------------------------------------------------------------------

function openTabsCounter(windows, callback) {
    windows.forEach(function (window) {
        if (config.accountedWindowsId.indexOf(window.id) == -1) {
            config.accountedWindowsId.push(window.id);
            config.winTabs = window.tabs.length;
            config.totalTabs = config.totalTabs + config.winTabs;
        }
    });

    if (typeof callback === "function") {
        callback(config.totalTabs);
    }
}

function tabDetailsGetter(tabs, callback) {
    curPavTab = tabs[0];
    chrome.tabs.getAllInWindow(curPavTab.windowId, function (tabs) {
        config.totalTabs = tabs.length;

        if (typeof callback === "function") {
            callback(config.totalTabs);
        }
    });
}
