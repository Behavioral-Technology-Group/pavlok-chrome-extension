/* Next Steps

		- Page Controls should determine if BlackList and WhiteList are editable or not
		- Put a counter on every tab when in pomoFocus
		
*/

/* ***************************************************************** */
/* ***************                                   *************** */
/* ***************           To-Do Section           *************** */
/* ***************                                   *************** */
/* ***************************************************************** */

if (!localStorage.lastDay) { localStorage.lastDay = new Date().toDateString() }
if (!localStorage.pomoFocusO) { 
	var pomoFocusO = {}
	pomoFocusO.lastUpdate = new Date().getTime();
	localStorage.pomofocusO = JSON.stringify(pomoFocusO);
}
if (!localStorage.pomoFocusB) { 
	var pomoFocusB = {
		active: false,
		audio: false,
		daily: false,
		duration: 0,
		endReason: "time",
		endTime: new Date().getTime(),
		lastUpdate: new Date().getTime(),
		silent: "prompOnEnd",
		task: "pomofocus",
		taskID: 0		
	}
	localStorage.pomofocusB = JSON.stringify(pomoFocusB);
}
if (!localStorage.pomoFocusP) { 
	var pomoFocusP = {}
	pomoFocusP.lastUpdate = new Date().getTime();
	pomoFocusP.endTime = new Date().getTime();
	localStorage.pomofocusP = JSON.stringify(pomoFocusP);
}

function checkTaskIDs(){
	if (!localStorage.ToDoTasks) { localStorage.lastID = 0; return}
	
	// Check if there's an ID for every task. If not, create from 1. If so, feeds the others according to the greatest one.
	var taskList = JSON.parse(localStorage.ToDoTasks);
	var indexesList = [];
	
	// Get current IDs
	for (t = 0; t < taskList.length; t++) {
		var curID = taskList[t].id;
		indexesList.push(curID);
	}
	
	// Search for undefined IDs
	if ( indexesList.indexOf(undefined) != -1 ){
		var maxID = _.max(indexesList);
		if (maxID > 0){ // There are undefineds, but also numbers. So next IDs are increments of numbers.
			for (t = 0; t < taskList.length; t++) {
				if (taskList[t].id == undefined){
					var lastID = maxID + 1 + t;
					taskList[t].id = lastID;
				}
			}
		}
		else { // There are no numbers, only undefineds. So count comes from 0.
			for (t = 0; t < taskList.length; t++) {
				var lastID = 1 + t;
				taskList[t].id = lastID;
			}
		}
	}
	
	var newIDList = [];
	for (t = 0; t < taskList.length; t++) {
		var curID = taskList[t].id;
		newIDList.push(curID);
	}
	var maxID = _.max(newIDList);
	
	if ( localStorage.lastID > maxID ) { return }
	
	localStorage.lastID = maxID;
	localStorage.ToDoTasks = JSON.stringify(taskList);
}

/* ***************************************************************** */
/* ***************                                   *************** */
/* ***************           Daily Tasks             *************** */
/* ***************                                   *************** */
/* ***************************************************************** */

/*
	Daily Tasks are tasks that should be repeated every day. Therefore, they are stored apart from regular tasks and are "unCompleted" every day.
	
	They also can have a number of PomoFocuses attached to it (think writte for 2 pomodoros everyday)
	
	They can have custom and separated black and whitelists
	
	They can be set on the options page ONLY, but can be seen from both Options and Popup
	
*/

// Graphical Interface
function restoreDailyList(container){
	renewDailyTask();
	
	// remove the TRs, 
	$('.dailyItemTR').remove();
	var dailyList = lsGet('dailyList', 'parse');
	for (d = 0; d < dailyList.length; d++){
		var daily = dailyList[d];
		
		var pomoFocuses = '';
		var maxPomos = parseInt(daily.pomodoros);
		var donePomos = parseInt(daily.donePomos) || 0;
		var remainingPomos = maxPomos - donePomos;
		
		for (p = 0; p < donePomos; p++){
			pomoFocuses = pomoFocuses + '<input disabled type="image" src="images/pomodoro(completed).png" alt="Done!" class="doneDaily imgIcon" title="<p>Well done!</p>"/>'
		}
		
		for (p = 0; p < remainingPomos; p++){
			// pomoFocuses = pomoFocuses + '<input type="image" src="images/pomoFocusIconSmall.png" alt="Now" class="dailyPomoNow imgIcon" title="<p>Enter <b>Pomodoro</b> mode</p>"/>';
			pomoFocuses = pomoFocuses + '<input type="image" src="images/pomodoro(todo)_(Custom).png" alt="Now" class="dailyPomoNow imgIcon" title="<p>Enter <b>Pomodoro</b> mode</p>"/>';
		}
		
		var newLine = '' +
			'<tr id="daily' + daily.id + '" class="dailyItemTR">' +
				'<td>' +
					'<div class="dailyTaskName">' +
						'<span>' + daily.task + '</span>' + 
					'</div>' + 
					'<div class="pomoFocusHolders" >' + 
						'<span>' + pomoFocuses + '</span>' +
					'</div>' + 
				'</td>' +
			'</tr>'
		;
		$(container).append(newLine);	
	}
	
	
}

