/* File: customer/profile.js
 * Authors:
 * Hugo Moraes Dzin, 8532186
 * Matheus Gomes da Silva Horta, 8532321
 * Rogiel dos Santos Silva, 8061793
 */

console.log('Executing customer/profile.js');



function getUser(callback) {
	dbReadRecord(loggedUserId(), 'users', callback);
}



function customerProfile() {
	// Mapeia o campo do registro com o ID do elemento na pagina
	var fields = {
		'name': '#cProfileName',
		'email': '#cProfileEmail',
		'address': '#cProfileAddress',
		'phone': '#cProfilePhone',
	};

	refreshProfileInfo(fields);

	// Botao de alterar perfil
	$('#cProfileUpdate').click(function() {
		getUser(function(result) {
			if(result.success) {
				// Modifica o registro do usuario, pegando os dados que
				// o usuario digitou na pagina
				for(var f in fields) {
					result.data[f] = $(fields[f]).val();
				}

				dbUpdateRecord(result.data, 'users', _test_callback);

				// Pra atualizar o nome do usuario no mavbar
				loadNavbar(result.data);

				refreshInformation();
			}
		});
	});

	// Botao de alterar foto
	$('#cProfileUpdatePhoto').click(function() {
		fileReaderCallback('#cProfileFile', updateProfilePhoto);
	});

	// Botao de alterar senha
	$('#cProfileUpdatePass').click(function() {
		getUser(function(result) {
			if(result.success) {
				var old_pass  = $('#cProfileOldPass').val();
				var new_pass1 = $('#cProfileNewPass').val();
				var new_pass2 = $('#cProfileConfirmPass').val();

				if(result.data.password != old_pass) {
					alert('Senha antiga errada.');
				}
				else if(new_pass1 != new_pass2) {
					alert('Confirmação de senha não bate.');
				}
				else {
					result.data.password = new_pass1;
					dbUpdateRecord(result.data, 'users', _test_callback);
				}
			}
		});
	});
}



// Atualiza os dados do cadastro e a foto
function refreshProfileInfo(fields) {
	getUser(function(result) {
		if(result.success) {
			var data = result.data;

			$('#cTitle').html(data.name);
			$('#cProfilePhoto').attr('src', data.photo);

			for(var id in fields) {
				$(fields[id]).val(data[id]);
			}
		}
	});
}



// Faz upload da foto escolhida no input de arquivos
function updateProfilePhoto(event) {
	var new_photo = event.target.result;
	$('#cProfilePhoto').attr('src', new_photo);

	getUser(function(result) {
		if(result.success) {
			result.data.photo = new_photo;
			dbUpdateRecord(result.data, 'users', _test_callback);
		}
	});
}
