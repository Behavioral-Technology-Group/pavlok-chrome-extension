/* Next Steps
	Make it work with the options page
	Test the daily interactions
	
	Test an import of old model (daily and regular tasks separated)
	
	
	Test the import with todoist
	Debate on how to implement sync decisions
	Implement overriding rules
	
	Design coaching intervals
	Design to avoid coaching catch 22 (like showing the 0 tasks notification call)
			
*/

if (!localStorage.lastDay) { localStorage.lastDay = new Date().toDateString() }

function enableToDo(){
	testTodo.frontend.addTaskListener();
	testTodo.frontend.doneCheckListener();
	testTodo.frontend.removeTaskListener();
	testTodo.frontend.tagTodayListener();
	testTodo.frontend.restoreTasks();
	
	pavPomo.frontend.startPomoListener();
	pavPomo.frontend.enablePomoButtons();
	
}

var pavPomo = {
	helpers: {
		unbindCounter: function(){
			var counterContainer = document.getElementById("pomoFocusRemainingTimeContainer");
			var oldCounter  = document.getElementById("pomoFocusRemainingTime");
			counterContainer.removeChild(oldCounter);
			
			var newCounter = document.createElement("span");
			newCounter.className = "yellow";
			newCounter.id = "pomoFocusRemainingTime";
			counterContainer.appendChild(newCounter);
		},
		
		initialSync: function(){
			msgBackground({ action: "syncPomo"});
		},
		
		newId: function(){
			var id = lsGet('lastPomoId');
			if (id == undefined) { id = 1; }
			id = parseInt(id) + 1;
			return id
		},
		
		toBackground: function(msg){
			msg.target = "background";
			chrome.runtime.sendMessage(msg);
		},
		
		toInterfaces: function(msg){
			msg.target = "popup";
			chrome.runtime.sendMessage(msg);
			
			msg.target = "options";
			chrome.runtime.sendMessage(msg);
			
			msg.target = "external page"
			chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
				if (tabs.length == 0){
					console.log("Chrome Internal page selected");
					return
				}
				chrome.tabs.sendMessage(tabs[0].id, msg);
			});
		},
		
		endPomo: function(id, reason){
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
		
		lastPomo: function(){
			var allPomos = pavPomo.backend.read();
			
			if (allPomos.length == 0){
				console.log("No pomos yet");
				return false
			}
			
			var pomo = allPomos.splice(-1).pop();
			return pomo;
		}
	},
	
	backend: {
		create: function(options){
			var allPomos = lsGet('allPomos', 'parse') || [];
			if (allPomos.length > 0){
				var nPomos = allPomos.length;
				var lastPomo = allPomos[nPomos - 1];
				if (lastPomo.active == true){
					lastPomo.active = false;
					lastPomo.endTime = new Date().getTime();
					lastPomo.lastUpdate = new Date().getTime();
				}
				allPomos[nPomos - 1] = lastPomo;
			}
			
			var taskId = options.id;
			var task = testTodo.backend.read(taskId);
			if (!task){ console.log("no task with " + taskId + " id"); return }
			
			var duration = options.duration || 25;
			
			var now 	= new Date().getTime();
			var endTime = now + (duration * 60 * 1000);
			
			var newPomo = {
				id: pavPomo.helpers.newId(),
				active:			true,
				audio: 			options.audio 		|| false,
				hyper: 			options.hyper 		|| false,
				instaZap: 		options.instaZap 	|| false,
				
				specialList:	task.specialList 	|| false,
				blackList:		task.blackList		|| undefined,
				whiteList:		task.whiteList		|| undefined,
				
				task:			task.task,
				taskId:			task.id,
				duration:		duration,
				
				lastUpdate:		now,
				endTime:		endTime,
				endReason:		options.endReason	|| "time"
			}
			
			if (!newPomo.task){
				console.log("No task assigned");
				console.log(newPomo);
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
		read: function(id){
			var allPomos = lsGet('allPomos', 'parse') || [];
			if (!id) { return allPomos; }
			
			var pomo = _.where(allPomos, {id: id});
			
			if (pomo.length == 0) { 
				console.log("pomodoro not found"); 
				return false
			}
			
			return pomo[0];
		},
		update: function(id, updates){
			var pomo = pavPomo.backend.read(id)
			if (!pomo) {
				console.log("No pomodoro found with " + id+ " id");
				return false
			}
			
			if (updates){
				var fieldChanges = Object.getOwnPropertyNames(updates);
				for (f = 0; f < fieldChanges.length; f++){
					update = fieldChanges[f];
					pomo[update] = updates[update];
				}
			}
			
			var now = new Date().getTime();
			
			if (now > pomo.endTime){
				// pomo.active = false;
			}
			pomo.lastUpdate = now;
			
			var allPomos = lsGet('allPomos', 'parse');
			var index = arrayObjectIndexOf(allPomos, id, 'id');
			allPomos[index] = pomo;
			
			lsSet('allPomos', allPomos, 'object');
			return pomo
		},
		delete: function(id){
			var allPomos = lsGet('allPomos', 'parse');
			var index = arrayObjectIndexOf(allPomos, id, 'id');
			allPomos.splice(index, 1);
			
			lsSet('allPomos', allPomos, 'object');
		},
		backListener: function(){
			chrome.runtime.onMessage.addListener(
				function(request, sender, sendResponse) {
					if (request.target == "background"){
						var action = request.action;
						var allPomos = pavPomo.backend.read();
						var pomo = allPomos.splice(-1).pop();
						
						// Binaural controls
						if (action == "play"){
							update = {audio: true};
							pavPomo.backend.update(pomo.id, update);
							playAudio();
						}
						
						if (action == "stopAudio"){
							update = {audio: false};
							pavPomo.backend.update(pomo.id, update);
							stopAudio();
						}
						
						if (action == "volumeUp"){
							var myAudioVol = parseFloat(myAudio.volume);
							if (myAudioVol + 0.1 > 1) { myAudioVol = 1; }
							else { myAudioVol = myAudioVol + 0.1; }
							
							myAudio.volume = myAudioVol;
						}
						
						else if (action == "volumeDown"){
							var prevAudioVol = parseFloat(myAudio.volume);
							var newAudioVol;
							if (prevAudioVol - 0.1 < 0) { newAudioVol = 0; }
							else { newAudioVol = prevAudioVol - 0.1; }
							
							myAudio.volume = newAudioVol;
						}
						
						// Pomo Buttons replies
						else if (action == "donePomo"){
							pavPomo.helpers.endPomo(pomo.id, 'done');
							pavPomo.frontend.updateCountdown(
								pavPomo.helpers.lastPomo(),
								'background'
							);
						}
						
						else if (action == "stopPomo"){
							
							var p = pavPomo.helpers.lastPomo();
							
							pavPomo.helpers.endPomo(pomo.id, 'stop');
							pavPomo.frontend.updateCountdown(
								pavPomo.helpers.lastPomo(),
								'background'
							);
						}
						
						else if (action == "5 minutes"){
							var newEnd = pomo.endTime + 5 * 60 * 1000;
							var update = {endTime: newEnd};
							
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
						
						else if (action == "updatePomo"){
							pavPomo.frontend.updateCountdown(request.pomo, 'background');
						}
						
						else if (action == "startPomo"){
							var pomo = pavPomo.backend.create({id: request.forTask});
							
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
						
						else if (action == "syncPomo"){
							var allPomos = lsGet('allPomos', 'parse');
							if (!allPomos){
								console.log("no pomos");
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
		createCountdownElements: function(back){
			var clockDiv = $('#pomoFocusRemainingTime');
			
			var timer = $(clockDiv).countdown(new Date().getTime(), function(event) {
				$(this).html(event.strftime('%M:%S'));
			});
		},
		
		// Updates graphic interface of pomodoro
		updateCountdown: function(pomo, page){
			// Changes the displayed div (focus OR settings)
			pavPomo.frontend.togglePomodoro(pomo);
			
			// Changes the numerical values shown on countdown and task's name
			var endDate = new Date(pomo.endTime);
			var clockDiv = $('#pomoFocusRemainingTime');
			$(clockDiv).countdown(endDate, function(event) {
				$(this).html(event.strftime('%M:%S'));
			})
			.on('finish.countdown', function(event) {
				if (page == "background"){
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
					console.log("PomoFocus ended");
					
					pavPomo.helpers.unbindCounter();
				}
			});	
			
			var taskSpan = $('#pomoFocusTask');
			$(taskSpan).html("Focusing on <span class='yellow'>" + pomo.task + "</span>");
		},
		
		startPomoListener: function(){
			$("#toDoTable tbody ").on('click', '.nowToDoItem', function(){
				var taskId = $(this).attr('id');
				taskId = parseInt(taskId.split('Pomo')[0]);
				
				pavPomo.helpers.toBackground({action: "startPomo", forTask: taskId});
			});
			$(".dailyContainer tbody ").on('click', '.dailyPomoNow', function(){
				var taskId = $(this).attr('id');
				taskId = parseInt(taskId.split('Pomo')[0]);
				
				pavPomo.helpers.toBackground({action: "startPomo", forTask: taskId});
			});
		},
		
		togglePomodoro: function(pomo){
			if (!pomo) { return }
			$("#instaZap").prop( "checked", pomo.instaZap || false);
			$("#lockZap").prop( "checked", pomo.lockZap || false);
			
			var confDiv = $("#toDoDiv");
			var focusDiv = $("#pomodoroFocusDiv");
			var hyperControl = $(".hyperFocusControlDiv");
			
			if (pomo.active == true){
				$(confDiv).addClass('noDisplay');
				$(focusDiv).removeClass('noDisplay');
				$(hyperControl).removeClass('noDisplay'); 
			}
			else {
				$(confDiv).removeClass('noDisplay');
				$(focusDiv).addClass('noDisplay');
			}
		},
		
		enablePomoButtons: function(){
			$("#pomoFocusCompleteTask").click(function( event ){
				event.preventDefault();
				pavPomo.helpers.toBackground({action: 'donePomo'});
			});
			
			$("#pomoFocusStop").click(function( event ){
				event.preventDefault();
				pavPomo.helpers.toBackground({action: 'stopPomo'});
			});
			
			$("#pomoFocus5minutes").click(function( event ){
				event.preventDefault();
				pavPomo.helpers.toBackground({action: '5 minutes'});
			});

			$("#playBinauralButton").click(function(){
				var pomoFocus = getPomoFocus('background');
				$("#stopBinauralButton").removeClass('noDisplay');
				$("#playBinauralButton").addClass('noDisplay');
				
				pavPomo.helpers.toBackground({action: 'play'});
				// need some work
				pomoFocus.audio = true;
				savePomoFocus(pomoFocus, 'popup');
			});
			
			$("#stopBinauralButton").click(function(){
				$("#playBinauralButton").removeClass('noDisplay');
				$(this).addClass('noDisplay');
				
				pavPomo.helpers.toBackground({action: "stopAudio"});
				
				// Need work
				var pomoFocus = getPomoFocus('background');
				pomoFocus.audio = false;
				savePomoFocus(pomoFocus, 'popup');
				
			});
			
			$("#vDownBinaural").click(function(){
				pavPomo.helpers.toBackground({action: 'volumeDown'});
			
			});
			
			$("#vUpBinaural").click(function(){
				pavPomo.helpers.toBackground({action: 'volumeUp'});
			});
		}
	},
}

var testTodo = {
	backend: {
		// Helpers
		newId: function(){
			var id = lsGet('lastID');
			if (id == undefined) { id = 1; }
			id = parseInt(id) + 1;
			return id
		},
		
		scaffold: function(task){
			newTask = {
				task:			task.task,
				daily:			task.daily			|| false,
				done:			task.done			|| false,
				pomos:			task.pomos 			|| undefined,
				donePomos:		task.donePomos		|| undefined,
				duration:		task.duration		|| 25,
				specialList:	task.specialList 	|| false,
				blackList:		task.blackList		|| undefined,
				whiteList:		task.whiteList		|| undefined,
				instaZap:		task.instaZap		|| false,
				binaural:		task.binaural		|| false,
				today:			task.today			|| false
			}
			return newTask
		},
		
		validate: function(task){
			
		},
		
		// CRUD
		create: function(task){
			var allTasks = lsGet('allTasks', 'parse') || [];
			var task = testTodo.backend.scaffold(task);
			task.id = testTodo.backend.newId();
			allTasks.push(task);
			lsSet('allTasks', allTasks, 'object');
			
			lsSet('lastID', task.id);
			console.log("New task added:")
			console.log(task)
			return task
		},
		
		read: function(id){
			var allTasks = lsGet('allTasks', 'parse') || [];
			if (!id) { return allTasks }
			
			var task = _.where(allTasks, {id: id});
			if (task.length == 0) { return undefined }
			return task[0];
		},
		
		update: function(taskId, updates){
			var allTasks = lsGet('allTasks', 'parse');
			var task = testTodo.backend.read(taskId);
			
			if (!task) { 
				console.log("Couldn't find task of ID " + taskId); 
				return false;
			}
			
			var fieldChanges = Object.getOwnPropertyNames(updates);
			for (f = 0; f < fieldChanges.length; f++){
				update = fieldChanges[f];
				task[update] = updates[update];
			}
			
			var index = arrayObjectIndexOf(allTasks, task.id, 'id');
			allTasks[index] = task;
			
			lsSet('allTasks', allTasks, 'object');

			return task
				
		},
			
		delete: function(id){
			id = parseInt(id);
			var allTasks = lsGet('allTasks', 'parse');
			var index = arrayObjectIndexOf(allTasks, id, 'id');
			
			if (index == -1 ){ 
				console.log("Task ID " + id + " not found"); 
				return false;
			}
			
			allTasks.splice(index, 1);
			lsSet('allTasks', allTasks, 'object');
			return true
		},
	},
	
	frontend: {
		addTaskListener: function(){
			$("#toDoAdd").keydown(function(e){
				if (e.keyCode == 13) {
					var text = $(this).val();
					if (text.length > 0){
						// Create a task on the database
						var task = testTodo.backend.create({task: text});
						
						// Create a line for the interface
						var line = testTodo.frontend.createNewLine(task);
						$('#toDoTable > tbody').append(line);
						
						// Reset input field value
						$(this).val("");
					}
				}
			});
			
			$("#newDailyTaskInput").keydown(function(e){
				if (e.keyCode == 13) {
					var newTaskName = $("#newDailyTaskInput").val()
					if (newTaskName.length > 0 && newTaskName != " "){
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
						msgInterfaces({action: "updateDaily"});
						
					} else{
						return
					}
				}
			});
		},
		
		removeTaskListener: function(){
			$("#toDoTable tbody ").on('click', '.removeToDoItem', function(){
				var taskId = $(this).attr('id');
				taskId = taskId.split('Remove')[0];
				
				var deleted = testTodo.backend.delete(taskId);
				if (deleted) {$("#" + taskId).remove();}
			});	
		},
		
		tagTodayListener: function(){
			$("#toDoTable tbody ").on('click', '.todayToDoItem', function(){
				var img = $(this);
				var isToday;
				
				var taskId = img.attr('id');
				taskId = parseInt(taskId.split('today')[0]);
				
				if ($(img).hasClass("grayscale")) 	{ isToday = true; }
				else 								{ isToday = false }
				
				testTodo.backend.update(taskId, {today: isToday});
				testTodo.frontend.restoreTasks();
				// todo.editLine(task);
			});
		},
		
		editDailyListener: function(){},
		
		doneCheckListener: function(){
			$("#toDoTable").on('click', '.doneCheckbox', function(){
				var box = $(this)
				var taskId = box.attr('id');
				taskId = parseInt(taskId.split('Done')[0]);
				
				var check = box.prop('checked');
				if (check == true){ 
					stimuli("vibration", defInt, defAT, "You rock! Let Pavlok massage your wrist a bit!");
					notifyUser("Yeah! One down!", "You rock! Let Pavlok massage your wrist a bit!", "doneTask");
				}
				var update = {done: check};
				
				var task = testTodo.backend.update(taskId, update);
				
				testTodo.frontend.restoreTasks();
			});
		},
		
		createNewLine: function(task, target){
			if (task.daily == false){
				{var tr = document.createElement("tr");
					tr.className = "toDoItemTR";
					if (task.done) { tr.className = tr.className + " doneTaskRow"}
					tr.id = task.id;
				}
				
				{var td = document.createElement("td");
					tr.appendChild(td);
					td.colSpan = 5;
				}
				
				{var containerDiv = document.createElement("div");
					td.appendChild(containerDiv);
				}
				
				{var doneDiv = document.createElement("div");
					containerDiv.appendChild(doneDiv);
					doneDiv.className = "toDoOKerDIV";
				}
				
				{var doneCheckbox = document.createElement("input");
					doneDiv.appendChild(doneCheckbox);
					doneCheckbox.className = "doneCheckbox"
					doneCheckbox.type = "checkbox";
					doneCheckbox.checked = task.done;
					doneCheckbox.title = "Done?"
					doneCheckbox.id = task.id + "Done"
				}
				
				{var taskDiv = document.createElement("div");
					containerDiv.appendChild(taskDiv);
					taskDiv.className = "toDoTaskDIV";
					taskDiv.innerHTML = task.task;
				}
				
				{var buttonsDiv = document.createElement("div");
					containerDiv.appendChild(buttonsDiv);
					buttonsDiv.className = "toDoRemoverDIV";
				}
				
				{var pomoButton = document.createElement("input");
					buttonsDiv.appendChild(pomoButton);
					pomoButton.type = "image";
					pomoButton.src = "images/pomodoro(todo)_(Custom).png";
					pomoButton.alt = "Now";
					pomoButton.id = task.id + "Pomo";
					pomoButton.className = "nowToDoItem imgIcon";
					pomoButton.title = "<p>Enter <b>Pomodoro</b> mode</p>";
				}
				
				{var todayButton = document.createElement("input");
					buttonsDiv.appendChild(todayButton);
					todayButton.type = "image";
					todayButton.src = "images/todayIcon.png";
					todayButton.alt = "Today";
					todayButton.id = task.id + "today"
					todayButton.className = "todayToDoItem imgIcon"; 
					if (task.today == false){
						todayButton.className = todayButton.className + " grayscale"; 
					}
					todayButton.title = "<p>You will do it <b>today</b></p>";
				}
				
				{var removeButton = document.createElement("input");
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
			else if(task.daily == true && target == "popup"){
				{var tr = document.createElement("tr");
				tr.id = task.id;
				tr.className = "dailyItemTR";}
				
				{var td = document.createElement("td");
				tr.appendChild(td);}
				
				{var taskDiv = document.createElement("div");
				td.appendChild(taskDiv);
				taskDiv.className = "dailyTaskName";}
				
				{var taskSpan = document.createElement("span");
				taskDiv.appendChild(taskSpan);
				taskSpan.innerHTML = task.task;}
				
				{var pomoHoldersDiv = document.createElement("div");
				td.appendChild(pomoHoldersDiv);
				pomoHoldersDiv.className = "pomoFocusHolders";}
				
				{var pomoHolderSpan = document.createElement("span");
				pomoHoldersDiv.appendChild(pomoHolderSpan);
				
					// Create the number of green and red apples according to the number of done and remaining pomos
					var pomoFocuses = '';
					var maxPomos = parseInt(task.pomos);
					var donePomos = parseInt(task.donePomos) || 0;
					var remainingPomos = maxPomos - donePomos;
					
					for (p = 0; p < donePomos; p++){
						pomoFocuses = pomoFocuses + '<input disabled type="image" src="images/pomodoro(completed).png" alt="Done!" class="doneDaily imgIcon" title="<p>Well done!</p>"/>'
					}
					
					for (p = 0; p < remainingPomos; p++){
						pomoFocuses = pomoFocuses + '<input type="image" src="images/pomodoro(todo)_(Custom).png" alt="Now" id="' + task.id + 'Pomo" class="dailyPomoNow imgIcon" title="<p>Enter <b>Pomodoro</b> mode</p>"/>';
					}
					
				pomoHolderSpan.innerHTML = pomoFocuses;
				}
			}
			
			return tr;
		},
		
		findLineById: function(id){
			var line = $("#"+id);
			if (line.length == 0){ return undefined }
			return line[0];
		},
		
		restoreTasks: function(target){
			if(!target) { target = "popup"; }
			
			var allTasks 		= lsGet('allTasks', 'parse');
			var regularTasks 	= _.where(allTasks, {daily: false});
			var dailyTasks 		= _.where(allTasks, {daily: true});
			
			var task;
			var line;
			
			// Clearing regular tasks
			$(".toDoItemTR").remove();
			
			// Recreating regular tasks
			for (r = 0; r < regularTasks.length; r++){
				task = regularTasks[r];
				line = testTodo.frontend.createNewLine(task);
				$('#toDoTable > tbody').append(line);
			}
			
			// Clearing daily tasks
			$('.dailyItemTR').remove();
			
			// Recreating daily tasks
			for (d = 0; d < dailyTasks.length; d++){
				task = dailyTasks[d];
				line = testTodo.frontend.createNewLine(task, target);
				$('.dailyContainer tbody').append(line);	
			}
		},
		
		updateLine: function(){},
		
		dailyDetail(id){
			var task = testTodo.backend.read(id);
			
			if (task.length == 0){
				console.log("Task of id " + id + " not found or not daily");
				return false
			}
			
			var detailTable = document.createElement("table");
			detailTable.id = "dailyListDetails";
			
			var tbody = document.createElement("tbody");
			detailTable.appendChild(tbody);
			
			{var idRow = document.createElement("tr");
			idRow.className = "noDisplay";
			tbody.appendChild(idRow);
			
				var idRowCategory = document.createElement("td"); {
				idRowCategory.className = "categoryName";
				idRowCategory.innerHTML = "Daily ID"
				idRow.appendChild(idRowCategory);}
				
				var idRowValue = document.createElement("td"); {
				idRowValue.id = "dailyTaskIdTD";
				idRow.appendChild(idRowValue);}
				
				var idRowInput = document.createElement("input"); {
				idRowInput.type = "text";
				idRowInput.id = "dailyTaskIdInput"
				idRowInput.disabled = true;
				idRowInput.value = task.id;
				idRowValue.appendChild(idRowInput);}}
			
			{var pomosRow = document.createElement("tr"); 
			tbody.appendChild(pomosRow);

				var pomosCat = document.createElement("td"); {
				pomosRow.appendChild(pomosCat);
				pomosCat.className = "categoryName";
				pomosCat.innerHTML = "Pomodoros per day ";}
				
				var pomosNumber = document.createElement("td"); {
				pomosRow.appendChild(pomosNumber);
				pomosNumber.id = "pomodorosPerDayTD";}
				
					var pomoPerDaySelect = document.createElement("select"); {
					pomosNumber.appendChild(pomoPerDaySelect);
					pomoPerDaySelect.id = "pomoPerDaySelect";}
					
						{var pomoN1 = document.createElement("option");
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
				
					var lasting = document.createElement("span");{
					pomosNumber.appendChild(lasting);
					lasting.innerHTML = " lasting for ";}
					
					var pomoDurationSelect = document.createElement("select");{
					pomosNumber.appendChild(pomoDurationSelect);
					pomoDurationSelect.id = "dailyPomoDuration";}
					
						{var pomoD2 = document.createElement("option");
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

			{var controlsRow = document.createElement("tr");
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
				genSpan.innerHTML = " Use special black and white lists";}
				
			{var blackTR = document.createElement("tr");
			tbody.appendChild(blackTR);
			blackTR.className = "specialListDisplay";
			if (task.specialList == false) { blackTR.className = "specialListDisplay noDisplay"}
			
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
								
			{var whiteTR = document.createElement("tr"); 
			tbody.appendChild(whiteTR);
			whiteTR.className = "specialListDisplay";
			if (task.specialList == false) { whiteTR.className = "specialListDisplay noDisplay"}

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
			{var saveOrResetTR = document.createElement("tr");
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
		resetDailyTasks: function(){
			var allTasks = testTodo.backend.read();
			var dailies = _.where(allTasks, {daily: true});
			var update = { donePomos: 0 };
			
			for (d = 0; d < dailies.length; d++){
				daily = dailies[d];
				testTodo.backend.update(daily.id, update);
			}
			
			pavPomo.helpers.toInterfaces({	action: "updateActions"	});
		},
		
		migrateFromSeparateLists: function(){
			var oldRegulars = lsGet('ToDoTasks', 'parse');
			var oldDailies  = lsGet('dailyList', 'parse');
			
			var combinedTasks = [];
			var t;
			
			for (r = 0; r < oldRegulars.length; r++){
				t = oldRegulars[r];
				delete t.id;
				
				combinedTasks.push(t);
			}
			
			for (d = 0; d < oldDailies.length; d++){
				t = oldDailies[d];
				delete t.id;
				delete t.completed;
				delete t.description;
				delete t.hyper;
				
				t.duration  = parseInt(t.duration)  || 25;
				t.pomos 	= parseInt(t.pomodoros) || 3;
				t.donePomos = parseInt(t.donePomos) || 0;
				t.daily		= true;
				
				combinedTasks.push(t);
			}
			return combinedTasks;
		},
		
		archiveOldLists: function(){
			var relics = {};
			relics.oldDaily = lsGet('dailyList', 'parse');
			relics.oldRegulars = lsGet('ToDoTasks', 'parse');
			lsSet('relics', relics, 'object');
			
			lsDel('dailyList');
			lsDel('ToDoTasks');
		},
		
		gatherDaily(){
			var blackListDiv = $("#blackListTD").children()[0];
			var whiteListDiv = $("#whiteListTD").children()[0];
			
			var details = {
				id: 			parseInt($("#dailyTaskIdInput").val()),
				// task: 			$("#where is the name").val(),
				daily: 			true,
				pomos: 			parseInt($("#pomoPerDaySelect").val()),
				duration: 		parseInt($("#dailyPomoDuration").val()),
				specialList: 	$("#specialListsInput").prop("checked"),
				blackList: 		$(blackListDiv).val(),
				whiteList: 		$(whiteListDiv).val(),
			}
			return details
		},
		
		completeTask(taskId){
			var task = testTodo.backend.read(taskId);
			if (task.daily == true){ 
				task.donePomos = task.donePomos + 1; 
				var update = {donePomos: task.donePomos};
			}
			else { 
				update = {done: true }
			}
			
			testTodo.backend.update(taskId, update);
			testTodo.frontend.restoreTasks();
			
			pavPomo.helpers.toInterfaces({	action: "updateActions"	});
		},
	}

};

// function setTest(){
	
	// var pomo = pavPomo.backend.create({id:2, duration:30});
	// pavPomo.frontend.updateCountdown(pomo, "background");
	// console.log("=======================================");
	// console.log("Created a new pomodoro");
	// console.log(pomo);
	
	// setTimeout(function(){
		// var pomoAgain = pavPomo.helpers.lastPomo();
		// var newEnd = pomo.endTime + 5 * 60 * 1000;
		// pavPomo.backend.update(pomoAgain.id, {endTime: newEnd, active: true});
		// console.log("=======================================");
		// console.log("Updated the last pomodoro");
		// console.log(pavPomo.helpers.lastPomo());
	// }, 2000);
// }

