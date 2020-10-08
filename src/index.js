require('dotenv-safe').config();
const router = require('./api/routes');
const server = require('./server/server');
const controllers = require('./api/controllers/libraryControllers');
const httpResponseHelper = require('./helpers/httpResponseHelper');
const repository = require('./repository/libraryRepository');
const middleware = require('./middleware');
const mongoDb = require('./config/mongodb');

server.start(
    mongoDb,
    router,
    controllers,
    httpResponseHelper,
    repository,
    middleware,
    (err, app) => {
      if (err) return console.log(err);

      console.log('just started');
    },
);
