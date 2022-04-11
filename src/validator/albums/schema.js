/* eslint-disable newline-per-chained-call */

const Joi = require('joi');

const currYear = new Date().getFullYear();

const AlbumPayloadSchema = Joi.object({
  name: Joi.string().required(),
  year: Joi.number().integer().min(1800).max(currYear).required(),
});

module.exports = { AlbumPayloadSchema };
