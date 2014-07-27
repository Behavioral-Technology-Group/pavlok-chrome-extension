

if(!localStorage.maxTabs) {
  localStorage.maxTabs = 6;
}

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

function CheckTabCount(tab) {
  chrome.tabs.getAllInWindow(tab.windowId, function(tabs) {

    var maxtabs = parseInt(localStorage.maxTabs);
    if(!maxtabs) {
      return;
    }

	  UpdateTabCount(tab.windowId);

    if(tabs.length > maxtabs) {


    var xhr = new XMLHttpRequest();
    	xhr.open("GET", 'http://pavlok.herokuapp.com/api/v1/shock/100'+localStorage.securityToken, true);
		xhr.onreadystatechange = function () {
		//alert('inside');
		}
		xhr.send();



      //chrome.tabs.remove(tab.id);

      //alert("You have decided not to open more than " + maxtabs + " tabs.");
     // alert(tab.url);
     // chrome.tabs.update({ url: "http://pavlok.herokuapp.com/api/3aTdMuY0iS/shock/100" });
      //chrome.tabs.update(tab.id, {url: "http://pavlok.herokuapp.com/api/3aTdMuY0iS/shock/100"});
      //    alert(tab.url);
    }
    else if (tabs.length > maxtabs - 1)
    {
    	var xhr = new XMLHttpRequest();
    	xhr.open("GET", 'http://pavlok.herokuapp.com/api/v1/beep/3'+localStorage.securityToken, true);
		xhr.onreadystatechange = function () {
		//alert('inside');
		}
		xhr.send();


    	//chrome.tabs.update({ url: "http://pavlok.herokuapp.com/api/3aTdMuY0iS/beep/3" });
    }
    else if (tabs.length > maxtabs - 2)
    {
    	var xhr = new XMLHttpRequest();
    	xhr.open("GET", 'http://pavlok.herokuapp.com/api/v1/vibrate/230'+localStorage.securityToken, true);
		xhr.onreadystatechange = function () {
		//alert('inside');
		}
		xhr.send();
       //	chrome.tabs.update({ url: "http://pavlok.herokuapp.com/api/3aTdMuY0iS/vibrate/230" });
    }

  });

}
