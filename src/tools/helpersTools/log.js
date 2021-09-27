function log(msg) {
    try {
        if (JSON.parse(lsGet("verbose"))) { console.log(msg); }
    }
    catch (err) { }
}

export default log;