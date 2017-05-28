// TODO botar os nomes que nem os outros arquivos

// Functions and variables that start with _ are PRIVATE to this file

/* FUNCTIONS IMPLEMENTED SO FAR
 *  dbInit()
 *  dbDelete()
 *
 *  dbUserLogin(user, pass, callback)
 *  dbGetAnimals(owner, callback)
 *
 *  dbCreateUser(entry, callback)
 *  dbUpdateUser(username, updated_entry, callback)
 */

/* TABLE LIST
 * users:
 *   id:       auto-generated key
 *   is_admin: true or false
 *   username: string, unique
 *   password: string
 *   name:     string
 *   photo:    string (image URL)
 *   phone:    string
 *   email:    string, unique
 *   address:
 *     is_admin  -> undefined
 *     !is_admin -> string
 *
 * animals:
 *   id:    auto-generated key
 *   owner: id from table 'users'
 *   name:  string
 *   photo: string (image URL)
 *   breed: string
 *   age:   number
 *
 * products:
 *   id:          auto-generated key
 *   name:        string
 *   photo:       string (image URL)
 *   description: string
 *   price:       number
 *   stock:       number
 *   sold_amount: number
 *
 * services:
 *   id:          auto-generated key
 *   name:        string
 *   photo:       string (image URL)
 *   description: string
 *   price:       number
 *
 * timeslots:
 *   id:      auto-generated key
 *   date:    Date object
 *   time:    string in hh:mm format, unique key
 *   in_use:  true or false
 *   service: id from table 'services'
 *   animal:  id from table 'animals'
 *
 * shopping_carts:
 *   id:        auto-generated key
 *   user:      id from table 'users'
 *   items:     array of objects { product, amount }
 *   * product: id from table 'products'
 *   * amount:  number
 *
 * product_sales:
 *   id:      auto-generated key
 *   product: id from table 'products'
 *   price:   number
 *   amount:  number
 *
 * service_sales:
 *   id:      auto-generated key
 *   service: id from table 'services'
 *   price:   number
 */

function _test_cbk(result) {
	console.log('Test result callback');
	console.log(result);
}

var _test_entry = {
	address: 'rua 5 de maio',
	email: 'fulano@gmeio.com',
	is_admin: false,
	name: 'fulano da silva',
	password: '1234',
	photo: 'images/fulano.jpg',
	username: 'fsilva',
};

var DB_NAME = 'petshop';
var DB_VERSION = 1;


if(!window.indexedDB) {
    window.alert('No Indexed DB support');
}



function _dbErrorHandler(event) {
	console.log('Database error: ' + event.target.errorCode);
}



var _force_populate = true;
function dbInit() {
	var request = window.indexedDB.open(DB_NAME, DB_VERSION);
	var should_populate = _force_populate;

	request.onerror = _dbErrorHandler;

	request.onupgradeneeded = function(event) {
		console.log('dbInit:onupgradeneeded');
		var db = event.target.result;

		should_populate = true;
		_dbCreateTables(db);
	};

	request.onsuccess = function(event) {
		console.log('dbInit:onsuccess');
		var db = event.target.result;

		if(should_populate) {
			_dbPopulate(db);
		}
	};
}



function dbDelete() {
	var request = window.indexedDB.deleteDatabase(DB_NAME);

	request.onerror = _dbErrorHandler;

	request.onsuccess = function() {
		console.log('Database deleted: ' + DB_NAME);
	};
}



// Called by onupgradeneeded. Create object stores and indices
function _dbCreateTables(db) {

	// Shorthand functions
	function newStore(name) {
		return db.createObjectStore(name, {keyPath: 'id', autoIncrement: true});
	}

	function newIndex(store, field, is_unique) {
		store.createIndex(field, field, {unique: is_unique});
	}

	console.log('Creating tables');

	var users     = newStore('users');
	var animals   = newStore('animals');
	var products  = newStore('products');
	var services  = newStore('services');
	var timeslots = newStore('timeslots');
	var shopping_carts = newStore('shopping_carts');
	var product_sales  = newStore('product_sales');
	var service_sales  = newStore('service_sales');

	newIndex(users, 'username', true);
	newIndex(users, 'email', true);
	newIndex(animals, 'owner', false);
	newIndex(products, 'name', false);
	newIndex(services, 'name', false);
	newIndex(timeslots, 'date', false);
	newIndex(shopping_carts, 'user', true);
	newIndex(service_sales, 'service', false);
	newIndex(product_sales, 'product', false);
}



