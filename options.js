Object.prototype.getName = function() {
   var funcNameRegex = /function (.{1,})\(/;
   var results = (funcNameRegex).exec((this).constructor.toString());
   return (results && results.length > 1) ? results[1] : "";
};

function save_options() {
  var select = document.getElementById("maxtab");
  var no_of_tabs = select.children[select.selectedIndex].value;
  localStorage.maxTabs = no_of_tabs;

/*
if (localStorage.blackSites == null)
  {
    var blackSites = new Object();
  }

  blackSites["facebook.com"]
  blackSites["reddit.com"] = false;
  blackSites["youtube.com"] = false;
  blackSites["hackthesystem.com"] = false;
  blackSites["useroption"] = false;
*/


//localStorage.blackSiteArray = new Array();

/*for (var i = 0; i < localStorage.blackSiteArray.length; i++)
  {

     console.log(localStorage.blackSiteArray[i])

  }
  */
    var blackList = document.getElementById("blackList").value;
localStorage.blackList = blackList;
    /*
    if (document.getElementById('facebook.com').checked)
      {
        localStorage.blackList += "facebook.com,";
      }

    if (document.getElementById('reddit.com').checked)
        {
          localStorage.blackList += "reddit.com,";
        }

    if (document.getElementById('huffingtonpost.com').checked)
    {
      localStorage.blackList += "huffingtonpost.com,";
    }


if (document.getElementById('youtube.com').checked)
    {
      localStorage.blackList += "youtube.com,";
    }

    if (document.getElementById('twitter.com').checked)
        {
          localStorage.blackList += "twitter.com,";
        }





if (document.getElementById('hackthesystem.com').checked)
    {
      localStorage.blackList += "hackthesystem.com,";
    }


if (document.getElementById('gmail.com').checked)
    {
      localStorage.blackList += "gmail.com,";
    }

  //    if (document.getElementById('userchoice').value != '')
  //      {
          localStorage.blackList += document.getElementById('userchoice').value;
  //      }
*/

    alert(localStorage.blackList);


/*    var reddit = document.getElementById('reddit.com').checked;

    if (facebook.checked == true)
      {localStorage.blackList
      }
  chrome.storage.sync.set({
    reddit = reddit.comcolor,
    likesColor: likesColor
  }, function() {

  */



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
  var favorite = localStorage.maxTabs;
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


  if (!favorite) {
    return;
  }

  var select = document.getElementById("maxtab");
  for (var i = 0; i < select.children.length; i++) {
    var child = select.children[i];
    if (child.value == favorite) {
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

function addLocalDisplay() {
  var table = document.getElementById("stats");
  var tbody = document.createElement("tbody");
  table.appendChild(tbody);

  /* Sort sites by time spent */
  var sites = JSON.parse(localStorage.sites);
  var sortedBlackSites = new Array();


  var totalBlackSiteTime = 0;

  //  blackSites = ['https://www.facebook.com','http://reddit.com'];
//blackSites.push('*.facebook.com/');
//  blackSites.push('facebook.com');
//  blackSites.push('reddit.com');
//  localStorage.blackList = new Array();
//  localStorage.blackList = blackSites.join();

  for (var i = 0; i < blackSites.length; i++) {
    var blackSiteTime = sites[blackSites[i]];

    if (isNaN(blackSiteTime)) {
      blackSiteTime = 0;
    }

    totalBlackSiteTime += blackSiteTime;

    console.log("You've been on " + blackSites[i] + " for " + blackSiteTime + " minutes");
    console.log("Total Black Site Time:"+ totalBlackSiteTime);
    if (sites[blackSites[i]]) //if the site exists in black site
      {
        console.log(blackSites[i]);
      };
  }

  var totalTime = 0;
  for (blackSite in blackSites) {
//    console.log(site.getName());
   sortedBlackSites.push([blackSite, sites[blackSite]]);

   totalTime += sites[site];
  }
  sortedBlackSites.sort(function(a, b) {
   return b[1] - a[1];
  });

  /* Show only the top 15 sites by default */
  var max = 15;
  if (document.location.href.indexOf("show=all") != -1) {
   max = sortedBlackSites.length;
  }

  /* Add total row. */
  var totalTime = (totalTime / 60).toFixed(2)
  var row = document.createElement("tr");
  var cell = document.createElement("td");
  cell.innerHTML = "<b>Total</b>";
  row.appendChild(cell);
  cell = document.createElement("td");
  cell.appendChild(document.createTextNode(totalTime));



  row.appendChild(cell);
  cell = document.createElement("td");
  cell.appendChild(document.createTextNode(("100")));
  row.appendChild(cell);
  tbody.appendChild(row);

  // for (var index = 0; ((index < sortedBlackSites.length) && (index < max));
  //     index++ ){
  //  var site = sortedBlackSites[index][0];
  //  row = document.createElement("tr");
  //  cell = document.createElement("td");
  //  var removeImage = document.createElement("img");
  //  removeImage.src = chrome.extension.getURL("images/remove.png");
  //  removeImage.title = "Remove and stop tracking.";
  //  removeImage.width = 10;
  //  removeImage.height = 10;
  //  removeImage.onclick = addTrackedSites(site);
  //  cell.appendChild(removeImage);
  //  cell.appendChild(document.createTextNode(site));
  //  row.appendChild(cell);
  //  cell = document.createElement("td");
  //  cell.appendChild(document.createTextNode((sites[site] / 60).toFixed(2)));
  //  row.appendChild(cell);
  //  cell = document.createElement("td");
  //  cell.appendChild(document.createTextNode(
  //    (sites[site] / totalTime * 100).toFixed(2)));
  //  row.appendChild(cell);
  //  tbody.appendChild(row);
  }

  /* Add an option to show all stats */
  var showAllLink = document.createElement("a");
  showAllLink.onclick = function() {
   chrome.tabs.create({url: "popup.html?show=all"});
  }

  /* Show the "Show All" link if there are some sites we didn't show. */
  if (max < sortedBlackSites.length) {
   showAllLink.setAttribute("href", "javascript:void(0)");
   showAllLink.appendChild(document.createTextNode("Show All"));
   document.getElementById("options").appendChild(showAllLink);
  }
}

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
