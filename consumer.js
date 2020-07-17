require('dotenv').config();
const amqp = require('amqplib');
const queueName = process.env.QUEUE_NAME;
const host = process.env.AMQP_HOST;

(async () => {
  try {
    console.log('connecting');
    const conn = await amqp.connect(host);
    console.log('connected');

    console.log('create channel');
    const ch = await conn.createChannel();
    await ch.assertQueue(queueName, { durable: false });
    console.log('created channel');

    // Subscribe
    await ch.consume(queueName, (msg) => {
      if (msg !== null) {
        console.log(msg.content.toString());
        ch.ack(msg);
      }
    });
  } catch (error) {
    console.error(error);
  }
})();
