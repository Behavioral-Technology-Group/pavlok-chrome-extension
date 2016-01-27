/* Summary 

1.Validation and Authentication
2.Interface updating
3.Evaluation
4.API conversation

*/

// Defaults
if (!localStorage.blackList) { localStorage.blackList = " "; }
if (!localStorage.whiteList) { localStorage.whiteList = " "; }
if (!localStorage.zapOnClose ) { localStorage.zapOnClose = "false"; }
if (!localStorage.maxTabs ) { localStorage.maxTabs = 6; }


/*---------------------------------------------------------------------------*/
/*---------------------------------------------------------------------------*/
/*--------                                                           --------*/
/*--------             1.Validation and Authentication               --------*/
/*--------                                                           --------*/
/*---------------------------------------------------------------------------*/
/*---------------------------------------------------------------------------*/

function isValid(token){
	// Temporary workaround
	if ( !localStorage.accessToken ){ return false }
	else if (localStorage.accessToken.length == 64){ return true }
	else { return false }

	// Tries the code against API
	console.log('https://pavlok-stage.herokuapp.com/api/v1/me?access_token=' + accessToken);
	
	$.get('https://pavlok-stage.herokuapp.com/api/v1/me?access_token=' + accessToken)
	.done(function (data) {
		console.log(data);
		console.log("GOOD token. Works on API.");
		return true
	})
	.fail(function(){
		console.log("BAD token. Fails on API.");
		return false
	});
}


/*---------------------------------------------------------------------------*/
/*---------------------------------------------------------------------------*/
/*--------                                                           --------*/
/*--------                 2.Interface updating                      --------*/
/*--------                                                           --------*/
/*---------------------------------------------------------------------------*/
/*---------------------------------------------------------------------------*/

// Background
function UpdateBadgeOnOff(badgeText) {
	// if (inText.length == 0 ) { inText = "On"; }
	// if (offText.length == 0 ) { offText = "Off"; }
	
	var logged = isValid(localStorage.accessToken);
	
	
	if (logged == true){
		chrome.browserAction.setIcon({path: 'images/logo_128x128.png'})
		chrome.browserAction.setBadgeBackgroundColor({ color: [38, 25, 211, 255] });
		chrome.browserAction.setBadgeText({ text: badgeText });
		
	}
	else{
		chrome.browserAction.setIcon({path: 'images/off_128x128.png'});
		chrome.browserAction.setBadgeBackgroundColor({ color: [100, 100, 100, 130] });
		chrome.browserAction.setBadgeText({ text: "Off" });
	}
}

function UpdateTabCount(windowId) {
	chrome.tabs.getAllInWindow(windowId, function(tabs) {
		UpdateBadgeOnOff(tabs.length.toString() + '/' + localStorage.maxTabs);
		localStorage[windowId] = tabs.length;
	});
}

function hideSignIn(){ 
	$('#sign_in').hide();
}

function showSignOut(){ 
	$('#sign_out').html("<a href='#' class='sign_out'>Sign Out!</a>")
	.click(signOut);
}

function signOut(){ 
	localStorage.setItem('logged', 'false');
	destroyToken();
	
	// Logging out of providers
	signOutURL = " https://pavlok-stage.herokuapp.com/api/v1/sign_out?access_token=" + localStorage.accessToken;
	console.log("url for Sign Out is " + signOutURL)
	
	/*/ Trying to brute force chrome extension
	// chrome.identity.launchWebAuthFlow(
		// { 'url': signOutURL },
		// function(tokenUrl) {
			// console.log("User signed out.")
		// }
	// );*/
	
	// Proper way of handling it in our server
	$.post(signOutURL)
		.done(function(data){
			console.log("Signed out. Data is: " + data + " !");
			location.reload();
		})
		.fail(function(){
			console.log("Failed to sign out")
			location.reload();
		});
}

// // function showOptions() {
	// // var logged = localStorage.logged;
	// // console.log(logged);
	// // if ( logged == "true"){
		// // var options = document.getElementById("optionsDiv");
		// // options.style.visibility = "visible";
		// // return
	// // }
	// // else{
		// // var options = document.getElementById("optionsDiv");
		// // options.style.visibility = "hidden";
		// // return
	// // }
// // }

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

function hideOptions(){ 
	var options = document.getElementById("optionsDiv");
	options.style.visibility = "hidden";
	return
}

