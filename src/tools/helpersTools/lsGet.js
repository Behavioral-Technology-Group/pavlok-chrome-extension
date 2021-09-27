import log from './log';

const lsGet = (key, parse) => {
    const cleanedKey = key.trim();
    const value = localStorage.getItem(cleanedKey)
    if (value == null) { return undefined };

    if (!parse) { parse = 'string' };
    var returnData = value;

    if (parse == 'parse') {
        try {
            returnData = JSON.parse(returnData)
        }
        catch (err) {
            log("Problem trying to parse " + cleanedKey);
            log(err);
            log(returnData);
        }
    }
    else { returnData = value; }

    return returnData
}

export default lsGet;