import validateUserInfo from '../helpersTools/validateUserInfo';
import msgBackground from '../helpersTools/msgBackground';

const enableLogin = () => {
	//add a event listener for clicks over sign-in button on options.js
	$("#pavSubmitLogin").click(function (event) {
		event.preventDefault();

		//take input values
		var userInfo = {
			userName: $("#pavUserNameLogin").val(),
			password: $("#pavPasswordLogin").val(),
		};

		//configure background command
		var msg = {
			action: "oauth",
			user: userInfo
		};

		//validate the input format and send command to background oauth
		validateUserInfo(userInfo) ? msgBackground(msg) : null;
	});
}

export default enableLogin;