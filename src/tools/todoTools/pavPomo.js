import React from 'react';
import msgBackground from '../helpersTools/msgBackground';

var pavPomo = {
	helpers: {
		prompMessage: function () {
			var msg = "" +
				"<p>Lets put some stakes on it. Tell us how long will this take and we will give you the either carrot and the stick. Your choice to do it as you planned!</p>" +
				"<p>" +
				"<select id='minutesPomodoro'>" +
				// "<option value='0.08'>5 seconds</option>" + 
				"<option value='2'>2 minutes</option>" +
				"<option value='5'>5 minutes</option>" +
				"<option value='10'>10 minutes</option>" +
				"<option value='15'>15 minutes</option>" +
				"<option value='20'>20 minutes</option>" +
				"<option selected value='25'>25 minutes</option>" +
				"<option value='30'>30 minutes</option>" +
				"<option value='45'>45 minutes</option>" +
				"<option value='60'>1 hour</option>" +
				"<option value='90'>1hour and 30 minutes</option>" +
				"<option value='120'>2 hours</option>" +
				"</select>" +
				"</p>" +
				"<div>" +
				"<p>Want to get hyper focused?</p>" +
				"<p><select id='hyperFocusSelect'>" +
				"<option id='audioTrue' value='true'>Yes, get me there!</option>" +
				"<option id='audioFalse' value='false'>No, I'm fine.</option>" +
				"</select></p>" +
				"</div>"
				;
			return msg
		},

		unbindCounter: function () {
			var counterContainer = document.getElementById("pomoFocusRemainingTimeContainer");
			var oldCounter = document.getElementById("pomoFocusRemainingTime");
			counterContainer.removeChild(oldCounter);

			var newCounter = document.createElement("span");
			newCounter.className = "yellow";
			newCounter.id = "pomoFocusRemainingTime";
			counterContainer.appendChild(newCounter);
		},

		initialSync: function () {
			msgBackground({ action: "syncPomo" });
		},

		newId: function () {
			var id = lsGet('lastPomoId');
			if (id == undefined) { id = 1; }
			id = parseInt(id) + 1;
			return id
		},

		toBackground: function (msg) {
			msg.target = "background";
			chrome.runtime.sendMessage(msg);
		},

		toInterfaces: function (msg) {
			msg.target = "popup";
			chrome.runtime.sendMessage(msg);

			msg.target = "options";
			chrome.runtime.sendMessage(msg);

			msg.target = "external page"
			chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
				if (tabs.length == 0) {
					log("Chrome Internal page selected");
					return
				}
				chrome.tabs.sendMessage(tabs[0].id, msg);
			});
		},

		endPomo: function (id, reason) {
			var now = new Date().getTime();

			var update = {
				active: false,
				endTime: now,
				lastUpdate: now,
				endReason: reason || "time"
			};

			pavPomo.backend.update(id, update);
			pavPomo.helpers.toInterfaces({
				action: "updatePomo",
				pomo: pavPomo.helpers.lastPomo()
			});

			stopAudio();
		},

		lastPomo: function () {
			var allPomos = pavPomo.backend.read();

			if (allPomos.length == 0) {
				log("No pomos yet");
				return false
			}

			var pomo = allPomos.splice(-1).pop();
			return pomo;
		}
	},

	backend: {
		create: function (options) {
			var allPomos = lsGet('allPomos', 'parse') || [];
			if (allPomos.length > 0) {
				var nPomos = allPomos.length;
				var lastPomo = allPomos[nPomos - 1];
				if (lastPomo.active == true) {
					lastPomo.active = false;
					lastPomo.endTime = new Date().getTime();
					lastPomo.lastUpdate = new Date().getTime();
				}
				allPomos[nPomos - 1] = lastPomo;
			}

			var taskId = options.id;
			var task = testTodo.backend.read(taskId);
			if (!task) { log("no task with " + taskId + " id"); return }

			var duration = options.duration || 25;

			var now = new Date().getTime();
			var endTime = now + (duration * 60 * 1000);

			var newPomo = {
				id: pavPomo.helpers.newId(),
				active: true,
				audio: options.audio || false,
				hyper: options.hyper || false,
				instaZap: options.instaZap || false,

				specialList: task.specialList || false,
				blackList: task.blackList || undefined,
				whiteList: task.whiteList || undefined,

				task: task.task,
				taskId: task.id,
				duration: duration,

				lastUpdate: now,
				endTime: endTime,
				endReason: options.endReason || "time"
			}

			if (!newPomo.task) {
				log("No task assigned");
				log(newPomo);
				return
			}

			allPomos.push(newPomo);
			lsSet('allPomos', allPomos, 'object');
			lsSet('lastPomoId', newPomo.id);

			pavPomo.helpers.toBackground({
				action: 'updatePomo',
				pomo: newPomo
			});

			return newPomo
		},
		read: function (id) {
			var allPomos = lsGet('allPomos', 'parse') || [];
			if (!id) { return allPomos; }

			var pomo = _.where(allPomos, { id: id });

			if (pomo.length == 0) {
				log("pomodoro not found");
				return false
			}

			return pomo[0];
		},
		update: function (id, updates) {
			var pomo = pavPomo.backend.read(id)
			if (!pomo) {
				log("No pomodoro found with " + id + " id");
				return false
			}

			if (updates) {
				var fieldChanges = Object.getOwnPropertyNames(updates);
				for (let f = 0; f < fieldChanges.length; f++) {
					let update = fieldChanges[f];
					pomo[update] = updates[update];
				}
			}

			var now = new Date().getTime();

			if (now > pomo.endTime) {
				// pomo.active = false;
			}
			pomo.lastUpdate = now;

			var allPomos = lsGet('allPomos', 'parse');
			var index = arrayObjectIndexOf(allPomos, id, 'id');
			allPomos[index] = pomo;

			lsSet('allPomos', allPomos, 'object');
			return pomo
		},
		delete: function (id) {
			var allPomos = lsGet('allPomos', 'parse');
			var index = arrayObjectIndexOf(allPomos, id, 'id');
			allPomos.splice(index, 1);

			lsSet('allPomos', allPomos, 'object');
		},
		backListener: function () {
			chrome.runtime.onMessage.addListener(
				function (request, sender, sendResponse) {
					if (request.target == "background") {
						var action = request.action;
						var allPomos = pavPomo.backend.read();
						var pomo = allPomos.splice(-1).pop();

						// Binaural controls
						if (action == "play") {
							update = { audio: true };
							pavPomo.backend.update(pomo.id, update);
							playAudio();
						}

						if (action == "stopAudio") {
							update = { audio: false };
							pavPomo.backend.update(pomo.id, update);
							stopAudio();
						}

						if (action == "volumeUp") {
							var myAudioVol = parseFloat(myAudio.volume);
							if (myAudioVol + 0.1 > 1) { myAudioVol = 1; }
							else { myAudioVol = myAudioVol + 0.1; }

							myAudio.volume = myAudioVol;
						}

						else if (action == "volumeDown") {
							var prevAudioVol = parseFloat(myAudio.volume);
							var newAudioVol;
							if (prevAudioVol - 0.1 < 0) { newAudioVol = 0; }
							else { newAudioVol = prevAudioVol - 0.1; }

							myAudio.volume = newAudioVol;
						}

						// Pomo Buttons replies
						else if (action == "donePomo") {
							pavPomo.helpers.endPomo(pomo.id, 'done');
							pavPomo.frontend.updateCountdown(
								pavPomo.helpers.lastPomo(),
								'background'
							);
						}

						else if (action == "stopPomo") {

							var p = pavPomo.helpers.lastPomo();

							pavPomo.helpers.endPomo(pomo.id, 'stop');
							pavPomo.frontend.updateCountdown(
								pavPomo.helpers.lastPomo(),
								'background'
							);
						}

						else if (action == "5 minutes") {
							var newEnd = pomo.endTime + 5 * 60 * 1000;
							var update = { endTime: newEnd };

							pavPomo.backend.update(pomo.id, update);

							// Reseting counter element for avoiding repetitive endings
							pavPomo.helpers.unbindCounter();


							// Regular update
							var pomoF = pavPomo.helpers.lastPomo();
							pavPomo.frontend.updateCountdown(
								pomoF,
								'background'
							);

							pavPomo.helpers.toInterfaces({
								action: "updatePomo",
								pomo: pomoF
							});
						}

						else if (action == "updatePomo") {
							pavPomo.frontend.updateCountdown(request.pomo, 'background');
						}

						else if (action == "startPomo") {
							var pomo = pavPomo.backend.create({ id: request.forTask, duration: request.duration });

							pavPomo.frontend.updateCountdown(pavPomo.helpers.lastPomo(), "background");
							pavPomo.helpers.toInterfaces({
								action: "updatePomo",
								pomo: pomo
							});

							pavPomo.helpers.toBackground({
								action: "updatePomo",
								pomo: pomo
							});
						}

						// Page replies
						else if (action == "newPage") {
							var pomo = pavPomo.helpers.lastPomo();
							sendResponse({
								pomodoro: pomo
							});
						}

						else if (action == "syncPomo") {
							var allPomos = lsGet('allPomos', 'parse');
							if (!allPomos) {
								log("no pomos");
								return
							}
							var pomo = allPomos.slice(-1).pop();
							pavPomo.helpers.toInterfaces({
								action: "updatePomo",
								pomo: pomo
							});
						}

					}
				});
		},
	},

	frontend: {
		// Starts the timer related to the countdown on pomodoros
		createCountdownElements: function (back) {
			var clockDiv = $('#pomoFocusRemainingTime');

			var timer = $(clockDiv).countdown(new Date().getTime(), function (event) {
				$(this).html(event.strftime('%M:%S'));
			});
		},

		// Updates graphic interface of pomodoro
		updateCountdown: function (pomo, page) {
			// Changes the displayed div (focus OR settings)
			pavPomo.frontend.togglePomodoro(pomo);

			// Changes the numerical values shown on countdown and task's name
			var endDate = new Date(pomo.endTime);
			var clockDiv = $('#pomoFocusRemainingTime');
			$(clockDiv).countdown(endDate, function (event) {
				$(this).html(event.strftime('%M:%S'));
			})
				.on('finish.countdown', function (event) {
					if (page == "background") {
						var p = pavPomo.helpers.lastPomo();
						if (p.endReason == 'time' || p.endReason == "done") {
							// Notify
							var NotList = lsGet('notifications', 'parse');
							var Not = NotList.pomofocusEnded;
							notifyUser(Not.title, Not.message, Not.id);
							stimuli("vibration", defInt, defAT, Not.title + " " + Not.message);
							testTodo.helpers.completeTask(p.taskId);
							pavPomo.helpers.endPomo(p.id, p.endReason);

						}
						else {
							pavPomo.helpers.endPomo(p.id, 'stop');
						}
						// Message interfaces
						pavPomo.helpers.toInterfaces({
							action: "updatePomo",
							pomo: pavPomo.helpers.lastPomo()
						});
						log("PomoFocus ended");

						pavPomo.helpers.unbindCounter();
					}
				});

			var taskSpan = $('#pomoFocusTask');
			$(taskSpan).html("Focusing on <span class='yellow'>" + pomo.task + "</span>");
		},

		startPomoListener: function () {
			$("#toDoTable tbody ").on('click', '.nowToDoItem', function () {
				var taskId = $(this).attr('id');
				taskId = parseInt(taskId.split('Pomo')[0]);

				$.prompt(pavPomo.helpers.prompMessage(), {
					title: "Great! Let's tackle this!",
					buttons: { "Ready! Let me start": true, "No, I don't want help": false },
					submit: function (e, v, m, f) {
						log("Enter PomoFocus result was " + v);
						var result = v;
						if (result == true) {
							var duration = parseInt($("#minutesPomodoro").val());
							pavPomo.helpers.toBackground({ action: "startPomo", forTask: taskId, duration: duration });
						}
					}
				});







			});
			$(".dailyContainer tbody ").on('click', '.dailyPomoNow', function () {
				var taskId = $(this).attr('id');
				taskId = parseInt(taskId.split('Pomo')[0]);

				pavPomo.helpers.toBackground({ action: "startPomo", forTask: taskId });
			});
		},

		togglePomodoro: function (pomo) {
			if (!pomo) { return }
			$("#instaZap").prop("checked", pomo.instaZap || false);
			$("#lockZap").prop("checked", pomo.lockZap || false);

			var confDiv = $("#toDoDiv");
			var focusDiv = $("#pomodoroFocusDiv");
			var hyperControl = $(".hyperFocusControlDiv");

			if (pomo.active == true) {
				$(confDiv).addClass('noDisplay');
				$(focusDiv).removeClass('noDisplay');
				$(hyperControl).removeClass('noDisplay');
			}
			else {
				$(confDiv).removeClass('noDisplay');
				$(focusDiv).addClass('noDisplay');
			}
		},

		enablePomoButtons: function () {
			$("#pomoFocusCompleteTask").click(function (event) {
				event.preventDefault();
				pavPomo.helpers.toBackground({ action: 'donePomo' });
			});

			$("#pomoFocusStop").click(function (event) {
				event.preventDefault();
				pavPomo.helpers.toBackground({ action: 'stopPomo' });
			});

			$("#pomoFocus5minutes").click(function (event) {
				event.preventDefault();
				pavPomo.helpers.toBackground({ action: '5 minutes' });
			});

			$("#playBinauralButton").click(function () {
				var pomoFocus = getPomoFocus('background');
				$("#stopBinauralButton").removeClass('noDisplay');
				$("#playBinauralButton").addClass('noDisplay');

				pavPomo.helpers.toBackground({ action: 'play' });
				// need some work
				pomoFocus.audio = true;
				savePomoFocus(pomoFocus, 'popup');
			});

			$("#stopBinauralButton").click(function () {
				$("#playBinauralButton").removeClass('noDisplay');
				$(this).addClass('noDisplay');

				pavPomo.helpers.toBackground({ action: "stopAudio" });

				// Need work
				var pomoFocus = getPomoFocus('background');
				pomoFocus.audio = false;
				savePomoFocus(pomoFocus, 'popup');

			});

			$("#vDownBinaural").click(function () {
				pavPomo.helpers.toBackground({ action: 'volumeDown' });

			});

			$("#vUpBinaural").click(function () {
				pavPomo.helpers.toBackground({ action: 'volumeUp' });
			});
		}
	},
}

export default pavPomo;