/* File: customer/shopping_cart.js
 * Authors:
 * Hugo Moraes Dzin, 8532186
 * Matheus Gomes da Silva Horta, 8532321
 * Rogiel dos Santos Silva, 8061793
 */

console.log('Executing customer/shopping_cart.js');



function customerShoppingCart() {
	$('#cBackToShop').click(function() {
		$('#cNavShop').click();
	});

	$('#cEmptyCart').click(function() {
		dbDeleteAllFromIndex(loggedUserId(), 'cartitems', 'user', function(result) {
			if(result.success) {
				refreshCart(true);
			}
		});
	});

	$('#cGoToCheckout').click(function() {
		dbReadFromIndex(loggedUserId(), 'cartitems', 'user', function(result) {
			if(result.success && result.data.length > 0) {
				loadPage('Cliente/checkout.html', checkoutPage);
			}
			else {
				alert('Seu carrinho está vazio.');
			}
		});
	});

	refreshCart(true);
}


// Used by shopping cart and checkout pages:
// shopping cart: enable_inputs = true
// checkout: enable_inputs = false
function refreshCart(enable_inputs) {
	cartUpdateTotal();
	$('#cCartItems').html('');

	dbReadFromIndex(loggedUserId(), 'cartitems', 'user', function(result) {
		if(result.success == false) {
			return; // reduce nesting
		}

		result.data.forEach(function(item) {
			dbReadRecord(item.product, 'products', function(result) {
				if(result.success == false) {
					return; // reduce nesting
				}

				var product = result.data;
				$('#cCartItems').append(cartItemHtml(product, item.amount, enable_inputs));
			});
		});
	});
}



// Used by shopping cart and checkout pages:
// shopping cart: enable_inputs = true
// checkout: enable_inputs = false
function cartItemHtml(product, amount, enable_inputs)
{
	var html = '';

	function td(content) {
		html += '<td>' + content + '</td>';
	}

	html += '<tr id="cCartItem' + product.id + '">';
	td('<img src="' + product.photo + '">');
	td(product.name);
	td('R$ ' + product.price.toFixed(2));

	if(enable_inputs) {
		td(
			'<input type="number" value="' + amount + '" ' +
				'onchange="cartChangeAmount(' + product.id + ')">');
		td(
			'<input type="button" value="Remover" ' +
				'onclick="cartRemoveProduct(' + product.id + ')">');
	}
	else {
		td(amount);
	}

	html += '</tr>';

	return html;
}



function cartChangeAmount(product_id) {
	// Get new amount
	var element = $('#cCartItem' + product_id + ' input[type="number"]');
	var amount = parseInt(element.val());

	// Check if amount is valid and update cart item
	dbReadRecord(product_id, 'products', function(result) {
		if(result.success == false) {
			cartRemoveProduct(product_id);
		}

		var product = result.data;

		if(amount > product.stock) {
			amount = product.stock;
			element.val(amount);
		}

		if(amount <= 0) {
			cartRemoveProduct(product_id);
		}
		else {
			cartUpdateRecord(product_id, amount);
		}
	});
}



function cartUpdateRecord(product_id, amount) {
	dbReadFromIndex(loggedUserId(), 'cartitems', 'user', function(result) {
		if(result.success) {
			var item = result.data.find(function(elem) {
				return elem.product == product_id;
			});

			item.amount = amount;

			dbUpdateRecord(item, 'cartitems', function(result) {
				if(result.success) {
					cartUpdateTotal();
				}
			});
		}
	});
}



function cartRemoveProduct(product_id) {
	// Remove record from db
	dbReadFromIndex(loggedUserId(), 'cartitems', 'user', function(result) {
		if(result.success) {
			var item = result.data.find(function(elem) {
				return elem.product == product_id;
			});

			dbDeleteRecord(item.id, 'cartitems', function(result) {
				if(result.success) {
					// Update DOM
					cartUpdateTotal();
					$('#cCartItem' + product_id).remove();
				}
			});
		}
	});
}



function cartUpdateTotal() {
	dbReadFromIndex(loggedUserId(), 'cartitems', 'user', function(result) {
		var total = 0.0;

		// No items -> total = 0
		if(result.success == false || result.data.length == 0) {
			$('#cCartTotal').html(total.toFixed(2));
			return;
		}

		// Calculate item price * amount
		result.data.forEach(function(item, index, array) {
			dbReadRecord(item.product, 'products', function(result) {
				if(result.success == false) {
					return;
				}

				var product = result.data;

				total += item.amount * product.price;

				if(index == array.length - 1) {
					// Last item -> update DOM
					$('#cCartTotal').html(total.toFixed(2));
				}
			});
		});
	});
}
