/* To-do:
notify every 30 minutes*
1) Annoy me every half hour until I start my first pomodoro

2) Once I finally start my first pomodor, do it for 30 mins

3) (25 mins by default, or 15 or whatever)

at the end of the pomodoro ==> Congrats! Take a 5 minute break!

4) after 5 mins "Ready to get started? 1) Yes, get started! 2) Start in 5 mins 3) Not now"

*/
// Globals
var lockMeInBlock = "---not_the_locked_in"
var heartBeatLoop;
var timeOnBlackList;
var curPAVTab, curPAVUrl, curPAVDomain, _result, timeBegin;
var curBlackListTimer = false;
var elapsedTime = 0;
var counter = false;
var situation = {};
var timeWindow;
var myAudio = new Audio('../Audio/focus1min.mp3');
var playing = false;
if (!localStorage.badgeStatus) { localStorage.badgeStatus = "off" };

var settings = {
	blackList: {
		black: {},
		white: "",
		countdown: 15
	},
	maxTabs: 30,
	remote: {
		zap: 153,
		vib: 153,
		beep: 153
	},
	rescueTime: {},
	todoist: {},
	schedule: {
		start: "07:06 AM",
		end: "07:05 PM",
		format: "AM/PM",
		Sun: true,
		Mon: true,
		Tue: true,
		Wed: true,
		Thu: true,
		Fri: true,
		Sat: true
	},
	coach: {},
	todo: {
		pomo: {},
		tasks: {},
		dailies: {},
		
	}
	
}
// var maxTabs = parseInt(localStorage.maxTabs);
var previousTabs = 0;
var RTTimeOut;
var testInterval;

var defAT = '';
var defInt = '';


var blackGlobal = lsGet("blackGlobal", "parse"); 
if (!blackGlobal) { 
	blackGlobal = {
		status: true,
		type: "daily",
		limit: 0
	};
	lsSet("blackGlobal", blackGlobal, "object");
	
}
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
var msgBlacklisted = ["BLACKLISTED SITE!!!", "Watch out! You have " + localStorage.timeWindow + " seconds before the zap! Click here to close this page!", "blacklisted", ""];
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
	}, parseInt(localStorage.RTFrequency) * 60 * 1000); // Gotta put this on 3 minutes
	localStorage.RTTimeOut = x;
	return x
}

function fireRescueTime(APIKey){
	requestAddress = "https://www.rescuetime.com/anapi/current_productivity_pulse.json?key=" + APIKey;
	localStorage.RTAPIKey = APIKey;
	
	log("get request to\n" + requestAddress);
	$.get(requestAddress)
	.done(function (data) {
		localStorage.RTPulse = data.pulse;
		localStorage.RTHour = data.comment.split(" ")[9];
		localStorage.Comment = data.comment;
		
		log("Productivity pulse from 30 minutes before " + localStorage.RTHour + "is " + data.pulse)
		
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
		log("BAD key. Fails on API.");
		localStorage.removeitem['RTAPIKey'];
		return false
	});
}

// Black List


