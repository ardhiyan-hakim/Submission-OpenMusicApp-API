const ClientError = require('../../exceptions/ClientError');

class UploadsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postUploadImageHandler = this.postUploadImageHandler.bind(this);
  }

  async postUploadImageHandler(request, h) {
    try {
      const { cover: data } = request.payload;
      const { id: albumId } = request.params;

      this._validator.validateImageHeaders(data.hapi.headers);
      const filename = await this._service.writeFile(data, data.hapi);

      const cover = `http://${process.env.HOST}:${process.env.PORT}/upload/images/${filename}`;
      await this._service.insertCoverUrlToDatabase(albumId, cover);

      return h.response({
        status: 'success',
        message: 'Sampul berhasil diunggah',
      }).code(201);
    } catch (error) {
      if (error instanceof ClientError) {
        return h.response({
          status: 'fail',
          message: error.message,
        }).code(error.statusCode);
      }

      // SERVER ERROR
      console.error(error);
      return h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami',
      }).code(500);
    }
  }
}

module.exports = UploadsHandler;
