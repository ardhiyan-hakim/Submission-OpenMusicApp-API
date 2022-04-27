const { Pool } = require('pg');
const { nanoid } = require('nanoid');

const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async addPlaylist({ name, credentialId: owner }) {
    const id = `playlist-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlists VALUES ($1, $2, $3) RETURNING id',
      values: [id, name, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Playlist Anda gagal ditambahkan.');
    }

    return result.rows[0].id;
  }

  async getPlaylists(owner) {
    const query = {
      text: 'SELECT playlists.id, playlists.name, users.username FROM playlists LEFT JOIN users ON playlists.owner = users.id WHERE users.id = $1',
      values: [owner],
    };

    const result = await this._pool.query(query);

    return result.rows[0];
  }

  async deletePlaylistById(id) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal menghapus Playlist. Id tidak ditemukan.');
    }
  }

  async addSongToPlaylist(playlistId, songId) {
    const id = `{playlistSongs-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO playlists_songs VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Gagal menambahkan lagu ke dalam Playlist');
    }

    return result.rows[0].id;
  }

  // Mendapatkan Data Playlist (berdasarkan Id)
  async getPlaylistById(playlistId) {
    const query = {
      text: 'SELECT playlists.id, playlists.name, users.username FROM playlists LEFT JOIN users ON playlists.owner = users.id WHERE playlists.id = $1',
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Playlist yang Anda cari tidak dapat ditemukan.');
    }

    return result.rows;
  }

  // Mendapatkan Data Songs pada Playlist tertentu (berdasarkan Id)
  async getSongsInPlaylist(playlistId) {
    const query = {
      text: 'SELECT songs.id, songs.title, songs.performer FROM songs LEFT JOIN playlists_songs ON songs.id = playlists_songs.songid WHERE playlists_songs.playlistid = $1',
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Tidak ada lagu pada playlist ini.');
    }

    return result.rows;
  }

  async deleteSongFromPlaylist(playlistId, songId) {
    const query = {
      text: 'DELETE FROM playlists_song WHERE playlistid = $1 AND songid = $2',
      values: [playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Lagu pada playlist Anda gagal dihapus. Id lagu tidak ditemukan.');
    }
  }
}

module.exports = PlaylistsService;
