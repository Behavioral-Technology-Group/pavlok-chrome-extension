// To-do: get values for stimuli from our server, instead of hardcoding it
// To-do: implement object code question

// Globals
var curPAVTab, curPAVUrl, curPAVDomain, _result, timeBegin;
var elapsedTime = 0;
var counter = false;
var timeWindow = 5;
var situation = {};
var maxTabs = parseInt(localStorage.maxTabs);
var previousTabs = 0;
var curTimeOut;

/*---------------------------------------------------------------------------*/
/*---------------------------------------------------------------------------*/
/*--------                                                           --------*/
/*--------                Messages for notifications.                --------*/
/*--------                                                           --------*/
/*---------------------------------------------------------------------------*/
/*---------------------------------------------------------------------------*/
// First item is title. 
// Segond is the message itself if tabs are *not* being closed. 
// Third is message if tabs are being closed.

// For tab numbers
var msgTooManyTabs = ["Too Many Tabs", "You openned more than " + maxTabs + " tabs! Hurry, you still have " + timeWindow + " seconds before the zap! Close them down!" , "Yeap! Keep on closing them!"];
var msgBorderlineTabs = ["Tabs limit approaching", "Keep them at bay and watch out for new tabs!", "Safe zone!"]
var msgLimitTabs = ["Tabs limit reached!", "You're on the verge! Open no more tabs! Stay true to yourself!", "Back to safety, but still on the limit!"]

// For Blacklisted sites
var msgBlacklisted = ["BLACKLISTED SITE!!!", "Watch out! You have " + timeWindow + " seconds before the zap! Outta here! Fast!", "blacklisted", ""];
var msgZaped = ["Ouch!", "Too much time on blacklisted sites! Hurry outta here! Another zap is coming in " + timeWindow + " secs!", ""];


var accessToken = localStorage["accessToken"]

/* Logic of timer
	Timer is supposed to give a breathing chance to users. Instead of zapping right away, once a bad trigger is set, it will begin a countdown of 10 seconds.
	
	If user still doing bad behavior, zap will get done. If not, timer is reset and stopped.
	
	NOT doing the bad behavior can be either:
		- Moving to a non-blacklisted URL (changing tab, going to another page)
		- Closing the browser
		- Activating some window other than browser
		
*/

/*---------------------------------------------------------------------------*/
/*---------------------------------------------------------------------------*/
/*--------                                                           --------*/
/*--------                      Helper Functions                     --------*/
/*--------                                                           --------*/
/*---------------------------------------------------------------------------*/
/*---------------------------------------------------------------------------*/

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

function logOnPage(message){
	
}

function clearNotifications(){
	chrome.notifications.clear("firstWarning");
	chrome.notifications.clear("secondWarning");
	chrome.notifications.clear("relief");
	chrome.notifications.clear("blacklisted");
	chrome.notifications.clear("zapped");
}

function CheckBlackList(curTabURL, curTabDomain) {
	
	var _result = "";
	var _whiteList = "www.estudoemdia.com.br/usuario"
	var _blackList = localStorage.blackList;
		
		// Checks for blackList.
		if (_blackList.indexOf(curTabDomain) != -1 && 
			_whiteList.indexOf(curTabURL) == -1){
				console.log(curTabURL + " is blacklisted");
				return true
		}
		else{
			console.log(curTabURL + " is not blacklisted");
			return false
		}
		
	
	var _result = localStorage.blackListEval;
	_result = ( _result === "true" ); // converst string to boolean
	return _result
}

function CheckTabCount(tab, token, stimulus) { // checked. All working fine
	
	chrome.tabs.getAllInWindow(tab.windowId, function(tabs, callback) {
		var maxtabs = parseInt(localStorage.maxTabs);
		if(!maxtabs) {
			return;
		}

		var previousTabs = localStorage[tab.windowId];
		console.log("There were " + previousTabs + " open on this window.");
		UpdateTabCount(tab.windowId);
		console.log("There are " + localStorage[tab.windowID] + " open on this window.");
		
		// Trends for tabs. Is it going up, going down or is it stable?
		if (previousTabs < tab.WindowID) { situation.trend = "lowering"; }
		else if ( previousTabs > tab.WindowID ) { situation.trend = "growing"; }
		else { situation.trend = "stable"; }
		
		
		if(tabs.length > maxtabs) {
			situation.status = "over";
			stimuli("vibro", 180, localStorage.accessToken);
			console.log("total tabs over max tabs");
		}
		
		else if (tabs.length == maxtabs ){ // Is this supposed to be "when user reaches his limit"
			situation.status = "limit";
			stimuli("beep", 3, localStorage.accessToken);
		 
		}
		else if (tabs.length == maxtabs - 1){ // Is this supposed to be "one less than limit"?
			situation.status = "borderline";
			stimuli("vibration", 230, localStorage.accessToken);
		}
		else { situation.status = "wayBellow"};
		
		previousTabs = tabs.length;
		
		notifyTabCount(tabs.length, situation);
	});

}

