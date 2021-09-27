import toggleAutoZapperConf from './toggleAutoZapperConf';
import stimuli from '../helpersTools/stimuli';
import lsSet from '../helpersTools/lsSet';
import lsGet from '../helpersTools/lsGet';

function activateAutoZapperUI(isActive) {
	toggleAutoZapperConf(isActive ? "train" : "configure");
}
function startAutoZapper() {
	//take and fetch values from widget
	var widgetValues = fetchAutoZapperWidgetValues();

	//hold raw values on localStorage
	persistTrainingConfigs({
		trainingSessionZI: widgetValues.zapInt,
		trainingSessionZF: widgetValues.zapFreq,
		trainingSessionZD: widgetValues.zapDur,
	});

	// Update interface changing css className list of dom components
	activateAutoZapperUI(true);

	lsSet("trainingSession", createTrainingSession(
		lsGet("trainingSessionZI"),
		lsGet("trainingSessionZF"),
		defAT
	));

	// Start Count Down Timer
	startCountDown(parseInt(lsGet("trainingSessionZD")));
}
function stopAutoZapper() {
	clearInterval(parseInt(lsGet("trainingSession")));

	persistTrainingConfigs({
		trainingSession: "false",
		trainingSessionZI: "",
		trainingSessionZD: "",
		trainingSessionZF: "",
	});

	activateAutoZapperUI(false);
}

function configureSpinner(domId, props, initialValue) {
	var element = $(domId).spinner(props);
	element.val(initialValue);
	return element;
}

function persistTrainingConfigs(configs) {
	Object.keys(configs).forEach((key) => {
		lsSet(key, configs[key]);
	});
}

function fetchAutoZapperWidgetValues() {
	return {
		zapInt: percentToRaw(parseInt($("#autoZapperIntensity").val()), "zap"),
		zapFreq: parseInt($("#autoZapperFrequency").val()) * 1000,
		zapDur: parseInt($("#autoZapperDuration").val()) * 60 * 1000,
	};
}

function fetchAutoZapperWidgetRawValues() {
	return {
		zapInt: $("#autoZapperIntensity").val(),
		zapFreq: $("#autoZapperFrequency").val(),
		zapDur: $("#autoZapperDuration").val(),
	};
}

function createTrainingSession(sessionZI, sessionZF, defAT) {
	return setInterval(function () {
		console.log("Occured at ");
		stimuli(
			"shock",
			sessionZI,
			defAT,
			"Training Session. Keep going!",
			"false"
		);
	}, parseInt(sessionZF));
}

function startCountDown(sessionZD) {
	var date = new Date(new Date().valueOf() + parseInt(sessionZD));
	$("#countDownTraining")
		.countdown(date, function (event) {
			$(this).html(event.strftime("%M:%S"));
		})
		.on("finish.countdown", function (event) {
			// // // $.prompt("Session Finished! Congratulations!");
			stopAutoZapper();
		});
}

function enableAutoZapper() {
	startCountDown(0);

	configureSpinner(
		"#autoZapperIntensity",
		{
			min: 10,
			max: 100,
			page: 10,
			step: 10,
			change: confirmUpdate,
		},
		60
	);

	configureSpinner(
		"#autoZapperDuration",
		{
			min: 1,
			max: 60,
			page: 1,
			step: 1,
			change: confirmUpdate,
		},
		5
	);

	configureSpinner(
		"#autoZapperFrequency",
		{
			min: 2,
			max: 30,
			page: 1,
			step: 1,
			change: confirmUpdate,
		},
		5
	);

	$("#autoZapperStart").click(function (event) {
		event.preventDefault();

		//take an object with raw values from widget
		const values = fetchAutoZapperWidgetRawValues();

		//mount a message with the values
		const promptMessage =
			"Starting <b>zaps on " +
			values.zapInt +
			"%</b>...<br />" +
			"for <b>" +
			values.zapDur +
			" minutes</b><br />" +
			"zapping <b>every " +
			values.zapFreq +
			" seconds</b>.";

		//config a popup (prompt) message to selection about start counting
		const promptConfigs = {
			title: "Are you Ready?",
			buttons: { "Yes, I'm Ready": true, "No, let me change this": false },
			submit: function (e, result, m, f) {
				log("result was " + result);
				if (result == true) {
					startAutoZapper();
				}
			},
		};

		//send the prompt to display on browser
		$.prompt(promptMessage, promptConfigs);
	});

	$("#autoZapperStop").click(function (event) {
		event.preventDefault();
		stopAutoZapper();

		$.prompt("Traning session canceled", "Your training session is now over");
	});
}

export default enableAutoZapper;