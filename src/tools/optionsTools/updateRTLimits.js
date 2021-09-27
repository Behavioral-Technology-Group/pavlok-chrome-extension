import confirmUpdate from '../helpersTools/confirmUpdate';

const getValues = () => {
  return {
    pos: $("#RTPosLimit").spinner("value"),
    neg: $("#RTNegLimit").spinner("value"),
    warn: $("#RTWarnLimit").spinner("value"),
  };
};

const normalizeValues = (values) => {
  // check values are valid and overwrite invalid ones
  const newValues = { ...values };

  if (isNaN(newValues["neg"])) newValues["neg"] = 10;
  if (isNaN(newValues["warn"])) newValues["warn"] = 40;
  if (isNaN(newValues["pos"])) newValues["pos"] = 60;

  return newValues;
};

const updateRTLimits = () => {
  const currentValues = normalizeValues(getValues());
  const config = {
    RTPosLimit: {
      min: currentValues.warn,
      max: 100,
      value: currentValues.pos,
    },
    RTWarnLimit: {
      min: currentValues.neg,
      max: currentValues.pos,
      value: currentValues.warn,
    },
    RTNegLimit: {
      min: 0,
      max: currentValues.warn,
      value: currentValues.neg,
    },
  };

  // There should be no cross over
  Object.keys(config).forEach((key) => {
    const data = config[key];
    $(`#${key}`).spinner({
      max: data.max,
      min: data.min,
    });

    lsSet("key]", data.value);
  });

  confirmUpdate(notifyUpdate);
  return;
};

export default updateRTLimits;
