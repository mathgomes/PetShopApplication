// TODO botar os nomes que nem os outros arquivos

// Functions and variables that start with _ are PRIVATE to this file

/* FUNCTIONS IMPLEMENTED SO FAR
 *  dbInit()
 *  dbDelete()
 *  dbUserLogin(user, pass, callback)
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
 */

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
	console.log('Creating tables');

	var users = db.createObjectStore('users', {keyPath: 'id', autoIncrement: true});
	var animals = db.createObjectStore('animals', {keyPath: 'id', autoIncrement: true});
	var products = db.createObjectStore('products', {keyPath: 'id', autoIncrement: true});
	var services = db.createObjectStore('services', {keyPath: 'id', autoIncrement: true});
	var timeslots = db.createObjectStore('timeslots', {keyPath: 'id', autoIncrement: true});

	users.createIndex('username', 'username', {unique: true});
	users.createIndex('email', 'email', {unique: true});
	animals.createIndex('owner', 'owner', {unique: false});
	products.createIndex('name', 'name', {unique: false});
	services.createIndex('name', 'name', {unique: false});
	timeslots.createIndex('date', 'date', {unique: false});
}



// Initialize database with data
function _dbPopulate(db) {
	console.log('Populating database');

	var trans = db.transaction(
		['users', 'animals', 'products', 'services', 'timeslots'],
		'readwrite');
	var users = trans.objectStore('users');

	var data = {
		is_admin: true,
		username: 'admin',
		password: 'admin',
		name: 'Minhoca Gomes',
		photo: 'images/perfil.jpg',
		address: undefined
	};

	users.add(data);
}



var LOGIN_OK = 0;
var WRONG_USER = 1;
var WRONG_PASS = 2;
// Returns an object {error, data}
// error = LOGIN_OK, WRONG_USER or WRONG_PASS
// data is undefined unless error == LOGIN_OK
function dbUserLogin(username, password, callback) {
	console.log('Login attempt: ' + username + ', ' + password);

	var request = window.indexedDB.open(DB_NAME);
	request.onerror = _dbErrorHandler;

	request.onsuccess = function(event) {
		// Get login index
		var db = event.target.result;
		var transaction = db.transaction("users")
		var store = transaction.objectStore("users");
		var index = store.index("username");

		// Attempt login
		var request = index.get(username);
		request.onerror = _dbErrorHandler;

		request.onsuccess = function(event) {
			var entry = event.target.result;

			var error = LOGIN_OK;

			// Login not found
			if(entry == undefined) {
				error = WRONG_USER;
			}
			// Wrong password
			else if(entry.password != password) {
				error = WRONG_PASS
				entry = undefined;
			}

			callback({
				error: error,
				data: entry
			});
		};
	};
}
