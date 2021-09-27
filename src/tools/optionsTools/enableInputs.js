import lsSet from '../helpersTools/lsSet';

const enableInputs = () => {
	// Advanced day to day
	$("#sundayActiveTimeStart").change(function () {
		lsSet('sundayActiveTimeStart', $(this).val());
	});

	$("#sundayActiveTimeEnd").change(function () {
		lsSet('sundayActiveTimeEnd', $(this).val());
	});

	$("#mondayActiveTimeStart").change(function () {
		lsSet('mondayActiveTimeStart', $(this).val());
	});

	$("#mondayActiveTimeEnd").change(function () {
		lsSet('mondayActiveTimeEnd', $(this).val());
	});

	$("#tuesdayActiveTimeStart").change(function () {
		lsSet('tuesdayActiveTimeStart', $(this).val());
	});

	$("#tuesdayActiveTimeEnd").change(function () {
		lsSet('tuesdayActiveTimeEnd', $(this).val());
	});

	$("#wednesdayActiveTimeStart").change(function () {
		lsSet('wednesdayActiveTimeStart', $(this).val());
	});

	$("#wednesdayActiveTimeEnd").change(function () {
		lsSet('wednesdayActiveTimeEnd', $(this).val());
	});

	$("#thursdayActiveTimeStart").change(function () {
		lsSet('thursdayActiveTimeStart', $(this).val());
	});

	$("#thursdayActiveTimeEnd").change(function () {
		lsSet('thursdayActiveTimeEnd', $(this).val());
	});

	$("#fridayActiveTimeStart").change(function () {
		lsSet('fridayActiveTimeStart', $(this).val());
	});

	$("#fridayActiveTimeEnd").change(function () {
		lsSet('fridayActiveTimeEnd', $(this).val());
	});

	$("#saturdayActiveTimeStart").change(function () {
		lsSet('fridayActiveTimeStart', $(this).val());
	});

	$("#saturdayActiveTimeEnd").change(function () {
		lsSet('fridayActiveTimeEnd', $(this).val());
	});

}

export default enableInputs;