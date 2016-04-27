/* To-do:
notify every 30 minutes*
1) Annoy me every half hour until I start my first pomodoro

2) Once I finally start my first pomodor, do it for 30 mins

3) (25 mins by default, or 15 or whatever)

at the end of the pomodoro ==> Congrats! Take a 5 minute break!

4) after 5 mins "Ready to get started? 1) Yes, get started! 2) Start in 5 mins 3) Not now"

*/
// Globals
var curPAVTab, curPAVUrl, curPAVDomain, _result, timeBegin;
var curBlackListTimer = false;
var elapsedTime = 0;
var counter = false;
var situation = {};
var timeWindow;
var myAudio = new Audio('../Audio/focus1min.mp3');
var playing = false;
if (!localStorage.badgeStatus) { localStorage.badgeStatus = "off" };

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
	var pomoFocus = pavPomo.helpers.lastPomo();
	var task = testTodo.backend.read(pomoFocus.taskId);
	
	if (!pomoFocus){ var pomoFocus = {active: false }; };
	
	// Checks if it will use regular or daily black and whitelists
	if (pomoFocus.active && pomoFocus.lockZap){
		if (curPAVDomain != pomoFocus.lockedTo ) { return true }
		else { return false }
	}
	else if (pomoFocus.active && task.daily && task.specialList){
			var _whiteList = task.whiteList.split(",");
			var _blackList = task.blackList.split(",");
	}
	else {
		var _whiteList = localStorage.whiteList.split(",");
		var _blackList = localStorage.blackList.split(",");
	}
	
	
	// remove Http, Https and www
	curTabSubURL = curTabURL.split(curTabDomain, 2);
	curTabSubURL = curTabSubURL[curTabSubURL.length - 1];
	curTabSubURL = curTabDomain + curTabSubURL;
	
	// Presumption of innocence
	var blacked = false;
	var whited = false;
	
	// Validate lists
	if (_blackList[0].length < 2){ _blackList = false }
	if (_whiteList[0].length < 2){ _whiteList = false }
	
	// Checks domain against BlackList and URL agains WhiteList
	if (_blackList != false ){ 
		for (b = 0; b < _blackList.length; b++){
			if (curTabSubURL.indexOf(_blackList[b]) == 0) { 
				blacked = true; 
				break
			}
		}
	}
	
	if (_whiteList != false) {
		for (w = 0; w < _blackList.length; w++){
			if (curTabSubURL.indexOf(_whiteList[w]) == 0) { 
				whited = true; 
				break
			}
		}		
	};
	
	if (blacked == true && whited == false) { 
		console.log(curTabSubURL + " is blacklisted and NOT whitelisted");
		return true
	}
	else { 
		if (blacked == true && whited == true){
			console.log(curTabSubURL + " is blacklisted, BUT whitelisted too");
		}
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
	
	if (hour == 12 && code == "AM") { hour = 0;}
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
	var startAsNumber = 
		parseInt(testHourStart.split(":")[0]) * 100 +
		parseInt(testHourStart.split(":")[1]);
	var endAsNumber = 
		parseInt(testHourEnd.split(":")[0]) * 100 +
		parseInt(testHourEnd.split(":")[1]);
	
	var acrossDay = startAsNumber > endAsNumber;
	
	// Logical 
	// Now is between begin and end.
	
	//	If begin comes BEFORE end, action happens in between
	//		         B             E     
	//		--------------------------------
	//		- false -|> ACT TRUE <|- false -
	//		--------------------------------
		
	
	//	If begin comes AFTER end, action happens while NOT between them
	//             E             B     
	//		------------------------------
	//		 act T<|-   false   -|> act T  
	//		------------------------------
	
	if ((begin < now && now < end) && acrossDay == false) { return true } 
	else if ((begin < now || now < end) && acrossDay == true) { return true } 	
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
		var reason = notes.reason;
		if (reason == "install"){
			var Not = lsGet('notifications', 'parse');
			var Not = Not.installed;
			
			notifyUser(Not.title, Not.message, Not.id);
			
			notifyUser(Not.title, Not.message, Not.id, "persist");
			addPersistNotification("installed");
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
			chrome.notifications.clear("installed");
			openOptions();
		}
	});
}

