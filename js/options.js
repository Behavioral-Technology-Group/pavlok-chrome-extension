﻿/* To-do 
	- Create Pomodoro Focus view
	- Put Pomodoro CountDown on the Background
	- Insert CountDown and Progress Bar for countdown on Options
	- Adjust buttons for the actions
	- Adjust interface on Popup
*/
var RTProdInterval;
/* sandbox */

/* ***************************************************************** */
/* ***************                                   *************** */
/* ***************           To-Do Section           *************** */
/* ***************                                   *************** */
/* ***************************************************************** */

// TO-DO Helpers
function togglePomodoroFocus(toState){
	if (toState == 'focus'){
		$("#pomodoroFocusDiv").removeClass('noDisplay');
		$("#toDoDiv").addClass('noDisplay');
		$("#pomoFocusTask").text("Focusing on ");
		$("#pomoFocusRemainingTime").text("05:00");
	}
	else {
		$("#pomodoroFocusDiv").addClass('noDisplay');
		$("#toDoDiv").removeClass('noDisplay');
	}
}

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
											'<input type="checkbox" class="doneCheckbox" title="Done?"/>' + 
										'</div>' + 
										'<div class="toDoOTaskTD">' + 
											task + 
										'</div>' +
										'<div class="toDoORemoverTD" >' + 
											'<input type="image" src="images/pomoFocusIconSmall.png" alt="Now" class="nowToDoItem imgIcon" title="<p>Enter <b>Pomodoro</b> mode</p>"/>' + 
											'<input type="image" src="images/todayIcon.png" alt="Today" class="todayToDoItem imgIcon" title="<p>You will do it <b>today</b></p>"/>' + 
											'<input type="image" src="images/redXIcon.png" alt="Cancel" class="removeToDoItem imgIcon" title="<p>I will not do it anymore. <b>Remove it</b></p>"/>' + 
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
			"<div class='noDisplay'>" + 
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
					"</p>" + 
				"</div>" +
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
					togglePomodoroFocus('focus');
					alert("Pomodoro start!");
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

/* end of sandbox */

/* ***************************************************************** */
/* ***************                                   *************** */
/* ***************        RESCUETIME SECTION         *************** */
/* ***************                                   *************** */
/* ***************************************************************** */

// Helpers
function changeRTVisibility(){
	APIKey = localStorage.RTAPIKey;
	if (APIKey == undefined || APIKey == 'null' || APIKey == false) {
		$("#RTCodeOnly").removeClass("display").addClass("noDisplay");
		$("#NoRTCodeOnly").addClass("display").removeClass("noDisplay");
		$("#RTAPIKeySpan").text('');
		
	} else {
		$("#RTCodeOnly").addClass("display").removeClass("noDisplay");
		$("#NoRTCodeOnly").removeClass("display").addClass("noDisplay");
		$("#RTAPIKeySpan").text(localStorage.RTAPIKey);
	}
}

function deltaTime(seconds){
	var now = new Date()
	var future = new Date()
	future.setTime(now.getTime() + seconds * 1000)
	
	return future
}

function regressRTHour(deltaMinutes){
	var original = localStorage.Comment;
	var originalDate = [original.split(" ")[8], original.split(" ")[9]];
	
	var year = originalDate[0].split("-")[0];
	var month = originalDate[0].split("-")[1];
	var day = originalDate[0].split("-")[2];
	
	var hours = originalDate[1].split(":")[0];
	var minutes = originalDate[1].split(":")[1];
	var seconds = originalDate[1].split(":")[2];
	var milliseconds = 0;
	
	var d = new Date(year, month, day, hours, minutes, seconds, milliseconds);
	
	var d2 = new Date(d);
	d2.setMinutes(d.getMinutes() + deltaMinutes);
	
	return d2
}

