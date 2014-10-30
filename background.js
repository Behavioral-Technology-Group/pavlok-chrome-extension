function signIn(){
  $('#signin_signout')
    .attr('href',"#")
    .text('Sign out')
    .click(signOut);
}

var successURL = 'https://www.facebook.com/connect/login_success.html';
var userFirstName = ''
var userEmail = ''

function onFacebookLogin(tab){
  chrome.tabs.query({}, function(tabs) {
    for (var i = 0; i < tabs.length; i++) {
      if (tabs[i].url.indexOf(successURL) !== -1) {
        var params = tabs[i].url.split('#')[1];
        var accessToken = params.split('&')[0];
        accessToken = accessToken.split('=')[1];
        localStorage.setItem('accessToken', accessToken);
        chrome.tabs.remove(tabs[i].id);
        console.log(accessToken);
        pullSecurityToken();
        alert("You're signed in! Feel free to edit your black sites and max tabs threshold!");
        console.log("User signed in")
        return true
      }
    }
  });
}8

chrome.tabs.onUpdated.addListener(function(tab){
  onFacebookLogin(tab);
});

var tempToken = "7fd3676716cfca982759728f62a10b15";

function pullSecurityToken(){
  var pointUrl = "http://pavlok.herokuapp.com/api/v1/retrieve_token_for/" + localStorage.accessToken + "/" + tempToken//localStorage.securityToken;
  var xhr = new XMLHttpRequest();
  xhr.open("GET", pointUrl, true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4) {
      console.log(xhr.responseText)
      localStorage.securityToken = xhr.responseText;
    }
  }
  xhr.send();
}

var response = '';

var lis = this;
chrome.tabs.getAllInWindow(null, function(tabs) {
  for (var i = 0; i < tabs.length; i++) {
    if (tabs[i].url.indexOf(successURL) == 0) {
      var token = tabs[i].url.match(/[\\?&#]auth_token=([^&#])*/i)
      chrome.tabs.onUpdated.removeListener(lis);
      return;
    }
  }
});

function UpdateBadge(count) {
  chrome.browserAction.setBadgeBackgroundColor({ color: [38, 25, 211, 255] });
  chrome.browserAction.setBadgeText({ text: count.toString() + "/" + localStorage.maxTabs });
}

function UpdateTabCount(windowId) {
  chrome.tabs.getAllInWindow(windowId, function(tabs) {
    UpdateBadge(tabs.length);
    localStorage[windowId] = tabs.length;
  });
}

function CheckBlackList(tab) {
  chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
    var curTabURL = tabs[0].url;
    var curTabDomain = new URL(curTabURL).hostname.replace("www.", "");
    if (localStorage.blackList.indexOf(curTabDomain) != -1){
      var xhr = new XMLHttpRequest();
      xhr.open("POST", 'http://pavlok.herokuapp.com/api/v1/shock/180/'+localStorage.securityToken, true);
      xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
          if(xhr.status == '401'){
            console.log("Security Token Invalid, please check and try again.");
          }
        }
      }
      xhr.send();
      console.log(curTabURL + " is blacklisted!");
    }
  });
}

function CheckTabCount(tab) {
  chrome.tabs.getAllInWindow(tab.windowId, function(tabs) {

    var maxtabs = parseInt(localStorage.maxTabs);
    if(!maxtabs) {
      return;
    }

	  UpdateTabCount(tab.windowId);

    if(tabs.length > maxtabs) {
      var xhr = new XMLHttpRequest();
      	xhr.open("POST", 'http://pavlok.herokuapp.com/api/v1/shock/180/'+localStorage.securityToken, true);
  		xhr.onreadystatechange = function () {
		}
		xhr.send();
    }
    else if (tabs.length > maxtabs - 1){
    	var xhr = new XMLHttpRequest();
    	xhr.open("POST", 'http://pavlok.herokuapp.com/api/v1/beep/3/'+localStorage.securityToken, true);
		  xhr.onreadystatechange = function () {
		  }
		  xhr.send();
    }
    else if (tabs.length > maxtabs - 2){
    	var xhr = new XMLHttpRequest();
    	xhr.open("POST", 'http://pavlok.herokuapp.com/api/v1/vibrate/230/'+localStorage.securityToken, true);
		  xhr.onreadystatechange = function () {
		  }
		  xhr.send();
    }

  });

}
var currentSite = null;
var currentTabId = null;
var siteRegexp = /^(\w+:\/\/[^\/]+).*$/;
//var siteRegexp = /(http:\/\/|https:\/\/){0}.*$/;
/**
 * Returns just the site/domain from the url. Includes the protocol.
 * chrome://extensions/some/other?blah=ffdf -> chrome://extensions
 * @param {string} url The URL of the page, including the protocol.
 * @return {string} The site, including protocol, but not paths.
 */
