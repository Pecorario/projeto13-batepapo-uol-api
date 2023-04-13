import express from 'express';
import statusController from '../controllers/statusController.js';

const router = express.Router();

router.post('/', statusController.create);

export default router;
