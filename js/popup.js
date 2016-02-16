/* To-do

*/


function showName(){
	// Tries the code against API
	$.get(localStorage.baseAddress + '/api/v1/me?access_token=' + accessToken)
	.done(function () {
		console.log("GOOD token. Works on API.");
		return true
	})
	.fail(function(){
		console.log("BAD token. Fails on API.");
		return false
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

$( document ).ready(function() {
	enableTooltips();
	// enableToDo();
	if ( !localStorage.userName ) { userInfo(localStorage.accessToken); }
	if ( localStorage.userName ) { updateNameAndEmail(localStorage.userName, localStorage.userEmail); }
	
	// $("#signIn").click(function(){
		// oauth();
	// });
	
	$("#signOut").click(function(){
		signOut();
	});
	
	$("#beepTest").click(function(){ 
		stimuli('beep', localStorage.beepTune, localStorage.accessToken, "You'll get a Beep and a notification on your phone", 'false'); 
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

	$("#test_pairing").click(function(){
		stimuli("vibration", 230, localStorage.accessToken, "Incoming Vibration. You should receive a notification on your phone, followed by a vibration");
	});
	
	if (localStorage.logged == 'true') {
		// Toggle visibility for options
		$(".onlyLogged").css('visibility', 'visible');
		$(".onlyUnlogged").css('display', 'none');
	}
	
});