function showName(name){
	if (name === undefined) {
		console.log("SHOW NAME has username as undefined. Name is " + name)
		return
	}
	else {
		var userName = document.getElementById("userName");
		userName.style.visibility = "visible";
		userName.innerHTML = ", " + localStorage.getItem('userName');
		console.log('Username is ' + userName);
	}
	return
}

function hideName(){
	var userName = document.getElementById("userName");
	userName.style.visibility = "hidden";
	userName.innerHTML = "";
	return
}

// Notifications
function notifyUser(title, message, notID){
	var opt = {
		type: "basic",
		title: title,
		message: message,
		iconUrl: "icon.png"
	};
	
	chrome.notifications.create(notID, opt, function(notID) {
		if (chrome.runtime.lastError){
			console.error(chrome.runtime.lastError);
		}
	});
}

function updateNotification(title, message, notID){
	var opt = {
		type: "basic",
		title: title,
		message: message,
		iconUrl: "icon.png"
	};
	
	chrome.notifications.update(notID, opt, function(notID) {
		if (chrome.runtime.lastError){
			console.error(chrome.runtime.lastError);
		}
	});
}

/*--------------------------------------------------------------------------*/
/*--------------------------------------------------------------------------*/
/*--------															--------*/
/*--------						3.Evaluation						--------*/
/*--------															--------*/
/*--------------------------------------------------------------------------*/
/*--------------------------------------------------------------------------*/

function saveBlackList(){
	localStorage.blackList = $("#blackList")[0].value;
}

function saveWhiteList(){
	localStorage.whiteList = $("#whiteList")[0].value;
}


/*--------------------------------------------------------------------------*/
/*--------------------------------------------------------------------------*/
/*--------															--------*/
/*--------						4.API conversation					--------*/
/*--------															--------*/
/*--------------------------------------------------------------------------*/
/*--------------------------------------------------------------------------*/

function save_options() {
	// Get data and store it in LocalStorage
	var select = document.getElementById("wantToSave");
	localStorage.maxTabs = select;
	
}

function oauth() { 
	var redirectURL = chrome.identity.getRedirectURL();
	// Local
	var clientID = "0dff824cc4af8db17a939c231fc17585b35409707c3a1a5308ef1e04733c9bd7";
	var clientSecret = "a142a925c1abe2cc8bfdfd4481707f0f7fec4af89baa3929259b1079adbf72c2";
	
	// // Deployed
	// var clientID = "57267f5569ea936fb30c53e77ec617b4272f1b7001a23a0995d252c0487855c2";
	// var clientSecret = "f05083a0974ce75a945a146b7be2a4493c754b1ca44ca627f0aa0c33df53b673";
	
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

					localStorage.setItem('logged', 'true');
					localStorage.setItem('accessToken', accessToken);
					var logged = document.getElementById("logged");
					$( "#logged" ).append("<span>in</span>");
					chrome.windows.getLastFocused(function(win) {
						UpdateTabCount(win.windowId);
						location.reload(true);
					});
				});
			
			console.log("OAuth2 test concluded");
			
		}
	);	
}

function destroyToken(){
  localStorage.setItem('accessToken', 'null');
}

function userInfo(accessToken) { 
	$.get('https://pavlok-stage.herokuapp.com/api/v1/me?access_token=' + accessToken)
		.done(function (data) {
			var dude = JSON.stringify(data, null, 4);
				console.log('User info for ' + data.name + ' succeeded. \nHis UID is:' + data.uid);
				localStorage.setItem('userEmail', data.email)
				localStorage.setItem('userName', data.name);
				return data.name;
		})
		.fail(function(){
			console.log('User information request failed');
		});
}

function stimuli(stimuli, value, accessToken, textAlert) {
	if (!textAlert){ textAlert = "Incoming " + stimuli; }
	
	alert(textAlert);
	
	postURL = 	'https://pavlok-stage.herokuapp.com/api/v1/stimuli/' + 
				stimuli + '/' + 
				value + 
				'?access_token=' + accessToken;
	console.log("URL being POSTED is:\n" + postURL);
	$.post(postURL)
		.done(function (data, result) {
			return console.log(stimuli + ' succeeded!\n' + data + " " + result);
		})
		.fail( function() {
			console.log('Failed the new API. Trying the old one');
			objectCode = localStorage.objectCode;
			if (stimuli == "vibration") { stimuli = "vibro"; }
			console.log(stimuli + ' failed!\nUrl was: ' + postURL + "\nTrying the old API at: ");
			$.get('https://pavlok.herokuapp.com/api/' + objectCode + '/' + stimuli + '/' + intensity);
			
			return 
		});	
}
