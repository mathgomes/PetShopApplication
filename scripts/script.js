/*
 File: script.js
 Authors:
 Hugo Moraes Dzin, 8532186
 Matheus Gomes da Silva Horta, 8532321
 Rogiel dos Santos Silva, 8061793
 */
$(document).ready(function() {
	//Client
	/*	$("input#login").click(function(){
	 $("section#center_page").load("Cliente/funcoesCliente.html");
	 $(".wrapper").css("display", "block");
	 $(".wrapper .client").css("display", "block");
	 });*/
	$(document).on("click", "a#perfil", function() {
		$("section#center_page").load("Cliente/perfil.html");
	});
	$(document).on("click", "a#animais", function() {
		$("section#center_page").load("Cliente/situacaoAnimais.html");
	});
	$(document).on("click", "a#loja", function() {
		$("section#center_page").load("Cliente/loja.html");
	});
	$(document).on("click", "a#servicos", function() {
		$("section#center_page").load("Cliente/horarioServico.html");
	});
	$(document).on("click", "a#carrinho", function() {
		$("section#center_page").load("Cliente/carrinho.html");
	});
	//Admin

	 $("input#login").click(function(){
	 	$("section#center_page").load("Admin/funcoesAdmin.html");
		$("#nav_wrapper").load("Admin/navbar.html");
	 });
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
		$("section#center_page").load("Admin/cadastroProduto.html");
	});
	$(document).on("click", "a#cadastrarServico", function() {
		$("section#center_page").load("Admin/registroServico.html");
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

