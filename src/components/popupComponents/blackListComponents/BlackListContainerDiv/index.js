import React from 'react';

const BlackListContainerDiv = () => {
    return (
        <>

            <div>
                <img src="../images/blacklist(icon).png" className="pv-tab-header-icon" />
                <span className="pv-tab-header-span">Blacklist</span>
            </div>
            <div>
                <h2>Black List
                    <sup>
                        <span className="helpSpan" title='	<p>Black list allow your Pavlok to zap, vibrate and beep if you visit some site you want to avoid.</p>
						<p>For instance: <span class="yellow"><i>"facebook.com"</i></span> might be on your blacklist. If you visit the site, you will get zapped.</p>
						<p>For listing sites, type in the address and hit Enter or click Save.</p>'>
                            <b>?</b>
                        </span>
                    </sup>

                </h2>
                <div id="blackList">
                </div>

                <h2>Exception List
                    <sup>
                        <span className="helpSpan"
                            title='<p>Exception addresses allow you to use a part of some site without triggering stimuli.</p><p>For instance: <span class="yellow"><i>"amazon.com"</i></span> might be on your blacklist. But you want to use <span class="yellow"><i>"amazon.com<b>/music</b>"</i></span> without being shocked.</p><p>Just type the address, minus the "www." there, and it will ignore anything within that address.</p>'>
                            ?
                        </span>
                    </sup>
                </h2>
                <div className="tagcontainer">
                    <input name="whiteList" id="whiteList" value="" />
                </div>
            </div>
        </>
    );
}

export default BlackListContainerDiv;