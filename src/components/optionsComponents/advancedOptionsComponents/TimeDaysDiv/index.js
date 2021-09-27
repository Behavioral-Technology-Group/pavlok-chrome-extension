import React from 'react';
import {
    sundayActive,
    mondayActive,
    tuesdayActive,
    wednesdayActive,
    thursdayActive,
    fridayActive,
    saturdayActive
} from '../../../../tools/optionsTools/enableCheckboxes'
import GeneralActiveHours from '../GeneralActiveHours';

const TimeDaysDiv = () => {
    return (
        <div id="timeDaysDiv" className="Display">
            <h2>
                Conform it to your schedule
                <sup>
                    <span className="helpSpan" title='<p>
                            Pavlok will only work in the days you checked and while you are between the start and end times.
                        </p>
                        <p>
                            For instance: you set a 9-to-5 (check weekdays and put <span className="yellow"><i>Start at 09:00</i></span> and <span className="yellow"><i>End at 17:00</i></span>. If you visit some blocked site (say, Facebook) at 10:30, you will get notifications and a zap, just as you would expect.
                        </p>
                        <p>
                            If you happen  to get to Facebook by 08:00, there will be nothing going on from Pavlok for you.
                        </p>
                        <p>
                            You can know if Pavlok is sleeping checking the icon. If <span className="yellow">Pavlok is sleeping, there will be a "zzz" instead of the tabs count</span>.
                        </p>'
                    >
                        <b>?</b>
                    </span>
                </sup>
            </h2>
            <p>Select days and hours for Pavlok to help you focus</p>
            <div id="daysOfTheWeekDiv" className="60percent flexContainer space-between">
                <div>
                    <input type="checkbox" id="sundayActive" onChange={sundayActive} className="activeDay pavSetting" />
                    <span><label for="sundayActive">Sun</label></span>
                </div>
                <div>
                    <input type="checkbox" id="mondayActive" onChange={mondayActive} className="activeDay pavSetting" />
                    <span><label for="mondayActive">Mon</label></span>
                </div>
                <div>
                    <input type="checkbox" id="tuesdayActive" onChange={tuesdayActive} className="activeDay pavSetting" />
                    <span><label for="tuesdayActive">Tues</label></span>
                </div>
                <div>
                    <input type="checkbox" id="wednesdayActive" onChange={wednesdayActive} className="activeDay pavSetting" />
                    <span><label for="wednesdayActive">Wed</label></span>
                </div>
                <div>
                    <input type="checkbox" id="thursdayActive" onChange={thursdayActive} className="activeDay pavSetting" />
                    <span><label for="thursdayActive">Thu</label></span>
                </div>
                <div>
                    <input type="checkbox" id="fridayActive" onChange={fridayActive} className="activeDay pavSetting" />
                    <span><label for="fridayActive">Fri</label></span>
                </div>
                <div>
                    <input type="checkbox" id="saturdayActive" onChange={saturdayActive} className="activeDay pavSetting" />
                    <span><label for="saturdayActive">Sat</label></span>
                </div>
            </div>
            <GeneralActiveHours />
            <hr />
        </div>
    );
}

export default TimeDaysDiv;