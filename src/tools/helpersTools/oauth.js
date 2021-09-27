import log from './log';
import msgInterfaces from './msgInterfaces';
import countTabs from './countTabs';
import UpdateTabCount from './UpdateTabCount';
import showOptions from './showOptions';
import userInfo from './userInfo';
import notifyUser from './notifyUser';


function oauth() {
	var redirectURL = chrome.identity.getRedirectURL();

	if (usage == "localMVP") {
		var clientID = "cdf545447838ebca75037906fa76f65e078f39873c9a235f1f65ab3da0337300";
		var clientSecret = "220898a0635c04696dd3aab7b6990b6735cc7fc2817eed5be9f1bb1b5063e288";
	}
	else if (usage == "localSTAGE") {
		var clientID = "0dff824cc4af8db17a939c231fc17585b35409707c3a1a5308ef1e04733c9bd7";
		var clientSecret = "a142a925c1abe2cc8bfdfd4481707f0f7fec4af89baa3929259b1079adbf72c2";
	}
	else if (usage == "testMVP") {
		var clientID = "7258a54f6366824c3838bc5b4dd47181307b025dab913d45824f49af17815514";
		var clientSecret = "abefe55aebdd664462e4e36a534ebed68eb27333612d822eb316aa7f525f73a3";
	}
	else if (usage == "testSTAGE") {
		clientID = "5e2fac7b1dd2b76aae014dd197daee094bc10d9759e5fda2e5c656449f00d8a4";
		clientSecret = "a08b1088b0c0090da308199e959a2f5753a133babfb05ff259674b64c4920227";
	}
	else if (usage == "productionSTAGE") {
		var clientID = "5e2fac7b1dd2b76aae014dd197daee094bc10d9759e5fda2e5c656449f00d8a4";
		var clientSecret = "a08b1088b0c0090da308199e959a2f5753a133babfb05ff259674b64c4920227";
	}
	else if (usage == "productionMVP") {
		var clientID = "7d90dbab1f8723cd8fd15244f194c8a370736bd48acffcca589c9901454df935";
		var clientSecret = "83a2de725b3ec336393a5cb59e4399bd5dc2f51c5e7aeb37d3249d7ee622523c";
	}
	var authURL = lsGet("baseAddress") +
		"oauth/authorize?" +
		'client_id=' + clientID +
		'&redirect_uri=' + redirectURL +
		'&response_type=code' +
		'&prompt=select_account';

	log("Step 1: Redirect URL is: " + redirectURL);

	chrome.identity.launchWebAuthFlow(
		{ url: authURL, interactive: true },

		function (responseUrl) {
			// Get Auth code
			log("Step 2: Response url with code is:" + responseUrl);
			authorizationCode = responseUrl.substring(responseUrl.indexOf("=") + 1);
			log("Step 3: Authorizaion code is: " + authorizationCode);

			// Exchange AuthCode for Access Token:
			accessTokenUrl =
				lsGet("baseAddress")
				+ "/oauth/token?"
				+ 'client_id=' + clientID
				+ '&client_secret=' + clientSecret
				+ '&code=' + authorizationCode
				+ '&grant_type=authorization_code'
				+ '&redirect_uri=' + redirectURL;

			log("Step 4: Access token Url is: " + accessTokenUrl);

			$.post(accessTokenUrl)
				.done(function (data) {
					log(data);
					var accessToken = data.access_token;

					msgInterfaces({ action: 'logged', token: accessToken });
					lsSet('logged', 'true');
					lsSet('accessToken', accessToken);
					chrome.windows.getLastFocused(function (win) {
						countTabs(lsGet("tabCountAll"), UpdateTabCount);
						showOptions(accessToken);
						userInfo(accessToken);
					});
					log("OAuth2 test concluded");
					chrome.notifications.clear("installed");
					notifyUser('Hooray! Welcome aboard!', 'Click here to start using the Productivity Extension', 'signedIn');
				});
		}
	);
}

export default oauth;