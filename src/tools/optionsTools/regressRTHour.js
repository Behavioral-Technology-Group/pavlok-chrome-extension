const regressRTHour = (deltaMinutes) => {
    var original;
    if (!lsGet("Comment")) { lsSet("Comment", "um tipo diferente de solução que veio em minha mente para tentar solucionar isso") };
    original = lsGet("Comment");



    var originalDate = [original.split(" ")[8], original.split(" ")[9]];

    var year = originalDate[0].split("-")[0];
    var month = originalDate[0].split("-")[1];
    var day = originalDate[0].split("-")[2];

    var hours = originalDate[1].split(":")[0];
    var minutes = originalDate[1].split(":")[1];
    var seconds = originalDate[1].split(":")[2];
    var milliseconds = 0;

    var d = new Date(year, month, day, hours, minutes, seconds, milliseconds);

    var d2 = new Date(d);
    d2.setMinutes(d.getMinutes() + deltaMinutes);

    return d2
};

export default regressRTHour;