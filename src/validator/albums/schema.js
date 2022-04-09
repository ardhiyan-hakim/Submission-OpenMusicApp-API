const Joi = require('joi');

const AlbumPayloadSchema = Joi.object({
  name: Joi.string().required(),
  year: Joi.string().reqruied(),
});

module.exports = { AlbumPayloadSchema };
