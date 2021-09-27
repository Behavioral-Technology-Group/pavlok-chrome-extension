const enableTooltips = () => {
    $(function () {
        // Makes possible to use HTML inside the tittle
        $(document).tooltip({
            content: function () {
                var element = $(this);
                if (element.is("[title]")) {
                    return element.attr("title");
                }

            },
            position: { my: "left bottom-3", at: "center top" }
        });
    });
}

export default enableTooltips;