import React, { useEffect } from 'react';
// import React from 'react';
import initialService from '../../../../tools/popupTools/initialService';
import toggleTabs from '../../../../tools/popupTools/toggleTabs';



const StimuliContainerDiv = () => {
    useEffect(() => {
        initialService();
        // toggleTabs();
    }, []);

    return (
        <>
            <div>
                <img src="../images/stimuli.png" className="pv-tab-header-icon" />
                <span className="pv-tab-header-span">Remote Control</span>
            </div>
            <div>
                <div className="stimuliControlContainer">
                    <img className="stimuliControlIcon" id="beepTest" src="../images/BeepIcon.png" />
                    <div className="stimuliControlSlider" id="sliderBeep"></div>
                    <span id="beepIntensity" className="stimuliIntensityDisplay"></span>
                </div>

                <div className="stimuliControlContainer">
                    <img className="stimuliControlIcon" id="vibrateTest" src="../images/vibrateIcon.png" />
                    <div className="stimuliControlSlider" id="sliderVibration"></div>
                    <span id="vibrationIntensity" className="stimuliIntensityDisplay"></span>
                </div>

                <div className="stimuliControlContainer">
                    <img className="stimuliControlIcon" id="zapTest" src="../images/zapIcon.png" />
                    <div className="stimuliControlSlider" id="sliderZap"></div>
                    <span id="zapIntensity" className="stimuliIntensityDisplay"></span>
                </div>

                <div id="stimuliControlButtonsDiv" className="saveOrResetContainer">
                    <a href="#" id="saveIntensity">Save</a>
                    <a href="#" id="resetIntensity">Reset values</a>
                </div>
            </div>
        </>
    );
}

export default StimuliContainerDiv;