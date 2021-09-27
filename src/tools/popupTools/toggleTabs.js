function activateTab(tab) {
	var header = tab.children[0];
	var body = tab.children[1];

	tab.classList.add('pv-active-tab');
	header.classList.add('pv-active-tab-header');
	body.classList.add('pv-active-tab-body');
}

function deactivateTab(tab) {
	var header = tab.children[0];
	var body = tab.children[1];

	tab.classList.remove('pv-active-tab');
	header.classList.remove('pv-active-tab-header');
	body.classList.remove('pv-active-tab-body');
}

function toggleTabs() {
	$(" #actionSection ").on('click', '.pv-tab-header', function () {
		var clickedTab = this.parentElement;
		var clickedTodo = clickedTab.dataset.name === "todo-tab";

		// If clicked on active tab, inactivate it and close all tabs, except for todo
		if (clickedTab.classList.contains("pv-active-tab")) { deactivateTab(clickedTab); }
		else {
			// Remove active class from all tabs
			var tabs = $("tab").get();
			for (var t = 0; t < tabs.length; t++) {
				var tab = tabs[t];
				var isTodo = tab.dataset.name === "todo-tab";
				if (!isTodo) { deactivateTab(tab); }
			}

			// Add active class to clicked tab
			activateTab(clickedTab);
		}

		// Run blind effect on clicked tab body
		$('.pv-tab-body:not(.pv-active-tab-body)').hide(250);
		if (clickedTodo) {
			$('.pv-active-tab-body').toggle('blind', {}, 250);
		} else {
			$('.pv-active-tab-body:not(.sticky)').toggle('blind', {}, 250);
		}
	});
}

export default toggleTabs;