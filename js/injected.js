// var x = 0;

// var pavlokBannerHeight = 25;

// function togglePomoFocus(pomoFocus){
	// if (!pomoFocus) { console.log("no pomoFocus"); return }
	// if (pomoFocus.active == true){
		// findAndAdjustFixedElements("added");
		// $("#pomoFocusBannerPlaceholder2").show();
		// $("#pomoFocusBannerPlaceholder").show();
		// // console.log("Active until " + pomoFocus.endTime);
	// }
	// else if (pomoFocus.active == false){
		// // console.log("Inactive. Ended at " + pomoFocus.endTime);
		// $("#pomoFocusBannerPlaceholder").hide();
		// // $("#pomoFocusBannerPlaceholder2").hide();
		// findAndAdjustFixedElements("removed");
	// }
	// else {
		// console.log("pomoFocus unavaible at response");
		// console.log(response);
	// }
// }

// function hello(tabId){
	// chrome.runtime.sendMessage(
		// // Warns background about new page being loaded
		// {
			// action: "newPage",
			// target: "background",
		// }, 
		
		// function(response) {
			// console.log(response);
			// var pomoFocus = response.pomodoro;
			// msgToCount(pomoFocus);
		// }
	// );
// }

// function initialize(){
	// hello();
	// createBanner();
	
	// $("#pomoFocusBannerPlaceholder").draggable({
		// containment: "body", 
		// axis: "x",
		// scroll: false
	// });
// }

// function createBanner(){
	// if (document.getElementById('pomoFocusBannerPlaceholder') == null){
		// var bannerPlaceholder = document.createElement("DIV");
		// bannerPlaceholder.id = "pomoFocusBannerPlaceholder";
		
		// // var bannerPlaceholder2 = document.createElement("DIV");
		// // bannerPlaceholder2.id = "pomoFocusBannerPlaceholder2";
		
		// var banner = document.createElement("div");
		// banner.id = "pomoFocusBanner";
		// bannerPlaceholder.appendChild(banner);
		
		// var task = document.createElement("span");
		// task.id = "pavlokTaskSpan";
		// banner.appendChild(task);
		
		// var counter = document.createElement("div");
		// counter.innerHTML = '';
		// counter.id = "pavlokCountDownDiv"
		// banner.appendChild(counter);
		
		// var toggler = document.createElement("a");
		// toggler.innerHTML = "-";
		// toggler.id = "pavlokCountToggler";
		// banner.appendChild(toggler);
				
		// var body = document.getElementsByTagName('body')[0];
		// body.insertBefore(bannerPlaceholder, body.children[0]);
		// // body.insertBefore(bannerPlaceholder2, body.children[0]);
		
		// findAndAdjustFixedElements("added");
	// }
// }

// function toggleBanner(toState){
	// var banner = document.getElementById("pomoFocusBannerPlaceholder");
	// var bannerPlaceHolder = document.getElementById("pomoFocusBannerPlaceholder2");
	
	// if(toState == 'show'){
		
	// }
	// else if (toState == 'hide'){
		
	// }
	// else { return "error"}
// }

// function findAndAdjustFixedElements(timer) {
	// var all = document.getElementsByTagName("*");
	// var banner = document.getElementById("pomoFocusBannerPlaceholder")
	// var begin = new Date().getTime();
	// for (var i = 0; i < all.length; i++) {
		// var elmt = all[i];
		// if (elmt === banner) {
			// // don't adjust our banner please.
			// continue;
		// }
		
		// var style = window.getComputedStyle(elmt);
		// var position = style.position;
		// var yTop = parseInt(style.top);
		// var newPosition = 0;
		
		// if (position === "fixed" && yTop < pavlokBannerHeight) {
			// if (!elmt.getAttribute("data-originalTop")) {
				// elmt.setAttribute("data-originalTop", style.top);
			// }
			// if (timer == "added"){
				// newPosition = parseInt(elmt.getAttribute("data-originalTop")) + pavlokBannerHeight;
			// } else if (timer == "removed") {
				// elmt.style.top = parseInt(elmt.getAttribute("data-originalTop"));
				// newPosition = parseInt(elmt.getAttribute("data-originalTop")) - pavlokBannerHeight;
			// }
			// elmt.style.top = newPosition + "px";
		// }
	// }
	// var body = document.getElementsByTagName('body')[0];
	// var bodyChildren = body.children;
	
	// for (i = 0; i < bodyChildren.length; i++){
		// elmt = bodyChildren[i];
		// var style = window.getComputedStyle(elmt);
		// var position = style.position;
		// var yTop = parseInt(style.top);
	// }
// }
	
// function updateCountDown(pomoFocus) {
	// if (!pomoFocus) { 
		// var endDate = new Date(); 
		// var task = "";
	// }
	// else{
		// var endDate = new Date();
		// endDate.setTime(pomoFocus.endTime);
		// var now = new Date().getTime();
		// if (now > endDate.getTime()) { console.log("past"); return }
	// }
	
	// var clockDiv = $('#pavlokCountDownDiv');
	// var taskSpan = $('#pavlokTaskSpan');
	
	// $(taskSpan).html(pomoFocus.task + " - ");
	// var timer = $(clockDiv).countdown(endDate, function(event) {
		// $(this).html(event.strftime('%M:%S'));
	// })
	// .on('finish.countdown', function(event) {
		// $(this).html('');
		// togglePomoFocus(pomoFocus);
	// });
	
// }


// // chrome.extension.onMessage.addListener(
// function msgToCount(pomodoro){
	// updateCountDown(pomodoro);
	// togglePomoFocus(pomodoro);
	// return
// }

// if (x == 0){
	// console.log("no listeners");
	// chrome.runtime.onMessage.addListener(
		// function(request, sender, sendResponse) {
			// console.log(request.action);
			// console.log(request);

			// if (request.action == "pomodoro") {
				// msgToCount(request.pomodoro);
				// console.log("------------------------------------");
			// }
			// else if (request.action == "hello") {
				// if (request.pomodoro) { var pomodoro = request.pomodoro;}
				// else { console.log("no pomodoro on this request");}
				// msgToCount(request.pomodoro);
				// console.log("------------------------------------");
			// }
		// }
	// );
	// x = x + 1;
// } else{
	// console.log("already existing listeners");
// }

// initialize();