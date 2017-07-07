/* File: couchDB.js
 * Authors:
 * Hugo Moraes Dzin, 8532186
 * Matheus Gomes da Silva Horta, 8532321
 * Rogiel dos Santos Silva, 8061793
 */

var nano = require('nano')(process.env.COUCHDB_URL || 'http://127.0.0.1:5984');

module.exports = couch;

var dbNames = ['users','animals','products','services','timeslots','cartitems']
var uniqueIDs = {
	users : 'username',
	animals : 'owner',
	products : 'name',
	services : 'name'
};


// object with all the database functions
var couch = module.exports = {
	initCouch: function (callback) {
		this.createDatabases(callback);
	},
	createDatabases: function(callback) {
		dbNames.forEach(function(name) {
			this.createDatabase(name,callback);
		}, this);
	},
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
	createDocument: function(document, database, callback) {
		var db = nano.use(database);
		 db.insert(document, document[uniqueIDs[database]], function(err, document) {
		 	callback(err, document);
		 });
	}
}