function blackListTime(curTabURL, siteStatus){
	// Check ALL sites
		// Check dailly
		// Check hourly
		
	// Check this site
		// Check dailly
		// Check hourly
	
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
	// log("Now is: " + now + "\nStarts at: " + start + "\nEnds at: " + end);
	start = convert12To24(start);
	end = convert12To24(end);
	
	var dayActive = checkActiveDay(now);
	var hourActive = checkActiveHour(start, end);
	// log("So, active day is " + dayActive + " and hour activity is " + hourActive);
	
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
			openOptions();
		}
		else if (notId == "signedIn"){
			chrome.notifications.clear("installed");
			openOptions();
		}
		else if (notId == "blacklisted"){
			chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
				if (tabs.length == 0 ) { // no active tabs
					log("background debugger activated");
					return;
				}
			
				chrome.tabs.remove(tabs[0].id);
				getTabInfo(blackList.resolve);
			}
			);
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
			getTabInfo(blackList.resolver);
		}
	});

	// When tab is removed
	chrome.tabs.onRemoved.addListener(function(tab) {
		if (isActive() && localStorage.tabNumbersActive == "true" ) {
			if ( localStorage.zapOnClose == 'true' ){
				countTabs(localStorage.tabCountAll, evaluateTabCount);
			}
			countTabs(localStorage.tabCountAll, UpdateTabCount);
			getTabInfo(blackList.resolver);
		}
	});

	// When tab is updated
	chrome.tabs.onUpdated.addListener(function(tab){
		if (isActive() && localStorage.tabNumbersActive == "true" ) {
			getTabInfo(blackList.resolver);
		}
	});
	
	// When tab is detached
	chrome.tabs.onDetached.addListener(function(tab) {
		if (isActive() && localStorage.tabNumbersActive == "true" ) {
			countTabs(localStorage.tabCountAll, evaluateTabCount);
			countTabs(localStorage.tabCountAll, UpdateTabCount);
			getTabInfo(blackList.resolver);
		}
	});

	// When tab is attached
	chrome.tabs.onAttached.addListener(function(tab) {
		if (isActive() && localStorage.tabNumbersActive == "true" ) {
			countTabs(localStorage.tabCountAll, evaluateTabCount);
			countTabs(localStorage.tabCountAll, UpdateTabCount);
			getTabInfo(blackList.resolver);
		}
	});

	// last windows focused
	chrome.windows.getLastFocused(function(win) {
		if (isActive() && localStorage.tabNumbersActive == "true" ) {
			countTabs(localStorage.tabCountAll, UpdateTabCount);
			getTabInfo(blackList.resolver);
		}
	});

	// When new window is created
	chrome.windows.onCreated.addListener(function(win) {
		if (isActive() && localStorage.tabNumbersActive == "true" ) {
			countTabs(localStorage.tabCountAll, UpdateTabCount);
			getTabInfo(blackList.resolver);
		}
	});

	// When focus on WHAT has changed?
	chrome.windows.onFocusChanged.addListener(function(win) {
		if (isActive() && localStorage.tabNumbersActive == "true" ) {
			// countTabs(localStorage.tabCountAll, UpdateTabCount);
			getTabInfo(blackList.resolver);
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
			getTabInfo(blackList.resolver);
		}
	});
}

function checkForMigration(){
	if (lsGet('dailyList') || lsGet('ToDoTasks')) {
		var tasks = testTodo.helpers.migrateFromSeparateLists();
		
		// Create the new tasks in the new system
		for (t = 0; t < tasks.length; t++){
			testTodo.backend.create(tasks[t]);
		}
		
		// Save old data in new variable and destroy old variables
		testTodo.helpers.archiveOldLists();
	}
}

