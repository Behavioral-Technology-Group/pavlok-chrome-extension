/* Structure

	This plugin will use the localStorage to emulate a database.
	It will have "tables"
	It will allow searches by "field"
	It will have capabilities of insert, update, delete, select
	It will be lightweight
	It will receive JSON objects and spit an array of JSON objects
*/


function addObject(object, table){
	// To-DO:
	// Check object properties in comparison to tables
	// Set table defaults where it does not match
	// Set security when fields don't match what they should be
	
	
	
	var x = JSON.stringify
	/* // For now, there's only a single table. TODO. Will change this later
	var tablesList = JSON.parse(localStorage.tablesList);
	var oTableIndex = tablesList.indexOf(table);
	if ( oTable == -1 ) {
		console.log("Table " + table + " does not exist.\nExisting tables are:\n" + tablesList);
		return false
	}
	var oTableIndex = JSON.parse("localStorage." + tablesList[oTableIndex]);
	*/
	
	var oDB = JSON.parse(localStorage.ToDoDB);
	var oTable = oDB.table;
	
	var oTable.push(object);
	
	
}