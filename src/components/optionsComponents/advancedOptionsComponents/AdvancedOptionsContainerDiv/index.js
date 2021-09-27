import React, { useEffect } from 'react';
import PavCoach from '../PavCoach';
import TabNumbersAdvancedDiv from '../TabNumbersAdvancedDiv';
import TimeDaysDiv from '../TimeDaysDiv';
import ZapFrequencyBlackListDiv from '../ZapFrequencyBlackListDiv';
import StimuliNotificationsDiv from '../StimuliNotificationsDiv';
import restoreOptions from '../../../../tools/optionsTools/restoreOptions';
import enableCheckboxes from '../../../../tools/optionsTools/enableCheckboxes';

const AdvancedOptionsContainerDiv = () => {

    useEffect(() => {
        restoreOptions();
        enableCheckboxes();
    }, []);

    return (
        <div id="advancedOptionsContainerDiv">
            <h2 className="sectionTitle">Advanced Options</h2>
            <StimuliNotificationsDiv />
            <ZapFrequencyBlackListDiv />
            <TabNumbersAdvancedDiv />
            <TimeDaysDiv />
            <PavCoach />
        </div>

    );
}

export default AdvancedOptionsContainerDiv;