/* To-do 
BOOM!	- Save input from Black and Whitelist
BOOM!	- Populate fields with Black and Whitelist items
BOOM!	- Create advanced zapping (zap when closing tabs?)

*/

function saveBlackList(){
	localStorage.blackList = $("#blackList")[0].value;
}

function saveWhiteList(){
	localStorage.whiteList = $("#whiteList")[0].value;
}

// Sign in and out
$("#signIn").click(function(){
	oauth();
});

$("#signOut").click(function(){
	signOut();
});

function save_options() {
	
	var blackList = $("#blackList")[0].value;
	localStorage.blackList = blackList;
	
	var whiteList = $("#whiteList")[0].value;
	localStorage.whiteList = whiteList;
	
	var maxTabs = $("#maxtab").val();
	localStorage.maxtabs = maxTabs;
	
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
	// Black and white lists
	var blackList = localStorage.blackList;
	if (blackList == undefined) { blackList = ' '; }
	
	$("#blackList").val(blackList);
	// if (blackList)
	// {
		// document.getElementById("blackList").value=blackList;
	// }
	
	var whiteList = localStorage.whiteList;
	if (whiteList == undefined) { whiteList = ' '; }
	if (whiteList)
	{
		document.getElementById("whiteList").value=whiteList;
	}

	// Zap on Close
	if (localStorage.zapOnClose == 'true' )
		{ $("#zapOnClose").attr('checked', true); }
	else { $("#zapOnClose").attr('checked', false); }
	$("#maxtab").val(localStorage.maxtabs);

	// Stimuli Intensity
	if (parseInt(localStorage.vibrationIntensity) > 0){
		var vibSlider = Math.round(parseInt(localStorage.vibrationIntensity) * 100 / 2550) * 10;
	} else { var vibSlider = 60; }
	$( "#sliderVibration" ).slider( { "value": vibSlider })
	$( "#vibrationIntensity" ).val(vibSlider);
	
	if (parseInt(localStorage.zapIntensity) > 0){
		var zapSlider = Math.round(parseInt(localStorage.zapIntensity) * 100 / 2550) * 10;
	} else { var vibSlider = 60; }
	var zapSlider = Math.round(parseInt(localStorage.zapIntensity) * 100 / 2550) * 10;
	$( "#sliderZap" ).slider( { "value": zapSlider })
	$( "#zapIntensity" ).val(zapSlider);
	
}

// Check which parameters are changed and what is clicked
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
	
	// Help boxes
	$('#whiteListHelp').hover(
	function(){
		$( '#whiteListHelpBox' ).fadeIn();
	},
	function(){
		$( '#whiteListHelpBox').fadeOut();
		}
	);
	
	 $('#blackListHelp').hover(
	function(){
		$( '#blackListHelpBox' ).fadeIn();
	},
	function(){
		$( '#blackListHelpBox').fadeOut();
		}
	);
	
	// Create tabs
	$(function() {
		$( "#tabs" ).tabs().addClass( "ui-tabs-vertical ui-helper-clearfix" );
		$( "#tabs li" ).removeClass( "ui-corner-top" ).addClass( "ui-corner-left" );
		// $( ".tabsLi")
	});
	
	// Create sliders for intensities
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
	
	// Test stimuli buttons
	$(function(){
		$("#testZapInt").click(function(){
			stimuli('shock', localStorage.zapIntensity, localStorage.accessToken);
		});
		
		$("#testVibrationInt").click(function(){
			stimuli('vibration', localStorage.vibrationIntensity, localStorage.accessToken);
		});
	});
	
	// Auto save results on changed
	$("#zapOnClose").change(function(){
		localStorage.zapOnClose = $(this).prop( "checked" );
	});
	$("#maxtab").change(function(){
		localStorage.maxtabs = $(this).val();
	});
	$("#zapIntensity").change(function(){
		localStorage.zapIntensity = $(this).val();
	});
	$("#vibrationIntensity").change(function(){
		localStorage.vibrationIntensity = $(this).val();
	});
	$("#whiteList").change(function(){
		localStorage.whiteList = $(this).val();
		alert("changed white list");
	});
	$("#blackList").change(function(){
		localStorage.blackList = $(this).val();
		alert("changed black list");
	});
	
	// Sign in and Sign out
	$("#sign_in").click(function(){
		oauth();
	});
	
	$("#sign_out").click(function(){
		signOut();
	});
	
	$(function() {
		$( document ).tooltip();
	});	
}


if ( localStorage.blackList == undefined ) { localStorage.blackList = " "; };
if ( localStorage.whiteList == undefined ) { localStorage.whiteList = " "; };
if ( localStorage.maxtabs == undefined ) { localStorage.maxtabs = 6; }
initialize();

$( document ).ready(function() {
	restore_options();
	if (localStorage.logged == 'true') { 
		$(".onlyLogged").css('visibility', 'visible');
		$(".onlyUnlogged").css('display', 'none');
	}
	
	// Fill user Data
	if (!localStorage.name){
		userInfo(localStorage.accessToken)
	}
	// else {
		$('#userEmailSettings').html(localStorage.userEmail);
		$('#userName').html(" " + localStorage.userName);
		
	// }
	
});