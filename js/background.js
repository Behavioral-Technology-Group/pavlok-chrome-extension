﻿/* To-do:
- get values for stimuli from our server, instead of hardcoding it


*/
// Globals
var curPAVTab, curPAVUrl, curPAVDomain, _result, timeBegin;
var elapsedTime = 0;
var counter = false;
var timeWindow = 5;
var situation = {};
// var maxTabs = parseInt(localStorage.maxTabs);
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
var msgTooManyTabs = ["OUCH! Too Many Tabs", "You opened more than " + localStorage.maxTabs + " tabs! Close them down and keep your sanity!" , "Yeap! Keep on closing them!"];
var msgBorderlineTabs = ["Tabs limit approaching", "Keep them at bay and watch out for new tabs!", "Safe zone!"]
var msgLimitTabs = ["Tabs limit reached!", "You're on the verge! Open no more tabs! Stay true to yourself!", "Back to safety, but still on the limit!"]

// For Blacklisted sites
var msgBlacklisted = ["BLACKLISTED SITE!!!", "Watch out! You have " + timeWindow + " seconds before the zap! Outta here! Fast!", "blacklisted", ""];
var msgZaped = ["Ouch!", "Too much time on blacklisted sites! Hurry outta here! Another zap is coming in " + timeWindow + " secs!", ""];


var accessToken = localStorage.accessToken;

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

function convert12To24(time){
	if (time.indexOf("AM") == -1 && time.indexOf("PM") == -1) { return time }
	
	hour = parseInt(time.split(":")[0]);
	minute = time.split(":")[1].split(" ")[0];
	code = time.split(":")[1].split(" ")[1];

	if (code == "PM") { hour = hour + 12;}
	
	return hour + ":" + minute
}

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

function clearNotifications(){
	chrome.notifications.clear("firstWarning");
	chrome.notifications.clear("secondWarning");
	chrome.notifications.clear("relief");
	chrome.notifications.clear("blacklisted");
	chrome.notifications.clear("zapped");
}

function CheckBlackList(curTabURL, curTabDomain) {
	
	var _result = "";
	var _whiteList = localStorage.whiteList.split(",");
	var _blackList = localStorage.blackList.split(",");
		
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
	_result = ( _result === "true" ); // converts string to boolean
	return _result
}

