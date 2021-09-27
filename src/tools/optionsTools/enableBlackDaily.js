const enableBlackDaily = () => {
	$('#blackListDaily').tagsInput({
		'defaultText': 'Add site... ie: facebook.com',
		'removeWithBackspace': true
	});
	$('#blackListDaily_tagsinput').attr('style', '');

	$('#whiteListDaily').tagsInput({
		'defaultText': 'facebook.com/groups/772212156222588/',
		'removeWithBackspace': true
	});
	$('#whiteListDaily_tagsinput').attr('style', '');

}

export default enableBlackDaily;