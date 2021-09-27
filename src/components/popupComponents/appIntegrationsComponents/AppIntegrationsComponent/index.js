import React from 'react';
// import './styles.css';

const AppIntegrationsContainerDiv = () => {
    return (
        <>
            <div>
                <img src="../images/appintegrations.png" className="pv-tab-header-icon" />
                <span className="pv-tab-header-span">App Integrations</span>
            </div>
            <div>
                <p>
                    <a href="options.html#newDailyTaskInput" target="blank">Autozapper</a>
                </p>
                <p>
                    <a href="options.html#puHook3" target="blank">RescueTime</a>
                </p>
                <p>
                    <a href="options.html#rescuetimeContainerDiv" target="blank">Todoist</a>
                </p>
            </div>
        </>
    );

}

export default AppIntegrationsContainerDiv;