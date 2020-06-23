# exp-rabbitmq-nodejs

Run a local Docker container:

```
docker run -it --rm --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management
```
Port explanation:

`5672` used by AMQP 0-9-1 protocol and 1.0 clients without and with TLS  
`15672` used by HTTP API clients, management UI and rabbitmqadmin (only if the management plugin is enabled)

* Queues store messages to be consumed.
* Messages are sent into *Exchanges*, which take a message and route it into zero or more queues.
* Bindings connect exchanges to queues.

Install
```bash
yarn
```
Run in different terminals:
```bash
node consumer.js

/usr/bin/watch -n1 node producer.js
```

