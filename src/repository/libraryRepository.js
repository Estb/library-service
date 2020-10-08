/* eslint-disable max-len */
const model = require('../models/bookModels');
const logger = require('../helpers/loggerHelp');
const mongoose = require('mongoose');

module.exports = () => {
  return {
    // Search for a item by params
    search: async (search, skip, limit) => {
      return new Promise((resolve, reject) => {
        model
            .find()
            .and(search)
            .skip(skip)
            .limit(limit)
            .then((ok) => {
              if (ok.length > 0) {
                logger.info('[BookDAO] Search done successfully');
                return resolve(ok);
              } else {
                logger.info(
                // eslint-disable-next-line max-len
                    '[BookDAO]No books were found with the parameters informed',
                );
                return resolve(
                    resolve(false),
                );
              }
            })
            .catch((err) => {
              logger.error(
                  '[BookDAO] An error has occurred while find this book',
                  err,
              );
              return reject(new Error(err));
            });
      });
    },
    findByIdorISBN: async (book, helper) => {
      return new Promise(async (resolve, reject) => {
        let item = model
            .find({ISBN: book})
            .and(helper)
            .then((s) => {
              if (JSON.stringify(s) === JSON.stringify([])) {
                if (mongoose.Types.ObjectId.isValid(book)) {
                  item = model.find({_id: book}).and(helper);
                  logger.info('[BookDAO] Search done successfully by Id');
                  resolve(item);
                } else {
                  logger.info('[BookDAO] Not found this book');
                  return resolve(false);
                }
              } else {
                logger.info('[BookDAO] Search done successfully by ISBN');
                return resolve(s);
              }
            })
            .catch((err) => {
              logger.error(
                  '[BookDAO] An error has occurred while find this book',
                  err,
              );
              return reject(new Error(err));
            });
      });
    },
    findAll: async (skip, limit) => {
      return new Promise((resolve, reject) => {
        model
            .find()
            .skip(skip)
            .limit(limit)
            .then((ok) => {
              if (ok.length > 0) {
                logger.info('[BookDAO] Search done successfully');
                return resolve(ok);
              } else {
                logger.info('[BookDAO] No books found');
                return resolve({
                  status: 404,
                  message: 'No books found',
                });
              }
            })
            .catch((err) => {
              logger.error(
                  '[BookDAO] An error has occurred while find all books',
                  err,
              );
              return reject(new Error(error));
            });
      });
    },
    create: (book) => {
      return new Promise((resolve, reject) => {
        logger.info('[BookDAO] Creating a new book', JSON.stringify(book));
        model
            .create(book)
            .then((book) => {
              logger.info(
                  '[BookDAO] The book has been created succesfully',
                  JSON.stringify(book),
              );
              return book;
            })
            .then(resolve)
            .catch((error) => {
              logger.error('[BookDAO] An error has ocurred while saving', error);
              return reject(new Error(error));
            });
      });
    },
    update: (id, book) => {
      return new Promise((resolve, reject) => {
        logger.info('[BookDAO] Update a book');
        if (mongoose.Types.ObjectId.isValid(id)) {
          model
              .updateOne({_id: id}, book, {
                multi: false,
                new: false,
              })
              .then((item) => {
                logger.info('[BookDAO] The book has been updated succesfully');
                resolve({
                  status: 200,
                  message: 'The book has been updated succesfully',
                });
              })
              .catch((err) => {
                logger.error(
                    '[BookDAO] An error has ocurred while updating this book',
                    err,
                );
                return reject(new Error(err));
              });
        } else {
          resolve({
            status: 400,
            message: 'You need to pass a correct book id',
          });
        }
      });
    },
    delete: (id) => {
      return new Promise((resolve, reject) => {
        if (mongoose.Types.ObjectId.isValid(id)) {
          model
              .findByIdAndRemove(id)
              .then((res) => {
                if (res) {
                  logger.info(
                      '[BookDAO] This book have been deleted succesfully',
                  );
                  return resolve({
                    status: 200,
                    message: 'This book has been deleted succesfully',
                  });
                } else {
                  logger.info('[BookDAO] Not found this book');
                  return resolve({
                    status: 404,
                    message: 'This book no exists',
                  });
                }
              })
              .catch((err) => {
                logger.error(
                // eslint-disable-next-line max-len
                    '[BookDAO] An error has occurred while deleting the item',
                    err,
                );
                return reject(new Error(error));
              });
        } else {
          return resolve({
            status: 400,
            message: 'You need to pass a correct book id',
          });
        }
      });
    },
    rentBook: (IdorISBN, rentHelper) => {
      return new Promise(async (resolve, reject) => {
        logger.info('[BookDAO] Create new book renting');
        let item = null;
        item = await model
            .findOneAndUpdate(
                {ISBN: IdorISBN},
                {
                  rented: 'true',
                  $push: {
                    rent: rentHelper,
                  },
                },
                {multi: false, new: true},
            )
            .and({rented: 'false'})
            .then((s) => {
              if (s == null) {
                if (mongoose.Types.ObjectId.isValid(IdorISBN)) {
                  item = model
                      .findOneAndUpdate(
                          {_id: IdorISBN},
                          {
                            rented: 'true',
                            $push: {
                              rent: rentHelper,
                            },
                          },
                          {multi: false, new: true},
                      )
                      .and({rented: 'false'});
                  logger.info(
                      '[BookDAO] ThiS book has been updated succesfully by ID',
                  );
                  resolve(item);
                } else {
                  logger.info('[BookDAO] Not found');
                  return resolve(false);
                }
              } else {
                logger.info(
                    '[BookDAO] This book has been updated succesfully by ISBN',
                );
                resolve(s);
              }
            });
      });
    },
    bookReturn: (IdorISBN, userId) => {
      console.log(userId);
      return new Promise((resolve, reject) => {
        logger.info('[BookDAO] Edit a book renting');
        let item = null;
        item = model
            .findOneAndUpdate(
                {'ISBN': IdorISBN, 'rent.completed': 'false'},
                {
                  rented: 'false',
                  $set: {
                    'rent.$.completed': 'true',
                    'rent.$.returnDate': Date.now(),
                  },
                },
                {multi: false, new: true},
            )
            .and({rented: 'true'})
            .then((s) => {
              if (s == null) {
                if (mongoose.Types.ObjectId.isValid(IdorISBN)) {
                  item = model
                      .findOneAndUpdate(
                          {'_id': IdorISBN, 'rent.completed': 'false'},
                          {
                            rented: 'false',
                            $set: {
                              'rent.$.completed': 'true',
                              'rent.$.returnDate': Date.now(),
                            },
                          },
                          {multi: false, new: true},
                      )
                      .and({rented: 'true'});
                  logger.info(
                      '[BookDAO] ThiS book has been updated succesfully by ID',
                  );
                  resolve(item);
                } else {
                  logger.info('[BookDAO] Not found');
                  return resolve(false);
                }
              } else {
                logger.info(
                    '[BookDAO] This book has been updated succesfully by ISBN',
                );
                resolve(s);
              }
            });
      });
    },
  };
};
