import express from 'express';
import cors from 'cors';
import chatRoutes from './routes/chat.route.js';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

app.use(express.static('public'));

app.use('/api/chat', chatRoutes);

app.get('/text-summary', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'text-summary.html'));
});

app.get('/rpg-game', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'text-game.html'));
});

app.get('/language-learning', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'language-learning.html'));
});


export default app;