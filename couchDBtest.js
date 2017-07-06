var nano = require('nano')('http://localhost:5984');
nano.db.create('test');

var test_db = nano.db.use('test');

var data = { 
    name: 'pikachu', 
    skills: ['thunder bolt', 'iron tail', 'quick attack', 'mega punch'], 
    type: 'electric' 
};

test_db.insert(data, 'unique_id', function(err, body){
  if(!err){
    Console.log("data added")
  }
});
