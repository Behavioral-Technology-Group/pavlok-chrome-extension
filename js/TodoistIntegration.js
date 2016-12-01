var todoist = {
	// Variables
	
	apiURL: "https://todoist.com/API/v6/sync",
	authURL: "https://todoist.com/oauth/authorize",
	clientID: function(usage){
		var local = "a55fe0e20d56411f94c1bf70ec77594d";
		var test = "f7d20f9fffe9491ead6820ed42ca074d";
		var production = "1ce5770339b84158932dcb3dcde241c1";
		
		if (usage.indexOf("local") != -1){ return local }
		else if (usage.indexOf("test") != -1){ return test }
		else if (usage.indexOf("production") != -1){ return production }
	},
	clientSecret: function(usage){
		var local = "baf57468898b411f8b71df3d601a8656";
		var test = "93c8053a000a433ab290f1b6be61bd65";
		var production = "f79bc36ad3a648b288e8578c3f8e53fb";
		
		if (usage.indexOf("local") != -1){ return local }
		else if (usage.indexOf("test") != -1){ return test }
		else if (usage.indexOf("production") != -1){ return production }
	},
	token: function(){ return lsGet('todoistAccessToken') },
	intervals: 0,
	intervalChecks: 10,
	originalToDo: {
					create: testTodo.backend.create,
					update: testTodo.backend.update,
					delete: testTodo.backend.delete
	},
	
	helpers:{
		seq_no: function(){
			var wholeData = lsGet('todoist', 'parse');
			if (wholeData){
				return wholeData.seq_no
			}
			else { return 0 };
		},
		
		readImportedTasks: function(){
			var todoistTasks = lsGet('todoist', 'parse');
			if (!todoistTasks){ todoistTasks = []; }
			else { todoistTasks = todoistTasks.Items; }
			
			return todoistTasks
		},
		
		taskExternalId: function(externalId){
			var allTasks = testTodo.backend.read();
			var task = _.where(allTasks, {externalId: externalId});
			if (task.length > 0){ return task[0]}
			else { return undefined }
		},
		
		checkdeleted: function(task){
			if (task.is_deleted == 1)	{ return true }
			else						{ return false }
		},
		
		// To do backend listeners
		addToDoListeners: function(force){
			if (force){
				todoist.intervals = setInterval(function(){ 
					todoist.helpers.sync();
					
					}, todoist.intervalChecks * 1000);
				
				testTodo.backend.create = function(task){
					var newTask = todoist.originalToDo.create(arguments[0]);
					log("Sending " + newTask.task);
					todoist.backend.sendTask(todoist.helpers.fromPavlok(newTask));
					return newTask
				};
				
				testTodo.backend.delete = function(id){
					id = parseInt(id);
					var delTask = testTodo.backend.read(id);
					todoist.originalToDo.delete(id);
					log("Deleting item ");
					todoist.backend.delete(delTask.externalId);
					log("Item deleted");
				}
				
				testTodo.backend.update = function(taskId, updates){
					var upTask = todoist.originalToDo.update(taskId, updates);
					log("Updating " + upTask.task);
					
					var props = Object.keys(updates);
					if (props.indexOf("done") != -1){
						if (upTask.done == true){
							todoist.backend.complete(upTask);
						} else {
							todoist.backend.uncomplete(upTask);
						}
					}
					
					log("Test done");
				}
			}
			else{
				clearinterval(todoist.intervals);
				todoist.intervals = 0;
				testTodo.backend.create = todoist.originalToDo.create;
				testTodo.backend.update = todoist.originalToDo.update;
				testTodo.backend.delete = todoist.originalToDo.delete;
			};
		},
		
		// Tasks translation
		toPavlok: function(task){
			var done = (task.checked == 1); // converts 1 -> true, 0 -> false
			var pavTask = {
				task: task.content,
				done: task.checked,
				today: false,
				now: false,
				externalId: task.id
			}
			return pavTask
		},
		
		fromPavlok: function(task){
			var checked;
			if(task.done == true){ checked = 1 } else { checked = 0 };
			
			var todoistTask = {
				checked:	checked,
				content:	task.task,
				id: 		task.id
			};
			
			return todoistTask
		},
		
		// Useful resources
		random: function(digits){
			if (!digits) { digits = 64; }
			var text = "";
			var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

			for( var i=0; i < digits; i++ )
				text += possible.charAt(Math.floor(Math.random() * possible.length));

			return text;
		},

		sync: function(){
			var allTasks = testTodo.backend.read();
			var pavTasks = _.reject(allTasks, function(t){ return t.externalId });
			var adaptedTask;
			
			for (t = 0; t < pavTasks.length; t++){
				adaptedTask = todoist.helpers.fromPavlok(pavTasks[t]);
				todoist.backend.sendTask(todoist.helpers.fromPavlok(pavTasks[t]));
			}
			
			todoist.backend.getTasks();
		}
	},
	
	frontend:{
		toggle: function(){
			if (todoist.token()){
				$("#onTodoist").show();
				$("#offTodoist").hide();
				return log("todoist is logged");
			}
			else{
				$("#onTodoist").hide();
				$("#offTodoist").show();
				return log("todoist is UNlogged");
			}
		}
	},
	
	backend:{
		// Token
		getToken: function(){
			var scope = ["task:add", "data:read", "data:read_write", "data:delete"];
			var jScope = scope.join(',');
			
			var redirectURL = chrome.identity.getRedirectURL();
			var authURL =	"https://todoist.com/oauth/authorize/" +
							"?client_id="	+ todoist.clientID(usage) +
							"&scope="		+ jScope +
							"&state="		+ todoist.helpers.random();
			
			log("Step 1: Redirect URL is: " + redirectURL);
			
			chrome.identity.launchWebAuthFlow(
				{url: authURL, interactive: true},
				
				function(responseUrl) {
					if (!responseUrl) {
						console.log("error. Response is empty");
						return false
					}
					// Get Auth code
					log("Step 2: Response url with code is:" + responseUrl);
					var authData = responseUrl.substring(responseUrl.indexOf("=")+1);
					authData = authData.split("&code=");
					
					var authorizationCode = authData[1];
					var receivedState 	  = authData[0];
					
					var redirectURL = chrome.identity.getRedirectURL();
					
					// validate received state
					
					log("Step 3: Authorizaion code is: " + authorizationCode);
					
					// Exchange AuthCode for Access Token:
					accessTokenUrl = "https://todoist.com/oauth/access_token/" + 
										"?client_id=" + todoist.clientID(usage) +  
										"&client_secret=" + todoist.clientSecret(usage) + 
										"&code=" + authorizationCode + 
										"&redirect_uri=" + redirectURL;
					
					log("Step 4: Access token Url is: " + accessTokenUrl);
					
					$.post(accessTokenUrl)
						.done(function (data) {
							log(data);
							var accessToken = data.access_token;
							
							localStorage.setItem('todoistAccessToken', accessToken);
							msgInterfaces({action: "todoist", change: "logged"})
							log("OAuth2 test concluded");
							
							todoist.helpers.addToDoListeners(true);
						});
				}
			);	
			return
		},
		removeToken: function(){
			var url = "https://todoist.com/api/access_tokens/revoke" +
						"?client_id=" + todoist.clientID(intent) + 
						"&client_secret=" + todoist.clientSecret(intent) + 
						"&access_token=" + todoist.token();
			$.post(url)
				.done(function(){
					log("Token revoked");
					lsDel('todoistAccessToken');
					msgInterfaces({
						action: "todoist",
						change: "unlogged"
					});
					todoist.helpers.addToDoListeners(false);
					return true;
				})
				.fail(function(){
					log("Token revoke failed");
					lsDel('todoistAccessToken');
					todoist.helpers.addToDoListeners(false);
					msgInterfaces({
						action: "todoist",
						change: "unlogged"
					});
					return false;
				});
		},
		
		getTasks: function(force){
			var resTypes 	= 	['items'];
			
			var seq_no;
			if (!force) { seq_no = todoist.helpers.seq_no() } else {seq_no = 0 };

			var reqURL 	= 	todoist.apiURL +
							"/?token=" + todoist.token() + 
							"&seq_no=" + seq_no +
							"&resource_types=" + JSON.stringify(resTypes);
								
			var data;
			$.post(reqURL)
				.done(function(data){
					lsSet('todoistTasks', data.Items, 'object');
					lsSet('todoist', data, 'object');
					// log("Todoist tasks received");
					// log(data.Items);
					todoist.backend.import();
				})
				.fail(function(){ log("Todoist tasks request failed"); });	
		},
		
		// Tasks
		sendTask: function(task){
			/* Sends a task from Pavlok to Todoist.
			 * Tasks come in Pavlok Model
			*/
			
			var args = {
				content: task.content,
				checked: task.checked,
			}
			
			var command = {
				type: "item_add",
				temp_id: todoist.helpers.random(30),
				uuid: todoist.helpers.random(30),
				args: args
			}
			
			testTodo.backend.update(task.id, {externalId: command.temp_id});
			
			url = todoist.apiURL + 
					"/?token=" + todoist.token() +
					"&commands=[" + JSON.stringify(command) + "]";
			
			log(command);
			$.post(url)
				.done(function(data){
					log(data);
					var syncStatus 	= data.SyncStatus;
					var tempId 		= Object.keys(data.TempIdMapping)[0];
					var newId 		= data.TempIdMapping[tempId];
					
					var allTasks 	= testTodo.backend.read();
					var waitingTask	= _.where(allTasks, {externalId: tempId})[0];
					testTodo.backend.update(waitingTask.id, {externalId: newId});
				})
				.fail(function(data){
					
				});
				
			
		},
		complete: function(task){
			/* Gets a task (todoist model) and sends the complete call */
			var args = {
				ids: [task.externalId]
			}
			
			var command = {
				type: "item_complete",
				uuid: todoist.helpers.random(30),
				args: args
			}
			
			var url = todoist.apiURL + "/?token=" + todoist.token() +
					"&commands=[" + JSON.stringify(command) + "]";
			
			testPost(url);
		},
		uncomplete: function(task){
			var args = {
				ids: [task.externalId]
			}
			
			var command = {
				type: "item_uncomplete",
				uuid: todoist.helpers.random(30),
				args: args
			}
			
			var url = todoist.apiURL + "/?token=" + todoist.token() +
					"&commands=[" + JSON.stringify(command) + "]";
			
			testPost(url);
		},
		delete: function(id) {
			/* Gets a task (todoist model) and sends the complete call */
			var args = {
				ids: [id]
			}
			
			var command = {
				type: "item_delete",
				temp_id: todoist.helpers.random(30),
				uuid: todoist.helpers.random(30),
				args: args
			}
			
			var url = todoist.apiURL + "/?token=" + todoist.token() +
					"&commands=[" + JSON.stringify(command) + "]";
			
			testPost(url);
		},
		import: function(){
			var todoistTasks = todoist.helpers.readImportedTasks();
			var pavlokTasks = testTodo.backend.read();
			var impTask;
			
			for (t = 0; t < todoistTasks.length; t++){
				curT = todoistTasks[t];
				var deleted = (curT.is_deleted == 1);
				var exists	= (todoist.helpers.taskExternalId(curT.id) != undefined);
				
				if (deleted){
					var pavTask = todoist.helpers.taskExternalId(curT.id);
					// if (pavTask) { testTodo.backend.delete(pavTask.id); }
					if (pavTask) { todoist.originalToDo.delete(pavTask.id); }
				}
				else{
					if (exists){
						impTask = todoist.helpers.taskExternalId(curT.id);
						var done = curT.checked == 1 // 1 -> true, 0 -> false
						updates = {done: done};
						// testTodo.backend.update(impTask.id, updates);
						todoist.originalToDo.update(impTask.id, updates);
					}
					else {
						impTask = todoist.helpers.toPavlok(curT);
						// testTodo.backend.create(impTask);
						todoist.originalToDo.create(impTask);
					}
				}
			}
			
			log("Syncing with Todoist Server: " + todoistTasks.length + " tasks imported");
			msgInterfaces({action: "updateActions"});
			
		},
	},

	
	
};

if (todoist.token()){
	todoist.helpers.addToDoListeners(true);
}

function testPost(url){
	log("Posting attemp to\n" + url);
	$.post(url)
	.done(function(data){ log("done"); log(data);})
	.fail(function(data){ log("fail"); log(data);});
}
log("Todoist integration is active");

/* Test cases for todoist ingegration 

OK	1) get token return token when everything goes right
OK	2) remove token clears token from local Storage
OK	3) remove token revokes token on todoist API
OK	4) import find tasks that are on both
OK	5) import separates tasks that are only on todoist
OK	6) import separates tasks that are only on Pavlok
OK	7) import deletes tasks that are on Pavlok, but not on Todoist (because pavlok created tasks are always sent to todoist without the sync command)
OK	8) 


*/