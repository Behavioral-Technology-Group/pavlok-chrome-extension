import React from 'react';
import {
    notifyBeepOnChange,
    notifyVibrationOnChange,
    notifyZapOnChange
} from '../../../../tools/optionsTools/refactorTools/NotificationStimuli';

const StimuliNotificationsDiv = () => {
    return (
        <div id="stimuliNotificationsDiv" className="noDisplay">
            <div id="reallySpecificControls">
                <h2>
                    Stimuli Notifications
                    <sup>
                        <span className="helpSpan" title='
										<p>
											You might find too many popups before stimuli annoying and want to turn it off. Totally ok!
										</p>
										<p>
											We advise you <span className="yellow"><i>keep at least the Zap popup active</i></span>, as it will help you understand better why you get that zap. Being more conscious about it, you will be better off tackling the habit changes.
										</p>
										<p>
											Note that you will only get the popup notifications checked here.
										</p>
									'>
                            <b>?</b>
                        </span>
                    </sup>
                </h2>
                <p> Check the ones you wish to keep.</p>
                <table>
                    <tr>
                        <td>

                            <p>
                                <input type="checkbox" id="notifyZap" onChange={notifyZapOnChange} className="pavSetting" />
                                Zap
                            </p>
                        </td>
                        <td>
                            <p>
                                <input type="checkbox" id="notifyVibration" onChange={notifyVibrationOnChange} className="pavSetting" />
                                <label name="notifyZap">Vibration</label>
                            </p>
                        </td>
                        <td>
                            <p>
                                <input type="checkbox" id="notifyBeep" onChange={notifyBeepOnChange} className="pavSetting" />
                                <label name="notifyZap">Beep</label>
                            </p>
                        </td>
                    </tr>
                </table>
                <br />
            </div>
            <hr />
        </div>
    );
}

export default StimuliNotificationsDiv;