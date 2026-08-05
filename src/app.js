import express from 'express';
import cors from 'cors';
import chatRouter from './routes/chat.route.js';
import textGameRouter from './routes/text-game.route.js';
import textSummaryRouter from './routes/text-summary.route.js';
import languageLearningRouter from './routes/language-learning.route.js';
import pageRoutes from './routes/pages.route.js';


const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.use('/', pageRoutes);
app.use('/api/chat', chatRouter);
app.use('/api/text-game', textGameRouter);
app.use('/api/text-summary', textSummaryRouter);
app.use('/api/language-learning', languageLearningRouter);

export default app;