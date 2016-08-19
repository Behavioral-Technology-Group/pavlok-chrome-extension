/* Summary 

1.Validation and Authentication
2.Interface updating
3.Evaluation
4.API conversation

*/

// Server settings
var server = "MVP" 			// STAGE or MVP
var intent = "production"; 	// local OR test OR production (MVP or STAGE added at the end)

// Fail safe
try {
	var extensionURL = window.location.href;
	console.log(extensionURL);
	if 		(extensionURL.indexOf("hefieeppocndiofffcfpkbfnjcooacib") != -1) { intent = "production"; }
	else if (extensionURL.indexOf("bgjnliglpcichfboncdhmaiagbdhplij") != -1) { intent = "local"; }
}
catch(err){
	console.log(err);
}

var usage = intent + server;

var lastVib = 0;
var limitRep = 500;

// Greetings popup		


/* Future universal settings object

var settings = {};
settings.siteLists = {};
settings.tabsControl = {};
settings.stimuli = {};
settings.toDos = {};
settings.autoZapper = {};
settings.integrations = {};
settings.schedule = {};
settings.user = {};

// Site lists (black and whitelists)
settings.siteLists.blackList = localStorage.blackList;
settings.siteLists.blackList = localStorage.whiteList;
settings.siteLists.blackList = localStorage.timeWindow;


// Tab numbers
settings.tabsControl.maxTabs = localStorage.maxTabs;
settings.tabsControl.zapOnClose = localStorage.zapOnClose;
settings.tabsControl.allWindows = localStorage.allWindows;


// Stimuli intensity
settings.stimuli.baseAddress = localStorage.baseAddress;
settings.stimuli.zapIntensity = localStorage.zapIntensity;
settings.stimuli.vibrationIntensity = localStorage.vibrationIntensity;
settings.stimuli.beepVolume = localStorage.beepVolume;

settings.stimuli.zapNotify = localStorage.notifyZap;
settings.stimuli.vibrationNotify = localStorage.notifyVibration;
settings.stimuli.beepNotify = localStorage.notifyBeep;


// To-do Lists
settings.toDos.dailies = localStorage.dailies;
settings.toDos.lastDailyID = localStorage.lastDailyID;

settings.toDos.tasks = localStorage.ToDoTasks;
settings.toDos.timeConstraints = '';
settings.toDos.pomoFocus = localStorage.pomoFocus;


// AutoZapper
settings.AutoZapper.intensity = '';
settings.AutoZapper.duration = '';
settings.AutoZapper.frequency = '';
settings.AutoZapper.lastSession = '';


// Integrations
settings.integrations.rescueTime.active = '';
settings.integrations.rescueTime.APIKey = '';
settings.integrations.rescueTime.frequency = '';
settings.integrations.rescueTime.NegLimit = '';
settings.integrations.rescueTime.NegStimulus = '';
settings.integrations.rescueTime.NegStimulus = '';
settings.integrations.rescueTime.PosStimulus = '';
settings.integrations.rescueTime.PosStimulus = '';
settings.integrations.rescueTime.WarnStimulus = '';
settings.integrations.rescueTime.WarnStimulus = '';


// Scheduler
settings.schedule.timeStart = '';
settings.schedule.timeEnd = '';
settings.activeDays = [];


// User
settings.user.name = '';
settings.user.email = '';
settings.user.accessToken = '';


// User prompts
settings.prompts.listOfPrompts = [];
settings.prompts.lastShown = '';
settings.prompts.showAgain = '';

*/

var baseAddress = "https://pavlok-" + server.toLowerCase() + ".herokuapp.com/";
lsSet('baseAddress', baseAddress);

localStorage.gmailClientID = '355054180595-pl1tc9qtp7mrb8fe2nb25n071ai2foff.apps.googleusercontent.com';

// Stimuli intensity
{ // Defaults
if (!localStorage.beepTune ) { localStorage.beepTune = 2; } //Random tune
if (!localStorage.beepIntensity ) { localStorage.beepIntensity = 255; } //Random tune
if (!localStorage.beepPosition ) { localStorage.beepPosition = 100; } //Random tune
if (!localStorage.zapIntensity ) { localStorage.zapIntensity = 153; } //60% default
if (!localStorage.zapPosition ) { localStorage.zapPosition = 60; } //60% default
if (!localStorage.vibrationIntensity ) { localStorage.vibrationIntensity = 153; } //60% default
if (!localStorage.vibrationPosition ) { localStorage.vibrationPosition = 60; } //60% default

// Blacklist and tabs
if (!localStorage.timeWindow) { localStorage.timeWindow = 15};
if (!localStorage.blackList) { localStorage.blackList = JSON.stringify({}); }
if (!localStorage.whiteList) { localStorage.whiteList = " "; }
if (!localStorage.zapOnClose ) { localStorage.zapOnClose = "false"; }
if (!localStorage.maxTabs ) { localStorage.maxTabs = 15; }
if (!localStorage.tabCountAll ) { localStorage.tabCountAll = 'allWindows'; }
if (!localStorage.tabNumbersActive ) { localStorage.tabNumbersActive = 'true'; }

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
if (!localStorage.persistedNotifications) { localStorage.persistedNotifications = [];}
if (!localStorage.notifyBeep ) { localStorage.notifyBeep = 'false'; }
if (!localStorage.notifyVibration ) { localStorage.notifyVibration = 'false'; }
if (!localStorage.notifyZap ) { localStorage.notifyZap = 'false'; }

var notifyInterval;

	var notifications = {};
	
	// When extension is first installed
	notifications.installed = {};
	notifications.installed.title = "Welcome to Pavlok. Let's get started!";
	notifications.installed.message = "Click here to log in.";
	notifications.installed.id = "installed";
	notifications.installed.persist = true;
	notifications.installed.usage = "installed";
	
	// When logged in
	notifications.signedIn = {};
	notifications.signedIn.title = "Hooray! Welcome aboard!";
	notifications.signedIn.message = "Click here to start using the Productivity Extension";
	notifications.signedIn.id = "signedIn";
	notifications.signedIn.persist = true;
	notifications.signedIn.usage = "installed";
	
	// PomoFocus task completed
	notifications.pomofocusDone = {};
	notifications.pomofocusDone.title = "Way to go!";
	notifications.pomofocusDone.message = "Keep the zone going, you rock star!";
	notifications.pomofocusDone.id = "PFNotify";
	notifications.pomofocusDone.persist = false;
	notifications.signedIn.usage = "pomofocusDone";
	
	// pomoFocus time ended
	notifications.pomofocusEnded = {};
	notifications.pomofocusEnded.title = "Congrats! You made it!";
	notifications.pomofocusEnded.message = "Take a 5 min break and lets get started! Get up if you were seated!";
	notifications.pomofocusEnded.id = "PFNotify";
	notifications.pomofocusEnded.persist = false;
	notifications.signedIn.usage = "pomofocusEnded";
	
	// 
	lsSet('notifications', notifications, 'object');
	
// RescueTime
if (!localStorage.RTOnOffSelect) { localStorage.RTOnOffSelect = "Off" };
if (!localStorage.RTFrequency) { localStorage.RTFrequency = 15 };

if (!localStorage.RTPosSti) { localStorage.RTPosSti = "vibration" };
if (!localStorage.RTWarnSti) { localStorage.RTWarnSti = "beep" };
if (!localStorage.RTNegSti ) { localStorage.RTNegSti = "shock" };

if (!localStorage.RTPosLimit) { localStorage.RTPosLimit = 70 };
if (!localStorage.RTWarnLimit) { localStorage.RTWarnLimit = 50 };
if (!localStorage.RTNegLimit ) { localStorage.RTNegLimit = 30 };


var defInt = '';
var defAT = '';
}

