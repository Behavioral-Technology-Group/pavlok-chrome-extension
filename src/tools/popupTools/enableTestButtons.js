import stimuli from '../helpersTools/stimuli';

function enableTestButtons() {
	$("#beepTest").click(function () {
		stimuli("beep", defInt, defAT, "You'll get a Beep and a notification on your phone", "false");
	});
	$("#vibrateTest").click(function () {
		stimuli("vibration", defInt, defAT, "You'll get a Vibration and a notification on your phone", "false");
	});
	$("#zapTest").click(function () {
		stimuli("shock", defInt, defAT, "You'll get a Zap and a notification on your phone", "false");
	});

	$("#testPairing").click(function () {
		stimuli("vibration", defInt, defAT, "Your pairing works", "false");
	});
}

export default enableTestButtons;