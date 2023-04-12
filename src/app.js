import { MongoClient } from 'mongodb';

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import joi from 'joi';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br.js';

const app = express();

app.use(cors());
app.use(express.json());
dotenv.config();

const mongoClient = new MongoClient(process.env.DATABASE_URL);
let db;
mongoClient
  .connect()
  .then(() => (db = mongoClient.db()))
  .catch(error => console.log(error.message));

const participantSchema = joi.object({
  name: joi.string().required()
});

const messageSchema = joi.object({
  to: joi.string().required(),
  text: joi.string().required(),
  type: joi.string().required()
});

app.post('/participants', async (req, res) => {
  try {
    const validation = participantSchema.validate(req.body, {
      abortEarly: true
    });
    const participants = await db.collection('participants').find().toArray();

    if (validation.error) {
      return res.sendStatus(422);
    }

    if (participants.find(participant => participant.name === req.body.name)) {
      return res.sendStatus(409);
    }

    await db
      .collection('participants')
      .insertOne({ name: req.body.name, lastStatus: Date.now() });

    await db.collection('messages').insertOne({
      from: req.body.name,
      to: 'Todos',
      text: 'entra na sala...',
      type: 'status',
      time: dayjs().format('HH:mm:ss')
    });
    return res.sendStatus(201);
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

app.get('/participants', async (req, res) => {
  try {
    const data = await db.collection('participants').find().toArray();

    return res.send(data);
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

app.get('/messages', async (req, res) => {
  try {
    const data = await db.collection('messages').find().toArray();

    return res.send(data);
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