function enableDailyPomoFocus(){
	$(".dailyContainer tbody ").on('click', '.dailyPomoNow', function(){
		// Get ID via TR
		var line = $(this).parent().parent().parent().parent()[0];
		// Removes the 'daily' from the ID, returning the id#
		var dailyId = $(line).attr('id').split('y')[1];
		var dailyId = parseInt(dailyId);

		// Get daily via ID
		var dailyList = lsGet('dailyList', 'parse');
		var daily = _.where(dailyList, {id: dailyId})[0];
		startDailyPomodoro(daily);
	});
}

// Interface engines
function startDailyPomodoro(daily){
	lsSet('dailyPomo', daily, 'object');
	
	var pomoFocus = {}
	pomoFocus.active = true;
	pomoFocus.audio = daily.binaural;
	pomoFocus.duration = daily.duration;
	pomoFocus.endTime = deltaTime(parseInt(pomoFocus.duration) * 60).getTime();
	pomoFocus.hyper = daily.hyper || false;
	pomoFocus.lastUpdate = deltaTime(0).getTime();
	pomoFocus.silent = 'promptOnEnd';
	pomoFocus.task = daily.task
	pomoFocus.taskID = daily.id
	pomoFocus.daily = true;
	
	savePomoFocus(pomoFocus, 'background');
	msgBackground({
		action: 'startPomo',
		item:	pomoFocus,
	});
	console.log("Pomo focus begins")
	
	return
}

function completeDailyPomodoro(daily){
	var now = deltaTime(0).getTime();
	if (!daily.donePomos) { daily.donePomos = 0}
	console.log("Entered with " + daily.donePomos + " done pomos");
	daily.donePomos = daily.donePomos + 1; // What it should be if not being called twice
	// daily.donePomos = daily.donePomos + 0.5;
	daily.lastUpdate = now;
	if (!daily.completed){ daily.completed = [];}
	daily.completed.push(now);
	updateDailyTask(daily);
	
	var missing = parseInt(daily.pomodoros) - parseInt(daily.donePomos);
	var msg;
	
	var NotList = lsGet('notifications', 'parse');
	var Not = NotList.pomofocusDone;
	
	if (missing == 0) { msg = "Kudos! You completed all the pomodoros for " + daily.task + " today! Take a breath, pat yourself on the back! Great job!"; }
	else { msg = "Good job there! Only " + missing + " to go now!"; }
	notifyUser(Not.title, msg, Not.id);
	stimuli("vibration", defInt, defAT, Not.title + " " + msg, "false");
	
	lsDel('dailyPomo');
	console.log("Left with " + daily.donePomos + " done pomos");
}

function cancelDailyPomodoro(daily){ // Mark for deletion
	lsDel('dailyPomo');
	return // // gotta be a tad different from pomoFocus, as it won't use the same deal for completeness
}

// Backend
function dailyFromId(dailyId){
	var dailyId = parseInt(dailyId);
	var dailyList = lsGet('dailyList', 'parse');
	var daily = _.where(dailyList, {id: dailyId});
	if (daily.length == 1) { daily = daily[0]; }
	else { daily = false; }
	return daily
}

function dailyTaskIndex(daily){
	var dailyList = lsGet('dailyList', 'parse');
	var oldDaily;
	
	for (d = 0; d < dailyList.length; d++){
		oldDaily = dailyList[d]
		if (oldDaily.id == daily.id) { 
			return d
		}
	}
	console.log('something went wrong. Could not find daily task');
	return false
}

