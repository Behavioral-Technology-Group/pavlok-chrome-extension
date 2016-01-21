/* Summary 

1.Validation and Authentication
2.Interface updating
3.Evaluation
4.API conversation

*/


/*---------------------------------------------------------------------------*/
/*---------------------------------------------------------------------------*/
/*--------                                                           --------*/
/*--------             1.Validation and Authentication               --------*/
/*--------                                                           --------*/
/*---------------------------------------------------------------------------*/
/*---------------------------------------------------------------------------*/

function isValid(token){
	if (token == "null" || token == undefined || token === "undefined"){
		console.log("Access Token went bad. Token is " + token);
		localStorage.setItem('logged', 'false');
	return false;
	} else {
		// console.log("Access Token went good. It is " + token);
		localStorage.setItem('logged', 'true');

		return true;
	}
}


/*---------------------------------------------------------------------------*/
/*---------------------------------------------------------------------------*/
/*--------                                                           --------*/
/*--------                 2.Interface updating                      --------*/
/*--------                                                           --------*/
/*---------------------------------------------------------------------------*/
/*---------------------------------------------------------------------------*/

// Background
function UpdateBadge(count) {
	var logged = isValid(localStorage.accessToken);
	
	if (logged == true){
		chrome.browserAction.setIcon({path: 'images/logo_128x128.png'})
		chrome.browserAction.setBadgeBackgroundColor({ color: [38, 25, 211, 255] });
		chrome.browserAction.setBadgeText({ text: count.toString() + "/" + localStorage.maxTabs });
		
	}
	else{
		chrome.browserAction.setIcon({path: 'images/off_128x128.png'});
		chrome.browserAction.setBadgeBackgroundColor({ color: [100, 100, 100, 130] });
		chrome.browserAction.setBadgeText({ text: "Off" });
	}
}

function UpdateTabCount(windowId) {
	chrome.tabs.getAllInWindow(windowId, function(tabs) {
		UpdateBadge(tabs.length);
		localStorage[windowId] = tabs.length;
	});
}

function hideSignIn(){ // checked. Working fine
	$('#sign_in').hide();
}

function showSignOut(){ // checked. Complains, but works. Says #signOut is not defined
	$('#sign_out').html("<a href='#' class='sign_out'>Sign Out!</a>")
	.click(signOut);
}

function signOut(){ // checked. Working, but should probably be merged with destroy token
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

function showOptions() { // Working fine. Merged with save_tags
	var logged = localStorage.logged;
	console.log(logged);
	if ( logged == "true"){
		var options = document.getElementById("optionsDiv");
		options.style.visibility = "visible";
		return
	}
	else{
		var options = document.getElementById("optionsDiv");
		options.style.visibility = "hidden";
		return
	}
}

function hideOptions(){ // Working fine. Merged with save_tags
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

function adjustOverInteractions(token, userName) {
	if (isValid(token)) {
		hideSignIn();
		showSignOut();
		showOptions();
		showName(userName);
	}
	else {
		hideOptions();
		hideName();
	}
	return
}

/*---------------------------------------------------------------------------*/
/*---------------------------------------------------------------------------*/
/*--------																													 --------*/
/*--------										 3.Evaluation													--------*/
/*--------																													 --------*/
/*---------------------------------------------------------------------------*/
/*---------------------------------------------------------------------------*/


function CountTabs(windowId){
	chrome.tabs.getAllInWindow(windowId, function(tabs) {
		return tabs.length;
	});
}




/*---------------------------------------------------------------------------*/
/*---------------------------------------------------------------------------*/
/*--------																													 --------*/
/*--------									4.API conversation											 --------*/
/*--------																													 --------*/
/*---------------------------------------------------------------------------*/
/*---------------------------------------------------------------------------*/

function save_options() { // Working fine. Merged with save_tags
	var select = document.getElementById("maxtab");
	var no_of_tabs = select.children[select.selectedIndex].value;
	localStorage.maxTabs = no_of_tabs;
	
	var blackList = document.getElementById("blackList").value;
	localStorage.blackList = blackList;
	
	var whiteList = document.getElementById("whiteList").value;
	localStorage.whiteList = whiteList;
	
	var status = document.getElementById("status");
	status.style.visibility = "visible";
	status.innerHTML = "Option saved successfully!";
	
	console.log('Options saved');
	setTimeout(function() {
		status.innerHTML = "";
	status.style.visibility = "hidden";
	}, 2300);
}

// https://pavlok.herokuapp.com/api/v1/stimuli/beep/4/?access_token=1132bd06f21132eeaed6e9dc24c7cf280f307f026663f1fc92b128315ea41810

function stimuli(stimuli, value, accessToken) { // checked. Working fine

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
			objectCode = localStorage.objectCode;
			if (stimuli == "vibration") { stimuli = "vibro"; }
			console.log(stimuli + ' failed!\nUrl was: ' + postURL + "\nTrying the old API at: ");
			$.get('https://pavlok.herokuapp.com/api/' + objectCode + '/' + stimuli + '/' + intensity);
			
			return 
		});	
}