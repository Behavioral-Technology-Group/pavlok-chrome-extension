import React from 'react';

const changeRTVisibility = () => {
	let APIKey = lsGet("RTAPIKey");
	if (APIKey == undefined || APIKey == 'null' || APIKey == false) {
		$("#RTCodeOnly").addClass("noDisplay");
		$("#NoRTCodeOnly").removeClass("noDisplay");
		$("#RTAPIKeySpan").text('');
		
	} else {
		$("#RTCodeOnly").removeClass("noDisplay");
		$("#NoRTCodeOnly").addClass("noDisplay");
		$("#RTAPIKeySpan").text(lsGet("RTAPIKey"));
	}
}

export default changeRTVisibility;