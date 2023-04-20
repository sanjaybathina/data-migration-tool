const { Kafka } = require("kafkajs");
const { migrate } = require("./controllers/migrate");

const kafka = new Kafka({
  clientId: "my-app",
  brokers: ["127.0.0.1:29092"],
  
});

const consumer = kafka.consumer({ groupId: "migrations" });
(async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: "migrations", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      migrate(message.value.toString())
    },
  });
})();
