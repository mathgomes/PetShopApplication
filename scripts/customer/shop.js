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

	html += '<article class="item" ';
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

					if(target.val() < 0) {
						target.val(0);
					}
					else if(target.val() > product.stock) {
						target.val(product.stock);
					}
				});

				$('#cAddToCart').click(function() {
					var amount = parseInt($('#cPurchaseAmount').val(), 10);
					goToCart(product.id, amount);
				});
			}
		});
	});
}



// Adds the product and its amount to the user's shopping cart,
// then loads the shopping cart page
function goToCart(product_id, amount) {
	console.log(product_id, amount);
}
