/* File: customer/services.js
 * Authors:
 * Hugo Moraes Dzin, 8532186
 * Matheus Gomes da Silva Horta, 8532321
 * Rogiel dos Santos Silva, 8061793
 */

console.log('Executing customer/services.js');



function customerServices() {
	function option(value, text) {
		return '<option value="' + value + '">' + text + '</option>';
	}

	dbReadAllRecords('services', function(result) {
		if(result.success) {
			result.data.forEach(function(service) {
				$('#cServiceList').append(option(service.id, service.name));
			});
		}
	});

	dbReadFromIndex(loggedUserId(), 'animals', 'owner', function(result) {
		if(result.success) {
			result.data.forEach(function(animal) {
				$('#cAnimalList').append(option(animal.id, animal.name));
			});
		}
	});

	$('#cServiceDate').change(function() {
		$(this).val( formatDateInput($(this).val()) );
	});

	$('#cServiceSearch').click(function() {
		var dd_mm_aaaa = $('#cServiceDate').val();
		var date = processDateString(dd_mm_aaaa);

		if(date == null) {
			alert('Data inválida.');
		}
		else {
			displayTimeSlots(date);
		}
	});

	searchTodaysTimeSlots();
}



function formatDateInput(dd_mm_aaaa) {
	var result = '';
	var state = 0; // 0: days, 1: months, 2: years
	var digit_count = 0; // digits in the current state

	function isDigit(ch) {
		return '1234567890'.indexOf(ch) != -1;
	}

	for(var i = 0; i < dd_mm_aaaa.length; i++) {
		var ch = dd_mm_aaaa[i];

		if(state == 0 || state == 1) {
			if(isDigit(ch)) {
				if(digit_count == 2) {
					// Move to next state
					state += 1;
					result += '/' + ch;
					digit_count = 1;
				}
				else {
					// Append char, increment digit count
					result += ch;
					digit_count += 1;
				}
			}
			else if(ch == '/' && digit_count != 0) {
				// Move to next state
				result += '/';
				state += 1;
				digit_count = 0;
			}
		}
		else if(state == 2 && isDigit(ch)) {
			if(digit_count < 4) {
				result += ch;
				digit_count += 1;
			}
			else {
				break;
			}
		}
	}

	return result;
}


// Creates a Date object from a string in DD/MM/AAAA format
// Returns null if the date is invalid.
function processDateString(dd_mm_aaaa) {
	var regexp = /(\d*)\/(\d*)\/(\d*)/;
	var match = dd_mm_aaaa.match(regexp);

	if(match == null) {
		return null;
	}
	else {
		var day   = match[1];
		var month = match[2];
		var year  = match[3];

		var date = new Date(month + '/' + day + '/' + year);

		if(isNaN(date.getTime())) {
			return null;
		}
		else {
			return date;
		}
	}
}



function searchTodaysTimeSlots() {
	var now = new Date();
	var dd_mm_aaaa = now.getDate() + '/' + now.getMonth() + '/' + now.getFullYear();

	$('#cServiceDate').val(dd_mm_aaaa);
	$('#cServiceSearch').click();
}



function displayTimeSlots(date) {
	dbReadFromIndex(date.getTime(), 'timeslots', 'date', function(result) {
		if(result.success) {
			console.log(result.data);
		}

		initServiceTable(date);
	});
}



function initServiceTable(date) {
	console.log('initservicetable');

	function rowHtml(timeslot, time1, time2) {
		console.log('rowhtml');
		var html = '';

		function td(content) {
			html += '<td>' + content + '</td>';
		}

		html += '<tr id="cTimeSlot' + timeslot + '">';
		td('<b>' + time1 + ' ~ ' + time2 + '</b>');
		td('<img width=60 height=40 src="images/servico/disponivel.png">');
		td('-');
		td('<input type="button" value="Agendar" onclick="requestService(' + [date, timeslot] + ')"');
		html += '</tr>';

		return html;
	}

	$('#cTimeSlots').html('');
	for(var i = 0; i < 10; i++) {
		// The first timeslot will be at 9:00 ~ 10:00
		var time_begin = (i + 9) + ':00';
		var time_end = (i + 10) + ':00';

		$('#cTimeSlots').append(rowHtml(i, time_begin, time_end));
	}
}



function requestService(date, timeslot) {
	console.log('request', date, timeslot);
}