function updateProductivity(){
	RTProdInterval = setInterval(function(){
		if (localStorage.RTOnOffSelect == "On") {
			var beginCycle = regressRTHour(-30);
			var beginHours = beginCycle.getHours() + ":" + beginCycle.getMinutes() + ":" + beginCycle.getSeconds();
			if (parseInt(localStorage.RTPulse) > 0) {
				$("#RTResultsHolder").html("Your Productivity pulse was <b>" + localStorage.RTPulse + "</b>.");
				$("#RTResultsHolder").attr('title', 'Measured from ' + beginHours + " to " + localStorage.RTHour);
			}
			else {
				$("#RTResultsHolder").html("Too little time evaluated from <b>" + localStorage.RTHour + "</b>. Check back in 15 minutes or so.");
				$("#RTResultsHolder").attr('title', 'Measured from ' + beginHours + " to " + localStorage.RTHour);
			}
		}
	}, 3 * 1000);
}

function updateRTLimits(){
	var PosLimitMax = 100;
	// var PosLimitMin = parseInt(localStorage.RTWarnLimit);
	var PosLimitMin = $( "#RTWarnLimit" ).spinner( "value" );
	var PosValue = $( "#RTPosLimit" ).spinner( "value" );
	
	var WarnLimitMax = $( "#RTPosLimit" ).spinner( "value" );
	var WarnLimitMin = $( "#RTNegLimit" ).spinner( "value" );
	var WarnValue = $( "#RTWarnLimit" ).spinner( "value" );
	
	var NegLimitMax = $( "#RTWarnLimit" ).spinner( "value" );
	var NegLimitMin = 0;
	var NegValue = $( "#RTNegLimit" ).spinner( "value" );
	
	// There should be no cross over
	if ( NegLimitMax > WarnLimitMax ) {
		WarnValue = WarnLimitMax;
	}
	
	var PosLimit = $( "#RTPosLimit" ).spinner({
		max: PosLimitMax,
		min: PosLimitMin
	});
	var WarnLimit = $( "#RTWarnLimit" ).spinner({
		max: WarnLimitMax,
		min: WarnLimitMin
	});
	var NegLimit = $( "#RTNegLimit" ).spinner({
		max: NegLimitMax,
		min: NegLimitMin
	});
	
	localStorage.RTPosLimit = PosValue;
	localStorage.RTWarnLimit = WarnValue;
	localStorage.RTNegLimit = NegValue;
	
	return
}

