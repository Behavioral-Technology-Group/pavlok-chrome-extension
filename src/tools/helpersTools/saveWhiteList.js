import confirmUpdate from '../helpersTools/confirmUpdate';
import lsSet from '../helpersTools/lsSet';
import fixTags from '../helpersTools/fixTags';
import validateTags from '../helpersTools/validateTags';
import msgInterfaces from '../helpersTools/msgInterfaces';
import notifyUpdate from '../helpersTools/variables/notifyUpdate';

const saveWhiteList = () => {
	let curWhiteList = $("#whiteList")[0].value;

	var ok = validateTags(curWhiteList);
	if (ok == true) {
		lsSet('whiteList', curWhiteList);
	}
	else {
		var faulty = curWhiteList.split(',');
		var newList = fixTags(faulty);
		lsSet('whiteList', newList);
	}

	confirmUpdate(notifyUpdate);
	msgInterfaces({ action: "updateBlackList" });
}

export default saveWhiteList;