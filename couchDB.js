/* File: couchDB.js
 * Authors:
 * Hugo Moraes Dzin, 8532186
 * Matheus Gomes da Silva Horta, 8532321
 * Rogiel dos Santos Silva, 8061793

 This file contain all the relevant functionality regarding the couchDB server
 */

var nano = require('nano')(process.env.COUCHDB_URL || 'http://127.0.0.1:5984');


var dbNames = ['users','animals','products','services','timeslots','cartitems']
var uniqueIDs = {
	users : 'username',
	animals : 'owner',
	products : 'name',
	services : 'name',
	timeslots : '',
	cartItems:  ''
};


// object with all the database functions
var couch = module.exports = {
	// initialize the server routines
	initCouch: function (callback) {
		this.createDatabases(function() {
			callback();
		});
	},
	// create all the databases according to dbNames
	createDatabases: function(callback) {
		dbNames.forEach(function(name) {
			this.createDatabase(name,function(db, err) {
				console.log(db + " : database initialized");
			});
		}, this);
		callback();
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
	createDocument: function(document, database, callback) {
		var db = nano.use(database);
		 db.insert(document, document[uniqueIDs[database]], function(err, result) {
		 	callback(err, result);
		 });
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
		var key = document[uniqueIDs[database]];
		this.readDocument(key, database, function(err, existing) {
			if (err) {
				callback(err, document);
			}
			console.log(existing)
			let db = nano.use(database);
			document._rev = existing._rev;
			db.insert(document, key, function(err, result) {
				console.log(result)
	 			callback(err, result);
	 		});
		});

	},
	readAllDocuments: function(document, database, callback) {
		var db = nano.use(database);

	},
	deleteDocument: function(document, database, callback) {
		var db = nano.use(database);

	}
}

