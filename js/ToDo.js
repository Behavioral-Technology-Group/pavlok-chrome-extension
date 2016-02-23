/* ***************************************************************** */
/* ***************                                   *************** */
/* ***************           To-Do Section           *************** */
/* ***************                                   *************** */
/* ***************************************************************** */

if (!localStorage.pomoFocusO) { 
	var pomoFocusO = {}
	pomoFocusO.lastUpdate = new Date().getTime();
	localStorage.pomoFocusO = JSON.stringify(pomoFocusO);
}
if (!localStorage.pomoFocusB) { 
	var pomoFocusB = {}
	pomoFocusB.lastUpdate = new Date().getTime();
	localStorage.pomoFocusB = JSON.stringify(pomoFocusB);
}
if (!localStorage.pomoFocusP) { 
	var pomoFocusP = {}
	pomoFocusP.lastUpdate = new Date().getTime();
	pomoFocusP.endTime = timeDelta(0).getTime();
	localStorage.pomoFocusP = JSON.stringify(pomoFocusP);
}

// PomoFocus
var lastUpdate = 0;
var PFpromptForce = false;

function createPomoFocusCountDown(){
	pomoFocusB = getPomoFocus('background');
	var endDate = dateFromTime(pomoFocusB.endTime);
	
	$('#pomoFocusRemainingTime').countdown(endDate, function(event) {
		$(this).html(event.strftime('%M:%S'));
	})
	.on('finish.countdown', function(event) {
		togglePomodoro("configure");
		PFpromptForce = true;
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
		var itemRow = $(".nowTaskRow");
		if (itemRow.length == 0){ console.log("no Now Task"); return }
		$(itemRow).removeClass("nowTaskRow");
		completeTask(itemRow, true);
		notifyUser("Well done!", focusCompleteMsg, "PFNotify");
		
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
		savePomoFocus(pomoFocus, 'options');
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
		
		if ( pomoFocus.hyper == 'true' ) { $(hyperControl).removeClass('noDisplay'); }
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
				}
				updateTasksLog();
			}
		});
		
	});
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
	// alert("restoreTaskList on the go");
	if (localStorage.ToDoTasks == undefined || localStorage.ToDoTasks == 'null' || localStorage.ToDoTasks == ''){ return }
	
	var TaskList = JSON.parse(localStorage.ToDoTasks);
	var totalTasks = TaskList.length;
	
	// Restore the tasks
	for (t = 0; t < totalTasks ; t++){
		var newItem = addToDoItem(TaskList[t].task);
		
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
	
}

var testInt = setInterval(function(){ 
	checkForUpdate(); 
}, 200);

