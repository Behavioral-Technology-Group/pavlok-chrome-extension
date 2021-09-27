import toggleTabs from './toggleTabs';

function tabsAsAccordion() {
	// Get tab Elements
	var tabs = $("tab").get();

	// Apply classes for it
	for (var t = 0; t < tabs.length; t++) {
		var curTab = tabs[t];
		var header = $(curTab).children()[0];
		var tabBody = $(curTab).children()[1];

		$(curTab).attr('id', ('tabs-' + t));
		$(header).addClass("pv-tab-header");
		$(tabBody).addClass("pv-tab-body");
	}

	toggleTabs();

	$('#tabs-0 > .pv-tab-body')
		.toggle('blind', {}, 250)
		.addClass('pv-active-tab-body');
}

export default tabsAsAccordion;