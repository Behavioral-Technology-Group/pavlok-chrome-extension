import blackListTable from '../helpersTools/blackListTable';
import pavPomo from '../todoTools/pavPomo';
import showOptions from '../helpersTools/showOptions';
import todoist from '../todoistIntegrationsTools/todoist';
import compareSetting from './compareSetting';
import lsGet from './lsGet';
import wrong_login from './wrong_login';

const interfaceListeners = (page) => {
	chrome.extension.onMessage.addListener(
		function (request) {
			if (request.target == page) {
				switch (request.action) {
					case "updateBlackList":
						let blackListSync = compareSetting("blackList", "#blackList");
						let whiteListSync = compareSetting("whiteList", "#whiteList");
						let nBL = lsGet('blackList', 'parse');

						if (blackListSync == false || whiteListSync == false) {
							$("#blackList").importTags(lsGet('blackList'));
							$("#whiteList").importTags(lsGet('whiteList'));
						}

						blackListTable.create(nBL, 'blackList');
						break;

					case "updateStimuli":
						let beepPosSync = compareSetting("beepPosition", $("#sliderBeep").slider("value").toString(), "override");
						let zapPosSync = compareSetting("zapPosition", $("#sliderZap").slider("value").toString(), "override");
						let vibPosSync = compareSetting("vibrationPosition", $("#sliderVibration").slider("value").toString(), "override");

						if ((beepPosSync && zapPosSync && vibPosSync) == false) {
							$("#sliderBeep").slider("value", parseInt(lsGet('beepPosition')));
							$("#sliderVibration").slider("value", parseInt(lsGet('vibrationPosition')));
							$("#sliderZap").slider("value", parseInt(lsGet('zapPosition')));
						}
						break;

					case "updatePomo":
						pavPomo.frontend.updateCountdown(request.pomo);
						break;

					case "logged":
						showOptions(request.token);
						break;

					case "login failed":
						wrong_login();
						break;

					case "todoist":
						if (request.change == "unlogged") {
							todoist.frontend.toggle();
						}
						else if (request.change == "logged") {
							todoist.frontend.toggle();
						}
						break;
				}
			}
		}
	);
}

export default interfaceListeners;