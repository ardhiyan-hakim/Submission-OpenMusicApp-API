class SongsHandler {
  constructor(service) {
    this._service = service;
  }

  postSongHandler(request, h) {
    try {
      const {
        title, year, performer, genre, duration, albumId,
      } = request.payload;

      const songId = this._service.addSong({
        title, year, performer, genre, duration, albumId,
      });
      return h.response({
        status: 'success',
        message: 'Lagu berhasil ditambahkan',
        data: {
          songId,
        },
      }).code(201);
    } catch (error) {
      return h.response({
        status: 'fail',
        message: error.message,
      }).code(400);
    }
  }

  getSongsHandler() {
    const songs = this._service.getSong();
    return {
      status: 'success',
      data: {
        songs,
      },
    };
  }

  getSongByIdHandler(request, h) {
    try {
      const { id } = request.params;
      const song = this._service.getSongById(id);
      return {
        status: 'success',
        data: {
          song,
        },
      };
    } catch (error) {
      return h.response({
        status: 'fail',
        message: error.message,
      }).code(404);
    }
  }

  putSongByIdHandler(request, h) {
    try {
      const { id } = request.params;

      this._service.editSongById(id, request.payload);
      return {
        status: 'success',
        message: 'Lagu berhasil diperbarui',
      };
    } catch (error) {
      return h.response({
        status: 'fail',
        message: error.message,
      }).code(404);
    }
  }

  deleteSongByIdHandler(request, h) {
    try {
      const { id } = request.params;

      this.service.deleteSongById(id);
      return {
        status: 'success',
        message: 'Lagu berhasil dihapus',
      };
    } catch (error) {
      return h.response({
        status: 'fail',
        message: error.message,
      }).code(404);
    }
  }
}

module.exports = SongsHandler;