function removeInlineStyle(element){
	$(element).attr('style', '');
}

function fixNoEndTime(){
	var ps = [lsGet('pomoFocusO', 'parse'), lsGet('pomoFocusB', 'parse'), lsGet('pomoFocusP', 'parse')];
	var pages = ['options', 'background', 'popup'];
	var now = deltaTime(0).getTime();
	
	for ( p = 0; p < ps.length; p++ ){
		var pomoFocus = ps[p];
		if (pomoFocus.endTime * 2 / 2 == pomoFocus.endTime){
			continue
		}
		else {
			pomoFocus.endTime = now;
			savePomoFocus(pomoFocus, pages[p]);
		}
	}
}

function getPomoFocus(win){
	var obj;
	if (win == 'background') 	{
		var t = lsGet('pomoFocusB');
		if (t == undefined || t == 'undefined') { 
			obj = {}; 
			obj.lastUpdate = deltaTime(0).getTime();
		}
		else { obj = lsGet('pomoFocusB', 'parse'); }
	}
	else if (win == 'options') 	{
		var t = lsGet('pomoFocusO');
		if (t == undefined || t == 'undefined') { 
			obj = {}; obj.lastUpdate = deltaTime(0).getTime();
		}
		else { obj = lsGet('pomoFocusO', 'parse'); }
	}
	else if (win == 'popup') {
		var t = lsGet('pomoFocusP');
		if (t == undefined || t == 'undefined') { 
			obj = {}; obj.lastUpdate = deltaTime(0).getTime();
		}else { obj = lsGet('pomoFocusP', 'parse'); }
	}
	
	return obj
}

function savePomoFocus(pomoFocus, win){
	var now = new Date().getTime();
	pomoFocus.lastUpdate = now;

	if (pomoFocus.endTime > now) {
		pomoFocus.active = true;
	}
	else {
		pomoFocus.active = false;
	}

	chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
		if (tabs.length == 0) {
			log("background debugger selected");
			return
		}
		chrome.tabs.sendMessage(tabs[0].id, 
		{
			action: "pomodoro", 
			pomodoro: pomoFocus
		});
	});
	
	lsSet('pomoFocusB', pomoFocus, 'object');
	return pomoFocus
}

function equalizePomoFocus(latest){
	lsSet('pomoFocusB', latest, 'object');
	lsSet('pomoFocusO', latest, 'object');
	lsSet('pomoFocusP', latest, 'object');
}

function lsSet(key, data, dataType){
	if (!dataType) { dataType = 'string'; }
	var returnData;
	if (dataType == 'object') { 
		returnData = JSON.stringify(data); 
	}
	else { returnData = data; }
	
	return localStorage.setItem(key, returnData);
}

function lsGet(key, parse){
	if (localStorage.getItem(key) == null) { return undefined };
	
	if (!parse) { parse = 'string' };
	var returnData = localStorage.getItem(key);
	
	if (parse == 'parse') { 
		try {
			returnData = JSON.parse(returnData)
		}
		catch(err){
			log("Problem trying to parse " + key);
			log(err);
			log(returnData);
		}
	}
	else { returnData = localStorage.getItem(key); }
	
	return returnData
}

function lsDel(key){
	localStorage.removeItem(key);
}

function nowTime(){
	return new Date().getTime();
}

