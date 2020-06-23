require('dotenv').config();
const amqp = require('amqplib');
const queueName = process.env.QUEUE_NAME;
const host = process.env.AMQP_HOST;

(async () => {
  try {
    const conn = await amqp.connect(host);
    const ch = await conn.createChannel();
    const msg = 'ping ' + new Date().getTime();
    await ch.assertQueue(queueName, { durable: false });
    
    // Publish
    await ch.sendToQueue(queueName, Buffer.from(msg, 'utf8'));
    console.log('[x] Sent %s', msg);

    await ch.close();
    await conn.close();
  } catch (error) {
    console.error(error);
  }
})();
