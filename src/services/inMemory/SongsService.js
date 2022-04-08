class SongsService {
  constructor() {
    this._songs = [];
  }

  addSong({
    title, year, genre, performer, duration, albumId,
  }) {}

  getSong() {}

  getSongById(id) {}

  editSongById(id, {
    title, year, genre, performer, duration, albumId,
  }) {}

  deleteSongById(id) {}
}

module.exports = SongsService;
