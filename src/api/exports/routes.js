const routes = (handler) => [
  {
    method: 'POST',
    path: '/export/playlists/{playlistId}',
    handler: handler.postToExportSongsHandler,
    options: {
      auth: 'musicapp_jwt',
    },
  },
];

module.exports = routes;
