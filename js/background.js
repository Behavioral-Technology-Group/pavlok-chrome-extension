

/* To-do:


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
			stimuli("shock", defInt, defAT, "Incoming Zap. Time to get on track!");
		}
		else if (prod < parseInt(localStorage.RTWarnLimit)) { 
			notifyUser("Come on, you can do better!", "Pulse of " + localStorage.RTPulse + " ain't bad, but you are better than that!", "RTNotify");
			stimuli("beep", defInt, defAT, "Incoming Beep. Come on, you can do better!!!");
		}
		else if (prod > parseInt(localStorage.RTPosLimit)){
			notifyUser("Whoohoo!!! On fire!", "Pulse of " + localStorage.RTPulse + " is damn solid! Rock on!", "RTNotify");
			stimuli("vibration", defInt, defAT, "You rock! Let Pavlok massage your wrist a bit!");
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
	var daily = lsGet('dailyPomo', 'parse');
	
	
	var locked = lsGet('lockZap');
	var lockedTo = lsGet('lockedTo');
	
	// Checks if it will use regular or daily black and whitelists
	if (locked == "true") {
		if (curPAVDomain != lockedTo ) { return true }
		else { return false }
	}
	
	if (daily && daily.specialList != false) {
		var _whiteList = daily.whiteList.split(",");
		var _blackList = daily.blackList.split(",");
	}
	else {
		var _whiteList = localStorage.whiteList.split(",");
		var _blackList = localStorage.blackList.split(",");
	}
		
	// Checks domain against BlackList and URL agains WhiteList
	if (_blackList.indexOf(curTabDomain) != -1 && 
		_whiteList.indexOf(curTabURL) == -1){
			console.log(curTabURL + " is blacklisted");
			return true
	}
	else{
		// console.log(curTabURL + " is not blacklisted");
		return false
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

function onUpdateAvailable(){
	chrome.runtime.onUpdateAvailable.addListener(function(version){
		notifyUser("We have a new version of the extension for you", "Hey buddy, we just released an update for the extension. It will be installed next time you close and open all chrome windows.", "updateAvaible");
	});
}

function onInstall(){
	chrome.runtime.onInstalled.addListener(function(notes){
		lsSet('notes', notes, 'string');
		lsSet('notes', notes, 'object');
		var reason = notes.reason;
		if (reason == "install"){
			notifyUser("Welcome aboard. Let's log in!", "Click here to log into Pavlok!", "installed");
		}
		else if (reason == "update"){
			notifyUser("Extension updated!", "Your Pavlok extension is now up to date!", "updated");
		}
	});
}

function notifyClicked(){
	chrome.notifications.onClicked.addListener(function(notId){
		if (notId == "installed"){
			oauth();
		}
		else if (notId == "signedIn"){
			openOptions();
		}
	});
}

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

function checkForAudio(){
	var audioAddress = '../audio/focus1min.mp3';
	var pomoFocusB = lsGet('pomoFocusB', 'parse');
	var now = deltaTime(0).getTime();
	
	if (pomoFocusB.endTime > now && pomoFocusB.audio == true){
		playAudio();
	}
	else {
		stopAudio();
	}
}



function updateCountdownBack(latest){
	fixNoEndTime();
	if (!latest){ var pomoFocusB = getPomoFocus('background'); }
	else { var pomoFocusB = latest; }
	var clockDiv = $('#pomoFocusRemainingTime');
	var taskSpan = $('#pomoFocusTask');
	
	$(clockDiv).countdown(pomoFocusB.endTime, function(event) {
		$(this).html(event.strftime('%M:%S'));
	})
	.on('finish.countdown', function(event) {
		
		if (localStorage.endReason == 'time') {
			var NotList = lsGet('notifications', 'parse');
			var Not = NotList.pomofocusEnded;
			notifyUser(Not.title, Not.message, Not.id);
			stimuli("vibration", defInt, defAT, Not.title + " " + Not.message);
		}
		
		console.log("PomoFocus ended");
		pomoFocusB = lsGet('pomoFocusB', 'parse');
		pomoFocusB.audio = false;
		pomoFocusB.active = false;
		savePomoFocus(pomoFocusB, 'background');
		PFpromptForce = true;
		localStorage.instaZap = 'false';
		lsDel('lockZap');
	});
}

function checkForUpdateBack(){
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
		
		console.log(maxIndex);
		equalizePomoFocus(latest);
		updateCountdownBack(latest);
	}
}

function createPomoFocusCountDownBack(){
	pomoFocusB = getPomoFocus('background');
	pomoFocusB.endReason = 'time';
	if (localStorage.endReason == 'time' || !localStorage.endReason ){
		localStorage.endReason = 'time';
	}
	
	var endDate = dateFromTime(pomoFocusB.endTime);
	
	var clockDiv = $('#pomoFocusRemainingTime');
	var taskSpan = $('#pomoFocusTask');
	
	var timer = $(clockDiv).countdown(endDate, function(event) {
		$(this).html(event.strftime('%M:%S'));
	})
	.on('finish.countdown', function(event) {
		
		if (localStorage.endReason == 'time') {
			stimuli("shock", defInt, defAT, "Pomodoro ended, but task didn't");
			notifyUser("PomoFocus is over...", "Too bad task isn't, buddy. We'll help you get back on track", 'PFNotify')
		}
		console.log("PomoFocus ended");
		pomoFocusB.audio = false;
		pomoFocusB.active = false;
		savePomoFocus(pomoFocusB, 'background');
		PFpromptForce = true;
		localStorage.instaZap = 'false';
	});
}

var countDownSafetyCheck = setInterval(function(){ updateCountdownBack();}, 2000);
var testInt = setInterval(function(){ 
	checkForUpdateBack();
	checkForAudio();
	}, 100);
$( document ).ready( function() { updateCountdownBack(); });



/*---------------------------------------------------------------------------*/
/*---------------------------------------------------------------------------*/
/*--------                                                           --------*/
/*--------                     Tabs and Blacklist                    --------*/
/*--------                                                           --------*/
/*---------------------------------------------------------------------------*/
/*---------------------------------------------------------------------------*/


