/* File: scripts/customer.js
 * Authors:
 * Hugo Moraes Dzin, 8532186
 * Matheus Gomes da Silva Horta, 8532321
 * Rogiel dos Santos Silva, 8061793
 */

console.log('Executing scripts/customer.js');



function checkoutPage() {
	$('#cFinishPurchase').click(checkoutFinish);
	refreshCart(false);
}



function checkoutFinish() {
	dbReadFromIndex(loggedUserId(), 'cartitems', 'user', function(result) {
		if(result.success == false) {
			return; // Reduce nesting
		}

		var total = result.data.length;
		var completed = 0; // Incremented when a product is updated

		// Update the stock, sold amount and income of the purchased products
		result.data.forEach(function(cart_item) {
			dbReadRecord(cart_item.product, 'products', function(result) {
				if(result.success == false) {
					return; // Reduce nesting
				}

				var product = result.data;
				updateProductRecord(product, cart_item);

				dbUpdateRecord(product, 'products', function(result) {
					completed += 1;
					if(completed == total) {
						finishPurchase();
					}
				});
			});
		});

	});
}



function updateProductRecord(product, cart_item) {
	if(product.stock > cart_item.amount) {
		cart_item.amount = product.stock;
	}

	product.stock -= cart_item.amount;
	product.sold_amount += cart_item.amount;
	product.total_income += product.price * cart_item.amount;
}



function finishPurchase() {
	alert('Compra realizada com sucesso.');
	$('#cNavShop').click();

	// Empty shopping cart
	dbDeleteAllFromIndex(loggedUserId(), 'cartitems', 'user', function(result) {

	});
}
