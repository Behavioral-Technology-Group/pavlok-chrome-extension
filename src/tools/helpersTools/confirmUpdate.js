import notifyUser from './notifyUser';

const confirmUpdate = (notify) => {
	if (notify) {
		notifyUser('Settings updated', '', 'updatedSettings');
		clearTimeout(notTimeout);
		notTimeout = setTimeout(function () { chrome.notifications.clear('settingsUpdated') }, 2000);
	}
}

export default confirmUpdate;