/* To-do 
- Fix test Zap (NaN) bug
- Fix Tooltip (enable the better one)

*/

/* sandbox */
function checkActiveDayHour(){
	var now = new Date();
	var start = localStorage.generalActiveTimeStart;
	var end = localStorage.generalActiveTimeEnd;
	console.log("Now is: " + now + "\nStarts at: " + start + "\nEnds at: " + end);
	
	var dayActive = checkActiveDay(now);
	var hourActive = checkActiveHour(start, end);
	console.log("So, active day is " + dayActive + " and hour activity is " + hourActive);
	
	if (dayActive == true && hourActive == true) { return true }
	else { return false }
}

function checkActiveDay(date){	
	// Creates a list of active days from local Storage
	var activeDaysList = [];
	if (localStorage.sundayActive == 'true') { activeDaysList.push(0); }
	if (localStorage.mondayActive == 'true') { activeDaysList.push(1); }
	if (localStorage.tuesdayActive == 'true') { activeDaysList.push(2); }
	if (localStorage.wednesdayActive == 'true') { activeDaysList.push(3); }
	if (localStorage.thursdayActive == 'true') { activeDaysList.push(4); }
	if (localStorage.fridayActive == 'true') { activeDaysList.push(5); }
	if (localStorage.saturdayActive == 'true') { activeDaysList.push(6); }
	
	// Checks if current day is set as active
	if ( activeDaysList.indexOf(date.getDay()) != -1 ) { return true } 
	else { return false}
}
	
function checkActiveHour(start, end){	// start and End are for debugging
	// Checks if it's on an active day
	var now = new Date();
	
	// Checks if it's on an active hour
	var testHourStart = start;			// localStorage.xActiveStart
	var testHourEnd = end;				// localStorage.xActiveEnd
	
	// New dates using today, but with begin and end times set
	var begin = new Date();
	begin.setHours(parseInt(testHourStart.split(":")[0]));
	begin.setMinutes(parseInt(testHourStart.split(":")[1]));
	begin.setSeconds(0);
	begin.setMilliseconds(0);
	
	var end = new Date();
	end.setHours(parseInt(testHourEnd.split(":")[0]));
	end.setMinutes(parseInt(testHourEnd.split(":")[1]));
	end.setSeconds(0);
	end.setMilliseconds(0);
	
	// Evaluation
	if (begin < now && now < end) { return true }
	else { return false }
}
/* end of sandbox */

function enableAutoZapper(){
		var intensity = $( "#autoZapperIntensity" ).spinner({
			min: 0,
			max: 100,
			page: 10,
			step: 10
		});
		intensity.val(60);
	
		var duration = $( "#autoZapperDuration" ).spinner({
			min: 0,
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
					
					var trainingSession = setInterval(function() {
						console.log("Occured at ");
						stimuli('vibration', localStorage.trainingSessionZI, localStorage.accessToken, '', 'false');
					}, parseInt(localStorage.trainingSessionZF));
					
					var endTraining = setTimeout(function(){ 
						clearInterval(trainingSession);
						$.prompt("Session is over");
						localStorage.trainingSession = 'false';
						localStorage.trainingSessionZI = '';
						localStorage.trainingSessionZD = '';
						localStorage.trainingSessionZF = '';
						
					}, parseInt(localStorage.trainingSessionZD));
				}	
			}
		});
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
		stimuli('shock', localStorage.zapIntensity, localStorage.accessToken);
	});
		
	$("#testVibrationInt").click(function(){
		stimuli('vibration', localStorage.vibrationIntensity, localStorage.accessToken);
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

function enableTables(){
	// $('#sundayActiveTimeStart').timepicker({
	$('.timeSelectors').timepicker({
		showPeriodLabels: false,
	});
	
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
	$("#generalActiveTimeStart").change( function() {
		localStorage.generalActiveTimeStart = $(this).val();
	});
	
	$("#generalActiveTimeEnd").change( function() {
		localStorage.generalActiveTimeEnd = $(this).val();
	});
	
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
	enableAutoZapper();
	enableTooltips();
	enableButtons();
	enableSliders();
	enableTables();
	enableCheckboxes();
	enableInputs();
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