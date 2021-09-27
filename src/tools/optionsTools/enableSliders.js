import React from 'react';
import lsGet from '../helpersTools/lsGet';
import lsSet from '../helpersTools/lsSet';
import confirmUpdate from '../helpersTools/confirmUpdate';
import msgInterfaces from '../helpersTools/msgInterfaces';
import percentToRaw from '../helpersTools/percentToRaw';
import log from '../helpersTools/log';

const initialConfig = {
	defVib: 60,
	defZap: 60,
	defBeep: 100,

	valZap: parseInt(lsGet('zapPosition')),
	valVib: parseInt(lsGet('vibrationPosition')),
	valBeep: parseInt(lsGet('beepPosition')),

	vibPos: 'vibrationPosition',
	vibInt: 'vibrationIntensity',
	vibType: 'vibrate',
	vibHtmlId: "#vibrationIntensity",
	vibSlider: "#sliderVibration",

	zapPos: 'zapPosition',
	zapInt: 'zapIntensity',
	zapType: 'zap',
	zapHtmlId: "#zapIntensity",
	zapSlider: "#sliderZap",

	beepPos: 'beepPosition',
	beepInt: 'beepIntensity',
	beepType: 'beep',
	beepHtmlId: "#beepIntensity",
	beepSlider: "#sliderBeep"
}

function setSlider(stimuliPos, stimuliVal, stimuliInt, stimuliType, htmlId, sliderId) {
	lsSet("stimuliPos", stimuliVal);
	lsSet("stimuliInt", percentToRaw(stimuliVal, stimuliType));
	$(htmlId).html(stimuliVal + "%");
	$(sliderId).slider({ value: stimuliVal });
}

export function resetIntensityOnClick(event) {
	event.preventDefault();

	setSlider(
		initialConfig.vibPos,
		initialConfig.defZap,
		initialConfig.zapInt,
		initialConfig.zapType,
		initialConfig.zapHtmlId,
		initialConfig.zapSlider
	);

	setSlider(
		initialConfig.zapPos,
		initialConfig.defZap,
		initialConfig.vibInt,
		initialConfig.vibType,
		initialConfig.vibHtmlId,
		initialConfig.vibSlider
	);

	setSlider(
		initialConfig.beepPos,
		initialConfig.defBeep,
		initialConfig.beepInt,
		initialConfig.beepType,
		initialConfig.beepHtmlId,
		initialConfig.beepSlider
	);
}

function setSliderConfig(elementId, value, stimuliPos, stimuliInt, stimuliType, htmlId) {
	$(elementId).slider(
		{
			value: value,
			min: 10,
			max: 100,
			step: 10,
			slide: function (event, ui) {
				var sliderPosition = ui.value;
				log(sliderPosition);
				lsSet("stimuliPos", sliderPosition);
				lsSet("stimuliInt", percentToRaw(sliderPosition, stimuliType));
				$(htmlId).html(sliderPosition + "%");
				confirmUpdate(notifyUpdate);
				msgInterfaces({ action: "updateStimuli" });
			}
		}
	);
	$(htmlId).html(value + "%");
}


const enableSliders = () => {
	$(function () {

		setSliderConfig(
			"#sliderBeep",
			initialConfig.valBeep,
			'beepPosition',
			'beepIntensity',
			'beep',
			"#beepIntensity"
		);

		setSliderConfig(
			"#sliderZap",
			initialConfig.valZap,
			'zapPosition',
			'zapIntensity',
			'zap',
			"#zapIntensity"
		);

		setSliderConfig(
			"#sliderVibration",
			initialConfig.valVib,
			'vibrationPosition',
			'vibrationIntensity',
			'vibrate',
			"#vibrationIntensity"
		);
	});
}

export default enableSliders;