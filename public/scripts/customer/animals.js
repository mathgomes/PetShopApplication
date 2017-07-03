/* File: customer/animals.js
 * Authors:
 * Hugo Moraes Dzin, 8532186
 * Matheus Gomes da Silva Horta, 8532321
 * Rogiel dos Santos Silva, 8061793
 */

console.log('Executing customer/animals.js');



function customerAnimals() {
	refreshAnimalTable();
	$('#cAnimalSubmit').click(createAnimal);
}



// Retorna o HTML de uma linha da tabela de animais
function animalTableRow(animal, service_name) {
	var html = '';

	function td(content) {
		html += '<td>' + content + '</td>';
	}

	function img(src, alt) {
		return '<img src="' + src + '" alt="' + alt + '" class="img-responsive fotoAnimal">';
	}

	function button(onclick)
	{
		if(service_name == null) {
			return '<input type="button" value="Apagar" onclick="' + onclick + '">';
		}
		else {
			// Se o animal esta em um agendamento, nao pode deletar!
			return '<input type="button" value="Apagar" disabled>';
		}
	}

	html += '<tr>';
	td(img(animal.photo, animal.name));
	td(animal.name);
	td(animal.breed);
	td(animal.age + ' anos');

	// Mostra o agendamento do animal, se estiver em um
	if(service_name != null) {
		td(service_name);
	}
	else {
		td('-');
	}

	td(button('deleteAnimal(' + animal.id + ')'));
	html += '</tr>';

	return html;
}



function refreshAnimalTable() {
	$('#cAnimalTable').html('');



	// Percorre os animais do usuario, no Indexed DB
	dbReadFromIndex(loggedUserId(), 'animals', 'owner', function(result) {
		if(result.success == false) {
			return
		}

		result.data.forEach(function(animal) {
			// Funcao que cria uma linha na tabela para um animal que nao esta em nenhum agendamento
			function appendFreeAnimal() {
				$('#cAnimalTable').append(animalTableRow(animal, null));
			}

			// Verifica se o animal esta em algum agendamento
			dbReadFromIndex(animal.id, 'timeslots', 'animal', function(result) {
				if(result.success && result.data.length != 0) {
					var timeslot = result.data[0];

					if(timeslot.date < Date.now()) {
						// Agendamento do passado, pode ignorar
						appendFreeAnimal();
					}
					else {
						// Pega o nome do servico, para colocar na tabela
						dbReadRecord(timeslot.service, 'services', function(result) {
							if(result.success) {
								// Achou o servico
								var service = result.data;
								$('#cAnimalTable').append(animalTableRow(animal, service.name));
							} else {
								// Nao achou o servico, ignorar
								appendFreeAnimal();
							}
						});
					}
				}
				else {
					// Animal nao esta em nenhum agendamento
					appendFreeAnimal();
				}
			});
		});
	});
}



// Deleta o animal do Indexed DB
function deleteAnimal(animal_id)
{
	dbDeleteRecord(animal_id, 'animals', function(result) {
		if(result.success) {
			alert('Animal apagado com sucesso.');
		}
		else {
			alert('Erro ao apagar animal.');
			console.log('deleteAnimal:', result.error);
		}

		refreshAnimalTable();
	});
}



// Cadastra um animal no Indexed DB
function createAnimal()
{
	fileReaderCallback('#cAnimalPhoto', function(event) {
		var new_animal= {
			owner: loggedUserId(),
			name:  $('#cAnimalName').val(),
			breed: $('#cAnimalBreed').val(),
			age:   $('#cAnimalAge').val(),
			photo: event.target.result,
		};

		dbCreateRecord(new_animal, 'animals', function(result) {
			if(result.success == false) {
				alert('Erro ao criar animal');
			}
			else {
				refreshAnimalTable();
			}
		});
	});
}
