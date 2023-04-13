import { db } from '../app.js';

const create = async (req, res) => {
  try {
    const { user } = req.headers;

    const participant = await db
      .collection('participants')
      .findOne({ name: user });

    if (!user || !participant) {
      return res.sendStatus(404);
    }

    await db
      .collection('participants')
      .updateOne({ name: user }, { $set: { lastStatus: Date.now() } });

    return res.sendStatus(200);
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

export default { create };
