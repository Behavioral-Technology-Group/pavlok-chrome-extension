// import saveWhiteList from '../helpersTools/saveWhiteList';

function startBlackAndWhiteList() {
	// Black and WhiteLists
	var wl = document.getElementById("blackList");

	if (wl) {
		$('#whiteList')[0].value = lsGet("whiteList");

		// $('#whiteList').tagsInput({
		// 	'onChange': saveWhiteList,
		// 	'defaultText': 'Add site... ie: facebook.com/groups/772212156222588/',
		// 	'removeWithBackspace': true,
		// });
	}
};

export default startBlackAndWhiteList;