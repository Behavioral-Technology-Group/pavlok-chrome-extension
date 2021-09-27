import stimuli from '../helpersTools/stimuli';
import oauth from '../helpersTools/oauth';
import signOut from '../helpersTools/signOut';
import rescueTimeOAuth from '../helpersTools/rescueTimeOAuth';

const enableButtons = () => {

	$("#testPairingX").click(function () {
		stimuli("vibration", 230, defAT, "Incoming Vibration. You should receive a notification on your phone, followed by a vibration");
	});

	$("#testBeepInt").click(function () {
		stimuli("beep", defInt, defAT, "Incoming Beep. You should receive a notification on your phone, followed by a beep");
	});

	$("#testZapInt").click(function () {
		stimuli("shock", defInt, defAT, "Incoming Zap. You should receive a notification on your phone, followed by a zap");
	});

	$("#testVibrationInt").click(function () {
		stimuli("vibration", defInt, defAT, "Incoming Vibration. You should receive a notification on your phone, followed by a vibration");
	});

	$("#signIn").click(function () {
		oauth();
	});

	$("#signOut").click(function () {
		signOut();
	});

	$("#rescueTimeOAuth").click(function () {
		rescueTimeOAuth();
	});
}

export default enableButtons;