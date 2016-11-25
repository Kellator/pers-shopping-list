# NOTES

So for the most part common mistakes when first working with Mongoose.
In your tests you run your `before` to initialize a Schema of whatever your expected input to MongoDB will be.

## GET & POST

`GET` & `POST` you were golden on.
I added the `.sort('name')` so your db would be ordered A-Z.
You would have fought your testing if not placing a parameter to sort by.

## PUT

You must first `create` an item to update in the Schema:

```
Schema.create({ name: 'Beer' }), function(err, item) {
  if(err) {
    // Handle the error.
  } else {
    // Run test.
  }
}
```
Now that you have created an item to update you can go about updating the item however you are choosing to do so, in your case by id.

#### PUT TEST
```
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
```

Notice that I am not saying `/items/1` this because when you create an item in a collection in MongoDB it automatically assigns an `_id`. This is what you want to use.


## DELETE

This is a little confusing to deal with at first.
You need to `POST` something to `DELETE` in your test first.
So just like in your POST method send something to the db.
Then you want to run your `.delete()`.
Notice again we are looking for the specific `_id` from MongoDB.
Lastly you want to make sure it is no longer in your db by running a check on that `.get()`

Hoping all this helps out for future Schema testing if you have any questions just hmu on Slack! - Cody (@rockchalkwushock)
