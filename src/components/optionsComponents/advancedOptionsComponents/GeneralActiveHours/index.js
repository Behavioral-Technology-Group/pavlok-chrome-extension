import React, { useEffect, useState } from 'react';
import lsGet from '../../../../tools/helpersTools/lsGet';
import TimeSpinnerStart from '../TimeSpinnerStart';
import TimeSpinnerEnd from '../TimeSpinnerEnd';
import './styles.css';

const GeneralActiveHours = () => {
    const [timeFormat, setTimeFormat] = useState(lsGet('timeFormat'));

    function timeFormatChanger(event) {
        setTimeFormat(Object.values(event)[3].target.value);
    }

    return (
        <div id="generalActiveHours" className="flexContainer space-between">
            <div className="flexItem">
                <select id="timeFormat" onChange={(event) => timeFormatChanger(event)} className="pavSetting">
                    <option value="12">AM/PM</option>
                    <option value="24">24H</option>
                </select>
            </div>
            <div className="flexItem">
                <span className="spinnerText">
                    <label>Start</label>

                    <TimeSpinnerStart
                        timeFormat={timeFormat}
                    />
                </span>
            </div>
            <div className="flexItem">
                <span className="spinnerText">
                    <label>End</label>

                    <TimeSpinnerEnd
                        timeFormat={timeFormat}
                    />
                </span>
            </div>
            <hr />
        </div>
    );
}
export default GeneralActiveHours;