import initialize from './initialize';
import maxTabsPack from '../helpersTools/maxTabsPack';
import lsSet from '../helpersTools/lsSet';
import lsGet from '../helpersTools/lsGet';

function initialPreEnableOp() {
	// Add listeners for Auto save when options change
	$("#zapOnClose").change(function () {
		lsSet("zapOnClose", $(this).prop("checked"));
	});

	// Notifications before stimuli
	$("#notifyZap").change(function () {
		lsSet("notifyZap", $(this).prop("checked"));
	});

	$("#notifyVibration").change(function () {
		lsSet("notifyVibration", $(this).prop("checked"));
	});

	$("#notifyBeep").change(function () {
		lsSet("notifyBeep", $(this).prop("checked"));
	});

	// Max Tabs
	maxTabsPack.create("options", lsGet("maxTabs"));
}

export default initialPreEnableOp;