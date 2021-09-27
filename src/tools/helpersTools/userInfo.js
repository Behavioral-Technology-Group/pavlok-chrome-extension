import log from './log';
import updateNameAndEmail from './updateNameAndEmaill';

const userInfo = (accessToken) => {
	$.get(lsGet("baseAddress + 'api/v1/me?access_token=' + accessToken"))
		.done(function (data) {
			var dude = JSON.stringify(data, null, 4);
			log('User info for ' + data.name + ' succeeded. \nHis UID is:' + data.uid);
			lsSet('userEmail', data.email)
			lsSet('userName', data.name);
			updateNameAndEmail(lsGet("userName"), lsGet("userEmail"));
			return data.name;
		})
		.fail(function () {
			log('User information request failed');
		});
}

export default userInfo;