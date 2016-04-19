/* To-do

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

var coach = {
	// Variables
	timeout: 0,
	todayPomos: function(pomo){
		var x = lsGet('todayPomos', 'parse');
		if (x == undefined) { x = []; };

		if (!pomo){
			return x
		}
		
		x.push(pomo);
		lsSet('todayPomos', x, 'object');
	},
	
	// Methods
	timeSincePomo: function(pomo){
		if (!pomo) { pomo = { active: false, endTime: new Date().getTime() } }
		var time;
		if (pomo.active == true){ time = 0; }
		else{ 
			var now = new Date().getTime();
			var lastPomoEnd = pomo.endTime;
			time = now - lastPomoEnd;
			if (time < 0) { time = 0 }
		}
		
		return time
		
	},

	getTasks: function(number){
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
	},
	
	notifyTasks: function(tasks){
		if (tasks.length > 2){
			console.log("only two buttons avaible. Using the first 2 tasks");
			tasks = [tasks[0], tasks[1]];
		}
		else if (tasks.length == 0){ return; }
		
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
	},

	listenCoachingClicks: function(){
		chrome.notifications.onButtonClicked.addListener(coach.sayClicked);
	},

	sayClicked: function(notID, iBtn){
		var tasks = lsGet('coachedTasks', 'parse');
		var curTask = tasks[iBtn];
		
		chrome.notifications.clear("coachingCall");
		coach.startPomoFocus(curTask);
	},

	startPomoFocus: function(item){
		pomoTest.updatePomo(item);
		
		console.log("Item sent");
		console.log(item);
	},

	isItTime: function(){
		var now = new Date().getTime();
		if (now < coach.nextCall) { 
			console.log("Next call at " + dateFromTime(coach.nextCall));
			coach.timeout = setTimeout(function(){coach.isItTime();}, 10 * 1000)
			return
		}
		
		coach.lastCall = now;
		var pomo = lsGet('pomoFocusB', 'parse');
		
		var timeLimit = 5 * 60 * 1000;
		
		if (coach.timeSincePomo(pomo) > timeLimit){
			coach.notifyTasks(coach.getTasks(2));
		}
		
		coach.nextCall = deltaTime(timeLimit / 1000).getTime();
		coach.timeout = setTimeout(function(){coach.isItTime();}, 10 * 1000);
	},

	registerPomos: function(pomosArray){
		var totalPomos = lsGet('totalPomos', 'parse') || [];
		totalPomos.push(pomosArray);
		localStorage.totalPomos = JSON.stringify(totalPomos);
	},
	
	resetPomos: function(){}
};

if (usage == "localMVP" ) {
	console.log("Coach is active");
	coach.listenCoachingClicks();
	coach.isItTime();
}

