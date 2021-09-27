import lsGet from './lsGet';

function notifyUser(title, message, notID, persist) {
	if (typeof (title) == "object") {
		var NotList = lsGet('notifications', 'parse');
		var Not = _.where(NotList, { usage: title });

		var opt = {
			type: "basic",
			title: Not.title,
			message: Not.message,
			iconUrl: "icon.png"

		};

		var notID = Not.id;
	}
	else {
		var opt = {
			type: "basic",
			title: title,
			message: message,
			iconUrl: "icon.png"

		};
	}

	chrome.notifications.create(notID, opt, function (notID) {
		if (chrome.runtime.lastError) {
			console.error(chrome.runtime.lastError);
		}
	});
}

export default notifyUser;