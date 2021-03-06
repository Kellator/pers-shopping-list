//creates the express app, uses body-parser middleware to handle request bodies, and static middleware to serve static assets
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var config = require('./config');

var app = express();

app.use(bodyParser.json());
app.use(express.static('public'));
//responsible for coordinating both the connection to the database and the running of the HTTP server
//use mongoose to connect to database via URL from config.js file
//listen for new connections and call callback to signal success
var runServer = function(callback) {
    mongoose.connect(config.DATABASE_URL, function(err) {
        if (err && callback) {
            return callback(err);
        }
        app.listen(config.PORT, function() {
            console.log('Listening on localhost:' + config.PORT);
            if (callback) {
                callback();
            }
        });
    });
};
//trick to make this file both an executable script and a module
if (require.main === module) {
    runServer(function(err) {
        if (err) {
            console.error(err);
        }
    });
};

exports.app = app;
exports.runServer = runServer;

//middlewares
var Item = require('./models/items');
//retrieve list of items from database and returns as JSON
//Item.find().sort line will sort inputs by name from A-z
app.get('/items', function(req, res) {
    Item.find().sort('name').exec(function(err, items) {
        if (err) {
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        }
        res.json(items);
    });
});
//create new item on list taking name from request body
app.post('/items/', function(req, res) {
    Item.create({
        name: req.body.name
    }, function(err, item) {
        if (err) {
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        }
        res.status(201).json(item);
    });
});
//change items on list
//code changes suggested by rockchalkwushock
app.put('/items/:id', function(req, res) {
    var id = {_id: req.params.id};
    var update = {name: req.body.name};
    Item.findOneAndUpdate(id, update, function(err, items) {
        if (err) {
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        }
        console.log(items);
        res.status(201).json(items);
    });
});
//following commented lines from original curriculum
    // Item.findOneAndUpdate({
    //     _id: req.params.id
    // }, {name: req.body.name}, {new: true}, function(err, item) {
    //     if (err) {
    //         return res.status(500).json({
    //             message: 'Internal Server Error'
    //         });
    //     }
    //     console.log(item);
    //     res.status(201).json(item);

//deletes item from the database list
app.delete('/items/:id', function(req, res) {
    Item.findOneAndRemove({
        _id: req.params.id
    }, function(err, item) {
        if (err) {
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        }
        res.status(201).json({success: true});
    });
});
//catch-all end point that serves 404 message if neither of other endpoints hit by request
app.use('*', function(req, res) {
    res.status(404).json({
        message: 'Not Found'
    });
});