const fs = require('fs');
const { Pool } = require('pg');

const InvariantError = require('../../exceptions/InvariantError');

class StorageService {
  constructor(folder) {
    this._pool = new Pool();
    this._folder = folder;

    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }
  }

  async insertCoverUrlToDatabase(albumId, cover) {
    const query = {
      text: 'UPDATE albums SET cover = $1 WHERE albums.id = $2 RETURNING id',
      values: [cover, albumId],
    };

    const result = await this._pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError('Sampul tidak berhasil diunggah');
    }

    return result.rows[0].id;
  }

  writeFile(file, meta) {
    const filename = +new Date() + meta.filename;
    const path = `${this._folder}/${filename}`;

    const fileStream = fs.createWriteStream(path);

    return new Promise((resolve, reject) => {
      fileStream.on('error', (error) => reject(error));
      file.pipe(fileStream);
      file.on('end', () => resolve(filename));
    });
  }
}

module.exports = StorageService;
