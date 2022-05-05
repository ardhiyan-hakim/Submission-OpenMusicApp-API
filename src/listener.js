// BUTUH PENYESUAIAN
class Listener {
  constructor(PlaylistSongsService, mailSender) {
    this._PlaylistSongsService = PlaylistSongsService;
    this._mailSender = mailSender;
  }

  async listen(message) {
    try {
      const { userId, targetEmail } = JSON.parse(message.content.toString());

      const notes = await this._notesService.getNotes(userId);
      const result = await this._mailSender.sendEmail(targetEmail, JSON.stringify(notes));
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = Listener;
