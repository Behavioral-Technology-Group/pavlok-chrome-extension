import React from 'react';

import updateProductivity from '../updateProductivity';
import confirmUpdate from '../../helpersTools/confirmUpdate';

const RTSelectOnOff = () => {
    var RTOnOffSelect = $("#RTOnOffSelect").val();
    confirmUpdate(notifyUpdate);
    lsSet("RTOnOffSelect", RTOnOffSelect);

    if (RTOnOffSelect == "On") {
        updateProductivity();
        $("#RTResultsHolder").css('visibility', 'visible');
    } else {
        $("#RTResultsHolder").css('visibility', 'hidden');
    }
}

export default RTSelectOnOff;