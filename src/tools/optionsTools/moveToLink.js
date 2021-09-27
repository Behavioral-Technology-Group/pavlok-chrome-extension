const moveToLink = (clickedLink) => {
    var target = $(clickedLink).prop('id').split("@")[1];

    target = $("#" + target);

    var topHeight = parseInt($(".fixedHeader").height());
    // var topMargin = parseInt($("#fixedHeader").margin());
    // var topPadding= parseInt($("#fixedHeader").css('padding').split("p")[0]);
    // var topSize = topHeight + topPadding;
    var topSize = topHeight;

    var position = $(target).offset().top;
    var positionUpdated = position - topSize;

    // log(positionUpdated);
    // window.scrollTo(0, positionUpdated);
    $('html, body').animate({
        scrollTop: positionUpdated
    }, 1000);
};

export default moveToLink;