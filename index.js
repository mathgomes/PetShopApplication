// jshint esversion: 6

var express = require('express');
var bodyParser = require('body-parser');
var nano = require('nano')('http://localhost:8000');


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
 *   POST create/:store (json record inside body)
 * dbReadRecord
 *   GET read/:store/?id=<ID>
 * dbReadAllRecords
 *   GET read_all/:store
 * dbReadFromIndex
 *   GET read/:store/:index?key=<KEY>
 * dbUpdateRecord
 *   PUT update/:store?id=<ID> (json record inside body)
 * dbDeleteRecord
 *   DELETE delete/:store?id=<ID>
 * dbDeleteAllFromIndex
 *   DELETE delete_all/:store/:index
*/


 
// clean up the database we created previously 
function insertBanco (object) {
  
console.log("Estou aqui:" + object);
nano.db.destroy('petShop', function() {
  // create a new database 
  nano.db.create('petShop', function() {
    // specify the database we are going to use 
    var pet = nano.use('petShop');
    // and insert a document in it 
    pet.insert(object, 'rabbit', function(err, body, header) {
      if (err) {
        console.log('[petShop.insert] ', err.message);
        return;
      }
      console.log('you have inserted the rabbit.')
      console.log(body);
    });
  });
});
}
// a dictionary
var store_names = {
	users: 1,
	animals: 1,
	products: 1,
	services: 1,
	timeslots: 1,
	cartitems: 1,
};

// index name -> store name
var index_names = {
	username: 'users',
	email: 'users',
	owner: 'animals',
	user: 'cart_items',
	product: 'cart_items',
	services: 'name',
};


app.post('/create/:store', (req, res) => {
	var store = req.params.store;
	if(store in store_names === false) {
		res.status(404).send('404 Not Found');
		return;
	}

	var record = req.body;
	console.log(record);
	

	// TODO inserir no DB e dar send no resultado
	//insertBanco(record);
	
	nano.db.create('petShop', function(err, body, header) {
	console.log('Estou aqui');
  	if (err)
  		console.log(err);
  	else 
 	 	console.log(body, header);
	});
   
/* nano.db.destroy('petShop', function(err, body){
 	
 	if (err)
 		console.log(err);
 	else
 		console.log("sucesso");
});*/

/*nano.db.destroy('petShop', function() {
  // create a new database 
  nano.db.create('petShop', function() {
    // specify the database we are going to use 
    var pet = nano.use('petShop');
    // and insert a document in it 
    pet.insert({ happy: true }, 'rabbit', function(err, body, header) {
      if (err) {
        console.log('[petShop.insert] ', err.message);
        return;
      }
      console.log('you have inserted the rabbit.')
      console.log(body);
    });
  });
});*/

	res.status(200);
});

//app.

//app.put('/update/:store',
//app.get('/read/:store',
//app.get('/read/:store',


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
