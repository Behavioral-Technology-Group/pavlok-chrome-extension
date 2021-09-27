import enableDaily from './enableDaily';
import pavPomo from '../todoTools/pavPomo';

const initialPostEnableOp = () => {
	// syncToDo('options');
	pavPomo.helpers.initialSync();

	enableDaily();

	$(".allCaps").text().toUpperCase();

	// var serverKind = lsGet("baseAddress");
	// serverKind = serverKind.split("-")[1].split(".")[0];
	// $("#server").text(serverKind);
}

export default initialPostEnableOp;