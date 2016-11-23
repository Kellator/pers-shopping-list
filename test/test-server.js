global.DATABASE_URL = 'mongodb://localhost/shopping-list-test';

var chai = require('chai');
var chaiHttp = require('chai-http');

var server = require('../server.js');
var Item = require('../models/items');

var should = chai.should();
var app = server.app;

chai.use(chaiHttp);

describe('Shopping List', function() {
    before(function(done) {
        server.runServer(function() {
            Item.create({name: 'Broad beans'},
            {name: 'Tomatoes'},
            {name: 'Peppers'}, function() {
                done();
            });
        });
    });
    
    it('should list items on get', function(done) {
        chai.request(app)
        .get('/items')
        .end(function(err, res) {
            should.equal(err, null);
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a('array');
            res.body.should.have.length(3);
            res.body[0].should.be.a('object');
            res.body[0].should.have.property('name');
            res.body[0].should.have.property('_id');
            res.body[0]._id.should.be.a('string');
            res.body[0].name.should.be.a('string');
            res.body[0].name.should.be.equal('Broad beans');
            res.body[1].name.should.be.equal('Tomatoes');
            res.body[2].name.should.be.equal('Peppers');
            done();
        });
    });
    it('should add an item on post', function(done) {
        chai.request(app)
            .post('/items')
            .send({'name': 'Kale'})
            .end(function(err, res) {
                should.equal(err, null);
                res.should.have.status(201);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('name');
                res.body.should.have.property('_id');
                res.body.name.should.be.a('string');
                res.body._id.should.be.a('string');
                res.body.name.should.be.equal('Kale');
                // Item.items.should.be.a('array');
                // Item.should.have.length(4);
                // Item[3].should.be.a('object');
                // Item[3].should.have.property('_id');
                // Item[3].should.have.property('name');
                // Item[3]._id.should.be.a('string');
                // Item[3].name.should.be.a('string');
                // Item[3].name.should.equal('Kale');
                done();
            });
    });
    it('should edit an item on put', function(done) {
        chai.request(app)
            .put('/items/1')
            .send({'name': 'Pickles', '_id': 1})
            .end(function(err, res) {
                should.equal(err, null);
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('name');
                res.body.should.have.property('_id');
                res.body.name.should.be.a('string');
                res.body._id.should.be.a('number');
                // Item.should.be.a('array');
                // Item[0].should.be.a('object');
                // Item[0].should.have.property('_id');
                // Item[0].should.have.property('name');
                // Item[0]._id.should.be.a('string');
                // Item[0].name.should.be.a('string');
                // Item[0]._id.should.equal(1);
                // Item[0].name.should.equal('Pickles');
                done();
            });
    });
    it('should delete an item on delete', function(done) {
        chai.request(app)
            .delete('/items/1')
            .send()
            .end(function(err, res) {
                should.equal(err, null);
                res.should.have.status(200);
                Item.should.have.length(2);
                Item.should.be.a('array');
                // Item[0].should.be.a('object');
                // Item[0].should.have.property('_id');
                // Item[0].should.have.property('name');
                // Item[0]._id.should.be.a('string');
                // Item[0].name.should.be.a('string');
                res.body.should.be.a('object');
                res.should.be.json;
                done();
            });
    });
    after(function(done) {
        Item.remove(function() {
            done();
        });
    });
});