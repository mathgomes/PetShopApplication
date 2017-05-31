/* File: script.js
 * Authors:
 * Hugo Moraes Dzin, 8532186
 * Matheus Gomes da Silva Horta, 8532321
 * Rogiel dos Santos Silva, 8061793
 */

$(document).ready(function() {
	dbInit();

	$('input#login').click(function() {
		var username = $('input#username').val();
		var password = $('input#password').val();

		console.log(username);
		console.log(password);

		dbUserLogin(username, password, function(result) {
			console.log(result);
			if(result.success) {
				if(result.data[0].is_admin) {
					$("section#center_page").load("Admin/funcoesAdmin.html");
					$("#nav_wrapper").load("Admin/navbar.html");
				}
				else {
					$("section#center_page").load("Cliente/funcoesCliente.html");
					$("#nav_wrapper").load("Cliente/navbar.html");
				}
			}
			else {
				// Escrever na pagina que o login deu errado
			}
		});
	});

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






