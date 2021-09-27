import log from './log';

function stimuli(stimulus, value, accessToken, textAlert, forceNotify) {
    const checkedAcessToken = accessTokenChecker(accessToken);
    const checkedIntensity = intensityChecker(value, stimulus);

    var config = {
        lastVib: 0,
        limitRep: 500,
        now: new Date().getTime(),
        notify: true,
        accessToken: accessToken || accessTokenChecker(accessToken),
        postURL: lsGet("baseAddress") + 'api/v1/' + stimulus + '/' + checkedIntensity + '?access_token=' + checkedAcessToken,
        intensity: ""
    }

    var dif = config.now - config.lastVib;
    config.lastVib = config.now;
    if (dif < config.limitRep) { return }

    if (!textAlert) { textAlert = "Incoming " + stimulus; }

    if (stimulus == 'beep' && lsGet("notifyBeep") == 'false') { config.notify = false; }
    else if (stimulus == 'vibration' && lsGet("notifyVibration") == 'false') { config.notify = false; }
    else if (stimulus == 'shock' && lsGet("notifyZap") == 'false') { config.notify = false; }

    if (forceNotify == 'false') { config.notify = false; }
    else if (forceNotify == 'true') { config.notify = true; }

    if (textAlert.length > 0) { config.postURL = config.postURL + '&reason=' + textAlert; }
    else { alert("stimuli without reason"); }

    log("URL being POSTED is:\n" + config.postURL);
    $.post(config.postURL)
        .done(function (data, result) {
            return log(stimulus + ' succeeded!\n' + data + " " + result);
        })
        .fail(function () {
            log('Failed the new API. Trying the old one');
            let objectCode = lsGet("objectCode");
            if (stimulus == "vibration") { stimulus = "vibro"; }
            log(stimulus + ' failed!\nUrl was: ' + config.postURL + "\nTrying the old API at: ");
            $.get('https://app.pavlok.com/api/' + objectCode + '/' + stimulus + '/' + config.intensity);

            return
        });

}

export default stimuli;

//-----------------------------------------------------------

function accessTokenChecker(accessToken) {
    if (!accessToken || accessToken == 'defAT' || '') { accessToken = lsGet("accessToken"); }
    return accessToken;
}

function intensityChecker(value, stimulus) {
    if (!value || value == 'defInt' || '') {
        switch (stimulus) {
            case 'shock':
                value = lsGet("zapIntensity");
                break;
            case 'vibration':
                value = lsGet("vibrationIntensity");
                break;
            case 'beep':
                value = lsGet("beepIntensity");
                break;
            default:
                value = 155;
                break;
        }
    }
    return value;
}