function addDailyTask(task){
	var newDaily = {};
	newDaily.id = parseInt(lsGet('lastDailyID')) + 1;
	newDaily.task = task;
	newDaily.pomodoros = 1;
	newDaily.donePomos = 0;
	newDaily.duration = "15";
	newDaily.specialList = false;
	newDaily.blackList = ' ';
	newDaily.whiteList = ' ';
	newDaily.hyper = true;
	newDaily.binaural = false;
	newDaily.instaZap = false;
	newDaily.description = '';
	newDaily.lastUpdate = deltaTime(0).getTime();
	newDaily.completed = [];
	
	var dailyList = lsGet('dailyList', 'parse') || [];
	dailyList.push(newDaily);
	lsSet('lastDailyID', newDaily.id);
	lsSet('dailyList', dailyList, 'object');
	
	return newDaily;
}

function updateDailyTask(daily){
	var dailyList = lsGet('dailyList', 'parse');
	var index = dailyTaskIndex(daily);
	
	daily.lastUpdate = deltaTime(0).getTime();
	dailyList[index] = daily;
		
	lsSet('dailyList', dailyList, 'object');
}

function removeDailyTask(daily){ // mark for deletion
	var dailyList = lsGet('dailyList', 'parse');
	var index = dailyTaskIndex(daily);
	
	dailyList.splice(index, 1);
		
	lsSet('dailyList', dailyList, 'object');
}

function renewDailyTask(){
	var today = new Date().toDateString();
	if ( today == localStorage.lastDay ) { return }
	else {
		var dailyList = lsGet('dailyList', 'parse');
		for (d = 0; d < dailyList.length; d++){
			dailyList[d].donePomos = 0;
			dailyList[d].lastUpdate = deltaTime(0).getTime();
		}
		lsSet('dailyList', dailyList, 'object');
		lsSet('lastDay', today);
	}
}

function syncDailies(page){ // mark for deletion
	chrome.extension.onMessage.addListener(
		function(request, sender, sendResponse) {
			if (request.action == "DailyTasks" && request.target == page){
				restoreTaskList();
			}
		}
	);
}

function sampleBinaural(){
	// Play for 5 seconds
	var testAudio = new Audio('../Audio/focus1min.mp3');
	testAudio.play();
	var endTestAudio = setTimeout(function(){
		testAudio.pause();
		testAudio.currentTime = 0;
	}, 5 * 1000);
}

/* ***************************************************************** */
/* ***************                                   *************** */
/* ***************             PomoFocus             *************** */
/* ***************                                   *************** */
/* ***************************************************************** */



var lastUpdate = 0;
var PFpromptForce = false;

function msgTabs(tabList, message){
	for (t = 0; t < tabList.length ; t++){
		msgExt(message, tabList[t])
		
		// 
	}
}

function createPomoFocusCountDown(){
	pomoFocusB = getPomoFocus('background');
	var endDate = dateFromTime(pomoFocusB.endTime);
	
	var clockDiv = $('#pomoFocusRemainingTime');
	// var taskSpan = $('#pomoFocusTask');
	
	var timer = $(clockDiv).countdown(endDate, function(event) {
		$(this).html(event.strftime('%M:%S'));
	});
}

function pomoFocusButtons(){
	$("#pomoFocusCompleteTask").click(function( event ){
		event.preventDefault();
		chrome.runtime.sendMessage({
			action: 'updatePomo',
			detail: 'done',
			target: 'background'
		})
		
		localStorage.endReason = 'done';
		
	});
	
	$("#pomoFocusStop").click(function( event ){
		event.preventDefault();
		chrome.runtime.sendMessage({
			action: 'updatePomo',
			detail: 'stop',
			target: 'background'
		});
	});
	
	$("#pomoFocus5minutes").click(function( event ){
		event.preventDefault();
		chrome.runtime.sendMessage({
			action: 'updatePomo',
			detail: '5 mins',
			target: 'background'
		});
	});

	$("#playBinauralButton").click(function(){
		var pomoFocus = getPomoFocus('background');
		$("#stopBinauralButton").removeClass('noDisplay');
		$("#playBinauralButton").addClass('noDisplay');
		
		msgBackground({action: "play"});
		pomoFocus.audio = true;
		savePomoFocus(pomoFocus, 'popup');
	});
	$("#stopBinauralButton").click(function(){
		$("#playBinauralButton").removeClass('noDisplay');
		$(this).addClass('noDisplay');
		
		msgBackground({action: "stopAudio"});
		var pomoFocus = getPomoFocus('background');
		pomoFocus.audio = false;
		savePomoFocus(pomoFocus, 'popup');
		
	});
	$("#vDownBinaural").click(function(){
		// alert("v down");
		msgExt('volumeDown', 'background');
	});
	$("#vUpBinaural").click(function(){
		// alert("v up");
		msgExt('volumeUp', 'background');
	});
}

