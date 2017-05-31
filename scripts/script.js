/* File: script.js
 * Authors:
 * Hugo Moraes Dzin, 8532186
 * Matheus Gomes da Silva Horta, 8532321
 * Rogiel dos Santos Silva, 8061793
 */


function setLoginAction() {
	$('input#login').click(function() {
		var username = $('input#username').val();
		var password = $('input#password').val();

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
				$('section#center_page').load(page);
				$('#nav_wrapper').load(navbar, function() {
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
		$("section#center_page").load("Cliente/perfil.html");
	});


	$(document).on("click", "a#animais", function() {
		$("section#center_page").load("Cliente/situacaoAnimais.html");
	});


	$(document).on("click", "a#loja", function() {
		$("section#center_page").load("Cliente/loja.html");
	});
	$(document).on("click", ".item img", function() {
		$("section#center_page").load("Cliente/compraProduto.html");
	});
	$(document).on("click", "#purchaseForm #confirm", function() {
		$("section#center_page").load("Cliente/carrinho.html");
	});
	$(document).on("click", ".carrinho_opcoes #checkout", function() {
		$("section#center_page").load("Cliente/checkout.html");
	});


	$(document).on("click", "a#servicos", function() {
		$("section#center_page").load("Cliente/horarioServico.html");
	});


	$(document).on("click", "a#carrinho", function() {
		$("section#center_page").load("Cliente/carrinho.html");
	});


	//Admin

	$(document).on("click", "a#perfilAdm", function() {
		$("section#center_page").load("Admin/perfil.html");
	});


	$(document).on("click", "a#cadastrarUsuario", function() {
		$("section#center_page").load("Admin/cadastrarUsuario.html");
	});


	$(document).on("click", "a#buscarUsuario", function() {
		$("section#center_page").load("Admin/buscarUsuario.html");
	});


	$(document).on("click", "a#cadastrarProduto", function() {
		$("section#center_page").load("Admin/cadastrarProduto.html");
	});


	$(document).on("click", "a#cadastrarServico", function() {
		$("section#center_page").load("Admin/cadastrarServico.html");
	});


	$(document).on("click", "a#ganhos", function() {
		$("section#center_page").load("Admin/estatisticas.html", function(data) {
			$('#example').DataTable();
		});
	});

	$(document).on("click", "input#inputBuscaCliente", function() {
		$("section#center_page").load("Admin/alteraExcluiUsuario.html");
	});
});






