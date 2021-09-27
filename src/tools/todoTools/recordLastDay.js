import React from 'react';

const recordLastDay = () => {
    if (!lsGet("lastDay")) { lsSet("lastDay", new Date().toDateString()) }
}

export default recordLastDay;