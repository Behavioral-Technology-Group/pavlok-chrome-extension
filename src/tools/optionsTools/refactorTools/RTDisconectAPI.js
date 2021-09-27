import React from 'react';
import changeRTVisibility from '../changeRTVisibility';
import confirmUpdate from '../../helpersTools/confirmUpdate';
import lsSet from '../../helpersTools/lsSet';

const RTDisconectAPI = () => {
    var msg = "Have you been noticing that you receive beeps when you are being unproductive, and vibrations when you are being very productive?<br/><br/>Keeping this integration will help you become a productive, healthy individual. Are you sure you want to disconnect Pavlok from RescueTime?";

    var options = {};

    $.prompt(msg, {
        title: "Your Pavlok will disconnect from RescueTime. But are you sure you want to do that?",
        html: msg,
        defaultButton: 1,
        buttons: { "No, I want to be productive": false, "Yes, disconnect from RescueTime": true },
        submit: function (e, v, m, f) {
            log("result was " + v);
            var result = v;
            if (result == true) {
                lsDel("RTAPIKey");
                $("#rescueTimeAPIKey").val('');
                $("#RTOnOffSelect").val('Off');
                lsSet('RTOnOffSelect', 'Off');
                changeRTVisibility();
                confirmUpdate(notifyUpdate);
            }
        }
    });

}

export default RTDisconectAPI;