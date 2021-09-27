import lsGet from './lsGet';
import msgBackground from '../helpersTools/msgBackground';
import log from './log';
import toBoolean from './toBoolean';

var blackListTable = {
	create: function (list, target) {
		var base = target;
		target = "#" + target;

		var table = $(target + " > table");

		var hour;
		var day;
		var row;
		var newSiteRow;
		var titlesRow;
		var limitRow;

		var s;
		var site;
		var sites = Object.keys(list);

		var global = lsGet("blackGlobal", "parse") || false;
		var globalHourly = (global.status === "hourly");

		var limit;
		var type;
		var dailyOpt;
		var hourlyOpt;

		// Empty table structure
		var tableCode =
			$("<table>", { id: base + "Table" })
				.append($("<thead>"))
				.append($("<tbody>"))
				.append($("<tfoot>"));

		if (table.length === 0) {
			$(target).append(tableCode);
		}
		else {
			$(table).replaceWith(tableCode);
		}

		newSiteRow = $("<tr>", { class: "newBLTR" })
			.append($("<td>")
				.append($("<input>", { type: "text", id: "siteName", class: "siteAddress", placeholder: "Add site... ie: facebook.com" }))
			)
			.append($("<td>", { class: "limitTime" })
				.append($("<input>", { type: "text", id: "limit" + "new", class: "limitTime", placeholder: "ie: 5" }))
			)
			.append($("<td>", { class: "limitType" })
				.append($("<select>", { id: "scope" + "new", class: "limitType" })
					.append($("<option>", { value: "daily", text: "daily" }))
					.append($("<option>", { value: "hourly", text: "hourly" }))
				)
			)
			.append($("<td>", { class: "hoverOnly" })
				.append($("<input>", { type: "button", id: "addNewBL", class: "addNewBLButton", value: "+" }))
			);

		titlesRow = $("<tr>", { class: "" })
			.append($("<th>", { text: "Site", class: "siteAddress" }))
			.append($("<th>", { text: "Minutes", class: "limitMinutes" }))
			.append($("<th>", { text: "Frequency", class: "limitType" }))
			.append($("<th>", { text: "" }));

		limitRow = $("<tr>", { class: "totalLimitTR" })
			.append($("<td>", { class: "inLiner" })
				.append($("<input>", { type: "checkbox", id: "totalLimit", checked: global.status }))
				.append($("<span>", { text: "Total Limit", id: "totalLimitSpan" }))
			)
			.append($("<td>", { class: "limitTime" })
				.append($("<input>", { type: "text", id: "limit" + "global", class: "limitTime", placeholder: "ie: 5", value: global.limit }))
			)
			.append($("<td>", { class: "limitType" })
				.append($("<select>", { id: "scope" + "global", class: "limitType" })
					.append($("<option>", { value: "daily", text: "daily" }))
					.append($("<option>", { value: "hourly", text: "hourly" }))
				)
			)
			.append($("<td>", { class: "hoverOnly" }));



		$(target + " > table > thead").append(titlesRow);
		$(target + " > table > thead").append(newSiteRow);

		$(target + " > table > tfoot").append(limitRow);
		// Filling rows
		for (let s = 0; s < sites.length; s++) {
			site = sites[s];
			limit = list[site].limit;
			type = list[site].type;

			if (type == "daily") {
				dailyOpt = $("<option>", { value: "daily", text: "daily", selected: true });
				hourlyOpt = $("<option>", { value: "hourly", text: "hourly" });
			}
			else {
				dailyOpt = $("<option>", { value: "daily", text: "daily" });
				hourlyOpt = $("<option>", { value: "hourly", text: "hourly", selected: true });
			}
			row = $("<tr>", { class: "blackListRow" })
				.append($("<td>")
					.append($("<input>", { type: "text", id: "address" + site, class: "siteAddress", value: site }))
				)
				.append($("<td>", { class: "limitTime" })
					.append($("<input>", { type: "text", id: "limit" + site, class: "limitTime", value: limit }))
				)
				.append($("<td>", { class: "limitType" })
					.append($("<select>", { id: "scope" + site, class: "limitType" })
						.append(dailyOpt)
						.append(hourlyOpt)
					)
				)
				.append($("<td>", { class: "hoverOnly buttonHolder" })
					.append($("<input>", { type: "button", id: "delete" + site, class: "deleteRowButton", value: "x" }))
				);
			$(target + " > table > tbody").append(row);
		}

		blackListTable.listenClicks();
		$("#scopeglobal").val(global.type);
	},

	listenClicks: function () {

		$('#blackList input').on('keydown', function (e) {
			// Create and Edit Black List items
			if (e.which == 13) {
				console.warn("foi?");
				console.trace();
				e.preventDefault();
				var msg = blackListTable.getRowInfo(this);

				log(msg);
				msgBackground(msg);
			}
		});

		$('#blackList select').on('change', function (e) {
			// Change evaluation between hourly and daily
			e.preventDefault();
			var msg = blackListTable.getRowInfo(this);

			log(msg);
			msgBackground(msg);
		});

		$('#blackList input:checkbox').on('change', function (e) {
			// Change the global status
			var msg = blackListTable.getRowInfo(this);

			log(msg);
			msgBackground(msg);
			status = $(this).prop("checked");
			status = toBoolean(status);
			blackListTable.toggle(status);


		});

		$("#blackList .deleteRowButton").on("click", function () {
			var name = $(this)
				.attr("id")
				.replace("delete", "");

			let msg = {
				action: "blackList",
				do: "delete",
				name: name,
				list: "black"
			};

			msgBackground(msg);
		});
	},

	toggle: function (globalBL) {

		globalBL = globalBL === "true";

		// All the regular inputs go one way
		$(".limitTime").prop("disabled", globalBL);
		$(".limitType").prop("disabled", globalBL);

		// Total time goes the other way
		$("#limitglobal").prop("disabled", !globalBL);
		$("#scopeglobal").prop("disabled", !globalBL);

	},

	getRowInfo: function (focused) {
		var action = "new"; // What we want to happen
		var oldName; 		// 
		var status;			//
		var msg;			//

		var row = $(focused).closest("tr");
		var rowType;

		var limit = parseInt($(focused).closest("tr").find("input.limitTime").val()) || 0;
		var type = $(focused).closest("tr").find("select.limitType").val() || "daily";
		var name;

		if ($(row).hasClass("totalLimitTR")) { rowType = "global"; }
		else if ($(row).hasClass("blackListRow")) { rowType = "old Site"; }
		else if ($(row).hasClass("newBLTR")) { rowType = "new Site"; }

		if (rowType == "old Site" || rowType == "new Site") {
			name = $(focused).closest("tr").find("input.siteAddress").val();

			// Validation
			if (name.length === 0) { return; }

			if (rowType == "old Site") {
				action = "edit";
				oldName = $(focused).closest("tr").find("input.siteAddress").prop('id');
				oldName = oldName.replace("address", "");
			}
			else { action = "new"; }

			msg = {
				name: name,
				limit: limit,
				type: type,
				do: action,
				action: 'blackList',
				list: "black"
			};

			if (action == "edit") { msg["oldName"] = oldName; }
		}
		else if (rowType == "global") {
			status = $("#totalLimit").prop("checked");
			status = toBoolean(status);

			msg = {
				list: "global",
				limit: limit,
				type: type,
				status: status,
				action: "blackList"
			}
		}

		return msg;
	}
}

export default blackListTable;