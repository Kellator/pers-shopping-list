global.DATABASE_URL = 'mongodb://localhost/shopping-list-test';

var chai = require('chai');
var chaiHttp = require('chai-http');

var server = require('../server.js');
var Item = require('../models/items');

var should = chai.should();
var expect = chai.expect();
var app = server.app;


chai.use(chaiHttp);

describe('Shopping List', function() {
    before(function(done) {
        server.runServer(function() {
            Item.create({name: 'Broad beans'},
                        {name: 'Peppers'},
                        {name: 'Tomatoes'}, function() {
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
            res.body[1].name.should.be.equal('Peppers');
            res.body[2].name.should.be.equal('Tomatoes');
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
                Item.should.have.length(3);
                // Item[1].should.have.property('_id');
                // Item[1].should.have.property('name');
                // Item[1]._id.should.be.a('string');
                // Item[1].name.should.be.a('string');
                // Item[1].name.should.equal('Kale');
                done();
            });
    });
    it('should edit an item on put', function(done) {
        Item.create({name: 'Beer'}, function(err, item) {
            console.log(item);
            if (err) {
            }
            else {
            chai.request(app)
                .put('/items/' + item._id)
                .send({ name: 'Pickles'})
                .end(function(err, res) {
            res.should.have.status(201);
            chai.request(app).get('/items').end(function(err, res) {
                console.log(res.body);
                    should.equal(err, null);
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.should.have.length(5);
                    res.body[4].name.should.equal('Tomatoes');
                    done();
                });
            });
        }
    });
});
//have to 'POST' first
    it('should delete an item on delete', function(done) {
        chai.request(app)
              .post('/items')
              // NOTE: We send 'Grapes' to the DB.
              .send({ name: 'Grapes' })
              .end(function(err, res) {
                res.should.have.status(201);
                var id = res.body._id;
                chai.request(app)
                // NOTE: We again must specify the MongoDB id not our own.
                    .delete('/items/' + id)
                    .end(function(err, res) {
                        res.should.have.status(201);
                        chai.request(app)
                      // NOTE: We then check the DB to make sure 'Grapes' is no longer present.
                            .get('/items')
                            .end(function(err, res) {
                                should.equal(err, null);
                                res.should.have.status(200);
                                res.body.should.be.a('array');
                                res.body.should.have.length(5);
                                res.body[0].name.should.equal('Broad beans');
                                res.body[1].name.should.equal('Kale');
                                res.body[2].name.should.equal('Peppers');
                                res.body[3].name.should.equal('Pickles');
                                res.body[4].name.should.equal('Tomatoes');
                                done();
                            })
                        })
                    })
    });
    after(function(done) {
        Item.remove(function() {
            done();
        });
    });
});