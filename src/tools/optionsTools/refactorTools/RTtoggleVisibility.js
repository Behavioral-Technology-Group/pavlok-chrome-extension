import React from 'react';
import changeRTVisibility from '../changeRTVisibility';

const RTtoggleVisibility = () => {
    var APIKey = $("#rescueTimeAPIKey").val();
    lsSet("RTAPIKey", APIKey);
    changeRTVisibility();
}

export default RTtoggleVisibility;