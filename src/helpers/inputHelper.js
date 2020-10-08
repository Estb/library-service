const Joi = require('@hapi/joi');

const newBookSchema = Joi.object({
  active: Joi.boolean(),
  ISBN: Joi.string().required(),
  title: Joi.string().min(3).max(60).required(),
  author: Joi.string().min(3).max(60).required(),
  category: Joi.string().min(3).max(60).required(),
  details: {
    description: Joi.string().min(3).max(60),
    numberOfPages: Joi.number(),
    comments: Joi.string().min(3).max(60),
  },
});

const editBookSchema = Joi.object({
  active: Joi.boolean(),
  ISBN: Joi.string(),
  title: Joi.string().min(3).max(60),
  author: Joi.string().min(3).max(60),
  category: Joi.string().min(3).max(60),
  details: {
    description: Joi.string().min(3).max(60),
    numberOfPages: Joi.number(),
    comments: Joi.string().min(3).max(60),
  },
}).min(1);

const querySchema = Joi.object({
  rented: Joi.boolean(),
  ISBN: Joi.string(),
  name: Joi.string(),
  title: Joi.string(),
  author: Joi.string(),
  category: Joi.string(),
});

module.exports = {newBookSchema, editBookSchema, querySchema};