function addPersistNotification(notId){
	var persList = lsGet('persistedNotifications');
	if (persList.length == 0){ persList = []; }
	var index = persList.indexOf(notId);
	if (index == -1) {
		persList.push(notId);
		lsSet('persistedNotifications', persList);
		return notId
	}
	return false
}

function persistNotifications(){
	var persList = lsGet('persistedNotifications');
	if (persList.length != 0){
		for (n = 0; n < persList.length; n++) {
			// chrome.notifications.update(persList[n]);
		}
	}
	setTimeout(function(){persistNotifications();}, 5000);
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
		if (isActive() && localStorage.tabNumbersActive == "true" ) {
			countTabs(localStorage.tabCountAll, evaluateTabCount);
			countTabs(localStorage.tabCountAll, UpdateTabCount);
			getTabInfo(evaluateTabURL);
		}
	});

	// When tab is removed
	chrome.tabs.onRemoved.addListener(function(tab) {
		if (isActive() && localStorage.tabNumbersActive == "true" ) {
			if ( localStorage.zapOnClose == 'true' ){
				countTabs(localStorage.tabCountAll, evaluateTabCount);
			}
			countTabs(localStorage.tabCountAll, UpdateTabCount);
			getTabInfo(evaluateTabURL);
		}
	});

	// When tab is updated
	chrome.tabs.onUpdated.addListener(function(tab){
		if (isActive() && localStorage.tabNumbersActive == "true" ) {
			getTabInfo(evaluateTabURL);
		}
	});
	
	// When tab is detached
	chrome.tabs.onDetached.addListener(function(tab) {
		if (isActive() && localStorage.tabNumbersActive == "true" ) {
			countTabs(localStorage.tabCountAll, evaluateTabCount);
			countTabs(localStorage.tabCountAll, UpdateTabCount);
			getTabInfo(evaluateTabURL);
		}
	});

	// When tab is attached
	chrome.tabs.onAttached.addListener(function(tab) {
		if (isActive() && localStorage.tabNumbersActive == "true" ) {
			countTabs(localStorage.tabCountAll, evaluateTabCount);
			countTabs(localStorage.tabCountAll, UpdateTabCount);
			getTabInfo(evaluateTabURL);
		}
	});

	// last windows focused
	chrome.windows.getLastFocused(function(win) {
		if (isActive() && localStorage.tabNumbersActive == "true" ) {
			countTabs(localStorage.tabCountAll, UpdateTabCount);
			getTabInfo(evaluateTabURL);
		}
	});

	// When new window is created
	chrome.windows.onCreated.addListener(function(win) {
		if (isActive() && localStorage.tabNumbersActive == "true" ) {
			countTabs(localStorage.tabCountAll, UpdateTabCount);
			getTabInfo(evaluateTabURL);
		}
	});

	// When focus on WHAT has changed?
	chrome.windows.onFocusChanged.addListener(function(win) {
		if (isActive() && localStorage.tabNumbersActive == "true" ) {
			// countTabs(localStorage.tabCountAll, UpdateTabCount);
			getTabInfo(evaluateTabURL);
		}
	});
	
	// When active tab change
	chrome.tabs.onActivated.addListener(function(info){
		if (isActive() && localStorage.tabNumbersActive == "true" ) {
			var pomoF = pavPomo.helpers.lastPomo();
			var tabId = info.tabId;
			windowId = info.windowId;
			chrome.tabs.sendMessage(tabId, {
				action: "hello",
				pomodoro: pomoF
			});
			getTabInfo(evaluateTabURL);
		}
	})
}