// Enabler
function enableRescueTime(){
	$("#fireRTIntegration").click(function(){
		var APIKey = $("#rescueTimeAPIKey").val();
		localStorage.RTAPIKey = APIKey;
		changeRTVisibility();
	});
	
	if (localStorage.RTPulse && localStorage.RTOnOffSelect) {changeRTVisibility();}
	if (localStorage.RTOnOffSelect == "On") { updateProductivity(); }
	
	$("#RTOnOffSelect").change(function(){
		var RTOnOffSelect = $(this).val();
		localStorage.RTOnOffSelect = RTOnOffSelect;
		if (RTOnOffSelect == "On") { updateProductivity(); }
	});
	
	$( "#RTFrequencySelect" ).change(function(){
		localStorage.RTFrequency = $(this).val()
	});
	
	$("#removeRTAPIKey").click(function() {
		var msg = "Have you been noticing that you receive beeps when you are being unproductive, and vibrations when you are being very productive?<br/><br/>Keeping this integration will help you become a productive, healthy individual. Are you sure you want to disconnect Pavlok from RescueTime?";
		
		var options = {
			
		};
		$.prompt(msg, {
			title: "Your Pavlok will disconnect from RescueTime. But are you sure you want to do that?",
			html: msg,
			defaultButton: 1,
			buttons: { "No, I want to be productive": false, "Yes, disconnect from RescueTime": true },
			submit: function(e,v,m,f){
				console.log("result was " + v);
				var result = v;
				if (result == true){
					delete localStorage.RTAPIKey;
					$("#rescueTimeAPIKey").val('');
					changeRTVisibility();
				}	
			}
		});
	});
	
	// Enable spinners
	var PosLimit = $( "#RTPosLimit" ).spinner({
		min: parseInt(localStorage.RTWarnLimit),
		max: 100,
		page: 10,
		step: 5,
		change: function(event, ui) { 
			updateRTLimits(); 
		}
	});
	
	var WarnLimit = $( "#RTWarnLimit" ).spinner({
		min: parseInt(localStorage.RTNegLimit),
		max: parseInt(localStorage.RTPosLimit),
		page: 10,
		step: 5,
		change: function(event, ui){ updateRTLimits() }
	});
	
	var NegLimit = $( "#RTNegLimit" ).spinner({
		min: 0,
		max: parseInt(localStorage.RTWarnLimit),
		page: 10,
		step: 5,
		change: function(event, ui){ updateRTLimits() }
	});
	
	$(".RTThreshold").change(function(){
		var PosLimitMax = 100;
		var PosLimitMin = parseInt(localStorage.RTPosLimit);
		var PosValue = $( "#RTPosLimit" ).spinner( "value" );
		
		var WarnLimitMax = parseInt(localStorage.RTWarnLimit);
		var WarnLimitMin = parseInt(localStorage.RTNegLimit);
		var WarnValue = $( "#RTWarnLimit" ).spinner( "value" );
		
		var NegLimitMax = parseInt(localStorage.RTNegLimit);
		var NegLimitMin = 0;
		var NegValue = $( "#RTNegLimit" ).spinner( "value" );
		
		// There should be no cross over
		if ( NegLimitMax > WarnLimitMax ) {
			WarnValue = WarnLimitMax;
		}
		
		localStorage.RTPosLimit = PosValue;
		localStorage.RTWarnLimit = WarnValue;
		localStorage.RTNegLimit = NegValue;
		
	});
	
	// Restore values
	$("#RTPosLimit").val(parseInt(localStorage.RTPosLimit));
	$("#RTWarnLimit").val(parseInt(localStorage.RTWarnLimit));
	$("#RTNegLimit").val(parseInt(localStorage.RTNegLimit));
	
	$("#RTPosSti").val(localStorage.RTPosSti);
	$("#RTWarnSti").val(localStorage.RTWarnSti);
	$("#RTNegSti").val(localStorage.RTNegSti);
	
	// Save Values:
	$("#RTPosLimit").change(function(){localStorage.RTPosLimit = $(this).val();});
	$("#RTWarnLimit").change(function(){localStorage.RTPosLimit = $(this).val();});
	$("#RTNegLimit").change(function(){localStorage.RTPosLimit = $(this).val();});
	
	$("#RTPosSti").change(function(){localStorage.RTPosLimit = $(this).val();});
	$("#RTWarnSti").change(function(){localStorage.RTPosLimit = $(this).val();});
	$("#RTNegSti").change(function(){localStorage.RTPosLimit = $(this).val();});

	
}


/* ***************************************************************** */
/* ***************                                   *************** */
/* ***************        AUTOZAPPER SECTION         *************** */
/* ***************                                   *************** */
/* ***************************************************************** */

// Helpers
function enableTimers(){
	$.widget( "ui.timespinner", $.ui.spinner, {
    options: {
      // seconds
      step: 15 * 60 * 1000,
      // hours
      page: 60
    },
 
    _parse: function( value ) {
      if ( typeof value === "string" ) {
        // already a timestamp
        if ( Number( value ) == value ) {
          return Number( value );
        }
        return +Globalize.parseDate( value );
      }
      return value;
    },
 
    _format: function( value ) {
      return Globalize.format( new Date(value), "t" );
    }
  });
 
  $(function() {
    $( "#generalActiveTimeStart" ).timespinner({
		change: function( event, ui ) { localStorage.generalActiveTimeStart = $(this).val();},
	});
    $( "#generalActiveTimeEnd" ).timespinner({
		change: function( event, ui ) { localStorage.generalActiveTimeEnd = $(this).val();}
	});
 
    $( "#timeFormat" ).change(function() {
		var currentStart = $( "#generalActiveTimeStart" ).timespinner( "value" );
		var currentEnd = $( "#generalActiveTimeEnd" ).timespinner( "value" );
		
		var selectedOption = $(this).val();
		if (selectedOption == "24") { culture = "de-DE" }
		else if (selectedOption == "12") { culture = "en-EN"};

		Globalize.culture( culture );
		$( "#generalActiveTimeStart" ).timespinner( "value", currentStart );
		$( "#generalActiveTimeEnd" ).timespinner( "value", currentEnd );
	});
	});
}

