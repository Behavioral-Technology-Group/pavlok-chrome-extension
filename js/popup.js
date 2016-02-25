/* To-do

*/
var pomoFocusP = {};
var pomoFocusO;
var pomoFocusB;

var todayDivTest;
var focusCompleteMsg = "Keep the zone going, you rock star!";
var focusStopMsg = ''; 
var defInt = '';			// Use default intensity for stimuli
var defAT = '';				// Use default Access Token for stimuli

function presentName(){
	if ( !localStorage.userName ) 	{ userInfo(localStorage.accessToken); }
	if ( localStorage.userName ) 	{ updateNameAndEmail(localStorage.userName, localStorage.userEmail); }
}

function enableTestButtons(){
	$("#beepTest").click(function(){ 
		stimuli('beep', '255', defAT, "You'll get a Beep and a notification on your phone", 'false'); 
	});
	$("#vibrateTest").click(function(){ 
		stimuli('vibration', defInt, defAT, "You'll get a Vibration and a notification on your phone", 'false'); 
	});
	$("#zapTest").click(function(){
		stimuli('shock', defInt, defAT, "You'll get a Zap and a notification on your phone", 'false'); 
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

function enableDailyFocusButtons(){
	
}

$( document ).ready(function() {
	enableTooltips();
	presentName();
	enableTestButtons();
	enableToDo();
	syncToDo('options');
	showOptions(localStorage.accessToken);
	restoreDailyList('.dailyContainer');
	
	
	$("#signOut").click(function(){
		signOut();
	});
	
	
	
	/* Legacy code. Max tabs and black/white lists moved to options
	// // Restore Max Tabs
	// $("#maxTabsSelect").val(localStorage.maxTabs);
	// $("#maxTabsSelect").change(function(){
		// localStorage.maxTabs = $(this).val();
	// });
	
	// // Restore values for Black and White Lists along with enabling tags
	// $('#blackList')[0].value = localStorage["blackList"];
	// $('#blackList').tagsInput({
		// 'onChange' : saveBlackList,
		// 'defaultText':'Add site',
		// 'removeWithBackspace' : true
	// });
	
	// $('#whiteList')[0].value = localStorage["whiteList"];
	// $('#whiteList').tagsInput({
		// 'onChange' : saveWhiteList,
		// 'defaultText':'Add site',
		// 'removeWithBackspace' : true
	// });
	*/
});