/* To-do


*/

var notTimeout;
var pomoFocusP = {};
var pomoFocusO;
var pomoFocusB;

var todayDivTest;
var focusCompleteMsg = "IGAO Keep the zone going, you rock star!";
var focusStopMsg = ''; 
var defInt = '';			// Use default intensity for stimuli
var defAT = '';				// Use default Access Token for stimuli

function presentName(){
	if ( !localStorage.userName ) 	{ userInfo(localStorage.accessToken); }
	if ( localStorage.userName ) 	{ updateNameAndEmail(localStorage.userName, localStorage.userEmail); }
}

function enableTestButtons(){
	$("#beepTest").click(function(){ 
		stimuli("beep", defInt, defAT, "You'll get a Beep and a notification on your phone", "false"); 
	});
	$("#vibrateTest").click(function(){ 
		stimuli("vibration", defInt, defAT, "You'll get a Vibration and a notification on your phone", "false"); 
	});
	$("#zapTest").click(function(){
		stimuli("shock", defInt, defAT, "You'll get a Zap and a notification on your phone", "false"); 
	});
	
	$("#testPairing").click(function(){ 
		stimuli("vibration", defInt, defAT, "Your pairing works", "false");
	});
}

function tabsAsAccordion(){
	// Get tab Elements
	var tabs = $( "tab" ).get();
	
	// Apply classes for it
	for (t = 0; t < tabs.length; t++){
		var curTab = tabs[t];
		var header = $(curTab).children()[0];
		var tabBody = $(curTab).children()[1];
		
		$(curTab).attr('id', ('tabs-'+t));
		$(header).addClass("pv-tab-header");
		$(tabBody).addClass("pv-tab-body");
	}
	
	toggleTabs();
}

function toggleTabs(){
	$(" #actionSection ").on('click', '.pv-tab-header', function(){
		var header = $(this);
		var tab = $(this).parent();
		var body = $(tab).children()[1];
		
		// If clicked on active tab, inactivate it and close all tabs
		if ($(tab).hasClass("pv-active-tab")){
			$(tab).removeClass("pv-active-tab");
			$(header).removeClass("pv-active-tab-header");
			$(body).removeClass("pv-active-tab-body");
		}
		else {
			// If clicked on inactive tab, inactivate others and activate it
			
			
			// Remove active class from all tabs
			var tabs = $( "tab" ).get();
			for (t = 0; t < tabs.length; t++){
				var curTab = tabs[t];
				var curHeader = $(curTab).children()[0];
				var curTabBody = $(curTab).children()[1];
			
				$(curTab).removeClass("pv-active-tab");
				$(curHeader).removeClass("pv-active-tab-header");
				$(curTabBody).removeClass("pv-active-tab-body");
			}
			
			// Add active class to clicked tab
			$(tab).addClass('pv-active-tab');
			$(header).addClass('pv-active-tab-header');
			$(body).addClass('pv-active-tab-body');
		
		}
		
		// Run blind effect on clicked tab body
		$('.pv-tab-body:not(.pv-active-tab-body)').hide(250);
		$('.pv-active-tab-body').toggle('blind', {}, 250);
	});
}

function enableBlackList(){
	var blackListContents = lsGet('blackList');
	$('#blackList').tagsInput({
		'onChange' : saveBlackList,
		'defaultText':'Add site... ie: facebook.com',
		'removeWithBackspace' : true
	})
	.importTags(blackListContents);
	removeInlineStyle("#blackList_tagsinput");
	
	var whiteListContents = lsGet('whiteList');
	$('#whiteList').tagsInput({
		'onChange' : saveWhiteList,
		'defaultText':'Add site... ie: facebook.com/groups/772212156222588/',
		'removeWithBackspace' : true
	})
	.importTags(whiteListContents);
	removeInlineStyle("#whiteList_tagsinput");
	removeInlineStyle("#whiteList_tag");

}