function toggleAutoZapperConf(toState){
	if (toState == "configure"){
		$(".autoZapperConf").removeClass("noDisplay");
		$(".autoZapperActive").addClass("noDisplay");
		
	}
	else if (toState == "train"){
		$(".autoZapperActive").removeClass("noDisplay");
		$(".autoZapperConf").addClass("noDisplay");
	}
}

function enableAutoZapper(){
	// var date = new Date(new Date().valueOf() + parseInt(localStorage.trainingSessionZD));
	$('#countDownTraining').countdown(new Date(), function(event) {
		$(this).html(event.strftime('%M:%S'));
	})
	.on('finish.countdown', function(event) {
		$.prompt("Session Finished! Congratulations!");
		clearInterval(localStorage.trainingSession);
		localStorage.trainingSession = 'false';
		localStorage.trainingSessionZI = '';
		localStorage.trainingSessionZD = '';
		localStorage.trainingSessionZF = '';
		
		toggleAutoZapperConf("configure");
		
	});
	
	
	var intensity = $( "#autoZapperIntensity" ).spinner({
		min: 10,
		max: 100,
		page: 10,
		step: 10
	});
	intensity.val(60);

	var duration = $( "#autoZapperDuration" ).spinner({
		min: 1,
		max: 60,
		page: 1,
		step: 1
	});
	duration.val(5);

	var frequency = $( "#autoZapperFrequency" ).spinner({
		min: 2,
		max: 30,
		page: 1,
		step: 1
	});
	frequency.val(5);
	
	$("#autoZapperStart").click(function(){
		$.prompt("Starting <b>zaps on " + intensity.val() + "%</b>...<br />" +
			"for <b>" + duration.val() + " minutes</b><br />"+
			"zapping <b>every " + frequency.val() + " seconds</b>.", {
			title: "Are you Ready?",
			buttons: { "Yes, I'm Ready": true, "No, let me change this": false },
			submit: function(e,v,m,f){
				console.log("result was " + v);
				var result = v;
				if (result == true){
					var zapInt = percentToRaw(parseInt( $("#autoZapperIntensity").val() ));
					var zapFreq = parseInt( $("#autoZapperFrequency").val() ) * 1000;
					var zapDur = parseInt( $("#autoZapperDuration").val() ) * 60 * 1000;

					localStorage.trainingSessionZI = zapInt;
					localStorage.trainingSessionZF = zapFreq;
					localStorage.trainingSessionZD = zapDur;
					
					// Update interface
					toggleAutoZapperConf("train");
					// Start Count Down Timer
					var date = new Date(new Date().valueOf() + parseInt(localStorage.trainingSessionZD));
					$('#countDownTraining').countdown(date, function(event) {
						$(this).html(event.strftime('%M:%S'));
					})
					.on('finish.countdown', function(event) {
						// // // $.prompt("Session Finished! Congratulations!");
						clearInterval(localStorage.trainingSession);
						localStorage.trainingSession = 'false';
						localStorage.trainingSessionZI = '';
						localStorage.trainingSessionZD = '';
						localStorage.trainingSessionZF = '';
						
						toggleAutoZapperConf("configure");
						
					});
					
					var trainingSession = setInterval(function() {
						console.log("Occured at ");
						stimuli("shock", localStorage.trainingSessionZI, localStorage.accessToken, "", "false");
					}, parseInt(localStorage.trainingSessionZF));
					localStorage.trainingSession = trainingSession;
					
					// var endTraining = setTimeout(function(){ 
						// clearInterval(trainingSession);
						// $.prompt("Congratulations! Session is over!");
						// localStorage.trainingSession = 'false';
						// localStorage.trainingSessionZI = '';
						// localStorage.trainingSessionZD = '';
						// localStorage.trainingSessionZF = '';
						
					// }, parseInt(localStorage.trainingSessionZD));
					// localStorage.endTraining = endTraining;
				}	
			}
		});
	});
	
	$("#autoZapperStop").click(function(){
		clearInterval(localStorage.trainingSession);
		$.prompt("Traning session canceled", "Your training session is now over");
		
		toggleAutoZapperConf("configure");
	});
}

