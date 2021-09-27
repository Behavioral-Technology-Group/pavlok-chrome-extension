import React from "react";
import lsGet from "../helpersTools/lsGet";
import changeRTVisibility from "./changeRTVisibility";
import updateProductivity from "./updateProductivity";
import updateRTLimits from "./updateRTLimits";
import confirmUpdate from "../helpersTools/confirmUpdate";

import notifyUpdate from "../helpersTools/variables/notifyUpdate";

const persistValue = (key, value) => (lsSet("key]", value));
const persistSelectValue = (e) => persistValue(e.target.id, e.target.value);

const configureSpinner = (domId, props, initialValue) => {
  var element = $(domId).spinner(props);
  element.val(initialValue);
  return element;
};

const spinnerAdapter = (key) => {
  const data = initialConfig[key];
  return configureSpinner(
    `#${key}`,
    {
      min: data.min,
      max: data.max,
      page: data.page,
      step: data.step,
      change: data.onChange,
    },
    data.initialValue
  );
};

const selectAdapter = (key) => {
  const data = initialConfig[key];
  const element = document.getElementById(key);
  element.value = data.initialValue;
  element.onchange = data.onChange;
};

// Setup
const valueOrDefault = (value) =>
  isNaN(parseInt(value)) ? 42 : parseInt(value);

const initialConfig = {
  RTPosLimit: {
    min: valueOrDefault(lsGet("RTWarnLimit")),
    max: 100,
    page: 10,
    step: 5,
    onChange: function (event, ui) {
      updateRTLimits();
      confirmUpdate(notifyUpdate);
    },
    initialValue: valueOrDefault(lsGet("RTPosLimit")),
  },
  RTWarnLimit: {
    min: valueOrDefault(lsGet("RTNegLimit")),
    max: valueOrDefault(lsGet("RTPosLimit")),
    page: 10,
    step: 5,
    onChange: function (event, ui) {
      updateRTLimits();
      confirmUpdate(notifyUpdate);
    },
    initialValue: valueOrDefault(lsGet("RTWarnLimit")),
  },
  RTNegLimit: {
    min: 0,
    max: valueOrDefault(lsGet("RTWarnLimit")),
    page: 10,
    step: 5,
    onChange: function (event, ui) {
      updateRTLimits();
      confirmUpdate(notifyUpdate);
    },
    initialValue: valueOrDefault(lsGet("RTNegLimit")),
  },
  RTPosSti: {
    initialValue: lsGet("RTPosSti"),
    onChange: persistSelectValue,
  },
  RTWarnSti: {
    initialValue: lsGet("RTWarnSti"),
    onChange: persistSelectValue,
  },
  RTNegSti: {
    initialValue: lsGet("RTNegSti"),
    onChange: persistSelectValue,
  },
};

// Execução
const enableRescueTime = () => {
  const isActive = () => lsGet("RTOnOffSelect") == "On";
  if (isActive()) {
    updateProductivity();
  }

  //set start value to Frequency
  var RTFreq = lsGet("RTFrequency") || 3;
  $("#RTFrequencySelect").val(RTFreq);

  // Enable spinners
  ["RTPosLimit", "RTWarnLimit", "RTNegLimit"].forEach(spinnerAdapter);

  // Enable dropdowns
  ["RTPosSti", "RTWarnSti", "RTNegSti"].forEach(selectAdapter);
  changeRTVisibility();
};

export default enableRescueTime;
