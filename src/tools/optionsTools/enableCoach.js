import React from 'react';

import msgBackground from '../helpersTools/msgBackground';

const enableCoach = () => {
	chrome.runtime.sendMessage(
		// Warns background about new page being loaded
		{
			target: "background",
			action: "coachChange",
			change: "sync"
		},

		function (response) {
			if (response) {
				log(response);
				$("#coachPower").prop("checked", (response.status || false));
			}
		}
	);

	$("#coachPower").change(function () {
		var status = $(this).prop("checked");
		msgBackground({
			action: "coachChange",
			change: "status",
			status: status
		});
	});
}

export default enableCoach;