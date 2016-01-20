/* ---------------------------------------------------- */
/*                   Helper Functions                   */
/* ---------------------------------------------------- */

// chrome.runtime.sendMessage(
	// {}, function(response) { console.log(response.farewell); });

function oauth() { // checked. Working fine
	var redirectURL = chrome.identity.getRedirectURL();
	// Deployed
	var clientID = "f9a1d14731fa7333357a8f89c066c661cb90ec657a70cb94bed62828d5f1e81a";
	var clientSecret = "0621dc253f364b012642092bd71918b0685cec42939fb1f2c2dd490533aef21d";
	var authURL = "https://pavlok-stage.herokuapp.com/oauth/authorize?" + 
		'client_id=' + clientID +
		'&redirect_uri=' + redirectURL +
		'&response_type=code' +
		'&prompt=select_account';
	
	console.log("Step 1: Redirect URL is: " + redirectURL);
	
	chrome.identity.launchWebAuthFlow(
		{url: authURL, interactive: true},
		
		function(responseUrl) {
			// Get Auth code
			console.log("Step 2: Response url with code is:" + responseUrl);
			authorizationCode = responseUrl.substring(responseUrl.indexOf("=")+1);
			console.log("Step 3: Authorizaion code is: " + authorizationCode);
			
			// Exchange AuthCode for Access Token:
			accessTokenUrl = 'https://pavlok-stage.herokuapp.com/' + "/oauth/token?" + 'client_id=' + clientID +  '&client_secret=' + clientSecret + '&code=' + authorizationCode + '&grant_type=authorization_code' + '&redirect_uri=' + redirectURL;
			
			console.log("Step 4: Access token Url is: " + accessTokenUrl);
			
			$.post(accessTokenUrl)
				.done(function (data) {
					console.log(data);
					var accessToken = data.access_token;
					// // // chrome.storage.local.set({'accessToken': accessToken}, function() {
						// // // localStorage.setItem('accessToken', accessToken);
						// // // console.log('Settings saved\n accessToken is: ' + accessToken);
					// // // });
					localStorage.setItem('logged', 'true');
					localStorage.setItem('accessToken', accessToken);
					var logged = document.getElementById("logged");
					$( "#logged" ).append("<span>in</span>");
				});
			
			console.log("OAuth2 test concluded");
			
		}
	);	
}

function destroyToken(){ // checked. Working, but should probably be merged with signOut
  chrome.storage.local.set({'accessToken': ""});
  localStorage.setItem('accessToken', 'null');
}

// API messing around
function userInfo(accessToken) { // checked. Working fine
	$.get('https://pavlok-stage.herokuapp.com/api/v1/me?access_token=' + accessToken)
		.done(function (data) {
			var dude = JSON.stringify(data, null, 4);
				console.log('User info for ' + data.name + ' succeeded. \nHis UID is:' + data.uid);
				localStorage.setItem('userName', data.name);
				return data.name;
		})
		.fail(function(){
			console.log('User information request failed');
		});
}

// Interface and DOMS
var blackSites = new Array();
$('#blackList').tagsInput();
var whiteSites = new Array();
$('#whiteList').tagsInput();

function restore_options() { // checked. Working fine
  var maxTabsSelect = localStorage.maxTabs;
  var blackList = localStorage.blackList;
  if (blackList)
  {
    document.getElementById("blackList").value=blackList;
  }
  
  var whiteList = localStorage.whiteList;
  if (whiteList)
  {
    document.getElementById("whiteList").value=whiteList;
  }

  if (!maxTabsSelect) {
    return;
  } else {
    document.getElementById("maxtab").value=maxTabsSelect
  }

}

function initialize() { // checked. Working fine
  $('#blackList').tagsInput({
    'onChange' : save_options,
    'defaultText':'Add site',
    'removeWithBackspace' : true
  });
  
  $('#blackList')[0].value = localStorage["blackList"];
  
  $('#whiteList').tagsInput({
    'onChange' : save_options,
    'defaultText':'Add site',
    'removeWithBackspace' : true
  });
  
  $('#whiteList')[0].value = localStorage["whiteList"];
  
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
  
}

/* End of Helper Functions */


// function notifyMe() {
  // if (!Notification) {
	// alert('Desktop notifications not available in your browser. Try Chromium.'); 
	// return;
  // }

  // if (Notification.permission !== "granted")
	// Notification.requestPermission();
  // else {
	// var notification = new Notification('PAVLOK Notification', {
	  
	  // icon: 'images/browser_action_48x48.png',
	  // body: "Hey there! You've been notified!",
	  // eventTime: Date.now() + 3000,
	// });

	// notification.onclick = function () {
	  // alert("notification clicked");
	// };
	
  // }

// }

// function test(){
	// // At first, let's check if we have permission for notification
	// // If not, let's ask for it
	// // if (window.Notification && Notification.permission !== "granted") {
	// if (Notification.permission !== "granted") {
		// Notification.requestPermission(function (status) {
			// if (Notification.permission !== status) {
				// Notification.permission = status;
			// }
		// });
	// }
	// else {
		// console.log("Notification permission is " + Notification.permission);
	// }

	// notifyMe();
// }


// Get the token from storage
var token = localStorage.getItem("accessToken");

onload = function() {
	// test();
	var validSequence = $.Deferred();
	var token = localStorage.getItem("accessToken"); // Try to remove this redundancy later and get it passed by the function
	console.log("da onload, accessToken is " + localStorage.accessToken);

	chrome.windows.getLastFocused(function(win) {
		UpdateTabCount(win.windowId);
	});
	
	restore_options();
	initialize();
	
	// If checking for validity becomes default, it will ALWAYS be logged in OR logging in. Never will it be out.
	if (isValid(token) == true) {
		// Stimuli for confirmation
		stimuli('beep', '4', token);
		stimuli('vibration', '255', token);
		stimuli('beep', '4', token);
		
		var status = document.getElementById("status");
		status.innerHTML = "If you don't feel any stimuli, check if your Pavlok is paired";
		
		// $( "#status" ).slideDown(500).delay(3500).slideUp(500);
		$( "#status" )
			.delay(400)
			.slideDown(250)
			.delay(100)
			.css("color", "green")
			.css("fontSize", "2em")
			.delay(5000)
			.slideUp(100)
			// .css("color", "#E2A92B")
			// .css("fontSize", "1em");

		console.log("Token is: " + token);
		userInfo(token);
		userName = localStorage.userName;
		passAcessToken(token);
		
		// Update interface functions
		adjustOverInteractions(token, userName);
		
		var save = document.getElementById("save");
		save.addEventListener("click", function() {
			save_options();
			adjustOverInteractions(token, userName);
		});
		
		
	} 
	else {
		var invalidSequence = $.Deferred();
		var updateSequence = $.Deferred();
		
		console.log('OAuth try: Access token is invalid or inexistent');
		var login = document.getElementById("sign_in");
		$( login ).click(function() {
			oauth();
			
			// Trigger because other functions are called before the end of oauth();
			$("#logged").bind("DOMSubtreeModified", function() {
				location.reload();
			});
		});
	}
}	



function passAcessToken(accessToken) {
	chrome.runtime.sendMessage({
		accessToken: token
	});
}