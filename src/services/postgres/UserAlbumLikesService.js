const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');

class UserAlbumLikesService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async addUserAlbumLikes(userId, albumId) {
    const id = `userAlbumLikes-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO user_album_likes VALUES ($1, $2, $3) RETURNING id',
      values: [id, userId, albumId],
    };

    const { rows } = await this._pool.query(query);

    if (!rows[0].id) {
      throw new InvariantError('Gagal memberikan likes pada album');
    }

    await this._cacheService.delete(`user_album_likes:${albumId}`);

    return rows[0].id;
  }

  async getUserAlbumLikesByAlbumId(albumId) {
    try {
      const result = await this._cacheService.get(`user_album_likes: ${albumId}`);

      return {
        number: JSON.parse(result),
        source: 'cache',
      };
    } catch (error) {
      const query = {
        text: 'SELECT id FROM user_album_likes WHERE albumid = $1',
        values: [albumId],
      };

      const result = await this._pool.query(query);

      await this._cacheService.set(`user_album_likes: ${albumId}`, JSON.stringify(result.rowCount));

      return {
        number: result.rowCount,
        source: 'db',
      };
    }
  }

  async deleteUserAlbumLikes(userId, albumId) {
    const query = {
      text: 'DELETE FROM user_album_likes WHERE userid = $1 AND albumid = $2 RETURNING id',
      values: [userId, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Gagal membatalkan album yang disukai. Id tidak ditemukan');
    }

    await this._cacheService.delete(`user_album_likes:${albumId}`);
  }

  async verifyUserAlbumLikes(userId, albumId) {
    const query = {
      text: 'SELECT id FROM user_album_likes WHERE userid = $1 AND albumid = $2',
      values: [userId, albumId],
    };

    const result = await this._pool.query(query);

    return result.rowCount;
  }
}

module.exports = UserAlbumLikesService;
