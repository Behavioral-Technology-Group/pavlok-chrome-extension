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


/* ***************************************************************** */
/* ***************                                   *************** */
/* ***************           To-Do Section           *************** */
/* ***************                                   *************** */
/* ***************************************************************** */

// Status for the tasks are put as classes on the ROW of the item.
// TO-DO Helpers


////////////////////////////////////////////////////////////////////////////////////


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
	if ( !localStorage.userName ) 	{ userInfo(localStorage.accessToken); }
	if ( localStorage.userName ) 	{ updateNameAndEmail(localStorage.userName, localStorage.userEmail); }
	
	$("#signOut").click(function(){
		signOut();
	});
	
	$("#beepTest").click(function(){ 
		stimuli('beep', '255', localStorage.accessToken, "You'll get a Beep and a notification on your phone", 'false'); 
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

	enableToDo();
	if (localStorage.logged == 'true') {
		// Toggle visibility for options
		$(".onlyLogged").css('visibility', 'visible');
		$(".onlyUnlogged").css('display', 'none');
	}
});