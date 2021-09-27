import log from './log';

function fixTags(problems) {
    let list = [];

    list = problems.map((element) => urlSplitter(element, "https://"));
    list = list.map((element) => urlSplitter(element, "http://"));
    list = list.map((element) => urlSplitter(element, "www."));

    return list;
}

export default fixTags;

//------------------------------------------------------------------------------------------

function urlSplitter(url, split) {
    var val;
    url.indexOf(split) == 0 ? val = url.split(split)[1] : val = url

    log(url + "\n" + val);
    return val;
}