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
settings.siteLists.blackList = lsGet("blackList");
settings.siteLists.blackList = lsGet("whiteList");
settings.siteLists.blackList = lsGet("timeWindow");


// Tab numbers
settings.tabsControl.maxTabs = lsGet("maxTabs");
settings.tabsControl.zapOnClose = lsGet("zapOnClose");
settings.tabsControl.allWindows = lsGet("allWindows");


// Stimuli intensity
settings.stimuli.baseAddress = lsGet("baseAddress");
settings.stimuli.zapIntensity = lsGet("zapIntensity");
settings.stimuli.vibrationIntensity = lsGet("vibrationIntensity");
settings.stimuli.beepVolume = lsGet("beepVolume");

settings.stimuli.zapNotify = lsGet("notifyZap");
settings.stimuli.vibrationNotify = lsGet("notifyVibration");
settings.stimuli.beepNotify = lsGet("notifyBeep");


// To-do Lists
settings.toDos.dailies = lsGet("dailies");
settings.toDos.lastDailyID = lsGet("lastDailyID");

settings.toDos.tasks = lsGet("ToDoTasks");
settings.toDos.timeConstraints = '';
settings.toDos.pomoFocus = lsGet("pomoFocus");


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
// var baseAddress = "https://app.pavlok.com/";
lsSet('baseAddress', baseAddress);

lsSet("gmailClientID", '355054180595-pl1tc9qtp7mrb8fe2nb25n071ai2foff.apps.googleusercontent.com');

// Stimuli intensity
if (!lsGet("beepTune ")) { lsSet("beepTune ", 2) } //Random tune
if (!lsGet("beepIntensity ")) { lsSet("beepIntensity ", 255) } //Random tune
if (!lsGet("beepPosition ")) { lsSet("beepPosition ", 100) } //Random tune
if (!lsGet("zapIntensity ")) { lsSet("zapIntensity ", 153) } //60% default
if (!lsGet("zapPosition ")) { lsSet("zapPosition ", 60) } //60% default
if (!lsGet("vibrationIntensity ")) { lsSet("vibrationIntensity ", 153) } //60% default
if (!lsGet("vibrationPosition ")) { lsSet("vibrationPosition ", 60) } //60% default

// Blacklist and tabs
if (!lsGet("timeWindow")) { lsSet("timeWindow", 15) };
if (!lsGet("blackList")) { lsSet("blackList", " ") }
if (!lsGet("whiteList")) { lsSet("whiteList", " ") }
if (!lsGet("zapOnClose ")) { lsSet("zapOnClose ", "false") }
if (!lsGet("maxTabs ")) { lsSet("maxTabs ", 15) }
if (!lsGet("tabCountAll ")) { lsSet("tabCountAll ", 'allWindows') }
if (!lsGet("tabNumbersActive ")) { lsSet("tabNumbersActive ", 'true') }

// Active Days and Hours
if (!lsGet("generalActiveTimeStart")) { lsSet("generalActiveTimeStart", "00:00") }
if (!lsGet("generalActiveTimeEnd")) { lsSet("generalActiveTimeEnd", "23:59") }
if (!lsGet("sundayActive")) { lsSet("sundayActive", 'true') }
if (!lsGet("mondayActive")) { lsSet("mondayActive", 'true') }
if (!lsGet("tuesdayActive")) { lsSet("tuesdayActive", 'true') }
if (!lsGet("wednesdayActive")) { lsSet("wednesdayActive", 'true') }
if (!lsGet("thursdayActive")) { lsSet("thursdayActive", 'true') }
if (!lsGet("fridayActive")) { lsSet("fridayActive", 'true') }
if (!lsGet("saturdayActive")) { lsSet("saturdayActive", 'true') }

// Notifications
if (!lsGet("persistedNotifications")) { lsSet("persistedNotifications", []) }
if (!lsGet("notifyBeep ")) { lsSet("notifyBeep ", 'false') }
if (!lsGet("notifyVibration ")) { lsSet("notifyVibration ", 'false') }
if (!lsGet("notifyZap ")) { lsSet("notifyZap ", 'false') }

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
if (!lsGet("RTOnOffSelect")) { lsSet("RTOnOffSelect", "Off") };
if (!lsGet("RTFrequency")) { lsSet("RTFrequency", 15) };

if (!lsGet("RTPosSti")) { lsSet("RTPosSti", "vibration") };
if (!lsGet("RTWarnSti")) { lsSet("RTWarnSti", "beep") };
if (!lsGet("RTNegSti ")) { lsSet("RTNegSti ", "shock") };

if (!lsGet("RTPosLimit")) { lsSet("RTPosLimit", 70) };
if (!lsGet("RTWarnLimit")) { lsSet("RTWarnLimit", 50) };
if (!lsGet("RTNegLimit ")) { lsSet("RTNegLimit ", 30) };

// To-Do

if (!lsGet("dailyList")) {
	lsSet('dailyList', [], 'object');
}
if (!lsGet("lastDailyID")) { lsSet('lastDailyID', 0) }