import isValid from './isValid';
import lsGet from '../helpersTools/lsGet';

const showOptions = (accessToken) => {

	if (isValid(accessToken)) {

		$(".onlyLogged").css('visibility', 'visible');
		$(".onlyUnlogged").css('display', 'none');
		$("#testPairing").show();
		$("#testPairingX").show();
		$("#pavUserNameLogin").val("");
		$("#pavPasswordLogin").val("");
	}
	else {
		$(".onlyLogged").css('visibility', 'hidden');
		$("#unloggedMessage").hide();
		$(".onlyUnlogged").css('display', 'block');
		$("#unloggedMessage").show();
		$("#testPairing").hide();
		$("#testPairingX").hide();
	}
}

export default showOptions;