function togglePomodoro(toState){
	var pomoFocus = getPomoFocus('background');
	
	var instaZap = lsGet('instaZap');
	instaZap = instaZap == 'true';
	$("#instaZap").prop( "checked", instaZap);

	var lockZap = lsGet('lockZap');
	lockZap = lockZap == 'true';
	$("#lockZap").prop( "checked", lockZap);
	
	var confDiv = $("#toDoDiv");
	var focusDiv = $("#pomodoroFocusDiv");
	var hyperControl = $(".hyperFocusControlDiv");
	
	if (toState == 'focus' || toState == true){
		$(confDiv).addClass('noDisplay');
		$(focusDiv).removeClass('noDisplay');
		
		if ( pomoFocus.hyper == 'true' || pomoFocus.hyper == true) { 
			$(hyperControl).removeClass('noDisplay'); 
		}
		else { $(hyperControl).addClass('noDisplay'); }
	}
	else {
		lsSet('instaZap', 'false');
		$(confDiv).removeClass('noDisplay');
		$(focusDiv).addClass('noDisplay');
	}
}

function pomodoroOnSteroids(){
	$("#toDoTable tbody ").on('click', '.nowToDoItem', function(){

		var item = PFGetClickedRow($(this));
		$(item.Row).addClass("nowTaskRow");
		updateTasksLog();
		
		// Prepare the prompt
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
		$.prompt(msg, {
			title: "Great! Let's tackle this!",
			buttons: { "Ready! Let me start": true, "No, I don't want help": false },
			submit: function(e,v,m,f){
				console.log("Enter PomoFocus result was " + v);
				var result = v;
				if (result == true){
					console.log(item);
					
					var newPomo = {
						daily: false,
						duration: parseFloat($("#minutesPomodoro").val()),
						hyper: $("#hyperFocusSelect").val(),
						task: item.Task,
						taskID: item.id
					}
					
					chrome.runtime.sendMessage({
						action: 'startPomo',
						item:	newPomo,
						target: 'background'
					});
					console.log("Pomo focus begins");
				}
				else{
					$(".nowTaskRow").removeClass("nowTaskRow");

				}
				updateTasksLog();
			}
		});
		
	});
}


/* ***************************************************************** */
/* ***************                                   *************** */
/* ***************           List Display            *************** */
/* ***************                                   *************** */
/* ***************************************************************** */



function activateTaskFilterButtons(){
	// Filter tasks: ALL
	$("#allToDoLink").click(function(){
		$( "#toDoTable tbody > tr").removeClass('noDisplay');
	});
	
	// Filter tasks: TODAY
	$("#todayToDoLink").click(function(){
		$( "#toDoTable tbody > tr:not(.todayTaskRow)" ).addClass('noDisplay');
		$( "#toDoTable tbody > tr.todayTaskRow" ).removeClass('noDisplay');
	});
	
	// Filter tasks: DONE
	$("#doneToDoLink").click(function(){
		$( "#toDoTable tbody > tr:not(.doneTaskRow)" ).addClass('noDisplay');
		$( "#toDoTable tbody > tr.doneTaskRow" ).removeClass('noDisplay');
	});
}

function addToDoItem(task, taskID){
	if (!taskID){
		var lastID = parseInt(localStorage.lastID);
		lastID = lastID + 1;		
		localStorage.lastID = lastID;
		
	}
	else { var lastID = taskID };
	
	var newLine = '<tr id="' + lastID + '" class="toDoItemTR">' +
					'<td colspan="5">' +
						'<div class="toDoOKerTD">' +
							'<input type="checkbox" class="doneCheckbox" title="Done?"/>' + 
						'</div>' + 
						'<div class="toDoOTaskTD">' + 
							task + 
						'</div>' +
						'<div class="toDoORemoverTD" >' + 
							'<input type="image" src="images/pomoFocusIconSmall.png" alt="Now" class="nowToDoItem imgIcon" title="<p>Enter <b>Pomodoro</b> mode</p>"/>' + 							
							'<input type="image" src="images/todayIcon.png" alt="Today" class="todayToDoItem imgIcon grayscale" title="<p>You will do it <b>today</b></p>"/>' + 
							'<input type="image" src="images/redXIcon.png" alt="Cancel" class="removeToDoItem imgIcon" title="<p>I will not do it anymore. <b>Remove it</b></p>"/>' + 
						'</div>' + 
					'</td>'
	;
	$('#toDoTable > tbody').append(newLine);
	var newTR = $('#toDoTable > tbody > tr').last();
	
	return newTR
}

