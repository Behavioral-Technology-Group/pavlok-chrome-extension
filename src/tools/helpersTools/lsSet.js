const lsSet = (key, data, dataType) => {
    if (!dataType) { dataType = 'string'; }
    var returnData;
    if (dataType == 'object') {
        returnData = JSON.stringify(data);
    }
    else { returnData = data; }

    return localStorage.setItem(key, returnData);
}

export default lsSet;