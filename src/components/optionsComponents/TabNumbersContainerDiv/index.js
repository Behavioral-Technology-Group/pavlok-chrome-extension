import React, { useEffect } from 'react';
import maxTabsPack from '../../../tools/helpersTools/maxTabsPack';
import lsGet from '../../../tools/helpersTools/lsGet';
import optionsCommandsOnReady from '../../../tools/helpersTools/optionsCommandsOnReady';

const TabNumbersContainerDiv = () => {

    useEffect(() => {
        maxTabsPack.create("options", lsGet("maxTabs"));
        optionsCommandsOnReady();
    }, []);

    return (
        <div id="tabNumbersContainerDiv">
            {/* <!-- Tab Numbers--> */}
            <div id="settingsDIV">
                <h2 className="sectionTitle">Set Max Tabs
                    <sup>
                        <span className="helpSpan" title='	
                            <p>Tab Number Control will help you getting out of the infinite tabs from hell. It will vibrate, beep and zap you out of it.</p>
                            <p>For instance: say you have a <b>10 tabs limit</b>.</p>
                            <ul>
                            <li>When you <b>get close to your limit</b> (think 9 tabs, one step away from the red line), Pavlok will <span className="yellow">Vibrate</span>.</li>
                            
                            <li>If you get <b>to the limit</b>, it will <span className="yellow">Beep</span>.</li>

                            <li>If you <b>cross that limit</b>, it will <span className="yellow">shock you as long as you keep opening more tabs.</span></li>
                            </ul>'
                        >
                            ?
                        </span>
                    </sup>
                </h2>
                <p>Set the max amount of tabs allowed open at once</p>
                <hr />
                <span id="label-text">Set tab limit:</span>
                <select id="maxTabsSelect"></select>
                <br />
            </div>
        </div>
    );
}

export default TabNumbersContainerDiv;