// Notifications before stimuli
export function notifyZapOnChange() {
    lsSet("notifyZap", $("#notifyZap").prop("checked"));
}

export function notifyBeepOnChange() {
    lsSet("notifyBeep", $("#notifyBeep").prop("checked"));
}

export function notifyVibrationOnChange() {
    lsSet("notifyVibration", $("#notifyVibration").prop("checked"));
}