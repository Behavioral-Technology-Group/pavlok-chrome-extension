function validateTags(list) {
    var tags;
    var problems = [];

    if (list == "") { tags = []; }
    else { tags = list.split(','); }

    if (tags.length > 0) {
        for (let t = 0; t < tags.length; t++) {
            let curTag = tags[t];
            var www = curTag.indexOf("www.") != -1;
            var http = curTag.indexOf("http:") != -1;
            var https = curTag.indexOf("https:") != -1;

            var notOk = (www || http || https);

            if (notOk == true) { problems.push(curTag); }
        }
    }

    if (problems.length > 0) {
        return false
    }
    return true

}

export default validateTags;