// Initialize database with data
function _dbPopulate(db) {
	console.log('Populating database');

	var trans = db.transaction(
		['users', 'animals', 'products', 'services', 'timeslots'],
		'readwrite');
	var users = trans.objectStore('users');

	var req = users.add({
		is_admin: true,
		username: 'admin',
		password: 'admin',
		name: 'Minhoca Gomes',
		photo: 'images/perfil.jpg',
		email: 'minhoca@petshop.com',
		address: undefined,
	});

	animals = trans.objectStore('animals');

	// Arrumar depois: nao tem todos os campos necessarios
	animals.add({
		owner: 1,
		name: 'frajola'
	});

	animals.add({
		owner: 1,
		name: 'piu piu'
	});

	animals.add({
		owner: 1,
		name: 'brutus'
	});
}




// Connects to the DB_NAME database and passes the
// requested store as argument to the callback
function _dbGetStore(objStore, mode, callback) {
	var request = window.indexedDB.open(DB_NAME);
	request.onerror = _dbErrorHandler;

	request.onsuccess = function(event) {
		var db = event.target.result;
		var transaction = db.transaction(objStore, mode);
		var store = transaction.objectStore(objStore);

		callback(store);
	}
}



// Connects to the DB_NAME database and passes the
// requested store and index as argument to the callback
function _dbGetIndex(objStore, indexName, mode, callback) {
	_dbGetStore(objStore, mode, function(store) {
		index = store.index(indexName);
		callback(store, index);
	});
}



// Sets callback functions for the request
// The callback will receive a {success, error} object
// On sucess -> {true, undefined}
// On error  -> {false, DOMException}
function _dbRequestResult(request, callback) {
	request.onsuccess = function(event) {
		callback({
			success: true,
			error: undefined
		});
	};

	request.onerror = function(event) {
		callback({
			success: false,
			error: event.target.error
		});
	};
}



// Returns a result object {success, error, data}
// On success -> {true, undefined, (user record)}
// On error   -> {false, 'LoginError', undefined}
function dbUserLogin(username, password, callback) {
	console.log('Login attempt: ' + username + ', ' + password);

	_dbGetIndex('users', 'username', 'readonly', function(store, index) {
		// Attempt login
		var request = index.get(username);
		request.onerror = _dbErrorHandler;

		request.onsuccess = function(event) {
			var entry = event.target.result;

			var success = true;
			var error = undefined;

			// Invalid username
			if(entry == undefined) {
				error = 'LoginError';
			}
			// Wrong password
			else if(entry.password != password) {
				error = 'LoginError';
				entry = undefined;
			}

			callback({
				success: success,
				error: error,
				data: entry
			});
		};
	});
}



// Retrieves all animals from the specified owner, passing
// an array of animals as argument to the callback
function dbGetAnimals(owner, callback) {
	console.log('Getting animals from user ID: ' + owner);

	_dbGetIndex('animals', 'owner', 'readonly', function(store, index) {
		var keyRange = IDBKeyRange.only(owner);
		var request = index.openCursor(keyRange);
		request .onerror = _dbErrorHandler;

		var animals = [];
		request.onsuccess = function(event) {
			var cursor = event.target.result;
			if(cursor) {
				animals.push(cursor.value);
				cursor.continue();
			}
			else {
				// Finished
				callback(animals);
			}
		};
	});
}



// Tries to add a new entry to table 'users', passing a result object
// (see _dbRequestResult)
// If the entry already exists, error.name == 'ConstraintError'
function dbCreateUser(entry, callback) {
	console.log('Creating user: ' + entry.name);

	// TODO check correctness of entry

	_dbGetStore('users', 'readwrite', function(store) {
		var request = store.add(entry);
		_dbRequestResult(request, callback);
	});
}



// TODO explain
function dbUpdateUser(username, updated_entry, callback) {
	_dbGetIndex('users', 'username', 'readwrite', function(store, index) {
		var request = index.get(username);
		request.onerror = _dbErrorHandler;

		request.onsuccess = function(event) {
			var entry = event.target.result;

			// Check which fields will be updated
			var fields = ['password', 'name', 'photo', 'phone', 'email', 'address'];
			fields.forEach(function(field) {
				if(updated_entry[field] != undefined) {
					entry[field] = updated_entry[field];
				}
			});

			if(entry.is_admin) {
				entry.address = undefined;
			}

			var request = store.put(entry);
			_dbRequestResult(request, callback);
		};
	});
}


