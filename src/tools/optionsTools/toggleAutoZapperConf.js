function toggleAutoZapperConf(toState) {
    if (toState == "configure") {
        $(".autoZapperConf").removeClass("noDisplay");
        $(".autoZapperActive").addClass("noDisplay");

    }
    else if (toState == "train") {
        $(".autoZapperActive").removeClass("noDisplay");
        $(".autoZapperConf").addClass("noDisplay");
    }
}

export default toggleAutoZapperConf;