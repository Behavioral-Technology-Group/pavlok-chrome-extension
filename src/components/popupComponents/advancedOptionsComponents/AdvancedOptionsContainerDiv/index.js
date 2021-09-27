import React from 'react';
// import './styles.css';

const AdvancedOptionsContainerDiv = () => {
    return (
        <>
            <div>
                <img src="../images/advancedoptions.png" className="pv-tab-header-icon" />
                <span className="pv-tab-header-span">Advanced Options</span>
            </div>
            <div>
                <p>
                    <a target="blank" href="options.html#todoistContainerDiv">Black List Count</a>
                </p>
                <p>
                    <a target="blank" href="options.html#zapFrequencyBlackListDiv">Scheduler</a>
                </p>
                <p>
                    <a target="blank" href="options.html#timeDaysDiv">Coach Assistant</a>
                </p>
            </div>
        </>
    );
};

export default AdvancedOptionsContainerDiv;