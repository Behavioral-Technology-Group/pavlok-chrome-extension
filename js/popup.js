/* To-do

*/
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

// function showOptions(accessToken){
	// if (isValid(localStorage.accessToken)){
		// $(".onlyLogged").css('visibility', 'visible'); 
		// $(".onlyUnlogged").css('display', 'none'); 
	// }
	// else { 
		// $(".onlyLogged").css('visibility', 'hidden'); 
		// $(".onlyUnlogged").css('display', 'block'); 
	// }
// }

$( document ).ready(function() {
	enableTooltips();
	presentName();
	enableTestButtons();
	enableToDo();
	syncToDo('options');
	showOptions(localStorage.accessToken);
	restoreDailyList('.dailyContainer');
		
	$("#signOut").click(function(){
		if (isValid(localStorage.accessToken)){
			signOut();
		}
		else{
			oauth();
		}
	});
	});
	
	$("#instaZap").change(function(){
		lsSet('instaZap', $(this).prop( "checked" ));
	});
	$("#lockZap").change(function(){
		lsSet('lockZap', $(this).prop( "checked" ));
		
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
});