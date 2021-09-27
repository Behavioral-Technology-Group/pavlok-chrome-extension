import confirmUpdate from '../helpersTools/confirmUpdate';
import lsGet from '../helpersTools/lsGet';
import lsSet from '../helpersTools/lsSet';
import log from '../helpersTools/log';
import percentToRaw from '../helpersTools/percentToRaw';
import msgInterfaces from '../helpersTools/msgInterfaces';


function enableStimuliControls() {
	$(function () {
		let defZap = parseInt(lsGet('zapPosition'));
		let defVib = parseInt(lsGet('vibrationPosition'));
		let defBeep = parseInt(lsGet('beepPosition'));

		log(localStorage);

		$("#sliderBeep").slider({
			value: defBeep,
			min: 10,
			max: 100,
			step: 10,
			slide: function (event, ui) {
				var beepPos = ui.value;
				log(beepPos);
				lsSet('beepPosition', beepPos);
				lsSet('beepIntensity', percentToRaw(beepPos, 'beep'));
				$("#beepIntensity").html(beepPos + "%");
				confirmUpdate(notifyUpdate);
				msgInterfaces({ action: "updateStimuli" });
			}
		});
		$("#beepIntensity").html(defBeep + "%");

		$("#sliderZap").slider({
			value: defZap,
			min: 10,
			max: 100,
			step: 10,
			slide: function (event, ui) {
				var zapPos = ui.value;
				lsSet('zapPosition', zapPos);
				lsSet('zapIntensity', percentToRaw(zapPos, 'zap'));
				$("#zapIntensity").html(zapPos + "%");
				confirmUpdate(notifyUpdate);
				msgInterfaces({ action: "updateStimuli" });
			}
		});
		$("#zapIntensity").html(defZap + "%");

		$("#sliderVibration").slider({
			value: defVib,
			min: 10,
			max: 100,
			step: 10,
			slide: function (event, ui) {
				var vibPos = ui.value;
				lsSet('vibrationPosition', vibPos);
				lsSet('vibrationIntensity', percentToRaw(vibPos, 'vibrate'));
				$("#vibrationIntensity").html(vibPos + "%");
				confirmUpdate(notifyUpdate);
				msgInterfaces({ action: "updateStimuli" });
			}
		});
		$("#vibrationIntensity").html(defVib + "%");
	});

	$("#resetIntensity").click(function () {
		var defVib = 60;
		var defZap = 60;
		var defBeep = 100;

		lsSet('vibrationPosition', defVib);
		lsSet('vibrationIntensity', percentToRaw(defVib, 'vibrate'));
		$("#vibrationIntensity").html(defVib + "%");
		$("#sliderVibration").slider({ value: defVib });

		lsSet('zapPosition', defZap);
		lsSet('zapIntensity', percentToRaw(defZap, 'zap'));
		$("#zapIntensity").html(defZap + "%");
		$("#sliderZap").slider({ value: defZap });

		lsSet('beepPosition', defBeep);
		lsSet('beepIntensity', percentToRaw(defBeep, 'beep'));
		$("#beepIntensity").html(defBeep + "%");
		$("#sliderBeep").slider({ value: defBeep });
	});
}

export default enableStimuliControls;