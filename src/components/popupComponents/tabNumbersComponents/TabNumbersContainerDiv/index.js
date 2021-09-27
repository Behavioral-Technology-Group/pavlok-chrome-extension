import React from 'react';

const TabNumbersContainerDiv = () => {
    return (
        <>
            <div>
                <img src="../images/tabnumbers.png" className="pv-tab-header-icon" />
                <span className="pv-tab-header-span">Set Max Tabs</span>
            </div>
            <div>
                <span>Set tab limit:</span>
                <select id="maxTabsSelect">
                </select>
            </div>
        </>
    );
}

export default TabNumbersContainerDiv;