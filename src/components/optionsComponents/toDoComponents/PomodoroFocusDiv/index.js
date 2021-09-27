import React from 'react';

const PomodoroFocusDiv = () => {
    return (
        <div id="pomodoroFocusDiv" className="noDisplay">
            <h2><span id="pomoFocusTask"></span></h2>
            <h3 id="pomoFocusRemainingTimeContainer">
                Remaining Time:
                    <span id="pomoFocusRemainingTime" className="yellow"></span>
            </h3>

            <p>
                <a
                    href="#"
                    className="noDecoration pomoFocusButtons buttonLink"
                    id="pomoFocusCompleteTask"
                    title='BOOM! Done!'>
                    <span className="fa-stack fa-lg yellow">
                        <i className="fa fa-check-square-o"></i>
                    </span>
                </a>
                <a
                    href="#"
                    className="noDecoration pomoFocusButtons buttonLink"
                    id="pomoFocusStop"
                    title='Cancel this pomoFocus'>
                    <span className="fa-stack fa-lg yellow">
                        <i className="fa fa-stop-circle-o"></i>
                    </span>
                </a>
                <a
                    href="#"
                    className="noDecoration pomoFocusButtons  buttonLink"
                    id="pomoFocus5minutes"
                    title='Add 5 minutes!'>
                    <span className="fa-stack fa-lg yellow">
                        <i className="fa fa-plus"></i>
                    </span>
                </a>
            </p>
        </div>

    );
}

export default PomodoroFocusDiv;