import React from 'react';

const AutoZapperContainerDiv = () => {
    return (
        <div id="autoZapperContainerDiv">
            {/* <!-- AutoZapper --> */}
            <h2 class="sectionTitle">Free up your hands!</h2>
            <p>AutoZapper will get your through training sessions with using but a few clicks.</p>
            <p>Here is how it works:</p>
            <ol>
                <li>
                    Set the
					<span class="yellow">intensity of the zap
						<sup>
                            <span class="helpSpan"
                                title='
                                        <p>This intensity only works for this training session, having no impact on the zap intensity of regular functioning.</p>
                                        <p>We still advise you test the intensity on the Stimuli Tab. After a few zaps, you can get a tad more sensitive, so start a little below your usual and give it a try. If it feels weak at the end of the session, up it in the next one.</p>
                                        <p>Also, be aware that <span class="yellow">popups will not show even if you enabled them</span>. That is how we will keep the flow, so you do not need to click anything.</p>'>
                                <b>?</b>
                            </span>
                        </sup>
                    </span>
                </li>
                <li>Set the <span class="yellow">duration</span> of your session</li>
                <li id="puHook3">Set the <span class="yellow">frequency</span> for the zap to come</li>
                <li id="puHook4">Get whatever you need (cigarettes, junk food, random sites, etc)</li>
                <li id="puHook5">Brace yourself and rock on the go button</li>
            </ol>

            <table id="autoZapperTable">
                <thead>
                    <th>Intensity</th>
                    <th>Duration</th>
                    <th>Frequency</th>
                    <th>Now we...</th>
                </thead>
                <tbody>
                    <tr id="autoZapperStartLine">
                        <td>
                            <p>
                                <input id="autoZapperIntensity" class="50px" />
                                <span class="yellowX"><b>%</b></span>
                            </p>
                        </td>

                        <td>
                            <p class="autoZapperConf">
                                <input id="autoZapperDuration" class="50px" />
                                <span class="yellowX"><b>Mins.</b></span>
                            </p>

                            <p class="autoZapperActive noDisplay">
                                <b><span class="yellow" id="countDownTraining"></span></b>
                            </p>
                        </td>
                        <td>
                            <p>
                                <input id="autoZapperFrequency" class="50px" />
                                <span class="yellowX"><b>Secs.</b></span></p>
                        </td>
                        <td>
                            <p class="autoZapperConf">
                                <a
                                    id="autoZapperStart"
                                    href="#appIntegrationsContainerDiv"
                                    class="buttonLink">
                                    <b>GO!</b>
                                </a>
                            </p>
                            <p class="autoZapperActive noDisplay">
                                <a
                                    id="autoZapperStop"
                                    href="#appIntegrationsContainerDiv"
                                    class="buttonLink">
                                    <b>Stop!</b>
                                </a>
                            </p>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );

};

export default AutoZapperContainerDiv;