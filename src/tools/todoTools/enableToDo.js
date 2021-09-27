import React from 'react';
import testTodo from './testTodo';
import pavPomo from './pavPomo';

function enableToDo() {
    testTodo.frontend.addTaskListener();
    testTodo.frontend.doneCheckListener();
    testTodo.frontend.removeTaskListener();
    testTodo.frontend.tagTodayListener();
    testTodo.frontend.clearCompletedListener();
    testTodo.frontend.restoreTasks();

    pavPomo.frontend.startPomoListener();
    pavPomo.frontend.enablePomoButtons();

};

export default enableToDo;