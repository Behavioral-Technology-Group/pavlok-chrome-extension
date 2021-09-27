import msgBackground from '../helpersTools/msgBackground';

const enableSignInOut = () => {
	$("#signOutX").click(function () {
		msgBackground({ action: "signOut" });
	});
}

export default enableSignInOut;