import lsGet from '../helpersTools/lsGet';
import log from '../helpersTools/log';


const defineTimeCulture = () => {
	let culture;

	var timeFormat = lsGet('timeFormat');
	if (timeFormat == "24") { culture = "de-DE"; }
	else if (timeFormat == "12") { culture = "en-EN"}
	else {
		culture = "de-DE";
		lsSet("timeFormat", "24");
		$("#timeFormat").val("24");
		log("timeFormat is broken: " + timeFormat);
	};
	//Globalize.culture( culture ); //we have troubles to import this variable
}

export default defineTimeCulture;