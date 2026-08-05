import express from 'express';
import { summarize } from '../controllers/text-summary.controller.js';

const router = express.Router();

router.post('/', summarize);

export default router;