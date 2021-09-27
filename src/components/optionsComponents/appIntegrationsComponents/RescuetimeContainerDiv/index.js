import React, { useEffect } from 'react';

import enableRescueTime from '../../../../tools/optionsTools/enableRescueTime';
import RTDisconectAPI from '../../../../tools/optionsTools/refactorTools/RTdisconectAPI';
import RTFrequencySwitcher from '../../../../tools/optionsTools/refactorTools/RTFrequencySwitcher';
import RTSelectOnOff from '../../../../tools/optionsTools/refactorTools/RTSelectOnOff';
import RTtoggleVisibility from '../../../../tools/optionsTools/refactorTools/RTtoggleVisibility';

const RescuetimeContainerDiv = () => {
    useEffect(() => {
        enableRescueTime();
    }, []);

    return (
        < div id="rescuetimeContainerDiv" >
            {/* <!-- RescueTime --> */}
            < h2 className="sectionTitle" > Get help from RescueTime
                < sup > <span className="helpSpan"
                    title='<p>RescueTime can help you classify activities you take on your computer. Then, they generate a score for your actions, called <i>productivity pulse</i></p>
							p>Pavlok will make notifications visceral!</p>
                            <ul>
                                <li>If your productivity falls <b>below 30%</b>, you get a <span className="yellow">zap</span> to get back to the present</li>
                                <li>If your productivity falls <b>bellow 50%</b>, you get a <span className="yellow">beep</span> reminder to focus again</li>
                                <li>If your productivity goes <b>above 80%</b>, you get nice pat on your bac... I mean, wrist! <span className="yellow">Pavlok will vibrate</span> for a good massage! Good job, you are going strong!</li>
                            </ul>
                            <p>The limits and stimulus for fired can be changed in the <span className="yellow">Define your Thresholds</span> section</p>'>
                    <b>?</b>
                </span></sup >
            </h2 >
            <div id="NoRTCodeOnly">
                <p>Let's get your ball rolling!</p>
                <ol>
                    <li>Get your Api Key for Pavlok <a target="_blank"
                        href="https://www.rescuetime.com/anapi/get_api_key_for/pavlok">here</a>:
                    </li>
                    <li>Then insert your Key here and click GO!
                        <p>
                            <input id="rescueTimeAPIKey" />
                            <input type="button" id="fireRTIntegration" value="Go!" onClick={RTtoggleVisibility} />
                        </p>
                    </li>
                    <li>That's it! Enjoy!</li>
                </ol>
            </div>
            <div id="RTCodeOnly">
                <div id="RTResultDiv">
                    <p>
                        <span id="RTResultsHolder">Gathering data... </span>
                    </p>
                </div>
                <div id="RTConfiguration">
                    <table>
                        <tr>
                            <td>
                                <p>Integration is:</p>
                            </td>
                            <td>
                                <select id="RTOnOffSelect" onChange={RTSelectOnOff} className="pavSetting">
                                    <option value="On">On</option>
                                    <option value="Off">Off</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <p>Updates Frequency:</p>
                            </td>
                            <td>
                                <p>
                                    <select id="RTFrequencySelect" onChange={RTFrequencySwitcher} className="pavSetting">
                                        <option value="3">3</option>
                                        <option value="5">5</option>
                                        <option value="10">10</option>
                                        <option value="15">15</option>
                                        <option value="30">30</option>
                                    </select>
                                    Minutes

                                    <sup>
                                        <span className="helpSpan" title='
                                            <p>Pavlok will get your productivity according to the inverval you set.</p>
                                            <p><b>There are differences in the frequency you will get an updated pulse from RescueTime</b>. <span className="yellow">Paid accounts</span> can get it updated every 3 minutes, while <span className="yellow">free accounts</span> get it updated every 15 minutes.</p>
                                            <p>For instance: if you have a <b>free account</b> on RescueTime and set the update frequency here to every five minutes, you will get the same score 3 times (after 5, 10 and 15 minutes).</p>
                                            <p><b>We advise <span className="yellow">Free RescueTime accounts</span> to keep update frequency in <span className="yellow">15 or 30 minutes option</span> for reliability.</b></p>
										'>
                                            <b>?</b>
                                        </span>
                                    </sup>
                                </p>
                            </td>
                        </tr>
                    </table>
                    <div>
                        <hr />
                        <h3>Define your Thresholds</h3>
                        <table id="RTThresholdTable">
                            <tr>
                                <th>Stimulus</th>
                                <th>Threshold</th>
                                <th>Triggers</th>
                            </tr>
                            <tr id="RTPosTR">
                                <td>
                                    <p>Positive</p>
                                </td>
                                <td>
                                    <p>
                                        Above
                                        <input
                                            id="RTPosLimit"
                                            className="RTThreshold pavSetting"
                                        />
                                    </p>
                                </td>
                                <td>
                                    <select id="RTPosSti" className="pavSetting">
                                        <option value="shock">Zap</option>
                                        <option value="vibration">Vibrate</option>
                                        <option value="beep">Beep</option>
                                    </select>
                                </td>
                            </tr>
                            <tr id="RTWarnTR">
                                <td>
                                    <p>Warning</p>
                                </td>
                                <td>
                                    <p>
                                        Below
                                        <input
                                            id="RTWarnLimit"
                                            className="RTThreshold pavSetting"
                                        />
                                    </p>
                                </td>
                                <td>
                                    <select id="RTWarnSti" className="pavSetting">
                                        <option value="shock">Zap</option>
                                        <option value="vibration">Vibrate</option>
                                        <option value="beep">Beep</option>
                                    </select>
                                </td>
                            </tr>
                            <tr id="RTNegTR">
                                <td>
                                    <p>Negative</p>
                                </td>
                                <td>
                                    <p>
                                        Below
                                        <input
                                            id="RTNegLimit"
                                            className="RTThreshold pavSetting"
                                        />
                                    </p>
                                </td>
                                <td>
                                    <select id="RTNegSti" className="pavSetting">
                                        <option value="shock">Zap</option>
                                        <option value="vibration">Vibrate</option>
                                        <option value="beep">Beep</option>
                                    </select>
                                </td>
                            </tr>
                        </table>

                        <div className="noDisplay" id="miniChart">
                            <div id="badRT" className="miniChartDiv">Negative</div>
                            <div id="warnRT" className="miniChartDiv">Warning</div>
                            <div id="notifyRT" className="miniChartDiv">Neutral</div>
                            <div id="goodRT" className="miniChartDiv">Positive</div>
                        </div>
                    </div>
                </div>
                <hr />
                <div id="RTAPIKeyDiv">
                    <p>Your API Key is:
                        <b>
                            <span id="RTAPIKeySpan"></span>
                        </b>
                    </p>
                    <p>
                        <input type="button" value="Disconnect from RescueTime?" id="removeRTAPIKey" onClick={RTDisconectAPI} />
                        <sup>
                            <span className="helpSpan" title='
                                <p>By continuing, your Pavlok will disconnect from RescueTime. But are you sure you want to do that?</p>
                                <p>Have you been noticing that you receive beeps when you are being unproductive, and vibrations when you are being very productive?</p>
                                <p>Keeping this integration will help you become a productive, healthy individual. Are you sure you want to disconnect Pavlok from RescueTime?</p>
							'>
                                <b>?</b>
                            </span>
                        </sup>
                    </p>
                </div>
            </div>
        </div >
    );
};

export default RescuetimeContainerDiv;