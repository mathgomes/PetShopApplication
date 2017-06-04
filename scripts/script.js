/* File: script.js
 * Authors:
 * Hugo Moraes Dzin, 8532186
 * Matheus Gomes da Silva Horta, 8532321
 * Rogiel dos Santos Silva, 8061793
 */

console.log('Executing script.js');



// For website testing
function _a() {
	$('#loginUsername').val('hdzin');
	$('#loginPassword').val('1234');
	$('#loginButton').click();
}

function _s()
{
	$('#cNavAnimals').click();
}


// Used to set or retrieve the user's id
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



function getUser(callback) {
	dbReadRecord(loggedUserId(), 'users', callback);
}



function loadPage(page, callback) {
	$('#indexCenterPage').load(page, callback);
}



function logOut() {
	loggedUserId(undefined);
	loadPage('login_page.html');
	$('#indexNavWrapper').html('');
}



function buttonAction(button, page, callback) {
	$(button).click(function() {
		loadPage(page, callback);
	});
}



function setLoginAction() {
	$('#loginButton').click(function() {
		var username = $('#loginUsername').val();
		var password = $('#loginPassword').val();

		dbUserLogin(username, password, function(result) {
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
					loadNavbar(result.data[0]);
				});
			}
			else {
				alert('Informações de login inválidas.');
				// TODO Escrever na pagina que o login deu errado
				// ID: loginError
			}
		});
	});
}



function loadNavbar(user_data) {
	var first_name = user_data.name.split(' ')[0];
	$('#navUsername').html(first_name);

	if(user_data.is_admin) {
		adminNavbar();
	}
	else {
		customerNavbar();
	}

	$('#navLogout').click(logOut);
}



function customerNavbar() {
	buttonAction('#cNavProfile', 'Cliente/perfil.html', customerProfile);
	buttonAction('#cNavAnimals', 'Cliente/situacaoAnimais.html', customerAnimals);
	buttonAction('#cNavShop', 'Cliente/loja.html');
	buttonAction('#cNavServices', 'Cliente/horarioServico.html');
	buttonAction('#cNavCart', 'Cliente/carrinho.html');
}



function customerAnimals() {


	dbReadFromIndex(loggedUserId(), 'animals', 'owner', function(result) {
		var table_html = '';

		function td(content) {
			table_html += '<td>' + content + '</td>';
		}

		function img(src, alt) {
			return '<img src="' + src + '" alt="' + alt + '" height=30 width=30>';
		}

		if(result.success) {
			result.data.forEach(function(elem) {
				console.log(elem);
				table_html += '<tr>';
				td(img(elem.photo, elem.name));
				td(elem.name);
				td(elem.breed);
				td(elem.age + ' anos');
				td('-');
				td('-');
				td('-');
				table_html += '</tr>';
			});
		}

		$('#cAnimalTable').html(table_html);
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
		$("#indexCenterPage").load("Admin/estatisticas.html",function() {
      $("#tableDiv").load("dataTable.html");
    });
	});

	$(document).on("click", "input#inputBuscaCliente", function() {
		$("#indexCenterPage").load("Admin/alteraExcluiUsuario.html");
	});
});






