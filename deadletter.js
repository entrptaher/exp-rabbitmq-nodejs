//
// Example:
// Retry failed task in 3 seconds
//
const amqp = require('amqplib');
const debug = require('debug');
const host = 'amqp://localhost';
const debugPro = debug('producer');
const debugCon = debug('consumer');

// CONSUMER
(async () => {
  try {
    debugCon('Started');

    const connection = await amqp.connect(host);
    const channel = await connection.createChannel();

    await channel.deleteQueue('WorkQueue');
    await channel.assertExchange('WorkExchange', 'direct');
    await channel.assertQueue('WorkQueue', {
      autoDelete: false,
      durable: true,
      arguments: {
        'x-dead-letter-exchange': 'DeadExchange', // <-- failed messages will be put there
        'x-dead-letter-routing-key': 'rk2', // <-- 
        'x-message-ttl': 6000,
        'x-expires': 10000
      }  
    });
    await channel.bindQueue('WorkQueue', 'WorkExchange', 'rk1');

    await channel.consume('WorkQueue', async(msg) => {
      debugCon('Received message.');
      debugCon(msg.content.toString());
      channel.nack(msg, false, false);
      // channel.ack(msg);
      // process.exit();
    });

  } catch (error) {
    debugCon(error);
  }
})();

// PRODUCER
(async () => {
  try {
    debugPro('Started');

    const connection = await amqp.connect(host);
    const channel = await connection.createChannel();

    await channel.deleteQueue('DEQ');
    await channel.assertExchange('DeadExchange', 'direct');
    await channel.assertQueue('DEQ', {
        arguments: {
          'x-dead-letter-exchange': 'WorkExchange', // <--
          'x-dead-letter-routing-key': 'rk1', // <--
          'x-message-ttl': 3000,
        }
      });
    await channel.bindQueue('DEQ', 'DeadExchange', 'rk2');

    debugPro('Sending message');
    await channel.publish('WorkExchange', 'rk1', new Buffer.from("Over the Hills and Far Away!"));
    debugPro('Sent');
  } catch (error) {
    console.log(error);
  }
})();
