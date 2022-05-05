const { Pool } = require('pg');

class PlaylistSongsService {
  constructor() {
    this._pool = new Pool();
  }

  async getPlaylist(playlistId) {
    const queryPlaylist = {
      text: 'SELECT playlists.id, playlists.name FROM playlists WHERE playlists.id = $1',
      values: [playlistId],
    };

    const result = await this._pool.query(queryPlaylist);

    const querySong = {
      text: 'SELECT songs.id, songs.title, songs.performer FROM songs LEFT JOIN playlist_songs ON songs.id = playlist_songs.songid WHERE playlist_songs.playlistid = $1 ',
      values: [playlistId],
    };

    const songs = await this._pool.query(querySong);

    result.rows[0].songs = songs;
    return result.rows;
  }
}

module.exports = PlaylistSongsService;
