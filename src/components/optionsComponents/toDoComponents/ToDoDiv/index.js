import React from 'react';
import { createNewDailyTaskButtonClick } from '../../../../tools/optionsTools/listenDailyListClick';

const ToDoDiv = () => {
    return (

        <div id="toDoDiv" className="nooDisplay">
            <h2 className="sectionTitle">Your To-do List</h2>
            <p>
                Your list can be seen and acted upon clicking in the extension icon, which is always a
                click away from you. It is divided in regular <span className="yellow">regular</span> and
                <span className="yellow">daily</span> tasks.
            </p>
            <p>
                Regular tasks are just what you're used to: a list task to be dealt and BOOM, done.
                Dailies differ a bit.
            </p>

            <h3>Dailies</h3>
            <div id="dailiesDiv">
                <p>
                    Dailies are actions that you want to repeat, such as creating habits. They can get
                    you organized with things you need to do on a recurring basis. Also, we add a layer
                    of Pomodoro here, so that you can skyrocket your productivity and habits formation
                </p>
                <hr />
                <div id="dailiesListDiv">
                    <table id="dailyListTable" className="toDoTable pavSetting">
                        <thead>
                            <tr>
                                <td colspan="3" id="newDailyTaskTD">
                                    <div className="flexContainer space-between">
                                        <input
                                            type="text"
                                            id="newDailyTaskInput"
                                            placeholder="Enter a new daily task"
                                            className="flexItem"
                                        />
                                        <input
                                            type="button"
                                            id="createNewDailyTaskButton"
                                            value="Create"
                                            className="flexItem clickAction"
                                            onClick={createNewDailyTaskButtonClick}
                                        />
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th>Daily Task</th>
                                <th>Pomodoros</th>
                                <th>Special Lists</th>
                            </tr>
                        </thead>
                        <tbody>
                        </tbody>
                    </table>
                    <br />
                </div>
            </div>
        </div>
    );
}

export default ToDoDiv;