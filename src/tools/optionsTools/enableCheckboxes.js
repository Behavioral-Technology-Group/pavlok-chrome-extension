import lsSet from '../helpersTools/lsSet';
import countTabs from '../helpersTools/countTabs';
import UpdateTabCount from '../helpersTools/UpdateTabCount';

export function sundayActive() {
	lsSet('sundayActive', $("#sundayActive").prop("checked"));
}

export function mondayActive() {
	lsSet('mondayActive', $("#mondayActive").prop("checked"));
}

export function tuesdayActive() {
	lsSet('tuesdayActive', $("#tuesdayActive").prop("checked"));
}

export function wednesdayActive() {
	lsSet('wednesdayActive', $("#wednesdayActive").prop("checked"));
}

export function thursdayActive() {
	lsSet('thursdayActive', $("#thursdayActive").prop("checked"));
}

export function fridayActive() {
	lsSet('fridayActive', $("#fridayActive").prop("checked"));
}

export function saturdayActive() {
	lsSet('saturdayActive', $("#saturdayActive").prop("checked"));
}

function enableCheckboxes() {
	// Active days
	$(".activeDay").change(function () {
		countTabs(lsGet("tabCountAll"), UpdateTabCount);
	});
}

export default enableCheckboxes;