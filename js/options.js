/* To-do 
*/

var focusCompleteMsg = "Keep the zone going, you rock star!";
var focusStopMsg = ''; 
var defInt = '';			// Use default intensity for stimuli
var defAT = '';				// Use default Access Token for stimuli
var PFpromptForce = false;
var RTProdInterval;
var checkInterval;
var toDoChecker;

/* sandbox */


/* end of sandbox */

/* ***************************************************************** */
/* ***************                                   *************** */
/* ***************           TO-DO SECTION           *************** */
/* ***************                                   *************** */
/* ***************************************************************** */

// fill the daily tasks listStyleType
function fillDailyList(){
	$('.dailyListTR').remove()
	var dailyList = lsGet('dailyList', 'parse');
	for (d = 0; d < dailyList.length; d++ ) {
		var daily = dailyList[d];
		var speciaList;
		if (daily.specialList == true) { specialList = 'Using'; }
		else { specialList = 'Not Using'; }
		
		var newLine = '' +
			'<tr id="daily' + daily.id + '" class="dailyListTR">' +
				'<td>' + daily.task 		+ '</td>' + 
				'<td>' + daily.pomodoros 	+ '</td>' +
				'<td>' + specialList 		+ '</td>' +
			'</tr>';
			
		$('#dailyListTable > tbody').append(newLine);
	}
}

function listenDailyListClick(){
	$("#dailyListTable tbody ").on('click', '.dailyListTR', function(){
		var clickedId = $(this).attr('id');
		var dailyId = clickedId.split('y')[1];
		
		expandDailyDetails(dailyId);
	});
	
	$("#saveDaily").click(function(){
		$( "#dailyListDetailsDIV" ).toggle( 'blind', {}, 300 );
		gatherDailyInfo()
		fillDailyList();
	});
	
	$("#deleteDaily").click(function(){
		var dailyId = parseInt($('#dailyTaskIdInput').val());
		var daily = dailyFromId(dailyId);
		var dailyList = lsGet('dailyList', 'parse');
		var index = dailyTaskIndex(daily);
		dailyList.splice(index, 1);
		
		lsSet('dailyList', dailyList, 'object');
		fillDailyList();
		$( "#dailyListDetailsDIV" ).toggle( 'blind', {}, 300 );
	});
		
	$("#createNewDailyTaskButton").click(function(){
		var newTaskName = $("#newDailyTaskInput").val()
		if (newTaskName.length > 0 && newTaskName != " "){
			$('#newDailyTaskInput').val('');
			var newDaily = addDailyTask(newTaskName);
			fillDailyList();
			expandDailyDetails(newDaily.id)
		} else{
			
		}
	});

	$("#testBinaural").click(function(){
		sampleBinaural();
	});
	
}

function expandDailyDetails(dailyId){
	$( "#dailyListDetailsDIV" ).toggle( 'blind', {}, 300 );
	
	var dailyId = parseInt(dailyId);
	var daily = dailyFromId(dailyId)
	
	if (daily == false ) { return }
	
	var id 			= daily.id || parseInt(lsGet('lastDailyID')) + 1;
	var task 		= daily.task || '';
	var pomodoros	= daily.pomodoros 	|| '1';
	var duration	= daily.duration 	|| '15';
	var specialList = daily.specialList || false;
	var blackList	= daily.blackList 	|| ' ';
	var whiteList	= daily.whiteList 	|| ' ';
	var binaural	= daily.binaural 	|| false;
	var instaZap	= daily.instaZap 	|| false;
	var description	= daily.description || '';
	
	// Fill fields
	$('#dailyTaskTitleSpan').html(task);
	
	$('#dailyTaskIdInput')	.val(id);
	$('#dailyTaskNameInput').val(task);
	$('#pomosPerDaySelect')	.val(pomodoros);
	$('#dailyPomoDuration')	.val(duration);
	$('#specialListsInput')	.prop('checked', specialList);
	$('#blackListDaily')	.importTags(blackList);
	$('#whiteListDaily')	.importTags(whiteList);
	$('#binauralDaily')		.prop('checked', binaural);
	$('#instaZapDaily')		.prop('checked', instaZap);
	$('#dailyDescriptionInput').val(description);
	
}

