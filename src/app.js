import express from 'express';
import cors from 'cors';
import chatRouter from './routes/chat.route.js';
import textGameRouter from './routes/text-game.route.js';
import textSummaryRouter from './routes/text-summary.route.js';
import pageRoutes from './routes/pages.route.js';


const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.use('/', pageRoutes);
app.use('/api/chat', chatRouter);
app.use('/api/text-summary', textSummaryRouter);

export default app;