function getTabInfo(callback){
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
		if (tabs.length == 0 ) { // no active tabs
            console.log("background debugger activated");
			return;
        }
		
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
		var pomo = pavPomo.helpers.lastPomo();
		
		var instaZap = (pomo.active && pomo.instaZap);
		var firstZap = localStorage.firstZap == "true";
		var timeWindowZap = parseInt(localStorage.timeWindow);
		// var timeWindowZap = 3;
		if (instaZap){
			timeWindowZap = 8;
			if (firstZap == false){ 
			stimuli("shock", defInt, defAT, "Not here, buddy. Don't do this on yourself. Love yourself and get focused!");
			notifyUser("Not here, buddy", "Don't do this on yourself. Love yourself and get focused!", "zapped");

			// Substitute timeWindow
			lsSet('firstZap', true);
			}
		}
	}
	
	blackListTimer(_result, timeWindowZap);
}

function blackListTimer(blackListed, timespan){
	if (blackListed == false){
		if (curBlackListTimer) {
			clearTimeout(curBlackListTimer);
			curBlackListTimer = false;
			lsSet('firstZap', false);
			clearNotifications();
		}
	}
	else if (blackListed == true){
		notifyUser(msgBlacklisted[0], "Watch out! You have " + timespan + "  seconds before the zap! Outta here! Fast!", "blacklisted", "blacklisted");
		if (curBlackListTimer == false){
			// notifyUser(msgBlacklisted[0], "Watch out! You have " + timespan + " seconds before the zap! Outta here! Fast!", "blacklisted", "blacklisted");
			curBlackListTimer = setTimeout(function(){
				stimuli("shock", defInt, defAT, "Not here, buddy. Don't do this on yourself. Love yourself and get focused!");
				notifyUser("Not here, buddy", "Don't do this on yourself. Love yourself and get focused!", "zapped");
				curBlackListTimer = false;
				getTabInfo(evaluateTabURL);
			}, timespan * 1000);
		}
	}
}

function checkForMigration(){
	if (lsGet('dailyList') || lsGet('ToDoTasks')) {
		var tasks = testTodo.helpers.migrateFromSeparateLists();
		
		// Create the new tasks in the new system
		for (t = 0; t < tasks.length; t++){
			testTodo.backend.create(tasks[t]);
		}
		
		// Save old data in new variable and destroy old variables
		testTodo.helpers.archiveOldLists()
	}
}

function initialize() {
	checkForMigration();
	coach.listenCoachingClicks();
	pavPomo.backend.backListener();
	persistNotifications();
	onUpdateAvailable();
	onInstall();
	notifyClicked();
	
	UpdateBadgeOnOff(" ");
	var accessToken = localStorage.getItem("accessToken");
	
	CreateTabListeners(accessToken);
	testInterval = setInterval(
		function(){
			if (checkActiveDayHour() == true) {
				if (isValid(localStorage.accessToken)){
					timeWindow = localStorage.timeWindow;
					rescueTimeChecker();
					RTTimeOut = localStorage.RTTimeOut;
				}
			} else {
				UpdateBadgeOnOff("Zzz");
			}
			
			if (dayChange()){
				testTodo.helpers.resetDailyTasks;
			}
		}
	, 1000);
	
	chrome.runtime.onMessage.addListener(
		function(request, sender, sendResponse) {
			if (request.target == "background"){
				var action = request.action;
				// Oauth
				if (action == "oauth"){
					oauth();
				}
				else if (action == "coachChange"){
					if (request.change == "status"){
						coach.status = request.status
						if (coach.status == true){
							coach.notifyTasks(coach.getTasks(2));
							coach.isItTime();
						}
						else{
							clearTimeout(coach.timeout);
							coach.isItTime();
						}
						console.log("Coach running is " + coach.status);
					}
					else if (request.change == "sync"){
						sendResponse({
							status: coach.status
						});
					}
				}
				else if (action == "todoistChange"){
					if (request.change == "oauth"){
						todoist.getToken();
						console.log("Oauth request received");
					}
					else if (request.change == "signOut"){
						todoist.removeToken();
						console.log("Signout request made");
						msgInterfaces({
							action: "todoist",
							change: "unlogged"
						});
					}
					else if (request.change == "import"){
						todoist.getTasks();
						todoist.import2();
					}
				}
			}
		}
	);
}

initialize();