function enableSelecatbles(){
	$("#selectable").selectable({
		filter: ".tdSelectable",
		stop: function() {
			var result = $( "#select-result" ).empty();
			$( ".ui-selected", this ).each(function() {
				var index = $( "#selectable td" ).index( this );
				result.append( " #" + ( index + 1 ) );
			});
		}
	});
}

function restoreCheckBox(checkboxID, condition){
	if (condition == 'true' )
		{ $("#" + checkboxID).attr('checked', true); }
	else { $("#" + checkboxID).attr('checked', false); }
}

function percentToRaw(percent){
	// Converts numbers in the 0-100 range to a 0-255 range, rounding it
	/*
	100 - 0 			255 - 0
	percent - 0 		x - 0
	
	100x = 255 * percent
	x = percent * 255 / 100
	*/
	var rawN
	rawN = Math.round(percent * 255 / 100);
	
	return rawN
}

function rawToPercent(raw){
	// Converts numbers in the 0-255 range to a 0-100 range, rounding it to the nearest dezen
	/*
	100 - 0 			255 - 0
	x - 0 				raw - 0
	
	255x = 100 * raw
	x = raw * 100 / 255
	*/
	
	var percN = raw * 100 / 255;
	percN = Math.round(percN / 10) * 10;
	return percN
}


function enableSelects(){
	$("#blackListTimeWindow").change(function(){
		localStorage.timeWindow = $(this).val() ;
	});
}

function enableButtons(){
	$("#resetIntensity").click(function(){
		var defValue = 60;
		
		$( "#sliderZap" ).slider( { "value": defValue });
		$( "#zapIntensity" ).val(defValue);
		localStorage.zapPosition = defValue;
		localStorage.zapIntensity = percentToRaw(defValue);
		
		$( "#sliderVibration" ).slider( { "value": defValue });
		$( "#vibrationIntensity" ).val(defValue);
		localStorage.vibrationPosition = defValue;
		localStorage.vibrationIntensity = percentToRaw(defValue);
	});
	
	$("#test_pairing").click(function(){
		stimuli("vibration", 230, localStorage.accessToken, "Incoming Vibration. You should receive a notification on your phone, followed by a vibration");
	});

	$("#testZapInt").click(function(){
		stimuli("shock", localStorage.zapIntensity, localStorage.accessToken, "Incoming Zap. You should receive a notification on your phone, followed by a zap");
	});
		
	$("#testVibrationInt").click(function(){
		stimuli('vibration', localStorage.vibrationIntensity, localStorage.accessToken, "Incoming Vibration. You should receive a notification on your phone, followed by a vibration");
	});

	$("#signIn").click(function(){
		oauth();
	});

	$("#signOut").click(function(){
		signOut();
	});
	
	$("#rescueTimeOAuth").click(function(){
		rescueTimeOAuth();
	});
}

function enableSpiners() {
	$("#autoZapperIntensity").spiner();
}

