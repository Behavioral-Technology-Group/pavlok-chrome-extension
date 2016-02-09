/* Summary 

1.Validation and Authentication
2.Interface updating
3.Evaluation
4.API conversation

*/

// Defaults
var server = "STAGE" // STAGE or MVP
var usage = "local"; // local OR test OR production (MVP or STAGE added at the end)
usage = usage + server;

var baseAddress = "https://pavlok-" + server.toLowerCase() + ".herokuapp.com/";
localStorage.setItem['baseAddress'] = baseAddress;

localStorage.baseAddress = baseAddress;

localStorage.gmailClientID = '355054180595-pl1tc9qtp7mrb8fe2nb25n071ai2foff.apps.googleusercontent.com';

// Stimuli intensity
if (!localStorage.zapIntensity ) { localStorage.zapIntensity = 153; } //60% default
if (!localStorage.vibrationIntensity ) { localStorage.vibrationIntensity = 153; } //60% default

// Blacklist and tabs
if (!localStorage.timeWindow) { localStorage.timeWindow = 15};
if (!localStorage.blackList) { localStorage.blackList = " "; }
if (!localStorage.whiteList) { localStorage.whiteList = " "; }
if (!localStorage.zapOnClose ) { localStorage.zapOnClose = "false"; }
if (!localStorage.maxTabs ) { localStorage.maxTabs = 15; }

// Active Days and Hours
if (!localStorage.generalActiveTimeStart) { localStorage.generalActiveTimeStart = "00:00"; }
if (!localStorage.generalActiveTimeEnd) { localStorage.generalActiveTimeEnd = "23:59"; }
if (!localStorage.sundayActive) { localStorage.sundayActive = 'true'; }
if (!localStorage.mondayActive) { localStorage.mondayActive = 'true'; }
if (!localStorage.tuesdayActive) { localStorage.tuesdayActive = 'true'; }
if (!localStorage.wednesdayActive) { localStorage.wednesdayActive = 'true'; }
if (!localStorage.thursdayActive) { localStorage.thursdayActive = 'true'; }
if (!localStorage.fridayActive) { localStorage.fridayActive = 'true'; }
if (!localStorage.saturdayActive) { localStorage.saturdayActive = 'true'; }

// Notifications
if (!localStorage.notifyBeep ) { localStorage.notifyBeep = 'false'; }
if (!localStorage.notifyVibration ) { localStorage.notifyVibration = 'false'; }
if (!localStorage.notifyZap ) { localStorage.notifyZap = 'false'; }

// RescueTime
if (!localStorage.RTOnOffSelect) { localStorage.RTOnOffSelect = "Off" };
if (!localStorage.RTFrequency) { localStorage.RTFrequency = 15 };

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
	console.log(localStorage.baseAddress + 'api/v1/me?access_token=' + accessToken);
	
	$.get(localStorage.baseAddress + 'api/v1/me?access_token=' + accessToken)
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
	$('#signIn').hide();
}

function showSignOut(){ 
	$('#signOut').html("<a href='#' id='signOut' class='sign_out'>Sign Out!</a>")
	.click(signOut);
}

