import lsGet from './lsGet';
import lsSet from './lsSet';
import isValid from './isValid';

function UpdateBadgeOnOff(badgeText) {
    var logged = isValid(lsGet("accessToken"));
    var badgeStatus = lsGet('badgeStatus');

    if (logged == true) {
        if (badgeStatus == "off") {
            chrome.browserAction.setIcon({ path: 'images/logo_128x128.png' });
            badgeStatus = "on";
        }
        chrome.browserAction.setBadgeBackgroundColor({ color: [38, 25, 211, 255] });
        chrome.browserAction.setBadgeText({ text: badgeText });
    }
    else {
        if (badgeStatus == "on" || badgeStatus == false) {
            chrome.browserAction.setIcon({ path: 'images/off_128x128.png' });
            badgeStatus = "off";
        }
        chrome.browserAction.setBadgeBackgroundColor({ color: [100, 100, 100, 130] });
        chrome.browserAction.setBadgeText({ text: "Off" });
    }
    lsSet('badgeStatus', badgeStatus);
}

export default UpdateBadgeOnOff;