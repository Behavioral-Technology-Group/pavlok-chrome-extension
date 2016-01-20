// To-do: get values for stimuli from our server, instead of hardcoding it
// To-do: Not punish users for closing tabs when above limit

// Globals
var curPAVtab, 
var curTimeOut;
var timeouts = [];

localStorage.setItem('timeouts', JSON.stringify(timeouts));

var accessToken = localStorage['accessToken']

function logOnPage(message){
	
}

function clearNotifications(){
	chrome.notifications.clear('firstWarning');
	chrome.notifications.clear('secondWarning');
	chrome.notifications.clear('relief');
}

function clearTimeouts(lastTimeout){
	// for (var i = 0 ; i < timeouts.length ; i++){
		// clearTimeout(timeouts[i]);
	// }
	a
	while (lastTimeout--) {
		window.clearTimeout(lastTimeout); // will do nothing if no timeout with id is present
		if ( lastTimeout == 0 ) { break }
	}
}

function checkPageOn(curPAVtab){
	console.log("-------------- NEW checkPageOn -------------");
	tabID = curPAVtab.id;
	console.log(curPAVtab.url)
	tabID = parseInt(tabID);
	
	chrome.tabs.get(tabID, function(Tab, callback){ 
		var curTab = Tab;
		var curTabURL = curTab.url;
		var curTabDomain = new URL(curTabURL).hostname.replace("www.", "");
		document.title = tabID + " " + curTab.url;
		
		// Checks for blackList.
		var _result = CheckBlackList(curTabURL, curTabDomain);
		
		if (_result == true) {
			document.title = "prohibited " + curTabDomain;
			console.log(curTimeOut);
			
			// if (timeouts.length == 0){
			if ( curTimeOut == undefined ) {
				clearNotifications();
				notifyProhibited("BLACKLISTED PAGE!", "Hurry, you still have 3 seconds to avoid the zap! Get outta here!", "firstWarning");

				// timeouts.push(setTimeout(function(){
				curTimeOut = setTimeout(function(){
					chrome.notifications.clear("firstWarning");
					notifyProhibited("Ouch!!!", "You still have 3 seconds to avoid the next zap! Get outta here!", "secondWarning")
					
					chrome.tabs.query({active: true, currentWindow: true},	 function(arrayOfTabs) {
						var activeTab = arrayOfTabs[0];
						var activeTabId = arrayOfTabs[0].id;
						document.title = "xx " + activeTabId + " " + activeTab.url;
						
						return checkPageOn(activeTabId);
						});
					
				}, 3000);
				
			}
		}
		
		if (_result == false){
			clearNotifications();
			curTimeOut = undefined;
			console.log("Timeout cleared!");
		}
	})
}

function CheckBlackList(curTabURL, curTabDomain) {
	
	var _result = '';
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
	
	chrome.tabs.getAllInWindow(tab.windowId, function(tabs) {
		var maxtabs = parseInt(localStorage.maxTabs);
		if(!maxtabs) {
			return;
		}

	var previousTabs = localStorage[tab.windowId];
	console.log("There were " + previousTabs + " open on this window.");
	UpdateTabCount(tab.windowId);
	console.log("There are " + localStorage[tab.windowID] + " open on this window.");
	
		if(tabs.length > maxtabs) {
			stimuli('vibro', 180, localStorage.accessToken);
		console.log("total tabs over max tabs");
		}
		else if (tabs.length > maxtabs - 1){ // Is this supposed to be "when user reaches his limit"?
		stimuli('beep', 3, localStorage.accessToken);
		 
		}
		else if (tabs.length > maxtabs - 2){ // Is this supposed to be "one less than limit"?
		stimuli('vibration', 230, localStorage.accessToken);
		}

	});

}

var currentSite = null;
var currentTabId = null;
var siteRegexp = /^(\w+:\/\/[^\/]+).*$/;

function CreateTabListeners(token) {
	if(!localStorage.maxTabs) {
		localStorage.maxTabs = 6;
	}
	
	// When page is updated
	chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
		if (tab.status=='complete'){
			// curPAVtab = tab;
		}
	});

	// When selected tab changes
	chrome.tabs.onActivated.addListener(
		function(tab) {
			curPAVtab = tab;
			tabId = tab.tabId;
			checkPageOn(tabId);
		}
	);
	
	// When new tab is created
	chrome.tabs.onCreated.addListener(function(tab) {
		CheckTabCount(tab, accessToken, 'shock');
	});

	// When tab is removed
	chrome.tabs.onRemoved.addListener(function(tab) {
		CheckTabCount(tab, "wrongToken", "noStimuli"); // Stimuli will fail to avoid punishing for getting back on track
	});

	// When tab is detached
	chrome.tabs.onDetached.addListener(function(tab) {
	var token = localStorage.getItem('accessToken');
		CheckTabCount(tab, accessToken, 'shock');
	});

	// When tab is attached
	chrome.tabs.onAttached.addListener(function(tab) {
		CheckTabCount(tab, accessToken, 'shock');
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
	var accessToken = localStorage.getItem('accessToken');
	
	CreateTabListeners(accessToken);
}

function notifyProhibited(title, message, notID){
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


/* Logic of timer */

/*
	Timer is supposed to give a breathing chance to users. Instead of zapping right away, once a bad trigger is set, it will begin a countdown of 10 seconds.
	
	If user still doing bad behavior, zap will get done. If not, timer is reset and stopped.
	
	NOT doing the bad behavior can be either:
		- Moving to a non-blacklisted URL (changing tab, going to another page)
		- Closing the browser
		- Activating some window other than browser
		
*/
initialize();
