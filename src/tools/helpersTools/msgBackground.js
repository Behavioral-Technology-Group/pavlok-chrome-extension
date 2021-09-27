const msgBackground = (msg) => {
    msg.target = "background";
    chrome.runtime.sendMessage(msg);
};

export default msgBackground;