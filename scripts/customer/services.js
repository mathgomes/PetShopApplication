/* File: customer/services.js
 * Authors:
 * Hugo Moraes Dzin, 8532186
 * Matheus Gomes da Silva Horta, 8532321
 * Rogiel dos Santos Silva, 8061793
 */

console.log('Executing customer/services.js');



function customerServices() {


	// Automatic date formatting
	$('#cServiceDate').change(function() {
		$(this).val( formatDateInput($(this).val()) );
	});

	// Display a table with available time slots
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

	// By default, show available time slots for the current date
	searchTodaysTimeSlots();
}



// Adds slashes, removes letters etc from a date string
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
		if(result.success == false) {
			return; // :(
		}

		// Creates a table with all slots available
		initTimeSlotTable(date);

		// Update table with unavailable timeslots, from database
		// result.data contains already occupied time slots
		result.data.forEach(function(slot) {
			var row_id = '#cTimeSlot' + slot.time;

			// Retrieve service and animal
			dbReadRecord(slot.service, 'services', function(result) {
				if(result.success == false) {
					// Service not found -> invalid time slot
					deleteIfInvalid(slot, error);
					return;
				}

				var service_img = result.data.photo;
				var service_name = result.data.name;

				dbReadRecord(slot.animal, 'animals', function(result) {
					if(result.success == false) {
						// Animal not found -> invalid time slot
						deleteIfInvalid(slot, error);
						return;
					}

					var animal_name = result.data.name;

					$(row_id + ' .cSlotImg').attr('src', service_img);
					$(row_id + ' .cSlotSvc').html(service_name);
					$(row_id + ' .cSlotAnimal').html(animal_name);
					$(row_id + ' .cSlotBtn').prop('disabled', true);
				});
			});
		});
	});
}



function initTimeSlotTable(date) {



	function rowHtml(timeslot, time1, time2) {
		var html = '';

		function td(content) {
			html += '<td>' + content + '</td>';
		}

		html += '<tr id="cTimeSlot' + timeslot + '">';
		td('<b>' + time1 + ' ~ ' + time2 + '</b>');
		td('<img class="cSlotImg" width=60 height=40 src="images/servico/disponivel.png">' +
			'<br><span class="cSlotSvc"></span>');
		td('<span class="cSlotAnimal">Vago</span>');
		td('<input class="cSlotBtn" type="button" value="Agendar" ' +
			'onclick="serviceCheckout(' + [date.getTime(), timeslot] + ')" >');
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



// Used when the slot's service or animal don't exist
function deleteIfInvalid(slot, error) {
	if(error == 'NotFoundError')
	{
		dbDeleteRecord(slot.id, 'timeslots');
	}
}



function serviceCheckout(date, timeslot) {
	loadPage('Cliente/pagtoServico.html', function() {

		function option(value, text) {
			return '<option value="' + value + '">' + text + '</option>';
		}

		$('#cServiceDateTime').html(displayTime(date, timeslot));

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

		console.log('ha');
		$('#cServiceList').change(function() {
			var service_id = parseInt($(this).val());

			dbReadRecord(service_id, 'services', function(result) {
				if(result.success) {
					$('#cServicePrice').html(result.data.price);
				}
			});
		});

		$('#cConfirmService').click(function() {
			var service_str = $('#cServiceList').val();
			var animal_str = $('#cAnimalList').val();

			if(service_str == '' || animal_str == '') {
				alert('Especifique o serviço e o animal');
				return;
			}

			var service = parseInt(service_str);
			var animal  = parseInt(animal_str);

			var record = {
				date: date,
				time: timeslot,
				service: service,
				animal: animal,
			};

			dbCreateRecord(record, 'timeslots', function(result) {
				if(result.success) {
					alert('Agendamento confirmado.');
					$('#cNavAnimals').click();
				}
			});
		});
	});
}



function displayTime(date, timeslot) {
	date = new Date(date);
	timeslot = (timeslot + 9) + ':00';

	return date.getDate() + '/' + date.getMonth() + '/' + date.getFullYear() +
		' ' + timeslot;
}
