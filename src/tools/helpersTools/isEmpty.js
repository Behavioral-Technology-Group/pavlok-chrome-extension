import clearSpaces from './clearSpaces';

function isEmpty(x) {
    var answer;

    if (typeof (x) == "undefined") {
        return true;
    } else if (typeof (x) == "array") {
        switch (x.length) {
            case 0:
                return true;
            case 1:
                if (clearSpaces(x[0]).length === 0) { return true }
                break;
        }
    } else if (typeof (x) == "object") {
        if (Object.keys(x).length === 0) { return true; } // Empty Object
    } else if (x.length === 0) {
        return true;
    } else if (typeof (x) == "string") {
        if (clearSpaces(x).length === 0) { return true }
    } else {
        console.log("function isEmpty has a unexpectable type");
    }
    return false;
}

export default isEmpty;