// jshint esversion: 6

var express = require('express');
var bodyParser = require('body-parser');
var couch = require('./couchDB');

var nano = require('nano')(process.env.COUCHDB_URL || 'http://127.0.0.1:5984');

var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static('public'));


// Mockup records
var admin_record = {
	id: 1,
	is_admin: true,
	username: 'admin',
	password: 'admin',
	name: 'Matheus Gomes',
	photo: 'images/perfil.jpg',
	phone: '(99) 1111-1111',
	email: 'minhoca@petshop.com',
	address: 'N/A',
};

var customer_record = {
	id: 2,
	is_admin: false,
	username: 'hdzin',
	password: '1',
	name: 'Hugo Dzin',
	photo: 'images/pets/canary.jpg',
	phone: '(99) 1111-2222',
	email: 'hugo@cliente.com',
	adress: 'Rua dos Bobos Nr 0',
};

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
200 — OK, The request was successful
201 — CREATED, A new resource object was successfully created
404 — NOT FOUND, The requested resource could not be found
400 — BAD REQUEST, The request was malformed or invalid
500 — INTERNAL SERVER ERROR, Unknown server error has occurred
	
*/


// initialize the database
couch.initCouch(function(db,err) {
	if (err) {
		throw err;
	}
	else {
		// INITIAL INSERTIONS
		couch.createDocument(admin_record, 'users', function(err, body){
			if(err) 
				console.log("error[reason, statusCode] : " + err.reason, err.statusCode);
			else
				console.log(body + ' : created with sucess');
		});
		couch.createDocument(customer_record, 'users', function(err, body){
			if(err) 
				console.log("error[reason, statusCode] : " + err.reason, err.statusCode);
			else
				console.log(body + ' : created with sucess');
		});	
	}
});

// dbCreateRecord
app.post('/create/:store', (req, res) => {
	var store = req.params.store;
	var record = req.body;

	console.log('create', store, record);

	var result = {
		status : ""
	}
	couch.createDocument(record, store, function(err, result){
		if(err) {
			console.log("error[reason, statusCode] : " + err.reason, err.statusCode);
			res.status(400).send(err)
		}
		else {
			console.log(result.id + ' : created with sucess');
			result.status = result.id + ' : created with sucess';
			res.status(201).send(result); // status da operacao CREATED
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
			res.status(400).send(err)
		}
		else {
			console.log(doc._id + ' : retrieved with sucess');
			send_data = doc;
			res.status(200).json(send_data);
		}
	});
});


// dbReadAllRecords
app.get('/read_all/:store', (req, res) => {
	var store = req.params.store;

	console.log('read_all', store);

	// TODO ler todos documentos do db com doc.type == store

	var send_data = [{store: store}]; // TODO vetor de documentos aqui
	res.json(send_data);
});




// dbReadFromIndex
app.get('/read/:store/:index', (req, res) => {
	var store = req.params.store;
	var index = req.params.index;
	var key = req.query.key;

	console.log('read', store, index, key);

	// TODO ler todos documentos do db com doc.type == store && doc[index] == key

	var send_data = [{store: store, index: index, key: key}]; // TODO vetor de documentos aqui
	res.json(send_data);
});


// dbUpdateRecord
app.put('/update/:store', (req, res) => {
	var store = req.params.store;
	var id = req.query.id;
	var new_record = req.body;

	console.log('update', store, id, new_record);

	var result = {
		status : ""
	}
	// atualizar o documento com doc.type == store && doc.id == id
	couch.updateDocument(new_record, store, function(err, result){
		if(err) {
			console.log("error[reason, statusCode] : " + err.reason, err.statusCode);
			res.status(400).send(err)
		}
		else {
			console.log(result.id + ' : updated with sucess');
			result.status = result.id + ' : updated with sucess';
			res.status(200).json(result);
		}
	});

});


// dbDeleteRecord
app.delete('/delete/:store', (req, res) => {
	var store = req.params.store;
	var id = req.query.id;

	console.log('delete', store, id);

	// TODO deletar o documento com doc.type == store && doc.id == id

	res.status(200).send(); // TODO status da operacao
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


// as rotas abaixo vao ser removidas quando terminar as de cima
// <address>/ajax/users?id=ID
app.get('/ajax/users', (req, res) => {
	var id = req.query.id;

	if(id === undefined) {
		res.status(400).send("400 Bad Request");
		return;
	}
	else if(id === '1') {
		res.json(admin_record);
	}
	else if(id === '2') {
		res.json(customer_record);
	}
	else {
		res.status(404).send('404 Not Found');
		return;
	}

});



// <address>/ajax/users_by_username?key=USERNAME
// Nota: metodos com _by_ devem retornar um array
app.get('/ajax/users_by_username', (req, res) => {
	// TODO implementar de verdade
	var key = req.query.key;
	var send_data;

	if(key === undefined) {
		res.status(400).send("400 Bad Request");
		return;
	}
	else if(key === 'admin') {
		send_data = [admin_record];
	}
	else if(key === 'hdzin') {
		send_data = [customer_record];
	}
	else {
		res.status(404).send('404 Not Found');
		return;
	}

	res.json(send_data);
});

/*
app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html');
});

app.get('/date', (req, res) => {
	res.send((new Date()).toString());
});

app.post('/sqrt', (req, res) => {
	var num = parseFloat(req.body.num);
	ans = { result: Math.sqrt(num) };
	res.send(JSON.stringify(ans));
});

app.get('/sqrt', (req, res) => {
	var num = parseFloat(req.query.num);
	res.send(Math.sqrt(num).toString());
});
*/


var port = 8000;

if(process.argv.length >= 3) {
	port = parseInt(process.argv[2]);
}

app.listen(port, () => {
	console.log('Listening on port', port);
});