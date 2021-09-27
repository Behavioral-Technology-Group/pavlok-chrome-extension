import React, { useState, useEffect } from 'react';
import WhiteListTag from '../WhiteListTag';
import './styles.css';

import lsGet from '../../../../tools/helpersTools/lsGet';
import lsSet from '../../../../tools/helpersTools/lsSet';
import validateTags from '../../../../tools/helpersTools/validateTags';
import notifyUpdate from '../../../../tools/helpersTools/variables/notifyUpdate';
import fixTags from '../../../../tools/helpersTools/fixTags';
import confirmUpdate from '../../../../tools/helpersTools/confirmUpdate';
import msgInterfaces from '../../../../tools/helpersTools/msgInterfaces';

const whiteListFromLs = () => (lsGet("whiteList") || "").split(",");

const persistWhiteList = (list) => {
    const listString = list.toString();
    const newList = validateTags(listString) ? listString : fixTags(list)

    lsSet('whiteList', newList);
    confirmUpdate(notifyUpdate);
    msgInterfaces({ action: "updateBlackList" });
};

const setHiddenInput = (value) => document.querySelector("#whiteList").value = value.join(",");

const WhiteListComponent = () => {
    const previousList = whiteListFromLs();
    const [whiteListSites, setWhiteListSites] = useState(previousList);

    const removeTag = (tagText) => {
        const tagList = whiteListSites.filter(t => t !== tagText);
        resetGraphState(tagList);
    }

    const resetGraphState = (list) => {
        setWhiteListSites(list);
        setHiddenInput(list);
        persistWhiteList(list);
    }

    const maybeHandleSubmit = (event) => keydownHandler(event);
    const keydownHandler = (event) => {
        if (event.keyCode == 13 || event.keyCode == 34) {
            event.preventDefault();
            resetGraphState([...whiteListFromLs(), event.target.value]);
            event.target.value = "";
        }
    };

    return (
        <div className="WLContainer">
            {whiteListSites.map(tagText =>
                <WhiteListTag onDelete={() => removeTag(tagText)} tagText={tagText} />
            )}
            <input
                id="sideTagInput"
                type="text"
                placeholder="Add site... ie: facebook.com/groups/772212156222588/"
                onKeyDown={maybeHandleSubmit}
            />
        </div>
    );
};

export default WhiteListComponent;