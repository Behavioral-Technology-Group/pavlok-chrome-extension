import msgBackground from '../helpersTools/msgBackground';
import validateUserInfo from './validateUserInfo';

const enter_on_sign_in = () => {
	$('.onlyUnlogged input').on('keydown', function (e) {
		if (e.which == 13) {
			e.preventDefault();
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
		}
	});
}

export default enter_on_sign_in;