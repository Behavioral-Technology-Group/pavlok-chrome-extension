import React from 'react';
import dateParser from '../../tools/optionsTools/dateParser';
import {
    vibrate, zap, beep, createClient, ClientId
} from './libTest';
import Pavlok from './lubUseSuggestion2';

const TestButton = () => {
    function functionCaller() {
        // let client = createClient(ClientId);
        // client.beep(155, "ggogogo");
        // Pavlok.client(lsGet("accessToken")).beep(155, "vailolololo");
        let response = dateParser("9:20pm");
        console.log('.....response.....');
        console.log(response);
    }

    return (
        <button onClick={functionCaller}>Function Test</button>
    );
}

export default TestButton;
