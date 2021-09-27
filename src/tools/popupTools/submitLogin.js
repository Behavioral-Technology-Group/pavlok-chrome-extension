import msgBackground from '../helpersTools/msgBackground';
import validateUserInfo from '../helpersTools/validateUserInfo';


const submitLogin = () => {
	$("#pavSubmitLogin").click(function (event) {
		event.preventDefault();

		var userInfo = {
			userName: $("#pavUserNameLogin").val(),
			password: $("#pavPasswordLogin").val(),
		};

		if (validateUserInfo(userInfo)) {
			var msg = {
				action: "oauth",
				user: userInfo
			};

			msgBackground(msg);
		}
		else {
		};
	});
}

export default submitLogin;