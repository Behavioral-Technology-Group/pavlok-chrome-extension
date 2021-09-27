import regressRTHour from './regressRTHour';

const updateProductivity = () => {
    let RTProdInterval = setInterval(function () {
        if (lsGet("RTOnOffSelect") == "On") {
            if (!lsGet("Comment")) { return }
            var beginCycle = regressRTHour(-30);
            var beginHours = beginCycle.getHours() + ":" + beginCycle.getMinutes() + ":" + beginCycle.getSeconds();
            if (parseInt(lsGet("RTPulse")) > 0) {
                $("#RTResultsHolder").html("Your Productivity pulse was <b>" + lsGet("RTPulse") + "</b>.");
                $("#RTResultsHolder").attr('title', 'Measured from ' + beginHours + " to " + lsGet("RTHour"));
            }
            else {
                $("#RTResultsHolder").html("Too little time evaluated from <b>" + lsGet("RTHour") + "</b>. Check back in 15 minutes or so.");
                $("#RTResultsHolder").attr('title', 'Measured from ' + beginHours + " to " + lsGet("RTHour"));
            }
        }
    }, 3 * 1000);
};

export default updateProductivity;