var fb_url = "https://www.facebook.com/dialog/oauth?client_id=682570301792724&response_type=token&scope=email&redirect_uri=http://www.facebook.com/connect/login_success.html";
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
  $('#sign_in').hide();
}

function showSignOut(){
  $('#sign_out').html("<a href='#' class='sign_out'>Sign Out!</a>")
  .click(signOut);
}

function signOut(){
  destroyToken();
  console.log("User signed out.")
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
  var status = document.getElementById("status");
  status.innerHTML = "Option saved successfully!";
  setTimeout(function() {
    window.close();
  }, 1300);
}

function save_tags() {
  var blackList = document.getElementById("blackList").value;
  localStorage.blackList = blackList;
}

function restore_options() {
  var maxTabsSelect = localStorage.maxTabs;
  var blackList = localStorage.blackList;
  if (blackList)
  {
  document.getElementById("blackList").value=blackList;
  }

  if (!maxTabsSelect) {
    return;
  }

}

document.addEventListener('DOMContentLoaded', restore_options);

function saveIdle() {
  var idleCheck = document.getElementById("idle_check");
  if (idleCheck.checked) {
    localStorage["idleDetection"] = "true";
  } else {
    localStorage["idleDetection"] = "false";
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

$('#blackList').tagsInput();

function initialize() {
  document.getElementById('save').addEventListener('click',
    save_options);
  if (userSignedIn() == true){
    hideSignIn();
  }
  if (userSignedIn() == true){
    showSignOut();
  }

  $('#blackList').tagsInput({
  'width' : '350px',
  'onChange' : save_tags,
  'defaultText':'Add site',
  'removeWithBackspace' : true
});

$('#blackList')[0].value = localStorage["blackList"];
}

document.addEventListener("DOMContentLoaded", function() {
  initialize();
});
