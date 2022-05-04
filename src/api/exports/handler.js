const ClientError = require('../../exceptions/ClientError');

class ExportsHandler {
  constructor(ProducerService, playlistsService, ExportsValidator) {
    this._ProducerService = ProducerService;
    this._playlistsService = playlistsService;
    this._ExportsValidator = ExportsValidator;

    this.postToExportSongsHandler = this.postToExportSongsHandler.bind(this);
  }

  async postToExportSongsHandler(request, h) {
    try {
      this._ExportsValidator.validateExportSongsPayload(request.payload);

      const { playlistId } = request.params;
      const { id: credentialId } = request.auth.credentials;

      await this._playlistsService.verifyPlaylistOwner({ playlistId, credentialId });
      await this._playlistsService.getPlaylistById(playlistId);

      const message = {
        userId: request.auth.credentials.id,
        targetEmail: request.payload.targetEmail,
      };

      await this._ProducerService.sendMessage('export:songs', JSON.stringify(message));

      return h.response({
        status: 'success',
        message: 'Permintaan Anda sedang kami proses',
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
