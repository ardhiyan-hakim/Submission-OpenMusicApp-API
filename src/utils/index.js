const mapDBToShortModel = ({
  id, title, performer,
}) => ({
  id, title, performer,
});

const mapDBToModel = ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  albumid,
}) => ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  albumId: albumid,
});

const mapDBAlbumsModel = ({
  id,
  name,
  year,
  cover: coverUrl,
}) => ({
  id,
  name,
  year,
  coverUrl,
});

module.exports = { mapDBToModel, mapDBToShortModel, mapDBAlbumsModel };
