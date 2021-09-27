import React from 'react';
import zapOncloseOnChange from '../../../../tools/optionsTools/refactorTools/zapOnCloseOnChange';
import { takeGeneralCount } from '../../../../tools/optionsTools/restoreOptions';

const TabNumbersAdvancedDiv = () => {
    return (
        <div id="tabNumbersAdvancedDiv" className="noDisplay">
            <h2>Tab Numbers extras</h2>
            <input type="checkbox" name="zapOnClose" onChange={zapOncloseOnChange} id="zapOnClose" className="pavSetting" />
            Zap when closing
            <sup>
                <span className="helpSpan" title='
                    <p>For those really inclined to stop opening to many habits!</p>
                    <p>This will send a zap whenever you are above your tab limit, <b><span className="yellow">EVEN IF YOU ARE CLOSING EXCESS TABS</span></b>. You will sure think about opening more tabs after that!</p>
                    <p>If not checked, you will only get zaps when opening tabs above the your limit.</p>
                '>
                    <b>?</b>
                </span>
            </sup>
            <p>
                Count tabs on
                <select id="allTabsCountSelect" onChange={takeGeneralCount} className="pavSetting">
                    <option value="allWindows">ALL windows</option>
                    <option value="activeWindow">CURRENT Window</option>
                </select>
                <sup>
                    <span className="helpSpan" title='
										<p>This option makes the Extension count either the tabs on the window you are working or on all windows open!</p>
										<p><b><span className="yellow">If you want to strike the too many tabs habit just like that, select ALL windows</span></b> and it will count all tabs open on all windows, no exceptions. So, if you have a limit of 10 tabs, and find you self browsing on a window with 4 tabs, but have another with 8 tabs, <b><span className="yellow">YOU WILL GET ZAPPED because the total tabs is over your limit</span></b>. You will sure think about opening more tabs after that!</p>
										<p>If not checked, Chrome will only work on your current window. In the same example above, <b><span className="yellow">YOU WILL NOT GET ZAPPED</span></b>, as your current window will have either 4 or 8 tabs, both under the limit.</p>
										'>
                        <b>?</b>
                    </span>
                </sup>
            </p>
            <hr />
        </div>
    );
};

export default TabNumbersAdvancedDiv;