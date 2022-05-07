const ClientError = require('../../exceptions/ClientError');

class UserAlbumLikesHandler {
  constructor(userAlbumLikesService, albumsService) {
    this._userAlbumLikesService = userAlbumLikesService;
    this._albumsService = albumsService;

    this.postUserAlbumLikesHandler = this.postUserAlbumLikesHandler.bind(this);
    this.getUserAlbumLikesByAlbumIdHandler = this.getUserAlbumLikesByAlbumIdHandler.bind(this);
  }

  async postUserAlbumLikesHandler(request, h) {
    try {
      const { id: albumId } = request.params;
      const { id: credentialId } = request.auth.credentials;

      await this._albumsService.verifyExistingAlbum(albumId);

      const isLiked = await this._userAlbumLikesService.verifyUserAlbumLikes(credentialId, albumId);

      if (!isLiked) {
        await this._userAlbumLikesService.addUserAlbumLikes(credentialId, albumId);

        return h.response({
          status: 'success',
          message: 'Berhasil memberikan like pada Album',
        }).code(201);
      }

      await this._userAlbumLikesService.deleteUserAlbumLikes(credentialId, albumId);

      return h.response({
        status: 'success',
        message: 'Berhasil menghapus like pada Album',
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

  async getUserAlbumLikesByAlbumIdHandler(request, h) {
    try {
      const { id } = request.params;
      const { number, source } = await this._userAlbumLikesService.getUserAlbumLikesByAlbumId(id);

      return h.response({
        status: 'success',
        data: {
          likes: number,
        },
      }).header('X-Data-Source', source);
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
module.exports = UserAlbumLikesHandler;