function enableTables(){ // TO-do update or remove
	// $('#sundayActiveTimeStart').timepicker({
	// // // // $('.timeSelectors').timepicker({
		// // // // showPeriod: true,
		// // // // showLeadingZero: true
	// // // // });
	
}

function enableSliders(){
	$(function() {
		$( "#sliderZap" ).slider({
			value:60,
			min: 10,
			max: 100,
			step: 10,
			slide: function( event, ui ) {
				$( "#zapIntensity" ).val( ui.value );
				localStorage.zapPosition = ui.value ;
				save_options();
			}
		});
		$( "#zapIntensity" ).val( $( "#sliderZap" ).slider( "value" ) );
		
		$( "#sliderVibration" ).slider({
			value:60,
			min: 10,
			max: 100,
			step: 10,
			slide: function( event, ui ) {
				$( "#vibrationIntensity" ).val( ui.value );
				localStorage.vibrationPosition = ui.value ;
				save_options();
			}
		});
		$( "#vibrationIntensity" ).val( $( "#sliderVibration" ).slider( "value" ) );
		
	});
}

function enableCheckboxes(){
	// Active days
	$("#sundayActive").change(function(){
		localStorage.sundayActive = $(this).prop( "checked" );
	});
	$("#mondayActive").change(function(){
		localStorage.mondayActive = ($(this).prop( "checked" ));
	});
	$("#tuesdayActive").change(function(){
		localStorage.tuesdayActive = $(this).prop( "checked" );
	});
	$("#wednesdayActive").change(function(){
		localStorage.wednesdayActive = $(this).prop( "checked" );
	});
	$("#thursdayActive").change(function(){
		localStorage.thursdayActive = $(this).prop( "checked" );
	});
	$("#fridayActive").change(function(){
		localStorage.fridayActive = $(this).prop( "checked" );
	});
	$("#saturdayActive").change(function(){
		localStorage.saturdayActive = $(this).prop( "checked" );
	});
	$("#eachDay").change( function() {	
		var advanced = $(this).prop( "checked" );
		alert("each Day is " + advanced);
		if ( advanced == true ) { 
			$("#singleDayTimeTR").css("display", "block");
		} else {
			$("#singleDayTimeTR").css("display", "none");
		}
	});	
	
}

function enableInputs(){	
	// Advanced day to day
	$("#sundayActiveTimeStart").change( function() {	
		localStorage.sundayActiveTimeStart = $(this).val();
	});	
		
	$("#sundayActiveTimeEnd").change( function() {	
		localStorage.sundayActiveTimeEnd = $(this).val();
	});	
		
	$("#mondayActiveTimeStart").change( function() {	
		localStorage.mondayActiveTimeStart = $(this).val();
	});	
		
	$("#mondayActiveTimeEnd").change( function() {	
		localStorage.mondayActiveTimeEnd = $(this).val();
	});	
	
	$("#tuesdayActiveTimeStart").change( function() {	
		localStorage.tuesdayActiveTimeStart = $(this).val();
	});	
		
	$("#tuesdayActiveTimeEnd").change( function() {	
		localStorage.tuesdayActiveTimeEnd = $(this).val();
	});	
		
	$("#wednesdayActiveTimeStart").change( function() {	
		localStorage.wednesdayActiveTimeStart = $(this).val();
	});	
		
	$("#wednesdayActiveTimeEnd").change( function() {	
		localStorage.wednesdayActiveTimeEnd = $(this).val();
	});	
		
	$("#thursdayActiveTimeStart").change( function() {	
		localStorage.thursdayActiveTimeStart = $(this).val();
	});	
		
	$("#thursdayActiveTimeEnd").change( function() {	
		localStorage.thursdayActiveTimeEnd = $(this).val();
	});	
		
	$("#fridayActiveTimeStart").change( function() {	
		localStorage.fridayActiveTimeStart = $(this).val();
	});	
		
	$("#fridayActiveTimeEnd").change( function() {	
		localStorage.fridayActiveTimeEnd = $(this).val();
	});	

	$("#saturdayActiveTimeStart").change( function() {	
		localStorage.fridayActiveTimeStart = $(this).val();
	});	
		
	$("#saturdayActiveTimeEnd").change( function() {	
		localStorage.fridayActiveTimeEnd = $(this).val();
	});	
	
}

