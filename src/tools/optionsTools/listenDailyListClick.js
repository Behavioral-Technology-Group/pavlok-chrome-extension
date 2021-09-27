import React from 'react';
import createDetailTR from './createDetailTR';
import fillDailyList from './fillDailyList';
import testTodo from '../todoTools/testTodo';
import msgInterfaces from '../helpersTools/msgInterfaces';
import log from '../helpersTools/log';
import visibleDaily from './visibleDaily';

export function createNewDailyTaskButtonClick() {
	var newTaskName = $("#newDailyTaskInput").val();
	if (newTaskName.length > 0 && newTaskName != " ") {
		$('#newDailyTaskInput').val('');
		var newDaily = {
			task: newTaskName,
			daily: true,
			pomos: 1,
		};
		newDaily = testTodo.backend.create(newDaily);
		testTodo.frontend.restoreTasks("options");

		fillDailyList();
		createDetailTR($("#" + newDaily.id));
		msgInterfaces({ action: "updateDaily" });

	} else {
		return
	}
}

function addDetailClickListener() {
	$("#dailyListTable tbody ").on('click', '.dailyListTR', function () {
		var clickedTR = $(this);
		var clickedId = parseInt($(this).attr('id'));
		createDetailTR(clickedTR);
	});
}

function addSpecialListInputClickListener() {
	$("#dailyListTable").on('click', '#specialListsInput', function (event) {
		var checked = $('#specialListsInput').prop('checked');
		if (checked == true) {
			$("#blackListDaily").tagsInput();
			$("#whiteListDaily").tagsInput();
			$('.specialListDisplay').show(300);
		}
		else {
			$('.specialListDisplay').hide(300);
		}
	});
}

function addSaveDailyClickListener() {
	$("#dailyListTable").on('click', '#saveDaily', function (event) {
		event.preventDefault();
		var updates = testTodo.helpers.gatherDaily();
		var task = testTodo.backend.update(updates.id, updates);
		log(task);

		$(".taskDetailTR").hide(300, function () { $(".taskDetailTR").remove() });

		fillDailyList();
		visibleDaily($(".activeDailyTR"));
	});
}

function addDeleteDailyClickListener() {
	$("#dailyListTable").on('click', '#deleteDaily', function (event) {
		event.preventDefault();

		var id = parseInt($('#dailyTaskIdInput').val());
		testTodo.backend.delete(id);
		visibleDaily($(".activeDailyTR"));
		fillDailyList();
	});
}

const listenDailyListClick = () => {

	addDetailClickListener();

	addSpecialListInputClickListener();

	addSaveDailyClickListener();

	addDeleteDailyClickListener();
}

export default listenDailyListClick;