/* To-do

	- Get only UNDONE tasks
	- Prioritize Dailies?
	- Prioritize tagged as today?
	- Create different rest intervals according to sequence of pomodoros
	- 

*/

/*--------------------------------------------------------------------------*/
/*--------------------------------------------------------------------------*/
/*--------															--------*/
/*--------						1.Coaching assist					--------*/
/*--------															--------*/
/*--------------------------------------------------------------------------*/
/*--------------------------------------------------------------------------*/

var coach = {};

function timeSincePomo(pomo){
	var time;
	if (pomo.active == true){ time = 0; }
	else{ 
		var now = (new Date).getTime();
		var lastPomoEnd = pomo.endTime;
		time = now - lastPomoEnd;
		if (time < 0) { time = 0 }
	}
	
	return time
	
}

function getTasks(number){
	var ToDoTasks = lsGet('ToDoTasks', 'parse');
	if (ToDoTasks == null) { return false }
	
	// Filter tasks which are done
	ToDoTasks = _.where(ToDoTasks, {done: false});
	
	
	
	var nTasks = ToDoTasks.length
	if (number >= nTasks){
		console.log("There are only " + nTasks + " tasks. Returning all of them")
		return ToDoTasks
	}
	
	randomTasks = [];
	
	for (t = 0; t < number; t++){
		nTasks = ToDoTasks.length;
		index = Math.floor(Math.random() * nTasks);
		randomTasks.push(ToDoTasks[index]);
		ToDoTasks.splice(index, 1);
	}
	
	return randomTasks;
}

function notifyTasks(tasks){
	if (tasks.length > 2){
		console.log("only two buttons avaible. Using the first 2 tasks");
		tasks = [tasks[0], tasks[1]];
	}
	
	buttons = [];
	for (t = 0; t < tasks.length; t++){
		var task = tasks[t];
		button = { title: task.task };
		buttons.push(button);
		
	}
		
	var not = {};
	not.type = "basic";
	not.title = "Let's rock!";
	not.message = "What are we gonna focus on right now?";
	not.iconUrl = "icon.png";
	not.buttons = buttons;
	not.isClickable = true;
	// not.requireInteracion = true; // waiting for support from the API
	
	var notID = "coachingCall";
	
	lsSet('coachedTasks', tasks, 'object');
	
	chrome.notifications.create(notID, not, function(notID) {
		if (chrome.runtime.lastError){
			console.error(chrome.runtime.lastError);
		}
	});
}

function listenCoachingClicks(){
	chrome.notifications.onButtonClicked.addListener(sayClicked);
}

function sayClicked(notID, iBtn){
	var tasks = lsGet('coachedTasks', 'parse');
	var curTask = tasks[iBtn];
	
	startPomoFocus(curTask);
}

function startPomoFocus(item){
	var pomoFocus = lsGet('pomoFocusB', 'parse');
	
	// Set the pomoFocus Object
	pomoFocus.active		= true;
	pomoFocus.taskID		= item.id;
	pomoFocus.task			= item.task;
	pomoFocus.silent		= 'promptOnEnd';
	pomoFocus.endReason     = 'time';
	pomoFocus.duration		= 20;
	pomoFocus.endTime		= deltaTime(pomoFocus.duration * 60).getTime();
	pomoFocus.hyper			= $("#hyperFocusSelect").val()
	pomoFocus.daily			= false;
	pomoFocus.endReason 	= 'time';
	pomoFocus.lastUpdate 	= nowTime();
	
	// Saving
	savePomoFocus(pomoFocus, 'popup');
	lsSet('endReason', 'time');
	
	// Let the games begin
	togglePomodoro('focus');
	myAudio = new Audio('../Audio/ticktock.mp3');
	myAudio.play();
	myAudio = new Audio('../Audio/ticktock.mp3');
	myAudio.play();
}


// What will be the logic for when the call comes in?
	// After pomofocus, 5 to 15 minutes away
	// If user don't engage, repeat another 5 minutes later

function isItTime(){
	var now = new Date().getTime();
	if (now < coach.nextCall) { return }
	
	coach.lastCall = now;
	var pomo = lsGet('pomoFocusB', 'parse');
	
	var timeLimit = 5 * 60 * 1000;
	
	if (timeSincePomo(pomo) > timeLimit){
		notifyTasks(getTasks(2));
	}
	
	coach.nextCall = deltaTime(timeLimit / 1000).getTime();
	coachTimeout = setTimeout(function(){isItTime();}, 10 * 1000);
}

var coachTimeout;

if (usage == "localMVP" ) {
	console.log("Coach is active");
	listenCoachingClicks();
	isItTime();
}