function addToDoOnEnter(){
	$("#toDoAdd").keydown(function(e){
		if (e.keyCode == 13) {
			var task = $(this).val();
			if (task.length > 0){
				todo.createNewLine(todo.addTask(task));
				$(this).val("");
			}
		}
	});
}

function clearCompletedTasks(){
	$("#clearToDoLink").click(function(){
		$( "#toDoTable tbody > tr.doneTaskRow" ).remove();
		updateTasksLog();
	});
}

function restoreTaskList(){
	$(".toDoItemTR").remove()
	
	if (localStorage.ToDoTasks == undefined || localStorage.ToDoTasks == 'null' || localStorage.ToDoTasks == ''){ return }
	
	var TaskList = JSON.parse(localStorage.ToDoTasks);
	var totalTasks = TaskList.length;
	
	// Restore the tasks
	for (t = 0; t < totalTasks ; t++){
		curTask = TaskList[t];
		var line = todo.createNewLine(curTask);
		if (curTask.done == true) { $(line).addClass('doneTaskRow'); }
	}
	
	// updateTasksCounter();
}

function syncToDo(page){
	chrome.extension.onMessage.addListener(
		function(request, sender, sendResponse) {
			if (request.action == "TaskList" && request.target == page){
				restoreTaskList();
			}
		}
	);
}



/* ***************************************************************** */
/* ***************                                   *************** */
/* ***************           Task Status             *************** */
/* ***************                                   *************** */
/* ***************************************************************** */

function completeRegularTask(taskRow, override){
	if (!override) { override = false }
	var item = PFGetClickedRow(taskRow);
	
	if (override == true) { item.Checker = item.Checker == false; } // Inverts true and false
	
	// Adjust to match
	if (item.Checker == false){ // it was already done and now is undone
		$(item.CheckerDOM).prop("checked", false);		// Uncheck
		$(item.Row).removeClass("doneTaskRow");			// Remove classes
	}
	else if(item.Checker == true){ // it was NOT done and nos IS done
		$(item.CheckerDOM).prop("checked", true);		// Check
		$(item.Row).addClass("doneTaskRow");			// Add classes

		// Reward stimulus
		var Not = lsGet('notifications', 'parse');
		var Not = Not.pomofocusDone;
		
		notifyUser(Not.title, Not.message, Not.id);
		stimuli("vibration", defInt, defAT, Not.message, "false");
	}
	
	updateTasksCounter();
	updateTasksLog();
}

// // // function deleteTask(){
	// // // $("#toDoTable tbody ").on('click', '.removeToDoItem', function(){
		// // // var taskId = $(this).attr('id');
		// // // taskId = taskId.split('emove')[1];
		
		// // // todo.removeTask(todo.clickedTask(taskId, false));
		// // // $("#" + taskId).remove();
		
		// // // // var item = PFGetClickedRow($(this));
		// // // // var itemRow = item.Row;
		// // // // itemRow.remove();
		// // // // updateTasksCounter();
		// // // // updateTasksLog();
	// // // });
// // // }

function markTaskToday(){
	$("#toDoTable tbody ").on('click', '.todayToDoItem', function(){
		var item = PFGetClickedRow($(this));
		var todayImage = $($(item.Row).children().children()[2]).children()[1];
		if (item.Today == 'today') { 
			$(item.Row).removeClass("todayTaskRow"); 
			$(todayImage).addClass("grayscale");
		}
		else { 
			$(item.Row).addClass("todayTaskRow"); 
			$(todayImage).removeClass("grayscale");
			
		}
		updateTasksLog();
	});
}

/* ***************************************************************** */
/* ***************                                   *************** */
/* ***************              BackEnd              *************** */
/* ***************                                   *************** */
/* ***************************************************************** */

