import lsGet from "../helpersTools/lsGet";
import userInfo from '../helpersTools/userInfo';
import updateNameAndEmail from "../helpersTools/updateNameAndEmaill";

function presentName() {
	if (!lsGet("userName")) { userInfo(lsGet("accessToken")); }
	if (lsGet("userName")) { updateNameAndEmail(lsGet("userName")), lsGet("userEmail"); }
}

export default presentName;