function CreateTabListeners(token) {
	// When new tab is created
	chrome.tabs.onCreated.addListener(function(tab) {
		countTabs(localStorage.tabCountAll, evaluateTabCount);
	});

	// When tab is removed
	chrome.tabs.onRemoved.addListener(function(tab) {
		if ( localStorage.zapOnClose == 'true' ){
			countTabs(localStorage.tabCountAll, evaluateTabCount);
		}
		else{
			console.log("zapOnClose is " + localStorage.zapOnClose + " so no zap.");
		}
	});

	// When tab is detached
	chrome.tabs.onDetached.addListener(function(tab) {
		countTabs(localStorage.tabCountAll, evaluateTabCount);
	});

	// When tab is attached
	chrome.tabs.onAttached.addListener(function(tab) {
		countTabs(localStorage.tabCountAll, evaluateTabCount);
	});

	// last windows focused
	chrome.windows.getLastFocused(function(win) {
		countTabs(localStorage.tabCountAll, UpdateTabCount);
	});

	// When new window is created
	chrome.windows.onCreated.addListener(function(win) {
		countTabs(localStorage.tabCountAll, UpdateTabCount);
	});

	// When focus on WHAT has changed?
	chrome.windows.onFocusChanged.addListener(function(win) {
		countTabs(localStorage.tabCountAll, UpdateTabCount);
		console.log("tab changed");
	});
	
	// When active tab change
	chrome.tabs.onActivated.addListener(function(info){
		var tabId = info.tabId;
		windowId = info.windowId;
		chrome.tabs.sendMessage(tabId, {
			action: "hello",
			pomodoro: lsGet('pomoFocusB', 'parse')
		});
	})
}