function gatherDailyInfo(){
	var newDaily = {};
	newDaily.id				= parseInt($('#dailyTaskIdInput').val());
	newDaily.task 			= $('#dailyTaskNameInput').val();
	newDaily.pomodoros 		= $('#pomosPerDaySelect').val();
	newDaily.duration 		= $('#dailyPomoDuration').val();
	newDaily.specialList	= $('#specialListsInput').prop('checked')
	newDaily.blackList 		= $('#blackListDaily').val();
	newDaily.whiteList 		= $('#whiteListDaily').val();
	newDaily.binaural 		= $('#binauralDaily').prop('checked');
	newDaily.instaZap 		= $('#instaZapDaily').prop('checked');
	newDaily.description 	= $('#dailyDescriptionInput').val();
	newDaily.hyper			= true;
	
	updateDailyTask(newDaily);
}
	
function enableBlackDaily(){
	$('#blackListDaily')[0].value = ' ';
	$('#blackListDaily').tagsInput({
		'defaultText':'Add site',
		'removeWithBackspace' : true
	});
	$('#blackListDaily_tagsinput').attr('style', '');
	
	
	$('#whiteListDaily')[0].value = '';
	$('#whiteListDaily').tagsInput({
		'defaultText':'Add site',
		'removeWithBackspace' : true
	});
	$('#whiteListDaily_tagsinput').attr('style', '');
}

function enableDaily(){
	fillDailyList();
	listenDailyListClick();
	
}
// 

/* ***************************************************************** */
/* ***************                                   *************** */
/* ***************        RESCUETIME SECTION         *************** */
/* ***************                                   *************** */
/* ***************************************************************** */

