import { MongoClient } from 'mongodb';

import express from 'express';
import dayjs from 'dayjs';
import cors from 'cors';

import 'dotenv/config';
import 'dayjs/locale/pt-br.js';

import participantsRoutes from './routes/participantsRoutes.js';
import messagesRoutes from './routes/messagesRoutes.js';
import statusRoutes from './routes/statusRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

const mongoClient = new MongoClient(process.env.DATABASE_URL);

export let db;
mongoClient
  .connect()
  .then(() => (db = mongoClient.db()))
  .catch(error => console.log(error.message));

app.use('/participants', participantsRoutes);
app.use('/messages', messagesRoutes);
app.use('/status', statusRoutes);

setInterval(async () => {
  try {
    const inactive = Date.now() - 10000;

    const response = await db
      .collection('participants')
      .find({ lastStatus: { $lt: inactive } })
      .toArray();

    await db
      .collection('participants')
      .deleteMany({ lastStatus: { $lt: inactive } });

    await response.forEach(async item => {
      await db.collection('messages').insertOne({
        from: item.name,
        to: 'Todos',
        text: 'sai da sala...',
        type: 'status',
        time: dayjs().format('HH:mm:ss')
      });
    });
  } catch (error) {
    console.log(error);
  }
}, 15000);

const PORT = 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
