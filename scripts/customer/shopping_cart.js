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

	});

	refreshCart();
}



function cartItemHtml(product, amount)
{
	var html = '';

	function td(content) {
		html += '<td>' + content + '</td>';
	}

	html += '<tr>';
	td('<img src="' + product.photo + '">');
	td(product.name);
	td('R$ ' + product.price);
	td('<input type="number" value="' + amount + '">');
	td('<input type="button" value="Remover">');
	html += '</tr>';

	return html;
}



function refreshCart() {
	$('#cCartItems').html('');

	dbReadFromIndex(loggedUserId(), 'cartitems', 'user', function(result) {
		if(result.success == false) {
			return
		}

		result.data.forEach(function(item) {
			dbReadRecord(item.product, 'products', function(result) {
				if(result.success == false) {
					return;
				}

				var product = result.data;
				$('#cCartItems').append(cartItemHtml(product, item.amount));
			});
		});
	});
}
