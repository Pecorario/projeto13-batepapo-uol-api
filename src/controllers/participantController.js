import dayjs from 'dayjs';
import { db } from '../app.js';

import participantSchema from '../models/participantSchema.js';

const create = async (req, res) => {
  try {
    const validation = participantSchema.validate(req.body, {
      abortEarly: true
    });
    const participant = await db
      .collection('participants')
      .findOne({ name: req.body.name });

    if (validation.error) {
      return res.sendStatus(422);
    }

    if (participant) {
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
};

const list = async (req, res) => {
  try {
    const data = await db.collection('participants').find().toArray();

    return res.send(data);
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

export default {
  create,
  list
};
