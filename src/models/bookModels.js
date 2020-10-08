const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookSchema = new Schema({
  active: {type: Boolean, required: true, default: true},
  ISBN: {type: String, required: true, unique: true},
  title: {type: String, required: true},
  author: {type: String, required: true},
  category: {type: String, required: true},
  details: {
    description: {type: String},
    numberOfPages: {type: Number},
    comments: {type: String},
  },
  rent: [
    {
      user: String,
      startRental: Date,
      endRental: Date,
      completed: Boolean,
      returnDate: Date,
    },
  ],
  rented: {type: Boolean, required: true, default: false},
});

const Book = mongoose.model('Book', bookSchema);
module.exports = Book;
