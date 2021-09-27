import lsSet from "../helpersTools/lsSet";
import confirmUpdate from '../helpersTools/confirmUpdate';
import percentToRaw from '../helpersTools/percentToRaw ';

const initialConfig = {
    blackList: ['blackList', $("#blackList")[0].value],
    whiteList: ['whiteList', $("#whiteList")[0].value],
    maxTabs: ['maxTabs', $("#maxTabsSelect").val()],
    zapOnClose: ['zapOnClose', $("#zapOnClose").prop('checked')],
    beepPosition: ['beepIntensity', percentToRaw($("#sliderBeep").slider("option", "value"), 'beep')],
    zapPosition: ['zapIntensity', percentToRaw($("#sliderZap").slider("option", "value"), 'zap')],
    vibrationPosition: ['vibrationIntensity', percentToRaw($("#sliderVibration").slider("option", "value"), 'vibrate')]
}

const saveOptions = () => {
    let generalValues = Object.values(initialConfig);
    for (let i = 0; i < generalValues.length; i++) {
        lsSet("generalValues[i][0]", generalValues[i][1]);
    }

    confirmUpdate(notifyUpdate);
};

export default saveOptions;