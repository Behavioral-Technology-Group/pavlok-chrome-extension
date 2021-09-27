import blackListTable from '../helpersTools/blackListTable';
import saveWhiteList from '../helpersTools/saveWhiteList';
import removeInlineStyle from '../helpersTools/removeInlineStyle';
import lsGet from '../helpersTools/lsGet';


function enableBlackList() {
	var bl = lsGet('blackList', 'parse');
	blackListTable.create(bl, "blackList");

	var whiteListContents = lsGet('whiteList');
	$('#whiteList').tagsInput({
		'onChange': saveWhiteList,
		'defaultText': 'Add site... ie: facebook.com/groups/772212156222588/',
		'removeWithBackspace': true
	})
		.importTags(whiteListContents);
	removeInlineStyle("#whiteList_tagsinput");
	removeInlineStyle("#whiteList_tag");

}

export default enableBlackList;