/* File: couchDB.js
 * Authors:
 * Hugo Moraes Dzin, 8532186
 * Matheus Gomes da Silva Horta, 8532321
 * Rogiel dos Santos Silva, 8061793
 */

var nano = require('nano')(process.env.COUCHDB_URL || 'http://127.0.0.1:5984');

module.exports = couch;

var dbName = 'petshop'

// object with all the database functions
var couch = module.exports = {
	initCouch: function (callback) {
		this.createDatabase(dbName,callback);
	},
	createDatabase: function (db,callback) {
		nano.db.create(db, function(err) {
			if (err && err.statusCode == 412) {
				err = null;
			}
			callback(err);
		});
	},
	removeDatabase: function (callback)	{ // teste
		nano.db.destroy(dbName, function(err, body){
			callback(err);
		});
	},
	createUser : function (body, callback){
		var usuario = nano.use(dbName);
		usuario.insert(body, 'rabbit3', function(err, body) { //informacao, id e callback
  		// do something 
		});
	}
	
}

