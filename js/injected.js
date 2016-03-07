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
		}
	);
}

chrome.extension.onMessage.addListener(
	function(request, sender, sendResponse) {
		if (request.action == "newPage" && request.target == 'background') {
			sendResponse({
				pomodoro: lsGet('pomoFocusB', 'parse')
			});
			alert("message received");
		}
		else if (request.action == "hello") {
			console.log(request)
			togglePomoFocus(request.pomodoro);
		}
	}
);

function initialize(){
	hello();
}

function createBanner(){
	
}

function toggleBanner(){
	
}
initialize();