function signOut(){ 
	// Logging out of providers
	signOutURL = " https://pavlok-mvp.herokuapp.com/api/v1/sign_out?access_token=" + localStorage.accessToken;
	console.log("url for Sign Out is " + signOutURL)
	
	// Proper way of handling it in our server
	$.post(signOutURL)
		.done(function(data){
			console.log("Signed out. Data is: " + JSON.stringify(data) + " !");
			// location.reload();
		})
		.fail(function(){
			console.log("Failed to sign out")
			// location.reload();
		});
	// Destroy login data
	localStorage.setItem('logged', 'false');
	destroyToken();
	
	// Updates interface
	showOptions(localStorage.accessToken);
	UpdateBadgeOnOff();
	
	
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

function hideOptions(){ 
	var options = document.getElementById("optionsDiv");
	options.style.visibility = "hidden";
	return
}

function showName(name){
	if (name == 'undefined' || name == 'null' || name == undefined || name == null ) {
		console.log("SHOW NAME has username as undefined. Name is " + name)
		return
	}
	else {
		var userName = document.getElementById("userName");
		userName.style.visibility = "visible";
		userName.innerHTML = ", " + localStorage.userName;
		
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

function updateNameAndEmail(name, email){
	if ( $("#userName")) { $("#userName").html(name); }
	if ( $("#userEmail")) { $("#userEmail").html(email); }
}
//
function enableTooltips(){
	$(function() {
		// Makes possible to use HTML inside the tittle
		 $(document).tooltip({
            content: function() {
                var element = $( this );
                if ( element.is( "[title]" ) ) {
                    return element.attr( "title" );
                }

            },
            position: { my: "left bottom-3", at: "center top" } 
			});
	});	
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

function now(){
	
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
	
	if ( usage == "localMVP" ) {
		var clientID = "cdf545447838ebca75037906fa76f65e078f39873c9a235f1f65ab3da0337300";
		var clientSecret = "220898a0635c04696dd3aab7b6990b6735cc7fc2817eed5be9f1bb1b5063e288";
	}
	else if (usage == "localSTAGE") {
		var clientID = "0dff824cc4af8db17a939c231fc17585b35409707c3a1a5308ef1e04733c9bd7";
		var clientSecret = "a142a925c1abe2cc8bfdfd4481707f0f7fec4af89baa3929259b1079adbf72c2";
	}
	else if ( usage == "testMVP" ){
		var clientID = "7258a54f6366824c3838bc5b4dd47181307b025dab913d45824f49af17815514";
		var clientSecret = "abefe55aebdd664462e4e36a534ebed68eb27333612d822eb316aa7f525f73a3";
	}
	else if (usage == "testSTAGE") {
		clientID = "5e2fac7b1dd2b76aae014dd197daee094bc10d9759e5fda2e5c656449f00d8a4";
		clientSecret = "a08b1088b0c0090da308199e959a2f5753a133babfb05ff259674b64c4920227";
	}
	else if ( usage == "productionSTAGE" ){
		var clientID = "57267f5569ea936fb30c53e77ec617b4272f1b7001a23a0995d252c0487855c2";
		var clientSecret = "f05083a0974ce75a945a146b7be2a4493c754b1ca44ca627f0aa0c33df53b673";
	}
	else if ( usage == "productionMVP" ) {
		var clientID = "24d3e11fd9b64098732724c7e0364e6b57155789405f08fa52d2fc70a62fd273";
		var clientSecret = "1d18bafb082c4c10ff195a3f3b4c899e52018733392a09102d582e6df0273696";
	}
	
	var authURL = localStorage.baseAddress + "oauth/authorize?" + 
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
			accessTokenUrl = localStorage.baseAddress + '' + "/oauth/token?" + 'client_id=' + clientID +  '&client_secret=' + clientSecret + '&code=' + authorizationCode + '&grant_type=authorization_code' + '&redirect_uri=' + redirectURL;
			
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
						showOptions(accessToken);
						userInfo(accessToken);
					});
					console.log("OAuth2 test concluded");
				});
		}
	);	
}

function rescueTimeOAuth() { 
	var redirectURL = chrome.identity.getRedirectURL();
	// Local
	var clientID = "c78f8ede283287e0ffc3";
	var clientSecret = "ce1f6b4bfad9663af02053155d42185c6de2c72b";
	var scope = 'user';
	var state = randomString(12);
	
	var authURL = "https://github.com/login/oauth/authorize?" + 
		'client_id=' + clientID +
		'&redirect_uri=' + redirectURL +
		'&scope=' + scope +
		'&state=' + state;
	
	console.log("Step 1: Redirect URL is: " + redirectURL);
	
	chrome.identity.launchWebAuthFlow(
		{url: authURL, interactive: true},
		
		function(responseUrl) {
			// Get Auth code
			console.log("Step 2: Response url with code is:" + responseUrl);
			authorizationCode = responseUrl.substring(responseUrl.indexOf("=")+1);
			console.log("Step 3: Authorizaion code is: " + authorizationCode);
			
			// Exchange AuthCode for Access Token:
			accessTokenUrl = 'https://github.com/login/oauth/access_token?' + 
			'client_id=' + clientID +  
			'&client_secret=' + clientSecret + 
			'&code=' + authorizationCode + 
			'&redirect_uri=' + redirectURL;
			'&state=' + state;
			
			console.log("Step 4: Access token Url is: " + accessTokenUrl);
			
			$.post(accessTokenUrl)
				.done(function (data) {
					console.log(data);
					var accessToken = data.split("=")[1];
					localStorage.setItem('loggedRT', 'true');
					localStorage.setItem('accessTokenRT', accessToken);
					
					$("#rescueTimeData").html($.get("https://api.github.com/user?access_token=" + localStorage.accessTokenRT));
					
					
				});
			
			console.log("OAuth2 test concluded");
			
		}
	);	
}


