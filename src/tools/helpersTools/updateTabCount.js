import UpdateBadgeOnOff from './updateBadgeOnOff';


function UpdateTabCount(tabCount) {
    const text = lsGet("tabNumbersActive") === "true" ? `${tabCount}/${lsGet("maxTabs")}` : `${tabCount}`

    UpdateBadgeOnOff(text);
}

export default UpdateTabCount;

