const restoreCheckBox = (checkboxID, condition) => {
	if (condition == 'true') { $("#" + checkboxID).prop('checked', true); }
	else { $("#" + checkboxID).prop('checked', false); }
}

export default restoreCheckBox;