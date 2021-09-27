function clearSpaces(string) {
    var x = string;

    x = x.replace(/\s/g, "");
    x = x.replace(" ", "");
    x = x.replace(/\t/g, "");
    x = x.replace(/\n/g, "");
    x = x.replace(/\r/g, "");

    return x;
}

export default clearSpaces;