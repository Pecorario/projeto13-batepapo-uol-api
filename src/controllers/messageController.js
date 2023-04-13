import dayjs from 'dayjs';
import { db } from '../app.js';

import messageSchema from '../models/messageSchema.js';

const create = async (req, res) => {
  try {
    const { user } = req.headers;

    const participant = await db
      .collection('participants')
      .findOne({ name: user });

    const validation = messageSchema.validate(req.body, {
      abortEarly: true
    });

    if (validation.error || !participant) {
      return res.sendStatus(422);
    }

    await db.collection('messages').insertOne({
      from: user,
      ...req.body,
      time: dayjs().format('HH:mm:ss')
    });
    return res.sendStatus(201);
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

const list = async (req, res) => {
  try {
    const { user } = req.headers;
    const { limit } = req.query;

    const data = await db
      .collection('messages')
      .find({
        $or: [
          { to: 'Todos' },
          { to: user },
          { from: user },
          { type: 'message' }
        ]
      })
      .toArray();

    if (limit && (isNaN(limit) || limit <= 0)) {
      return res.sendStatus(422);
    }

    if (limit) {
      return res.send(data.slice(-limit));
    }

    return res.send(data);
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

export default {
  create,
  list
};
