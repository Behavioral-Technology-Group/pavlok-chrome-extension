import defineTimeCulture from './defineTimeCulture';
import enableLogin from './enableLogin';
import enableSignInOut from './enableSignInOut';
// import enableScrollNavigation from './enableScrollNavigation';
import startBlackAndWhiteList from './startBlackAndWhiteList';
import initialPreEnableOp from './initialPreEnableOp';
import enableSelects from './enableSelects';
import enableSelectables from './enableSelectables';
import enableAutoZapper from './enableAutoZapper';
import enableTooltips from '../helpersTools/enableTooltips';
import enableButtons from './enableButtons';
import enableSliders from './enableSliders';
import enableCheckboxes from './enableCheckboxes';
import enableInputs from './enableInputs';
import enableRescueTime from './enableRescueTime';
import initialPostEnableOp from './initialPostEnableOp';
import enableTimers from './enableTimers';
// import createDetailTR from './createDetailTR';
import enableToDo from '../todoTools/enableToDo';

const initialize = () => {
	defineTimeCulture();//new function defined above//ok

	enableLogin();//ok
	enableSignInOut();//ok
	// enableScrollNavigation();//ok

	// startBlackAndWhiteList();//new function defined above//ok
	initialPreEnableOp();//new function defined above//ok

	// Enablers
	// enableSelects();//ok
	enableSelectables();//ok
	// enableTimers();//removed because has a massive use of Globalize library
	// enableAutoZapper();//ok
	enableTooltips();//ok
	// enableButtons();//ok
	// enableSliders();//ok
	//enableTables();
	// enableCheckboxes();//ok
	enableInputs();//ok
	// enableRescueTime();//ok
	enableToDo();

	initialPostEnableOp();//new function defined above //ok
}

export default initialize;