function getSiteFromUrl(url) {

  var match = url.match(siteRegexp);

  if (match) {

    //MANEESH ADDED: remove the http:// headers
    //match = match.replace('http://', '');
    //match = match.replace('https://', '');
    //match = match.replace('www.', '');

    /* Check the ignored list. */
    var ignoredSites = localStorage["ignoredSites"];
    if (!ignoredSites) {
      ignoredSites = [];
    } else {
      ignoredSites = JSON.parse(ignoredSites);
    }
    for (i in ignoredSites) {
      if (ignoredSites[i] == match[1]) {
        console.log("Site is on ignore list: " + match[1]);
        return null;
      }
    }
    return match[1];
  }
  return null;
}

function checkIdleTime(newState) {
  console.log("Checking idle behavior " + newState);
  if ((newState == "idle" || newState == "locked") &&
      localStorage["paused"] == "false") {
    pause();
  } else if (newState == "active") {
    resume();
  }
}

function pause() {
  console.log("Pausing timers.");
  localStorage["paused"] = "true";
  chrome.browserAction.setIcon({path: 'images/icon_paused.png'});
}

function resume() {
  console.log("Resuming timers.");
  localStorage["paused"] = "false";
  chrome.browserAction.setIcon({path: 'images/icon.png'});
}

function periodicClearStats() {
  console.log("Checking to see if we should clear stats.");
  var clearStatsInterval = localStorage["clearStatsInterval"];
  if (!clearStatsInterval) {
    clearStatsInterval = "0";
    localStorage["clearStatsInterval"] = "0";
  }
  clearStatsInterval = parseInt(clearStatsInterval, 10);
  console.log("Clear interval of " + clearStatsInterval);
  if (clearStatsInterval < 3600) {
    console.log("Invalid interval period, minimum is 3600.");
    delete localStorage["nextTimeToClear"];
    return;
  }

  var nextTimeToClear = localStorage["nextTimeToClear"];
  if (!nextTimeToClear) {
    var d = new Date();
    d.setTime(d.getTime() + clearStatsInterval * 1000);
    d.setMinutes(0);
    d.setSeconds(0);
    if (clearStatsInterval == 86400) {
      d.setHours(0);
    }
    console.log("Next time to clear is " + d.toString());
    nextTimeToClear = d.getTime();
    localStorage["nextTimeToClear"] = "" + nextTimeToClear;
  }
  nextTimeToClear = parseInt(nextTimeToClear, 10);
  var now = new Date();
  if (now.getTime() > nextTimeToClear) {
    console.log("Yes, time to clear stats.");
    clearStatistics();
    nextTimeToClear = new Date(nextTimeToClear + clearStatsInterval * 1000);
    console.log("Next time to clear is " + nextTimeToClear.toString());
    localStorage["nextTimeToClear"] = "" + nextTimeToClear.getTime();
    return;
  }
}

 function CreateTabListeners() {
     if(!localStorage.maxTabs) {
       localStorage.maxTabs = 6;
     }

    chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
      console.log("Tab updated: " + tab.status);
      if (tab.status=='complete'){
        CheckBlackList(tabId);
      }
     });

     chrome.tabs.onCreated.addListener(function(tab) {
       CheckTabCount(tab);
     });

     chrome.tabs.onRemoved.addListener(function(tab) {
       CheckTabCount(tab);
     });

     chrome.tabs.onDetached.addListener(function(tab) {
       CheckTabCount(tab);
     });

     chrome.tabs.onAttached.addListener(function(tab) {
       CheckTabCount(tab);
     });

     chrome.windows.getLastFocused(function(win) {
       UpdateTabCount(win.windowId);
     });

     chrome.windows.onCreated.addListener(function(win) {
       UpdateTabCount(win.windowId);
     });

     chrome.windows.onFocusChanged.addListener(function(win) {
       UpdateTabCount(win.windowId);
   });

   chrome.tabs.onSelectionChanged.addListener(
   function(tabId, selectionInfo) {
     console.log("Tab changed");
     currentTabId = tabId;
   });
}

function initialize() {
  CreateTabListeners();
}

initialize();
