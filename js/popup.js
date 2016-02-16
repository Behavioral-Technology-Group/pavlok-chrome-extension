/* To-do

*/

/* ***************************************************************** */
/* ***************                                   *************** */
/* ***************           To-Do Section           *************** */
/* ***************                                   *************** */
/* ***************************************************************** */

// PomoFocus
function cancelPomoFocus(){
	// Background will check for this
	delete localStorage.pomoFocusSession;
	delete localStorage.endPomoFocusTime;
	
	// Stop / End countdown
	PFpromptForce = false;
	$('#pomoFocusRemainingTime').countdown(new Date());
	
	// Return to general screen
	PFpromptForce = true;
	togglePomodoroFocus("configure");
}

function createPomoFocusCountDown(){
	$('#pomoFocusRemainingTime').countdown(new Date(), function(event) {
		$(this).html(event.strftime('%M:%S'));
	})
	.on('finish.countdown', function(event) {
		var msg = "If you're really close, try it for 5 more minutes.";
		if (PFpromptForce == true){
			$.prompt(msg, {
				title: "Focus Session Finished! Did you finish your task?",
				html: "If you're really close, try it for 5 more minutes.",
				defaultButton: 1,
				buttons: { "Yes, I just made it!": true, "No, zap me out of distraction!": false },
				submit: function(e,v,m,f){
					console.log("result was " + v);
					var result = v;
					if (result == true){
						cancelPomoFocus();
						notifyUser("Well done!", "Keep the zone going, you rock star!", "PFNotify");
						stimuli("vibration", defInt, defAT, "Productivity rocks!");
					}
					else{
						notifyUser("Ouch, folk!", "Let's try some more focus next time!", "PFNotify");
						stimuli("shock", "", "", "PomoFocus timed out.");
					}
				}
			});
		}
		clearInterval(localStorage.pomoFocusSession);
		localStorage.pomoFocusSession = 'false';
		localStorage.trainingSessionZF = '';
		
		togglePomodoroFocus("configure");
		PFpromptForce = true;
	});
}

function hyperFocus(){
	$("#hyperFocusSelect").change(function(){
		
	});
}

function pomodoroOnSteroids(){
	$("#toDoTable tbody ").on('click', '.nowToDoItem', function(){
		var item = PFGetClickedRow($(this));
		localStorage.pomoFocusTask = item.Task;
		$(item.Row).addClass("nowTaskRow");
		updateTasksLog();
		
		var msg = "" + 
			"<p>Lets put some stakes on it. Tell us how long will this take and we will give you the either carrot and the stick. Your choice to do it as you planned!</p>" + 
			"<p>" + 
				"<select id='minutesPomodoro'>" + 
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
			html: msg,
			defaultButton: 1,
			buttons: { "Ready! Let me start": true, "No, I don't want help": false },
			submit: function(e,v,m,f){
				console.log("Enter PomoFocus result was " + v);
				var result = v;
				if (result == true){
					localStorage.pomoFocusDuration = $("#minutesPomodoro").val();
					localStorage.pomoFocusHyper = $("#hyperFocusSelect").val();
					togglePomodoroFocus('focus');
				}
				else{
					delete localStorage.pomoFocusTask;
					$(".nowTaskRow").removeClass("nowTaskRow");
				}
				updateTasksLog();
			}
		});
		
	});
}

