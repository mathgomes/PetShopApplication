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

	$("input#login").click(function() {
		$("section#center_page").load("Admin/funcoesAdmin.html");
	});
	$(document).on("click", "a#perfilAdm", function() {
		$("section#center_page").load("Admin/perfil.html");
	});
	$(document).on("click", "a#cadastrarUsuario", function() {
		$("section#center_page").load("Admin/cadastrarUsuario.html");
	});

	/*
	 $(document).on("click","a#animais",function(){
	 $("section#center_page").load("Cliente/situacaoAnimais.html");
	 });
	 $(document).on("click","a#loja",function(){
	 $("section#center_page").load("Cliente/loja.html");
	 });
	 $(document).on("click","a#servicos",function(){
	 $("section#center_page").load("Cliente/horarioServico.html");
	 });
	 $(document).on("click","a#carrinho",function(){
	 $("section#center_page").load("Cliente/carrinho.html");
	 });*/
}); 