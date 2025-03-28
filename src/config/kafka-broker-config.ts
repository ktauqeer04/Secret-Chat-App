import { Kafka, Producer } from "kafkajs";
import prisma from "../db";

const kafka = new Kafka({
    brokers: ['192.168.0.102:9092']
});

let producer: null | Producer = null;

async function createProducer(){

  if(producer){
    return producer;
  }

  const _producer = kafka.producer();
  await _producer.connect();

  producer = _producer;
  return producer;

}

export async function messageConsumer() {

  console.log('message consumer started....');

  const consumer = kafka.consumer({ groupId: "default" });
  await consumer.connect();
  await consumer.subscribe({ topic: "MESSAGE", fromBeginning: true });

  await consumer.run({
    autoCommit: true,
    eachMessage: async ({ message, pause }) => {

      if(!message.value) return;

      console.log('message received');
      try {

        await prisma.message.create({
          data: {
            text: message.value?.toString()
          }
        });

      } catch (error) {

        console.error(error);

        pause();
        setTimeout(() => {
          consumer.resume([{topic: "MESSAGE"}]);
        }, 60000);

      }

    }
  })
}

export async function createMessage(message: string) {

  const producer = await createProducer();

  await producer.send({

    messages: [{
      key: `message-${Date.now()}`, 
      value: message
    }],
    topic: 'MESSAGE'

  });

  console.log(`message send to kafka broker ${message}`)

  return true;
}
