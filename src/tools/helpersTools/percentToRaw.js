function percentToRaw(percent, stimulus) {
    var rawRange;
    if (stimulus == 'zap') {
        rawRange = [32, 64, 85, 112, 128, 144, 160, 176, 192, 255];
    }
    else if (stimulus == 'beep' || stimulus == 'vibrate') {
        rawRange = [55, 75, 95, 115, 135, 155, 175, 195, 215, 255];
    }

    var index = ((parseInt(percent)) / 10) - 1;
    var rawN = rawRange[index];

    return rawN
}

export default percentToRaw;