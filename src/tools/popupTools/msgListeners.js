import blackListTable from '../helpersTools/blackListTable';
import pavPomo from '../todoTools/pavPomo';
import testTodo from '../todoTools/testTodo';
import compareSetting from '../helpersTools/compareSetting';
import showOptions from '../helpersTools/showOptions';
import toggleSignInOut from '../helpersTools/toggleSignInOut';
import wrong_login from '../helpersTools/wrong_login';
import log from '../helpersTools/log';
import lsGet from '../helpersTools/lsGet';

const msgListeners = () => {
	chrome.extension.onMessage.addListener(
		function (request, sender, sendResponse) {
			if (request.target == "popup") {
				if (request.action == "updateBlackList") {
					var wl = compareSetting("whiteList", "#whiteList");

					if (wl == false) {
						$("#whiteList").importTags(lsGet('whiteList'));
					}

					var nBL = lsGet('blackList', 'parse');
					blackListTable.create(nBL, 'blackList');
				}

				else if (request.action == "updatePomo") {
					log(request);
					var pomo = request.pomo;
					if (!pomo) {
						log("No pomo");
						return
					}
					pavPomo.frontend.updateCountdown(pomo);
					log("received pomo");
					log(pomo);

				}

				else if (request.action == "updateActions") {
					var pomo = request.pomo;
					testTodo.frontend.restoreTasks();
				}

				else if (request.action == "logged") {
					var token = request.token;
					if (token.length == 64) {
						$("#pavUserNameLogin").val('');
						$("#pavPasswordLogin").val('');
					}
					showOptions(token);
					toggleSignInOut();
					$("#unloggedMessage").text("Oh, looks like you are not signed in.");
				}
				else if (request.action == "login failed") {
					wrong_login();
				}
			}
		}
	);
}

export default msgListeners;