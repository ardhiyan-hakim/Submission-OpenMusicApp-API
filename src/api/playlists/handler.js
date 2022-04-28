const ClientError = require('../../exceptions/ClientError');

class PlaylistsHandler {
  constructor(playlistsService, songsService, validator) {
    this._playlistsService = playlistsService;
    this._songsService = songsService;
    this._validator = validator;
  }

  async postPlaylistHandler(request, h) {
    try {
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
      const { id } = request.params;
      const { id: credentialId } = request.auth.credentials;

      await this._playlistsService.verifyPlaylistOwner({ id, credentialId });
      await this._playlistsService.deletePlaylistById(id);

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
      const { songId } = request.payload;
      const { id: playlistId } = request.params;

      this._validator.validatePostSongToPlaylistPayload({ playlistId, songId });
      const { id: credentialId } = request.auth.credentials;

      await this._playlistsService.verifyAccessPlaylist(playlistId, credentialId);
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

      await this._playlistsService.verifyAccessPlaylist(playlistId, credentialId);
      const playlist = await this._playlistsService.getPlaylistsById(playlistId);
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
      await this._playlistsService.deleteSongFromPlaylistById(playlistId);

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