// Helpers
function changeRTVisibility(){
	APIKey = localStorage.RTAPIKey;
	if (APIKey == undefined || APIKey == 'null' || APIKey == false) {
		$("#RTCodeOnly").addClass("noDisplay");
		$("#NoRTCodeOnly").removeClass("noDisplay");
		$("#RTAPIKeySpan").text('');
		
	} else {
		$("#RTCodeOnly").removeClass("noDisplay");
		$("#NoRTCodeOnly").addClass("noDisplay");
		$("#RTAPIKeySpan").text(localStorage.RTAPIKey);
	}
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

	changeRTVisibility();
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
		lsSet('timeFormat', $(this).val());
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
						stimuli("shock", localStorage.trainingSessionZI, defAT, "Training Session. Keep going!", "false");
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



/* ***************************************************************** */
/* ***************                                   *************** */
/* ***************        ALL AROUND SECTION         *************** */
/* ***************                                   *************** */
/* ***************************************************************** */

function enableSignInOut(){
	$("#signOutX").click(function(){
		if (isValid(localStorage.accessToken)){
			signOut();
		}
		else {
			oauth(localStorage.accessToken);
		}
	});
}

function adjustSliders(curPos, fixedHeader){
	var sliders = [$("#sliderBeep"), $("#sliderVibration"), $("#sliderZap"), $("#autoZapperStartLine"), $("#RTPosTR"), $("#RTWarnTR"), $("#RTNegTR")];
	var slidersH = [];
	
	fixedHeader = 186; // header height and margins
	
	for (s = 0; s < sliders.length; s++ ){
		var curSlider = sliders[s];
		var curH = curSlider.offset().top;
		
		if (curPos > curH - fixedHeader){
			$(curSlider).css("visibility", "hidden");
		}
		else {
			$(curSlider).css("visibility", "visible")
		}
	}
	
}

function adjustSpinners(curPos, fixedHeader){
	var spinners = [$("#RTPosTR"), $("#RTWarnTR"), $("#RTNegTR")];
	var spinnersH = [];
	
	fixedHeader = 186; // header height and margins
	
	for (s = 0; s < spinnersH.length; s++ ){
		var curSpinner = spinners[s];
		var curH = curSlider.offset().top;
		
		if (curPos > curH - fixedHeader){
			$(curSpinner).css("visibility", "hidden");
		}
		else {
			$(curSpinner).css("visibility", "visible")
		}
	}
}

function highlightActiveSection(curPos){
	
		
	var tops = [
		$("#blackListContainerDiv").offset().top,
		$("#tabNumbersContainerDiv").offset().top,
		$("#stimuliContainerDiv").offset().top,
		$("#toDoContainerDiv").offset().top,
		$("#appIntegrationsContainerDiv").offset().top,
		$("#advancedOptionsContainerDiv").offset().top,
	];
	
	var sections = [
		"blackList",
		"tabNumbers",
		"stimuli",
		"toDo",
		"appIntegrations",
		"advancedOptions",
	]
	var fixedHeaderHeight = $("#fixedHeader").height();
	var fixedHeaderPadding = $("#fixedHeader").css("padding").split("p")[0];
	fixedHeaderPadding = parseInt(fixedHeaderPadding);
	
	var fixedHeaderSize = fixedHeaderHeight + fixedHeaderPadding;
	var visiblePos = curPos + fixedHeaderSize;
	
	var difs = [];
	// Checks which one have already been passed by
	for (n = 0; n < tops.length; n++){
		difs.push(tops[n] - visiblePos);
	}
	
	var passed = _.countBy(difs, function(num) {
		return num <= 0 ? 'reached': 'ahead';
	});
	
	if (passed.ahead == sections.length) { passed.reached = 1;}
	
	var active = passed.reached - 1;
	$("#indexDiv").children().removeClass("activeSection");
	// $("#activeSession").html(sections[active]);	
	$($("#indexDiv").children()[active]).addClass("activeSection")
	
	// console.log(visiblePos);
	// console.log(tops);
	// console.log(passed.passed);
}

function enableSelects(){
	$("#blackListTimeWindow").change(function(){
		localStorage.timeWindow = $(this).val() ;
	});
}

function enableButtons(){
	$("#resetIntensity").click(function(){
		var defValue = 60;

		$( "#sliderBeep" ).slider( { "value": defValue });
		localStorage.beepPosition = defValue;
		localStorage.beepIntensity = percentToRaw(defValue);

		
		$( "#sliderZap" ).slider( { "value": defValue });
		localStorage.zapPosition = defValue;
		localStorage.zapIntensity = percentToRaw(defValue);
		
		$( "#sliderVibration" ).slider( { "value": defValue });
		localStorage.vibrationPosition = defValue;
		localStorage.vibrationIntensity = percentToRaw(defValue);
	});
	
	$("#testPairingX").click(function(){
		stimuli("vibration", 230, defAT, "Incoming Vibration. You should receive a notification on your phone, followed by a vibration");
	});

	$("#testZapInt").click(function(){
		stimuli("shock", defInt, defAT, "Incoming Zap. You should receive a notification on your phone, followed by a zap");
	});
		
	$("#testVibrationInt").click(function(){
		stimuli("vibration", defInt, defAT, "Incoming Vibration. You should receive a notification on your phone, followed by a vibration");
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
		$( "#sliderBeep" ).slider({
			value:60,
			min: 10,
			max: 100,
			step: 10,
			slide: function( event, ui ) {
				var beepPos = ui.value;
				console.log(beepPos);
				lsSet('beepPosition', beepPos);
				lsSet('beepIntensity', percentToRaw(beepPos));
				saveOptions();
				$("#beepIntensity").html(beepPos + "%");
			}
		});
		
		$( "#sliderZap" ).slider({
			value:60,
			min: 10,
			max: 100,
			step: 10,
			slide: function( event, ui ) {
				var vibPos = ui.value;
				lsSet('zapPosition', zapPos);
				lsSet('zapIntensity', percentToRaw(zapPos));
				saveOptions();
				$("#zapIntensity").html(zapPos + "%");
			}
		});
		
		$( "#sliderVibration" ).slider({
			value:60,
			min: 10,
			max: 100,
			step: 10,
			slide: function( event, ui ) {
				var vibPos = ui.value;
				console.log(vibPos);
				// localStorage.vibrationPosition = vibPos;
				lsSet('vibrationPosition', vibPos);
				lsSet('vibrationIntensity', percentToRaw(vibPos));
				saveOptions();
				$("#vibrationIntensity").html(vibPos + "%");
			}
			
		});
		$( "#vibrationIntensity" ).val( $( "#sliderVibration" ).slider( "value" ) );
		
	});
	
}

function enableCheckboxes(){
	// Active days
	$("#sundayActive").change(function(){
		lsSet('sundayActive', $(this).prop( "checked" ));
	});
	$("#mondayActive").change(function(){
		lsSet('mondayActive', $(this).prop( "checked" ));
	});
	$("#tuesdayActive").change(function(){
		lsSet('tuesdayActive', $(this).prop( "checked" ));
	});
	$("#wednesdayActive").change(function(){
		lsSet('wednesdayActive', $(this).prop( "checked" ));
	});
	$("#thursdayActive").change(function(){
		lsSet('thursdayActive', $(this).prop( "checked" ));
	});
	$("#fridayActive").change(function(){
		lsSet('fridayActive', $(this).prop( "checked" ));
	});
	$("#saturdayActive").change(function(){
		lsSet('saturdayActive', $(this).prop( "checked" ));
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
		lsSet('sundayActiveTimeStart', $(this).val() );
	});	
		
	$("#sundayActiveTimeEnd").change( function() {	
		lsSet('sundayActiveTimeEnd', $(this).val() );
	});	
		
	$("#mondayActiveTimeStart").change( function() {	
		lsSet('mondayActiveTimeStart', $(this).val() );
	});	
		
	$("#mondayActiveTimeEnd").change( function() {	
		lsSet('mondayActiveTimeEnd', $(this).val() );
	});	
	
	$("#tuesdayActiveTimeStart").change( function() {	
		lsSet('tuesdayActiveTimeStart', $(this).val() );
	});	
		
	$("#tuesdayActiveTimeEnd").change( function() {	
		lsSet('tuesdayActiveTimeEnd', $(this).val() );
	});	
		
	$("#wednesdayActiveTimeStart").change( function() {	
		lsSet('wednesdayActiveTimeStart', $(this).val() );
	});	
		
	$("#wednesdayActiveTimeEnd").change( function() {	
		lsSet('wednesdayActiveTimeEnd', $(this).val() );
	});	
		
	$("#thursdayActiveTimeStart").change( function() {	
		lsSet('thursdayActiveTimeStart', $(this).val() );
	});	
		
	$("#thursdayActiveTimeEnd").change( function() {	
		lsSet('thursdayActiveTimeEnd', $(this).val() );
	});	
		
	$("#fridayActiveTimeStart").change( function() {	
		lsSet('fridayActiveTimeStart', $(this).val() );
	});	
		
	$("#fridayActiveTimeEnd").change( function() {	
		lsSet('fridayActiveTimeEnd', $(this).val() );
	});	

	$("#saturdayActiveTimeStart").change( function() {	
		lsSet('fridayActiveTimeStart', $(this).val() );
	});	
		
	$("#saturdayActiveTimeEnd").change( function() {	
		lsSet('fridayActiveTimeEnd', $(this).val() );
	});	
	
}

function saveOptions() {
	
	var blackList = $("#blackList")[0].value;
	lsSet('blackList', blackList);
	
	var whiteList = $("#whiteList")[0].value;
	lsSet('whiteList', whiteList);
	
	var maxTabs = $("#maxTabsSelect").val();
	lsSet('maxTabs', maxTabs);
	
	var zapOnClose = $("#zapOnClose").prop('checked');
	lsSet('zapOnClose', zapOnClose);
	
	var beepPosition = $( "#sliderBeep" ).slider( "option", "value");
	beepIntensity = percentToRaw(beepPosition); // convert to 1-255 interval
	lsSet('beepIntensity', beepIntensity);
	
	var zapPosition = $( "#sliderZap" ).slider( "option", "value");
	zapIntensity = percentToRaw(zapPosition); // convert to 1-255 interval
	lsSet('zapIntensity', zapIntensity);
	
	var vibrationPosition = $( "#sliderVibration" ).slider( "option", "value");
	vibrationIntensity = percentToRaw(vibrationPosition);
	lsSet('vibrationIntensity', vibrationIntensity);
}

function restoreOptions() {
	// User name and email
	updateNameAndEmail(localStorage.userName, localStorage.userEmail);
	
	// Black and white lists
	var blackList = localStorage.blackList;
	if (blackList == undefined) { blackList = ' '; }
	$("#blackList").val(blackList);

	var whiteList = localStorage.whiteList;
	if (whiteList == undefined) { whiteList = ' '; }
	$("#whiteList").val(whiteList);

	var timeFormat = localStorage.timeFormat;
	$("#timeFormat").val(timeFormat);
	
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
	
	restoreCheckBox('tabNumbersActiveCheckbox', localStorage.tabNumbersActive);
	$("#tabNumbersActiveCheckbox").change(function(){
		localStorage.tabNumbersActive = $(this).prop('checked');
	});
	
	$("#allTabsCountSelect").val(localStorage.tabCountAll);
	$("#allTabsCountSelect").change(function(){
		localStorage.tabCountAll = $(this).val();
	});
		
	$("#maxTabsSelect").val(localStorage.maxTabs);
	
	$("#timeFormat").val(localStorage.timeFormat);

	// Stimuli Intensity
	if (parseInt(localStorage.beepPosition) > 0){
		var beepSlider = localStorage.beepPosition;
	} else { var beepSlider = 60; }
	$( "#sliderBeep" ).slider( { "value": beepSlider });
	$( "#beepIntensity" ).html( beepSlider + "%");
	
	if (parseInt(localStorage.vibrationPosition) > 0){
		var vibSlider = localStorage.vibrationPosition;
	} else { var vibSlider = 60; }
	$( "#sliderVibration" ).slider( { "value": vibSlider });
	$( "#vibrationIntensity" ).html( vibSlider + "%");
	
	if (parseInt(localStorage.zapIntensity) > 0){
		var zapSlider = Math.round(parseInt(localStorage.zapIntensity) * 100 / 2550) * 10;
	} else { var zapSlider = 60; }
	$( "#sliderZap" ).slider( { "value": zapSlider });
	$( "#zapIntensity" ).html( zapSlider + "%");
	
	// Rescue Time
	$("#RTOnOffSelect").val(localStorage.RTOnOffSelect);
	changeRTVisibility();
	
}

function enableScrollNavigation(){
	$("#indexDiv").on('click', '.scrollableLink', function(){
		moveToLink($(this));
	});
}

function moveToLink(clickedLink){
	var target = $(clickedLink).prop('id').split("@")[1];
	target = $("#" + target);
	
	var topHeight = parseInt($("#fixedHeader").height());
	// var topMargin = parseInt($("#fixedHeader").margin());
	var topPadding= parseInt($("#fixedHeader").css('padding').split("p")[0]);
	var topSize = topHeight + topPadding;
	
	var position = $(target).offset().top;
	var positionUpdated = position - topSize;
	
	// console.log(positionUpdated);
	// window.scrollTo(0, positionUpdated);
	$('html, body').animate({
		scrollTop: positionUpdated
	}, 1000);
	
}


// Create the vertical tabs
function initialize() {
	enableSignInOut()
	enableScrollNavigation();
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
	$("#sliderZap").change(function(){
		localStorage.zapPosition = $(this).val();
		localStorage.zapIntensity = percentToRaw(parseInt($(this).val()));
	});
	$("#sliderVibration").change(function(){
		var pos = $( this ).slider( "option", "value");
		localStorage.vibrationPosition = pos;
		localStorage.vibrationIntensity = percentToRaw(parseInt(pos));
		console.log(pos);
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
	
	// Enablers
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
	syncToDo('options');
	enableDaily();
	
	$(".allCaps").text().toUpperCase();
	
	var serverKind = localStorage.baseAddress;
	serverKind = serverKind.split("-")[1].split(".")[0];
	$("#server").text(serverKind);
}

initialize();
$( document ).ready(function() {
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
	
	restoreOptions();
	if ($('#blackListDaily_tagsinput').length > 0){ return }
	enableBlackDaily();
	
	removeInlineStyle("#blackList_tagsinput");
	removeInlineStyle("#whiteList_tagsinput");
	removeInlineStyle("#blackListDaily_tagsinput");
	removeInlineStyle("#whiteListDaily_tagsinput");
	
	$(window).scroll(function(){ 
		var curPos = $(this).scrollTop();

		var fixedHeaderHeight = $("#fixedHeader").height();
		var fixedHeaderPadding = $("#fixedHeader").css("padding").split("p")[0];
		fixedHeaderPadding = parseInt(fixedHeaderPadding);
		var fixedHeaderSize = fixedHeaderHeight + fixedHeaderPadding;

		highlightActiveSection(curPos, fixedHeaderSize); 
		adjustSliders(curPos, fixedHeaderSize);
		adjustSpinners(curPos, fixedHeaderSize);
	});
});