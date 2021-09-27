import React from 'react';
import fillDailyList from './fillDailyList';
import listenDailyListClick from './listenDailyListClick';

function enableDaily(){
	fillDailyList();
	listenDailyListClick();
}

export default enableDaily;