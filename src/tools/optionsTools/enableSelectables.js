const enableSelectables = () => {
	$("#selectable").selectable({
		filter: ".tdSelectable",
		stop: function () {
			var result = $("#select-result").empty();
			$(".ui-selected", this).each(function () {
				var index = $("#selectable td").index(this);
				result.append(" #" + (index + 1));
			});
		}
	});
}

export default enableSelectables;