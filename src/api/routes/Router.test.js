const supertest = require('supertest');
const utils = require('../../utils/testutils');
const mongoDb = require('../../config/mongodb');
require('dotenv-safe').config();

let app = null;
let bookId = null;
let bookISBN = null;
let token = null;

beforeAll(async () => {
  app = await utils.testMock().startServer();
});

afterAll(() => {
  utils.testMock().stopServer(mongoDb);
});

describe('Test Login Router', () => {
  it("Should authenticate a user and receive a JWT token", async () => {
    const response = await supertest(app)
    .post("/login")
    .send({
      email: "adm@teste.com",
      password: "654321",
    });
    expect(response.status).toBe(200);
    expect(response.type).toBe("application/json");
    token = response.body.token
  });
})


describe('Test Library Router', () => {
  it('Should create a new Book', async (done) => {
    const response = await supertest(app)
        .post('/books')
        .send(utils.testMock().createBook())
        .set('Authorization', 'bearer ' + token);
    bookId = response.body._id;
    bookISBN = response.body.ISBN;
    expect(response.status).toBe(201);
    expect(response.type).toBe('application/json');
    done();
  });

  it('Should find All Books', async (done) => {
    const response = await supertest(app)
    .get('/books')
    .set('Authorization', 'bearer ' + token);
    expect(response.status).toBe(200);
    expect(response.type).toBe('application/json');
    done();
  });

  it('Should find one Book by id', async (done) => {
    const response = await supertest(app)
    .get('/books/' + `${bookId}`)
    .set('Authorization', 'bearer ' + token);
    expect(response.status).toBe(200);
    expect(response.type).toBe('application/json');
    done();
  });

  it('Should find one Book by ISBN', async (done) => {
    const response = await supertest(app)
    .get('/books/' + `${bookISBN}`)
    .set('Authorization', 'bearer ' + token);
    expect(response.status).toBe(200);
    expect(response.type).toBe('application/json');
    done();
  });

  it('Should search book by params', async (done) => {
    const response = await supertest(app)
        .get('/books')
        .query({name: 'test'})
        .set('Authorization', 'bearer ' + token);
    expect(response.status).toBe(200);
    expect(response.type).toBe('application/json');
    done();
  });

  it('Should User view book by ID', async (done) => {
    const response = await supertest(app)
        .get('/library/book/' + `${bookId}`)
        .set('Authorization', 'bearer ' + token);
    expect(response.status).toBe(200);
    expect(response.type).toBe('application/json');
    done();
  });

  it('Should find all books and find for one by query', async (done) => {
    const response = await supertest(app)
        .get('/library')
        .query({title: 'test'})
        .set('Authorization', 'bearer ' + token);
    expect(response.status).toBe(200);
    expect(response.type).toBe('application/json');
    done();
  });

  it('Should edit Book', async (done) => {
    const response = await supertest(app)
        .put('/books/' + `${bookId}`)
        .send(utils.testMock().editBook())
        .set('Authorization', 'bearer ' + token);
    expect(response.status).toBe(200);
    expect(response.type).toBe('application/json');
    done();
  });

  it('Should user rent a book', async (done) => {
    const response = await supertest(app)
        .post('/library/book/' + `${bookId}` + '/rent')
        .set('Authorization', 'bearer ' + token);
    expect(response.status).toBe(200);
    expect(response.type).toBe('application/json');
    done();
  });

  it('Should user return a book rent', async (done) => {
    const response = await supertest(app)
        .post('/library/book/' + `${bookId}` + '/return')
        .set('Authorization', 'bearer ' + token);
    expect(response.status).toBe(200);
    expect(response.type).toBe('application/json');
    done();
  });

  it('Should delete book', async (done) => {
    const response = await supertest(app)
        .delete('/books/' + `${bookId}`)
        .set('Authorization', 'bearer ' + token);
    expect(response.status).toBe(200);
    expect(response.type).toBe('application/json');
    done();
  });
});
