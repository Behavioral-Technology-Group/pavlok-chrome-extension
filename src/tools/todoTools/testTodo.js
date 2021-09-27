import React from 'react';
import fillDailyList from '../optionsTools/fillDailyList';
import createDetailTR from '../optionsTools/createDetailTR';
import msgBackground from '../helpersTools/msgBackground';


var testTodo = {
	backend: {
		// Helpers
		newId: function () {
			var id = lsGet('lastID');
			if (id == undefined) { id = 1; }
			id = parseInt(id) + 1;
			return id
		},

		scaffold: function (task) {
			var newTask = {
				task: task.task,
				daily: task.daily || false,
				done: task.done || false,
				pomos: task.pomos || undefined,
				donePomos: task.donePomos || undefined,
				duration: task.duration || 25,
				specialList: task.specialList || false,
				blackList: task.blackList || undefined,
				whiteList: task.whiteList || undefined,
				instaZap: task.instaZap || false,
				binaural: task.binaural || false,
				today: task.today || false,
				externalId: task.externalId || undefined
			}
			return newTask
		},

		validate: function (task) {

		},

		// CRUD
		create: function (task) {
			var allTasks = lsGet('allTasks', 'parse') || [];
			var task = testTodo.backend.scaffold(task);
			task.id = testTodo.backend.newId();
			allTasks.push(task);
			lsSet('allTasks', allTasks, 'object');

			lsSet('lastID', task.id);
			log("New task added:")
			log(task)
			return task
		},

		read: function (id) {
			var allTasks = lsGet('allTasks', 'parse') || [];
			if (!id) { return allTasks }

			var task = _.where(allTasks, { id: id });
			if (task.length == 0) { return undefined }
			return task[0];
		},

		update: function (taskId, updates) {
			var allTasks = lsGet('allTasks', 'parse');
			var task = testTodo.backend.read(taskId);

			if (!task) {
				log("Couldn't find task of ID " + taskId);
				return false;
			}

			var fieldChanges = Object.getOwnPropertyNames(updates);
			for (let f = 0; f < fieldChanges.length; f++) {
				let update = fieldChanges[f];
				task[update] = updates[update];
			}

			var index = arrayObjectIndexOf(allTasks, task.id, 'id');
			allTasks[index] = task;

			lsSet('allTasks', allTasks, 'object');

			return task

		},

		delete: function (id) {
			id = parseInt(id);
			var allTasks = lsGet('allTasks', 'parse');
			var index = arrayObjectIndexOf(allTasks, id, 'id');

			if (index == -1) {
				log("Task ID " + id + " not found");
				return false;
			}

			allTasks.splice(index, 1);
			lsSet('allTasks', allTasks, 'object');
			return true
		},
	},

	frontend: {
		addTaskListener: function () {
			$("#toDoAdd").keydown(function (e) {
				if (e.keyCode == 13) {
					var text = $(this).val();
					if (text.length > 0) {
						// Create a task on the database
						var newTask = { task: text };
						msgBackground({
							action: "task change",
							detail: "new",
							task: newTask
						});
						$(this).val('');
					}
				}
			});

			$("#newDailyTaskInput").keydown(function (e) {
				if (e.keyCode == 13) {
					var newTaskName = $("#newDailyTaskInput").val()
					if (newTaskName.length > 0 && newTaskName != " ") {
						// Clears the line
						$('#newDailyTaskInput').val('');

						// Creates a new task
						var newDaily = {
							task: newTaskName,
							daily: true,
							pomos: 1,
						};
						newDaily = testTodo.backend.create(newDaily);

						testTodo.frontend.restoreTasks("options");

						fillDailyList();
						createDetailTR($("#" + newDaily.id));
						msgInterfaces({ action: "updateDaily" });

						msgBackground({
							action: "task change",
							detail: "new",
							taskId: newDaily.id
						});

					} else {
						return
					}
				}
			});
		},

		removeTaskListener: function () {
			$("#toDoTable tbody ").on('click', '.removeToDoItem', function () {
				var taskId = $(this).attr('id');
				taskId = taskId.split('Remove')[0];

				msgBackground({
					action: "task change",
					detail: "delete",
					taskId: taskId,
				});
			});
		},

		tagTodayListener: function () {
			$("#toDoTable tbody ").on('click', '.todayToDoItem', function () {
				var img = $(this);
				var isToday;

				var taskId = img.attr('id');
				taskId = parseInt(taskId.split('today')[0]);

				if ($(img).hasClass("grayscale")) { isToday = true; }
				else { isToday = false }

				testTodo.backend.update(taskId, { today: isToday });
				testTodo.frontend.restoreTasks();
				// todo.editLine(task);
			});
		},

		clearCompletedListener: function () {
			$("#toDoTable tfoot ").on('click', '#clearToDoLink', function () {
				var allTasks = lsGet('allTasks', 'parse') || [];
				allTasks.forEach((task) => {
					if (task.done) {
						msgBackground({
							action: "task change",
							detail: "delete",
							taskId: task.id,
						});
					}
				})

			});
		},

		editDailyListener: function () { },

		doneCheckListener: function () {
			$("#toDoTable").on('click', '.doneCheckbox', function () {
				var box = $(this)
				var taskId = box.attr('id');
				taskId = parseInt(taskId.split('Done')[0]);

				var check = box.prop('checked');
				if (check == true) {
					stimuli("vibration", defInt, defAT, "You rock! Let Pavlok massage your wrist a bit!");
					notifyUser("Yeah! One down!", "You rock! Let Pavlok massage your wrist a bit!", "doneTask");
				}

				msgBackground({
					action: "task change",
					detail: "complete",
					taskId: taskId,
					check: check
				});

				testTodo.frontend.restoreTasks();

			});
		},

		createNewLine: function (task, target) {
			if (task.daily == false) {
				{
					var tr = document.createElement("tr");
					tr.className = "toDoItemTR";
					if (task.done) { tr.className = tr.className + " doneTaskRow" }
					tr.id = task.id;
				}

				{
					var td = document.createElement("td");
					tr.appendChild(td);
					td.colSpan = 5;
				}

				{
					var containerDiv = document.createElement("div");
					td.appendChild(containerDiv);
				}

				{
					var doneDiv = document.createElement("div");
					containerDiv.appendChild(doneDiv);
					doneDiv.className = "toDoOKerDIV";
				}

				{
					var doneCheckbox = document.createElement("input");
					doneDiv.appendChild(doneCheckbox);
					doneCheckbox.className = "doneCheckbox"
					doneCheckbox.type = "checkbox";
					doneCheckbox.checked = task.done;
					doneCheckbox.title = "Done?"
					doneCheckbox.id = task.id + "Done"
				}

				{
					var taskDiv = document.createElement("div");
					containerDiv.appendChild(taskDiv);
					taskDiv.className = "toDoTaskDIV";
					taskDiv.innerHTML = task.task;
				}

				{
					var buttonsDiv = document.createElement("div");
					containerDiv.appendChild(buttonsDiv);
					buttonsDiv.className = "toDoRemoverDIV";
				}

				{
					var pomoButton = document.createElement("input");
					buttonsDiv.appendChild(pomoButton);
					pomoButton.type = "image";
					pomoButton.src = "images/pomodoro(todo)_(Custom).png";
					pomoButton.alt = "Now";
					pomoButton.id = task.id + "Pomo";
					pomoButton.className = "nowToDoItem imgIcon";
					pomoButton.title = "<p>Enter <b>Pomodoro</b> mode</p>";
				}

				{
					var todayButton = document.createElement("input");
					buttonsDiv.appendChild(todayButton);
					todayButton.type = "image";
					todayButton.src = "images/todayIcon.png";
					todayButton.alt = "Today";
					todayButton.id = task.id + "today"
					todayButton.className = "todayToDoItem imgIcon";
					if (task.today == false) {
						todayButton.className = todayButton.className + " grayscale";
					}
					todayButton.title = "<p>You will do it <b>today</b></p>";
				}

				{
					var removeButton = document.createElement("input");
					buttonsDiv.appendChild(removeButton);
					removeButton.type = "image";
					removeButton.src = "images/redXIcon.png";
					removeButton.alt = "Today";
					removeButton.id = task.id + "Remove";
					removeButton.className = "removeToDoItem imgIcon";
					removeButton.title = "<p>I will not do it anymore. <b>Remove it</b></p>";
				}

				// $('#toDoTable > tbody').append(tr);
			}
			else if (task.daily == true && target == "popup") {
				{
					var tr = document.createElement("tr");
					tr.id = task.id;
					tr.className = "dailyItemTR";
				}

				{
					var td = document.createElement("td");
					tr.appendChild(td);
				}

				{
					var taskDiv = document.createElement("div");
					td.appendChild(taskDiv);
					taskDiv.className = "dailyTaskName";
				}

				{
					var taskSpan = document.createElement("span");
					taskDiv.appendChild(taskSpan);
					taskSpan.innerHTML = task.task;
				}

				{
					var pomoHoldersDiv = document.createElement("div");
					td.appendChild(pomoHoldersDiv);
					pomoHoldersDiv.className = "pomoFocusHolders";
				}

				{
					var pomoHolderSpan = document.createElement("span");
					pomoHoldersDiv.appendChild(pomoHolderSpan);

					// Create the number of green and red apples according to the number of done and remaining pomos
					var pomoFocuses = '';
					var maxPomos = parseInt(task.pomos);
					var donePomos = parseInt(task.donePomos) || 0;
					var remainingPomos = maxPomos - donePomos;

					for (p = 0; p < donePomos; p++) {
						pomoFocuses = pomoFocuses + '<input disabled type="image" src="images/pomodoro(completed).png" alt="Done!" class="doneDaily imgIcon" title="<p>Well done!</p>"/>'
					}

					for (p = 0; p < remainingPomos; p++) {
						pomoFocuses = pomoFocuses + '<input type="image" src="images/pomodoro(todo)_(Custom).png" alt="Now" id="' + task.id + 'Pomo" class="dailyPomoNow imgIcon" title="<p>Enter <b>Pomodoro</b> mode</p>"/>';
					}

					pomoHolderSpan.innerHTML = pomoFocuses;
				}
			}

			return tr;
		},

		findLineById: function (id) {
			var line = $("#" + id);
			if (line.length == 0) { return undefined }
			return line[0];
		},

		restoreTasks: function (target) {
			if (!target) { target = "popup"; }

			var allTasks = lsGet('allTasks', 'parse');
			var regularTasks = _.where(allTasks, { daily: false });
			var dailyTasks = _.where(allTasks, { daily: true });

			var task;
			var line;

			// Clearing regular tasks
			$(".toDoItemTR").remove();

			// Recreating regular tasks
			for (let r = 0; r < regularTasks.length; r++) {
				task = regularTasks[r];
				line = testTodo.frontend.createNewLine(task);
				$('#toDoTable > tbody').append(line);
			}

			// Clearing daily tasks
			$('.dailyItemTR').remove();

			// Recreating daily tasks
			for (let d = 0; d < dailyTasks.length; d++) {
				task = dailyTasks[d];
				line = testTodo.frontend.createNewLine(task, target);
				$('.dailyContainer tbody').append(line);
			}
		},

		updateLine: function () { },

		dailyDetail(id) {
			var task = testTodo.backend.read(id);

			if (task.length == 0) {
				log("Task of id " + id + " not found or not daily");
				return false
			}

			var detailTable = document.createElement("table");
			detailTable.id = "dailyListDetails";

			var tbody = document.createElement("tbody");
			detailTable.appendChild(tbody);

			{
				var idRow = document.createElement("tr");
				idRow.className = "noDisplay";
				tbody.appendChild(idRow);

				var idRowCategory = document.createElement("td"); {
					idRowCategory.className = "categoryName";
					idRowCategory.innerHTML = "Daily ID"
					idRow.appendChild(idRowCategory);
				}

				var idRowValue = document.createElement("td"); {
					idRowValue.id = "dailyTaskIdTD";
					idRow.appendChild(idRowValue);
				}

				var idRowInput = document.createElement("input"); {
					idRowInput.type = "text";
					idRowInput.id = "dailyTaskIdInput"
					idRowInput.disabled = true;
					idRowInput.value = task.id;
					idRowValue.appendChild(idRowInput);
				}
			}

			{
				var pomosRow = document.createElement("tr");
				tbody.appendChild(pomosRow);

				var pomosCat = document.createElement("td"); {
					pomosRow.appendChild(pomosCat);
					pomosCat.className = "categoryName";
					pomosCat.innerHTML = "Pomodoros per day ";
				}

				var pomosNumber = document.createElement("td"); {
					pomosRow.appendChild(pomosNumber);
					pomosNumber.id = "pomodorosPerDayTD";
				}

				var pomoPerDaySelect = document.createElement("select"); {
					pomosNumber.appendChild(pomoPerDaySelect);
					pomoPerDaySelect.id = "pomoPerDaySelect";
				}

				{
					var pomoN1 = document.createElement("option");
					pomoPerDaySelect.appendChild(pomoN1);
					pomoN1.value = "1";
					pomoN1.innerHTML = "1"

					var pomoN2 = document.createElement("option");
					pomoPerDaySelect.appendChild(pomoN2);
					pomoN2.value = "2";
					pomoN2.innerHTML = "2"

					var pomoN3 = document.createElement("option");
					pomoPerDaySelect.appendChild(pomoN3);
					pomoN3.value = "3";
					pomoN3.innerHTML = "3"

					var pomoN4 = document.createElement("option");
					pomoPerDaySelect.appendChild(pomoN4);
					pomoN4.value = "4";
					pomoN4.innerHTML = "4"

					var pomoN5 = document.createElement("option");
					pomoPerDaySelect.appendChild(pomoN5);
					pomoN5.value = "5";
					pomoN5.innerHTML = "5"

					var pomoN6 = document.createElement("option");
					pomoPerDaySelect.appendChild(pomoN6);
					pomoN6.value = "6";
					pomoN6.innerHTML = "6"

					pomoPerDaySelect.selectedIndex = task.pomos - 1;
				}

				var lasting = document.createElement("span"); {
					pomosNumber.appendChild(lasting);
					lasting.innerHTML = " lasting for ";
				}

				var pomoDurationSelect = document.createElement("select"); {
					pomosNumber.appendChild(pomoDurationSelect);
					pomoDurationSelect.id = "dailyPomoDuration";
				}

				{
					var pomoD2 = document.createElement("option");
					pomoDurationSelect.appendChild(pomoD2);
					pomoD2.value = "2";
					pomoD2.innerHTML = "2";

					var pomoD5 = document.createElement("option");
					pomoDurationSelect.appendChild(pomoD5);
					pomoD5.value = "5";
					pomoD5.innerHTML = "5";

					var pomoD10 = document.createElement("option");
					pomoDurationSelect.appendChild(pomoD10);
					pomoD10.value = "10";
					pomoD10.innerHTML = "10";

					var pomoD15 = document.createElement("option");
					pomoDurationSelect.appendChild(pomoD15);
					pomoD15.value = "15";
					pomoD15.innerHTML = "15";

					var pomoD25 = document.createElement("option");
					pomoDurationSelect.appendChild(pomoD25);
					pomoD25.value = "25";
					pomoD25.innerHTML = "25";

					var pomoD35 = document.createElement("option");
					pomoDurationSelect.appendChild(pomoD35);
					pomoD35.value = "35";
					pomoD35.innerHTML = "35";

					var durRange = [2, 5, 10, 15, 25, 35];
					var ind = durRange.indexOf(task.duration);

					pomoDurationSelect.selectedIndex = ind;
				}

				var lastingMinutes = document.createElement("span");
				pomosNumber.appendChild(lastingMinutes);
				lastingMinutes.innerHTML = " minutes";


			}

			{
				var controlsRow = document.createElement("tr");
				tbody.appendChild(controlsRow);

				var controlsCat = document.createElement("td");
				controlsRow.appendChild(controlsCat);
				controlsCat.className = "categoryName";
				controlsCat.innerHTML = "Page controls";

				var controlsInput = document.createElement("td");
				controlsRow.appendChild(controlsInput);
				controlsCat.id = "specialListsTD";

				var listsInput = document.createElement("input");
				controlsInput.appendChild(listsInput);
				listsInput.id = "specialListsInput";
				listsInput.type = "checkbox";
				listsInput.checked = task.specialList;

				var genSpan = document.createElement("span");
				controlsInput.appendChild(genSpan);
				genSpan.innerHTML = " Use special black and white lists";
			}

			{
				var blackTR = document.createElement("tr");
				tbody.appendChild(blackTR);
				blackTR.className = "specialListDisplay";
				if (task.specialList == false) { blackTR.className = "specialListDisplay noDisplay" }

				var blackCat = document.createElement("td");
				blackTR.appendChild(blackCat);
				blackCat.className = "categoryName";
				blackCat.innerHTML = "Black List";

				var blackVal = document.createElement("td");
				blackTR.appendChild(blackVal);
				blackVal.id = "blackListTD";

				var blackList = document.createElement("div");
				blackVal.appendChild(blackList);
				blackList.id = "blackListDaily";

			}

			{
				var whiteTR = document.createElement("tr");
				tbody.appendChild(whiteTR);
				whiteTR.className = "specialListDisplay";
				if (task.specialList == false) { whiteTR.className = "specialListDisplay noDisplay" }

				var whiteCat = document.createElement("td");
				whiteTR.appendChild(whiteCat);
				whiteCat.className = "categoryName";
				whiteCat.innerHTML = "White List";

				var whiteVal = document.createElement("td");
				whiteTR.appendChild(whiteVal);
				whiteVal.id = "whiteListTD";

				var whiteList = document.createElement("div");
				whiteVal.appendChild(whiteList);
				whiteList.id = "whiteListDaily";

			}
			{
				var saveOrResetTR = document.createElement("tr");
				tbody.appendChild(saveOrResetTR);

				var emptyTD = document.createElement("td");
				saveOrResetTR.appendChild(emptyTD);

				var saveContainer = document.createElement("td");
				saveOrResetTR.appendChild(saveContainer);
				saveContainer.className = "saveOrResetTD";
				saveContainer.colspan = 2;

				var saveDiv = document.createElement("div");
				saveContainer.appendChild(saveDiv);
				saveDiv.className = "saveOrResetContainer";

				var saveButton = document.createElement("a");
				saveDiv.appendChild(saveButton);
				saveButton.id = "saveDaily"
				saveButton.className = "buttonLink";
				saveButton.href = "#";
				saveButton.innerHTML = "Save";

				var delButton = document.createElement("a");
				saveDiv.appendChild(delButton);
				delButton.id = "deleteDaily"
				delButton.className = "buttonLink";
				delButton.href = "#";
				delButton.innerHTML = "Delete";
			}

			return detailTable
		},

	},

	helpers: {
		resetDailyTasks: function () {
			var allTasks = testTodo.backend.read();
			var dailies = _.where(allTasks, { daily: true });
			var update = { donePomos: 0 };

			for (let d = 0; d < dailies.length; d++) {
				daily = dailies[d];
				testTodo.backend.update(daily.id, update);
			}

			pavPomo.helpers.toInterfaces({ action: "updateActions" });
		},

		migrateFromSeparateLists: function () {
			var oldRegulars = lsGet('ToDoTasks', 'parse') || [];
			var oldDailies = lsGet('dailyList', 'parse') || [];

			var combinedTasks = [];
			var t;

			for (r = 0; r < oldRegulars.length; r++) {
				t = oldRegulars[r];
				delete t.id;

				combinedTasks.push(t);
			}

			for (let d = 0; d < oldDailies.length; d++) {
				t = oldDailies[d];
				delete t.id;
				delete t.completed;
				delete t.description;
				delete t.hyper;

				t.duration = parseInt(t.duration) || 25;
				t.pomos = parseInt(t.pomodoros) || 3;
				t.donePomos = parseInt(t.donePomos) || 0;
				t.daily = true;

				combinedTasks.push(t);
			}
			return combinedTasks;
		},

		archiveOldLists: function () {
			var relics = {};
			relics.oldDaily = lsGet('dailyList', 'parse');
			relics.oldRegulars = lsGet('ToDoTasks', 'parse');
			lsSet('relics', relics, 'object');

			lsDel('dailyList');
			lsDel('ToDoTasks');
		},

		gatherDaily() {
			var blackListDiv = $("#blackListTD").children()[0];
			var whiteListDiv = $("#whiteListTD").children()[0];

			var details = {
				id: parseInt($("#dailyTaskIdInput").val()),
				// task: 			$("#where is the name").val(),
				daily: true,
				pomos: parseInt($("#pomoPerDaySelect").val()),
				duration: parseInt($("#dailyPomoDuration").val()),
				specialList: $("#specialListsInput").prop("checked"),
				blackList: $(blackListDiv).val(),
				whiteList: $(whiteListDiv).val(),
			}
			return details
		},

		completeTask(taskId) {
			var task = testTodo.backend.read(taskId);
			if (task.daily == true) {
				task.donePomos = task.donePomos + 1;
				var update = { donePomos: task.donePomos };
			}
			else {
				update = { done: true }
			}

			testTodo.backend.update(taskId, update);
			testTodo.frontend.restoreTasks();

			pavPomo.helpers.toInterfaces({ action: "updateActions" });
		},
	}

};

export default testTodo;