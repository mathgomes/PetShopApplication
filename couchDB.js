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

	readFromView: function(key, database, design_doc, view, callback) {
		var db = nano.use(database);
		db.view(design_doc, view, {include_docs: true, key: key}, callback);
	},

	deleteAllFromView: function(key, database, design_doc, view, callback) {
		var db = nano.use(database);
		db.view(design_doc, view, {include_docs: true}, function(err, body) {
			if(err) {
				callback(err, body);
			}
			else {
				// Delete all documents with specified key
				var documents = body.rows.reduce(function(to_be_deleted, row) {
					if(row.key === key) {
						to_be_deleted.push({
							_id: row.id,
							_rev: row.doc._rev,
							_deleted: true,
						});
					}
					return to_be_deleted;
				}, []); // <- Note empty array as 2nd parameter

				db.bulk({docs: documents}, callback);
			}
		});
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
		couch.createDocument(doc, doc_id, db, () => {});
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

	create('animals', '_design/queries', {
		'views': {
			'owner': {
				'map': function(doc) { emit(doc.owner, null); }
			}
		}
	});

	create('cartitems', '_design/queries', {
		'views': {
			'user': {
				'map': function(doc) { emit(doc.user, null); }
			},
			'product': {
				'map': function(doc) { emit(doc.product, null); }
			},
		}
	});

	create('services', '_design/queries', {
		'views': {
			'name': {
				'map': function(doc) { emit(doc.name, null); }
			}
		}
	});

	create('timeslots', '_design/queries', {
		'views': {
			'date': {
				'map': function(doc) { emit(doc.date, null); }
			},
			'animal': {
				'map': function(doc) { emit(doc.animal, null); }
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

	// PRODUCTS
	create('products', '1', {
		name: 'Osso',
		photo: 'images/produtos/osso.jpg',
		description: 'Osso de borracha para cães.',
		price: 4.99,
		stock: 10,
		sold_amount: 0,
		total_income: 0,
	});

	create('products', '2', {
		name: 'Alpiste',
		photo: 'images/produtos/alpiste.jpg',
		description: 'Alimento para pássaros.',
		price: 2.50,
		stock: 5,
		sold_amount: 0,
		total_income: 0,
	});

	create('products', '3', {
		name: 'Ração',
		photo: 'images/produtos/racao.jpg',
		description: 'Alimento para gatos',
		price: 25.00,
		stock: 25,
		sold_amount: 0,
		total_income: 0,
	});

	// SERVICES
	create('services', '1', {
		name: 'Banho e tosa',
		photo: 'images/servico/tosa.jpg',
		description: 'Demora de 30 minutos a 2 horas dependendo do animal.',
		price: 40.00,
		sold_amount: 0,
		total_income: 0,
	});

	create('services', '2', {
		name: 'Vacina contra raiva',
		photo: 'images/servico/vacina.png',
		description: 'Rápido e indolor.',
		price: 30.00,
		sold_amount: 0,
		total_income: 0,
	});

	// TIMESLOTS
	create('timeslots', '1', {
		date: (new Date('08/20/2017')).getTime(),
		time: 5,
		service: '1',
		animal: '1',
	});

	create('timeslots', '2', {
		date: (new Date('08/20/2017')).getTime(),
		time: 7,
		service: '2',
		animal: '2',
	});
}
