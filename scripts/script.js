/* File: script.js
 * Authors:
 * Hugo Moraes Dzin, 8532186
 * Matheus Gomes da Silva Horta, 8532321
 * Rogiel dos Santos Silva, 8061793
 */

console.log('Executing script.js');



function _go() {
	$('#loginUsername').val('hdzin');
	$('#loginPassword').val('1');
	$('#loginButton').click();

	setTimeout(function() {
		$('#cNavCart').click();
	}, 1000);
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



// Sends the user back to the login page
function logOut() {
	loggedUserId(undefined);
	loadPage('login_page.html', setLoginAction);
	$('#indexNavWrapper').html('');
}



// Changes the page content, but not the header, navbar and footer
function loadPage(page, callback) {
	$('#indexCenterPage').load(page, callback);
}



function onClickLoadPage(button, page, callback) {
	$(button).click(function() {
		loadPage(page, callback);
	});
}



function fileReaderCallback(unique_selector, callback) {
	var file = $(unique_selector).prop('files')[0];
	if(file) {
		var fr = new FileReader();
		fr.onload = callback;
		fr.readAsDataURL(file);
	}
	else {
		alert('Especifique um arquivo!');
	}
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
	// Each element contains:
	//  [0] element id of the button
	//  [1] html page to be redirected to
	//  [2] callback that will be invoked after the page loads
	var button_actions = [
		['#cNavProfile', 'Cliente/perfil.html', customerProfile],
		['#cNavAnimals', 'Cliente/situacaoAnimais.html', customerAnimals],
		['#cNavShop', 'Cliente/loja.html', customerShop],
		['#cNavServices', 'Cliente/horarioServico.html', undefined],
		['#cNavCart', 'Cliente/carrinho.html', customerShoppingCart],
	];

	button_actions.forEach(function(args) {
		onClickLoadPage(args[0], args[1], args[2]);
	});
}



function adminNavbar() {
	// copy and paste from customerNavbar?
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
	});



	$(document).on("click", ".item img", function() {
		$("#indexCenterPage").load("Cliente/compraProduto.html");
	});
	$(document).on("click", "#purchaseForm #confirm", function() {
		$("#indexCenterPage").load("Cliente/carrinho.html");
	});
	$(document).on("click", ".carrinho_opcoes #checkout", function() {
		$("#indexCenterPage").load("Cliente/checkout.html");
	});*/




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






