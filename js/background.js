/* To-do:
- DRY code


*/
// Globals
var curPAVTab, curPAVUrl, curPAVDomain, _result, timeBegin;
var elapsedTime = 0;
var counter = false;
var situation = {};
var timeWindow;
var myAudio = new Audio('../Audio/focus1min.mp3');
var playing = false;

// var maxTabs = parseInt(localStorage.maxTabs);
var previousTabs = 0;
var RTTimeOut;
var testInterval;

var defAT = '';
var defInt = '';
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
var msgBlacklisted = ["BLACKLISTED SITE!!!", "Watch out! You have " + localStorage.timeWindow + " seconds before the zap! Outta here! Fast!", "blacklisted", ""];
var msgZaped = ["Ouch!", "Too much time on blacklisted sites! Hurry outta here! Another zap is coming in " + localStorage.timeWindow + " secs!", ""];


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
// RescueTime Integration
function validateTimeOut(RTTimeOut){
	if (RTTimeOut == undefined) { RTTimeOut = false }
	else if (RTTimeOut == 'false' ) { RTTimeOut = false }
	else if (RTTimeOut == false ) { RTTimeOut = false }
	else if ( parseInt(RTTimeOut) > 0 ) { RTTimeOut = parseInt(RTTimeOut) }
	
	return RTTimeOut
}

function createTimeout(){
	fireRescueTime(localStorage.RTAPIKey);
	var x = setTimeout(function(){
		
		
		// Clearing up
		RTTimeOut = false;
		localStorage.RTTimeOut = false;
		// alert("Timeout Ended");
	}, parseInt(localStorage.RTFrequency) * 60 * 1000); // Gotta put this on 3 minutes
	localStorage.RTTimeOut = x;
	return x
}

function fireRescueTime(APIKey){
	requestAddress = "https://www.rescuetime.com/anapi/current_productivity_pulse.json?key=" + APIKey;
	localStorage.RTAPIKey = APIKey;
	
	console.log("get request to\n" + requestAddress);
	$.get(requestAddress)
	.done(function (data) {
		localStorage.RTPulse = data.pulse;
		localStorage.RTHour = data.comment.split(" ")[9];
		localStorage.Comment = data.comment;
		
		console.log("Productivity pulse from 30 minutes before " + localStorage.RTHour + "is " + data.pulse)
		
		var prod = data.pulse;
		if ( prod == 0 || prod == null || prod == 'null') { return }
		else if (prod < parseInt(localStorage.RTNegLimit)) { 
			notifyUser("Wake up, folk!", "Pulse of " + localStorage.RTPulse + " is bad! Time to get on track!", "RTNotify");
			stimuli("shock", localStorage.zapIntensity, localStorage.accessToken, "Incoming Zap. Time to get on track!");
		}
		else if (prod < parseInt(localStorage.RTWarnLimit)) { 
			notifyUser("Come on, you can do better!", "Pulse of " + localStorage.RTPulse + " ain't bad, but you are better than that!", "RTNotify");
			stimuli("beep", 4, localStorage.accessToken, "Incoming Beep. Come on, you can do better!!!");
		}
		else if (prod > parseInt(localStorage.RTPosLimit)){
			notifyUser("Whoohoo!!! On fire!", "Pulse of " + localStorage.RTPulse + " is damn solid! Rock on!", "RTNotify");
			stimuli("vibration", 255, localStorage.accessToken, "You rock! Let Pavlok massage your wrist a bit!");
		}
		else if (prod < parseInt(localStorage.RTPosLimit)){
			notifyUser("Way to go!", "Pulse of " + localStorage.RTPulse + " a good start! Keep improving!", "RTNotify");
		}
		
		
		return data.pulse
	})
	.fail(function(){
		resultHolder.text("Failed");
		console.log("BAD key. Fails on API.");
		localStorage.removeitem['RTAPIKey'];
		return false
	});
}

// Black List
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
			// console.log(curTabURL + " is not blacklisted");
			return false
		}
		
	
	var _result = localStorage.blackListEval;
	_result = ( _result === "true" ); // converts string to boolean
	return _result
}

// Tab counting
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
				stimuli("shock", localStorage.zapIntensity, localStorage.accessToken, "Incoming Zap. Too many tabs");
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

