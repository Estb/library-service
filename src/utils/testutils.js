/* eslint-disable max-len */
const server = require('../server/server');
const repository = require('../repository/libraryRepository');
const mongodb = require('./../config/mongodb');
const httpResponseHelper = require('../helpers/httpResponseHelper');
const middleware = require('../middleware');
const router = require('../api/routes');
const controllers = require('../api/controllers/libraryControllers');

const makeISBN = (length) => {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const testMock = () => {
  return {
    createBook: () => {
      return {
        active: 'true',
        ISBN: makeISBN(5),
        title: 'It is a book test',
        author: 'Estevao',
        category: 'test category',
        details: {
          description: 'description test',
          numberOfPages: '300',
          comments: 'test comments',
        },
      };
    },
    editBook: (test) => {
      return {
        active: 'true',
        ISBN: makeISBN(5),
        title: 'It is a book test',
        author: 'Estevao',
        category: 'test category',
        details: {
          description: 'description test',
          numberOfPages: '300',
          comments: 'test comments',
        },
      };
    },
    startServer: () => {
      return new Promise(async (resolve, reject) => {
        server.start(
            mongodb,
            router,
            controllers,
            httpResponseHelper,
            repository,
            middleware,
            (err, server) => {
              if (err) return reject(err);
              if (server) return resolve(server);
            },
        );
      });
    },
    stopServer: (mongoDb) => {
      return new Promise(async (resolve, reject) => {
        server.stop(mongoDb, (ok) => {
          resolve(ok);
        });
      });
    },
    login: (mongoDb) => {
      return new Promise(async (resolve, reject) => {
        server.stop(mongoDb, (ok) => {
          resolve(ok);
        });
      });
    },
    rentHelp: ()=> {
      const endRental = new Date();
      endRental.setDate(endRental.getDate() + 30);

      return {user: 123456,
        startRental: Date.now(),
        endRental: endRental,
        completed: 'false',
      };
    },
    token: () => {
      return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImxldmVsIjoyLCJpZCI6NjU0MzIxfSwiaWF0IjoxNjAyMTE5OTgyfQ.uAVUzc76PVL5ZfkcBgQQUY-tScMtBPp2N94UJz2rLSM';
    },
  };
};

module.exports = {makeISBN, testMock};
