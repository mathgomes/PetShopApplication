/* File: customer/shop.js
 * Authors:
 * Hugo Moraes Dzin, 8532186
 * Matheus Gomes da Silva Horta, 8532321
 * Rogiel dos Santos Silva, 8061793
 */

console.log('Executing customer/shop.js');

// TODO busca
// TODO paginas

// Creates a product <article> element.
function shopArticle(product) {
	var html = '';

	html += '<article class="item container-fluid" ';
	html += 'onclick="productPage(' + product.id + ')">';

	html += '<img class="img-reponsive" ';
	html += 'src="' + product.photo + '" ';
	html += 'alt="' + product.name  + '" />';

	html += '<p>'    + product.name  + '</p>';
	html += '<p>R$ ' + product.price + '</p>';

	html += '</article>';

	return html;
}



// Reads all products from the database and loads them on the page
function customerShop() {
	dbReadAllRecords('products', function(result) {
		if(result.success) {
			result.data.forEach(function (product) {
				$('#cShopProducts').append(shopArticle(product));
			});
		}
	});
}



// Called when the user clicks on a product. Loads the product's page
function productPage(product_id) {
	loadPage('Cliente/compraProduto.html', function() {
		dbReadRecord(product_id, 'products', function(result) {
			if(result.success) {
				var product = result.data;

				$('#cProductPhoto').attr('src', product.photo);

				$('#cProductTitle').html(product.name);
				$('#cProductDescription').html(product.description);
				$('#cProductPrice').html(product.price);
				$('#cProductStock').html(product.stock);

				$('#cPurchaseAmount').val(0);
				$('#cPurchaseAmount').change(function(event) {
					var target = $('#cPurchaseAmount');

					// Check if amount is valid
					if(target.val() < 0) {
						target.val(0);
					}
					else if(target.val() > product.stock) {
						target.val(product.stock);
					}
				});

				$('#cAddToCart').click(function() {
					var amount = parseInt($('#cPurchaseAmount').val(), 10);
					if(amount > 0) {
						addItemToCart(product.id, amount);
					}
					else {
						alert('Escolha uma quantidade maior que 0.');
					}
				});
			}
		});
	});
}


// Also redirects to the shopping cart page
function addItemToCart(product_id, new_amount, ) {
	dbReadFromIndex(loggedUserId(), 'cartitems', 'user', function(result) {
		if(result.success) {
			var cart_items = result.data;

			// See if the product already exists in the user's shopping cart
			var item = cart_items.find(function(elem) {
				return elem.product == product_id;
			});

			// Product not yet added to cart: create new object
			if(item == undefined) {
				item = {
					user: loggedUserId(),
					product: product_id,
					amount: new_amount,
				};

				dbCreateRecord(item, 'cartitems', shoppingCartPage);
			}
			// Product already exists: update amount
			else {
				// When the cart page gets loaded, this amount will be
				// verified to see if it doesnt overflow the product's stock
				item.amount += new_amount;
				dbUpdateRecord(item, 'cartitems', shoppingCartPage);
			}
		}
	});
}



function shoppingCartPage() {
	loadPage('Cliente/carrinho.html', function() {

	});
}
