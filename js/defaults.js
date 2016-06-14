/* Future universal settings object

var settings = {};
settings.siteLists = {};
settings.tabsControl = {};
settings.stimuli = {};
settings.toDos = {};
settings.autoZapper = {};
settings.integrations = {};
settings.schedule = {};
settings.user = {};

// Site lists (black and whitelists)
settings.siteLists.blackList = localStorage.blackList;
settings.siteLists.blackList = localStorage.whiteList;
settings.siteLists.blackList = localStorage.timeWindow;


// Tab numbers
settings.tabsControl.maxTabs = localStorage.maxTabs;
settings.tabsControl.zapOnClose = localStorage.zapOnClose;
settings.tabsControl.allWindows = localStorage.allWindows;


// Stimuli intensity
settings.stimuli.baseAddress = localStorage.baseAddress;
settings.stimuli.zapIntensity = localStorage.zapIntensity;
settings.stimuli.vibrationIntensity = localStorage.vibrationIntensity;
settings.stimuli.beepVolume = localStorage.beepVolume;

settings.stimuli.zapNotify = localStorage.notifyZap;
settings.stimuli.vibrationNotify = localStorage.notifyVibration;
settings.stimuli.beepNotify = localStorage.notifyBeep;


// To-do Lists
settings.toDos.dailies = localStorage.dailies;
settings.toDos.lastDailyID = localStorage.lastDailyID;

settings.toDos.tasks = localStorage.ToDoTasks;
settings.toDos.timeConstraints = '';
settings.toDos.pomoFocus = localStorage.pomoFocus;


// AutoZapper
settings.AutoZapper.intensity = '';
settings.AutoZapper.duration = '';
settings.AutoZapper.frequency = '';
settings.AutoZapper.lastSession = '';


// Integrations
settings.integrations.rescueTime.active = '';
settings.integrations.rescueTime.APIKey = '';
settings.integrations.rescueTime.frequency = '';
settings.integrations.rescueTime.NegLimit = '';
settings.integrations.rescueTime.NegStimulus = '';
settings.integrations.rescueTime.NegStimulus = '';
settings.integrations.rescueTime.PosStimulus = '';
settings.integrations.rescueTime.PosStimulus = '';
settings.integrations.rescueTime.WarnStimulus = '';
settings.integrations.rescueTime.WarnStimulus = '';


// Scheduler
settings.schedule.timeStart = '';
settings.schedule.timeEnd = '';
settings.activeDays = [];


// User
settings.user.name = '';
settings.user.email = '';
settings.user.accessToken = '';


// User prompts
settings.prompts.listOfPrompts = [];
settings.prompts.lastShown = '';
settings.prompts.showAgain = '';

*/

var baseAddress = "https://pavlok-" + server.toLowerCase() + ".herokuapp.com/";
lsSet('baseAddress', baseAddress);

localStorage.gmailClientID = '355054180595-pl1tc9qtp7mrb8fe2nb25n071ai2foff.apps.googleusercontent.com';

// Stimuli intensity
if (!localStorage.beepTune ) { localStorage.beepTune = 2; } //Random tune
if (!localStorage.beepIntensity ) { localStorage.beepIntensity = 255; } //Random tune
if (!localStorage.beepPosition ) { localStorage.beepPosition = 100; } //Random tune
if (!localStorage.zapIntensity ) { localStorage.zapIntensity = 153; } //60% default
if (!localStorage.zapPosition ) { localStorage.zapPosition = 60; } //60% default
if (!localStorage.vibrationIntensity ) { localStorage.vibrationIntensity = 153; } //60% default
if (!localStorage.vibrationPosition ) { localStorage.vibrationPosition = 60; } //60% default

// Blacklist and tabs
if (!localStorage.timeWindow) { localStorage.timeWindow = 15};
if (!localStorage.blackList) { localStorage.blackList = " "; }
if (!localStorage.whiteList) { localStorage.whiteList = " "; }
if (!localStorage.zapOnClose ) { localStorage.zapOnClose = "false"; }
if (!localStorage.maxTabs ) { localStorage.maxTabs = 15; }
if (!localStorage.tabCountAll ) { localStorage.tabCountAll = 'allWindows'; }
if (!localStorage.tabNumbersActive ) { localStorage.tabNumbersActive = 'true'; }