function msgListeners(){
	chrome.runtime.onMessage.addListener(
		function(request, sender, sendResponse) {
			r = request;
			if (r.target == "background"){
				// blackList:
				// countdown
				// whiteList
				
				// maxTabs
				
				// vib
				// zap
				
				var action = r.action;

				if (action == "oauth"){
					signIn(r.user, spread)
					// oauth();
				}
				else if (action == "signOut"){
					signOut();
				}
				
				else if (r.change == "settings"){
					maxTabsPack.backListener(r);
				}
				else if (action == ""){}
				else if(action == "accessToken"){
					// Receive access token from a content script
					var token = r.token;
					saveAccessToken(token);
					msgInterfaces({action: "logged", token: token});
					// sendResponse({message: "Thanks and bye."});
				}
				
				else if (action == "blackList"){
					var nBL = blackList.get("blackList");
					var nWL = blackList.get("whiteList");
					
					if (r.list === "black"){
						if (r.do === "edit" || r.do === "new"){
							if ( r.do === "edit" ) { 
								delete nBL[r.oldName]; 
								blackList.changeTime({site: r.oldName, newSite: r.name, action: "edit"});
							}
							else if (r.do == "new"){
								blackList.changeTime({site: r.oldName, newSite: r.name, action: "add"});
							}
							
							nBL[r.name] = {};
							nBL[r.name]["limit"] = parseInt(r.limit);
							nBL[r.name]["type"] = r.type;
						}
						else if (r.do === "delete"){
							delete nBL[r.name];
							blackList.changeTime({site: r.name, action: "delete"});
						}
						
						blackList.fixAddress(nBL, "black");
						
						lsSet('blackList', nBL, 'object');
					}
					
					else if (r.list === "global"){
						blackGlobal["limit"] = r.limit;
						blackGlobal["type"]  = r.type;
						blackGlobal["status"] = r.status;
						lsSet("blackGlobal", blackGlobal, "object");
					}
					msgInterfaces({ action: 'updateBlackList' })
					
				}
				else if (action == "task change"){
					var detail = r.detail;
					if (detail == "new"){
						var task = testTodo.backend.create(r.task);
						msgInterfaces({action: "updateDaily"});
						msgInterfaces({action: "updateActions"});
					}
					
					else if (detail == "delete"){
						testTodo.backend.delete(r.taskId);
						msgInterfaces({action: "updateDaily"});
						msgInterfaces({action: "updateActions"});
					}
					
					else if (detail == "complete"){
						var update = {done: r.check};
						var task = testTodo.backend.update(r.taskId, update);
						msgInterfaces({action: "updateDaily"});
						msgInterfaces({action: "updateActions"});
					}
				}
				
				else if (action == "coachChange"){
					if (r.change == "status"){
						coach.status = r.status
						if (coach.status == true){
							coach.notifyTasks(coach.getTasks(2));
							coach.isItTime();
							lsSet('coachStatus', 'on');
						}
						else{
							clearTimeout(coach.timeout);
							coach.isItTime();
							lsSet('coachStatus', 'off');
						}
						log("Coach running is " + coach.status);
					}
					else if (r.change == "sync"){
						sendResponse({
							status: coach.status
						});
					}
				}
				
				else if (action == "todoistChange"){
					if (r.change == "oauth"){
						todoist.backend.getToken();
						log("Oauth request received");
					}
					else if (r.change == "signOut"){
						todoist.backend.removeToken();
						todoist.helpers.addToDoListeners(false);
						log("Signout request made");
						msgInterfaces({
							action: "todoist",
							change: "unlogged"
						});
					}
					else if (r.change == "import"){
						// todoist.backend.getTasks();
						todoist.helpers.sync();
					}
				}
			}
		}
	);
}

function initialize() {
	migrations.backListener();
	checkForMigration();
	blackList.checkForMigration();
	blackList.setTime();
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
				blackList.resetTime();
			}
		}
	, 1000);
	
	msgListeners();
}

// Sandbox
function globalTime(timeSpent){
	// Bogus variables
	var dailyLimit = 5;
	// var timeSpent = 5;
	
	// Logic
	return timeSpent > dailyLimit
	
}

