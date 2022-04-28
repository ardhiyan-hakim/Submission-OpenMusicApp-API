const ClientError = require('../../exceptions/ClientError');

class PlaylistsHandler {
  constructor(playlistsService, songsService, validator) {
    this._playlistsService = playlistsService;
    this._songsService = songsService;
    this._validator = validator;

    this.postPlaylistHandler = this.postPlaylistHandler.bind(this);
    this.getPlaylistsHandler = this.getPlaylistsHandler.bind(this);
    this.deletePlaylistByIdHandler = this.deletePlaylistByIdHandler.bind(this);
    this.postSongToPlaylistByIdHandler = this.postSongToPlaylistByIdHandler.bind(this);
    this.getSongsInPlaylistByIdHandler = this.getSongsInPlaylistByIdHandler.bind(this);
    this.deleteSongFromPlaylistByIdHandler = this.deleteSongFromPlaylistByIdHandler.bind(this);
  }

  async postPlaylistHandler(request, h) {
    try {
      this._validator.validatePostPlaylistPayload(request.payload);
      const { name } = request.payload;
      const { id: credentialId } = request.auth.credentials;
      const playlistId = await this._playlistsService.addPlaylist({ name, credentialId });

      return h.response({
        status: 'success',
        data: {
          playlistId,
        },
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

  async getPlaylistsHandler(request, h) {
    try {
      const { id: credentialId } = request.auth.credentials;
      const playlists = await this._playlistsService.getPlaylists(credentialId);

      return {
        status: 'success',
        data: {
          playlists,
        },
      };
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

  async deletePlaylistByIdHandler(request, h) {
    try {
      const { id: playlistId } = request.params;
      const { id: credentialId } = request.auth.credentials;

      await this._playlistsService.verifyPlaylistOwner({ playlistId, credentialId });
      await this._playlistsService.deletePlaylistById(playlistId);

      return {
        status: 'success',
        message: 'Playlist Anda berhasil dihapus',
      };
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

  async postSongToPlaylistByIdHandler(request, h) {
    try {
      const { id: playlistId } = request.params;
      const { songId } = request.payload;

      this._validator.validatePostSongToPlaylistPayload({ playlistId, songId });
      const { id: credentialId } = request.auth.credentials;

      await this._playlistsService.verifyPlaylistOwner({ playlistId, credentialId });
      await this._songsService.getSongById(songId);

      const SongId = await this._playlistsService.addSongToPlaylistById(playlistId, songId);

      return h.response({
        status: 'success',
        message: 'Lagu berhasil ditambahkan pada playlist Anda.',
        data: {
          SongId,
        },
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

  async getSongsInPlaylistByIdHandler(request, h) {
    try {
      const { id: playlistId } = request.params;
      const { id: credentialId } = request.auth.credentials;

      await this._playlistsService.verifyAccessPlaylist({ playlistId, credentialId });
      const playlist = await this._playlistsService.getPlaylistById(playlistId);
      const songs = await this._playlistsService.getSongsInPlaylistById(playlistId);

      playlist.songs = songs;
      return {
        status: 'success',
        data: {
          playlist,
        },
      };
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

  async deleteSongFromPlaylistByIdHandler(request, h) {
    try {
      const { id: playlistId } = request.params;
      const { songId } = request.payload;

      this._validator.validateDeleteSongFromPlaylistPayload({ playlistId, songId });
      const { id: credentialId } = request.auth.credentials;

      await this._playlistsService.verifyAccessPlaylist({ playlistId, credentialId });
      await this._playlistsService.deleteSongFromPlaylistById(playlistId, songId);

      return {
        status: 'success',
        message: 'Lagu pada playlist berhasil dihapus',
      };
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

module.exports = PlaylistsHandler;