function enableStimuliControls() {
	$(function() {
		defZap = parseInt(lsGet('zapPosition'));
		defVib = parseInt(lsGet('vibrationPosition'));
		defBeep = parseInt(lsGet('beepPosition'));
		
		$( "#sliderBeep" ).slider({
			value:defBeep,
			min: 10,
			max: 100,
			step: 10,
			slide: function( event, ui ) {
				var beepPos = ui.value;
				console.log(beepPos);
				lsSet('beepPosition', beepPos);
				lsSet('beepIntensity', percentToRaw(beepPos, 'beep'));
				$("#beepIntensity").html(beepPos + "%");
				confirmUpdate(notifyUpdate);
				msgExt("updateStimuli", "options");
			}
		});
		$("#beepIntensity").html(defBeep + "%");
		
		$( "#sliderZap" ).slider({
			value:defZap,
			min: 10,
			max: 100,
			step: 10,
			slide: function( event, ui ) {
				var zapPos = ui.value;
				lsSet('zapPosition', zapPos);
				lsSet('zapIntensity', percentToRaw(zapPos, 'zap'));
				$("#zapIntensity").html(zapPos + "%");
				confirmUpdate(notifyUpdate);
				msgExt("updateStimuli", "options");
			}
		});
		$("#zapIntensity").html(defZap + "%");
		
		$( "#sliderVibration" ).slider({
			value:defVib,
			min: 10,
			max: 100,
			step: 10,
			slide: function( event, ui ) {
				var vibPos = ui.value;
				lsSet('vibrationPosition', vibPos);
				lsSet('vibrationIntensity', percentToRaw(vibPos, 'vibrate'));
				$("#vibrationIntensity").html(vibPos + "%");
				confirmUpdate(notifyUpdate);
				msgExt("updateStimuli", "options");
			}
			
		});
		$("#vibrationIntensity").html(defVib + "%");
		
		
	});
	
	$("#resetIntensity").click(function(){
		var defVib = 60;
		var defZap = 60;
		var defBeep = 100;
		
		lsSet('vibrationPosition', defVib);
		lsSet('vibrationIntensity', percentToRaw(defVib, 'vibrate'));
		$("#vibrationIntensity").html(defVib + "%");
		$( "#sliderVibration" ).slider({value:defVib});
		
		lsSet('zapPosition', defZap);
		lsSet('zapIntensity', percentToRaw(defZap, 'zap'));
		$("#zapIntensity").html(defZap + "%");
		$( "#sliderZap" ).slider({value:defZap});
		
		lsSet('beepPosition', defBeep);
		lsSet('beepIntensity', percentToRaw(defBeep, 'beep'));
		$("#beepIntensity").html(defBeep + "%");
		$( "#sliderBeep" ).slider({value:defBeep});
	});
}

$( document ).ready(function() {
	enableTooltips();
	presentName();
	enableTestButtons();
	enableToDo();
	syncToDo('options');
	showOptions(localStorage.accessToken);
	restoreDailyList('.dailyContainer');
		
	tabsAsAccordion();
	enableBlackList();
	enableStimuliControls();
	
	if (isValid(localStorage.accessToken)){
		$("#signOut").attr('title', 'Sign Out');
	} else { 
		$("#signOut").attr('title', 'Sign In');
	}
	
	$("#signOut").click(function(){
		if (isValid(localStorage.accessToken)){
			signOut();
		}
		else{
			oauth();
		}
	});

	$("#maxTabsSelect").val( lsGet('maxTabs'));
	$("#maxTabsSelect").change(function(){
		var maxTabs = $(this).val();
		lsSet('maxTabs', maxTabs);
		confirmUpdate(notifyUpdate);
		msgExt("updateMaxTabs", "options");
	});
	
	$("#instaZap").change(function(){
		lsSet('instaZap', $(this).prop( "checked" ));
		confirmUpdate(notifyUpdate);
	});
	
	$("#lockZap").change(function(){
		lsSet('lockZap', $(this).prop( "checked" ));
		confirmUpdate(notifyUpdate);
		
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
			curPAVTab = tabs[0];
			curPAVUrl = tabs[0].url;
			curPAVDomain = new URL(curPAVUrl).hostname.replace("www.", "");
			
			if(curPAVDomain.length == 0){
				console.log("unable to resolve domain for " + curPAVUrl);
				curPAVDomain = curPAVUrl;
			}
			
			lsSet('lockedTo', curPAVDomain);
			
		});
		
	});
	
	// Message listeners
	chrome.extension.onMessage.addListener(
		function(request, sender, sendResponse) {
			if (request.target == "popup"){
				if (request.action == "updateBlackList"){
					var curBlackList = $("#blackList").val();
					var curWhiteList = $("#whiteList").val();
					
					var newBlackList = lsGet("blackList");
					var newWhiteList = lsGet("whiteList");
					
					if (curBlackList == newBlackList && 
						curWhiteList == newWhiteList){
							return
					}
					else{
					}
						$("#blackList").importTags(newBlackList);
						$("#whiteList").importTags(newWhiteList);
				}
			}
		}
	);
});

function newsUpdate(){
	var message = {};
	message.html = 	"" +
					"<p>Hey there, buddy!</p>" +
					"<p>You can now block parts of a site. For instance, putting <b>facebook.com/groups</b> on your blacklist will warn on every facebook group, but will leave the rest of the site just fine.</p> " +
					"<p>You can also whitelist bigger chunks of a site. For instance, putting <b>facebook.com/groups/772212156222588/</b> on your whitelist will make you safe on the Official Pavlok's Group.</p> " +
					"<p>Also note that <b>black and whitelists now use the same way of typing addresses! If you need to make any adjustments, we will tell you</b>!</p>" +
					"<p>Best, </p>" +
					"<p>Pavlok Team</p>";

	message.title = "Black and White lists got a level-up!"
	message.buttons = { "Ok, don't tell me again": true, "Remind me again": false };
	message.submit = function(e,v,m,f){
		var result = v;
		if (result == true) {
			lsSet('dontRepeatUpdate', 'true');
			validateList(lsGet('whiteList'));
		}
		else {
			validateList(lsGet('whiteList'));
		}
	}
	
	$.prompt(message);
}