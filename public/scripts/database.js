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
 *  dbReadAllRecords(store, callback)
 *  dbReadFromIndex(key, store, index, callback)
 *  dbUpdateRecord(record, store, callback)
 *  dbDeleteRecord(record_id, store, callback)
 *  dbDeleteAllFromIndex(key, store, index, callback)
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
 *   address:  string
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
 *   date:    from Date.getTime()
 *   time:    integer from 0 to 9
 *   service: id from table 'services'
 *   animal:  id from table 'animals'
 *
 * cartitems:
 *   id:      auto-generated key
 *   user:    id from table 'users'
 *   product: id from table 'products'
 *   amount:  number
 */

console.log('Executing database.js');



function _test_callback(result) {
  console.log('Test result callback');
  console.log(result);
}



function dbInit() {
	// DELETED
}



function dbDelete() {
	// DELETED
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



// CRUD functions start here
// These functions take a callback, that will be invoked with a
// "result" {success, error, data} parameter created by _dbSuccess or _dbFailure.



// Record already exists -> result.error = 'ConstraintError'
function dbCreateRecord(record, store, callback) {
	console.log('Creating record', record, 'into', store);

	// No id field, doesn't need convertIdProperty
	_jsonAjax('POST', '/create/' + store, record, callback);
}



// No record with the specified ID -> result.error = 'NotFoundError'
function dbReadRecord(record_id, store, callback) {
	console.log('Reading record', record_id, 'from ' + store);

	_jsonAjax('GET', '/read/' + store, { id: record_id }, function(result) {
		if(result.success) {
			// Convert _id into id
			convertIdProperty(result.data);
		}
		callback(result);
	});
}



function dbReadAllRecords(store, callback) {
	console.log('Reading all records from ' + store);

	_jsonAjax('GET', '/read_all/' + store, {}, function(result) {
		if(result.success) {
			// Convert _id into id
			result.data.forEach(convertIdProperty);
		}
		callback(result);
	});
}



// Read all records with the specified key
// key doesn't exist -> result.error = 'NotFoundError'
// on success -> result.data is an array
function dbReadFromIndex(key, store, index, callback) {
	console.log('Reading records with key', key, 'from', store + '/' + index);

	var path = '/read/' + store + '/' + index;
	_jsonAjax('GET', path, { key: key }, function(result) {
		if(result.success) {
			// Convert _id into id
			result.data.forEach(convertIdProperty);
		}
		callback(result);
	});
}



function dbUpdateRecord(record, store, callback) {
	console.log('Updating record', record, 'on', store);

	// Convert id into _id
	convertIdProperty(record);

	_jsonAjax('PUT', '/update/' + store, record, callback);
}



function dbDeleteRecord(record_id, store, callback) {
	console.log('Deleting record', record_id, 'from', store);

	// Doesn't send a record, so convertIdProperty isn't needed
	_jsonAjax('DELETE', '/delete/' + store, { id: record_id }, callback);
}



// Deletes all records with specified key from index
function dbDeleteAllFromIndex(key, store, index, callback) {
	console.log('Deleting all records from', store);

	// Doesn't send a record, so convertIdProperty isn't needed
	_jsonAjax('DELETE', '/delete_all/' + store + '/' + index, { key: key }, callback);
}



// On success: result.data = (user object)
// On error:   result.error = 'LoginError'
function dbUserLogin(username, password, callback) {
	console.log('Login attempt:', username + ', ' + password);

	dbReadFromIndex(username, 'users', 'username', function(result) {
		var user_not_found = (result.success == false || result.data.length == 0);
		if(user_not_found || result.data[0].password != password) {
			callback(_dbFailure('LoginError'));
		}
		else {
			console.log(result);
			callback(result);
		}
	});
}


// Functions for fixing CouchDB - Frontend inconsistency
// This should be used before updating and after reading records with _jsonAjax
function convertIdProperty(data) {
	if(data.id === undefined) {
		data.id = data._id;
		delete data._id;
	}
	else {
		data._id = data.id;
		delete data.id;
	}
	return data;
}


// Calls the requested HTTP method, converting the <data> object into
// an url-encoded string, then invoking callback with a result object
function _jsonAjax(method, path, data, callback) {
	var urlencoded = '?';

	// Convert <data> into url-encoded string
	// eg. {a: 10, b: 'hello?'} -> '?a=10&b=hello%3F
	for(var field in data) {
		var encoded_field = encodeURIComponent(field);
		var encoded_data = encodeURIComponent(data[field]);

		urlencoded += encoded_field + '=' + encoded_data + '&';
	}

	// Create and send JSON request
	req = new XMLHttpRequest();

	var full_path = path; // Used by req.open
	var send_data = null; // Used by req.send

	// Set parameters for each HTTP method
	if(['GET', 'HEAD', 'DELETE', 'OPTIONS'].indexOf(method) !== -1) {
		full_path += urlencoded;
	}
	else if(['POST', 'PUT'].indexOf(method) !== -1) {
		send_data = JSON.stringify(data);
		// Undefined otherwise
	}
	else if(['TRACE', 'CONNECT', 'PATCH'].indexOf(method) !== -1) {
		// These are unsupported because they don't seem necessary now,
		// so I didn't try to implement them
		callback(_dbFailure('Unsupported HTTP method: ' + method));
		return;
	}
	else {
		callback(_dbFailure('Invalid HTTP method: ' + method));
		return;
	}

	console.log('_jsonAjax:', method, full_path);
	req.open(method, full_path, true);
	req.setRequestHeader("Content-type", "application/json");

	req.onreadystatechange = function(event) {
		var req = event.target;

		if(req.readyState === XMLHttpRequest.DONE) {
			// This value should not be returned
			var result = _dbFailure('_jsonAjax logic error');

			if(req.status === 200 || req.status === 201) {
				// Success -> return parsed response
				if(req.responseText !== '') {
					var obj = JSON.parse(req.responseText);
					result = _dbSuccess(obj);
				}
				else {
					result = _dbSuccess(req.status);
				}
			}
			else {
				// Failure -> return HTTP error code
				result = _dbFailure(req.status);
			}

			callback(result);
		}
	};

	req.send(send_data); // Sempre esqueco isso aqui
}
