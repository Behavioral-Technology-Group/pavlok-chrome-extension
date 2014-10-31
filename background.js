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
  var pointUrl = "https://pavlok.herokuapp.com/api/v1/retrieve_token_for/" + localStorage.accessToken + "/" + tempToken//localStorage.securityToken;
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
      xhr.open("POST", 'https://pavlok.herokuapp.com/api/v1/shock/180/'+localStorage.securityToken, true);
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
      	xhr.open("POST", 'https://pavlok.herokuapp.com/api/v1/shock/180/'+localStorage.securityToken, true);
  		xhr.onreadystatechange = function () {
		}
		xhr.send();
    }
    else if (tabs.length > maxtabs - 1){
    	var xhr = new XMLHttpRequest();
    	xhr.open("POST", 'https://pavlok.herokuapp.com/api/v1/beep/3/'+localStorage.securityToken, true);
		  xhr.onreadystatechange = function () {
		  }
		  xhr.send();
    }
    else if (tabs.length > maxtabs - 2){
    	var xhr = new XMLHttpRequest();
    	xhr.open("POST", 'https://pavlok.herokuapp.com/api/v1/vibrate/230/'+localStorage.securityToken, true);
		  xhr.onreadystatechange = function () {
		  }
		  xhr.send();
    }

  });

}
var currentSite = null;
var currentTabId = null;
var siteRegexp = /^(\w+:\/\/[^\/]+).*$/;

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
