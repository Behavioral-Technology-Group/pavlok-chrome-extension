const toggleOverlay = (toState) => {
	var curtain = $("#bigOverlay");
	var stage = $(curtain).css('display');

	if (toState == "showOptions") {
		if (stage == "none") { return }

		$("#bigOverlay").fadeTo(300, 0, function () {
			$("#bigOverlay").hide()
		});

	}
	else if (toState == "hideOptions") {
		if ($("#bigOverlay").length == 0) {
			var overlayDiv = [
				'<div id="bigOverlay">',
				'<div id="bigOverlay" class="noDisplay">',
				'<div id="bigOverlayContents">',
				'<p>',
				'Ooops! You are not signed in!',
				'</p>',
				'<p>',
				'<a id="overlaySignIn" href="#">Click here to solve it!</a>',
				'</p>',
				'</div>',
				'</div>',
			];

			overlayDiv = overlayDiv.join(',')
			$("body").append(overlayDiv);
		}

		var stage = $(curtain).css('display');

		if (stage != 'none') { return }

		$("#bigOverlay").show(function () {
			$("#bigOverlay").fadeTo(300, 0.8);
		});

	}
}

export default toggleOverlay;