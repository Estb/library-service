
const mongodb = require('./mongodb');
const mongoose = require('mongoose');
require('dotenv-safe').config();


describe('Test MongoDb conection', () => {
  it('MongoDB Connect', (done) => {
    return mongodb.connect((err, db) => {
      expect(db).toBeInstanceOf(mongoose.Connection);
      done();
    });
  });

  it('MongoDB Disconnect', (done) => {
    mongodb.disconnect((mg) => {
      expect(mg).toBe(null);
    });
    done();
  });
});
