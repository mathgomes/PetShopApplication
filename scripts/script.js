/* File: script.js
 * Authors:
 * Hugo Moraes Dzin, 8532186
 * Matheus Gomes da Silva Horta, 8532321
 * Rogiel dos Santos Silva, 8061793
 */

console.log('Executing script.js');



// For website testing
function _0() {
	$('#loginUsername').val('hdzin');
	$('#loginPassword').val('1');
	$('#loginButton').click();
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
	loadPage('login_page.html', setLoginAction);
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
			return '<img src="' + src + '" alt="' + alt + '" class="img-responsive fotoAnimal">';
		}

		function button(onclick)
		{
			return '<input type="button" value="Apagar" onclick="' + onclick + '">';
		}

		if(result.success) {
			result.data.forEach(function(animal) {
				table_html += '<tr>';
				td(img(animal.photo, animal.name));
				td(animal.name);
				td(animal.breed);
				td(animal.age + ' anos');
				td('-'); // TODO fazer quando servicos estiverem funcionando
				td('-'); // TODO esse tambem
				td(button('deleteAnimal(' + animal.id + ')'));
				table_html += '</tr>';
			});
		}

		$('#cAnimalTable').html(table_html);
	});
}



function deleteAnimal(animal_id)
{
	dbDeleteRecord(animal_id, 'animals', function(result) {
		// Update animal table
		customerAnimals();

		if(result.success) {
			alert('Animal apagado com sucesso.');
		}
		else {
			alert('Erro ao apagar animal.');
			console.log('deleteAnimal:', result.error);
		}
	});
}



$(document).ready(function() {
	dbInit();

	loadPage('login_page.html', setLoginAction);

	//Customer
	//MEXENDO NISSO AQUI
	/*
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
		$("#indexCenterPage").load("Admin/buscarUsuario.html",function() {
      $("#tableDiv").load("dataTable.html");
    });
	});
  $(document).on("click", "a#buscarProduto", function() {
    $("#indexCenterPage").load("Admin/buscarProduto.html",function() {
      $("#tableDiv").load("dataTable.html");
    });
  });
  $(document).on("click", "a#buscarServico", function() {
    $("#indexCenterPage").load("Admin/buscarServico.html",function() {
      $("#tableDiv").load("dataTable.html");
    });
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






