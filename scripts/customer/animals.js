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



function animalTableRow(animal) {
	var html = '';

	function td(content) {
		html += '<td>' + content + '</td>';
	}

	function img(src, alt) {
		return '<img src="' + src + '" alt="' + alt + '" class="img-responsive fotoAnimal">';
	}

	function button(onclick)
	{
		return '<input type="button" value="Apagar" onclick="' + onclick + '">';
	}

	html += '<tr>';
	td(img(animal.photo, animal.name));
	td(animal.name);
	td(animal.breed);
	td(animal.age + ' anos');
	td('-'); // TODO fazer quando servicos estiverem funcionando
	td('-'); // TODO esse tambem
	td(button('deleteAnimal(' + animal.id + ')'));
	html += '</tr>';

	return html;
}



function refreshAnimalTable() {
	dbReadFromIndex(loggedUserId(), 'animals', 'owner', function(result) {
		if(result.success) {
			result.data.forEach(function(animal) {
				$('#cAnimalTable').append(animalTableRow(animal));
			});
		}
	});
}



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