function saveBlackList(){
	localStorage.blackList = $("#blackList")[0].value;
}

function saveWhiteList(){
	localStorage.whiteList = $("#whiteList")[0].value;
}

function save_options() {
	
	var blackList = $("#blackList")[0].value;
	localStorage.blackList = blackList;
	
	var whiteList = $("#whiteList")[0].value;
	localStorage.whiteList = whiteList;
	
	var maxTabs = $("#maxTabsSelect").val();
	localStorage.maxTabs = maxTabs;
	
	var zapOnClose = $("#zapOnClose").prop('checked');
	localStorage.zapOnClose = zapOnClose;
	
	var zapPosition = $("#zapIntensity").val();
	var zapIntensity = $("#zapIntensity").val();
	zapIntensity = Math.round(parseFloat(zapIntensity) / 100 * 255 ); // convert to 1-255 interval
	localStorage.zapIntensity = zapIntensity;
	
	var vibrationPosition = $("#vibrationIntensity").val();
	var vibrationIntensity = $("#vibrationIntensity").val();
	vibrationIntensity = Math.round(parseFloat(vibrationIntensity) / 100 * 255);
	localStorage.vibrationIntensity = vibrationIntensity;
}

function restore_options() {
	// User name and email
	updateNameAndEmail(localStorage.userName, localStorage.userEmail);
	
	// Black and white lists
	var blackList = localStorage.blackList;
	if (blackList == undefined) { blackList = ' '; }
	$("#blackList").val(blackList);

	
	var whiteList = localStorage.whiteList;
	if (whiteList == undefined) { whiteList = ' '; }
	$("#whiteList").val(whiteList);

	var startHour = localStorage.generalActiveTimeStart;
	$("#generalActiveTimeStart").val(startHour);
	var endHour = localStorage.generalActiveTimeEnd;
	$("#generalActiveTimeEnd").val(endHour);
	
	$("#blackListTimeWindow").val(localStorage.timeWindow)
	
	// Checkboxes
	restoreCheckBox('zapOnClose', localStorage.zapOnClose);
	restoreCheckBox('notifyZap', localStorage.notifyZap);
	restoreCheckBox('notifyVibration', localStorage.notifyVibration);
	restoreCheckBox('notifyBeep', localStorage.notifyBeep);
	
	restoreCheckBox('sundayActive', localStorage.sundayActive);
	restoreCheckBox('mondayActive', localStorage.mondayActive);
	restoreCheckBox('tuesdayActive', localStorage.tuesdayActive);
	restoreCheckBox('wednesdayActive', localStorage.wednesdayActive);
	restoreCheckBox('thursdayActive', localStorage.thursdayActive);
	restoreCheckBox('fridayActive', localStorage.fridayActive);
	restoreCheckBox('saturdayActive', localStorage.saturdayActive);
	
	$("#maxTabsSelect").val(localStorage.maxTabs);

	// Stimuli Intensity
	if (parseInt(localStorage.vibrationPosition) > 0){
		var vibSlider = localStorage.vibrationPosition;
	} else { var vibSlider = 60; }
	$( "#sliderVibration" ).slider( { "value": vibSlider })
	$( "#vibrationIntensity" ).val(vibSlider);
	
	if (parseInt(localStorage.zapIntensity) > 0){
		var zapSlider = Math.round(parseInt(localStorage.zapIntensity) * 100 / 2550) * 10;
	} else { var zapSlider = 60; }
	$( "#sliderZap" ).slider( { "value": zapSlider })
	$( "#zapIntensity" ).val(zapSlider);
	
	// Rescue Time
	$("#RTOnOffSelect").val(localStorage.RTOnOffSelect);
	changeRTVisibility();
	
}