function PFGetClickedRow(object){
	var itemRow = false;
	var investigated = object;
	
	var cycles = 0;
	while (itemRow == false){
		if ($(investigated).is( "tr" )) {
			itemRow = $(investigated);
		}
		else {
			investigated = $(investigated).parent();
			cycles = cycles + 1;
			if (cycles > 20) { console.log("Unable to find parent TR element"); return}
		}
	}
	
	var itemID = $(itemRow).attr('id');
	var itemChecker = $($(itemRow).children().children()[0]).children().prop("checked");
	var itemCheckerDOM = $($(itemRow).children().children()[0]).children();
	
	var itemTask = $(itemRow.children().children()[1]).text();
	var itemTaskDOM = $(itemRow.children().children()[1]);
	
	var itemToday = $(itemRow).attr("class");
	itemToday = itemToday.split(" ");
	if (itemToday.indexOf("todayTaskRow") != -1) { itemToday = "today"; }
	else { itemToday = ""; }
	var itemTodayDOM = $($(itemRow).children().children()[2]).children()[1];
	
	var itemNow = '';
	var itemNowDOM = $($(itemRow).children().children()[2]).children()[0];
	
	var item = {};
	
	item.id = itemID;
	item.Row = itemRow;
	item.Checker = itemChecker;
	item.CheckerDOM = itemCheckerDOM;
	item.Task = itemTask;
	item.TaskDOM = itemTaskDOM;
	item.Today = itemToday;
	item.TodayDOM = itemTodayDOM;
	item.Now = itemNow;
	item.NowDOM = itemNowDOM;
	
	return item
}

function updateCompletedTasks(){
	$("#toDoTable tbody ").on('change', '.doneCheckbox', function(){
		item = PFGetClickedRow($(this));
		completeRegularTask(item.Row);
	});
}

function updateTasksCounter(){
	var count = $( "#toDoTable tbody > tr:not(.doneTaskRow)" ).length;
	if (count == 0) { text = "No items left!" }
	else if (count == 1) { text = "1 item left" }
	else if (count > 1) { text = count + " items left" }
	else { text = "problems counting" }
	
	$("#toDoNItemsLeft").html(text);
}

function updateTasksLog(){
	tasks = []
	allTasks = $( "#toDoTable tbody > tr" );
	totalTasks = allTasks.length;
	for (t = 0; t < totalTasks; t++){
		newTask = {}
		var itemRow = allTasks[t];
		itemID = $(itemRow).attr('id');
		var itemTd = $(itemRow).children();
		var itemDivs = $(itemTd).children();
		var itemTask = itemDivs[1].innerHTML;
		var itemDone = $(itemDivs[0]).children().prop("checked");
		var itemToday = $(itemRow).attr("class").split(" ").indexOf("todayTaskRow");
		if (itemToday != -1) { itemToday = true; }
		else { itemToday = false; }
		
		var itemNow = $(itemRow).attr("class").split(" ").indexOf("nowTaskRow");
		if (itemNow != -1) { itemNow = true; }
		else { itemNow = false; }
		
		newTask.id = itemID;
		newTask.task = itemTask;
		newTask.done = itemDone;
		newTask.today = itemToday;
		newTask.now = itemNow;
		
		tasks.push(newTask);
	}
	localStorage.ToDoTasks = JSON.stringify(tasks);
	
	// Propagate changes to every window
	msgExt('TaskList', 'popup');
	msgExt('TaskList', 'options');
}


/* ***************************************************************** */
/* ***************                                   *************** */
/* ***************              Enabler              *************** */
/* ***************                                   *************** */
/* ***************************************************************** */
function enableToDo(){
	
	// Enablers
	addToDoOnEnter();			// Add item on Enter
	activateTaskFilterButtons();	// Filters like All, Today and Done
	clearCompletedTasks();		// Clear Completed
	// createPomoFocusCountDown();	// Initialize the timer and the on finish events
	pomoTest.createCountdownElements();	// Initialize the timer and the on finish events
	// // // deleteTask();				// delete on X
	todo.listener();
	enableDailyPomoFocus()		// tomatoes from dailies trigger focus
	markTaskToday();			// Tags task for being done/not done today
	pomodoroOnSteroids();		// Now Pomodoro on Steroid mode
	pomoFocusButtons();			// Enables the Done, Stop +5 minutes buttons on Focus Mode
	restoreTaskList();			// Restore from To Do
	restoreDailyList();			// Restore from Dailies
	updateCompletedTasks();		// Complete if checked
	updateTasksCounter();		// Items counter:
	
}

