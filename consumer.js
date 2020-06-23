require('dotenv').config();
const amqp = require('amqplib');
const queueName = process.env.QUEUE_NAME;
const host = process.env.AMQP_HOST;

(async () => {
  try {
    const conn = await amqp.connect(host);
    const ch = await conn.createChannel();
    await ch.assertQueue(queueName, { durable: false });

    // Subscribe
    await ch.consume(queueName, msg => {
      if (msg !== null) {
        console.log(msg.content.toString());
        ch.ack(msg);
      }
    });
  } catch (error) {
    console.error(error);
  }
})();
