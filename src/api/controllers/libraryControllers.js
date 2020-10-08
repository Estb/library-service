// Get One Book by ID or ISBN
const getOneBook = (IdorISBN, repository) => {
  return new Promise((resolve, reject) => {
    try {
      const helper = {};

      repository()
          .findByIdorISBN(IdorISBN, helper)
          .then((book) => {
            if (book == false || book == null) {
              return resolve({
                status: 404,
                message: 'This book no exists',
              });
            }

            return resolve(book);
          })
          .catch((error) => reject(error));
    } catch (error) {
      if (error) return reject(error);
    }
  });
};

// Get all Books
const getAllBooks = (skip, limit, repository) => {
  return new Promise((resolve, reject) => {
    try {
      repository()
          .findAll(skip, limit)
          .then((library) => {
            if (library.length < 1) {
              return resolve({
                status: 404,
                message: 'There are no books registered',
              });
            }

            return resolve(library);
          })
          .catch((error) => reject(error));
    } catch (error) {
      if (error) return reject(error);
    }
  });
};

// create a new Book
const createNewBook = (book, repository) => {
  return new Promise((resolve, reject) => {
    try {
      checkDuplicity(book.ISBN, repository)
          .then((cd) => {
            if (cd == true) {
              return resolve({
                status: 409,
                message: 'This ISBN is already in use by another book.',
              });
            } else {
              repository()
                  .create(book)
                  .then((newBook) => {
                    return resolve(newBook);
                  })
                  .catch((error) => reject(error));
            }
          })
          .catch((error) => reject(error));
    } catch (error) {
      if (error) return reject(error);
    }
  });
};

// Edit Book by ID or ISBN
const editBook = (id, book, repository) => {
  return new Promise((resolve, reject) => {
    try {
      repository()
          .findByIdorISBN(id, {})
          .then((bk) => {
            if (!bk) {
              return resolve({
                status: 404,
                message: 'This book no exists',
              });
            }

            checkDuplicity(book.ISBN, repository, id)
                .then((cd) => {
                  if (cd == true) {
                    return resolve({
                      status: 409,
                      message: 'This ISBN is already in use by another book.',
                    });
                  } else {
                    repository()
                        .update(id, book)
                        .then((editedBook) => {
                          return resolve(editedBook);
                        })
                        .catch((error) => reject(error));
                  }
                })
                .catch((error) => reject(error));
          })
          .catch((error) => reject(error));
    } catch (error) {
      if (error) return reject(error);
    }
  });
};

// delete Book by ID
const deleteBook = (id, repository) => {
  return new Promise((resolve, reject) => {
    try {
      repository()
          .delete(id)
          .then((delBook) => {
            return resolve(delBook);
          })
          .catch((error) => reject(error));
    } catch (error) {
      if (error) return reject(error);
    }
  });
};

// Find all or by query
const searchItem = async (skip, limit, input, repository) => {
  return new Promise((resolve, reject) => {
    try {
      escapeRegex = (string) => {
        return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      };
      const search = [];
      for (const key in input) {
        if (
          key != null &&
          key != 'rented' &&
          key != 'limit' &&
          key != 'skip' &&
          key != 'page'
        ) {
          search.push({[key]: {$regex: escapeRegex(input[key])}});
        } else if (key != 'limit' && key != 'skip' && key != 'page') {
          search.push({[key]: input[key]});
        } else {
          search.push({});
        }
      }
      repository()
          .search(search, skip, limit)
          .then((book) => {
            if (!book) {
              return resolve({
                status: 404,
                message: 'No books were found with the parameters informed',
              });
            }


            const view = book.map((element) => {
              element.details = undefined;
              element.rent = undefined;
              element.active = undefined;

              return element;
            });

            return resolve(view);
          })
          .catch((error) => reject(error));
    } catch (error) {
      if (error) return reject(error);
    }
  });
};

// check for duplicity function
const checkDuplicity = async (book, repository, id) => {
  if (!book || !repository) return false;
  const cd = await repository().findByIdorISBN(book, {});
  if (cd == false) {
    return false;
  } else if (cd != null) {
    if ((id && id == cd.id) || (id && id == cd.ISBN)) {
      return false;
    }
    return true;
  }
  return false;
};

// Client View book By Id or ISBN
const viewBook = (book, repository) => {
  return new Promise((resolve, reject) => {
    try {
      const helper = {active: true};
      repository()
          .findByIdorISBN(book, helper)
          .then((book) => {
            if (!book) {
              return resolve({
                status: 404,
                message: 'This book no exists',
              });
            }

            book[0].rent = undefined;
            book[0].active = undefined;
            return resolve(book);
          })
          .catch((error) => reject(error));
    } catch (error) {
      if (error) return reject(error);
    }
  });
};

// Client View library
const viewLibrary = (repository) => {
  return new Promise((resolve, reject) => {
    try {
      const searchHelp = {active: 'true'};
      repository()
          .search(searchHelp)
          .then(async (library) => {
            if (!library) {
              return resolve({
                status: 404,
                message: 'This book no exists',
              });
            }

            const view = library.map((element) => {
              element.details = undefined;
              element.rent = undefined;
              element.active = undefined;

              return element;
            });

            return resolve(view);
          })
          .catch((error) => reject(error));
    } catch (error) {
      if (error) return reject(error);
    }
  });
};

// Client rent a book by id or ISBN
const rentBook = (book, userId, repository) => {
  return new Promise((resolve, reject) => {
    try {
      const endRental = new Date();
      endRental.setDate(endRental.getDate() + 30);

      const rentHelp = {
        user: userId,
        startRental: Date.now(),
        endRental: endRental,
        completed: 'false',
      };

      repository()
          .rentBook(book, rentHelp)
          .then((book) => {
            if (book == false || book == null) {
              return resolve({
                status: 404,
                message: 'This book no exists or is not available for rent',
              });
            }

            return resolve({
              status: 200,
              message: 'Rental successful.You have 30 days to return the book.',
            });
          })
          .catch((error) => reject(error));
    } catch (error) {
      if (error) return reject(error);
    }
  });
};

// Client rent a book by id or ISBN
const bookReturn = (book, userId, repository) => {
  return new Promise((resolve, reject) => {
    try {
      repository()
          .bookReturn(book, userId)
          .then((book) => {
            if (book == false || book == null) {
              return resolve({
                status: 404,
                message:
                // eslint-disable-next-line max-len
                'This book no exists, is not available for return or you didn\'t rent that book',
              });
            }

            return resolve({
              status: 200,
              message: 'Book successfully returned',
            });
          })
          .catch((error) => reject(error));
    } catch (error) {
      if (error) return reject(error);
    }
  });
};

module.exports = {
  createNewBook,
  getOneBook,
  getAllBooks,
  editBook,
  deleteBook,
  searchItem,
  viewLibrary,
  viewBook,
  rentBook,
  bookReturn,
};
