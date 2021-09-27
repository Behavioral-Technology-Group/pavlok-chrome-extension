import React, { useEffect } from 'react';

// import './styles.css';

import logoPavlok from '../../../../public/images/pavlok-logo.png';
import testPairingX from '../../../../public/images/testpairing.png';
import signOutX from '../../../../public/images/signout.png';

import highlightActiveSection from '../../../tools/optionsTools/highlightActiveSection';
import testPairing from '../../../tools/optionsTools/testPairing';
import enableButtons from '../../../tools/optionsTools/enableButtons';
import signOut from '../../../tools/helpersTools/signOut';
import enableAutoZapper from '../../../tools/optionsTools/enableAutoZapper';

highlightActiveSection();
enableButtons();
enableAutoZapper();

// useEffect(() => {
//     // enableButtons();
// }, []);


function scrollToLink(e) {
    let targetId = e.target.id;
    targetId = targetId.split("@")[1];
    targetId = "#" + targetId;

    let offset = document.querySelector(targetId).offsetTop;
    const headerSize = document.getElementById('fixedHeader').scrollHeight;

    let offsetTotal = offset - headerSize;

    scroll({
        top: offsetTotal,
        behavior: "smooth"
    });
}


const FixedHeader = () => {
    return (
        <>
            <div className="headerContainer">
                <div id="topHeader" className="flexContainer space-between header">
                    <div id="logoDiv" className="flexItem">
                        <img src={logoPavlok} />
                    </div>
                    <div id="likeDiv" className="flexItem">
                        <span id="coolSpan"><i className="fa fa-thumbs-o-up"></i> </span>
                        <span id="likeSpan">
                            <a
                                href="https://chrome.google.com/webstore/detail/pavlok-productivity/hefieeppocndiofffcfpkbfnjcooacib/reviews">
                                Like Pavlok? Rate it!
                            </a>
                        </span>
                    </div>
                </div>
            </div>

            <div className="navBarContainer">
                <div className="navBar">
                    <div id="indexDiv" className="flexContainer space-between">
                        <span className="scrollableLink flexItem" id="@blackListContainerDiv" onClick={scrollToLink} key="0">Blacklist</span>
                        <span className="scrollableLink flexItem" id="@tabNumbersContainerDiv" onClick={scrollToLink} key="1">Set Max Tabs</span>
                        <span className="scrollableLink flexItem" id="@stimuliContainerDiv" onClick={scrollToLink}>Remote Control</span>
                        <span className="scrollableLink flexItem" id="@toDoContainerDiv" onClick={scrollToLink}>To-Do Lists</span>
                        <span className="scrollableLink flexItem" id="@appIntegrationsContainerDiv" onClick={scrollToLink}>App Integrations</span>
                        <span className="scrollableLink flexItem" id="@advancedOptionsContainerDiv" onClick={scrollToLink}>Advanced Options</span>
                        <span className="flexItem">
                            <img id="testPairingX" src={testPairingX} title="Test Pairing" onClick={testPairing} />
                            <img id="signOutX" src={signOutX} title="Sign out" onClick={signOut} />
                        </span>
                    </div>
                </div>
            </div>
        </>
    );
};

export default FixedHeader;