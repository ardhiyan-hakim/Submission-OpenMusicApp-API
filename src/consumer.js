require('dotenv').config();
const amqp = require('amqplib');
const PlaylistSongsService = require('./PlaylistSongsService');
const MailSender = require('./MailSender');
const Listener = require('./listener');

const init = async () => {
  const playlistSongsService = new PlaylistSongsService();
  const mailSender = new MailSender();

  const listener = new Listener(playlistSongsService, mailSender);

  const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
  const channel = await connection.createChannel();

  await channel.assertQueue('export:songs', {
    durable: true,
  });

  channel.consume('export:playlist', listener.listen, { noAck: true });
};

console.log('Pesan dalam pengiriman...');
init();
