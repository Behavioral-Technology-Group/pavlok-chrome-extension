import React from 'react';

const PavCoach = () => {
    return (
        <div id="pavCoach">
            <h2>Have your very own productivity coach
                    <sup>
                    <span className="helpSpan" title='<p>
                        Pavlok will both remind you and break down your tasks, inviting you to take pomodoros on your todo list. But it will also tell you when to take a break!
                        </p>
                    '>
                        <b>?</b>
                    </span>
                </sup>
            </h2>
            <p>
                <input type="checkbox" id="coachPower" />
                    Check to turn it on or off
                </p>
        </div>
    );
}

export default PavCoach;