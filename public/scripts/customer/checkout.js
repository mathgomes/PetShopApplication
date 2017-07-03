/* File: scripts/customer.js
 * Authors:
 * Hugo Moraes Dzin, 8532186
 * Matheus Gomes da Silva Horta, 8532321
 * Rogiel dos Santos Silva, 8061793
 */

console.log('Executing scripts/customer.js');



function checkoutPage() {
	$('#cFinishPurchase').click(checkoutFinish);
	// Esse 'false' eh para nao aparecer as opcoes de mudar quantidade ou
	// de remover do carrinho. A funcao esta definida em shopping_cart.js
	refreshCart(false);
}



function checkoutFinish() {
	dbReadFromIndex(loggedUserId(), 'cartitems', 'user', function(result) {
		if(result.success == false) {
			return;
		}

		// O trecho a seguir atualiza cada cadastro de produto, modificando
		// estoque, quantidade vendida e lucro
		var total = result.data.length;
		var completed = 0;

		result.data.forEach(function(cart_item) {
			dbReadRecord(cart_item.product, 'products', function(result) {
				if(result.success == false) {
					return;
				}

				var product = result.data;
				updateProductRecord(product, cart_item);

				dbUpdateRecord(product, 'products', function(result) {
					completed += 1;
					if(completed == total) {
						// Atualizou todo mundo
						finishPurchase();
					}
				});
			});
		});

	});
}



// Atualiza os dados de estoque, qtde vendida e lucro total do produto
function updateProductRecord(product, cart_item) {
	if(cart_item.amount < 0) {
		cart_item.amount = 0;
	}
	if(cart_item.amount > product.stock) {
		cart_item.amount = product.stock;
	}

	product.stock -= cart_item.amount;
	product.sold_amount += cart_item.amount;
	product.total_income += product.price * cart_item.amount;
}


// Limpa o carrinho, mostra uma mensagem de sucesso e volta pra loja
function finishPurchase() {
	dbDeleteAllFromIndex(loggedUserId(), 'cartitems', 'user', function(result) {
		alert('Compra realizada com sucesso.');
		$('#cNavShop').click();
	});
}
