function msgInterfaces(msg) {
    msg.target = "popup";
    chrome.runtime.sendMessage(msg);
    msg.target = "options";
    chrome.runtime.sendMessage(msg);
}

export default msgInterfaces;