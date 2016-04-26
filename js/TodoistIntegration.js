var todoist = {
	// Variables
	apiURL: "https://todoist.com/API/v6/sync",
	authURL: "https://todoist.com/oauth/authorize",
	clientID: function(usage){
		var local = "a55fe0e20d56411f94c1bf70ec77594d";
		var test = "f7d20f9fffe9491ead6820ed42ca074d";
		var production = "";
		
		if (usage.indexOf("local") != -1){ return local }
		else if (usage.indexOf("test") != -1){ return test }
		else if (usage.indexOf("production") != -1){ return production }
	},
	clientSecret: function(usage){
		var local = "baf57468898b411f8b71df3d601a8656";
		var test = "93c8053a000a433ab290f1b6be61bd65";
		var production = "";
		
		if (usage.indexOf("local") != -1){ return local }
		else if (usage.indexOf("test") != -1){ return test }
		else if (usage.indexOf("production") != -1){ return production }
	},
	token: function(){ return lsGet('todoistAccessToken') },
	// Methods
	
	// Token dealings
	getToken: function(){
		// 
		var scope = ["task:add", "data:read", "data:read_write", "data:delete"];
		var jScope = scope.join(',');
		
		var redirectURL = chrome.identity.getRedirectURL();
		var authURL =	"https://todoist.com/oauth/authorize/" +
						"?client_id="	+ this.clientID(usage) +
						"&scope="		+ jScope +
						"&state="		+ this.random();
		
		console.log("Step 1: Redirect URL is: " + redirectURL);
		
		chrome.identity.launchWebAuthFlow(
			{url: authURL, interactive: true},
			
			function(responseUrl) {
				// Get Auth code
				console.log("Step 2: Response url with code is:" + responseUrl);
				var authData = responseUrl.substring(responseUrl.indexOf("=")+1);
				authData = authData.split("&code=");
				
				var authorizationCode = authData[1];
				var receivedState 	  = authData[0];
				
				var redirectURL = chrome.identity.getRedirectURL();
				
				// validate received state
				
				console.log("Step 3: Authorizaion code is: " + authorizationCode);
				
				// Exchange AuthCode for Access Token:
				accessTokenUrl = "https://todoist.com/oauth/access_token/" + 
									"?client_id=" + todoist.clientID(usage) +  
									"&client_secret=" + todoist.clientSecret(usage) + 
									"&code=" + authorizationCode + 
									"&redirect_uri=" + redirectURL;
				
				console.log("Step 4: Access token Url is: " + accessTokenUrl);
				
				$.post(accessTokenUrl)
					.done(function (data) {
						console.log(data);
						var accessToken = data.access_token;
						
						localStorage.setItem('todoistAccessToken', accessToken);
						msgInterfaces({action: "todoist", change: "logged"})
						console.log("OAuth2 test concluded");
					});
			}
		);	
		return
	},
	
	removeToken: function(){
		var url = "https://todoist.com/api/access_tokens/revoke" + 		
					"?client_id=" + todoist.clientID + 
					"&client_secret=" + todoist.clientSecret + 
					"&access_token=" & todoist.token();
		$.post(url)
			.done(function(){
				console.log("Token revoked");
				lsDel('todoistAccessToken');
				msgInterfaces({
					action: "todoist",
					change: "unlogged"
				});
				return true;
			})
			.fail(function(){
				console.log("Token revoke failed");
				return false;
			});
	},
	
	// Tasks dealing
	getTasks: function(){
		var resTypes 	= ['user', 'items'];
		var reqURL 		= this.apiURL + "/?token=" + this.token() + "&seq_no=0" + "&resource_types=" + JSON.stringify(resTypes);
		var data;
		$.post(reqURL)
			.done(function(data){
				lsSet('todoistTasks', data.Items, 'object');
				lsSet('todoist', data, 'object');
				console.log("Todoist tasks received");
				console.log(data.Items);
			})
			.fail(function(){ console.log("Todoist tasks request failed"); });	
	},
	
	sendTask: function(task){
		/* Sends a task from Pavlok to Todoist.
		 * Tasks come in Pavlok Model
		*/
		
		var args = {
			content: task.content,
			note: "from Pavlok"
		}
		
		var command = {
			type: "item_add",
			temp_id: todoist.random(30),
			uuid: todoist.random(30),
			args: args
		}
		
		url = this.apiURL + 
				"/?token=" + this.token() +
				"&commands=[" + JSON.stringify(command) + "]";
		
		testPost(url);
	},
	
	complete: function(task){
		/* Gets a task (todoist model) and sends the complete call */
		var args = {
			ids: [task.id]
		}
		
		var command = {
			type: "item_complete",
			uuid: todoist.random(30),
			args: args
		}
		
		var url = this.apiURL + "/?token=" + this.token() +
				"&commands=[" + JSON.stringify(command) + "]";
		
		testPost(url);
	},
	
	uncomplete: function(task){
		var uuid = (lsGet('todoist', 'parse')).UserId;
		
		var args = {
			ids: [task.id]
		}
		
		var command = {
			type: "item_uncomplete",
			uuid: uuid,
			args: args
		}
		
		var url = this.apiURL + "/?token=" + this.token() +
				"&commands=[" + JSON.stringify(command) + "]";
		
		testPost(url);
	},
	
	delete: function() {
		
	},
	

	// Tasks translation
	toPavlok: function(task){
		var pavTask = {
			task: task.content,
			done: task.checked,
			today: false,
			now: false,
			external_id: task.id
		}
		return pavTask
	},
	
	fromPavlok: function(task){
		
		var todoistTask = {
			checked: function(task) {if (task.done == true){return 1} else {return 0}},
			content: task.task,
			id: task.id
		}
		return todoistTask;
	},
	
	// Useful resources
	random: function(digits){
		if (!digits) { digits = 64; }
		var text = "";
		var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

		for( var i=0; i < 5; i++ )
			text += possible.charAt(Math.floor(Math.random() * possible.length));

		return text;
	},
	
	checkUnique: function(pTasks, tTasks){
		var uniqueTasks = [];
	},
	
	
	// Batching task operations
	import: function(){
		var syncedTasks = [];
		var sharedTasks = [];
		var todoistOnly = [];
		var pavlokOnly = [];
		
		var pavlokTasks = lsGet('allTasks', 'parse') || [];
		var todoistTasks = lsGet('todoist', 'parse');
		if (!todoistTasks){
			todoistTasks = [];
		}
		else {
			todoistTasks = todoistTasks.Items;
		}
		
		
		// Separate existing and new tasks
		// On todoist 
		for (t = 0; t < todoistTasks.length; t++){
			var curT = todoistTasks[t];
			var exist = _.where(pavlokTasks, {external_id: curT.id});
			
			if (exist) 	{ sharedTasks.push(curT); }
			else 		{ todoistOnly.push(curT);		}
		}
		
		// arrayObjectIndexOf(searchedArray, searchTerm, property)
		pavlokOnly = pavlokTasks;
		var removedIndexes = [];
		for (t = 0; t < sharedTasks.length; t++){
			var curT = sharedTasks[t];
			var index = arrayObjectIndexOf(pavlokTasks, curT.id, 'external_id')
			if (index == -1){ removedIndexes.push(index); }
		}
		
		var P = pavlokTasks.length;
		var T = todoistTasks.length;
		var S = sharedTasks.length;
		var p = pavlokOnly.length;
		var t = todoistOnly.length;
		
		console.log("Pavlok total: 		"	+ pavlokTasks.length	);
		console.log("Todoist total: 		"	+ todoistTasks.length	);
		console.log("Shared total: 		" 	+ sharedTasks.length	);
		console.log("pavlokOnly total: 	" 	+ pavlokOnly.length		);
		console.log("todoistOnly total:	" 	+ todoistOnly.length	);
		
		var check = (P + T - 2*S) == (p + t);
		console.log("P + T - 2S = p + t HOLDS " + check);
		
		// Compare last update between local and imported Existing tasks
		
		
		// Add new tasks
		
		
		// Save new task list
	},
	
	import2: function(){
		var todoistTasks = lsGet('todoist', 'parse');
		if (!todoistTasks){ todoistTasks = []; }
		else { todoistTasks = todoistTasks.Items; }
		
		var pavlokTasks = testTodo.backend.read();
		
		for (t = 0; t < todoistTasks.length; t++){
			var impTask = todoist.toPavlok(todoistTasks[t]);
			testTodo.backend.create(impTask);
		}
		
		console.log(todoistTasks.length + " tasks imported");
		msgInterfaces({action: "updateActions"});
		
	},
	
	export: function(){
		
	},
	
	helpers:{
		
	},
	
	frontend:{
		toggle: function(){
			if (todoist.token()){
				$("#onTodoist").show();
				$("#offTodoist").hide();
				return console.log("todoist is logged");
			}
			else{
				$("#onTodoist").hide();
				$("#offTodoist").show();
				return console.log("todoist is UNlogged");
			}
		}
	},
	
	backend:{
		
	},
	
	
	
};

function testPost(url){
	console.log("Posting attemp to\n" + url);
	$.post(url)
	.done(function(data){ console.log("done"); console.log(data);})
	.fail(function(data){ console.log("fail"); console.log(data);});
}
console.log("Todoist integration is active");

function onTheList(){
	
}


/* Test cases for todoist ingegration 

OK	1) get token return token when everything goes right
OK	2) remove token clears token from local Storage
OK	3) remove token revokes token on todoist API
OK	4) import find tasks that are on both
OK	5) import separates tasks that are only on todoist
	6) import separates tasks that are only on Pavlok
	7) import deletes tasks that are on Pavlok, but not on Todoist (because pavlok created tasks are always sent to todoist without the sync command)
	8) 


*/