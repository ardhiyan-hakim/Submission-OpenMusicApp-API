const SongPayloadSchema = require('./schema');

const SongsValidator = {
  songValidatePayload: (payload) => {
    const validationResult = SongPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new Error(validationResult.error.message);
    }
  },
};

module.exports = SongsValidator;
