const ClientError = require('../../exceptions/ClientError');

class ExportsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postToExportSongsHandler = this.postToExportSongsHandler.bind(this);
  }

  async postToExportSongsHandler(request, h) {
    try {
      this._validator.validateExportSongsPayload(request.payload);

      const message = {
        userId: request.auth.credentials.id,
        targetEmail: request.payload.targetEmail,
      };
      console.log(message);

      await this._service.sendMessage('export:songs', JSON.stringify(message));

      return h.response({
        status: 'success',
        message: 'Permintaan Anda sedang diproses...',
      }).code(201);
    } catch (error) {
      if (error instanceof ClientError) {
        return h.response({
          status: 'fail',
          message: error.message,
        }).code(error.statusCode);
      }

      console.error(error);
      return h.response({
        status: 'error',
        message: 'Maaf, terdapat adanya kegagalan pada server kami.',
      }).code(500);
    }
  }
}

module.exports = ExportsHandler;
