/* File: customer/shop.js
 * Authors:
 * Hugo Moraes Dzin, 8532186
 * Matheus Gomes da Silva Horta, 8532321
 * Rogiel dos Santos Silva, 8061793
 */

console.log('Executing customer/shop.js');



function _shopArticle(record) {
	var html = '';

	html += '<article class="item">';

	html += '<img class="img-reponsive" ';
	html += 'src="' + record.photo + '" ';
	html += 'alt="' + record.name  + '" />';

	html += '<p>'    + record.name  + '</p>';
	html += '<p>R$ ' + record.price + '</p>';

	html += '</article>';

	return html;
}



function customerShop() {
	dbReadAllRecords('products', function(result) {
		if(result.success)
		{
			result.data.forEach(function (product) {
				console.log(product);
				$('#cShopProducts').append(_shopArticle(product));
			});
		}
	});
}



function loadShopProducts() {

}
