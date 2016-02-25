/* Next Steps

BOOM!	- Sync tasks in real time
BOOM!	- Fix lastID not being updated
BOOM!	- Create daily (repeated) tasks
BOOM!	- Change the blacklist and whitelist during daily pomoFocus
BOOM!	- Create daily tasks display
BOOM!	- Add new Daily tasks
BOOM!	- Delete Daily tasks
BOOM!	- Update Daily on PopUp

*/

/* ***************************************************************** */
/* ***************                                   *************** */
/* ***************           To-Do Section           *************** */
/* ***************                                   *************** */
/* ***************************************************************** */

if (!localStorage.pomoFocusO) { 
	var pomoFocusO = {}
	pomoFocusO.lastUpdate = new Date().getTime();
	// localStorage.pomoFocusO = JSON.stringify(pomoFocusO);
	lsSet('pomoFocusO', pomoFocusO, 'object');
}
if (!localStorage.pomoFocusB) { 
	var pomoFocusB = {}
	pomoFocusB.lastUpdate = new Date().getTime();
	// localStorage.pomoFocusB = JSON.stringify(pomoFocusB);
	lsSet('pomoFocusB', pomoFocusB, 'object');
}
if (!localStorage.pomoFocusP) { 
	var pomoFocusP = {}
	pomoFocusP.lastUpdate = new Date().getTime();
	pomoFocusP.endTime = timeDelta(0).getTime();
	// localStorage.pomoFocusP = JSON.stringify(pomoFocusP);
	lsSet('pomoFocusP', pomoFocusP, 'object');
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
	// remove the TRs, 
	$('.dailyItemTR').remove();
	var dailyList = lsGet('dailyList', 'parse');
	for (d = 0; d < dailyList.length; d++){
		var daily = dailyList[d];
		
		var pomoFocuses = '';
		var maxPomos = parseInt(daily.pomodoros);
		var donePomos = parseInt(daily.donePomos) || 0;
		var remainingPomos = maxPomos - donePomos;
		
		for (p = 0; p < remainingPomos; p++){
			pomoFocuses = pomoFocuses + '<input type="image" src="images/pomoFocusIconSmall.png" alt="Now" class="dailyPomoNow imgIcon" title="<p>Enter <b>Pomodoro</b> mode</p>"/>';
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
	
	savePomoFocus(pomoFocus, 'options');
	
	return
}

function completeDailyPomodoro(daily){
	var now = deltaTime(0).getTime();
	daily.donePomos = daily.donePomos + 1;
	daily.lastUpdate = now;
	if (!daily.completed){ daily.completed = [];}
	daily.completed.push(now);
	updateDailyTask(daily);
	lsDel('dailyPomo');
	restoreDailyList('.dailyContainer');
}

function cancelDailyPomodoro(daily){
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

function removeDailyTask(daily){
	var dailyList = lsGet('dailyList', 'parse');
	var index = dailyTaskIndex(daily);
	
	dailyList.splice(index, 1);
		
	lsSet('dailyList', dailyList, 'object');
}

function renewDailyTask(){
	var dailyList = lsGet('dailyList', 'parse');
	for (d = 0; d < dailyList.length; d++){
		dailyList[d].donePomos = 0;
		dailyList[d].lastUpdate = deltaTime(0).getTime();
	}
	lsSet('dailyList', dailyList, 'object');
}

function syncDailies(page){
	chrome.extension.onMessage.addListener(
		function(request, sender, sendResponse) {
			if (request.action == "DailyTasks" && request.target == page){
				restoreTaskList();
			}
		}
	);
}


/* ***************************************************************** */
/* ***************                                   *************** */
/* ***************             PomoFocus             *************** */
/* ***************                                   *************** */
/* ***************************************************************** */



var lastUpdate = 0;
var PFpromptForce = false;

function shortCount(){
	var pomoFocusB = JSON.parse(localStorage.pomoFocusB);
	pomoFocusB.endTime = deltaTime(5).getTime();
	savePomoFocus(pomoFocusB, 'background');
}

function createPomoFocusCountDown(){
	pomoFocusB = getPomoFocus('background');
	var endDate = dateFromTime(pomoFocusB.endTime);
	
	$('#pomoFocusRemainingTime').countdown(endDate, function(event) {
		$(this).html(event.strftime('%M:%S'));
	})
	.on('finish.countdown', function(event) {
		togglePomodoro("configure");
		PFpromptForce = true;
		lsDel('dailyPomo');
	});
}

function updateCountdown(){
	fixNoEndTime();
	var pomoFocusB = getPomoFocus('background');
	var now = deltaTime(0).getTime();
	
	var clockDiv = $('#pomoFocusRemainingTime');
	var taskSpan = $('#pomoFocusTask');
	
	if (pomoFocusB.endTime > now){
		togglePomodoro('focus');
		$(taskSpan).html("Focusing on <span class='yellow'>" + pomoFocusB.task + "</span>");
		$(clockDiv).countdown(dateFromTime(pomoFocusB.endTime), function(event) {
			$(this).html(event.strftime('%M:%S'));
		})
	}
	else{
		togglePomodoro('configure');
		$(clockDiv).countdown(new Date());
	}
}

function checkForUpdate(){
	var pomoFocusB = getPomoFocus('background');
	
	if (pomoFocusB.lastUpdate > lastUpdate) {
		updateCountdown();
		lastUpdate = pomoFocusB.lastUpdate;
	}
}

function pomoFocusButtons(){
	$("#pomoFocusCompleteTask").click(function(){
		localStorage.endReason = 'done';
		var pomoFocus = getPomoFocus('background');
		if (pomoFocus.daily = true){ // daily tasks pomofocuses
			var dailyList = lsGet('dailyList', 'parse');
			var daily = _.where(dailyList, {id: pomoFocus.taskID});
			if (daily.length == 1){ daily = daily[0]; }
			completeDailyPomodoro(daily);
			restoreDailyList('.dailyContainer');
		}
		else { // Regular tasks pomofocuses
			var taskID = pomoFocus.taskID;
			var itemRow = $("#" + taskID);
			
			if (itemRow.length == 0){ console.log("no Now Task"); return }
			$(itemRow).removeClass("nowTaskRow");
			completeTask(itemRow, true);
			notifyUser("Well done!", focusCompleteMsg, "PFNotify");
		}
		
		togglePomodoro('configure');
		PFpromptForce = false;
		pomoFocus.endTime = new Date().getTime();
		savePomoFocus(pomoFocus, 'options');
		
	});
	
	$("#pomoFocusStop").click(function(){
		localStorage.endReason = 'stop';
		var pomoFocus = getPomoFocus('background');
		PFpromptForce = false;
		pomoFocus.endTime = new Date().getTime();
		pomoFocus.daily = false;
		savePomoFocus(pomoFocus, 'options');
		lsDel('dailyPomo');
		
	});
	
	$("#pomoFocus5minutes").click(function(){
		var pomoFocus = getPomoFocus('background');
		var endTime = pomoFocus.endTime;
		var newEndTime = endTime + 5 * 60 * 1000;
		pomoFocus.endTime = newEndTime;
		
		savePomoFocus(pomoFocus, 'options');
	});

	$("#playBinauralButton").click(function(){
		var pomoFocus = getPomoFocus('background');
		$("#stopBinauralButton").removeClass('noDisplay');
		$("#playBinauralButton").addClass('noDisplay');
		
		pomoFocus.audio = true;
		savePomoFocus(pomoFocus, 'options');
	});
	$("#stopBinauralButton").click(function(){
		$("#playBinauralButton").removeClass('noDisplay');
		$(this).addClass('noDisplay');
		
		var pomoFocus = getPomoFocus('background');
		pomoFocus.audio = false;
		savePomoFocus(pomoFocus, 'options');
		
	});
	$("#vDownBinaural").click(function(){
		alert("v down");
	});
	$("#vUpBinaural").click(function(){
		alert("v up");
	});
}

function togglePomodoro(toState){
	var pomoFocus = getPomoFocus('background');
	
	var confDiv = $("#toDoDiv");
	var focusDiv = $("#pomodoroFocusDiv");
	var hyperControl = $(".hyperFocusControlDiv");
	
	if (toState == 'focus'){
		$(confDiv).addClass('noDisplay');
		$(focusDiv).removeClass('noDisplay');
		
		if ( pomoFocus.hyper == 'true' || pomoFocus.hyper == true) { 
			$(hyperControl).removeClass('noDisplay'); 
		}
		else { $(hyperControl).addClass('noDisplay'); }
	}
	else {
		$(confDiv).removeClass('noDisplay');
		$(focusDiv).addClass('noDisplay');
	}
}

function pomodoroOnSteroids(){
	$("#toDoTable tbody ").on('click', '.nowToDoItem', function(){
		var pomoFocus = getPomoFocus('background');
		
		var item = PFGetClickedRow($(this));
		$(item.Row).addClass("nowTaskRow");
		updateTasksLog();
		
		// Set the pomoFocus Object
		pomoFocus.active		= true;
		pomoFocus.taskID		= item.id;
		pomoFocus.task			= item.Task;
		pomoFocus.silent		= 'promptOnEnd';
		pomoFocus.lastUpdate	= new Date().getTime();
		
		// Prepare the prompt
		var msg = "" + 
			"<p>Lets put some stakes on it. Tell us how long will this take and we will give you the either carrot and the stick. Your choice to do it as you planned!</p>" + 
			"<p>" + 
				"<select id='minutesPomodoro'>" + 
					"<option value='1'>1 minutes</option>" + 
					"<option value='5'>5 minutes</option>" + 
					"<option value='10'>10 minutes</option>" + 
					"<option value='15'>15 minutes</option>" + 
					"<option value='30'>30 minutes</option>" + 
					"<option value='45'>45 minutes</option>" + 
				"</select>" + 
			"</p>" +
			"<div>" + 
				"<p>Want to get hyper focused?</p>" +
				"<p><select id='hyperFocusSelect'>" + 
					"<option id='audioTrue' value='true'>Yes, get me there!</option>" + 
					"<option id='audioFalse' value='false'>No, I'm fine.</option>" + 
				"</select></p>" + 
				"<div class='musicOnly noDisplay'>" + 
					"<p>Great! Get some good earphones and let [[xxx]] audio help you easy into the zone.</p>" + 
					"<p>" + 
						"<video controls='' autoplay='' name='media'>" + 
							"<source src='https://www.youtube.com/watch?v=xGvs6uekFnM' type='audio/mpeg'>" +
						"</video>" +
					"</p>" + 
				"</div>" +
			"</div>"
			
			;
		$.prompt(msg, {
			title: "Great! Let's tackle this!",
			buttons: { "Ready! Let me start": true, "No, I don't want help": false },
			submit: function(e,v,m,f){
				console.log("Enter PomoFocus result was " + v);
				var result = v;
				if (result == true){
					localStorage.pomoFocusDuration = $("#minutesPomodoro").val();
					localStorage.pomoFocusHyper = $("#hyperFocusSelect").val();
					togglePomodoro('focus');
					
					pomoFocus.duration		= parseInt($("#minutesPomodoro").val());
					pomoFocus.endTime		= deltaTime(pomoFocus.duration * 60).getTime();
					pomoFocus.hyper		= $("#hyperFocusSelect").val()
					savePomoFocus(pomoFocus, 'options');
				}
				else{
					delete localStorage.pomoFocusTask;
					$(".nowTaskRow").removeClass("nowTaskRow");
					lsDel('dailyPomo');
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
				addToDoItem($(this).val());
				$(this).val('');
				updateTasksCounter();
				updateTasksLog();
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
	// alert("restoreTaskList on the go");
	checkTaskIDs();
	$(".toDoItemTR").remove()
	
	if (localStorage.ToDoTasks == undefined || localStorage.ToDoTasks == 'null' || localStorage.ToDoTasks == ''){ return }
	
	var TaskList = JSON.parse(localStorage.ToDoTasks);
	var totalTasks = TaskList.length;
	
	// Restore the tasks
	for (t = 0; t < totalTasks ; t++){
		curTask = TaskList[t];
		
		var newItem = addToDoItem(curTask.task, curTask.id);
		
		// Restore Task Today
		var completedDiv = $(newItem).children().children()[0];
		var completedCheckbox = $(completedDiv).children()[0];
		if (curTask.done == true){
			$(completedCheckbox).prop("checked",  curTask.done);
			$(newItem).addClass('doneTaskRow');
		}
		else {
			$(completedCheckbox).prop("checked",  curTask.done);
		}
		var taskDiv = $(newItem).children().children()[1];
		var todayDiv = $(newItem).children().children()[2];
		if (curTask.today == true) { 
			$(newItem).addClass("todayTaskRow");
			$($(todayDiv).children()[1]).removeClass("grayscale");
		}
		else{
			$(newItem).removeClass("todayTaskRow");
			$($(todayDiv).children()[1]).addClass("grayscale");
		}
		var nowDiv = $(newItem).children().children()[2];
		if (curTask.now == true){ $(newItem).addClass("nowTaskRow"); }
	}
	
	updateTasksCounter();
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



function completeTask(taskRow, override){
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
		notifyUser("One down!", "Keep going, you rockstar!", "PFNotify");
		stimuli("vibration", defInt, defAT, focusCompleteMsg);
	}
	
	updateTasksCounter();
	updateTasksLog();
}

function deleteTask(){
	$("#toDoTable tbody ").on('click', '.removeToDoItem', function(){
		var item = PFGetClickedRow($(this));
		var itemRow = item.Row;
		itemRow.remove();
		updateTasksCounter();
		updateTasksLog();
	});
}

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
		completeTask(item.Row);
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
	// msgExt('TaskList', 'background');
	msgExt('TaskList', 'popup');
	msgExt('TaskList', 'options');
}

function updateToDo(changedPart){
	pomoFocusP = readPomoFocus('pomoFocusP');
	pomoFocusO = readPomoFocus('pomoFocusO');
	pomoFocusB = readPomoFocus('pomoFocusB');
	
	if (pomoFocusB.lastUpdate > pomoFocusO.lastUpdate){
		pomoFocusO = pomoFocusB;
		// localStorage.pomoFocusO = JSON.stringify(pomoFocusO);
		savePomoFocus(pomoFocusO);
	}
	// Updates the list and the focus
	
	// Delete all TR. Recreate all TR
	$(".toDoItemTR").remove()
	restoreTaskList();
	// Save last update date
	var now = new Date().getTime();
	console.log("Last update at " + new Date());
	
	// Checks if it is active
	if (pomoFocusO.active == true && pomoFocusO.endTime > now){
		updatePomoFocus(pomoFocusO.endTime, pomoFocusO.task, 'prompt');
		togglePomodoroFocus('focus');
	}
		
	delete localStorage.changedPart;
		
		
		
	
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
	createPomoFocusCountDown();	// Initialize the timer and the on finish events
	deleteTask();				// delete on X
	enableDailyPomoFocus()		// tomatoes from dailies trigger focus
	markTaskToday();			// Tags task for being done/not done today
	pomodoroOnSteroids();		// Now Pomodoro on Steroid mode
	pomoFocusButtons();			// Enables the Done, Stop +5 minutes buttons on Focus Mode
	restoreTaskList();			// Restore from To Do
	restoreDailyList();			// Restore from Dailies
	updateCompletedTasks();		// Complete if checked
	updateTasksCounter();		// Items counter:
	
}

var testInt = setInterval(function(){ 
	checkForUpdate(); 
}, 200);