function pomoFocusButtons(){
	$("#pomoFocusCompleteTask").click(function(){
		var itemRow = $(".nowTaskRow");
		if (itemRow.length == 0){ console.log("no Now Task"); return }
		$(itemRow).removeClass("nowTaskRow");
		completeTask(itemRow, true);
		notifyUser("Well done!", focusCompleteMsg, "PFNotify");
		cancelPomoFocus();
	});
	
	$("#pomoFocusStop").click(function(){
		var msg = "Your focus session will be over if you continue.";
		$.prompt(msg, {
			title: "Are you sure you want to stop being productive?",
			// html: "Your focus session will be over if you continue.",
			defaultButton: 1,
			buttons: { "No, I'm gonna finish this!": false, "Yes, I'll flint": true },
			submit: function(e,v,m,f){
				console.log("Cancel PomoFocus result was " + v);
				var result = v;
				if (result == true){
					cancelPomoFocus();
				}
				else{
					// do nothing
				}
			}
		});
	});
	
	$("#pomoFocus5minutes").click(function(){
		var oldTime = parseInt(localStorage.endPomoFocusTime);
		var oldDate = new Date();
		oldDate.setTime(oldTime);
		
		var newDate = new Date();
		newDate = deltaTime(5 * 60, oldDate);
		localStorage.endPomoFocusTime = newDate.getTime();
		
		$('#pomoFocusRemainingTime').countdown(newDate, function(event) {
			$(this).html(event.strftime('%M:%S'));
		});
		
	});
}

function restorePomoFocus(){
	if ( localStorage.endPomoFocusTime ){
		// Checks if it should still be active
		endPomoFocusTime = parseInt(localStorage.endPomoFocusTime);
		if ( endPomoFocusTime > new Date().getTime() ){
			// Restores the PomoFocus
			togglePomodoroFocus('focus', 'restore');
			$( "#tabs" ).tabs( "option", "active", 2 );
			
		}
		else {
			// Forgets the PomoFocus and clear variables
			cancelPomoFocus();
		}
	}
}

function togglePomodoroFocus(toState, restoration){
	if (!restoration) { var restoration = false; }
	
	if (toState == 'focus'){
		$("#pomodoroFocusDiv").removeClass('noDisplay');
		$("#toDoDiv").addClass('noDisplay');
		
		startPomoFocus(restoration);
	}
	else {
		$("#pomodoroFocusDiv").addClass('noDisplay');
		$("#toDoDiv").removeClass('noDisplay');
	}
}

function startPomoFocus(restoration){
		$("#pomoFocusTask").html("Focusing on <span class='yellow'>" + localStorage.pomoFocusTask + "</span>");
		
		if (restoration == 'restore'){
			endTime = parseInt(localStorage.endPomoFocusTime);
			localStorage.endPomoFocusTime = endTime;
		}
		else {
			endTime = deltaTime(parseInt(localStorage.pomoFocusDuration) * 60).getTime();
			localStorage.endPomoFocusTime = endTime;
		}
		
		$('#pomoFocusRemainingTime').countdown(endTime, function(event) {
			$(this).html(event.strftime('%M:%S'));
		});
		
		if (localStorage.pomoFocusHyper == 'true') {
			$(".hyperFocusControlDiv").removeClass("noDisplay");
		} else { $(".hyperFocusControlDiv").addClass("noDisplay"); }
}

function endPomoFocus(silent){
	
}

// List Display Handling
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

function addToDoItem(task){
	var newLine = '<tr class="toDoItemTR">' +
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
	if (localStorage.ToDoTasks == undefined || localStorage.ToDoTasks == 'null' || localStorage.ToDoTasks == ''){ return }
	
	var TaskList = JSON.parse(localStorage.ToDoTasks);
	var totalTasks = TaskList.length;
	
	// Restore the tasks
	for (t = 0; t < totalTasks ; t++){
		var newItem = addToDoItem(TaskList[t].task);

		// PFGetClickedRow(newItem);
		
		// Restore Task Today
		var completedDiv = $(newItem).children().children()[0];
		var completedCheckbox = $(completedDiv).children()[0];
		if (TaskList[t].done == true){
			$(completedCheckbox).prop("checked",  TaskList[t].done);
			$(newItem).addClass('doneTaskRow');
		}
		else {
			$(completedCheckbox).prop("checked",  TaskList[t].done);
		}
		var taskDiv = $(newItem).children().children()[1];
		var todayDiv = $(newItem).children().children()[2];
		if (TaskList[t].today == true) { 
			$(newItem).addClass("todayTaskRow");
			$($(todayDiv).children()[1]).removeClass("grayscale");
		}
		else{
			$(newItem).removeClass("todayTaskRow");
			$($(todayDiv).children()[1]).addClass("grayscale");
		}
		var nowDiv = $(newItem).children().children()[2];
		if (TaskList[t].now == true){ $(newItem).addClass("nowTaskRow"); }
	}
	
	updateTasksCounter();
}


