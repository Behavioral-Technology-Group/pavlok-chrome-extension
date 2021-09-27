import React from 'react';

const ToDoContainerDiv = () => {
    return (
        <>
            {/* <!-- To-do lists --> */}
            <div>
                <img src="../images/todolist.png" className="pv-tab-header-icon" />
                <span className="pv-tab-header-span">To-do list</span>
            </div>
            <div className="sticky">
                {/* <!-- start todo --> */}
                <div id="toDoDiv" className="Display">
                    <h3>Dailies</h3>
                    <div id="dailyTasks">
                        <table className="dailyContainer">
                            <tbody>
                            </tbody>
                            <tfoot>
                            </tfoot>
                        </table>
                    </div>
                    <div id="toDoAction">
                        <h3>Others</h3>
                        <table id="toDoTable">
                            <thead>
                                <tr id="toDoTableHeader">
                                    <td colspan="5">
                                        <input id="toDoAdd" placeholder="What needs to be done?" />
                                    </td>
                                </tr>
                            </thead>
                            <tbody>
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td id="toDoNItemsLeft" className="noDisplay">1 Item Left</td>
                                    <td id="allToDo" className="toDoScopes">
                                        <a href="#" id="allToDoLink">All</a>
                                    </td>
                                    <td id="todayToDo" className="toDoScopes">
                                        <a href="#" id="todayToDoLink">Today</a>
                                    </td>
                                    <td id="completedToDo" className="toDoScopes">
                                        <a href="#" id="doneToDoLink">Done</a>
                                    </td>
                                    <td id="clearCompletedToDo"><a href="#" id="clearToDoLink">Clear Completed</a></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
                <br />
                <div id="pomodoroFocusDiv" className="noDisplay">
                    <h2><span id="pomoFocusTask"></span></h2>
                    <h3 id="pomoFocusRemainingTimeContainer">Remaining Time:
                        <span id="pomoFocusRemainingTime" className="yellow"></span>
                    </h3>

                    <p>
                        <a href="#" className="noDecoration pomoFocusButtons" id="pomoFocusCompleteTask"
                            title='BOOM! Done!'>
                            <span className="fa-stack fa-lg yellow">
                                <i className="fa fa-check-square-o"></i>
                            </span>
                        </a>
                        <a href="#" className="noDecoration pomoFocusButtons" id="pomoFocusStop"
                            title='Cancel this pomoFocus'>
                            <span className="fa-stack fa-lg yellow">
                                <i className="fa fa-stop-circle-o"></i>
                            </span>
                        </a>
                        <a href="#" className="noDecoration pomoFocusButtons" id="pomoFocus5minutes" title='Add 5 minutes!'>
                            <span className="fa-stack fa-lg yellow">
                                <i className="fa fa-plus"></i>
                            </span>
                        </a>
                    </p>

                    <div className="hyperFocusControlDiv noDisplay">
                        <hr />
                        <h3>Hyper Focus Controls</h3>
                        <p>
                            <span id="playBinauralButton" className="clickable"><i className="fa fa-play-circle-o"></i></span>
                            <span id="stopBinauralButton" className="clickable"><i
                                className="fa fa-stop-circle-o noDisplay"></i></span>
                            <span id="vDownBinaural" className="clickable"><i className="fa fa-volume-down"></i></span>
                            <span id="vUpBinaural" className="clickable"><i className="fa fa-volume-up"></i></span>
                        </p>
                        <p>
                            <input type="checkbox" id="instaZap" />InstaZap on blacklisted sites
                            <img src="images/help.png" className="helpIcon" title='
							            <p>Blacklist will <span class="yellow">instantly Zap you out of
                                        the offending website</span> and every 5 seconds after the initial
                                        zap. No excuses approach to better results!</p>'
                            />
                        </p>

                        <p>
                            <input type="checkbox" id="lockZap" />Lock me in this page
                            <img src="images/help.png" className="helpIcon" title='
                                        <p>You will get hyper focused! If you leave the current site, a zap awaits
                                        you! Say you want to focus on writting a google document. If you leave that
                                        site to <b>any</b> other, you get zapped. But if you change that page for a
                                        new document page, you will not get the zap.</p>
                                        '
                            />
                        </p>
                    </div>
                </div>
                {/* <!-- end todo --> */}
            </div>
        </>
    );
}

export default ToDoContainerDiv;