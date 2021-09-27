import lsGet from './lsGet';

function compareSetting(LSsetting, elementName, override) {
    const config = {
        renderedValue: null,
        storedValue: lsGet(LSsetting),
        isEqual: null
    }

    if (override == "override") {
        config.renderedValue = elementName;
    } else {
        config.renderedValue = $(elementName).val();
    }

    (config.renderedValue == config.storedValue) ? config.isEqual = true : config.isEqual = false;

    return config.isEqual;
}

export default compareSetting;