// Active Days and Hours
if (!localStorage.generalActiveTimeStart) { localStorage.generalActiveTimeStart = "00:00"; }
if (!localStorage.generalActiveTimeEnd) { localStorage.generalActiveTimeEnd = "23:59"; }
if (!localStorage.sundayActive) { localStorage.sundayActive = 'true'; }
if (!localStorage.mondayActive) { localStorage.mondayActive = 'true'; }
if (!localStorage.tuesdayActive) { localStorage.tuesdayActive = 'true'; }
if (!localStorage.wednesdayActive) { localStorage.wednesdayActive = 'true'; }
if (!localStorage.thursdayActive) { localStorage.thursdayActive = 'true'; }
if (!localStorage.fridayActive) { localStorage.fridayActive = 'true'; }
if (!localStorage.saturdayActive) { localStorage.saturdayActive = 'true'; }

// Notifications
if (!localStorage.persistedNotifications) { localStorage.persistedNotifications = [];}
if (!localStorage.notifyBeep ) { localStorage.notifyBeep = 'false'; }
if (!localStorage.notifyVibration ) { localStorage.notifyVibration = 'false'; }
if (!localStorage.notifyZap ) { localStorage.notifyZap = 'false'; }

var notifyInterval;

	var notifications = {};
	
	// When extension is first installed
	notifications.installed = {};
	notifications.installed.title = "Welcome to Pavlok. Let's get started!";
	notifications.installed.message = "Click here to log in.";
	notifications.installed.id = "installed";
	notifications.installed.persist = true;
	notifications.installed.usage = "installed";
	
	// When logged in
	notifications.signedIn = {};
	notifications.signedIn.title = "Hooray! Welcome aboard!";
	notifications.signedIn.message = "Click here to start using the Productivity Extension";
	notifications.signedIn.id = "signedIn";
	notifications.signedIn.persist = true;
	notifications.signedIn.usage = "installed";
	
	// PomoFocus task completed
	notifications.pomofocusDone = {};
	notifications.pomofocusDone.title = "Way to go!";
	notifications.pomofocusDone.message = "Keep the zone going, you rock star!";
	notifications.pomofocusDone.id = "PFNotify";
	notifications.pomofocusDone.persist = false;
	notifications.signedIn.usage = "pomofocusDone";
	
	// pomoFocus time ended
	notifications.pomofocusEnded = {};
	notifications.pomofocusEnded.title = "Congrats! You made it!";
	notifications.pomofocusEnded.message = "Take a 5 min break and lets get started! Get up if you were seated!";
	notifications.pomofocusEnded.id = "PFNotify";
	notifications.pomofocusEnded.persist = false;
	notifications.signedIn.usage = "pomofocusEnded";
	
	// 
	lsSet('notifications', notifications, 'object');
	
// RescueTime
if (!localStorage.RTOnOffSelect) { localStorage.RTOnOffSelect = "Off" };
if (!localStorage.RTFrequency) { localStorage.RTFrequency = 15 };

if (!localStorage.RTPosSti) { localStorage.RTPosSti = "vibration" };
if (!localStorage.RTWarnSti) { localStorage.RTWarnSti = "beep" };
if (!localStorage.RTNegSti ) { localStorage.RTNegSti = "shock" };

if (!localStorage.RTPosLimit) { localStorage.RTPosLimit = 70 };
if (!localStorage.RTWarnLimit) { localStorage.RTWarnLimit = 50 };
if (!localStorage.RTNegLimit ) { localStorage.RTNegLimit = 30 };

// To-Do

if (!localStorage.dailyList) {
	lsSet('dailyList', [], 'object');
}
if (!localStorage.lastDailyID) { lsSet('lastDailyID', 0); }