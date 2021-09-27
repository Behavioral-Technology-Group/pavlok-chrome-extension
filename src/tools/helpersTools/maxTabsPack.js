import msgBackground from '../helpersTools/msgBackground';
import countTabs from '../helpersTools/countTabs';
import setVal from '../helpersTools/setVal';
import confirmUpdate from '../helpersTools/confirmUpdate';
import msgInterfaces from '../helpersTools/msgInterfaces';
import UpdateTabCount from '../helpersTools/UpdateTabCount';

var maxTabsPack = {

	create: function (page, value) {
		let config = {
			old: $("#maxTabsSelect"),
			menu: $("<select>", { id: "maxTabsSelect", class: "pavSetting" }),
			storaged: parseInt(value),
			rangeValue: null,
			range: ["no",
				1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
				11, 12, 13, 14, 15,
				20, 25, 30, 35, 40, 45, 50
			],
		}

		//take value from storage if there isn't in params
		if (!value || isNaN(config.storaged)) {
			value = 8;
		}

		//set the options value list
		config.range.forEach(
			(element) => setOptionsValues(element, config.storaged, config.menu)
		);

		//replace the list on DOM
		$(config.old).replaceWith(config.menu);

		//call for the listeners over the options element
		maxTabsPack.frontListener(page);
	},

	set: function (value) {
		setVal({ dom: "#maxTabsSelect", value });
	},

	frontListener: function (page) {
		//set a onChange listener to #maxTabsSelect
		maxTabsOnChangeListener();

		chrome.runtime.onMessage.addListener(
			function (request, sender, sendResponse) {
				let r = request;

				if (r.target == page && r.action == "update Max Tabs") {
					var curV = $("#maxTabsSelect").val();
					var recV = r.value.toString();
					countTabs(lsGet("tabCountAll"), UpdateTabCount);

					if (curV != recV) {
						maxTabsPack.set(r.value);
						confirmUpdate(true);
					}
				}
			}
		);
	},

	backListener: function (r) {
		if (r.action == "update Max Tabs") {
			lsSet("maxTabs", r.maxTabs);
			var msg = {
				action: "update Max Tabs",
				dom: "#maxTabsSelect",
				value: r.maxTabs
			}
			msgInterfaces(msg);
		}
	}
}

export default maxTabsPack;

// --------------------------------------------------------

function setOptionsValues(value, storaged, target) {
	let item;
	if (value == parseInt(storaged)) {
		item = $("<option>", { text: value, value: value, selected: true });
	} else {
		item = $("<option>", { text: value, value: value });
	}
	$(target).append(item);
}

function maxTabsOnChangeListener() {
	$("#maxTabsSelect").change(function () {
		var maxTabs = $(this).val();
		msgBackground({
			change: "settings",
			action: "update Max Tabs",
			maxTabs: maxTabs
		});
	});
}