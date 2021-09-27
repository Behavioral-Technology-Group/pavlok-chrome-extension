import log from './log';
import randomString from './randomString';

function rescueTimeOAuth() {
	var redirectURL = chrome.identity.getRedirectURL();
	// Local
	var clientID = "c78f8ede283287e0ffc3";
	var clientSecret = "ce1f6b4bfad9663af02053155d42185c6de2c72b";
	var scope = 'user';
	var state = randomString(12);

	var authURL = "https://github.com/login/oauth/authorize?" +
		'client_id=' + clientID +
		'&redirect_uri=' + redirectURL +
		'&scope=' + scope +
		'&state=' + state;

	log("Step 1: Redirect URL is: " + redirectURL);

	chrome.identity.launchWebAuthFlow(
		{ url: authURL, interactive: true },

		function (responseUrl) {
			// Get Auth code
			log("Step 2: Response url with code is:" + responseUrl);
			authorizationCode = responseUrl.substring(responseUrl.indexOf("=") + 1);
			log("Step 3: Authorizaion code is: " + authorizationCode);

			// Exchange AuthCode for Access Token:
			accessTokenUrl = 'https://github.com/login/oauth/access_token?' +
				'client_id=' + clientID +
				'&client_secret=' + clientSecret +
				'&code=' + authorizationCode +
				'&redirect_uri=' + redirectURL;
			'&state=' + state;

			log("Step 4: Access token Url is: " + accessTokenUrl);

			$.post(accessTokenUrl)
				.done(function (data) {
					log(data);
					var accessToken = data.split("=")[1];
					lsSet('loggedRT', 'true');
					lsSet('accessTokenRT', accessToken);

					$("#rescueTimeData").html($.get("https://api.github.com/user?access_token=" + lsGet("accessTokenRT")));


				});

			log("OAuth2 test concluded");

		}
	);
}

export default rescueTimeOAuth;