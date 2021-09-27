import React, { useEffect, useState } from 'react';
import lsGet from '../../../../tools/helpersTools/lsGet';
import lsSet from '../../../../tools/helpersTools/lsSet';
import './styles.css';

const TimeSpinnerEnd = (props) => {
    const timeFormat = props.timeFormat;
    const timeUse = 'End';
    const [time, setTime] = useState(lsGet(`generalActiveTime${timeUse}`));

    var timeSuffix;
    var hour;
    var minutes;
    var parsedHour;
    var parsedMinutes;
    var colonPosition;

    useEffect(() => {
        stringTimeParser(time);
    });

    useEffect(() => {
        parsedMinutes = minutesFormatter(parsedMinutes);
    }, []);

    useEffect(() => {
        switch (timeFormat) {
            case "12":
                if (parsedHour > 23) {
                    console.error("valor de tempo incompatível: " + parsedHour);

                    parsedHour = 0;
                }
                if (parsedHour > 11) {
                    parsedHour -= 12;
                    timeSuffix = "PM";
                } else {
                    if (timeSuffix == "pm" || timeSuffix == "Pm" || timeSuffix == "PM") {
                        timeSuffix = "PM";
                    } else {
                        timeSuffix = "AM";
                    }
                }
                lsSet('timeFormat', 12);
                lsSet('timeSuffix', timeSuffix);
                parsedMinutes = minutesFormatter(parsedMinutes);
                setTime(`${parsedHour}:${parsedMinutes} ${timeSuffix}`);
                break;
            case "24":
                if (timeSuffix == "pm" || timeSuffix == "PM" || timeSuffix == "Pm") { parsedHour += 12; }
                timeSuffix = "";
                lsSet('timeFormat', 24);
                parsedMinutes = minutesFormatter(parsedMinutes);
                setTime(`${parsedHour}:${parsedMinutes} ${timeSuffix}`);

                break;
            default:
                timeSuffix = lsGet('timeSuffix');
                parsedMinutes = minutesFormatter(parsedMinutes);
                setTime(`${parsedHour}:${parsedMinutes} ${timeSuffix}`);
        }
    }, [timeFormat]);

    function suffixToggler() {
        if (timeSuffix == "pm" || timeSuffix == "PM" || timeSuffix == "Pm") {
            timeSuffix = "AM";
        } else if (timeSuffix == "am" || timeSuffix == "AM" || timeSuffix == "Am") {
            timeSuffix = "PM";
        }
    }

    function minutesFormatter(minutes) {
        if (minutes == 0) { minutes = "00" };

        return minutes;
    }

    function timePersister() {

        if (parsedMinutes == 0) {
            setTime(`${parsedHour}:00 ${timeSuffix}`);

            setTime((state) => {
                lsSet(`generalActiveTime${timeUse}`, state);
                return state;
            });

        } else {
            setTime(`${parsedHour}:${parsedMinutes} ${timeSuffix}`);

            setTime((state) => {
                lsSet(`generalActiveTime${timeUse}`, state);
                return state;
            });
        }
    }

    function stringTimeParser(time) {
        colonPosition = time.indexOf(":");

        if (colonPosition == -1) {
            return console.log("not a valid time string.");
        } else {
            timeSuffix = time.slice(-2);
            if (!isNaN(timeSuffix)) { timeSuffix = ""; }

            hour = time.slice(colonPosition - 2, colonPosition);
            if (hour === "") { hour = time.slice(colonPosition - 1, colonPosition); }

            minutes = time.slice(colonPosition + 1, colonPosition + 3);

            parsedHour = Number(hour);
            parsedMinutes = Number(minutes);
        }
    }

    function takeTypedValue(code) {
        if (code == "Enter") {
            let value = document.querySelector("#inputTimeSpinnerEnd").value;
            let hasColon = (value.indexOf(":") == -1) ? false : true;

            if (hasColon == false) {
                console.error("not a valid time string.");
                return;
            } else {
                stringTimeParser(value);
                timePersister();
            }
        }
    }

    const add = () => {
        parsedMinutes += 15;

        if (parsedMinutes > 59) {
            parsedHour += 1;
            parsedMinutes -= 60;
        }
        if (parsedHour > 23 && timeFormat == '24') { parsedHour = 0 }
        //--------
        if (parsedHour > 11 && timeFormat == '12') {
            parsedHour = 0;

            suffixToggler();
        }
        //---------
        timePersister()
    }

    const sub = () => {
        parsedMinutes -= 15;

        if (parsedMinutes < 0) {
            parsedHour -= 1;
            parsedMinutes += 60;
        }
        if (parsedHour < 0 && timeFormat == '24') {
            parsedHour = 23;
            parsedMinutes = 45;
        }
        //--------
        if (parsedHour < 0 && timeFormat == '12') {
            parsedHour = 11;
            parsedMinutes = 45;

            suffixToggler();
        }
        //--------
        timePersister()
    }

    return (
        <div className="timeSpinner">
            <input
                id="inputTimeSpinnerEnd"
                type="text"
                className="timeSpinner__display"
                value={time}
                onChange={(e) => { setTime(e.target.value) }}
                onKeyDown={(event) => { takeTypedValue(event.key) }}
            />
            <div className="timeSpinner__buttonBox">
                <button className="timeSpinner__buttonBox__up" onClick={add}>{'\u25B2'}</button>
                <button className="timeSpinner__buttonBox__down" onClick={sub}>{'\u25bc'}</button>
            </div>
        </div>
    );
}

export default TimeSpinnerEnd;