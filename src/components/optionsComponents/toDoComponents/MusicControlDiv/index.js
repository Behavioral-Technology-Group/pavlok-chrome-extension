import React from 'react';

const MusicControlDiv = () => {
    return (
        <div id="musicControlDiv" className="noDisplay">
            <h2>Pomodoro on Steroids</h2>
            <p>
                You can turbocharge your Hyper Focus time on Pomodoros.
                Here are a few options for you:
            </p>
            <p>
                <input type="checkbox" id="instaZap" />
                Instant Zap on blacklisted sites
                <sup>
                    <span className="helpSpan" title='help text'>
                        <b>?</b>
                    </span>
                </sup>
                <img
                    src="images/help.png"
                    className="helpIcon"
                    title='<p>Blacklist will <span className="yellow">instantly Zap 
                            you out of the offending website</span> and every 5 seconds 
                            after the initial zap. No excuses approach to better results!</p>'
                />
            </p>
            <p>
                <input type="checkbox" id="audioFocus" />
                Binaural Soundtrack
                <sup>
                    <span className="helpSpan" title='help text'>
                        <b>?</b>
                    </span>
                </sup>
                <img
                    src="images/help.png"
                    className="helpIcon"
                    title='<p>A <span className="yellow">concentration inducing soundtrack
                            </span> will play as long as your Pomodoro is ticking.</p>'
                />
            </p>
        </div>
    );
}

export default MusicControlDiv;