function notifyTabCount(tabs, situation){
	var notTitle = "";
	var notMessage = "";
	var notID = ""
	
	if ( situation.status == "over"){
		notTitle = msgTooManyTabs[0];
		notID = "tooManyTabs";
		if(situation.trend != "lowering" ){ 
			notMessage = msgTooManyTabs[1];
			// curTimeOut = setTimeout(function(){ stimuli("shock", 160, localStorage.accessToken}, timeWindow * 1000);
			}
		else { notMessage = msgTooManyTabs[1]; }
	} 
	
	else if (situation.status == "limit"){
		notTitle = msgLimitTabs[0];
		notID = "limitTabs";
		if (situation.trend != "lowering"){ notMessage = msgLimitTabs[1]; }
		else { notMessage = msgLimitTabs[2]; }
	}
	
	else if (situation.status == "borderline"){
		notTitle = msgBorderlineTabs[0];
		notID = "borderlineTabs";
		if (situation.trend != "lowering"){ notMessage = msgBorderlineTabs[1]; }
		else { notMessage = msgBorderlineTabs[2]; }
	}
	
	else if (situation.status == "wayBellow") { return }
	
	var toClear = ["tooManyTabs", "limitTabs", "borderlineTabs"];
	toClear = toClear.splice(toClear.indexOf(notID), 1);
	
	for (n = 0 ; n < toClear.length ; n ++){
		chrome.notifications.clear(toClear[n]);
	}
	
	notifyUser(notTitle, notMessage, notID);
}


/*---------------------------------------------------------------------------*/
/*---------------------------------------------------------------------------*/
/*--------                                                           --------*/
/*--------                  Logic and implementation                 --------*/
/*--------                                                           --------*/
/*---------------------------------------------------------------------------*/
/*---------------------------------------------------------------------------*/
var currentSite = null;
var currentTabId = null;
var siteRegexp = /^(\w+:\/\/[^\/]+).*$/;

function CreateTabListeners(token) {
	if(!localStorage.maxTabs) {
		localStorage.maxTabs = 6;
	}

	// When selected tab changes
	chrome.tabs.onActivated.addListener(function(tab) {
		CheckTabCount(tab, accessToken, "shock");
		}
	);
	
	// When new tab is created
	chrome.tabs.onCreated.addListener(function(tab) {
		CheckTabCount(tab, accessToken, "shock");
	});

	// When tab is removed
	chrome.tabs.onRemoved.addListener(function(tab) {
		CheckTabCount(tab, "wrongToken", "noStimuli"); // Stimuli will fail to avoid punishing for getting back on track
	});

	// When tab is detached
	chrome.tabs.onDetached.addListener(function(tab) {
	var token = localStorage.getItem("accessToken");
		CheckTabCount(tab, accessToken, "shock");
	});

	// When tab is attached
	chrome.tabs.onAttached.addListener(function(tab) {
		CheckTabCount(tab, accessToken, "shock");
	});

	// last windows focused
	chrome.windows.getLastFocused(function(win) {
		UpdateTabCount(win.windowId);
	});

	// When new window is created
	chrome.windows.onCreated.addListener(function(win) {
		UpdateTabCount(win.windowId);
	});

	// When focus on WHAT has changed?
	chrome.windows.onFocusChanged.addListener(function(win) {
		UpdateTabCount(win.windowId);
	});
	
}

function initialize() {
	chrome.runtime.onMessage.addListener(
		function(request, sender, sendResponse){
			 localStorage["accessToken"] = request.accessToken;
		});
	
	UpdateBadge(1);
	var accessToken = localStorage.getItem("accessToken");
	
	CreateTabListeners(accessToken);
}

function getTabInfo(callback){
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
		curPAVTab = tabs[0];
		curPAVUrl = tabs[0].url;
		curPAVDomain = new URL(curPAVUrl).hostname.replace("www.", "");
		
		// console.log("Tab " + curPAVTab + " has url " + curPAVUrl + " on domain " + curPAVDomain);
		
		document.title = curPAVTab.id + " " + curPAVTab.url; // Debug. Shows on background.html
		if (typeof callback === "function"){
			callback(curPAVTab, curPAVUrl, curPAVDomain);
		}
	});
}

function evaluateTabURL(curPAVTab, curPAVUrl, curPAVDomain, callback){
	_result = CheckBlackList(curPAVUrl, curPAVDomain);
	if(_result == true){
		if (counter == true){
			notifyUser(msgBlacklisted[0], msgBlacklisted[1], "blacklisted")
			
			now = new Date();
			
			// Calculate time delta from timer begin and now. It"s then converted from miliseconds to deciseconds (for rouding) and finally to seconds.
			elapsed = (now - timeBegin) / 100;
			elapsed = Math.round(elapsed) / 10;
			
			document.title = elapsed + "s on blackList"; // Debug. Shows on background.html
			
			if (elapsed >= timeWindow){
				notifyUser(msgZaped[0], msgZaped[1], "zapped");
				stimuli("vibrate", 160, localStorage.accessToken);
				
				// $.get("https://pavlok.herokuapp.com/api/nXFVA8v1e8/vibro/160");
				timeBegin = new Date();
			}
		}
		else {
			counter = true;
			timeBegin = new Date();
		}
	}
	else{
		elapsedTime = 0;
		timeBegin = null;
		clearNotifications();
		counter = false;
	}
}


var testInterval = setInterval(
	function(){
		if (isValid(localStorage.accessToken)){
			getTabInfo(evaluateTabURL);
		}
	}
,100);

initialize();
