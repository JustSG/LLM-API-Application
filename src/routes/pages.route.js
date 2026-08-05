import express from 'express';
import { renderPage } from '../controllers/pages.controller.js';

const router = express.Router();

router.get('/', renderPage('chat'));
router.get('/text-summary', renderPage('text-summary'));
router.get('/text-game', renderPage('text-game'));
router.get('/language-learning', renderPage('language-learning'));

export default router;