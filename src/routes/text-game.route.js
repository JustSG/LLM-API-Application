import express from 'express';
import { playTurn } from '../controllers/text-game.controller.js';

const router = express.Router();

router.post('/', playTurn);

export default router;