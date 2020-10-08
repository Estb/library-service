/* eslint-disable max-len */
const Model = require('./bookModels');
const mongoose = require('mongoose');
const mongodb = require('../config/mongodb');
const utils = require('../utils/testutils');
require('dotenv-safe').config();

beforeAll(async () => {
  await mongodb.connect(async (err, db) => {
    if (err) return false;
  });
});

afterAll(() => {
  mongodb.disconnect();
});

describe('Test Books Models', () => {
  it('Should create & save book successfully', async (done) => {
    const data = utils.testMock().createBook();
    const validBook = new Model(data);
    const savedBook = await validBook.save();
    // Object Id should be defined when successfully saved to MongoDB.
    expect(savedBook._id).toBeDefined();
    expect(savedBook.title).toBe(data.title);
    expect(savedBook.ISBN).toBe(data.ISBN);
    done();
  });

  // Test Validation is working!!!
  it('Create Book without required field should failed', async (done) => {
    const book = new Model({});
    let err;
    try {
      const savedBookWithoutRequiredField = await book.save();
      error = savedBookWithoutRequiredField;
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    done();
  });
});
