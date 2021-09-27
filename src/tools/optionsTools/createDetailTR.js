import visibleDaily from './visibleDaily';
import removeInlineStyle from '../helpersTools/removeInlineStyle';

const createDetailTR = (targetRow) => {
    var clickedId = parseInt(targetRow.attr("id"));

    // Removes any detail row before
    $(".taskDetailTR").hide(200).remove();

    // Insert a new TR for details of clicked task
    var newDetailTR = document.createElement("tr");
    newDetailTR.className = "taskDetailTR noDisplay";

    var newTD = document.createElement("td");
    newDetailTR.appendChild(newTD);
    newTD.colSpan = 3;

    $(targetRow).after(newDetailTR);

    // Fill details of the clicked task
    newTD.appendChild(testTodo.frontend.dailyDetail(clickedId));

    var task = testTodo.backend.read(clickedId);

    var blContent = task.blackList || '';
    var blackListDiv = $("#blackListTD").children()[0];
    $(blackListDiv).tagsInput({
        'defaultText': 'Add site... ie: facebook.com',
        'removeWithBackspace': true
    })
        .importTags(blContent);
    removeInlineStyle("#blackListDaily_tagsinput");

    var wlContent = task.whiteList || '';
    var whiteListDiv = $("#whiteListTD").children()[0];
    $(whiteListDiv).tagsInput({
        'defaultText': 'Add site... ie: facebook.com/groups/772212156222588/',
        'removeWithBackspace': true
    })
        .importTags(wlContent);
    removeInlineStyle("#whiteListDaily_tagsinput");

    // Show detail row and reformat clicked rows
    var detailRow = $(".taskDetailTR");

    visibleDaily(targetRow, detailRow);
};

export default createDetailTR;