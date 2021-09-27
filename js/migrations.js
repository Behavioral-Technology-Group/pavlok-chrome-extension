var nMigPrompt = 0;
var migrations = {
	oldIds: [
		"kkbphcipoambgjloemfpdeoglbnhmdmk",
		"ennfppgmpaamgoneapjgdbpghjdfeang",
		"cmlbdmgamhaggmchdihanpgenfndhnoh",
	],
	backListener: function(){
		chrome.runtime.onMessageExternal.addListener(
			function(request, sender, sendResponse){
				if (request.target == "background"){ 
					if( request.subject == "migration"){
						if (migrations.oldIds.indexOf(sender.id) != -1){
							lsSet("oldId", sender.id);
							blackList.checkForMigration();
							var r = {
								subject: "migration",
								old: request, 
								new: {
									blackList: Object.keys(blackList.get("blackList")),
									countdown: lsGet("timeWindow"),
									whiteList: blackList.get("whiteList"),
									
									maxTabs: lsGet("maxTabs"),
									
									zap: lsGet("zapIntensity"),
									vib: lsGet("vibrationIntensity"),
									
									scheduler: {
										mon: lsGet("mondayActive"),
										tue: lsGet("tuesdayActive"),
										wed: lsGet("wednesdayActive"),
										thu: lsGet("thursdayActive"),
										fri: lsGet("fridayActive"),
										sat: lsGet("saturdayActive"),
										sun: lsGet("sundayActive"),
										
										start: lsGet("generalActiveTimeStart"),
										end: lsGet("generalActiveTimeEnd")
									}
								}
							}
							console.log(r);
							
							msgInterfaces(r)
						}
					}
				}
			}
		);
		
		chrome.runtime.onMessage.addListener(
			function(request, sender, sendResponse){
				if (request.subject == "import settings"){
					console.log(request);
					var r = request.r;
					
					// Black List
					var newBL = r.old.blackList.split(",").sort();
					
					var list = {};
					for (i = 0; i < newBL.length; i++){
						list[newBL[i]] = {};
						list[newBL[i]]["limit"] = 0;
						list[newBL[i]]["type"] = "daily";
					}
					
					blackList.set({ receiver: "black", list: list });
					
					// White List:
					var newWL = r.old.whiteList.split(",").sort().join(",");
					blackList.set({ receiver: "white", list: newWL });
					
					// Countdown
					var newTime = r.old.countdown;
					lsSet("timeWindow", newTime);
					
					// Max Tabs
					var maxTabs = r.old.maxTabs;
					lsSet("maxTabs", maxTabs);

					// Remote
					var zap = r.old.zap;
					lsSet("zapIntensity", zap);
					
					var zapPos = parseInt(zap);
					zapPos = rawToPercent(zap, "zap");
					lsSet("zapPosition", zapPos);
					
					var vib = r.old.vib;
					var vibPos = parseInt(vib);
					vibPos = rawToPercent(vib, "vibrate");
					lsSet("vibrationPosition", vibPos);
					
					console.log(vib);
					
					// Scheduler
					var format = 24;
					if (r.old.scheduler.start.indexOf("M") != -1){
						format = 12;
					}
					
					lsSet("mondayActive", r.old.scheduler.mon);
					lsSet("tuesdayActive", r.old.scheduler.tue);
					lsSet("wednesdayActive", r.old.scheduler.wed);
					lsSet("thursdayActive", r.old.scheduler.thu);
					lsSet("fridayActive", r.old.scheduler.fri);
					lsSet("saturdayActive", r.old.scheduler.sat);
					lsSet("sundayActive", r.old.scheduler.sun);
					
					lsSet("timeFormat", format);
					
					lsSet("generalActiveTimeEnd", r.old.scheduler.end);
					lsSet("generalActiveTimeStart", r.old.scheduler.start);
				}
			}
		)
	},
	
	frontListener: function(){
		chrome.extension.onMessage.addListener(
			function(request, sender, sendResponse) {
				if ( request.target == "popup" || request.target == "options") {
					if (request.subject == "migration" && nMigPrompt === 0){
						nMigPrompt++;
						
						console.log(request);
						lsSet("updateRequest", JSON.stringify(request));
						
						migrations.convertAll(request);
					}
					else if (request.action == "reload"){
						location.reload();
					}
				}
			}
		)
	},
	frontStarter: function(){
		for (i = 0; i < migrations.oldIds.length; i++){
			var oldId = migrations.oldIds[i];
			chrome.runtime.sendMessage(oldId, {exist: true});
		}
		
	},
	
	convertAll: function(r){
		lsSet("updateRequest", JSON.stringify(r));
		
		var xHTML = $("<div>")
			.append( $("<p>", {text: "You are coming from the previous Testing extension. Would you like import your old settings or clear your settings?"}) );
			
		var s = {
			title: "Welcome to Pavlok's latest Extension",
			html: $(xHTML).html(),
			buttons: {"Import settings": true, "Reset settings": false},
			focus: 0,
			submit: function(e, v, m, f){
				var r = JSON.parse(lsGet("updateRequest"));
				msgBackground({subject: "import settings", r: r})
				
				migrations.uninstallPrompt();
			}
		}
		
		$.prompt([s]);
		
	},
	uninstallPrompt: function(){
		nMigPrompt = 0;
		$.prompt("<p>Now that your settings have been imported, let's say goodbye to the old extension.</p><p><b>This click will uninstall the old Test extension from your browser</b></p>", {
			title: "Great! Now let's remove the old one!",
			buttons: {"Uninstall Pavlok TEST extension": true},
			focus: 0,
			submit: function(e, v, m, f){
				if (v === true){
					var oldId = lsGet("oldId");
					chrome.runtime.sendMessage(oldId, {uninstall: true});
					
				}
				migrations.newAppPrompt();
			}
		});
	},
	
	newAppPrompt: function(){
		$.prompt("<p>Great! We are nearly done! Last thing to do is to download the latest <b>Pavlok phone app</b>. To do so: <b>search for Pavlok on app or play store</b> and download it</p><p><b>The extension won't work until you have the new app!</b></p>",
		{
			title: "You need the newest phone app",
			buttons: {"Ok, I'll get the app now": true},
			submit: function(){
				msgInterfaces({action: "reload"});
			}
		});
	}
}

/* Sandbox */