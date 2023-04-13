import express from 'express';
import participantController from '../controllers/participantController.js';

const router = express.Router();

router.post('/', participantController.create);
router.get('/', participantController.list);

export default router;
