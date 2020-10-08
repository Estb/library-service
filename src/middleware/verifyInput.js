const input = require('../helpers/inputHelper');

const newBook = (req) => {
  return new Promise(async (resolve, reject) => {
    const {body} = req;
    await input.newBookSchema
        .validateAsync(body)
        .then((input) => {
          return resolve(input);
        })
        .catch((err) => reject(err.message));
  });
};

const editBook = (req) => {
  return new Promise(async (resolve, reject) => {
    const {body} = req;
    await input.editBookSchema
        .validateAsync(body)
        .then((input) => {
          return resolve(input);
        })
        .catch((err) => reject(err.message));
  });
};

const queryBook = (req) => {
  return new Promise(async (resolve, reject) => {
    const {query} = req;
    await input.querySchema
        .validateAsync(query)
        .then((input) => {
          return resolve(input);
        })
        .catch((err) => reject(err.message));
  });
};

module.exports = {newBook, editBook, queryBook};
