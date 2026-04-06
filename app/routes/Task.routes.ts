import { Router } from 'express';
import { fetchTask, submitResult } from '../controllers/Task.controller';

const router = Router();

router.get('/fetch', fetchTask);
router.post('/submit', submitResult);

export default router;