/* Experimental */
var pomoTest = {
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
		togglePomodoro(pomo.active);
		
		// Changes the numerical values shown on countdown and task's name
		var endDate = dateFromTime(pomo.endTime);
		var clockDiv = $('#pomoFocusRemainingTime');
		$(clockDiv).countdown(endDate, function(event) {
			$(this).html(event.strftime('%M:%S'));
		})
		.on('finish.countdown', function(event) {
			if (page == "background"){
				if (localStorage.endReason == 'time') {
					// notifyUser("PomoFocus is over...", "Too bad task isn't, buddy. We'll help you get back on track", 'PFNotify')
					var NotList = lsGet('notifications', 'parse');
					var Not = NotList.pomofocusEnded;
					notifyUser(Not.title, Not.message, Not.id);
					stimuli("vibration", defInt, defAT, Not.title + " " + Not.message);
				}
				console.log("PomoFocus ended");
				pomoFocusB = lsGet('pomoFocusB', 'parse');
				pomoFocusB.audio = false;
				pomoFocusB.active = false;
				savePomoFocus(pomoFocusB, 'background');
				PFpromptForce = true;
				localStorage.instaZap = 'false';
				lsDel('lockZap');
				lsDel('dailyPomo');
			}
		});	
		
		var taskSpan = $('#pomoFocusTask');
		$(taskSpan).html("Focusing on <span class='yellow'>" + pomo.task + "</span>");
	},

	// Sends interface's changes to variables of pomodoro
	updatePomo: function(item){			
		// Collect data
		
		// error catching
		if (item.daily == undefined) { item.daily = false; }
		if (item.duration == undefined) { item.duration = 20; }
		if (item.hyper == undefined) { item.hyper = true; }
		// Changes data on pomoFocus
		
		// Sends to background
		var pomoFocus = {
			active:		true,
			daily:		item.daily || false,
			duration:	item.duration || 20,
			endReason:  'time',
			endTime:	deltaTime(item.duration * 60).getTime(),
			hyper:		item.hyper || true,
			lastUpdate:	new Date().getTime(),
			silent:		'promptOnEnd',
			task:		item.task,
			taskID:		item.taskID || item.id,
		}
		savePomoFocus(pomoFocus, 'background');
		
		pomoTest.updateCountdown(pomoFocus, 'background');
		pomoTest.communicatePomo(pomoFocus);
	},

	// Spreads changes in pomodoro variables to options and popup pages
	communicatePomo: function(pomo){		
		// Message with background pomo to other interfaces
		chrome.runtime.sendMessage({
			action: 'updatePomoFocus',
			pomo: pomo,
			target: 'popup'
		})
		
		chrome.runtime.sendMessage({
			action: 'updatePomoFocus',
			pomo: pomo,
			target: 'options'
		})
	},
	
	// Checks if pomofocus is the way it should
	validatePomo: function(pomo){
		var active;
		var audio;
		var daily;
		var duration;
		var endReason;
		var endTime;
		var lastUpdate;
		var silent;
		var task;
		var taskID;
	},
	
	// Finishes a pomodoro, but don't update looks (that's done via communicate function)
	endPomo: function(pomo, reason){
		pomo.active = false;
		pomo.audio = false;
		pomo.endReason = reason;
		pomo.endTime = new Date().getTime();
		pomo.lastUpdate = new Date().getTime();
		
		msgBackground({action: "stopAudio"});
		lsDel('instaZap');
		lsDel('dailyPomo');
		lsSet('pomoFocusB', pomo, 'object');
		savePomoFocus(pomo, 'background');
	},

	initialSync: function(){
		msgBackground({ action: "syncPomo"});
	},

	completeTask(pomo){
		// Graphical update
		if (pomo.daily == true) { pomoTest.checkDailyTask(pomo); }
		else { pomoTest.checkRegularTask(pomo); }
		togglePomodoro(pomo.active);
		
		// Backend
		pomoTest.endPomo(pomo, 'done');
		
		PFpromptForce = false;
		localStorage.instaZap = 'false';
		lsDel('lockZap');
		lsDel('dailyPomo');	
	},
	
	checkDailyTask: function(pomo){
		var dailyList = lsGet('dailyList', 'parse');
		var daily = _.where(dailyList, {id: pomo.taskID});
		if (daily.length == 1){ daily = daily[0]; }
		completeDailyPomodoro(daily);
		restoreDailyList('.dailyContainer');	
	},
	
	checkRegularTask: function(pomo){
		var taskID = pomo.taskID;
		var itemRow = $("#" + taskID);
		
		if (itemRow.length == 0){ console.log("no Now Task"); return }
		$(itemRow).removeClass("nowTaskRow");
		completeRegularTask(itemRow, true);
		
		var Not = lsGet('notifications', 'parse');
		var Not = Not.pomofocusDone;
		
		notifyUser(Not.title, Not.message, Not.id);
	},
	
}

