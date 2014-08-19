var fb_url = "https://www.facebook.com/dialog/oauth?client_id=682570301792724&response_type=token&scope=email&redirect_uri=http://www.facebook.com/connect/login_success.html"

function isValid(token){
  if (token == "null" || token == undefined){
    return false;
  } else {
    return true;
  }
}

function userSignedIn(){
  if (isValid(localStorage.securityToken)){
    return true;
  } else {
    return false;
  }
}

function hideSignIn(){
  $('#signin_signout').hide();
}

function showSignOut(){
  $('li#sign_out').html("<a href='#'>Sign Out!</a>")
  .click(signOut);
}

if (userSignedIn() == true){
  hideSignIn();
  showSignOut();
}

function signOut(){
  destroyToken();
  location.reload();
}

function destroyToken(){
  localStorage.securityToken = "null";
}

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
  var status = document.getElementById("status");
  status.innerHTML = "Option saved successfully!";
  setTimeout(function() {
    window.close();
  }, 1300);
}

document.addEventListener('DOMContentLoaded', restore_options());

function restore_options() {
  var maxTabsSelect = localStorage.maxTabs;
  var blackList = localStorage.blackList;

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
}

document.addEventListener("DOMContentLoaded", function() {
  initialize();
});
