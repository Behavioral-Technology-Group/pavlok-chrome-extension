import React, { useEffect } from 'react';
import './styles.css';

import startBlackAndWhiteList from '../../../../tools/optionsTools/startBlackAndWhiteList';
import enableBlackDaily from '../../../../tools/optionsTools/enableBlackDaily';
import WhiteListComponent from '../../blackListcomponents/WhiteListComponent';
import initialize from '../../../../tools/optionsTools/initialize';


const BlackListContainerDiv = () => {

    useEffect(() => {
        enableBlackDaily();
        startBlackAndWhiteList();
        initialize();
    }, []);

    return (
        <>
            <div id="blackListContainer">
                <h2 className="sectionTitle">
                    Black List
                    <sup>
                        <span
                            className="helpSpan"
                            title='	<p>Black list allow your Pavlok to zap, vibrate and beep if you visit some site you want to avoid.</p>
                                    <p>For instance: <span className="yellow"><i>"facebook.com"</i></span> might be on your blacklist. If you visit the site, you will get zapped.</p>
                                    <p>For listing sites, type in the address and hit Enter or click Save.</p>'>
                            <b>?</b>
                        </span>
                    </sup>
                </h2>
                <p>
                    Please choose your black sites, minus the "www."
                    (ex:
                    <span className="yellow">
                        facebook.com,
                        reddit.com
                    </span>):
                </p>
                <div id="blackList">
                </div>
            </div>

            <div id="whiteListContainer">
                <h2 className="sectionTitle">
                    Exception List
                    <sup>
                        <span className="helpSpan"
                            title='<p>Exception addresses allow you to use a part of 
                            some site without triggering stimuli.</p><p>For instance:
                            <span className="yellow"><i>"amazon.com"</i></span> might
                            be on your blacklist. But you want to use <span className="yellow">
                            <i>"amazon.com<b>/music</b>"</i></span> without being shocked.
                            </p><p>Just type the address, minus the "www." there, and it 
                            will ignore anything within that address.</p>'>
                            ?
                        </span>
                    </sup>
                </h2>

                <p>Please tell your exceptions for black sites, separated by commas. </p>
                <div className="tagcontainer">
                    <input name="whiteList" id="whiteList" value="" className="pavSetting" />
                    <WhiteListComponent />
                </div>
            </div>
        </>
    );

}

export default BlackListContainerDiv;