// jshint esversion: 6

var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static('public'));


// localhost:8000/ajax/users_by_username?key=USERNAME
app.get('/ajax/users_by_username', (req, res) => {
	if(req.query.key === undefined) {
		res.status(400).send("400 Bad Request");
	}

	// TODO implementar direito, isso eh so para testar
	res.json(
		[{
			id: 1,
			is_admin: (req.query.key === 'hdzin'),
			username: req.query.key,
			password: '1',
			name: 'Hugo Dzin',
			photo: 'images/perfil.jpg',
			phone: '(99) 1111-2222',
			email: 'hugo@petshop.com',
			adress: 'Rua dos Bobos Nr 0',
		}]
	);
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
