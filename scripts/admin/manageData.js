/* File: admin/manageData.js
 * Authors:
 * Hugo Moraes Dzin, 8532186
 * Matheus Gomes da Silva Horta, 8532321
 * Rogiel dos Santos Silva, 8061793
 */

console.log('Executing admin/manageData.js');


/*
Functions that create objects from user inputs
function createUserContainer()
function createProdContainer()
function createServContainer()
*/
function createUserContainer() {
	var new_object = {
		is_admin : ($('#admAddRadio').is(':checked')) ? true : false,
		username : $('#admUserName2').val(),
		password : $('#admProfileNewPass2').val(),
		name : $('#admProfileName2').val(),
		phone : $('#admProfilePhone2').val(),
		email : $('#admProfileEmail2').val(),
		address : $('#admProfileAddress2').val(),
		photo : 'images/perfil.jpg',
	};
	return new_object;
}

function createProdContainer() {
	var new_object = {
		name : $('#admProdName').val(),
		price : parseFloat($('#admProdPrice').val()),
		stock : parseInt($('#admProdStock').val()),
		sold_amount : parseInt($('#admProdSold').val()),
		total_income : 0,
		decription : $('#admProdDesc').val(),
		photo : 'images/produtos/osso.jpg',
	};
	return new_object;
}

function createServContainer() {
	var new_object = {
		name : $('#admServName').val(),
		price : parseFloat($('#admServPrice').val()),
		sold_amount : 0,
		total_income : 0,
		decription : $('#admServDesc').val(),
		photo : 'images/servico/tosa.jpg',
	};
	return new_object;
}


/*
Call the function that adds an object to the database based on whats selected
function adminAddData(tableName)
	tableName -> name of the table body to display the data
*/
function adminAddData(tableName) {

	if (tableName === 'users') {
		$('#admAddUser2').click(function() {
			createObject(tableName, '#admUserTable', userTableRow, createUserContainer());
		});
	} else if (tableName === 'products') {
		$('#admProdAdd').click(function() {
			createObject(tableName, '#admProdsTable', prodTableRow, createProdContainer());
		});
	} else if (tableName === 'services') {
		$('#admServAdd').click(function() {
			createObject(tableName, '#admServsTable', servTableRow, createServContainer());
		});
	}
}

function adminSearchData(tableName) {
	if (tableName === 'users') {
		refreshTable(tableName, '#admUserTable', userTableRow)
	} else if (tableName === 'products') {
		refreshTable(tableName, '#admProdsTable', prodTableRow)
	} else if (tableName === 'services') {
		refreshTable(tableName, '#admServsTable', servTableRow)
	}
}

function td(content) {
	return '<td>' + content + '</td>';
}

function img(src, alt) {
	return '<img src="' + src + '" alt="' + alt + '" class="img-responsive foto  " contenteditable = false >';
}

function buttonApagar(onclick) {
	return '<input type="button" value="Apagar" onclick="' + onclick + '">';
}

function buttonAlterar(onclick) {
	return '<input type="button" value="Alterar" onclick="' + onclick + '">';
}

/*
Functions that create a new <tr> tag containing all information 
of an object to be displayed

function userTableRow(user, tableName, tableID)
function prodTableRow(product, tableName, tableID)
function servTableRow(service, tableName, tableID)
*/
function userTableRow(user, tableName, tableID) {
	var html = '';

	html += '<tr>';
	html += td(img(user.photo, user.name));
	html += td(user.username);
	html += td(user.name);
	html += td(user.phone);
	html += td(user.email);

	if (user.id != 1) {// mostra apagar somente se for diferente de admin

		html += td(user.address);
		html += td(buttonApagar('deleteUser(' + user.id + ')'));
		html += td(buttonAlterar('alterUser(' + user.id + ')'));
	}
	html += '</tr>';
	cellClick('#admUserTable');

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
	html += td(buttonApagar('deleteProd(' + product.id + ')'));
	html += td(buttonAlterar('alterProd(' + product.id + ')'));
	html += '</tr>';
	cellClick('#admProdsTable');
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
	html += td(buttonApagar('deleteServico(' + service.id + ')'));
	html += td(buttonAlterar('alterServico(' + service.id + ')'));
	html += '</tr>';
	cellClick('#admServsTable');

	return html;
}


/*
Refreshes the table by displaying all data of a collection of objects
function refreshTable(tableName, tableID, tableRow)
*/
function refreshTable(tableName, tableID, tableRow) {
	$(tableID).html('');
	dbReadAllRecords(tableName, function(result) {
		if (result.success) {
			result.data.forEach(function(object) {
				$(tableID).append(tableRow(object, tableName, tableID));
			});
		}
	});
}

