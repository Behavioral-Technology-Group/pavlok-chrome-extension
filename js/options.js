/* To-do 
- Fix test Zap (NaN) bug
- Fix Tooltip (enable the better one)

*/

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

	// Checkboxes
	restoreCheckBox('zapOnClose', localStorage.zapOnClose);
	restoreCheckBox('notifyZap', localStorage.notifyZap);
	restoreCheckBox('notifyVibration', localStorage.notifyVibration);
	restoreCheckBox('notifyBeep', localStorage.notifyBeep);
	
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
	
	// Enablers
	enableTooltips();
	enableButtons();
	enableSliders();
	enableTables();
	
	$(".linked")
		.click( 
			function() {
				$("a", this).click();
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