function CheckTabCount(tab, token, stimulus) { // checked. All working fine
	if (isValid(token) && checkActiveDayHour()){
		chrome.tabs.getAllInWindow(tab.windowId, function(tabs, callback) {
			var maxTabs = parseInt(localStorage.maxTabs);
			if(!maxTabs) {
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
			
			// How is number of tabs compared to tab limit (maxTabs)?
			if(tabs.length > maxTabs) {
				situation.status = "over";
				stimuli("shock", 180, localStorage.accessToken, "Incoming Zap. Too many tabs");
				console.log("total tabs over max tabs");
			}
			else if (tabs.length == maxTabs ){ 
				situation.status = "limit";
				stimuli("beep", 3, localStorage.accessToken, "Incoming Beep. You're at the limit on tabs");
			 
			}
			else if (tabs.length == maxTabs - 1){ 
				situation.status = "borderline";
				// stimuli("vibration", 230, localStorage.accessToken);
				stimuli("vibration", 230, localStorage.accessToken, "Incoming vibration. You're nearing the limit on tabs");
			}
			else { situation.status = "wayBellow"};
			
			previousTabs = tabs.length;
			notifyTabCount(tabs.length, situation);
		});
	}
}

function notifyTabCount(tabs, situation){
	var notTitle = "";
	var notMessage = "";
	var notID = ""
	
	if ( situation.status == "over"){
		notTitle = msgTooManyTabs[0];
		notID = "tooManyTabs";
		if(situation.trend != "lowering" ){ 
			// notMessage = msgTooManyTabs[1]; // Variable is being set at startup, but ain't updated after that. So it's being called manually here, to match latest maxTabs
			notMessage = "You opened more than " + localStorage.maxTabs + " tabs! Close them down and keep your sanity!";
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

function checkActiveDayHour(){
	var now = new Date();
	var start = localStorage.generalActiveTimeStart;
	var end = localStorage.generalActiveTimeEnd;
	console.log("Now is: " + now + "\nStarts at: " + start + "\nEnds at: " + end);
	start = convert12To24(start);
	end = convert12To24(end);
	
	var dayActive = checkActiveDay(now);
	var hourActive = checkActiveHour(start, end);
	console.log("So, active day is " + dayActive + " and hour activity is " + hourActive);
	
	if (dayActive == true && hourActive == true) { return true }
	else { return false }
}

function checkActiveDay(date){	
	// Creates a list of active days from local Storage
	var activeDaysList = [];
	if (localStorage.sundayActive == 'true') { activeDaysList.push(0); }
	if (localStorage.mondayActive == 'true') { activeDaysList.push(1); }
	if (localStorage.tuesdayActive == 'true') { activeDaysList.push(2); }
	if (localStorage.wednesdayActive == 'true') { activeDaysList.push(3); }
	if (localStorage.thursdayActive == 'true') { activeDaysList.push(4); }
	if (localStorage.fridayActive == 'true') { activeDaysList.push(5); }
	if (localStorage.saturdayActive == 'true') { activeDaysList.push(6); }
	
	// Checks if current day is set as active
	if ( activeDaysList.indexOf(date.getDay()) != -1 ) { return true } 
	else { return false}
}
	
function checkActiveHour(start, end){	// start and End are for debugging
	// Checks if it's on an active day
	var now = new Date();
	
	// Checks if it's on an active hour
	var testHourStart = start;			// localStorage.xActiveStart
	var testHourEnd = end;				// localStorage.xActiveEnd
	
	// New dates using today, but with begin and end times set
	var begin = new Date();
	begin.setHours(parseInt(testHourStart.split(":")[0]));
	begin.setMinutes(parseInt(testHourStart.split(":")[1]));
	begin.setSeconds(0);
	begin.setMilliseconds(0);
	
	var end = new Date();
	end.setHours(parseInt(testHourEnd.split(":")[0]));
	end.setMinutes(parseInt(testHourEnd.split(":")[1]));
	end.setSeconds(0);
	end.setMilliseconds(0);
	
	// Evaluation
	if (begin < now && now < end) { return true }
	else { return false }
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

	
	// When new tab is created
	chrome.tabs.onCreated.addListener(function(tab) {
		CheckTabCount(tab, accessToken, "shock");
	});

	// When tab is removed
	chrome.tabs.onRemoved.addListener(function(tab) {
		if ( localStorage.zapOnClose == 'true' ){
			CheckTabCount(tab, accessToken, "shock");
		}
		else{
			console.log("zapOnClose is " + localStorage.zapOnClose + " so no zap.");
			// CheckTabCount(tab, "falseToken", 'no stimuli');
		}
	});

	// When tab is detached
	chrome.tabs.onDetached.addListener(function(tab) {
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
	UpdateBadgeOnOff("1/3");
	var accessToken = localStorage.getItem("accessToken");
	
	CreateTabListeners(accessToken);
}

function getTabInfo(callback){
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
		curPAVTab = tabs[0];
		curPAVUrl = tabs[0].url;
		curPAVDomain = new URL(curPAVUrl).hostname.replace("www.", "");
		
		if(curPAVDomain.length == 0){
			console.log("unable to resolve domain for " + curPAVUrl);
			curPAVDomain = curPAVUrl;
		}
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
				stimuli("shock", 160, localStorage.accessToken);
				
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
		if (checkActiveDayHour() == true) {
			if (isValid(localStorage.accessToken)){
				getTabInfo(evaluateTabURL);
				
				chrome.windows.getLastFocused(function(win) {
					UpdateTabCount(win.windowId);
				});
			}
		} else {
			UpdateBadgeOnOff("Zzz");
		}
	}
,100);

initialize();