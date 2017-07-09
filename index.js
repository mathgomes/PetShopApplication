// jshint esversion: 6

var express = require('express');
var bodyParser = require('body-parser');
var couch = require('./couchDB');


var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static('public'));

/*
 * stores and indices are listed within database.js:_dbCreateStores
 * dbCreateRecord
 *   POST /create/:store (json record inside body)
 * dbReadRecord
 *   GET /read/:store/?id=<ID>
 * dbReadAllRecords
 *   GET /read_all/:store
 * dbReadFromIndex
 *   GET /read/:store/:index?key=<KEY>
 * dbUpdateRecord
 *   PUT /update/:store?id=<ID> (json record inside body)
 * dbDeleteRecord
 *   DELETE /delete/:store?id=<ID>
 * dbDeleteAllFromIndex
 *   DELETE /delete_all/:store/:index?key=<KEY>

	TABLE OF ERRORS :
200 - OK
201 - Created
202 - Accepted
304 - Not Modified
400 - Bad Request
401 - Unauthorized
403 - Forbidden
404 - Not Found
405 - Resource Not Allowed
406 - Not Acceptable
409 - Conflict
412 - Precondition Failed
415 - Bad Content Type
416 - Requested Range Not Satisfiable
417 - Expectation Failed
500 - Internal Server Error

*/


// Create and populate databases with mockup data and views
couch.initCouch();

// dbCreateRecord
app.post('/create/:store', (req, res) => {
	var store = req.params.store;
	var record = req.body;

	console.log('create', store, record);

	couch.createDocument(record, undefined, store, function(err, result){
		if(err) {
			console.log("error[reason, statusCode] : " + err.reason, err.statusCode);
			res.status(err.statusCode).send();
		}
		else {
			console.log(result.id + ' : created with success');
			res.status(201).send(); // status da operacao CREATED
		}
	});
});


// dbReadRecord
app.get('/read/:store', (req, res) => {
	var store = req.params.store;
	var id = req.query.id;
	var record = req.body;

	console.log('read', store, id);

	var send_data = {}; // documento aqui
	// ler documento do db com doc.type == store
	couch.readDocument(id, store, function(err, doc){
		if(err) {
			console.log("error[reason, statusCode] : " + err.reason, err.statusCode);
			res.status(err.statusCode).send();
		}
		else {
			console.log(doc._id + ' : retrieved with success');
			send_data = doc;
			res.status(200).json(send_data);
		}
	});
});


// dbReadAllRecords
app.get('/read_all/:store', (req, res) => {
	var store = req.params.store;

	console.log('read_all', store);

	couch.readAllDocuments(store, function(err, body) {
		// Send only the documents, skipping design documents
		var docs = body.rows.reduce(function(filtered, row) {
			if(row.doc._id.startsWith('_design/') === false) {
				filtered.push(row.doc);
			}
			return filtered;
		}, []);
		res.json(docs);
	});
});


// dbReadFromIndex
app.get('/read/:store/:index', (req, res) => {
	var store = req.params.store;
	var index = req.params.index;
	var key = req.query.key;

	console.log('read', store, index, key);

	couch.readFromView(key, store, 'queries', index, function(err, body) {
		var docs = body.rows.map(function(row) {
			return row.doc;
		});

		res.json(docs);
	});
});


// dbUpdateRecord
app.put('/update/:store', (req, res) => {
	var store = req.params.store;
	var id = req.query.id;
	var new_record = req.body;

	console.log('update', store, id, new_record);

	// atualizar o documento com doc.type == store && doc.id == id
	couch.updateDocument(new_record, store, function(err, result){
		if(err) {
			console.log("error[reason, statusCode] : " + err.reason, err.statusCode);
			res.status(err.statusCode).send();
		}
		else {
			console.log(result.id + ' : updated with success');
			res.status(200).json();
		}
	});

});


// dbDeleteRecord
app.delete('/delete/:store', (req, res) => {
	var store = req.params.store;
	var id = req.query.id;

	console.log('delete', store, id);

	// deletar o documento com doc.type == store && doc.id == id
	couch.deleteDocument(id, store, function(err, result){
		if(err) {
			console.log("error[reason, statusCode] : " + err.reason, err.statusCode);
			res.status(err.statusCode).send();
		}
		else {
			console.log(result.id + ' : deleted with success');
			res.status(200).json();
		}
	});

});


// dbDeleteAllFromIndex
app.delete('/delete_all/:store/:index', (req, res) => {
	var store = req.params.store;
	var index = req.params.index;
	var key = req.query.key;

	console.log('delete_all', store, index, key);

	// TODO deletar todos os documentos com doc.type == store && doc[index] == key

	res.status(200).send(); // TODO status da operacao
});


// TODO remove
app.get('/initdb', (req, res) => {
	couchDB.initCouch();
});


// Get port from command-line arguments (default: 8000)
var port = 8000;
if(process.argv.length >= 3) {
	port = parseInt(process.argv[2]);
}

app.listen(port, () => {
	console.log('Listening on port', port);
});
