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

module.exports = { mapDBToModel, mapDBToShortModel };