// Create the vertical tabs
function initialize() {
	
	// Black and WhiteLists
	var blackListContent = localStorage.blackList;
	
	var bl = document.getElementById("blackList");
	if (bl) {
		$('#blackList')[0].value = localStorage["blackList"];
		$('#blackList').tagsInput({
			'onChange' : saveBlackList,
			'defaultText':'Add site',
			'removeWithBackspace' : true
		});
	
	}
	
	var wl = document.getElementById("blackList");
	if (wl) {
		$('#whiteList')[0].value = localStorage["whiteList"];
		$('#whiteList').tagsInput({
			'onChange' : saveWhiteList,
			'defaultText':'Add site',
			'removeWithBackspace' : true
		});
	}
	
	// Create tabs
	$(function() {
		$( "#tabs" ).tabs().addClass( "ui-tabs-vertical ui-helper-clearfix" );
		$( "#tabs li" ).removeClass( "ui-corner-top" ).addClass( "ui-corner-left" );
		// $( ".tabsLi")
	});
	
	
	// Add listeners for Auto save when options change
	$("#zapOnClose").change(function(){
		localStorage.zapOnClose = $(this).prop( "checked" );
	});
	
	// Notifications before stimuli
	$("#notifyZap").change(function(){
		localStorage.notifyZap = $(this).prop( "checked" );
	});

	$("#notifyVibration").change(function(){
		localStorage.notifyVibration = $(this).prop( "checked" );
	});

	$("#notifyBeep").change(function(){
		localStorage.notifyBeep = $(this).prop( "checked" );
	});
	
	// Max Tabs
	$("#maxTabsSelect").change(function(){
		localStorage.maxTabs = $(this).val();
	});
	$("#zapIntensity").change(function(){
		localStorage.zapPosition = $(this).val();
		localStorage.zapIntensity = percentToRaw(parseInt($(this).val()));
	});
	$("#vibrationIntensity").change(function(){
		localStorage.vibrationPosition = $(this).val();
		localStorage.vibrationIntensity = percentToRaw(parseInt($(this).val()));
	});
	
	// Both white and Blacklist listeners aren't working.
	$("#whiteList").change(function(){
		localStorage.whiteList = $(this).val();
		alert("changed white list");
	});
	$("#blackList").children().change(function(){
		localStorage.blackList = $(this).val();
		alert("changed black list");
	});
	
	// Enablers]
	enableSelects();
	enableSelecatbles();
	enableTimers();
	enableAutoZapper();
	enableTooltips();
	enableButtons();
	enableSliders();
	enableTables();
	enableCheckboxes();
	enableInputs();
	enableRescueTime();
	enableToDo();
	
	$(".allCaps").text().toUpperCase();
	
	var serverKind = localStorage.baseAddress;
	serverKind = serverKind.split("-")[1].split(".")[0];
	$("#server").text(serverKind);
	$(".linked")
		.click( 
			function() {
				$("a", this).click(); // Gotta fix this to remove the circular loop
			});
}


if ( localStorage.blackList == undefined ) { localStorage.blackList = " "; };
if ( localStorage.whiteList == undefined ) { localStorage.whiteList = " "; };
if ( localStorage.maxTabs == undefined ) { localStorage.maxTabs = 6; }
initialize();

$( document ).ready(function() {
	restore_options();
	if (localStorage.logged == 'true') { 
		$(".onlyLogged").css('visibility', 'visible');
		$(".onlyUnlogged").css('display', 'none');
	}
	
	// Fill user Data
	if (!localStorage.userName){
		userInfo(localStorage.accessToken)
	}
	if (localStorage.userName == undefined) {localStorage.userName = ' '; }
	// else {
		$('#userEmailSettings').html(localStorage.userEmail);
		$('#userName').html(" " + localStorage.userName);
		
	// }
	
});