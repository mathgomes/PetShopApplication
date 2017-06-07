/* File: database.js
 * Authors:
 * Hugo Moraes Dzin, 8532186
 * Matheus Gomes da Silva Horta, 8532321
 * Rogiel dos Santos Silva, 8061793
 */

// Functions and variables that start with _ are PRIVATE to this file

/* FUNCTIONS IMPLEMENTED SO FAR
 *  dbInit()
 *  dbDelete()
 *
 *  dbCreateRecord(record, store, callback)
 *  dbReadRecord(record_id, store, callback)
 *  dbReadFromIndex(key, store, index, callback)
 *  dbUpdateRecord(record, store, callback)
 *  dbDeleteRecord(record_id, store, callback)
 *
 *  dbUserLogin(user, pass, callback)
 *
 *  CRUD callbacks are invoked with a result object as paremeter:
 *  on success: {success: true,  error: undefined, data: (varies with function)}
 *  on error:   {success: false, error: (error name),  data: undefined}
 */


/* image object: normal URL or FileReader result (reader.readAsDataURL) */

/* TABLE LIST
 * users:
 *   id:       auto-generated key
 *   is_admin: true or false
 *   username: string, unique
 *   password: string
 *   name:     string
 *   photo:    (image object)
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
 *   photo: (image object)
 *   breed: string
 *   age:   number
 *
 * products:
 *   id:           auto-generated key
 *   name:         string
 *   photo:        (image object)
 *   description:  string
 *   price:        number
 *   stock:        number
 *   sold_amount:  number
 *   total_income: number
 *
 * services:
 *   id:           auto-generated key
 *   name:         string
 *   photo:        (image object)
 *   description:  string
 *   price:        number
 *   sold_amount:  number
 *   total_income: number
 *
 * timeslots:
 *   id:      auto-generated key
 *   date:    Date object
 *   time:    string in hh:mm format
 *   in_use:  true or false
 *   service: id from table 'services'
 *   animal:  id from table 'animals'
 *
 * cart_items:
 *   id:      auto-generated key
 *   user:    id from table 'users'
 *   product: id from table 'products'
 *   amount:  number
 */

console.log('Executing database.js');

if(!window.indexedDB) {
    window.alert('No Indexed DB support');
}



var DB_NAME = 'petshop';
var DB_VERSION = 1;



function _test_callback(result) {
	console.log('Test result callback');
	console.log(result);
}



function _dbErrorHandler(event) {
	console.log('Database error: ' + event.target.errorCode);
}