// Notifications
function notifyTabCount(tabs, situation){
	var notTitle = "";
	var notMessage = "";
	var notID = ""
	
	if ( situation.status == "over"){
		notTitle = msgTooManyTabs[0];
		notID = "tooManyTabs";
		if(situation.trend != "lowering" ){ 
			notMessage = "You opened more than " + localStorage.maxTabs + " tabs! Close them down and keep your sanity!";
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

// General use
function convert12To24(time){
	if (time.indexOf("AM") == -1 && time.indexOf("PM") == -1) { return time }
	
	hour = parseInt(time.split(":")[0]);
	minute = time.split(":")[1].split(" ")[0];
	code = time.split(":")[1].split(" ")[1];

	if (code == "PM") { hour = hour + 12;}
	
	return hour + ":" + minute
}

function checkActiveDayHour(){
	var now = new Date();
	var start = localStorage.generalActiveTimeStart;
	var end = localStorage.generalActiveTimeEnd;
	// console.log("Now is: " + now + "\nStarts at: " + start + "\nEnds at: " + end);
	start = convert12To24(start);
	end = convert12To24(end);
	
	var dayActive = checkActiveDay(now);
	var hourActive = checkActiveHour(start, end);
	// console.log("So, active day is " + dayActive + " and hour activity is " + hourActive);
	
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

/*---------------------------------------------------------------------------*/
/*---------------------------------------------------------------------------*/
/*--------                                                           --------*/
/*--------                     RescueTime Section                    --------*/
/*--------                                                           --------*/
/*---------------------------------------------------------------------------*/
/*---------------------------------------------------------------------------*/

function rescueTimeChecker(){
	if (localStorage.RTAPIKey) {
		RTTimeOut = validateTimeOut(RTTimeOut);
		if (RTTimeOut){
			if (localStorage.RTOnOffSelect == "Off") {
				// StopTimer
				clearInterval(RTTimeOut);
				RTTimeOut = false;
				localStorage.RTTimeOut = false;
			}
		}
		else {
			if (localStorage.RTOnOffSelect == "On") {
				RTTimeOut = createTimeout(); // Start Timer
			}
		}
	}
}

/*---------------------------------------------------------------------------*/
/*---------------------------------------------------------------------------*/
/*--------                                                           --------*/
/*--------                       To-Do Section                       --------*/
/*--------                                                           --------*/
/*---------------------------------------------------------------------------*/
/*---------------------------------------------------------------------------*/

function savePomoFocusB(pomoFocusB){
	pomoFocusB.lastUpdate = new Date();
	// localStorage.pomoFocusB = JSON.stringify(pomoFocusB);
	// localStorage.pomoFocusB = JSON.stringify('pomoFocusB');
	savePomoFocus(pomoFocusB, 'background');
	localStorage.changedPart = 'To-Do';
	return pomoFocusB
}

function playAudio(){
	if (playing == false){
		myAudio = new Audio('../Audio/focus1min.mp3');
		myAudio.addEventListener('ended', function() {
			this.currentTime = 20;
			this.play();
		}, false);
		
		myAudio.play();
		playing = true;
	}
}

function stopAudio(){
	myAudio.pause();
	myAudio.currentTime = 0;
	playing = false;
}

function shortCount(){
	var pomoFocusB = JSON.parse(localStorage.pomoFocusB);
	pomoFocusB.endTime = deltaTime(5).getTime();
	savePomoFocusB(pomoFocusB);
}

function checkForAudio(){
	var audioAddress = '../audio/focus1min.mp3';
	var pomoFocusB = JSON.parse(localStorage.pomoFocusB);
	var now = deltaTime(0).getTime();
	
	if (pomoFocusB.endTime > now && pomoFocusB.audio == true){
		playAudio();
	}
	else {
		stopAudio();
	}
}

function equalizePomoFocus(latest){
	localStorage.pomoFocusB = JSON.stringify(latest);
	localStorage.pomoFocusO = JSON.stringify(latest);
	localStorage.pomoFocusP = JSON.stringify(latest);
}

function updateCountdown(){
	fixNoEndTime();
	var pomoFocusB = getPomoFocus('background');
	var clockDiv = $('#pomoFocusRemainingTime');
	var taskSpan = $('#pomoFocusTask');
	
	$(clockDiv).countdown(pomoFocusB.endTime, function(event) {
		$(this).html(event.strftime('%M:%S'));
	});
}

function checkForUpdate(){
	// Retrieves both objects and compare then. The most recently updated one overrides the older one and triggers countdown with updated values
	var oCounter = getPomoFocus('options');
	var pCounter = getPomoFocus('popup');
	var bCounter = getPomoFocus('background');
	
	if (oCounter.lastUpdate == pCounter.lastUpdate && pCounter.lastUpdate == bCounter.lastUpdate) { return }
	else {
		// Gather data from the windows and compare to get the latest one. Others follow it.
		var countersArray = [ oCounter, pCounter, bCounter ];
		var indexesArray = [0, 1, 2];
		
		var lastUpdateArray = [ oCounter.lastUpdate, pCounter.lastUpdate, bCounter.lastUpdate ];
		var maxIndex = lastUpdateArray.indexOf(Math.max.apply(null, lastUpdateArray));
		
		// Capture the latest and the others as separate. Others become equal to latest
		latest = countersArray[maxIndex];
		indexesArray.splice(maxIndex, 1);
		
		for (c = 0; c < indexesArray.length; c++){
			countersArray[indexesArray[c]] = latest;
		}
		
		equalizePomoFocus(latest);
		updateCountdown();
	}
}

function createPomoFocusCountDown(){
	pomoFocusB = getPomoFocus('background');
	var endDate = dateFromTime(pomoFocusB.endTime);
	
	var clockDiv = $('#pomoFocusRemainingTime');
	var taskSpan = $('#pomoFocusTask');
	
	var timer = $(clockDiv).countdown(endDate, function(event) {
		$(this).html(event.strftime('%M:%S'));
	})
	.on('finish.countdown', function(event) {
		stimuli("shock", defInt, defAT, "Pomodoro ended, but task didn't");
		console.log("PomoFocus ended");
		pomoFocusB.audio = false;
		savePomoFocus(pomoFocusB, 'background');
		PFpromptForce = true;
	});
}

var countDownSafetyCheck = setInterval(function(){ updateCountdown();}, 2000);
var testInt = setInterval(function(){ 
	checkForUpdate();
	checkForAudio();
	}, 100);
$( document ).ready( function() { updateCountdown(); });



/*---------------------------------------------------------------------------*/
/*---------------------------------------------------------------------------*/
/*--------                                                           --------*/
/*--------                     Tabs and Blacklist                    --------*/
/*--------                                                           --------*/
/*---------------------------------------------------------------------------*/
/*---------------------------------------------------------------------------*/


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
			notifyUser(msgBlacklisted[0], "Watch out! You have " + localStorage.timeWindow + " seconds before the zap! Outta here! Fast!", "blacklisted", "blacklisted");
			
			now = new Date();
			
			// Calculate time delta from timer begin and now. It"s then converted from miliseconds to deciseconds (for rouding) and finally to seconds.
			elapsed = (now - timeBegin) / 100;
			elapsed = Math.round(elapsed) / 10;
			
			document.title = elapsed + "s on blackList"; // Debug. Shows on background.html
			
			if (elapsed >= parseInt(timeWindow)){
				notifyUser(msgZaped[0], msgZaped[1], "zapped");
				stimuli("shock", localStorage.zapIntensity, localStorage.accessToken);
				
				timeBegin = new Date();
			}
		}
		else {
			counter = true;
			notifyUser(msgBlacklisted[0], "Watch out! You have " + localStorage.timeWindow + " seconds before the zap! Outta here! Fast!", "blacklisted", "blacklisted");
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

initialize();

$( document ).ready(function() {
	testInterval = setInterval(
		function(){
			if (checkActiveDayHour() == true) {
				if (isValid(localStorage.accessToken)){
					timeWindow = localStorage.timeWindow;
					getTabInfo(evaluateTabURL);
					rescueTimeChecker();
					RTTimeOut = localStorage.RTTimeOut;
					chrome.windows.getLastFocused(function(win) {
						UpdateTabCount(win.windowId);
					});
				}
			} else {
				UpdateBadgeOnOff("Zzz");
			}
		}
	,100);
	createPomoFocusCountDown();
});