var todo = {
	addTask: function(task){
		if (task.daily == true){
			// validate task
			
			// Get an ID for task
			
			// 
		}
		else{
			var tasks = lsGet('ToDoTasks', 'parse') || [];
			var newTask = {
				task: task.task || task.content || task,
				done: task.done || false,
				today: task.today || false,
				now: false,
				external_id: task.external_id
			}
			
			// Get an ID
			var lastID = parseInt(lsGet('lastID') || 1);
			newTask.id = lastID + 1;
			
			// Saves
			tasks.push(newTask)
			lsSet('ToDoTasks', tasks, 'object');
			lsSet('lastID', newTask.id);
		}
		
		return newTask
	},
	removeTask: function(task){
		if (task.daily == true){
			// Find task
			
			// Remove task from array
			
			// Save array
		}
		else{
			var tasks = lsGet('ToDoTasks', 'parse') || [];
			// Find task
			var index = arrayObjectIndexOf(tasks, task.id, 'id')
			tasks.splice(index, 1);
			lsSet('ToDoTasks', tasks, 'object');
		}
	},
	clickedTask: function(id, daily){
		var tasks
		if (daily == true)	{ tasks = lsGet('dailyList', 'parse'); }
		else				{ tasks = lsGet('ToDoTasks', 'parse'); }
		
		return _.where(tasks, {id: id});
	},
	
	editTask: function(){
		if (task.daily == true){
			
		}
	},
	
	validateTask: function(){
		if (task.daily == true){
			
		}
	},
	completeTask: function(){
		if (task.daily == true){
			
		}
	},
	
	// Interface update
	checkTask: function(task){
		if (task.daily == true){
			
		}
		else {
			
		}
	},
	
	updateInterface: function(){
		var regulars = lsGet('ToDoTasks', 'parse');
		for (t = 0; t < regulars.length; t++){
			todo.createNewLine(regulars[t]);
		}
	},
	
	createNewLine: function(task){
		var newLine = '<tr id="' + task.id + '" class="toDoItemTR">' +
						'<td colspan="5">' +
							'<div class="toDoOKerTD">' +
								'<input type="checkbox" class="doneCheckbox" title="Done?"/>' + 
							'</div>' + 
							'<div class="toDoOTaskTD">' + 
								task.task + 
							'</div>' +
							'<div class="toDoORemoverTD" >' + 
								'<input type="image" src="images/pomoFocusIconSmall.png" alt="Now" class="nowToDoItem imgIcon" title="<p>Enter <b>Pomodoro</b> mode</p>"/>' + 							
								'<input type="image" src="images/todayIcon.png" alt="Today" class="todayToDoItem imgIcon grayscale" title="<p>You will do it <b>today</b></p>"/>' + 
								'<input type="image" src="images/redXIcon.png" alt="Cancel" id="' + task.id + 'remove" class="removeToDoItem imgIcon" title="<p>I will not do it anymore. <b>Remove it</b></p>"/>' + 
							'</div>' + 
						'</td>'
		;
		$('#toDoTable > tbody').append(newLine);
		
		return $('#toDoTable > tbody tr:last-child')[0];
	},
	
	listener: function(){
			// Clicking on X for remove
			$("#toDoTable tbody ").on('click', '.removeToDoItem', function(){
				var taskId = $(this).attr('id');
				taskId = taskId.split('remove')[0];
				
				todo.removeTask(todo.clickedTask(taskId, false));
				$("#" + taskId).remove();
			});
			
			// Clicking on today
			$("#toDoTable tbody ").on('click', '.removeToDoItem', function(){
				var taskId = $(this).attr('id');
				taskId = taskId.split('today')[0];
				
				todo.removeTask(todo.clickedTask(taskId, false));
				$("#" + taskId).remove();
			});
			
			// Clicking on tomato for pomo
			$("#toDoTable tbody ").on('click', '.removeToDoItem', function(){
				var taskId = $(this).attr('id');
				taskId = taskId.split('pomo')[0];
				
				todo.removeTask(todo.clickedTask(taskId, false));
				$("#" + taskId).remove();   
			});
			
			// Clicking on the done checkbox
			
			
	}
};
