import UpdateTabCount from '../helpersTools/UpdateTabCount';
import dateParser from './dateParser';
import countTabs from '../helpersTools/countTabs';
import confirmUpdate from '../helpersTools/confirmUpdate';
import lsSet from '../helpersTools/lsSet';


const enableTimers = () => {
    $.widget("ui.timespinner", $.ui.spinner, {
        options: {
            // seconds
            step: 15 * 60 * 1000,
            // hours
            page: 60
        },

        _parse: function (value) {
            if (typeof value === "string") {
                // already a timestamp
                if (Number(value) == value) {
                    return Number(value);
                }
                return dateParser(value);
            }
            return value;
        },

        _format: function (value) {
            return Globalize.format(new Date(value), "t");
        }
    });

    $(function () {
        $("#generalActiveTimeStart").timespinner({
            change: function (event, ui) {
                lsSet("generalActiveTimeStart", $(this).val());
                countTabs(lsGet("tabCountAll"), UpdateTabCount);
                confirmUpdate(notifyUpdate);
            },
        });

        $("#generalActiveTimeEnd").timespinner({
            change: function (event, ui) {
                lsSet("generalActiveTimeEnd", $(this).val());
                countTabs(lsGet("tabCountAll"), UpdateTabCount);
                confirmUpdate(notifyUpdate);
            }
        });

        $("#timeFormat").change(function () {
            lsSet('timeFormat', $(this).val());
            countTabs(lsGet("tabCountAll"), UpdateTabCount);

            var currentStart = $("#generalActiveTimeStart").timespinner("value");
            var currentEnd = $("#generalActiveTimeEnd").timespinner("value");

            var selectedOption = $(this).val();
            if (selectedOption == "24") { culture = "de-DE" }
            else if (selectedOption == "12") { culture = "en-EN" };

            // Globalize.culture(culture);
            $("#generalActiveTimeStart").timespinner("value", currentStart);
            $("#generalActiveTimeEnd").timespinner("value", currentEnd);
        });
    });
};

export default enableTimers;