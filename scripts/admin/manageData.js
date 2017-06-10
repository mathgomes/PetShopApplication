/* File: admin/manageData.js
 * Authors:
 * Hugo Moraes Dzin, 8532186
 * Matheus Gomes da Silva Horta, 8532321
 * Rogiel dos Santos Silva, 8061793
 */

console.log('Executing admin/manageData.js');



function createUserContainer() {
	var new_object = {
		is_admin: 	($('#admAddRadio').is(':checked')) ? true : false,
		username:  	$('#admUserName2').val(),
		password: 	$('#admProfileNewPass2').val(),
		name:   	$('#admProfileName2').val(),
		phone:   	$('#admProfilePhone2').val(),
		email:   	$('#admProfileEmail2').val(),
		address:   	$('#admProfileAddress2').val(),
		photo: 		'images/perfil.jpg',
	};
	return new_object;
}

function createProdContainer() {
	var new_object = {
		name:  			$('#admProdName').val(),
		price:   		parseFloat($('#admProdPrice').val()),
		stock:   		parseInt($('#admProdStock').val()),
		sold_amount:   	parseInt($('#admProdSold').val()),
		total_income:   0,
		decription:   	$('#admProdDesc').val(),
		photo: 			'images/produtos/osso.jpg',
	};
	return new_object;
}

function createServContainer() {
	var new_object = {
		name:  			$('#admServName').val(),
		price:   		parseFloat($('#admServPrice').val()),
		sold_amount:   	0,
		total_income:   0,
		decription:   	$('#admServDesc').val(),
		photo: 			'images/servico/tosa.jpg',
	};
	return new_object;
}


function adminAddData(tableName) {
	if(tableName === 'users') {
		$('#admAddUser2').click(function() {
			createObject(tableName,'#admUserTable', userTableRow, createUserContainer());
		});
	}
	else if(tableName === 'products') {
		$('#admProdAdd').click(function() {
			createObject(tableName,'#admProdsTable', prodTableRow, createProdContainer());
		});
	}
	else if(tableName === 'services') {
		$('#admServAdd').click(function() {
			createObject(tableName,'#admServsTable', servTableRow, createServContainer());
		});
	}
}

function adminSearchData(tableName) {
	if(tableName === 'users') {
		refreshTable(tableName,'#admUserTable',userTableRow)
	}
	else if(tableName === 'products') {
		refreshTable(tableName,'#admProdsTable',prodTableRow)
	}
	else if(tableName === 'services') {
		refreshTable(tableName,'#admServsTable',servTableRow)
	}
}

function adminRemoveData(tableName) {
	if(tableName === 'users') {

	}
	else if(tableName === 'products') {

	}
	else if(tableName === 'services') {
		
	}
}
function adminAlterData(tableName) {
	if(tableName === 'users') {

	}
	else if(tableName === 'products') {

	}
	else if(tableName === 'services') {
		
	}
}

function td(content) {
	return '<td>' + content + '</td>';
}

function img(src, alt) {
	return '<img src="' + src + '" alt="' + alt + '" class="img-responsive foto">';
}

function button(onclick) {
	return '<input type="button" value="Apagar" onclick="' + onclick + '">';
}

function userTableRow(user, tableName, tableID) {
	var html = '';

	html += '<tr>';
	html += td(img(user.photo, user.name));
	html += td(user.username);
	html += td(user.name);
	html += td(user.phone);
	html += td(user.email);
	if(!user.is_admin) {html += td(user.address);}
	html += '</tr>';
	return html;
}

function prodTableRow(product, tableName, tableID) {
	var html = '';

	html += '<tr>';
	html += td(img(product.photo, product.name));
	html += td(product.name);
	html += td(product.price);
	html += td(product.stock);
	html += td(product.sold_amount);
	html += td(product.total_income);
	html += td(product.description);
	html += '</tr>';
	return html;
}

function servTableRow(service, tableName, tableID) {
	var html = '';

	html += '<tr>';
	html += td(img(service.photo, service.name));
	html += td(service.name);
	html += td(service.price);
	html += td(service.sold_amount);
	html += td(service.total_income);
	html += td(service.description);
	html += '</tr>';
	return html;
}


function refreshTable(tableName, tableID, tableRow) {
	$(tableID).html('');
	dbReadAllRecords(tableName, function(result) {
		if(result.success) {
			result.data.forEach(function(object) {
				$(tableID).append(tableRow(object, tableName, tableID));
			});
		}
	});	
}


function deleteObject(objectID, tableName, tableID, tableRow)
{
	dbDeleteRecord(objectID, tableName, function(result) {
		if(result.success) {
			alert('Objeto apagado com sucesso.');
		}
		else {
			alert('Erro ao apagar Objeto.');
			console.log('deleteObject:', result.error);
		}

		refreshTable(tableName,tableID,tableRow);
	});
}

function createObject(tableName, tableID, tableRow, obj) {

	new_object = obj;
	dbCreateRecord(new_object, tableName, function(result) {
		if(result.success == false) {
			alert('Erro ao criar objeto');
		}
		else {
			refreshTable(tableName,tableID,tableRow);
		}
	});
}