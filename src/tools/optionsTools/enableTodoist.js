import React from 'react';
import todoist from '../todoistIntegrationsTools/todoist';
import msgBackground from '../helpersTools/msgBackground';
import log from '../helpersTools/log';

const enableTodoist = () => {
	$("#todoistLogin").click(function (event) {
		event.preventDefault();

		log("clicked on todoist");
		msgBackground({
			action: "todoistChange",
			change: "oauth"
		});
	});

	todoist.frontend.toggle();

	$("#importTodoist").click(function (event) {
		event.preventDefault();

		msgBackground({
			action: "todoistChange",
			change: "import"
		});
	});

	$("#signOutTodoist").click(function (event) {
		event.preventDefault();

		log("unlogging from todoist");
		msgBackground({
			action: "todoistChange",
			change: "signOut"
		});
	});
}

export default enableTodoist;