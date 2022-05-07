class UserAlbumLikesHandler {
  constructor(userAlbumLikesService, albumsService) {
    this._userAlbumLikesService = userAlbumLikesService;
    this._albumsService = albumsService;
  }

  async postUserAlbumLikesHandler(request, h) {
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
  }

  async getUserAlbumLikesByAlbumIdHandler(request, h) {
    const { id } = request.params;
    const { number, source } = await this._userAlbumLikesService.getUserAlbumLikesByAlbumId(id);

    return h.response({
      status: 'success',
      data: {
        likes: number,
      },
    }).header('X-Data-Source', source);
  }
}
module.exports = UserAlbumLikesHandler;
