require('dotenv-safe').config();
const repository = require('./libraryRepository');
const mongodb = require('../config/mongodb');
const apiMock = require('../utils/testutils').testMock();

let bookId;

beforeAll(async () => {
  await mongodb.connect(async (err, db) => {
    if (err) return false;
    const book = await repository().create(apiMock.createBook());
    bookId = book._id;
  });
});

afterAll( () => {
  mongodb.disconnect();
});

describe('Test Repository', () => {
  it('Should search for book', async (done) => {
    const book = await repository().search({active: 'true'}, 1, 1);
    expect(book[0]).toHaveProperty('_id');
    done();
  });

  it('Should find by findByIdorISBN', async (done) => {
    const book = await repository().findByIdorISBN(bookId, {});
    expect(book[0]).toHaveProperty('_id');
    done();
  });

  it('Should find All Itens', async (done) => {
    const book = await repository().findAll();
    expect(book[0]).toHaveProperty('title');
    done();
  });

  it('Should Create a new book', async (done) => {
    const book = await repository().create(apiMock.createBook());
    expect(book).toMatchObject({title: apiMock.createBook().title});
    done();
  });

  it('Should Edit a book', async (done) => {
    const book = await repository().update(
        bookId,
        apiMock.editBook(),
    );
    expect(book).toMatchObject({status: 200});
    done();
  });

  it('Should rent a book', async (done) => {
    const book = await repository().rentBook(bookId, apiMock.rentHelp());
    expect(book).toMatchObject({rented: true});
    done();
  });

  it('Should return rent book', async (done) => {
    const book = await repository().bookReturn(bookId, 123456 );
    expect(book).toMatchObject({rented: false});
    done();
  });

  it('Delete a book', async (done) => {
    const book = await repository().delete(bookId);
    expect(book).toMatchObject({status:200});
    done();
  });
});
