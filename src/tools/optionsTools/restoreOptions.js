import changeRTVisibility from "./changeRTVisibility";
import confirmUpdate from "../helpersTools/confirmUpdate";

// Initial config block
const initialConfig = {
  blackList: lsGet("blackList" || " "),
  whiteList: lsGet("whiteList" || " "),
  timeFormat: lsGet("timeFormat"),
  startHour: lsGet("generalActiveTimeStart"),
  endHour: lsGet("generalActiveTimeEnd"),
  vibPosition: lsGet("vibrationPosition"),
  beepPosition: lsGet("beepPosition"),
  zapPosition:
    Math.round((parseInt(lsGet("zapIntensity") * 100) / 2550) * 10),
  timeWindow: lsGet("timeWindow"),
  tabCountAll: lsGet("tabCountAll"),
  RTOnOffSelect: lsGet("RTOnOffSelect"),
  zapOnClose: lsGet("zapOnClose"),
  notifyZap: lsGet("notifyZap"),
  notifyVibration: lsGet("notifyVibration"),
  notifyBeep: lsGet("notifyBeep"),
  sundayActive: lsGet("sundayActive"),
  mondayActive: lsGet("mondayActive"),
  tuesdayActive: lsGet("tuesdayActive"),
  wednesdayActive: lsGet("wednesdayActive"),
  thursdayActive: lsGet("thursdayActive"),
  fridayActive: lsGet("fridayActive"),
  saturdayActive: lsGet("saturdayActive"),
  tabNumbersActive: lsGet("tabNumbersActive"),
};

const elementValuesMapper = [
  // text inputs
  ["whiteList", initialConfig.whiteList],
  ["timeFormat", initialConfig.timeFormat],
  ["generalActiveTimeStart", initialConfig.startHour],
  ["generalActiveTimeEnd", initialConfig.endHour],
  ["blackListTimeWindow", initialConfig.timeWindow],
  ["allTabsCountSelect", initialConfig.tabCountAll],
  ["RTOnOffSelect", initialConfig.RTOnOffSelect],

  // checkboxes
  ["zapOnClose", initialConfig.zapOnClose],
  ["notifyZap", initialConfig.notifyZap],
  ["notifyVibration", initialConfig.notifyVibration],
  ["notifyBeep", initialConfig.notifyBeep],
  ["sundayActive", initialConfig.sundayActive],
  ["mondayActive", initialConfig.mondayActive],
  ["tuesdayActive", initialConfig.tuesdayActive],
  ["wednesdayActive", initialConfig.wednesdayActive],
  ["thursdayActive", initialConfig.thursdayActive],
  ["fridayActive", initialConfig.fridayActive],
  ["saturdayActive", initialConfig.saturdayActive],
  ["tabNumbersActiveCheckbox", initialConfig.tabNumbersActive],
].map((x) => {
  return { id: x[0], value: x[1] };
});

// Execution block
export function takeGeneralCount() {
  lsSet("tabCountAll", $("#allTabsCountSelect").val());
  confirmUpdate(notifyUpdate);
}

const restoreOptions = () => {
  setInitialValueFor(elementValuesMapper, setValue);

  //setting tags for blacklist
  $("#blackList").importTags(initialConfig.blackList);

  // Stimuli Intensity
  configStimuliIntensity(
    initialConfig.beepPosition,
    "#sliderBeep",
    "#beepIntensity"
  );
  configStimuliIntensity(
    initialConfig.vibPosition,
    "#sliderVibration",
    "#vibrationIntensity"
  );
  configStimuliIntensity(
    initialConfig.zapPosition,
    "#sliderZap",
    "#zapIntensity"
  );

  if ($("#RTOnOffSelect").val() == "Off") {
    $("#RTResultsHolder").css("visibility", "hidden");
  }
  changeRTVisibility();
};

function setInitialValueFor(mapper, setter) {
  mapper.forEach((item) => {
    setter(item.id, item.value);
  });
}

function setValue(domElementId, value) {
  const element = document.getElementById(domElementId);
  if (element) {
    if (element.type === "checkbox") {
      element.checked = value === "true";
    } else {
      element.value = value;
    }
  }
}

function configStimuliIntensity(stimuliPosition, sliderId, intensityId) {
  let stimuliSlider;
  if (parseInt(stimuliPosition) > 0) {
    stimuliSlider = stimuliPosition;
  } else {
    stimuliSlider = 60;
  }

  $(sliderId).slider({ value: stimuliSlider });
  $(intensityId).html(stimuliSlider + "%");
}

export default restoreOptions;
