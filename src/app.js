import express from 'express';
import cors from 'cors';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const mongoClient = new MongoClient(process.env.DATABASE_URL);
// const db = mongoClient.db();
let db;
mongoClient
  .connect()
  .then(() => (db = mongoClient.db()))
  .catch(err => console.log(err.message));

app.post('/participants', async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || name.trim() === '') {
      return res.sendStatus(422);
    }

    await db.collection('participants').insertOne({ name });
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

const PORT = 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
