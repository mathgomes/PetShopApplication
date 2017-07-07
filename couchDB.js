/* File: couchDB.js
 * Authors:
 * Hugo Moraes Dzin, 8532186
 * Matheus Gomes da Silva Horta, 8532321
 * Rogiel dos Santos Silva, 8061793

 This file contain all the relevant functionality regarding the couchDB server
 */

var nano = require('nano')(process.env.COUCHDB_URL || 'http://127.0.0.1:5984');

module.exports = couch;

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
		this.createDatabases(callback);
	},
	// create all the databases according to dbNames
	createDatabases: function(callback) {
		dbNames.forEach(function(name) {
			this.createDatabase(name,callback);
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
	createDocument: function(document, database, callback) {
		var db = nano.use(database);
		 db.insert(document, document[uniqueIDs[database]], function(err, document) {
		 	callback(err, document);
		 });
	},
	// retrieve a document with specified id
	readDocument: function(document_id, database, callback) {
		var db = nano.use(database);
		db.get(document_id, function(err, body) {
		    callback(err, body);
		});
	},
	updateDocument: function(document, database, callback) {
		var db = nano.use(database);

	},
	readAllDocuments: function(document, database, callback) {
		var db = nano.use(database);

	},
	deleteDocument: function(document, database, callback) {
		var db = nano.use(database);

	}
}