function dbInit() {
	var request = window.indexedDB.open(DB_NAME, DB_VERSION);
	request.onerror = _dbErrorHandler;

	var should_populate = false;

	// Create object stores and indices
	request.onupgradeneeded = function(event) {
		console.log('dbInit:onupgradeneeded');
		var db = event.target.result;

		should_populate = true;
		_dbCreateStores(db);
	};

	// Populate database, if necessary
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



// Called by dbInit:onupgradeneeded
// Creates object stores and indices
function _dbCreateStores(db) {
	console.log('Creating stores');

	// Shorthand functions
	function newStore(name) {
		return db.createObjectStore(name, {keyPath: 'id', autoIncrement: true});
	}

	function newIndex(store, field, is_unique) {
		store.createIndex(field, field, {unique: is_unique});
	}

	var users      = newStore('users');
	var animals    = newStore('animals');
	var products   = newStore('products');
	var services   = newStore('services');
	var timeslots  = newStore('timeslots');
	var cart_items = newStore('cartitems');

	newIndex(users, 'username', true);
	newIndex(users, 'email', true);
	newIndex(animals, 'owner', false);

	newIndex(cart_items, 'user', false);
	newIndex(cart_items, 'product', false);

	newIndex(services, 'name', false);
	newIndex(timeslots, 'date', false);
}



// Called by dbInit:onsuccess if dbInit:onupgradeneeded was also triggered
// Adds a bunch of records to the database
function _dbPopulate(db) {
	console.log('Populating database');

	var trans = db.transaction(
		['users', 'animals', 'products', 'services', 'timeslots'],
		'readwrite');

	var users = trans.objectStore('users');

	users.add({
		is_admin: true,
		username: 'admin',
		password: 'admin',
		name: 'Matheus Gomes',
		photo: 'images/perfil.jpg',
		phone: '(99) 1111-1111',
		email: 'minhoca@petshop.com',
		address: undefined,
	});

	users.add({
		is_admin: false,
		username: 'hdzin',
		password: '1',
		name: 'Hugo Dzin',
		photo: 'images/pets/canary.jpg',
		phone: '(99) 2222-2222',
		email: 'hugo@cliente.com',
		address: 'São Carlos',
	});

	users.add({
		is_admin: false,
		username: 'rsilva',
		password: '4321',
		name: 'Rogiel Silva',
		photo: 'images/pets/parrot2.jpg',
		phone: '(99) 3333-3333',
		email: 'rogiel@cliente.com',
		address: 'São Carlos',
	});

	var animals = trans.objectStore('animals');

	animals.add({
		owner: 2,
		name: 'Bichano',
		photo: 'images/pets/cat.jpg',
		breed: 'Gato',
		age: 5,
	});

	animals.add({
		owner: 2,
		name: 'Frajola',
		photo: 'images/pets/persian.jpg',
		breed: 'Gato',
		age: 7,
	});

	animals.add({
		owner: 2,
		name: 'Totó',
		photo: 'images/pets/poodle.jpg',
		breed: 'Poodle',
		age: 3,
	});

	var products = trans.objStore('products');

	products.add({
		name: 'Osso',
		photo: 'images/produtos/osso.jpg',
		price: 4.99,
	});

	products.add({
		name: 'Alpiste',
		photo: 'images/produtos/alpiste.jpg',
		price: 2.50,
	});

	products.add({
		name: 'Ração',
		photo: 'images/produtos/racao.jpg',
		price: 25.00,
	});
}



// Helper functions start here
// They are used by all CRUD functions



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
// requested store and index as arguments to the callback
function _dbGetIndex(objStore, indexName, mode, callback) {
	_dbGetStore(objStore, mode, function(store) {
		var index = store.index(indexName);
		callback(store, index);
	});
}



// Creates a successful result object
function _dbSuccess(data) {
	return {
		success: true,
		error: undefined,
		data: data,
	};
}



// Creates an unsuccessful result object
function _dbFailure(error) {
	return {
		success: false,
		error: error,
		data: undefined,
	};
}



// Sets callback functions for the request
// Meant for record CRUD functions
function _dbRequestResult(request, callback) {
	request.onsuccess = function(event) {
		// Success with no data associated
		callback(_dbSuccess(undefined));
	};

	request.onerror = function(event) {
		callback(_dbFailure(event.target.error.name));
	};
}


// CRUD functions start here
// These functions take a callback, that will be invoked with a
// "result" {success, error, data} parameter created by _dbSuccess or _dbFailure.



// Record already exists -> result.error = 'ConstraintError'
function dbCreateRecord(record, store, callback) {
	console.log('Creating record', record, 'into', store);

	_dbGetStore(store, 'readwrite', function(store) {
		var request = store.add(record);
		_dbRequestResult(request, callback);
	});
}



// No record with the specified ID -> result.error = 'NotFoundError'
function dbReadRecord(record_id, store, callback) {
	console.log('Reading record', record_id, 'from ' + store);

	_dbGetStore(store, 'readonly', function(store) {
		var request = store.get(record_id);

		_dbRequestResult(request, callback);
		request.onsuccess = function(event) {
			var result = event.target.result;

			// Return a success result if found, failure result if not found
			if(result) {
				callback(_dbSuccess(result));
			}
			else {
				callback(_dbFailure('NotFoundError'));
			}
		};
	});
}



// Read all records with the specified key
// key doesn't exist -> result.error = 'NotFoundError'
// on success -> result.data is an array
function dbReadFromIndex(key, store, index, callback) {
	console.log('Reading records with key', key, 'from', store + '/' + index);

	_dbGetIndex(store, index, 'readonly', function(store, index) {
		var key_range = IDBKeyRange.only(key);
		var request = index.openCursor(key_range);

		var records = [];

		_dbRequestResult(request, callback);
		request.onsuccess = function(event) {
			var cursor = event.target.result;
			if(cursor) {
				records.push(cursor.value);
				cursor.continue();
			}
			else if(records.length != 0) {
				callback(_dbSuccess(records));
			}
			else {
				callback(_dbFailure('NotFoundError'));
			}
		};
	});
}



function dbUpdateRecord(record, store, callback) {
	console.log('Updating record', record, 'on', store);

	_dbGetStore(store, 'readwrite', function(store) {
		var request = store.put(record);
		_dbRequestResult(request, callback);
	});
}



/* maybe useless
function dbUpdateFromIndex(key, new_record, store, index, callback) {
	console.log('Updating record with key', key, 'from', store + '/' + index);

	_dbGetIndex(store, index, 'readwrite', function(store, index) {
		var request = index.get(key);

		_dbRequestResult(request, callback);
		request.onsuccess = function(event) {
			var record = event.target.result;
			var request = store.put(record);
			_dbRequestResult(request, callback);
		};
	});
}*/



function dbDeleteRecord(record_id, store, callback) {
	console.log('Deleting record', record_id, 'from', store);

	_dbGetStore(store, 'readwrite', function(store) {
		var request = store.delete(record_id);
		_dbRequestResult(request, callback);
	});
}



// On success: result.data = (user object)
// On error:   result.error = 'LoginError'
function dbUserLogin(username, password, callback) {
	console.log('Login attempt:', username + ', ' + password);

	dbReadFromIndex(username, 'users', 'username', function(result) {
		//console.log('Login result:', result);
		if(result.success == false || result.data[0].password != password) {
			callback(_dbFailure('LoginError'));
		}
		else {
			callback(result);
		}
	});
}



// Check if all elements of <contained> can be found in <container>
function _containsAll(container, contained) {
	contained.every( function(e) {
		return (container.indexOf(e) != -1);
	});
}

function dbShopSearch(types, animals, sorting, callback) {
	var _all_types = ['food', 'toy', 'medicine', 'accessory', 'other'];
	var _all_animals = ['cat', 'dog', 'bird', 'other'];

	var search_all_types = false;
	var search_all_animals = false;

	if(types.length == 0 || _containsAll(types, _all_types)) {
		search_all_types = true;
	}

	if(animals.length == 0 || _containsAll(animals, _all_animals)) {
		search_all_animals = true;
	}
	// TODO
}
