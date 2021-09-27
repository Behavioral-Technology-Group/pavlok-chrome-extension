import React from 'react';

const TodoistContainerDiv = () => {
    return (
        <div id="todoistContainerDiv">
            <h2 className="sectionTitle">Sync your tasks with Todoist
								<sup><span className="helpSpan" title='<p>Todoist is a popular Task management app. It can now get super powers syncing with Pavlok!</p>
										'>
                    <b>?</b>
                </span></sup>
            </h2>
            <div id="offTodoist">
                <p>Todoist will require you to login and to allow Pavlok to manage your tasks.</p>
                <p>
                    To do so, just click the icon
                                    <img
                        id="todoistLogin"
                        className="clickAction todoistLogo"
                        src="images/Todoist_logo.png"
                        alt="todoist"
                    />
                    {/* </a> */}
                </p>
            </div>
            <div id="onTodoist">
                <p>
                    <img className="clickAction todoistLogo" src="images/Todoist_logo.png" alt="todoist" />
                                    is active.
                                </p>
                <p><a href="#" id="importTodoist" className="clickAction">Import your tasks</a></p>
                <p><a href="#" id="signOutTodoist">Unplug todoist</a></p>
            </div>
        </div>
    );

}

export default TodoistContainerDiv;