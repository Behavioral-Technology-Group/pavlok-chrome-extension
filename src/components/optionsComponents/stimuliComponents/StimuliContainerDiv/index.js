import React, { useEffect } from 'react';
import testBeepInt from '../../../../tools/optionsTools/testBeepInt';
import testVibrationInt from '../../../../tools/optionsTools/testVibrationInt';
import testZapInt from '../../../../tools/optionsTools/testZapInt';
import enableSliders, { resetIntensityOnClick } from '../../../../tools/optionsTools/enableSliders';

function sliderBlock(forStr, imgId, src, clickFunction, divId) {
    return (
        <>
            <label for={forStr}>
                <img
                    className="stimuliControlIcon"
                    id={imgId}
                    src={src}
                    onClick={clickFunction}
                />
            </label>
            <div className="sliderTicksComboContainer">
                <div className="ticks">
                    <span className="big">
                        <span className="bigSub">10%</span>
                    </span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span className="big">
                        <span className="bigSub">50%</span>
                    </span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span className="big">
                        <span className="bigSub">100%</span>
                    </span>
                </div>
                <div className="stimuliControlSlider" id={divId} className="pavSetting"></div>
            </div>
        </>
    );
}

const StimuliContainerDiv = () => {

    useEffect(() => {
        enableSliders();
    }, []);

    return (
        <div id="stimuliContainerDiv">
            {/* <!-- Stimuli --> */}
            <h2 className="sectionTitle">Remote Control</h2>
            <p>Control the intensity of the stimuli. Select increments of 10%</p>
            <hr />
            <div className="stimuliControlContainer">
                {sliderBlock("beepInt", "testBeepInt", "../images/BeepIcon.png", testBeepInt, "sliderBeep")}

                {/* <!-- <span id="beepIntensity" className="stimuliIntensityDisplay noDisplay pavSetting"></span> --> */}
            </div>

            <div className="stimuliControlContainer">
                {sliderBlock("vibrationInt", "testVibrationInt", "../images/vibrateIcon.png", testVibrationInt, "sliderVibration")}

                <span id="vibrationIntensity" className="stimuliIntensityDisplay"></span>
            </div>

            <div className="stimuliControlContainer">
                {sliderBlock("zapInt", "testZapInt", "../images/zapIcon.png", testZapInt, "sliderZap")}

                <span id="zapIntensity" className="stimuliIntensityDisplay"></span>
            </div>

            <div id="stimuliControlButtonsDiv" className="saveOrResetContainer">
                {/* <!-- <a href="#" id="saveIntensity" className="buttonLink">Save</a> --> */}
                <a href="#" id="resetIntensity" onClick={resetIntensityOnClick} className="buttonLink">Reset values</a>
            </div>
        </div>
    );
};

export default StimuliContainerDiv;