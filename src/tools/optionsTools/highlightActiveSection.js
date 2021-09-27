const highlightActiveSection = (curPos, fixedHeaderSize) => {
	var tops = [
		document.querySelector("#blackListContainerDiv").offsetTop,
		document.querySelector("#tabNumbersContainerDiv").offsetTop,
		document.querySelector("#stimuliContainerDiv").offsetTop,
		document.querySelector("#toDoContainerDiv").offsetTop,
		document.querySelector("#appIntegrationsContainerDiv").offsetTop,
		document.querySelector("#advancedOptionsContainerDiv").offsetTop
	];

	var sections = [
		"blackList",
		"tabNumbers",
		"stimuli",
		"toDo",
		"appIntegrations",
		"advancedOptions",
	]
	var visiblePos = curPos + fixedHeaderSize;

	var difs = [];
	// Checks which one have already been passed by
	for (let n = 0; n < tops.length; n++) {
		difs.push(tops[n] - visiblePos);
	}

	var passed = _.countBy(difs, function (num) {
		return num <= 0 ? 'reached' : 'ahead';
	});

	if (passed.ahead == sections.length) { passed.reached = 1; }

	var active = passed.reached - 1;
	$("#indexDiv").children().removeClass("activeSection");
	$($("#indexDiv").children()[active]).addClass("activeSection");
}

export default highlightActiveSection;