const { Pool } = require('pg');

class PlaylistSongsService {
  constructor() {
    this._pool = new Pool();
  }

  async getPlaylist(playlistId) {
    const queryPlaylist = {
      text: 'SELECT playlists.id, playlists.name FROM playlists LEFT JOIN users ON playlists.owner = users.id WHERE playlists.id = $1',
      values: [playlistId],
    };

    const resultPlaylist = await this._pool.query(queryPlaylist);

    const querySong = {
      text: 'SELECT songs.id, songs.title, songs.performer FROM songs LEFT JOIN playlist_songs ON songs.id = playlist_songs.songid WHERE playlist_songs.playlistid = $1',
      values: [playlistId],
    };

    const resultSongs = await this._pool.query(querySong);

    const playlist = {
      ...resultPlaylist.rows[0],
      songs: { ...resultSongs.rows[0] },
    };

    console.log(playlist);
    return playlist;
  }
}

module.exports = PlaylistSongsService;
