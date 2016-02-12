/* ***************************************************************** */
/* ***************                                   *************** */
/* ***************           To-Do Section           *************** */
/* ***************                                   *************** */
/* ***************************************************************** */

// TO-DO Helpers
function activateTaskFilterButtons(){
	// Filter tasks: ALL
	$("#allToDoLink").click(function(){
		$( "#toDoTable tbody > tr").removeClass('noDisplay');
	});
	
	// Filter tasks: TODAY
	
	
	// Filter tasks: DONE
	$("#doneToDoLink").click(function(){
		$( "#toDoTable tbody > tr:not(.doneTaskRow)" ).addClass('noDisplay');
		$( "#toDoTable tbody > tr.doneTaskRow" ).removeClass('noDisplay');
	});
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

function addToDoItem(task){
	var newLine = '<tr class="toDoItemTR">' +
									'<td colspan="5">' +
										'<div class="toDoOKerTD">' +
											'<input type="checkbox" class="doneCheckbox"/>' + 
										'</div>' + 
										'<div class="toDoOTaskTD">' + 
											task + 
										'</div>' +
										'<div class="toDoORemoverTD">' + 
											'<input type="button" value="N" class="nowToDoItem" />' + 
											'<input type="button" value="T" class="todayToDoItem" />' + 
											'<input type="button" value="X" class="removeToDoItem" />' + 
										'</div>' + 
									'</td>'
	;
	$('#toDoTable > tbody').append(newLine);
	var newTR = $('#toDoTable > tbody > tr').last();
	
	return newTR
}

function clearCompletedTasks(){
	$("#clearToDoLink").click(function(){
		$( "#toDoTable tbody > tr.doneTaskRow" ).remove();
		updateTasksLog();
	});
}

function deleteTask(){
	$("#toDoTable tbody ").on('click', '.removeToDoItem', function(){
		var itemRow = $(this).parent().parent().parent();
		itemRow.remove();
		updateTasksCounter();
		updateTasksLog();
	});
}

function pomodoroOnSteroids(){
	$("#toDoTable tbody ").on('click', '.nowToDoItem', function(){
		var itemRow = $(this).parent().parent().parent();
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
			"<p>Want to get hyper focused?</p>" +
			"<p><select id='audioSelectPomodoro'>" + 
				"<option id='audioTrue' value='music'>Yes, get me there!</option>" + 
				"<option id='audioFalse' value='silence'>No, I'm fine.</option>" + 
			"</select></p>" + 
			"<div class='musicOnly noDisplay'>" + 
				"<p>Great! Get some good earphones and let [[xxx]] audio help you easy into the zone.</p>" + 
				"<p>" + 
					"<video controls='' autoplay='' name='media'>" + 
						"<source src='https://www.youtube.com/watch?v=xGvs6uekFnM' type='audio/mpeg'>" +
					"</video>" +
				"</p>"
			"</div>"
			
			;
		$.prompt(msg, {
			title: "Great! Let's tackle this!",
			html: msg,
			defaultButton: 1,
			buttons: { "Ready! Let me start": true, "No, I don't want help": true },
			submit: function(e,v,m,f){
				console.log("result was " + v);
				var result = v;
				if (result == true){
					
				}	
			}
		});
		
	});
}

function restoreTaskList(){
	var TaskList = JSON.parse(localStorage.ToDoTasks);
	var totalTasks = TaskList.length;
	
	// Restore the tasks
	for (t = 0; t < totalTasks ; t++){
		var z = addToDoItem(TaskList[t].task);
		// Restore Task Today
		var completedDiv = $(z).children().children()[0];
		var completedCheckbox = $(completedDiv).children()[0];
		if (TaskList[t].done == true){
			$(completedCheckbox).prop("checked",  TaskList[t].done);
			$(z).addClass('doneTaskRow');
		}
		else {
			$(completedCheckbox).prop("checked",  TaskList[t].done);
		}
		var taskDiv = $(z).children().children()[1];
		var todayDiv = $(z).children().children()[2];
		var nowDiv = $(z).children().children()[2];
		console.log(z);
	}
	
	updateTasksCounter();
}

function updateCompletedTasks(){
	$("#toDoTable tbody ").on('change', '.doneCheckbox', function(){
		var done = ($(this).prop( "checked" ) == true);
		var itemRow = $(this).parent().parent().parent();
		var task = itemRow.children().children()[1];
		
		if (done == true){ 
			$(task).addClass('doneTask'); 
			$(itemRow).addClass('doneTaskRow');
			stimuli("vibration")
		}
		else { 
			$(task).removeClass('doneTask'); 
			$(itemRow).removeClass('doneTaskRow');
		}
		updateTasksCounter();
		updateTasksLog();
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

function hyperFocus(){
	$("#audioSelectPomodoro").change(function(){
		
	});
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
		var itemToday = '';
		var itemNow = '';
		
		newTask.task = itemTask;
		newTask.done = itemDone;
		newTask.today = itemToday;
		newTask.now = itemNow;
		
		tasks.push(newTask);
	}
	localStorage.ToDoTasks = JSON.stringify(tasks);
	console.log(tasks);
}

// TO-DO enabler
function enableToDo(){
	// Enablers
	addToDoOnEnter();			// Add item on Enter
	activateTaskFilterButtons();	// Filters like All, Today and Done
	clearCompletedTasks();		// Clear Completed
	deleteTask();				// delete on X
	pomodoroOnSteroids();		// Now Pomodoro on Steroid mode
	restoreTaskList();			// Restore items
	updateCompletedTasks();		// Complete if checked
	updateTasksCounter();		// Items counter:
}

