import React, { useEffect } from 'react';
import fillDailyList from '../../../../tools/optionsTools/fillDailyList';
import listenDailyListClick from '../../../../tools/optionsTools/listenDailyListClick';
import MusicControlDiv from '../MusicControlDiv';
import PomodoroFocusDiv from '../PomodoroFocusDiv';
import ToDoDiv from '../ToDoDiv';

const ToDoContainerDiv = () => {

    useEffect(() => {
        listenDailyListClick();
        fillDailyList();
    }, []);

    return (
        <div id="toDoContainerDiv">
            {/* <!-- To-Do --> */}
            <ToDoDiv />
            <br />
            <MusicControlDiv />
            <PomodoroFocusDiv />
        </div>
    );
}

export default ToDoContainerDiv;