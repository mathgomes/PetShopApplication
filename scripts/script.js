/* File: script.js
 * Authors:
 * Hugo Moraes Dzin, 8532186
 * Matheus Gomes da Silva Horta, 8532321
 * Rogiel dos Santos Silva, 8061793
 */


function setLoginAction() {
	$('#indexLoginButton').click(function() {
		var username = $('#indexUsername').val();
		var password = $('#indexPassword').val();

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
				$('#indexCenterPage').load(page);
				$('#indexNavWrapper').load(navbar, function() {
					$('#username').html(username);
				});
			}
			else {
				// TODO Escrever na pagina que o login deu errado
			}
		});
	});
}



$(document).ready(function() {
	dbInit();

	setLoginAction();
	//Customer
	$(document).on("click", "a#perfil", function() {
		$("#indexCenterPage").load("Cliente/perfil.html");
	});


	$(document).on("click", "a#animais", function() {
		$("#indexCenterPage").load("Cliente/situacaoAnimais.html");
	});


	$(document).on("click", "a#loja", function() {
		$("#indexCenterPage").load("Cliente/loja.html");
	});
	$(document).on("click", ".item img", function() {
		$("#indexCenterPage").load("Cliente/compraProduto.html");
	});
	$(document).on("click", "#purchaseForm #confirm", function() {
		$("#indexCenterPage").load("Cliente/carrinho.html");
	});
	$(document).on("click", ".carrinho_opcoes #checkout", function() {
		$("#indexCenterPage").load("Cliente/checkout.html");
	});


	$(document).on("click", "a#servicos", function() {
		$("#indexCenterPage").load("Cliente/horarioServico.html");
	});


	$(document).on("click", "a#carrinho", function() {
		$("#indexCenterPage").load("Cliente/carrinho.html");
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






