import React from 'react';
import enableSelects from '../../../../tools/optionsTools/enableSelects';

const ZapFrequencyBlackListDiv = () => {
    return (
        <div id="zapFrequencyBlackListDiv">
            <h2>Black List zapping countdown</h2>
            <p>Set how long before Pavlok zaps when you get to Black Listed Sites:</p>
            <select id="blackListTimeWindow" onChange={enableSelects} className="pavSetting">
                <option value="3">3</option>
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="15">15</option>
                <option value="30">30</option>
            </select>
            <span> seconds</span>
            <hr />
        </div>
    );
}

export default ZapFrequencyBlackListDiv;