import express from 'express';
import messageController from '../controllers/messageController.js';

const router = express.Router();

router.post('/', messageController.create);
router.get('/', messageController.list);

export default router;