function compareSetting(LSsetting, elementName, override){
	if (override == "override"){
		var curVal = elementName;
	} else{
		var curVal = $(elementName).val();
	}
	
	var newVal = lsGet(LSsetting);
	
	if (curVal == newVal) { return true }
	else { return false }
}
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
	log(localStorage.baseAddress + 'api/v1/me?access_token=' + accessToken);
	
	$.get(localStorage.baseAddress + 'api/v1/me?access_token=' + accessToken)
	.done(function (data) {
		log(data);
		log("GOOD token. Works on API.");
		return true
	})
	.fail(function(){
		log("BAD token. Fails on API.");
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

var notifyUpdate = false;
var noSUN = setTimeout(function(){
	notifyUpdate = true;
}, 1000);

function confirmUpdate(notify){
	if (notify){
		notifyUser('Settings updated', '', 'updatedSettings');
		clearTimeout(notTimeout);
		notTimeout = setTimeout(function(){chrome.notifications.clear('settingsUpdated')}, 2000);
	}
}

// Tour
function openOptions(){
	window.open('options.html','_blank');
}

// Background
function UpdateBadgeOnOff(badgeText) {
	var logged = isValid(localStorage.accessToken);
	var badgeStatus = lsGet('badgeStatus');
	
	if (logged == true){
		if (badgeStatus == "off"){
			chrome.browserAction.setIcon({path: 'images/logo_128x128.png'});
			badgeStatus = "on";
		}
		chrome.browserAction.setBadgeBackgroundColor({ color: [38, 25, 211, 255] });
		chrome.browserAction.setBadgeText({ text: badgeText });
	}
	else{
		if (badgeStatus == "on" || badgeStatus == false){
			chrome.browserAction.setIcon({path: 'images/off_128x128.png'});
			badgeStatus = "off";
		}
		chrome.browserAction.setBadgeBackgroundColor({ color: [100, 100, 100, 130] });
		chrome.browserAction.setBadgeText({ text: "Off" });
	}
	lsSet('badgeStatus', badgeStatus);
}

function UpdateTabCount(tabCount) {
	if (localStorage.tabNumbersActive == "true"){
		UpdateBadgeOnOff(tabCount + '/' + localStorage.maxTabs);
	}
	else {
		UpdateBadgeOnOff('' + tabCount);
	}
}

function countTabs(mode, callback){
	accountedWindowsId = [];
	totalTabs = 0;
	lastWindowID = 0;
	if (mode == 'allWindows') {
		chrome.windows.getAll({populate:true},function(windows){
			windows.forEach(function(window){
				if (accountedWindowsId.indexOf(window.id) == -1){
					accountedWindowsId.push(window.id);
					var winTabs = window.tabs.length;
					totalTabs = totalTabs + winTabs;
				}
			});
			
			
			if (typeof callback === "function"){
				callback(totalTabs);
			}
		});
	}
	else {		
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
			curPavTab = tabs[0];
			chrome.tabs.getAllInWindow(curPavTab.windowId, function(tabs) {
				totalTabs = tabs.length;
				
				if (typeof callback === "function"){
					callback(totalTabs);
				}
			});
		});
		
	}
	
	
	
	return
}

function evaluateTabCount(tabCount){
	var maxTabs = parseInt(localStorage.maxTabs);
	if(!maxTabs || maxTabs == "no") {
		return;
	}
	
	// How is number of tabs compared to tab limit (maxTabs)?
	if(tabCount > maxTabs) {
		situation.status = "over";
		stimuli("shock", defInt, defAT, "Too many tabs");
		log("total tabs over max tabs");
	}
	else if (tabCount == maxTabs ){ 
		situation.status = "limit";
		stimuli("beep", defInt, defAT, "Incoming Beep. You're at the limit on tabs");
	 
	}
	else if (tabCount == maxTabs - 1){ 
		situation.status = "borderline";
		stimuli("vibration", defInt, defAT, "Incoming vibration. You're nearing the limit on tabs");
	}
	else { situation.status = "wayBellow"};
	
	previousTabs = tabCount;
	notifyTabCount(tabCount, situation);
}

function clearCookies(){
	/* Currently unsupported */
	
	// chrome.cookies.remove({
		// url: "pavlok-mvp.herokuapp.com",
		// name: "ajs_user_id"
	// });
	
	// chrome.cookies.remove({
		// url: "pavlok-mvp.herokuapp.com",
		// name: "ajs_group_id"
	// });
	
	// chrome.cookies.remove({
		// url: "pavlok-mvp.herokuapp.com",
		// name: "ajs_anonymous_id"
	// });
	
	// chrome.cookies.remove({
		// url: "pavlok-mvp.herokuapp.com",
		// name: "_session_id"
	// });
	
	// chrome.cookies.remove({
		// url: "pavlok-mvp.herokuapp.com",
		// name: "remember_user_token"
	// });
}

function validateUserInfo(info){
	var email 	= info.userName;
	var pass 	= info.password;
	
	var problems = [];
	
	var hasAt = email.indexOf("@") > 0;
	var hasDot = email.indexOf(".") > 0;
	
	var user;
	if (hasAt && hasDot) 	{ user = true }
	else 					{ user = false }
	
	var hasPass = pass.length > 0;
	
	if (user && pass){ return true}
	else { return false }
}

function toggleSignInOut(){
	var token = lsGet('accessToken');
	if (isValid(token)){
		$("#signIn").addClass("noDisplay");
		$("#signOut").removeClass("noDisplay");
	}
	else{
		$("#signIn").removeClass("noDisplay");
		$("#signOut").addClass("noDisplay");
	}
}

function signOut(){ 
	revokeAccessToken();
	UpdateBadgeOnOff("Off");
	msgInterfaces({action: "logged", token: 'not logged'})
	
	localStorage.setItem('logged', 'false');
	lsDel('accessToken');
	clearCookies();
}

function signIn(user){
	getAccessToken(user);
}

function showOptions(accessToken){
	if (isValid(localStorage.accessToken)){
		$(".onlyLogged").css('visibility', 'visible'); 
		$(".onlyUnlogged").css('display', 'none'); 
		$("#testPairing").show();
		$("#testPairingX").show();
	}
	else { 
		$(".onlyLogged").css('visibility', 'hidden'); 
		$("#unloggedMessage").hide();
		$(".onlyUnlogged").css('display', 'block'); 
		$("#unloggedMessage").show();
		$("#testPairing").hide();
		$("#testPairingX").hide();
	}
}

function showName(name){ // mark for review
	if (name == 'undefined' || name == 'null' || name == undefined || name == null ) {
		log("SHOW NAME has username as undefined. Name is " + name)
		return
	}
	else {
		var userName = document.getElementById("userName");
		userName.style.visibility = "visible";
		userName.innerHTML = ", " + localStorage.userName;
		
		log('Username is ' + userName);
	}
	return
}

