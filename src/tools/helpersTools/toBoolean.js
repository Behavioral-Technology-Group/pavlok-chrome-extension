import log from './log';
import isEmpty from './isEmpty';

function toBoolean(string) {
    try { string = string.toLowerCase() }
    catch (err) { log(err); }

    var bStatus = true;

    if (
        isEmpty(string) ||
        string === "false" ||
        string === false
    ) { bStatus = false; }

    return bStatus
}

export default toBoolean;