function visibleDaily(targetRow, detailRow) {
    if ($(targetRow).hasClass("activeDailyTR")) {
        $(targetRow).removeClass("activeDailyTR");
        $(".taskDetailTR").hide(100,
            function () { $(".taskDetailTR").remove() });
    }
    else {
        // Restore actual active to regular before opening the new one
        $(".dailyListTR").removeClass("activeDailyTR");

        $(targetRow).addClass("activeDailyTR");

        // Manage presentation of new task details
        $(detailRow).show(400);
        $(detailRow).effect("highlight", { color: 'white' }, 400);
    }

};

export default visibleDaily;