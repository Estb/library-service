const httpHelper = require('../helpers/httpResponseHelper');
const repository = require('../repository/libraryRepository');

const verifyRented = async (req, res, next) => {
  const id = req.params.book;

  await repository()
      .findByIdorISBN(id, {})
      .then((book) => {
        if (book == false || book == null) {
          return httpHelper(res).error({
            status: 404,
            message: 'This book no exists',
          });
        }
        if (book && book[0].rented === false) return next();

        return httpHelper(res).error(
            {
              status: 400,
              message: 'This book is rented, it is not possible to proceed',
            },
        );
      });
};

module.exports = verifyRented;
