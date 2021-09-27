function rawToPercent(raw, stimulus) {
    raw = parseInt(raw);
    var rawRange;
    if (stimulus == 'zap') {
        rawRange = [32, 64, 85, 112, 128, 144, 160, 176, 192, 255];
    }
    else if (stimulus == 'beep' || stimulus == 'vibrate') {
        rawRange = [55, 75, 95, 115, 135, 155, 175, 195, 215, 255];
    }

    var index = rawRange.indexOf(raw);

    var percN = (index + 1) * 10;
    return percN
}

export default rawToPercent;