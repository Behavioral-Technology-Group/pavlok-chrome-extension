var verbose = false;
var x = 0;

var minImgURL = chrome.extension.getURL("images/browser_action_16x16.png");
var pavlokBannerHeight = 25;

function togglePomoFocus(pomoFocus){
  if (!pomoFocus) { return; }
  if (pomoFocus.active === true){
    $("#pomoFocusBannerPlaceholder").show();
  }
  else if (pomoFocus.active === false){
    $("#pomoFocusBannerPlaceholder").hide();
  }
  else {
    // console.log("pomoFocus unavaible at response");
    $("#pomoFocusBannerPlaceholder").hide();
    // console.log(response);
  }
}

function hello(){
  chrome.runtime.sendMessage(
    // Warns background about new page being loaded
    {
      action: "newPage",
      target: "background"
    },

    function(response) {
      // console.log(response);
      msgToCount(response.pomodoro);
    }
  );
}

function createBanner(){
  if (document.getElementById("pomoFocusBannerPlaceholder") === null){
    /*
    structure = '' +
    '<div id="pavlokBannerPlaceHolder">' +
      '<table>' +
        '<tr>' +
          '<td id="pavlokTaskSpan" class="pavlokInfoBar"></td>' +
          '<td id="pavlokTimerSpan" class="pavlokInfoBar"></td>' +
          '<td id="pavlokTogglerSpan"><span class="pavlokHelper"><img src="?" /></td>' +
        '</tr>' +
      '</table>' +
    '</div>';
    */

    var bannerPlaceholder = document.createElement("div");
    bannerPlaceholder.id = "pomoFocusBannerPlaceholder";

    var table = document.createElement("table");
    bannerPlaceholder.appendChild(table);

    var row = document.createElement("tr");
    table.appendChild(row);

    var task = document.createElement("td");
    task.id = "pavlokTaskSpan";
    task.className = "pavlokInfoBar";
    row.appendChild(task);

    var timer = document.createElement("td");
    timer.id = "pavlokTimerSpan";
    timer.className = "pavlokInfoBar";
    row.appendChild(timer);

    var toggler = document.createElement("td");
    toggler.id = "pavlokTogglerSpan";
    row.appendChild(toggler);

    var togglerImg = document.createElement("img");
    togglerImg.src = minImgURL;
    toggler.appendChild(togglerImg);

    var body = document.getElementsByTagName("body")[0];
    body.insertBefore(bannerPlaceholder, body.children[0]);
  }
}

function toggleBanner(){
  $( ".pavlokInfoBar" ).toggle( "blind", {}, 300 );
}

function updateCountDown(pomoFocus) {
  var endDate = new Date();
  if (pomoFocus){
    endDate.setTime(pomoFocus.endTime);
    var now = new Date().getTime();
    if (now > endDate.getTime()) {
      // console.log("past");
      $("#pomoFocusBannerPlaceholder").hide();
      return;
    }
  }

  var clockDiv = $("#pavlokTimerSpan");
  var taskSpan = $("#pavlokTaskSpan");

  $(taskSpan).text(pomoFocus.task);
  var timer = $(clockDiv).countdown(endDate, function(event) {
    $(this).text(event.strftime("%M:%S"));
  })
  .on("finish.countdown", function(event) {
    $(this).text("");
    togglePomoFocus(pomoFocus);
    $("#pomoFocusBannerPlaceholder").hide(300);
  });

}

function msgToCount(pomodoro){
  if (!pomodoro) {
    togglePomoFocus({ active: false });
    return;
  }
  togglePomoFocus(pomodoro);
  updateCountDown(pomodoro);
  return;
}

if (x == 0){
  // console.log("no listeners");
  addListeners();
  x = x + 1;
} else{
  // console.log("already existing listeners");
}

function enableToggler(){
  $("#pavlokTogglerSpan").click(function(){
    toggleBanner();
  });
}

function initialize(){
  hello();
  createBanner();
  enableToggler();

  $("#pomoFocusBannerPlaceholder").draggable({
    containment: "body",
    axis: "x",
    scroll: false
  });
}

function addListeners(){
  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      // console.log(request);

      if (request.action == "updatePomo") {
        msgToCount(request.pomo);
        // console.log("------------------------------------");
      }
      else if (request.action == "hello") {
        if (request.pomodoro) { var pomodoro = request.pomodoro;}
        else {
          // console.log("no pomodoro on this request");
        }
        msgToCount(request.pomodoro);
        // console.log("------------------------------------");
      }
    }
  );
}
initialize();
