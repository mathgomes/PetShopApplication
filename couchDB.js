/* File: couchDB.js
 * Authors:
 * Hugo Moraes Dzin, 8532186
 * Matheus Gomes da Silva Horta, 8532321
 * Rogiel dos Santos Silva, 8061793

 This file contain all the relevant functionality regarding the couchDB server
 */
// jshint esversion: 6

var nano = require('nano')(process.env.COUCHDB_URL || 'http://127.0.0.1:5984');

var dbNames = ['users','animals','products','services','timeslots','cartitems'];

/*var views = {
	"views": {
		"display_all":
			{ "map": function(doc) { emit(doc._id, doc); } }
	}
};*/

// object with all the database functions
var couch = module.exports = {
	// initialize the server routines
	initCouch: function (callback) {
		this.createDatabases(populateDatabases);
	},

	// create all the databases according to dbNames
	createDatabases: function(callback) {
		let itemsProcessed = 0;
		dbNames.forEach(function(name) {
			this.createDatabase(name,function(db, err) {
				itemsProcessed++;
				console.log(db + " : database initialized");
				/*let dbase = nano.use(db);
				dbase.insert(views,'_design/queries', function(error, response) {
					console.log("view inserted");
				});*/

				if(itemsProcessed === dbNames.length) {
					callback();
				}
			});
		}, this);
	},

	// create a database if it doesnt exist, do nothing if exists
	createDatabase: function (db,callback) {
		nano.db.create(db, function(err) {
			if (err && err.statusCode == 412) {
				err = null;
			}
			callback(db,err);
		});
	},

	removeDatabase: function (callback)	{ // teste
		nano.db.destroy(dbName, function(err, body){
			callback(err);
		});
	},

	// create a specified document in a given database
	createDocument: function(document, document_id, database, callback) {
		var db = nano.use(database);
		if(document_id !== undefined) {
			db.insert(document, document_id, callback);
		}
		else {
			db.insert(document, callback);
		}
	},

	// retrieve a document with specified id
	readDocument: function(document_id, database, callback) {
		var db = nano.use(database);
		db.get(document_id, function(err, body) {
		    callback(err, body);
		});
	},

	// update a document from a source one
	updateDocument: function(document, database, callback) {
		this.readDocument(document._id, database, function(err, existing) {
			if (err) {
				callback(err, document);
			}
			let db = nano.use(database);
			document._rev = existing._rev;
			db.insert(document, function(err, result) {
				console.log(result);
	 			callback(err, result);
	 		});
		});

	},

	deleteDocument: function(document_id, database, callback) {
		this.readDocument(document_id, database, function(err, existing) {
			if (err) {
				callback(err, existing);
			}
			let db = nano.use(database);
			db.destroy(document_id, existing._rev, function(err, result) {
				console.log(result);
	 			callback(err, result);
	 		});
		});
	},

	readAllDocuments: function(database, callback) {
		nano.use(database).list({include_docs: true}, callback);
	},

	readFromView(key, database, design_doc, view, callback) {
		var db = nano.use(database);
		db.view(design_doc, view, {include_docs: true, key: key}, callback);
	}
};



function _test_callback(err, body) {
	if(err) {
		console.log('Error', err.statusCode, '-', err.reason);
	}
	else {
		console.log(body.id, 'created with success');
	}
}



// Adds mockup records to the databases
function populateDatabases() {
	function create(db, doc_id, doc) {
		couch.createDocument(doc, doc_id, db, _test_callback);
	}

	// TODO terminar de copiar pra ca database.js _dbPopulate

	// VIEWS
	create('users', '_design/queries', {
		'views': {
			'email': {
				'map': function(doc) { emit(doc.email, null); }
			},
			'username': {
				'map': function(doc) { emit(doc.username, null); }
			},
		}
	});


	// USERS
	create('users', '1', {
		is_admin: true,
		username: 'admin',
		password: 'admin',
		name: 'Matheus Gomes',
		photo: 'images/perfil.jpg',
		phone: '(99) 1111-1111',
		email: 'minhoca@petshop.com',
		address: 'N/A',
	});

	create('users', '2', {
		is_admin: false,
		username: 'hdzin',
		password: '1',
		name: 'Hugo Dzin',
		photo: 'images/pets/canary.jpg',
		phone: '(99) 2222-2222',
		email: 'hugo@cliente.com',
		address: 'São Carlos',
	});

	create('users', '3', {
		is_admin: false,
		username: 'rsilva',
		password: '4321',
		name: 'Rogiel Silva',
		photo: 'images/pets/parrot2.jpg',
		phone: '(99) 3333-3333',
		email: 'rogiel@cliente.com',
		address: 'São Carlos',
	});

	// ANIMALS
	create('animals', '1', {
		owner: '2',
		name: 'Bichano',
		photo: 'images/pets/cat.jpg',
		breed: 'Gato',
		age: 5,
	});

	create('animals', '2', {
		owner: '2',
		name: 'Frajola',
		photo: 'images/pets/persian.jpg',
		breed: 'Gato',
		age: 7,
	});

	create('animals', '3', {
		owner: '2',
		name: 'Totó',
		photo: 'images/pets/poodle.jpg',
		breed: 'Poodle',
		age: 3,
	});
}
