import lsGet from '../helpersTools/lsGet';

const fillDailyList = () => {

	var allTasks = lsGet('allTasks', 'parse');//pega o valor de localstorage.allTasks
	var dailyList = _.where(allTasks, { daily: true });//percorre allTask e entrega somente os dias ativos


	dailyList = dailyList.reverse();//inverte os ítens do array
	$('.dailyListTR').remove()//remove todas as linhas da todo

	for (let d = 0; d < dailyList.length; d++) {//pega dailyList e adiciona um elemento DOM para cada iteração
		var daily = dailyList[d];
		var specialList;
		if (daily.specialList == true) { specialList = 'Using'; }
		else { specialList = 'Not Using'; }

		var newLine = '' +
			'<tr id="' + daily.id + '" class="dailyListTR">' +
			'<td>' + daily.task + '</td>' +
			'<td>' + daily.pomos + " x " + daily.duration + " min" + '</td>' +
			'<td>' + specialList + '</td>' +
			'</tr>' +
			'<tr id="' + daily.id + 'details" class="dailyDetailTR">' +

			'</tr>'
			;

		$('#dailyListTable > tbody').append(newLine);
	}
}

export default fillDailyList;