// Task Status Handling
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

// Backend
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
		
		newTask.task = itemTask;
		newTask.done = itemDone;
		newTask.today = itemToday;
		newTask.now = itemNow;
		
		tasks.push(newTask);
	}
	localStorage.ToDoTasks = JSON.stringify(tasks);
	// console.log(tasks);
}


// TO-DO enabler
function enableToDo(){
	
	// Enablers
	addToDoOnEnter();			// Add item on Enter
	activateTaskFilterButtons();	// Filters like All, Today and Done
	clearCompletedTasks();		// Clear Completed
	createPomoFocusCountDown();	// Initialize the timer and the on finish events
	deleteTask();				// delete on X
	markTaskToday();			// Tags task for being done/not done today
	pomodoroOnSteroids();		// Now Pomodoro on Steroid mode
	pomoFocusButtons();			// Enables the Done, Stop +5 minutes buttons on Focus Mode
	restoreTaskList();			// Restore items
	updateCompletedTasks();		// Complete if checked
	updateTasksCounter();		// Items counter:
	
	// Check for active PomoFocus
	restorePomoFocus();
}




function showName(){
	// Tries the code against API
	$.get(localStorage.baseAddress + '/api/v1/me?access_token=' + accessToken)
	.done(function () {
		console.log("GOOD token. Works on API.");
		return true
	})
	.fail(function(){
		console.log("BAD token. Fails on API.");
		return false
	});
}

function showOptions(accessToken){
	if (isValid(localStorage.accessToken)){
		$(".onlyLogged").css('visibility', 'visible'); 
		$(".onlyUnlogged").css('display', 'none'); 
	}
	else { 
		$(".onlyLogged").css('visibility', 'hidden'); 
		$(".onlyUnlogged").css('display', 'block'); 
	}
}

$( document ).ready(function() {
	enableTooltips();
	// enableToDo();
	if ( !localStorage.userName ) { userInfo(localStorage.accessToken); }
	if ( localStorage.userName ) { updateNameAndEmail(localStorage.userName, localStorage.userEmail); }
	
	// $("#signIn").click(function(){
		// oauth();
	// });
	
	$("#signOut").click(function(){
		signOut();
	});
	
	$("#beepTest").click(function(){ 
		stimuli('beep', localStorage.beepTune, localStorage.accessToken, "You'll get a Beep and a notification on your phone", 'false'); 
	});
	$("#vibrateTest").click(function(){ stimuli('vibration', localStorage.vibrationIntensity, localStorage.accessToken, "You'll get a Vibration and a notification on your phone", 'false'); });
	$("#zapTest").click(function(){stimuli('shock', localStorage.zapIntensity, localStorage.accessToken, "You'll get a Zap and a notification on your phone", 'false'); });
	
	// Restore Max Tabs
	$("#maxTabsSelect").val(localStorage.maxTabs);
	$("#maxTabsSelect").change(function(){
		localStorage.maxTabs = $(this).val();
	});
	
	// Restore values for Black and White Lists along with enabling tags
	$('#blackList')[0].value = localStorage["blackList"];
	$('#blackList').tagsInput({
		'onChange' : saveBlackList,
		'defaultText':'Add site',
		'removeWithBackspace' : true
	});
	
	$('#whiteList')[0].value = localStorage["whiteList"];
	$('#whiteList').tagsInput({
		'onChange' : saveWhiteList,
		'defaultText':'Add site',
		'removeWithBackspace' : true
	});

	$("#test_pairing").click(function(){
		stimuli("vibration", 230, localStorage.accessToken, "Incoming Vibration. You should receive a notification on your phone, followed by a vibration");
	});
	
	if (localStorage.logged == 'true') {
		// Toggle visibility for options
		$(".onlyLogged").css('visibility', 'visible');
		$(".onlyUnlogged").css('display', 'none');
	}
	
});