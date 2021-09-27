import isEmpty from './isEmpty';

function setVal(data) {
    const initialConfig = {
        target: $(data.dom),
        type: $(target).prop("nodeName"),
        subtype: $(target).prop("type") || "none"
    }

    if (isEmpty(initialConfig.target)) { initialConfig.target = data.dom2; }

    if (initialConfig.type == "INPUT" && initialConfig.subType == "checkbox") {
        $(initialConfig.target).prop("checked", data.value);
    }
    else {
        $(initialConfig.target).val(data.value);
    }

    return
}

export default setVal;