function updateNameAndEmail(name, email){
	if ( $("#userName")  ) 	{ $("#userName").html(name); }
	if ( $("#userEmail") ) 	{ $("#userEmail").html(email); }
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
function notifyUser(title, message, notID, persist){
	if (typeof(title) == "object"){
		var NotList = lsGet('notifications', 'parse');
		var Not = _.where(NotList, {usage: title});
		
		var opt = {
			type: "basic",
			title: Not.title,
			message: Not.message,
			iconUrl: "icon.png"
			
		};
		
		var notID = Not.id;
	}
	else{
		var opt = {
			type: "basic",
			title: title,
			message: message,
			iconUrl: "icon.png"
			
		};
	}
	
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

function clearSpaces(string){
	var x = string;
	x[0] = x.replace(" ", "");
	x[0] = x.replace(/\s/g, "");
	x[0] = x.replace(/\t/g, "");
	x[0] = x.replace(/\n/g, "");
	x[0] = x.replace(/\r/g, "");
	
	return x;
}

function isEmpty(x){
	var answer;
	
	if (typeof(x) == "undefined") { return true; }
	if (typeof(x) == "array"){
		if (x.length === 0) { return true; } // Empty Array
		if (x.length === 1) {
			if (clearSpaces(x[0]).length === 0) { return true }
		}
	}
	if (typeof(x) == "object"){
		if (Object.keys(x).length === 0) { return true; } // Empty Object
	}
	if(x.length === 0) { return true; }
	if (typeof(x) == "string") {
		if (clearSpaces(x).length === 0) { return true }
	}
	return false;
}

function saveBlackList(){
	var curBlackList = $("#blackList")[0].value;
	
	var ok = validateTags(curBlackList);
	if (ok == true){
		lsSet('blackList', curBlackList);
	}
	else {
		var faulty = curBlackList.split(',');
		var newList = fixTags(faulty);
		lsSet('blackList', newList);
	}
	
	confirmUpdate(notifyUpdate);
	msgInterfaces({action: "updateBlackList"});
}

function saveWhiteList(){
	curWhiteList = $("#whiteList")[0].value;
	var ok = validateTags(curWhiteList);
	if (ok == true){
		lsSet('whiteList', curWhiteList);
	}
	else {
		var faulty = curWhiteList.split(',');
		var newList = fixTags(faulty);
		lsSet('whiteList', newList);
	}
	
	confirmUpdate(notifyUpdate);
	msgInterfaces({action: "updateBlackList"});
}

function validateTags(list){
	var tags;
	
	if (list == "") { tags = []; }
	else {tags = list.split(',');}
	 
	var problems = [];
	
	if (tags.length > 0){
		for (t = 0; t < tags.length; t++){
			curTag = tags[t];
			var www = curTag.indexOf("www.") != -1;
			var http = curTag.indexOf("http:") != -1;
			var https = curTag.indexOf("https:") != -1;
			
			var notOk = (www || http || https);
			
			if (notOk == true) {problems.push(curTag);}
		}
	}
	
	if (problems.length > 0){
		return false
	}
	return true
	
}

function fixTags(problems){
	var list = [];
	for (p = 0; p < problems.length; p++){
		var original = problems[p];
		var work = original;
		
		var targets = ["https://", "http://", "www."];
		
		for (t = 0; t < targets.length; t++){
			curTarget = targets[t];
			if (work.indexOf(curTarget) == 0){
				work = work.split(curTarget)[1];
			};
		}
		
		list.push(work);
		log(original + "\n" + work);
	}
	return list;
}

function notifyBadTags(problems){
	if (notifyInterval == false){
		return
	}
	
	var corrections = fixTags(problems);
	
	notifyInterval = false;
	setTimeout(function(){notifyInterval = true}, 10000);
	
	var fixMessage = 	'' +
						'<p>You had a few whitelisted sites that will not fire properly.</p><p><b>We adjusted them for you, but check if you still recognize them</b>. For instance:</p>' + 
						'<p><i><span class="red">https://www.</span>facebook.com</i> becomes <i>facebook.com</i></p>' +
						'<p>The addresses who need your attention are:</p><ul>';
	for (p = 0; p < problems.length; p++){
		fixMessage = fixMessage + '<li>' + corrections[p] + " which was " + problems[p] + '</li>';
	}
	fixMessage = fixMessage + "</ul>"
	
	$.prompt(fixMessage, {
		title: "Some whitelist items need correction"
	});
}

/*--------------------------------------------------------------------------*/
/*--------------------------------------------------------------------------*/
/*--------															--------*/
/*--------						4.API conversation					--------*/
/*--------															--------*/
/*--------------------------------------------------------------------------*/
/*--------------------------------------------------------------------------*/

function save_options() { // Mark for deletion
	// Get data and store it in LocalStorage
	var select = document.getElementById("wantToSave");
	localStorage.maxTabs = select;
	
}

function getAccessToken(userData, callback){
	
	var userName = userData.userName; //"igor.galvao@gmail.com";
	var password = userData.password; //"Macpp1udemdamamne";
	var grant_type = "password";
	log("Trying login for " + userName + "\npass: " + password);
	var baseAddress = "https://pavlok-mvp.herokuapp.com/";
	var apiAddress	= "api/v1/";
	var x = baseAddress + "api/v1/" + "sign_in" + 
	   "?grant_type=" + grant_type +
	   "&username="   + userName +
	   "&password="   + password;
	   
	$.post(x)
	.done(function(data){
		log("done");
		log(data);
		var token = data.access_token;
		lsSet('accessToken', token);
		lsSet('logged', 'true');
		
		spread(token);
	})
	.fail(function(){
		log("failed");
		// Message interface for login failed;
	});
}

function spread(token){
	msgInterfaces({
		action: "logged",
		token: token
	});
	
	countTabs(localStorage.tabCountAll, UpdateTabCount);
}

function revokeAccessToken(){
	var baseAddress = "https://pavlok-mvp.herokuapp.com/";
	var apiAddress	= "api/v1/";
	var signOut		= "sign_out"
	var parameters	= "?token=" + localStorage.accessToken;
	
	var target = baseAddress + apiAddress + signOut + parameters;
	
	lsDel("accessToken");
	
	$.post(target)
	.done(function(data){
		log("done");
		log(data);
		lsDel("accessToken");
		msgInterfaces({action: "logged", token: 'not logged'});
	})
	.fail(function(){
		log("failed");
	});
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
		var clientID = "7d90dbab1f8723cd8fd15244f194c8a370736bd48acffcca589c9901454df935";
		var clientSecret = "83a2de725b3ec336393a5cb59e4399bd5dc2f51c5e7aeb37d3249d7ee622523c";
	}
	else if (usage == "varunSTAGE" || usage || "varunMVP" ){
		var clientID = "f55f448e93f68a8a3b9e4723be626e62553d6d54c9ebe2924bf022c4e88695e0";
		var clientSecret = "7cf4d85e884193dab1365845dcb1593c5c6529c538d9310df3b7c485daf40682";
	}
	var authURL = localStorage.baseAddress + "oauth/authorize?" + 
		'client_id=' + clientID +
		'&redirect_uri=' + redirectURL +
		'&response_type=code' +
		'&prompt=select_account';
	
	log("Step 1: Redirect URL is: " + redirectURL);
	
	chrome.identity.launchWebAuthFlow(
		{url: authURL, interactive: true},
		
		function(responseUrl) {
			// Get Auth code
			log("Step 2: Response url with code is:" + responseUrl);
			authorizationCode = responseUrl.substring(responseUrl.indexOf("=")+1);
			log("Step 3: Authorizaion code is: " + authorizationCode);
			
			// Exchange AuthCode for Access Token:
			accessTokenUrl = 
				localStorage.baseAddress 
				+ "/oauth/token?" 
				+ 'client_id=' + clientID 
				+ '&client_secret=' + clientSecret 
				+ '&code=' + authorizationCode 
				+ '&grant_type=authorization_code' 
				+ '&redirect_uri=' + redirectURL;
			
			log("Step 4: Access token Url is: " + accessTokenUrl);
			
			$.post(accessTokenUrl)
				.done(function (data) {
					log(data);
					var accessToken = data.access_token;

					msgInterfaces({action: 'logged', token: accessToken});
					localStorage.setItem('logged', 'true');
					localStorage.setItem('accessToken', accessToken);
					chrome.windows.getLastFocused(function(win) {
						countTabs(localStorage.tabCountAll, UpdateTabCount);
						showOptions(accessToken);
						userInfo(accessToken);
					});
					log("OAuth2 test concluded");
					chrome.notifications.clear("installed");
					notifyUser('Hooray! Welcome aboard!', 'Click here to start using the Productivity Extension', 'signedIn');
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
	
	log("Step 1: Redirect URL is: " + redirectURL);
	
	chrome.identity.launchWebAuthFlow(
		{url: authURL, interactive: true},
		
		function(responseUrl) {
			// Get Auth code
			log("Step 2: Response url with code is:" + responseUrl);
			authorizationCode = responseUrl.substring(responseUrl.indexOf("=")+1);
			log("Step 3: Authorizaion code is: " + authorizationCode);
			
			// Exchange AuthCode for Access Token:
			accessTokenUrl = 'https://github.com/login/oauth/access_token?' + 
			'client_id=' + clientID + 
			'&client_secret=' + clientSecret + 
			'&code=' + authorizationCode + 
			'&redirect_uri=' + redirectURL;
			'&state=' + state;
			
			log("Step 4: Access token Url is: " + accessTokenUrl);
			
			$.post(accessTokenUrl)
				.done(function (data) {
					log(data);
					var accessToken = data.split("=")[1];
					localStorage.setItem('loggedRT', 'true');
					localStorage.setItem('accessTokenRT', accessToken);
					
					$("#rescueTimeData").html($.get("https://api.github.com/user?access_token=" + localStorage.accessTokenRT));
					
					
				});
			
			log("OAuth2 test concluded");
			
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
				log('User info for ' + data.name + ' succeeded. \nHis UID is:' + data.uid);
				localStorage.setItem('userEmail', data.email)
				localStorage.setItem('userName', data.name);
				updateNameAndEmail(localStorage.userName, localStorage.userEmail);
				return data.name;
		})
		.fail(function(){
			log('User information request failed');
		});
}

function stimuli(stimulus, value, accessToken, textAlert, forceNotify) {
	var now = new Date().getTime();
	var dif = now - lastVib;
	lastVib = now;
	if (dif < limitRep) { return }
	
	stimuliTypes = ['shock', 'vibration', 'beep'];
	defIntensities = [localStorage.zapIntensity, localStorage.vibrationIntensity, localStorage.beepIntensity]; // zap, vibration, beep
	
	if (!value || value == 'defInt' || '') { value = defIntensities[stimuliTypes.indexOf(stimulus)]; }
	if (!accessToken || accessToken == 'defAT' || '') { accessToken = localStorage.accessToken; }
	if (!textAlert){ textAlert = "Incoming " + stimulus; }
	
	var notify = true;
	
	if ( stimulus == 'beep' && localStorage.notifyBeep == 'false' ) { notify = false; }
	else if ( stimulus == 'vibration' && localStorage.notifyVibration == 'false' ) { notify = false; }
	else if ( stimulus == 'shock' && localStorage.notifyZap == 'false' ) { notify = false; }
	
	if ( forceNotify == 'false' ) { notify = false; }
	else if ( forceNotify == 'true' ) { notify = true; }
	
	// if (notify) { $.prompt(textAlert); }
	
	postURL = 	localStorage.baseAddress + 'api/v1/stimuli/' + 
				stimulus + '/' + 
				value + 
				'?access_token=' + accessToken;
				
	// if (server == 'STAGE') { postURL = postURL + '&reason=' + textAlert; }
	if (textAlert.length > 0) { postURL = postURL + '&reason=' + textAlert; }
	else { alert("stimuli without reason"); }
	
	log("URL being POSTED is:\n" + postURL);
	$.post(postURL)
		.done(function (data, result) {
			return log(stimulus + ' succeeded!\n' + data + " " + result);
		})
		.fail( function() {
			log('Failed the new API. Trying the old one');
			objectCode = localStorage.objectCode;
			if (stimulus == "vibration") { stimulus = "vibro"; }
			log(stimulus + ' failed!\nUrl was: ' + postURL + "\nTrying the old API at: ");
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
	
	log("Step 1: Redirect URL is: " + redirectURL);
	
	chrome.identity.launchWebAuthFlow(
		{url: authURL, interactive: true},
		
		function(responseUrl) {
			// Get Auth code
			log("Step 2: Response url with code is:" + responseUrl);
			authorizationCode = responseUrl.substring(responseUrl.indexOf("=")+1);
			log("Step 3: Authorizaion code is: " + authorizationCode);
			
			// Exchange AuthCode for Access Token:
			accessTokenUrl = tokenURL;
			log("Step 4: Access token Url is: " + accessTokenUrl);
			
			$.post(accessTokenUrl)
				.done(function (data) {
					log(data);
					localStorage.lastOAuthData = data;//JSON.strigigy(data);
					var accessToken = data.split("=")[1];
					localStorage.setItem('oauthSuccess', 'true');
					localStorage.setItem('lastAccessToken', accessToken);
					localStorage.setItem('lastAccessToken', accessToken);
					
					
					log("OAuth2 test concluded");
				})
				.fail(function() {
					log("OAuth failed.")
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

function dayChange(){
	var now = new Date();
	var today = now.getDate();
	var month = now.getMonth();
	var curDate = today + "-" + month;
	
	var lastTime = lsGet('lastTimeCheck') || 0;
	
	var lastDate = new Date(lastTime);
	var lastDay  = lastDate.getDate();
	var lastMonth = lastDate.getMonth();
	var prevDate = lastDay + "-" + lastMonth;
	
	lsSet('lastTimeCheck', now);
	if (curDate != prevDate){
		return true
	}
	else {return false}
}

function convertTimeFormat(time, toFormat){
	var curFormat = 12;
	var newTime;
	
	if ( time.indexOf("AM") == -1 && time.indexOf("PM") == -1 ) { 
		curFormat = 24 
	};
	
	if (toFormat == 12){
		if ( curFormat == 12 ) { 
			return time 
		}
		else {
			newTime = time.replace(":", " ");
			newTime = newTime.split(" ");
			hours = parseInt(newTime[0]);
			minutes = parseInt(newTime[1]);
			
			if (hours >= 12) {
				code = "PM";
				if (hours > 12){ 
					hours = hours - 12; 
				}
				else { 
					hours = 12; 
				}
			} else{
				code = "AM";
				if (hours == 0) { hours = 12;}
			}
			
			// if (hours.length == 1)	{ hours 	= "0" + hours; }
			if (minutes.length == 1){ minutes 	= "0" + minutes; }
			newTime = hours + ":" + minutes + " " + code;
			
		}
	}
	else if (toFormat == 24){
		if ( curFormat == 24 ) { return time }
		else{
			newTime = time.replace(":", " ");
			newTime = newTime.split(" ");
			hours = parseInt(newTime[0]);
			minutes = newTime[1];
			code = newTime[2];
			
			if (code == "PM") { hours = hours + 12; }
			
			// if (hours.length == 1)	{ hours 	= "0" + hours; }
			if (minutes.length == 1){ minutes 	= "0" + minutes; }
			newTime = hours + ":" + minutes;
		}
	}
	

	return newTime
	
}

function deltaTime(seconds, baseDate){
	if (!baseDate){ 
		var baseDate = new Date();
	}
	
	var future = new Date();
	future.setTime(baseDate.getTime() + seconds * 1000);
	
	return future
}

function dateFromTime(time){
	var date = new Date();
	date.setTime(time);
	return date
}

function percentToRaw(percent, stimulus){
	var rawRange;
	if (stimulus == 'zap'){
		rawRange = [32, 64, 85, 112, 128, 144, 160, 176, 192, 255];
	}
	else if (stimulus == 'beep' || stimulus == 'vibrate'){
		rawRange = [55, 75, 95, 115, 135, 155, 175, 195, 215, 255];
	}
	
	var index = ((parseInt(percent))/10) - 1;
	var rawN = rawRange[index];
	
	return rawN
}

function rawToPercent(raw, stimulus){
	raw = parseInt(raw);
	var rawRange;
	if (stimulus == 'zap'){
		rawRange = [32, 64, 85, 112, 128, 144, 160, 176, 192, 255];
	}
	else if (stimulus == 'beep' || stimulus == 'vibrate'){
		rawRange = [55, 75, 95, 115, 135, 155, 175, 195, 215, 255];
	}
	
	var index = rawRange.indexOf(raw);
	
	var percN = (index + 1) * 10;
	return percN
}

function isActive(){
	var dayHour = checkActiveDayHour();
	var token = isValid(localStorage.accessToken);
	
	return dayHour && token
}

function msgInterfaces(msg){
	msg.target = "popup";
	chrome.runtime.sendMessage(msg);
	msg.target = "options";
	chrome.runtime.sendMessage(msg);
}

function msgBackground(msg){
	msg.target = "background";
	chrome.runtime.sendMessage(msg);
}

function arrayObjectIndexOf(myArray, searchTerm, property) {
    for (var i = 0, len = myArray.length; i < len; i++) {
        if (myArray[i][property] === searchTerm) return i;
    }
    return -1;
}

function toBoolean(string){
	try { string = string.toLowerCase() }
	catch(err) { log(err); }
	
	var bStatus = true;
	
	if (
		isEmpty(string) || 
		string === "false" || 
		string === false
		) { bStatus = false; }
	
	return bStatus
}

function setVal(data){
	var target = $(data.dom);
	if (isEmpty(target)) { target = data.dom2; }
	
	var type = $(target).prop("nodeName");
	var subType = $(target).prop("type") || "none";
	
	if (type == "INPUT" && subType == "checkbox"){
		$(target).prop("checked", data.value);
	}
	else {
		$(target).val(data.value);
	}
	
	return
}

function interfaceListeners(page){
	chrome.extension.onMessage.addListener(
		function(request, sender, sendResponse) {
			if (request.target == page){
				if (request.action == "updateBlackList"){
					var bl = compareSetting("blackList", "#blackList");
					var wl = compareSetting("whiteList", "#whiteList");
					
					if (bl == false || wl == false){
						$("#blackList").importTags(lsGet('blackList'));
						$("#whiteList").importTags(lsGet('whiteList'));
					}
					
					var nBL = lsGet('blackList', 'parse');
					blackListTable.create(nBL, 'blackList');
				}
				
				// else if (request.action == "updateMaxTabs"){
					// var maxTabs = request.maxTabs;
					// var mt = compareSetting(maxTabs, "#maxTabsSelect");
					// if (mt == false){ 
						// setVal({target: "#maxTabsSelect", value: maxTabs});
					// }
				// }
				
				else if (request.action == "updateStimuli"){
					var bi = compareSetting("beepPosition", $("#sliderBeep").slider("value").toString(), "override");
					var zi = compareSetting("zapPosition", $("#sliderZap").slider("value").toString(), "override");
					var vi = compareSetting("vibrationPosition", $("#sliderVibration").slider("value").toString(), "override");
					
					if ((bi && zi && vi) == false ){
						$("#sliderBeep")		.slider("value", parseInt(lsGet('beepPosition'		)));
						$("#sliderVibration")	.slider("value", parseInt(lsGet('vibrationPosition'	)));
						$("#sliderZap")			.slider("value", parseInt(lsGet('zapPosition'		)));
					}
				}
				
				else if (request.action == "updatePomo"){
					pavPomo.frontend.updateCountdown(request.pomo);
				}
				
				else if (request.action == "logged"){
					showOptions(request.token);
				}
				
				else if (request.action == "todoist"){
					if (request.change == "unlogged"){
						todoist.frontend.toggle();
					}
					else if (request.change == "logged"){
						todoist.frontend.toggle();
					}
				}
			}
		}
	);
}









var blackListTable = {
	create: function(list, target){
		var base = target;
		target = "#" + target;
		
		var table = $(target + " > table");
		
		var hour;
		var day;
		var row;
		var newSiteRow;
		var titlesRow;
		var limitRow;
		
		var s;
		var site;
		var sites = Object.keys(list);
		
		var global = lsGet("blackGlobal", "parse") || false;
		var globalHourly = (global.status === "hourly");
		
		// Empty table structure
		var tableCode = 
			$("<table>", {id: base + "Table"})
				.append( $("<thead>") )
				.append( $("<tbody>") )
				.append( $("<tfoot>") );
				
		if (table.length === 0){
			$(target).append(tableCode);
		}
		else {
			$(table).replaceWith( tableCode );
		}
		
		newSiteRow = $("<tr>", {class: "newBLTR"})
			.append( $("<td>")
				.append( $("<input>", {type: "text", id: "siteName", class: "siteAddress", placeholder: "Add site... ie: facebook.com" }) )
			)
			.append( $("<td>", {class: "limitTime"}) 
				.append( $("<input>", {type: "text", id: "limit" + "new", class: "limitTime", placeholder: "ie: 5" }) )
			)
			.append( $("<td>", {class: "limitType"}) 
				.append( $("<select>", {id: "scope" + "new", class: "limitType" })
					.append( $("<option>", {value: "daily", text: "daily"}) )
					.append( $("<option>", {value: "hourly", text: "hourly"}) )
				)
			)
			.append( $("<td>", {class: "hoverOnly"}) 
				.append( $("<input>", {type: "button", id: "addNewBL", class: "addNewBLButton", value: "+" }) )
			);
		
		titlesRow = $("<tr>", {class: ""})
			.append( $("<th>", {text: "Site", class: "siteAddress"}) )
			.append( $("<th>", {text: "Minutes", class: "limitMinutes"}) )
			.append( $("<th>", {text: "Frequency", class: "limitType"}) )
			.append( $("<th>", {text: ""}) );
		
		limitRow = $("<tr>", {class: "totalLimitTR"})
			.append( $("<td>", {class: "inLiner"})
				.append( $("<input>", {type: "checkbox", id: "totalLimit", checked: global.status }) )
				.append( $("<span>", {text: "Total Limit", id: "totalLimitSpan" }) )
			)
			.append( $("<td>", {class: "limitTime"}) 
				.append( $("<input>", {type: "text", id: "limit" + "global", class: "limitTime", placeholder: "ie: 5", value:  global.limit}) )
			)
			.append( $("<td>", {class: "limitType"}) 
				.append( $("<select>", {id: "scope" + "global", class: "limitType" })
					.append( $("<option>", {value: "daily", text: "daily"}) )
					.append( $("<option>", {value: "hourly", text: "hourly"}) )
				)
			)
			.append( $("<td>", {class: "hoverOnly"}) );
		
		
		
		$(target + " > table > thead").append(titlesRow);
		$(target + " > table > thead").append(newSiteRow);
		
		$(target + " > table > tfoot").append(limitRow);
		// Filling rows
		for (s = 0; s < sites.length; s++){
			site = sites[s];
			limit = list[site].limit;
			type = list[site].type;
			
			if (type == "daily") {
				dailyOpt = $("<option>", {value: "daily", text: "daily", selected: true});
				hourlyOpt = $("<option>", {value: "hourly", text: "hourly"});
			}
			else{
				dailyOpt = $("<option>", {value: "daily", text: "daily"});
				hourlyOpt = $("<option>", {value: "hourly", text: "hourly", selected: true});
			}
			row = $("<tr>", {class: "blackListRow"})
				.append( $("<td>")
					.append( $("<input>", {type: "text", id: "address" + site, class: "siteAddress", value: site }) )
				)
				.append( $("<td>", {class: "limitTime"}) 
					.append( $("<input>", {type: "text", id: "limit" + site, class: "limitTime", value: limit }) )
				)
				.append( $("<td>", {class: "limitType"}) 
					.append( $("<select>", {id: "scope" + site, class: "limitType" })
						.append( dailyOpt )
						.append( hourlyOpt )
					)
				)
				.append( $("<td>", { class: "hoverOnly buttonHolder" }) 
					.append( $("<input>", {type: "button", id: "delete" + site, class: "deleteRowButton", value: "x" }) )
				);
			$(target + " > table > tbody").append(row);
		}
		
		blackListTable.listenClicks();
		$("#scopeglobal").val(global.type);
	},
	
	listenClicks: function(){
		
		$('#blackList input').on('keydown', function(e) {
			// Create and Edit Black List items
			if (e.which == 13) {
				e.preventDefault();
				var msg = blackListTable.getRowInfo(this);
				
				log(msg);
				msgBackground(msg);
			}
		});
		
		$('#blackList select').on('change', function(e) {
			// Change evaluation between hourly and daily
			e.preventDefault();
			var msg = blackListTable.getRowInfo(this);
			
			log(msg);
			msgBackground(msg);
		});
		
		$('#blackList input:checkbox').on('change', function(e) { 
			// Change the global status
			var msg = blackListTable.getRowInfo(this);
			
			log(msg);
			msgBackground(msg);
			status = $(this).prop("checked");
			status = toBoolean(status);
			blackListTable.toggle(status);
			
		});
		
		$("#blackList .deleteRowButton").on("click", function(){
			var name = $(this)
						.attr("id")
						.replace("delete", "");
					
			msg = {
				action: "blackList",
				do: "delete",
				name: name,
				list: "black"
			};
			
			msgBackground(msg);
		});
	},
	
	toggle: function(globalBL){
		
		globalBL = globalBL === "true";
		
		// All the regular inputs go one way
		$(".limitTime").prop("disabled", globalBL);
		$(".limitType").prop("disabled", globalBL);
		
		// Total time goes the other way
		$("#limitglobal").prop("disabled", !globalBL);
		$("#scopeglobal").prop("disabled", !globalBL);
		
	},
	
	getRowInfo: function(focused){
		var action = "new";
		var oldName;
		var status;
		
		var row = $(focused).closest("tr");
		var rowType;
		
		if 		( $(row).hasClass("totalLimitTR") ) { rowType = "global"; }
		else if ( $(row).hasClass("blackListRow") ) { rowType = "old Site"; }
		else if ( $(row).hasClass("newBLTR") ) 		{ rowType = "new Site"; }
		
		var limit = parseInt($(focused).closest("tr").find("input.limitTime").val()) || 0;
		var type = $(focused).closest("tr").find("select.limitType").val() || "daily";
			
		if (rowType == "old Site" || rowType == "new Site"){
			var name = $(focused).closest("tr").find("input.siteAddress").val();
			
			// Validation
			if (name.length === 0) { return; }
			
			if ( rowType == "old Site" ){
				action = "edit";
				oldName = $(focused).closest("tr").find("input.siteAddress").prop('id');
				oldName = oldName.replace("address", "");
			}
			else { action = "new"; }
			
			msg = {
				name: name,
				limit: limit,
				type: type,
				do: action,
				action: 'blackList',
				list: "black"
			};
		
			if (action == "edit"){ msg["oldName"] = oldName; }
		}
		else if (rowType == "global"){
			status = $("#totalLimit").prop("checked");
			status = toBoolean(status);
			
			msg = {
				list: "global",
				limit: limit,
				type: type,
				status: status,
				action: "blackList"
			}
		}
		
		return msg;
	}
}

var maxTabsPack = {
	create: function(page, value){
		if (!value || isNaN(parseInt(value))){
			value = 8;
		}
		var old = $("#maxTabsSelect");
		var menu = $("<select>", {id: "maxTabsSelect", class: "pavSetting"})
		var item;
		
		var range = ["no", 
					1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
					11, 12, 13, 14, 15,
					20, 25, 30, 35, 40, 45, 50
					];
		
		for (i = 0; i < range.length; i++){
			var v = range[i];
			if (v == parseInt(value)){
				item = $("<option>", {text: v, value: v, selected: true});
			} else{
				item = $("<option>", {text: v, value: v});
			}
			$(menu).append(item);
		}
		
		$(old).replaceWith(menu);
		
		maxTabsPack.frontListener(page);
	},
	
	set: function(value){
		setVal({dom: "#maxTabsSelect", value});
	},
	
	frontListener: function(page){
		$("#maxTabsSelect").change(function(){
			var maxTabs = $(this).val();
			msgBackground({
				change: "settings",
				action: "update Max Tabs",
				maxTabs: maxTabs
			});
		});
		
		chrome.runtime.onMessage.addListener(
			function(request, sender, sendResponse) {
				r = request;
				if (r.target == page && r.action == "update Max Tabs"){
					var curV = $("#maxTabsSelect").val();
					var recV = r.value.toString();

					countTabs(localStorage.tabCountAll, UpdateTabCount);
					
					if (curV != recV){
						maxTabsPack.set(r.value);	
						confirmUpdate(true);
					}
					
				}
				
			}
		);
	},
	
	backListener: function(r){
		if (r.action == "update Max Tabs"){
			localStorage.maxTabs = r.maxTabs;
			var msg = {
				action: "update Max Tabs", 
				dom: "#maxTabsSelect", 
				value: r.maxTabs
			}
			msgInterfaces(msg);
		}
	}
}

function log(msg){
	try{
		if (JSON.parse(localStorage.verbose)){ console.log(msg); }
	}
	catch(err){}
}