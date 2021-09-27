import msgListeners from './msgListeners';
import pavPomo from '../todoTools/pavPomo';
import maxTabsPack from '../helpersTools/maxTabsPack';
import migrations from '../migrationsTools/migrations';
import msgBackground from '../helpersTools/msgBackground';
import lsGet from '../helpersTools/lsGet';

import enableTooltips from '../helpersTools/enableTooltips';
import presentName from './presentName';
import enableTestButtons from './enableTestButtons';
import enableToDo from '../todoTools/enableToDo';
import showOptions from '../helpersTools/showOptions';
import enter_on_sign_in from '../helpersTools/enterOnSignIn';
import tabsAsAccordion from './tabsAsAccordion';
import enableBlackList from './enableBlackList';
import enableStimuliControls from './enableStimuliControls';
import confirmUpdate from '../helpersTools/confirmUpdate';
import notifyUpdate from '../helpersTools/variables/notifyUpdate';
import validateUserInfo from '../helpersTools/validateUserInfo';


// new function created to pass to popupModel the pack of codes to start the app
const initialService = () => {
	enableTooltips();
	presentName();
	enableTestButtons();
	enableToDo();
	showOptions(lsGet("accessToken"));//trouble with isValid (no API test)
	enter_on_sign_in();

	tabsAsAccordion();
	enableBlackList();// issue here
	enableStimuliControls();

	$("#signOut").attr('title', 'Sign Out');
	$("#signOut").click(function () {
		msgBackground({ action: "signOut" });
	});

	maxTabsPack.create("popup", lsGet("maxTabs"));

	chageFocusPunisher();

	logInSubmitter();

	pavPomo.helpers.initialSync();

	migrations.frontListener();
	migrations.frontStarter();
	// migrations.convertAll(JSON.parse(lsGet("updateRequest")));

	// Message listeners
	msgListeners();

}

export default initialService;

//------------------------------------------------------------------

function chageFocusPunisher() {
	$("#instaZap").change(function () {
		updates = { instaZap: $(this).prop("checked") };

		var pomo = pavPomo.helpers.lastPomo();
		pavPomo.backend.update(pomo.id, updates);
		confirmUpdate(notifyUpdate);
	});

	$("#lockZap").change(function () {
		chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
			var active = $("#lockZap").prop("checked");
			var updates = { lockZap: active };
			if (active) {
				curPAVTab = tabs[0];
				curPAVUrl = tabs[0].url;
				curPAVDomain = new URL(curPAVUrl).hostname.replace("www.", "");

				if (curPAVDomain.length == 0) {
					log("unable to resolve domain for " + curPAVUrl);
					curPAVDomain = curPAVUrl;
				}
				updates.lockedTo = curPAVDomain;
			}
			else { updates.lockedTo = undefined; }

			var pomo = pavPomo.helpers.lastPomo();
			pavPomo.backend.update(pomo.id, updates);
			confirmUpdate(notifyUpdate);
		});
	});
}

function logInSubmitter() {
	$("#pavSubmitLogin").click(function (event) {
		event.preventDefault();

		var userInfo = {
			userName: $("#pavUserNameLogin").val(),
			password: $("#pavPasswordLogin").val(),
		};

		if (validateUserInfo(userInfo)) {
			var msg = {
				action: "oauth",
				user: userInfo
			};

			msgBackground(msg);
		}
		else {

		};
	});
}