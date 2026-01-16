const amqp = require("amqplib");
const config = require("../config/config.js");

let channel;
let rabbitConnection;

async function connectRabbitMQ() {
  rabbitConnection = await amqp.connect(config.RABBITMQ_URI);
  channel = await rabbitConnection.createChannel();
  console.log("RabbitMQ Connected Successfully");
}

async function publishToQueue(queueName, data) {
  await channel.assertQueue(queueName, { durable: true });
  channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data))); // ✅ fixed
  console.log("Message sent to queue:", queueName);
}

module.exports = { connectRabbitMQ, publishToQueue };
