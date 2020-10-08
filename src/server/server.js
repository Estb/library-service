const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const bodyParser = require('body-parser');
let server = null;

const start = (
    mongodb,
    router,
    controllers,
    httpResponseHelper,
    middleware,
    repository,
    callback,
) => {
  if (mongodb !== null) {
    mongodb.connect((err, db) => {
      if (err) return next(err);
    });
  }
  const app = express();
  app.use(morgan('dev'));
  app.use(helmet());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: false}));
  app.use((err, req, res, next) => {
    callback(new Error('Something went wrong!, err:' + err), null);
    res.status(500).send('Something went wrong!');
  });

  if (router != null) {
    router.library(
        app,
        controllers,
        httpResponseHelper,
        middleware,
        repository,
    );

    router.login(app, controllers, httpResponseHelper, middleware, repository);
  }

  server = app.listen(parseInt(process.env.PORT), () => callback(null, server));
};

const stop = (mongodb) => {
  if (server) {
    if (mongodb !== null) {
      mongodb.disconnect();
    }
    server.close();
    return true;
  }
};

module.exports = {start, stop};
