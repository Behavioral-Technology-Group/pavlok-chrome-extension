var pavlokBannerHeight = 25;

function togglePomoFocus(pomoFocus){
	if (pomoFocus.active == true){
		console.log("Active until " + pomoFocus.endTime);
	}
	else if (pomoFocus.active == false){
		console.log("Inactive. Ended at " + pomoFocus.endTime);
	}
	else {
		console.log("pomoFocus unavaible at response");
		console.log(response);
	}
}

function hello(tabId){
	chrome.runtime.sendMessage(
		// Warns background about new page being loaded
		{
			action: "newPage",
			target: "background",
		}, 
		
		function(response) {
			console.log(response);
			var pomoFocus = response.pomodoro;
			togglePomoFocus(pomoFocus);
			updateCountDown(pomoFocus);
		}
	);
}

function initialize(){
	hello();
	createBanner();
}

function createBanner(){
	if (document.getElementById('pomoFocusBannerPlaceholder') == null){
		var bannerPlaceholder = document.createElement("DIV");
		bannerPlaceholder.id = "pomoFocusBannerPlaceholder";
		
		var bannerPlaceholder2 = document.createElement("DIV");
		bannerPlaceholder2.id = "pomoFocusBannerPlaceholder2";
		
		var banner = document.createElement("div");
		banner.id = "pomoFocusBanner";
		bannerPlaceholder.appendChild(banner);
		
		var task = document.createElement("span");
		task.id = "pavlokTaskSpan";
		banner.appendChild(task);
		
		var counter = document.createElement("div");
		counter.innerHTML = '';
		counter.id = "pavlokCountDownDiv"
		banner.appendChild(counter);
		
		var toggler = document.createElement("a");
		toggler.innerHTML = "-";
		toggler.id = "pavlokCountToggler";
		banner.appendChild(toggler);
				
		var body = document.getElementsByTagName('body')[0];
		console.log(body);
		body.insertBefore(bannerPlaceholder, body.children[0]);
		body.insertBefore(bannerPlaceholder2, body.children[0]);
		
		findAndAdjustFixedElements();
	}
}

function toggleBanner(toState){
	var banner = document.getElementById("pomoFocusBannerPlaceholder");
	var bannerPlaceHolder = document.getElementById("pomoFocusBannerPlaceholder2");
	
	if(toState == 'show'){
		
	}
	else if (toState == 'hide'){
		
	}
	else { return "error"}
}

function findAndAdjustFixedElements() {
	var all = document.getElementsByTagName("*");
	var banner = document.getElementById("pomoFocusBannerPlaceholder")
	var begin = new Date().getTime();
	for (var i = 0; i < all.length; i++) {
		var elmt = all[i];
		if (elmt === banner) {
			// don't adjust our banner please.
			continue;
		}
		
		var style = window.getComputedStyle(elmt);
		var position = style.position;
		var yTop = parseInt(style.top);
		
		if ((position === "fixed" || position == "absolute" ) && yTop < pavlokBannerHeight) {
			if (!elmt.getAttribute("data-originalTop")) {
				elmt.setAttribute("data-originalTop", style.top);
			}
			elmt.style.top = parseInt(elmt.getAttribute("data-originalTop")) + pavlokBannerHeight + "px";
		}
	}
}
	
function updateCountDown(pomoFocus) {
	console.log('begin update countdown');
	if (!pomoFocus) { 
		var endDate = new Date(); 
		var task = "";
	}
	else{
		var endDate = new Date();
		endDate.setTime(pomoFocus.endTime);
	}
	console.log(endDate);
	
	var clockDiv = $('#pavlokCountDownDiv');
	var taskSpan = $('#pavlokTaskSpan');
	
	$(taskSpan).html("Task is: " + pomoFocus.task + " - ");
	var timer = $(clockDiv).countdown(endDate, function(event) {
		$(this).html(event.strftime('%M:%S'));
	})
	
}


chrome.extension.onMessage.addListener(
	function(request, sender, sendResponse) {
		if (request.action == "pomodoro") {
			console.log(request);
			updateCountDown(request.pomodoro);
			console.log("passed the update")
		}
		else if (request.action == "hello") {
			console.log(request)
			togglePomoFocus(request.pomodoro);
		}
	}
);

initialize();