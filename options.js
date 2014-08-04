Object.prototype.getName = function() {
   var funcNameRegex = /function (.{1,})\(/;
   var results = (funcNameRegex).exec((this).constructor.toString());
   return (results && results.length > 1) ? results[1] : "";
};

function save_options() {
  var select = document.getElementById("maxtab");
  var no_of_tabs = select.children[select.selectedIndex].value;
  localStorage.maxTabs = no_of_tabs;

  var blackList = document.getElementById("blackList").value;
  localStorage.blackList = blackList;

  var securityToken = document.getElementById("securityToken").value;
  localStorage.securityToken = securityToken;
  var status = document.getElementById("status");
  status.innerHTML = "Option saved successfully!";
  setTimeout(function() {
    window.close();
  }, 1300);
}

document.addEventListener('DOMContentLoaded', restore_options());

function restore_options() {
  var maxTabsSelect = localStorage.maxTabs;
  var securityToken = localStorage.securityToken;
  var blackList = localStorage.blackList;

  if ("securityToken")
  {
  document.getElementById("securityToken").value=securityToken;
  }

  if ("blackList")
  {
  document.getElementById("blackList").value=blackList;
  }


  if (!maxTabsSelect) {
    return;
  }

  var select = document.getElementById("maxtab");
  for (var i = 0; i < select.children.length; i++) {
    var child = select.children[i];
    if (child.value == maxTabsSelect) {
      child.selected = "true";
      break;
    }
  }

}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);


function saveIdle() {
  var idleCheck = document.getElementById("idle_check");
  if (idleCheck.checked) {
    localStorage["idleDetection"] = "true";
  } else {
    localStorage["idleDetection"] = "false";
  }
}



// Restores options from localStorage, if available.
function restoreOptions() {
  var idleCheck = document.getElementById("idle_check");
  var idleDetection = localStorage["idleDetection"];
  if (!idleDetection || idleDetection == "false") {
    idle_check.checked = false;
  } else {
    idle_check.checked = true;
  }

  var ignoredSites = localStorage['ignoredSites'];
  if (!ignoredSites) {
    return;
  }
  ignoredSites = JSON.parse(ignoredSites);
  var select = document.getElementById("ignored_sites");
  select.options.length = 0;
  for (var i in ignoredSites) {
    var option = document.createElement("option");
    option.text = ignoredSites[i];
    option.value = ignoredSites[i];
    select.appendChild(option);
  }

  var clearStatsInterval = localStorage['clearStatsInterval'];
  if (!clearStatsInterval) {
    clearStatsInterval = "0";
  }
  select = document.getElementById("clear_stats_interval");
  for (var i = 0; i < select.options.length; i++) {
    var option = select.options[i];
    if (option.value == clearStatsInterval) {
      option.selected = true;
      break;
    }
  }
}

function addFrame() {
  var iframe = document.createElement("iframe");
  iframe.setAttribute("src", "http://browser-timetracker.appspot.com/stats/view?now=" +
                            escape(new Date().getTime()/1000));
  iframe.setAttribute("width", "400px");
  iframe.setAttribute("height", "400px");
  iframe.setAttribute("id", "stats_frame");
  document.getElementById("stats").appendChild(iframe);
}

function addTrackedSites(new_site) {
  return function() {
    chrome.extension.sendRequest(
       {action: "addTrackedSites", site: new_site},
       function(response) {
         initialize();
       });
  };
}

var blackSites = new Array();



function sendStats() {
  chrome.extension.sendRequest({action: "sendStats"}, function(response) {
   /* Reload the iframe. */
   var iframe = document.getElementById("stats_frame");
   iframe.src = iframe.src;
  });
}

function clearStats() {
  console.log("Request to clear stats.");
  chrome.extension.sendRequest({action: "clearStats"}, function(response) {
   initialize();
  });
}

function togglePause() {
  console.log("In toggle pause");
  console.log("Value = " + localStorage["paused"]);
  if (localStorage["paused"] == "false") {
   console.log("Setting to Resume");
   chrome.extension.sendRequest({action: "pause"}, function(response) {});
   document.getElementById("toggle_pause").innerHTML = "Resume Timer";
  } else if (localStorage["paused"] == "true"){
   console.log("Setting to Pause");
   chrome.extension.sendRequest({action: "resume"}, function(response) {});
   document.getElementById("toggle_pause").innerHTML = "Pause Timer";
  }
}

function initialize() {
  var stats = document.getElementById("stats");
  if (stats.childNodes.length == 1) {
   stats.removeChild(stats.childNodes[0]);
  }

  if (localStorage["storageType"] == "appengine") {
   addFrame();
  } else if (localStorage["storageType"] == "local") {
   addLocalDisplay();
  }

  var link = document.getElementById("toggle_pause");
  if (localStorage["paused"] == undefined || localStorage["paused"] == "false") {
   localStorage["paused"] = "false";
   link.innerHTML = "Pause Timer";
  } else {
   link.innerHTML = "Resume Timer";
  }

  var nextClearStats = localStorage["nextTimeToClear"];
  if (nextClearStats) {
   nextClearStats = parseInt(nextClearStats, 10);
   console.log(nextClearStats)
   nextClearStats = new Date(nextClearStats);
   var nextClearDiv = document.getElementById("nextClear");
   if (nextClearDiv.childNodes.length == 1) {
     nextClearDiv.removeChild(nextClear.childNodes[0]);
   }
   nextClearDiv.appendChild(
     document.createTextNode("Next Reset: " + nextClearStats.toString()));
  }
}

document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("clear").addEventListener("click", clearStats);
  document.getElementById("toggle_pause").addEventListener(
    "click", togglePause);
  initialize();
});
