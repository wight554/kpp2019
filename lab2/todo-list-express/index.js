const express = require('express'),
      app = express(),
      port = process.env.PORT || 3000,
      bodyParser = require('body-parser');

const mongodb = require('mongodb'),
      mongoClient = mongodb.MongoClient,
      mongoUrl = `mongodb://localhost:27017/todo-api`,
      ObjectId = mongodb.ObjectID;

let mongo = {};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

mongoClient
    .connect(mongoUrl)
    .then(function(client) {
        mongo = client.db();
    });

app.get('/', function(req, res){
    mongo
        .collection('tasks').find().toArray()
        .then(tasks => {
            res.render('', { tasks });
        })
});

app.get('/tasks/new', function(req, res) {
    res.render('new');
});

app.post('/tasks', function(req, res) {
    mongo
        .collection('tasks')
        .insertOne(req.body)
        .then(function() {
            res.redirect('/');
    });
});

app.get('/tasks/:id', function(req, res) {
    mongo
        .collection('tasks')
        .findOne({ _id: ObjectId(req.params.id) })
        .then(task => {
            res.render('show', { task });
        });
});

app.get('/tasks/:id/edit', function(req, res) {
    mongo
        .collection('tasks')
        .findOne({ _id: ObjectId(req.params.id) })
        .then(task => {
            res.render('edit', { task });
        });
});

app.post('/tasks/:id/update', function(req, res) {
    mongo
        .collection('tasks')
        .update({ _id: ObjectId(req.params.id) }, req.body)
        .then(function() {
            res.redirect('/');
        });
});

app.get('/tasks/:id/destroy', function(req, res) {
    mongo
        .collection('tasks')
        .deleteOne({ _id: ObjectId(req.params.id) })
        .then(function() {
            res.redirect('/');
        });
});

app.listen(port, function(){
    console.log("APP IS RUNNING ON PORT " + port);
})