var blackList = {
	setTime: function(){
		timeOnBlackList = lsGet("timeOnBlackList", "parse");
		if (!timeOnBlackList){
			blackList.resetTime();
			lsSet("timeOnBlackList", timeOnBlackList, "object");
		}
	},
	resetTime: function(){
		timeOnBlackList = {};
		var BL = blackList.get("blackList");
		var keys = Object.keys(BL);

		for (t = 0; t < 24; t++){
		  timeOnBlackList[t] = {};
		  for (s = 0; s < keys.length; s++){
			x = keys[s];
			timeOnBlackList[t][x] = 0;
		  }
		}
	},
	changeTime: function(par){
		var action = par.action || "add";
		var site = par.site;
		var newSite = par.newSite;
		var value;
		
		for (t = 0; t < 24; t++){
			if (action == "delete"){
				delete timeOnBlackList[t][site];
			}
			else if (action == "add"){
				timeOnBlackList[t][newSite] = 0;
			}
			else if (action == "edit") {
				value = parseInt(timeOnBlackList[t][site]);
				delete timeOnBlackList[t][site];
				timeOnBlackList[t][newSite] = value;
			}
		}
	},
	
	set: function(data){
		if (data.receiver == "white"){
			localStorage.whiteList = JSON.stringify(data.list);
		}
		else if (data.receiver == "black") {
			localStorage.blackList = JSON.stringify(data.list);
		}
		else if (data.receiver == "global"){
			localStorage.blackGlobal = JSON.strigify(data.global);
		}
	},
	get: function(list){
		var cList;
		if (list == "whiteList"){ cList = lsGet("whiteList").split(","); }
		else if (list == "blackList") { cList = lsGet("blackList", "parse"); }
		else if (list == "global")	{ cList = lsGet("blackGlobal", "parse"); }
		return cList;
	},
	
	badSite: function(curTabURL, curTabDomain) {
		var _whiteList = blackList.get("whiteList");
		var	_blackList = Object.keys(blackList.get("blackList"));
		var curTabSubURL;
		var pomoCondemned = false;
		
		var pomoFocus = pavPomo.helpers.lastPomo();
		var task = testTodo.backend.read(pomoFocus.taskId);
		
		if (!pomoFocus){ var pomoFocus = {active: false }; };
		
		// Checks if it will use regular or daily black and whitelists
		if (pomoFocus.active && pomoFocus.lockZap && curPAVDomain != pomoFocus.lockedTo) { pomoCondemned = true; }
		
		if (pomoFocus.active && task.daily && task.specialList){
			_whiteList = task.whiteList.split(",");
			_blackList = task.blackList.split(",");
		}
		
		// remove Http, Https and www
		curTabSubURL = curTabURL.split(curTabDomain, 2);
		curTabSubURL = curTabSubURL[curTabSubURL.length - 1];
		curTabSubURL = curTabDomain + curTabSubURL;
		
		// Presumption of innocence
		var blacked = false;
		var whited = false;
		
		// Validate lists
		if ( isEmpty(_blackList) || isEmpty(_blackList[0]) ){ _blackList = false; }
		if ( isEmpty(_whiteList) || isEmpty(_whiteList[0]) ){ _whiteList = false; }
		
		// Checks domain against BlackList and URL agains WhiteList
		if (_blackList != false ){ 
			for (b = 0; b < _blackList.length; b++){
				if (curTabSubURL.indexOf(_blackList[b]) == 0) { 
					blacked = true; 
					break
				}
			}
		}
		
		if ( pomoCondemned == true && blacked == true ) { return _blackList[b]; }
		else if ( pomoCondemned == true && blacked == false ) { return lockMeInBlock; }
		
		if (_whiteList != false) {
			for (w = 0; w < _whiteList.length; w++){
				if (curTabSubURL.indexOf(_whiteList[w]) == 0) { 
					whited = true; 
					break
				}
			}		
		};
		
		if (blacked == true && whited == false) { 
			log(curTabSubURL + " is blacklisted and NOT whitelisted");
			return _blackList[b];
		}
		else { 
			if (blacked == true && whited == true){
				log(curTabSubURL + " is blacklisted, BUT whitelisted too");
			}
			return false 
		}
	},
	overQuota: function(site, mode){
		var pomoFocus = pavPomo.helpers.lastPomo();
		if (pomoFocus.active && pomoFocus.lockZap) { return true; }
		
		var nBL = blackList.get("blackList");
		var spent;
		var hour = new Date().getHours();
		
		var quota = blackGlobal.status ? blackGlobal.limit : parseInt(nBL[site]["limit"]);;
		var type = blackGlobal.status ? blackGlobal.type : nBL[site]["type"];
		
		if 		(type == "hourly" && blackGlobal.status == true ) {
			spent = (blackList.trackTime({hour: hour}) / 60).toFixed(2);	
		}
		else if (type == "hourly" && blackGlobal.status == false) {
			spent = (blackList.trackTime({domain: site, hour: hour}) / 60).toFixed(2);	
		}
		
		else if (type == "daily" && blackGlobal.status == true ) {
			spent = (blackList.trackTime() / 60).toFixed(2);	
		}
		else if (type == "daily" && blackGlobal.status == false) {
			spent = (blackList.trackTime({domain: site}) / 60).toFixed(2);
		}
		
		if (spent > quota) 	{ return true; }
		else 				{ return false; }
	},
	
	resolver: function(curPAVTab, curPAVUrl, curPAVDomain, callback){
		var badSite = blackList.badSite(curPAVUrl, curPAVDomain);
		if (badSite){
			blackList.heartBeat(badSite);
			var overQuota = blackList.overQuota(badSite);
		}
		else {
			clearTimeout(heartBeatLoop);
		}
		
		_result = (badSite && overQuota);
		
		if(_result == true){		//blacklisted site, quota exceeded
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
				blackList.blockingPopup.addTimeToTail();
				blackList.blockingPopup.appear_if_needed();

				// Substitute timeWindow
				lsSet('firstZap', true);
				}
			}
		}
		
		blackList.countDown(_result, timeWindowZap);
	},
	countDown: function(blackListed, timespan){
		if (blackListed == false){
			if (curBlackListTimer) {
				clearTimeout(curBlackListTimer);
				curBlackListTimer = false;
				lsSet('firstZap', false);
				clearNotifications();
			}
		}
		else if (blackListed == true){
			notifyUser(msgBlacklisted[0], "Watch out! You have " + timespan + "  seconds before the zap! Click here to close this page!", "blacklisted", "blacklisted");
			if (curBlackListTimer == false){
				curBlackListTimer = setTimeout(function(){
					stimuli("shock", defInt, defAT, "Not here, buddy. Don't do this on yourself. Love yourself and get focused!");
					notifyUser("Not here, buddy", "Don't do this on yourself. Love yourself and get focused!", "zapped");
					curBlackListTimer = false;
					getTabInfo(blackList.resolver);
					
					blackList.blockingPopup.addTimeToTail();
					blackList.blockingPopup.appear_if_needed();
				}, timespan * 1000);
			}
		}
	},
	
	trackTime: function(par){
		if (!par) { par = {}; }
		var time = par.time || 0;
		var hour = par.hour || "all";
		if (par.hour === 0) { hour = 0; }
		var domain = par.domain;
		
		var total = 0;
		var sites;
		var site;
		var sTime;
		var cHour;
		var init = 0;
		var end = 24;
		
		if (hour != "all") { 
			init = hour; 
			end = hour + 1;
		}
		
		for (h = init; h < end; h++){
			cHour = timeOnBlackList[h];
			sites = Object.keys(cHour);
			
			if (domain) {
				(_.contains(sites, domain)) ? sites = [domain] : sites = [];
			}
			
			if (sites.length === 0) { continue; }
			
			for (s = 0; s < sites.length; s++){
				site = sites[s];
				sTime = timeOnBlackList[h][site];
				if (typeof sTime === "undefined") { sTime = 0; }
				total = total + sTime;
			}
		}
		log("Total for " + domain + " from " + init + " to " + end + " is: " + total);
		
		return total
	},
	
	fixAddress: function(list, type){
		var add;
		var keys;
		var obj;
		
		var black = (type === "black");
		
		(black) ? keys = Object.keys(list) : keys = _.flatten([list.split(",")]);
				
		for (i = 0; i < keys.length; i++){
			var original = keys[i];
			var work = original;
			
			var targets = ["https://", "http://", "www."];
			
			for (t = 0; t < targets.length; t++){
				curTarget = targets[t];
				if (work.indexOf(curTarget) == 0){
					work = work.split(curTarget)[1];
				};
			}		
		}
		
		if (black){
			obj = list[original];
			list[work] = {};
			list[work] = obj;
			// delete list[original];
		}
		
		else{
			list.push(work);
		}
		return list;
	},
	
	heartBeat: function(domain){
		var frequency = 2; // Repeats every n seconds;
		var hour = new Date().getHours();
		var params = {
			frequency: frequency,
			domain: domain,
			hour: hour,
			heartBeat: heartBeatLoop
		};
		
		// Add first second
		timeOnBlackList[hour][domain]++;
		
		timeOnBlackList[domain]
		
		// Clears existing timeouts
		if (heartBeatLoop > 0) { clearTimeout(heartBeatLoop); }
		
		// Starts a new timeout;
		heartBeatLoop = setTimeout(function(params){
			if (params.domain != lockMeInBlock) { 
				timeOnBlackList[hour][domain] = timeOnBlackList[hour][domain] + params.frequency - 1;
				lsSet("timeOnBlackList", timeOnBlackList, "object");
			
			
				if (blackList.overQuota(domain)){
					getTabInfo(blackList.resolver);
				}
				
				log(timeOnBlackList[hour][domain] + " seconds on " + params.domain);
			}	
			blackList.heartBeat(params.domain);
		}, frequency * 1000, params);
		
		
		//return heartBeatLoop;
	},
	
	blockingPopup: {
		// Structure
		lastZaps: [],
		zapLimitBeforePopup: 3,
		timeLimitBetweenZaps: 60 * 1000, // 1 minute
		
		// Getters and setters
		addTimeToTail: function() {
			blackList.blockingPopup.lastZaps.push(new Date);
			if (blackList.blockingPopup.lastZaps.length > blackList.blockingPopup.zapLimitBeforePopup) {
				blackList.blockingPopup.removeTimeFromHead();
			}
			
			console.log(blackList.blockingPopup.lastZaps);
		},
		removeTimeFromHead: function() {
			blackList.blockingPopup.lastZaps.splice(0, 1);
			console.log(blackList.blockingPopup.lastZaps);
		},
		
		// Logic
		needPopup: function() {
			if (blackList.blockingPopup.lastZaps.length < blackList.blockingPopup.zapLimitBeforePopup){
				return false;
			}
			else {
				return (blackList.blockingPopup.zapInterval() < blackList.blockingPopup.timeLimitBetweenZaps)
			}
		},
		zapInterval: function() {
			if (blackList.blockingPopup.lastZaps.length > 0) {
				var array = blackList.blockingPopup.lastZaps;
				latest = array[0];
				oldest = array[array.length - 1];
				return oldest - latest;
			}
			else {
				return 0;
			}
		},
		alert: function() {
			alert("Hey, Pavlokian, " + blackList.blockingPopup.zapLimitBeforePopup + " zaps in less than a minute. What are you doing, buddy?");
		},
		appear_if_needed: function() {
			if (blackList.blockingPopup.needPopup()) {
				blackList.blockingPopup.alert();
			}
		}
	},
	
	checkForMigration: function(){
		var cBL;
		var nBL;
		
		try {cBL = JSON.parse(localStorage.blackList);}
		catch(err){
			cBL = lsGet("blackList");
			var keys = cBL.split(",");
			
			nBL = {};
			for (var k = 0; k < keys.length; k++){
				nBL[keys[k]] = {}
				nBL[keys[k]]["limit"] = 0;
				nBL[keys[k]]["type"] = "daily";
			}
			
			lsSet("blackList", nBL, "object");
		}
	},
	
};
initialize();

	function getTabInfo(callback){
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
			if (tabs.length == 0 ) { // no active tabs
				log("background debugger activated");
				if (typeof callback === "function"){
					callback("", "", "");
				}
				return;
			}
			
			curPAVTab = tabs[0];
			curPAVUrl = tabs[0].url;
			curPAVDomain = new URL(curPAVUrl).hostname.replace("www.", "");
			
			if(curPAVDomain.length == 0){
				log("unable to resolve domain for " + curPAVUrl);
				curPAVDomain = curPAVUrl;
			}
			// log("Tab " + curPAVTab + " has url " + curPAVUrl + " on domain " + curPAVDomain);
			
			document.title = curPAVTab.id + " " + curPAVTab.url; // Debug. Shows on background.html
			if (typeof callback === "function"){
				callback(curPAVTab, curPAVUrl, curPAVDomain);
			}
		});
	}

