/* File: script.js
 * Authors:
 * Hugo Moraes Dzin, 8532186
 * Matheus Gomes da Silva Horta, 8532321
 * Rogiel dos Santos Silva, 8061793
 */

// For website testing
function _go() {
	$('#loginUsername').val('hdzin');
	$('#loginPassword').val('1234');
	$('#loginButton').click();
}



function loggedUserId(user_id) {
	if(user_id) {
		// Logging in
		localStorage.setItem('user_id', user_id);
	}
	else {
		// ID retrieval
		return parseInt(localStorage.getItem('user_id'));
	}
}



function loadPage(page, callback) {
	$('#indexCenterPage').load(page, callback);
}




function setLoginAction() {
	$('#loginButton').click(function() {
		var username = $('#login').val();
		var password = $('#login').val();

		dbUserLogin(username, password, function(result) {
			console.log(result);
			if(result.success) {
				var page;
				var navbar;

				if(result.data[0].is_admin) {
					page = 'Admin/funcoesAdmin.html';
					navbar = 'Admin/navbar.html';
				}
				else {
					page = 'Cliente/funcoesCliente.html';
					navbar = 'Cliente/navbar.html';
				}

				loggedUserId(result.data[0].id);
				loadPage(page);

				$('#indexNavWrapper').load(navbar, function() {
					loadNavBar(result.data[0]);
				});
			}
			else {
				// TODO Escrever na pagina que o login deu errado
				// ID: indexLoginError
			}
		});
	});
}



function loadNavBar(user_data) {
	var first_name = user_data.name.split(' ')[0];
	$('#cNavUsername').html(first_name);

	$('#cNavProfile').click(function() {
		loadPage('Cliente/perfil.html', loadCustomerProfile);
	});

	$('#cNavServices').click(function() {
		loadPage('Cliente/horarioServico.html');
	});
}



function loadCustomerProfile() {
	// Load user data
	var fields = {
		'name': '#cProfileName',
		'email': '#cProfileEmail',
		'address': '#cProfileAddress',
		'phone': '#cProfilePhone',
	};

	dbReadRecord(loggedUserId(), 'users', function(result) {
		var data = result.data;

		$('#cTitle').html(data.name);
		$('#cProfilePhoto').attr('src', data.photo);

		for(var id in fields) {
			$(fields[id]).val(data[id]);
		}
	});

	// Profile update callback
	$('#cProfileUpdate').click(function() {
		dbReadRecord(loggedUserId(), 'users', function(result) {
			for(var id in fields) {
				result.data[id] = $(fields[id]).val();
			}
			dbUpdateRecord(loggedUserId(), result.data, 'users', _test_callback);
		});
	});

	// Picture update callback
	$('#cProfileUpdatePhoto').click(function() {
		var file = $('#cProfileFile').prop('files')[0];
		if(file) {
			var fr = new FileReader();
			fr.onload = updateProfilePhoto;
			fr.readAsDataURL(file);
		}
	});
}



// Reads the image from #cProfilePhoto and updates the
// user record on the database
function updateProfilePhoto(event) {
	var new_photo = event.target.result;
	$('#cProfilePhoto').attr('src', new_photo);

	dbReadRecord(loggedUserId(), 'users', function(result) {
		if(result.success) {
			result.data.photo = new_photo;
			dbUpdateRecord(loggedUserId(), result.data, 'users', _test_callback);
		}
	});
}



$(document).ready(function() {
	dbInit();

	$('#indexCenterPage').load('login_page.html', setLoginAction);

	//Customer
	//MEXENDO NISSO AQUI
	/*$(document).on("click", "a#perfil", function() {
		$("#indexCenterPage").load("Cliente/perfil.html");
	});


	$(document).on("click", "a#animais", function() {
		$("#indexCenterPage").load("Cliente/situacaoAnimais.html");
	});


	$(document).on("click", "a#loja", function() {
		$("#indexCenterPage").load("Cliente/loja.html");
	});
	$(document).on("click", "#cNavServices", function() {
		console.log('oi');
		$("#indexCenterPage").load("Cliente/horarioServico.html");
	});


	$(document).on("click", "a#carrinho", function() {
		$("#indexCenterPage").load("Cliente/carrinho.html");
	});*/



	$(document).on("click", ".item img", function() {
		$("#indexCenterPage").load("Cliente/compraProduto.html");
	});
	$(document).on("click", "#purchaseForm #confirm", function() {
		$("#indexCenterPage").load("Cliente/carrinho.html");
	});
	$(document).on("click", ".carrinho_opcoes #checkout", function() {
		$("#indexCenterPage").load("Cliente/checkout.html");
	});




	//Admin

	$(document).on("click", "a#perfilAdm", function() {
		$("#indexCenterPage").load("Admin/perfil.html");
	});


	$(document).on("click", "a#cadastrarUsuario", function() {
		$("#indexCenterPage").load("Admin/cadastrarUsuario.html");
	});


	$(document).on("click", "a#buscarUsuario", function() {
		$("#indexCenterPage").load("Admin/buscarUsuario.html");
	});


	$(document).on("click", "a#cadastrarProduto", function() {
		$("#indexCenterPage").load("Admin/cadastrarProduto.html");
	});


	$(document).on("click", "a#cadastrarServico", function() {
		$("#indexCenterPage").load("Admin/cadastrarServico.html");
	});


	$(document).on("click", "a#ganhos", function() {
		$("#indexCenterPage").load("Admin/estatisticas.html", function(data) {
			$('#example').DataTable();
		});
	});

	$(document).on("click", "input#inputBuscaCliente", function() {
		$("#indexCenterPage").load("Admin/alteraExcluiUsuario.html");
	});
});