function initialize() {	
	onUpdateAvailable();
	onInstall();
	notifyClicked();
	
	UpdateBadgeOnOff("1/3");
	var accessToken = localStorage.getItem("accessToken");
	
	CreateTabListeners(accessToken);
		testInterval = setInterval(
		function(){
			if (checkActiveDayHour() == true) {
				if (isValid(localStorage.accessToken)){
					timeWindow = localStorage.timeWindow;
					getTabInfo(evaluateTabURL);
					rescueTimeChecker();
					RTTimeOut = localStorage.RTTimeOut;
					countTabs(localStorage.tabCountAll, UpdateTabCount);
				}
			} else {
				UpdateBadgeOnOff("Zzz");
			}
		}
	,100);
	createPomoFocusCountDownBack();
	
	chrome.extension.onMessage.addListener(
		function(request, sender, sendResponse) {
			if (request.action == "volumeUp" && request.target == 'background'){
				var myAudioVol = parseFloat(myAudio.volume);
				if (myAudioVol + 0.1 > 1) { myAudioVol = 1; }
				else { myAudioVol = myAudioVol + 0.1; }
				
				myAudio.volume = myAudioVol;
			}
			
			else if (request.action == "volumeDown" && request.target == 'background'){
				var prevAudioVol = parseFloat(myAudio.volume);
				var newAudioVol;
				if (prevAudioVol - 0.1 < 0) { newAudioVol = 0; }
				else { newAudioVol = prevAudioVol - 0.1; }
				
				myAudio.volume = newAudioVol;
			}
			
			else if (request.action == "newPage" && request.target == 'background') {
				var pomoFocus = lsGet('pomoFocusB', 'parse');
				sendResponse({
					pomodoro: pomoFocus
				});
				console.log("message received");
			}
		}
	);
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
	
	if(_result == true){		//blacklisted site
		// Variables
		var instaZap = localStorage.instaZap;
		var firstZap = localStorage.firstZap;
		var timeWindowZap = localStorage.timeWindow;
		if (instaZap == 'true'){ var timeWindowZap = 8; }
		
		// Logic
		if (counter == true){	// with timer going on
			if (instaZap == 'true' && firstZap == 'false'){
				//Zap & Notify
				stimuli("shock", defInt, defAT);
				notifyUser("Not here, buddy", "Don't do this on yourself. Love yourself and get focused!", "zapped");
				// Substitute timeWindow
				timeWindowZap = 8;
				localStorage.firstZap = 'true';
			}
			else {				// no timer going on
				notifyUser(msgBlacklisted[0], "Watch out! You have " + timeWindowZap + " seconds before the zap! Outta here! Fast!", "blacklisted", "blacklisted");
				
				now = new Date();
				
				// Calculate time delta from timer begin and now. It"s then converted from miliseconds to deciseconds (for rouding) and finally to seconds.
				elapsed = (now - timeBegin) / 100;
				elapsed = Math.round(elapsed) / 10;
				
				document.title = elapsed + "s on blackList"; // Debug. Shows on background.html
				
				// if (elapsed >= parseInt(timeWindow)){
				if (elapsed >= parseInt(timeWindowZap)){
					notifyUser(msgZaped[0], msgZaped[1], "zapped");
					stimuli("shock", defInt, defAT);
					
					timeBegin = new Date();
				}			
			}
			
			
		}
		else {
			counter = true;
			if (localStorage.instaZap == 'true'){
				//Zap & notify
				stimuli("shock", defInt, defAT);
				notifyUser("Not here, buddy", "Don't do this on yourself. Love yourself and get focused!", "zapped");
				localStorage.firstZap = 'true';
			}
			else {
				notifyUser(msgBlacklisted[0], "Watch out! You have " + timeWindowZap + " seconds before the zap! Outta here! Fast!", "blacklisted", "blacklisted");
			}
			
			timeBegin = new Date();
		}
	}
	else{
		elapsedTime = 0;
		timeBegin = null;
		clearNotifications();
		counter = false;
		localStorage.firstZap = 'false';
	}
}

initialize();