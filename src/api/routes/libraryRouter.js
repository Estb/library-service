const passport = require('passport');

module.exports = (
    app,
    controllers,
    httpResponseHelper,
    repository,
    middleware,
) => {
  const rh = httpResponseHelper;
  const inputNewHelper = middleware.inputHelper.newBook;
  const inputEditHelper = middleware.inputHelper.editBook;
  const inputQueryHelper = middleware.inputHelper.queryBook;

  // Get one book by ID or By ISBN
  app.get(
      '/books/:book',
      passport.authenticate('jwt', {session: false}),
      (req, res, next) => {
        if (!req.user.level || req.user.level <=1) {
          return rh(res).error({
            status: 401,
            message: 'You do not have the necessary permission',
          });
        }

        const {book} = req.params;
        controllers
            .getOneBook(book, repository)
            .then((book) => {
              rh(res).ok(book);
            })
            .catch((err) => {
              if (err) return next(err);
            });
      },
  );

  // Get all books or Find books
  app.get(
      '/books/',
      passport.authenticate('jwt', {session: false}),
      (req, res, next) => {
        if (!req.user.level || req.user.level <=1) {
          return rh(res).error({
            status: 401,
            message: 'You do not have the necessary permission',
          });
        }
        let page = parseInt(req.query.page || '1');
        let skip = parseInt(req.query.skip || '0');
        const limit = parseInt(req.query.limit || '5');
      page < 1 ? (page = 1) : page;
      skip += (page - 1) * limit;

      inputQueryHelper(req)
          .then((input) => {
            if (JSON.stringify(input) !== JSON.stringify({})) {
              controllers
                  .searchItem(skip, limit, input, repository)
                  .then((library) => {
                    rh(res).ok(library);
                  })
                  .catch((err) => {
                    if (err) return next(err);
                  });
            } else {
              controllers
                  .getAllBooks(skip, limit, repository)
                  .then((library) => {
                    rh(res).ok(library);
                  })
                  .catch((err) => {
                    if (err) return next(err);
                  });
            }
          })
          .catch((err) => {
            if (err) return rh(res).error({status: 400, message: err});
          });
      },
  );

  // Create a new book
  app.post(
      '/books',
      passport.authenticate('jwt', {session: false}),
      (req, res, next) => {
        if (!req.user.level || req.user.level <=1) {
          return rh(res).error({
            status: 401,
            message: 'You do not have the necessary permission',
          });
        }
        inputNewHelper(req)
            .then((input) => {
              if (input) {
                controllers
                    .createNewBook(input, repository)
                    .then((book) => {
                      if (book) return rh(res).created(book);
                    })
                    .catch((err) => next(err));
              }
            })
            .catch((err) => {
              if (err) return rh(res).error({status: 400, message: err});
            });
      },
  );

  // edit book by Id or ISBN
  app.put(
      '/books/:book',
      passport.authenticate('jwt', {session: false}),
      middleware.verifyRented,
      (req, res, next) => {
        if (!req.user.level || req.user.level <=1) {
          return rh(res).error({
            status: 401,
            message: 'You do not have the necessary permission',
          });
        }
        const id = req.params.book;
        inputEditHelper(req)
            .then((input) => {
              if (input) {
                controllers
                    .editBook(id, input, repository)
                    .then((book) => {
                      if (book) return rh(res).ok(book);
                    })
                    .catch((err) => next(err));
              }
            })
            .catch((err) => {
              if (err) return rh(res).error({status: 400, message: err});
            });
      },
  );

  // delete book by ID
  app.delete(
      '/books/:book',
      passport.authenticate('jwt', {session: false}),
      middleware.verifyRented,
      (req, res, next) => {
        if (!req.user.level || req.user.level <=1) {
          return rh(res).error({
            status: 401,
            message: 'You do not have the necessary permission',
          });
        }
        const id = req.params.book;
        controllers
            .deleteBook(id, repository)
            .then((book) => {
              if (book) return rh(res).ok(book);
            })
            .catch((err) => next(err));
      },
  );

  // User Get one book by  ID or By ISBN
  app.get(
      '/library/books/:bookIdorISBN',
      passport.authenticate('jwt', {session: false}),
      (req, res, next) => {
        const {bookIdorISBN} = req.params;
        controllers
            .viewBook(bookIdorISBN, repository)
            .then((book) => {
              rh(res).ok(book);
            })
            .catch((err) => {
              if (err) return next(err);
            });
      },
  );

  // User Get all books or find by query
  app.get(
      '/library',
      passport.authenticate('jwt', {session: false}),
      (req, res, next) => {
        let page = parseInt(req.query.page || '1');
        let skip = parseInt(req.query.skip || '0');
        const limit = parseInt(req.query.limit || '5');
      page < 1 ? (page = 1) : page;
      skip += (page - 1) * limit;

      inputQueryHelper(req)
          .then((input) => {
            if (JSON.stringify(input) !== JSON.stringify({})) {
              controllers
                  .searchItem(skip, limit, input, repository)
                  .then((library) => {
                    rh(res).ok(library);
                  })
                  .catch((err) => {
                    if (err) return next(err);
                  });
            } else {
              controllers
                  .viewLibrary(repository)
                  .then((library) => {
                    rh(res).ok(library);
                  })
                  .catch((err) => {
                    if (err) return next(err);
                  });
            }
          })
          .catch((err) => {
            if (err) return rh(res).error({status: 400, message: err});
          });
      },
  );

  // User rent a book
  app.post(
      '/library/books/:bookIdorISBN/rent',
      passport.authenticate('jwt', {session: false}),
      (req, res, next) => {
        const {bookIdorISBN} = req.params;
        const userId = req.user.id;
        controllers
            .rentBook(bookIdorISBN, userId, repository)
            .then((book) => {
              rh(res).ok(book);
            })
            .catch((err) => {
              if (err) return next(err);
            });
      },
  );

  // User return a book
  app.post(
      '/library/books/:bookIdorISBN/return',
      passport.authenticate('jwt', {session: false}),
      (req, res, next) => {
        const {bookIdorISBN} = req.params;
        const userId = req.user.id;
        controllers
            .bookReturn(bookIdorISBN, userId, repository)
            .then((book) => {
              rh(res).ok(book);
            })
            .catch((err) => {
              if (err) return next(err);
            });
      },
  );
};