function destroyToken(){
  localStorage.setItem('accessToken', 'null');
}

function userInfo(accessToken) { 
	$.get(localStorage.baseAddress + 'api/v1/me?access_token=' + accessToken)
		.done(function (data) {
			var dude = JSON.stringify(data, null, 4);
				console.log('User info for ' + data.name + ' succeeded. \nHis UID is:' + data.uid);
				localStorage.setItem('userEmail', data.email)
				localStorage.setItem('userName', data.name);
				updateNameAndEmail(localStorage.userName, localStorage.userEmail);
				return data.name;
		})
		.fail(function(){
			console.log('User information request failed');
		});
}

function stimuli(stimuli, value, accessToken, textAlert, forceNotify) {
	var notify = true;
	if (!textAlert){ textAlert = "Incoming " + stimuli; }
	
	if ( stimuli == 'beep' && localStorage.notifyBeep == 'false' ) { notify = false; }
	else if ( stimuli == 'vibration' && localStorage.notifyVibration == 'false' ) { notify = false; }
	else if ( stimuli == 'shock' && localStorage.notifyZap == 'false' ) { notify = false; }
	else if ( forceNotify == 'false' ) { notify = false; }
	else if ( forceNotify == 'true' ) { notify = true; }
	
	if (notify) { alert(textAlert); }
	
	postURL = 	localStorage.baseAddress + 'api/v1/stimuli/' + 
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

function randomString(characters){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < characters; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function genericOAuth(clientID, clientSecret, authURL, tokenURL, callback){
	var redirectURL = chrome.identity.getRedirectURL();
	var state = randomString(12);
	
	// var authURL = "https://github.com/login/oauth/authorize?" + 
		// 'client_id=' + clientID +
		// '&redirect_uri=' + redirectURL +
		// '&scope=' + scope +
		// '&state=' + state;
	
	console.log("Step 1: Redirect URL is: " + redirectURL);
	
	chrome.identity.launchWebAuthFlow(
		{url: authURL, interactive: true},
		
		function(responseUrl) {
			// Get Auth code
			console.log("Step 2: Response url with code is:" + responseUrl);
			authorizationCode = responseUrl.substring(responseUrl.indexOf("=")+1);
			console.log("Step 3: Authorizaion code is: " + authorizationCode);
			
			// Exchange AuthCode for Access Token:
			accessTokenUrl = tokenURL;
			console.log("Step 4: Access token Url is: " + accessTokenUrl);
			
			$.post(accessTokenUrl)
				.done(function (data) {
					console.log(data);
					localStorage.lastOAuthData = data;//JSON.strigigy(data);
					var accessToken = data.split("=")[1];
					localStorage.setItem('oauthSuccess', 'true');
					localStorage.setItem('lastAccessToken', accessToken);
					localStorage.setItem('lastAccessToken', accessToken);
					
					
					console.log("OAuth2 test concluded");
				})
				.fail(function() {
					console.log("OAuth failed.")
				});
		}
	);
	if (localStorage.oauthSuccess == 'true' ){
		return localStorage.lastAccessToken
	}
}


/*--------------------------------------------------------------------------*/
/*--------------------------------------------------------------------------*/
/*--------															--------*/
/*--------						5.Data Treatment					--------*/
/*--------															--------*/
/*--------------------------------------------------------------------------*/
/*--------------------------------------------------------------------------*/