function deleteUser(user_id) {
	dbDeleteRecord(user_id, 'users', function(result) {
		if (result.success) {
			alert('Usuário apagado com sucesso.');
		} else {
			alert('Erro ao apagar Usuário.');
			console.log('deleteObject:', result.error);
		}
		refreshTable('users', '#admUserTable', userTableRow);
	});
}

function alterUser(user_id) {

	var username,
	    name,
	    email,
	    phone,
	    address;

	$("tr").click(function() {
		$(this).find('td').each(function(i) {
			$th = $("thead th")[i];
			//console.log(jQuery($th).text() + ": " + $(this).html())

			switch(jQuery($th).text()) {

			case 'Username':
				username = $(this).html();
				break;
			case 'Nome':
				name = $(this).html();
				break;
			case 'Email':
				email = $(this).html();
				break;
			case 'Telefone':
				phone = $(this).html();
				break;
			case 'Endereço':
				address = $(this).html();
				break;
			default:
				break;

			}

		});
	});

	dbReadRecord(user_id, 'users', function(result) {
		if (result.success == false)
			return;

		var user = result.data;
		// resultado da busca
		user.username = username;
		user.name = name;
		user.phone = phone;
		user.email = email;
		user.address = address;

		dbUpdateRecord(user, 'users', function(result) {//salva no banco de dados
			if (result.success == true)
				alert("Usuário alterado com sucesso");
			else
				alert("Usuário não alterado");

		});

	});
}

function deleteProd(product_id) {
	dbDeleteRecord(product_id, 'products', function(result) {
		if (result.success) {
			alert('Produto apagado com sucesso.');
		} else {
			alert('Erro ao apagar produto.');
			console.log('deleteObject:', result.error);
		}
		refreshTable('products', '#admProdsTable', prodTableRow)

	});
}

function alterProd(product_id) {

	var name,
	    description,
	    price,
	    stock;

	$("tr").click(function() {
		$(this).find('td').each(function(i) {
			$th = $("thead th")[i];

			switch(jQuery($th).text()) {

			case 'Name':
				name = $(this).html();
				break;
			case 'Preço':
				price = $(this).html();
				break;
			case 'Estoque':
				stock = $(this).html();
				break;
			case 'Descrição':
				description = $(this).html();
				break;
			
			default:
				break;

			}

		});
	});

	dbReadRecord(product_id, 'products', function(result) {
		if (result.success == false)
			return;

		var product = result.data;
		// resultado da busca
		product.name = name;
		product.description = description;
		product.price = parseFloat(price);
		product.stock = parseInt(stock);

		dbUpdateRecord(product, 'products', function(result) {//salva no banco de dados
			if (result.success == true)
				alert("Produto alterado com sucesso");
			else
				alert("Produto não alterado");

		});

	});
}

function deleteServico(service_id) {

	dbDeleteRecord(service_id, 'services', function(result) {
		if (result.success) {
			alert('Produto apagado com sucesso.');
		} else {
			alert('Erro ao apagar produto.');
			console.log('deleteObject:', result.error);
		}
		refreshTable('services', '#admServsTable', servTableRow)

	});
}

function alterServico(servico_id) {

	var name,
	    description,
	    price;

	$("tr").click(function() {
		$(this).find('td').each(function(i) {
			$th = $("thead th")[i];

			switch(jQuery($th).text()) {

			case 'Name':
				name = $(this).html();
				break;
			case 'Preço':
				price = $(this).html();
				break;
			case 'Descrição':
				description = $(this).html();
				break;
			default:
				break;

			}

		});
	});

	dbReadRecord(servico_id, 'services', function(result) {
		if (result.success == false)
			return;

		var service = result.data;
		// resultado da busca
		service.name = name;
		service.price = parseFloat(price);
		service.description = description;

		dbUpdateRecord(service, 'services', function(result) {//salva no banco de dados
			if (result.success == true)
				alert("Serciço alterado com sucesso");
			else
				alert("Serviço não alterado");

		});

	});
}

function createObject(tableName, tableID, tableRow, obj) {

	new_object = obj;
	dbCreateRecord(new_object, tableName, function(result) {
		if (result.success == false) {
			alert('Erro ao criar objeto');
		} else {
			refreshTable(tableName, tableID, tableRow);
		}
	});

}

function cellClick(idTabela) {// torna a tabela clicavel

	$(idTabela).on({
		'dblclick' : function() {
			$(this).prop('contenteditable', true);
		},
		'blur' : function() {
			$(this).prop('contenteditable', false);
		}
	});
}
